<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
   /**
    * Finaliza a compra (lógica será implementada posteriormente)
    */
   public function finalizarCompra(Request $request): JsonResponse
   {
      // Validação
      $request->validate([
         'session_id' => 'required|string',
      ], [
         'session_id.required' => 'Session ID é obrigatório.',
      ]);

      // Obtém o usuário autenticado
      $user = $request->user();
      
      // Verifica se o usuário está autenticado
      if (!$user) {
         return response()->json([
            'message' => 'Não autenticado. Faça login para finalizar a compra.',
         ], 401);
      }
      
      // Verifica se é um Cliente
      if (!$user instanceof Cliente) {
         return response()->json([
            'message' => 'Acesso negado. Apenas clientes podem finalizar compras.',
         ], 403);
      }

      // Lógica de finalização de compra será implementada posteriormente
      return response()->json([
         'message' => 'Endpoint de checkout disponível. Lógica de finalização será implementada em breve.',
         'cliente_id' => $user->cli_id,
         'session_id' => $request->session_id,
      ], 200);
   }
}
