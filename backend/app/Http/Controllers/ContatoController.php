<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contato;

class ContatoController extends Controller
{
   public function enviar(Request $request)
   {
      $request->validate([
         'nome' => 'required|string|max:255',
         'email' => 'required|email|max:255',
         'telefone' => 'required|string|max:255',
         'mensagem' => 'required|string|max:2000',
      ]);

      if (!$contato = new Contato()) {
         return response()->json([
            'message' => 'Erro ao salvar contato',
         ], 500);
      } else {
         $contato->con_nome = $request->nome;
         $contato->con_email = $request->email;
         $contato->con_telefone = $request->telefone;
         $contato->con_mensagem = $request->mensagem;
         $contato->con_created_at = now();
         $contato->con_updated_at = now();
         $contato->save();
      }

      return response()->json([
         'message' => 'Contato enviado com sucesso',
      ], 201);
   }
}
