<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
   /**
    * Login de administrador
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse
    */
   public function login(Request $request): JsonResponse
   {
      // Validação dos dados
      $request->validate([
         'email' => 'required|email',
         'password' => 'required|string',
         'remember' => 'boolean',
      ]);

      // Busca o usuário pelo email
      $user = User::where('usu_email', $request->email)->first();

      // Verifica se o usuário existe e se a senha está correta
      if (!$user || !Hash::check($request->password, $user->usu_password)) {
         throw ValidationException::withMessages([
            'email' => ['As credenciais fornecidas estão incorretas.'],
         ]);
      }

      // Revoga todos os tokens anteriores (opcional - para permitir apenas um login por vez)
      // $user->tokens()->delete();

      // Cria um novo token
      $tokenName = $request->boolean('remember') ? 'admin-remember-token' : 'admin-token';
      $expiresAt = $request->boolean('remember') ? now()->addDays(30) : now()->addHours(8);
      
      $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

      // Retorna o token e os dados do usuário
      return response()->json([
         'token' => $token,
         'user' => [
            'usu_id' => $user->usu_id,
            'usu_nome' => $user->usu_nome,
            'usu_email' => $user->usu_email,
         ],
         'expires_at' => $expiresAt->toIso8601String(),
      ], 200);
   }

   /**
    * Logout de administrador
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse
    */
   public function logout(Request $request): JsonResponse
   {
      // Revoga o token atual
      $request->user()->currentAccessToken()->delete();

      return response()->json([
         'message' => 'Logout realizado com sucesso',
      ], 200);
   }

   /**
    * Retorna os dados do usuário autenticado
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse
    */
   public function me(Request $request): JsonResponse
   {
      $user = $request->user();

      return response()->json([
         'user' => [
            'usu_id' => $user->usu_id,
            'usu_nome' => $user->usu_nome,
            'usu_email' => $user->usu_email,
         ],
      ], 200);
   }
}
