<?php

namespace App\Http\Controllers;

use App\Models\CarrinhoItem;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class CarrinhoController extends Controller
{
   /**
    * Lista todos os itens do carrinho de uma sessão
    */
   public function index(Request $request): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
      ]);

      $sessionId = $request->session_id;

      $itens = CarrinhoItem::porSession($sessionId)
         ->with(['produto.imagens'])
         ->get()
         ->map(function ($item) {
            $produto = $item->produto;
            
            // Pegar imagem de capa ou primeira imagem
            $imagemUrl = $produto->pro_imagem;
            if (!$imagemUrl && $produto->imagens && $produto->imagens->count() > 0) {
               $imagemCapa = $produto->imagens->where('pim_capa', true)->first();
               $imagemUrl = $imagemCapa ? $imagemCapa->pim_url : $produto->imagens->first()->pim_url;
            }

            return [
               'id' => $item->car_id,
               'produtoId' => $item->pro_id,
               'nome' => $produto->pro_nome,
               'preco' => (float) $item->car_preco_unitario,
               'imagem' => $imagemUrl,
               'quantidade' => $item->car_quantidade,
               'total' => (float) $item->total,
            ];
         });

      $totalPreco = $itens->sum('total');
      $totalItens = $itens->sum('quantidade');

      return response()->json([
         'itens' => $itens,
         'totalPreco' => $totalPreco,
         'totalItens' => $totalItens,
      ]);
   }

   /**
    * Adiciona um item ao carrinho
    */
   public function store(Request $request): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
         'produto_id' => 'required|integer|exists:produto,pro_id',
         'quantidade' => 'integer|min:1|max:999',
      ]);

      $sessionId = $request->session_id;
      $produtoId = $request->produto_id;
      $quantidade = $request->input('quantidade', 1);

      // Buscar produto
      $produto = Produto::findOrFail($produtoId);

      if (!$produto->pro_disponivel) {
         throw ValidationException::withMessages([
            'produto_id' => ['Este produto não está disponível.'],
         ]);
      }

      // Verificar se já existe no carrinho
      $itemExistente = CarrinhoItem::porSession($sessionId)
         ->where('pro_id', $produtoId)
         ->first();

      if ($itemExistente) {
         // Se já existe, aumenta a quantidade
         $itemExistente->car_quantidade += $quantidade;
         if ($itemExistente->car_quantidade > 999) {
            $itemExistente->car_quantidade = 999;
         }
         $itemExistente->save();
         $item = $itemExistente;
      } else {
         // Se não existe, cria novo item
         $item = CarrinhoItem::create([
            'car_session_id' => $sessionId,
            'pro_id' => $produtoId,
            'car_quantidade' => $quantidade,
            'car_preco_unitario' => $produto->pro_preco,
         ]);
      }

      // Carregar relacionamentos
      $item->load(['produto.imagens']);

      // Pegar imagem
      $imagemUrl = $produto->pro_imagem;
      if (!$imagemUrl && $produto->imagens && $produto->imagens->count() > 0) {
         $imagemCapa = $produto->imagens->where('pim_capa', true)->first();
         $imagemUrl = $imagemCapa ? $imagemCapa->pim_url : $produto->imagens->first()->pim_url;
      }

      return response()->json([
         'message' => 'Produto adicionado ao carrinho!',
         'item' => [
            'id' => $item->car_id,
            'produtoId' => $item->pro_id,
            'nome' => $produto->pro_nome,
            'preco' => (float) $item->car_preco_unitario,
            'imagem' => $imagemUrl,
            'quantidade' => $item->car_quantidade,
            'total' => (float) $item->total,
         ],
      ], 201);
   }

   /**
    * Atualiza a quantidade de um item do carrinho
    */
   public function update(Request $request, int $id): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
         'quantidade' => 'required|integer|min:1|max:999',
      ]);

      $sessionId = $request->session_id;
      $quantidade = $request->quantidade;

      $item = CarrinhoItem::porSession($sessionId)
         ->where('car_id', $id)
         ->firstOrFail();

      $item->car_quantidade = $quantidade;
      $item->save();

      return response()->json([
         'message' => 'Quantidade atualizada!',
         'item' => [
            'id' => $item->car_id,
            'quantidade' => $item->car_quantidade,
            'total' => (float) $item->total,
         ],
      ]);
   }

   /**
    * Remove um item do carrinho
    */
   public function destroy(Request $request, int $id): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
      ]);

      // Aceitar session_id via query string ou body
      $sessionId = $request->input('session_id') ?? $request->query('session_id');

      $item = CarrinhoItem::porSession($sessionId)
         ->where('car_id', $id)
         ->firstOrFail();

      $item->delete();

      return response()->json([
         'message' => 'Item removido do carrinho!',
      ]);
   }

   /**
    * Limpa todo o carrinho de uma sessão
    */
   public function limpar(Request $request): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
      ]);

      // Aceitar session_id via query string ou body
      $sessionId = $request->input('session_id') ?? $request->query('session_id');

      CarrinhoItem::porSession($sessionId)->delete();

      return response()->json([
         'message' => 'Carrinho limpo!',
      ]);
   }

   /**
    * Retorna o total de itens no carrinho (para badge)
    */
   public function total(Request $request): JsonResponse
   {
      $request->validate([
         'session_id' => 'required|string',
      ]);

      $sessionId = $request->session_id;

      $totalItens = CarrinhoItem::porSession($sessionId)
         ->sum('car_quantidade');

      return response()->json([
         'totalItens' => $totalItens,
      ]);
   }
}
