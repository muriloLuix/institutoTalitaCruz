<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UsuarioController extends Controller
{
   /**
    * Lista todos os usuários (protegido)
    */
   public function index(): JsonResponse
   {
      $usuarios = User::orderBy('usu_created_at', 'desc')->get()->map(function ($usuario) {
         return [
            'id' => $usuario->usu_id,
            'nome' => $usuario->usu_nome,
            'email' => $usuario->usu_email,
            'tipo' => $usuario->usu_tipo ?? 'editor',
            'ativo' => $usuario->usu_ativo ?? true,
            'criadoEm' => $usuario->usu_created_at ? $usuario->usu_created_at->toIso8601String() : null,
         ];
      });

      return response()->json($usuarios, 200);
   }

   /**
    * Busca um usuário específico (protegido)
    */
   public function show(int $id): JsonResponse
   {
      $usuario = User::find($id);

      if (!$usuario) {
         return response()->json(['message' => 'Usuário não encontrado'], 404);
      }

      return response()->json([
         'id' => $usuario->usu_id,
         'nome' => $usuario->usu_nome,
         'email' => $usuario->usu_email,
         'tipo' => $usuario->usu_tipo ?? 'editor',
         'ativo' => $usuario->usu_ativo ?? true,
         'criadoEm' => $usuario->usu_created_at ? $usuario->usu_created_at->toIso8601String() : null,
      ], 200);
   }

   /**
    * Cria um novo usuário (protegido)
    */
   public function store(Request $request): JsonResponse
   {
      $request->validate([
         'nome' => 'required|string|max:255',
         'email' => 'required|email|max:255|unique:usuario,usu_email',
         'senha' => 'required|string|min:6',
         'tipo' => 'required|in:admin,editor',
         'ativo' => 'boolean',
      ]);

      $usuario = User::create([
         'usu_nome' => $request->nome,
         'usu_email' => $request->email,
         'usu_password' => Hash::make($request->senha),
         'usu_tipo' => $request->tipo,
         'usu_ativo' => $request->boolean('ativo', true),
      ]);

      return response()->json([
         'message' => 'Usuário criado com sucesso',
         'usuario' => [
            'id' => $usuario->usu_id,
            'nome' => $usuario->usu_nome,
            'email' => $usuario->usu_email,
            'tipo' => $usuario->usu_tipo,
            'ativo' => $usuario->usu_ativo,
            'criadoEm' => $usuario->usu_created_at ? $usuario->usu_created_at->toIso8601String() : null,
         ],
      ], 201);
   }

   /**
    * Atualiza um usuário (protegido)
    */
   public function update(Request $request, int $id): JsonResponse
   {
      $usuario = User::find($id);

      if (!$usuario) {
         return response()->json(['message' => 'Usuário não encontrado'], 404);
      }

      $request->validate([
         'nome' => 'required|string|max:255',
         'email' => 'required|email|max:255|unique:usuario,usu_email,' . $id . ',usu_id',
         'senha' => 'nullable|string|min:6',
         'tipo' => 'required|in:admin,editor',
         'ativo' => 'boolean',
      ]);

      $usuario->usu_nome = $request->nome;
      $usuario->usu_email = $request->email;
      $usuario->usu_tipo = $request->tipo;
      $usuario->usu_ativo = $request->boolean('ativo', true);

      // Atualiza a senha apenas se fornecida
      if ($request->filled('senha')) {
         $usuario->usu_password = Hash::make($request->senha);
      }

      $usuario->save();

      return response()->json([
         'message' => 'Usuário atualizado com sucesso',
         'usuario' => [
            'id' => $usuario->usu_id,
            'nome' => $usuario->usu_nome,
            'email' => $usuario->usu_email,
            'tipo' => $usuario->usu_tipo,
            'ativo' => $usuario->usu_ativo,
            'criadoEm' => $usuario->usu_created_at ? $usuario->usu_created_at->toIso8601String() : null,
         ],
      ], 200);
   }

   /**
    * Remove um usuário (protegido)
    */
   public function destroy(Request $request, int $id): JsonResponse
   {
      $usuario = User::find($id);

      if (!$usuario) {
         return response()->json(['message' => 'Usuário não encontrado'], 404);
      }

      // Impede a exclusão do próprio usuário logado
      $user = $request->user();
      if ($user && $usuario->usu_id === $user->usu_id) {
         return response()->json(['message' => 'Você não pode excluir seu próprio usuário'], 403);
      }

      $usuario->delete();

      return response()->json([
         'message' => 'Usuário excluído com sucesso',
      ], 200);
   }
}

