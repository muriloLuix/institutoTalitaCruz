<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\ProdutoImagem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class ProdutoImagemController extends Controller
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
    * Upload de imagens para um produto (admin)
    */
   public function upload(Request $request, int $produtoId): JsonResponse
   {
      $produto = Produto::withTrashed()->find($produtoId);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $request->validate([
         'imagens' => 'required|array|min:1|max:10',
         'imagens.*' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
      ], [
         'imagens.required' => 'É necessário enviar pelo menos uma imagem.',
         'imagens.array' => 'As imagens devem ser enviadas como array.',
         'imagens.min' => 'É necessário enviar pelo menos uma imagem.',
         'imagens.max' => 'Você pode enviar no máximo 10 imagens por vez.',
         'imagens.*.image' => 'O arquivo deve ser uma imagem.',
         'imagens.*.mimes' => 'A imagem deve ser do tipo: jpeg, jpg, png ou webp.',
         'imagens.*.max' => 'Cada imagem não pode ter mais de 5MB.',
      ]);

      $imagensSalvas = [];
      $pastaProduto = "produtos/{$produtoId}";

      // Criar pasta do produto se não existir
      if (!Storage::disk('public')->exists($pastaProduto)) {
         Storage::disk('public')->makeDirectory($pastaProduto);
      }

      foreach ($request->file('imagens') as $index => $imagem) {
         // Gerar nome único para o arquivo
         $nomeOriginal = $imagem->getClientOriginalName();
         $extensao = $imagem->getClientOriginalExtension();
         $nomeArquivo = Str::slug(pathinfo($nomeOriginal, PATHINFO_FILENAME)) . '_' . time() . '_' . $index . '.' . $extensao;
         
         // Caminho relativo (produtos/{id}/imagem.jpg)
         $caminhoRelativo = "{$pastaProduto}/{$nomeArquivo}";
         
         // Salvar arquivo
         $caminhoCompleto = $imagem->storeAs($pastaProduto, $nomeArquivo, 'public');

         // Verificar se já existe uma imagem de capa
         $temCapa = ProdutoImagem::where('pim_produto_id', $produtoId)
                                 ->where('pim_capa', true)
                                 ->exists();

         // Criar registro no banco
         $produtoImagem = ProdutoImagem::create([
            'pim_produto_id' => $produtoId,
            'pim_nome_arquivo' => $nomeOriginal,
            'pim_caminho' => $caminhoRelativo,
            'pim_ordem' => ProdutoImagem::where('pim_produto_id', $produtoId)->max('pim_ordem') + 1,
            'pim_capa' => !$temCapa && $index === 0, // Primeira imagem é capa se não houver capa
         ]);

         $imagensSalvas[] = [
            'id' => $produtoImagem->pim_id,
            'nomeArquivo' => $produtoImagem->pim_nome_arquivo,
            'caminho' => $produtoImagem->pim_caminho,
            'url' => $this->getStorageUrl($produtoImagem->pim_caminho),
            'ordem' => $produtoImagem->pim_ordem,
            'capa' => $produtoImagem->pim_capa,
         ];
      }

      return response()->json([
         'message' => count($imagensSalvas) . ' imagem(ns) enviada(s) com sucesso',
         'imagens' => $imagensSalvas,
      ], 201);
   }

   /**
    * Define uma imagem como capa (admin)
    */
   public function definirCapa(int $produtoId, int $imagemId): JsonResponse
   {
      $produto = Produto::withTrashed()->find($produtoId);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $imagem = ProdutoImagem::where('pim_produto_id', $produtoId)
                             ->where('pim_id', $imagemId)
                             ->first();

      if (!$imagem) {
         return response()->json(['message' => 'Imagem não encontrada'], 404);
      }

      // Remover capa anterior
      ProdutoImagem::where('pim_produto_id', $produtoId)
                   ->where('pim_id', '!=', $imagemId)
                   ->update(['pim_capa' => false]);

      // Definir nova capa
      $imagem->pim_capa = true;
      $imagem->save();

      return response()->json([
         'message' => 'Imagem definida como capa com sucesso',
         'imagem' => [
            'id' => $imagem->pim_id,
            'capa' => true,
         ],
      ], 200);
   }

   /**
    * Reordena as imagens (admin)
    */
   public function reordenar(Request $request, int $produtoId): JsonResponse
   {
      $produto = Produto::withTrashed()->find($produtoId);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $request->validate([
         'imagens' => 'required|array',
         'imagens.*.id' => 'required|integer|exists:produto_imagem,pim_id',
         'imagens.*.ordem' => 'required|integer|min:0',
      ]);

      foreach ($request->imagens as $item) {
         ProdutoImagem::where('pim_id', $item['id'])
                     ->where('pim_produto_id', $produtoId)
                     ->update(['pim_ordem' => $item['ordem']]);
      }

      return response()->json([
         'message' => 'Ordem das imagens atualizada com sucesso',
      ], 200);
   }

   /**
    * Remove uma imagem (admin)
    */
   public function destroy(int $produtoId, int $imagemId): JsonResponse
   {
      $produto = Produto::withTrashed()->find($produtoId);

      if (!$produto) {
         return response()->json(['message' => 'Produto não encontrado'], 404);
      }

      $imagem = ProdutoImagem::where('pim_produto_id', $produtoId)
                             ->where('pim_id', $imagemId)
                             ->first();

      if (!$imagem) {
         return response()->json(['message' => 'Imagem não encontrada'], 404);
      }

      // Deletar arquivo físico
      if (Storage::disk('public')->exists($imagem->pim_caminho)) {
         Storage::disk('public')->delete($imagem->pim_caminho);
      }

      // Se era a capa, definir a próxima como capa
      if ($imagem->pim_capa) {
         $proximaImagem = ProdutoImagem::where('pim_produto_id', $produtoId)
                                      ->where('pim_id', '!=', $imagemId)
                                      ->orderBy('pim_ordem')
                                      ->first();

         if ($proximaImagem) {
            $proximaImagem->pim_capa = true;
            $proximaImagem->save();
         }
      }

      // Deletar registro
      $imagem->delete();

      return response()->json([
         'message' => 'Imagem excluída com sucesso',
      ], 200);
   }
}

