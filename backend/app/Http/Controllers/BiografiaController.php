<?php

namespace App\Http\Controllers;

use App\Models\Biografia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class BiografiaController extends Controller
{
   /**
    * Retorna a URL completa para um arquivo no storage
    */
   private function getStorageUrl(string $path): string
   {
      $appUrl = config('app.url');
      
      if (!$appUrl || $appUrl === 'http://localhost') {
         $appUrl = URL::to('/');
      }
      
      return rtrim($appUrl, '/') . '/storage/' . ltrim($path, '/');
   }

   /**
    * Busca a biografia ativa (público)
    */
   public function show(): JsonResponse
   {
      $biografia = Biografia::ativas()->first();

      if (!$biografia) {
         return response()->json(['message' => 'Biografia não encontrada'], 404);
      }

      $imagemUrl = null;
      if ($biografia->bio_imagem) {
         $imagemUrl = $this->getStorageUrl($biografia->bio_imagem);
      }

      return response()->json([
         'id' => $biografia->bio_id,
         'nome' => $biografia->bio_nome,
         'descricao' => $biografia->bio_descricao,
         'imagem' => $imagemUrl,
         'alunos' => $biografia->bio_alunos,
         'anosExperiencia' => $biografia->bio_anos_experiencia,
         'dedicacao' => $biografia->bio_dedicacao,
      ], 200);
   }

   /**
    * Busca a biografia (admin)
    */
   public function showAdmin(): JsonResponse
   {
      $biografia = Biografia::first();

      if (!$biografia) {
         return response()->json(['message' => 'Biografia não encontrada'], 404);
      }

      $imagemUrl = null;
      if ($biografia->bio_imagem) {
         $imagemUrl = $this->getStorageUrl($biografia->bio_imagem);
      }

      return response()->json([
         'id' => $biografia->bio_id,
         'nome' => $biografia->bio_nome,
         'descricao' => $biografia->bio_descricao,
         'imagem' => $imagemUrl,
         'alunos' => $biografia->bio_alunos,
         'anosExperiencia' => $biografia->bio_anos_experiencia,
         'dedicacao' => $biografia->bio_dedicacao,
         'ativo' => $biografia->bio_ativo,
         'created_at' => $biografia->created_at,
         'updated_at' => $biografia->updated_at,
      ], 200);
   }

   /**
    * Atualiza a biografia
    */
   public function update(Request $request, int $id): JsonResponse
   {
      try {
         $biografia = Biografia::find($id);

         if (!$biografia) {
            return response()->json(['message' => 'Biografia não encontrada'], 404);
         }

         $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string',
            'imagem' => 'nullable|string',
            'alunos' => 'nullable|integer|min:0',
            'anosExperiencia' => 'nullable|integer|min:0',
            'dedicacao' => 'nullable|string|max:50',
            'ativo' => 'nullable|boolean',
         ], [
            'nome.required' => 'O nome é obrigatório.',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres.',
            'descricao.required' => 'A descrição é obrigatória.',
            'alunos.integer' => 'O número de alunos deve ser um número inteiro.',
            'alunos.min' => 'O número de alunos não pode ser negativo.',
            'anosExperiencia.integer' => 'Os anos de experiência devem ser um número inteiro.',
            'anosExperiencia.min' => 'Os anos de experiência não podem ser negativos.',
            'dedicacao.max' => 'A dedicação não pode ter mais de 50 caracteres.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
         ]);

         $biografia->update([
            'bio_nome' => $validated['nome'],
            'bio_descricao' => $validated['descricao'],
            'bio_imagem' => $validated['imagem'] ?? $biografia->bio_imagem,
            'bio_alunos' => $validated['alunos'] ?? $biografia->bio_alunos,
            'bio_anos_experiencia' => $validated['anosExperiencia'] ?? $biografia->bio_anos_experiencia,
            'bio_dedicacao' => $validated['dedicacao'] ?? $biografia->bio_dedicacao,
            'bio_ativo' => $validated['ativo'] ?? $biografia->bio_ativo,
         ]);

         $imagemUrl = null;
         if ($biografia->bio_imagem) {
            $imagemUrl = $this->getStorageUrl($biografia->bio_imagem);
         }

         return response()->json([
            'message' => 'Biografia atualizada com sucesso',
            'data' => [
               'id' => $biografia->bio_id,
               'nome' => $biografia->bio_nome,
               'descricao' => $biografia->bio_descricao,
               'imagem' => $imagemUrl,
               'alunos' => $biografia->bio_alunos,
               'anosExperiencia' => $biografia->bio_anos_experiencia,
               'dedicacao' => $biografia->bio_dedicacao,
               'ativo' => $biografia->bio_ativo,
            ],
         ], 200);
      } catch (ValidationException $e) {
         return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors(),
         ], 422);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao atualizar biografia',
            'error' => $e->getMessage(),
         ], 500);
      }
   }
}
