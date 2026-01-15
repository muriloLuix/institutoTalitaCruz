<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\ProdutoImagem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ProdutoController extends Controller
{
   /**
    * Retorna a URL completa para um arquivo no storage
    * Usa APP_URL do .env ou a URL base da requisição atual
    */
   private function getStorageUrl(string $path): string
   {
      $appUrl = config('app.url');
      
      // Se não estiver configurado, tenta usar a URL base da requisição
      if (!$appUrl || $appUrl === 'http://localhost') {
         $appUrl = URL::to('/');
      }
      
      return rtrim($appUrl, '/') . '/storage/' . ltrim($path, '/');
   }

   /**
    * Lista todos os produtos (público)
    */
   public function index(Request $request): JsonResponse
   {
      $query = Produto::whereNull('pro_deleted_at');

      // Filtro por categoria
      if ($request->has('categoria') && $request->categoria && $request->categoria !== 'todos') {
         $query->where('pro_categoria', $request->categoria);
      }

      // Filtro por disponibilidade
      if ($request->has('disponivel')) {
         $query->where('pro_disponivel', filter_var($request->disponivel, FILTER_VALIDATE_BOOLEAN));
      }

      // Filtro por busca (nome, descrição, autor)
      if ($request->has('search') && $request->search) {
         $search = $request->search;
         $query->where(function ($q) use ($search) {
            $q->where('pro_nome', 'like', "%{$search}%")
               ->orWhere('pro_descricao', 'like', "%{$search}%")
               ->orWhere('pro_autor', 'like', "%{$search}%");
         });
      }

      // Filtro por preço mínimo
      if ($request->has('preco_min')) {
         $query->where('pro_preco', '>=', $request->preco_min);
      }

      // Filtro por preço máximo
      if ($request->has('preco_max')) {
         $query->where('pro_preco', '<=', $request->preco_max);
      }

      // Filtro por autor
      if ($request->has('autor') && $request->autor) {
         $query->where('pro_autor', $request->autor);
      }

      // Filtro por destaque
      if ($request->has('destaque')) {
         $query->where('pro_destaque', filter_var($request->destaque, FILTER_VALIDATE_BOOLEAN));
      }

      // Ordenação
      $orderBy = $request->get('order_by', 'pro_ordem');
      $orderDir = $request->get('order_dir', 'asc');
      $query->orderBy($orderBy, $orderDir);

      $produtos = $query->with('imagens')->get()->map(function ($produto) {
         return $this->formatarProduto($produto, false);
      });

      return response()->json($produtos, 200);
   }

   /**
    * Busca um produto específico (público)
    */
   public function show(int $id): JsonResponse
   {
      $produto = Produto::whereNull('pro_deleted_at')->find($id);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      // Incrementa visualizações
      $produto->incrementarVisualizacoes();

      $produto->load('imagens');
      return response()->json($this->formatarProduto($produto, true), 200);
   }

   /**
    * Lista todos os produtos (admin) - com soft deleted
    */
   public function indexAdmin(Request $request): JsonResponse
   {
      $query = Produto::withTrashed()->orderBy('pro_created_at', 'desc');

      // Filtro por busca
      if ($request->has('search') && $request->search) {
         $search = $request->search;
         $query->where(function ($q) use ($search) {
            $q->where('pro_nome', 'like', "%{$search}%")
               ->orWhere('pro_descricao', 'like', "%{$search}%")
               ->orWhere('pro_autor', 'like', "%{$search}%");
         });
      }

      // Filtro por categoria
      if ($request->has('categoria') && $request->categoria && $request->categoria !== 'todos') {
         $query->where('pro_categoria', $request->categoria);
      }

      // Filtro por disponibilidade
      if ($request->has('disponivel')) {
         $query->where('pro_disponivel', filter_var($request->disponivel, FILTER_VALIDATE_BOOLEAN));
      }

      $produtos = $query->with('imagens')->get()->map(function ($produto) {
         return $this->formatarProdutoAdmin($produto);
      });

      return response()->json($produtos, 200);
   }

   /**
    * Busca um produto específico (admin)
    */
   public function showAdmin(int $id): JsonResponse
   {
      $produto = Produto::withTrashed()->find($id);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $produto->load('imagens');
      return response()->json($this->formatarProdutoAdmin($produto), 200);
   }

   /**
    * Cria um novo produto (admin)
    */
   public function store(Request $request): JsonResponse
   {
      $request->validate([
         'nome' => 'required|string|max:255',
         'descricao' => 'required|string|max:1000',
         'descricaoCompleta' => 'nullable|string',
         'preco' => 'required|numeric|min:0',
         'imagem' => 'nullable|string|max:500',
         'categoria' => 'required|in:livros,mentorias,cursos,materiais',
         'autor' => 'nullable|string|max:255',
         'disponivel' => 'boolean',
         'estoque' => 'nullable|integer|min:0',
         'caracteristicas' => 'nullable',
         'conteudo' => 'nullable|string',
         'duracao' => 'nullable|string|max:100',
         'nivel' => 'nullable|in:iniciante,intermediario,avancado',
         'destaque' => 'boolean',
         'ordem' => 'nullable|integer|min:0',
         'checkoutHotmart' => 'required|url|max:500',
      ], [
         'nome.required' => 'O nome é obrigatório.',
         'descricao.required' => 'A descrição é obrigatória.',
         'preco.required' => 'O preço é obrigatório.',
         'preco.numeric' => 'O preço deve ser um número.',
         'preco.min' => 'O preço não pode ser negativo.',
         'categoria.required' => 'A categoria é obrigatória.',
         'categoria.in' => 'A categoria deve ser: livros, mentorias, cursos ou materiais.',
         'checkoutHotmart.required' => 'O link de pagamento Hotmart é obrigatório.',
         'checkoutHotmart.url' => 'O link de pagamento Hotmart deve ser uma URL válida.',
      ]);

      $produto = Produto::create([
         'pro_nome' => $request->nome,
         'pro_descricao' => $request->descricao,
         'pro_descricao_completa' => $request->descricaoCompleta,
         'pro_preco' => $request->preco,
         'pro_imagem' => null, // Removido, agora usa imagens relacionadas
         'pro_categoria' => $request->categoria,
         'pro_autor' => $request->autor,
         'pro_disponivel' => $request->disponivel ?? true,
         'pro_estoque' => $request->estoque ?? 0,
         'pro_caracteristicas' => (!empty($request->caracteristicas) && (is_array($request->caracteristicas) || is_object($request->caracteristicas))) ? json_encode((array)$request->caracteristicas) : null,
         'pro_conteudo' => $request->conteudo,
         'pro_duracao' => $request->duracao,
         'pro_nivel' => $request->nivel,
         'pro_destaque' => $request->destaque ?? false,
         'pro_ordem' => $request->ordem ?? 0,
         'pro_checkout_hotmart' => $request->checkoutHotmart,
      ]);

      $produto->load('imagens');
      return response()->json([
         'message' => 'Produto criado com sucesso',
         'produto' => $this->formatarProdutoAdmin($produto),
      ], 201);
   }

   /**
    * Atualiza um produto (admin)
    */
   public function update(Request $request, int $id): JsonResponse
   {
      $produto = Produto::withTrashed()->find($id);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $request->validate([
         'nome' => 'required|string|max:255',
         'descricao' => 'required|string|max:1000',
         'descricaoCompleta' => 'nullable|string',
         'preco' => 'required|numeric|min:0',
         'imagem' => 'nullable|string|max:500',
         'categoria' => 'required|in:livros,mentorias,cursos,materiais',
         'autor' => 'nullable|string|max:255',
         'disponivel' => 'boolean',
         'estoque' => 'nullable|integer|min:0',
         'caracteristicas' => 'nullable',
         'conteudo' => 'nullable|string',
         'duracao' => 'nullable|string|max:100',
         'nivel' => 'nullable|in:iniciante,intermediario,avancado',
         'destaque' => 'boolean',
         'ordem' => 'nullable|integer|min:0',
         'checkoutHotmart' => 'required|url|max:500',
      ], [
         'nome.required' => 'O nome é obrigatório.',
         'descricao.required' => 'A descrição é obrigatória.',
         'preco.required' => 'O preço é obrigatório.',
         'preco.numeric' => 'O preço deve ser um número.',
         'preco.min' => 'O preço não pode ser negativo.',
         'categoria.required' => 'A categoria é obrigatória.',
         'categoria.in' => 'A categoria deve ser: livros, mentorias, cursos ou materiais.',
         'checkoutHotmart.required' => 'O link de pagamento Hotmart é obrigatório.',
         'checkoutHotmart.url' => 'O link de pagamento Hotmart deve ser uma URL válida.',
      ]);

      $produto->pro_nome = $request->nome;
      $produto->pro_descricao = $request->descricao;
      $produto->pro_descricao_completa = $request->descricaoCompleta;
      $produto->pro_preco = $request->preco;
      $produto->pro_categoria = $request->categoria;
      $produto->pro_autor = $request->autor;
      $produto->pro_disponivel = $request->disponivel ?? true;
      $produto->pro_estoque = $request->estoque ?? 0;
      $produto->pro_caracteristicas = (!empty($request->caracteristicas) && (is_array($request->caracteristicas) || is_object($request->caracteristicas))) ? json_encode((array)$request->caracteristicas) : null;
      $produto->pro_conteudo = $request->conteudo;
      $produto->pro_duracao = $request->duracao;
      $produto->pro_nivel = $request->nivel;
      $produto->pro_destaque = $request->destaque ?? false;
      $produto->pro_ordem = $request->ordem ?? 0;
      $produto->pro_checkout_hotmart = $request->checkoutHotmart;

      $produto->save();

      $produto->load('imagens');
      return response()->json([
         'message' => 'Produto atualizado com sucesso',
         'produto' => $this->formatarProdutoAdmin($produto),
      ], 200);
   }

   /**
    * Remove um produto (soft delete) (admin)
    */
   public function destroy(int $id): JsonResponse
   {
      $produto = Produto::find($id);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $produto->delete(); // Soft delete

      return response()->json([
         'message' => 'Produto excluído com sucesso',
      ], 200);
   }

   /**
    * Restaura um produto excluído (admin)
    */
   public function restore(int $id): JsonResponse
   {
      $produto = Produto::withTrashed()->find($id);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      if (!$produto->trashed()) {
         return response()->json(['message' => 'Produto não está excluído'], 400);
      }

      $produto->restore();

      return response()->json([
         'message' => 'Produto restaurado com sucesso',
      ], 200);
   }

   /**
    * Formata produto para resposta pública
    */
   private function formatarProduto(Produto $produto, bool $completo = false): array
   {
      // Buscar imagens
      $imagens = $produto->imagens->map(function ($imagem) {
         return [
            'id' => $imagem->pim_id,
            'url' => $this->getStorageUrl($imagem->pim_caminho),
            'capa' => $imagem->pim_capa,
            'ordem' => $imagem->pim_ordem,
         ];
      })->toArray();

      // Imagem de capa (para compatibilidade)
      $imagemCapa = $produto->imagens->where('pim_capa', true)->first();
      $imagemCapaUrl = $imagemCapa ? $this->getStorageUrl($imagemCapa->pim_caminho) : ($imagens[0]['url'] ?? null);

      $data = [
         'id' => $produto->pro_id,
         'nome' => $produto->pro_nome,
         'descricao' => $produto->pro_descricao,
         'preco' => (float) $produto->pro_preco,
         'imagem' => $imagemCapaUrl, // Para compatibilidade com código existente
         'imagens' => $imagens,
         'categoria' => $produto->pro_categoria,
         'autor' => $produto->pro_autor,
         'disponivel' => $produto->pro_disponivel,
         'avaliacaoMedia' => $produto->pro_avaliacao_media ? (float) $produto->pro_avaliacao_media : null,
         'numeroAvaliacoes' => $produto->pro_numero_avaliacoes,
         'visualizacoes' => $produto->pro_visualizacoes,
         'destaque' => $produto->pro_destaque,
      ];

      if ($completo) {
         $data['descricaoCompleta'] = $produto->pro_descricao_completa;
         $data['estoque'] = $produto->pro_estoque;
         $data['caracteristicas'] = $produto->pro_caracteristicas;
         $data['conteudo'] = $produto->pro_conteudo;
         $data['duracao'] = $produto->pro_duracao;
         $data['nivel'] = $produto->pro_nivel;
         $data['vendas'] = $produto->pro_vendas;
      }

      return $data;
   }

   /**
    * Formata produto para resposta admin
    */
   private function formatarProdutoAdmin(Produto $produto): array
   {
      // Buscar imagens
      $imagens = $produto->imagens->map(function ($imagem) {
         return [
            'id' => $imagem->pim_id,
            'nomeArquivo' => $imagem->pim_nome_arquivo,
            'caminho' => $imagem->pim_caminho,
            'url' => $this->getStorageUrl($imagem->pim_caminho),
            'ordem' => $imagem->pim_ordem,
            'capa' => $imagem->pim_capa,
         ];
      })->toArray();

      // Imagem de capa (para compatibilidade)
      $imagemCapa = $produto->imagens->where('pim_capa', true)->first();
      $imagemCapaUrl = $imagemCapa ? $this->getStorageUrl($imagemCapa->pim_caminho) : null;

      return [
         'id' => $produto->pro_id,
         'nome' => $produto->pro_nome,
         'descricao' => $produto->pro_descricao,
         'descricaoCompleta' => $produto->pro_descricao_completa,
         'preco' => (float) $produto->pro_preco,
         'imagem' => $imagemCapaUrl, // Para compatibilidade
         'imagens' => $imagens,
         'categoria' => $produto->pro_categoria,
         'autor' => $produto->pro_autor,
         'disponivel' => $produto->pro_disponivel,
         'estoque' => $produto->pro_estoque,
         'visualizacoes' => $produto->pro_visualizacoes,
         'vendas' => $produto->pro_vendas,
         'avaliacaoMedia' => $produto->pro_avaliacao_media ? (float) $produto->pro_avaliacao_media : null,
         'numeroAvaliacoes' => $produto->pro_numero_avaliacoes,
         'caracteristicas' => $produto->pro_caracteristicas,
         'conteudo' => $produto->pro_conteudo,
         'duracao' => $produto->pro_duracao,
         'nivel' => $produto->pro_nivel,
         'destaque' => $produto->pro_destaque,
         'ordem' => $produto->pro_ordem,
         'checkoutHotmart' => $produto->pro_checkout_hotmart,
         'criadoEm' => $produto->pro_created_at ? $produto->pro_created_at->toIso8601String() : null,
         'atualizadoEm' => $produto->pro_updated_at ? $produto->pro_updated_at->toIso8601String() : null,
         'deletadoEm' => $produto->pro_deleted_at ? $produto->pro_deleted_at->toIso8601String() : null,
         'deletado' => $produto->trashed(),
      ];
   }
}
