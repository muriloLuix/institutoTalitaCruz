<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class FaqController extends Controller
{
   /**
    * Lista todos os FAQs ativos (público)
    */
   public function index(): JsonResponse
   {
      $faqs = Faq::ativos()
         ->ordenados()
         ->get()
         ->map(function ($faq) {
            return [
               'id' => $faq->faq_id,
               'pergunta' => $faq->faq_pergunta,
               'resposta' => $faq->faq_resposta,
               'ordem' => $faq->faq_ordem,
            ];
         });

      return response()->json($faqs, 200);
   }

   /**
    * Lista todos os FAQs (admin)
    */
   public function indexAdmin(): JsonResponse
   {
      $faqs = Faq::ordenados()
         ->get()
         ->map(function ($faq) {
            return [
               'id' => $faq->faq_id,
               'pergunta' => $faq->faq_pergunta,
               'resposta' => $faq->faq_resposta,
               'ordem' => $faq->faq_ordem,
               'ativo' => $faq->faq_ativo,
               'created_at' => $faq->created_at,
               'updated_at' => $faq->updated_at,
            ];
         });

      return response()->json($faqs, 200);
   }

   /**
    * Busca um FAQ específico (admin)
    */
   public function show(int $id): JsonResponse
   {
      $faq = Faq::find($id);

      if (!$faq) {
         return response()->json(['message' => 'FAQ não encontrado'], 404);
      }

      return response()->json([
         'id' => $faq->faq_id,
         'pergunta' => $faq->faq_pergunta,
         'resposta' => $faq->faq_resposta,
         'ordem' => $faq->faq_ordem,
         'ativo' => $faq->faq_ativo,
         'created_at' => $faq->created_at,
         'updated_at' => $faq->updated_at,
      ], 200);
   }

   /**
    * Cria um novo FAQ
    */
   public function store(Request $request): JsonResponse
   {
      try {
         $validated = $request->validate([
            'pergunta' => 'required|string|max:500',
            'resposta' => 'required|string',
            'ordem' => 'nullable|integer|min:0',
            'ativo' => 'nullable|boolean',
         ], [
            'pergunta.required' => 'A pergunta é obrigatória.',
            'pergunta.max' => 'A pergunta não pode ter mais de 500 caracteres.',
            'resposta.required' => 'A resposta é obrigatória.',
            'ordem.integer' => 'A ordem deve ser um número inteiro.',
            'ordem.min' => 'A ordem não pode ser negativa.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
         ]);

         // Se não informou ordem, pega a última + 1
         if (!isset($validated['ordem'])) {
            $ultimaOrdem = Faq::max('faq_ordem') ?? 0;
            $validated['ordem'] = $ultimaOrdem + 1;
         }

         $faq = Faq::create([
            'faq_pergunta' => $validated['pergunta'],
            'faq_resposta' => $validated['resposta'],
            'faq_ordem' => $validated['ordem'],
            'faq_ativo' => $validated['ativo'] ?? true,
         ]);

         return response()->json([
            'message' => 'FAQ criado com sucesso',
            'data' => [
               'id' => $faq->faq_id,
               'pergunta' => $faq->faq_pergunta,
               'resposta' => $faq->faq_resposta,
               'ordem' => $faq->faq_ordem,
               'ativo' => $faq->faq_ativo,
            ],
         ], 201);
      } catch (ValidationException $e) {
         return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors(),
         ], 422);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao criar FAQ',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Atualiza um FAQ
    */
   public function update(Request $request, int $id): JsonResponse
   {
      try {
         $faq = Faq::find($id);

         if (!$faq) {
            return response()->json(['message' => 'FAQ não encontrado'], 404);
         }

         $validated = $request->validate([
            'pergunta' => 'required|string|max:500',
            'resposta' => 'required|string',
            'ordem' => 'nullable|integer|min:0',
            'ativo' => 'nullable|boolean',
         ], [
            'pergunta.required' => 'A pergunta é obrigatória.',
            'pergunta.max' => 'A pergunta não pode ter mais de 500 caracteres.',
            'resposta.required' => 'A resposta é obrigatória.',
            'ordem.integer' => 'A ordem deve ser um número inteiro.',
            'ordem.min' => 'A ordem não pode ser negativa.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
         ]);

         $faq->update([
            'faq_pergunta' => $validated['pergunta'],
            'faq_resposta' => $validated['resposta'],
            'faq_ordem' => $validated['ordem'] ?? $faq->faq_ordem,
            'faq_ativo' => $validated['ativo'] ?? $faq->faq_ativo,
         ]);

         return response()->json([
            'message' => 'FAQ atualizado com sucesso',
            'data' => [
               'id' => $faq->faq_id,
               'pergunta' => $faq->faq_pergunta,
               'resposta' => $faq->faq_resposta,
               'ordem' => $faq->faq_ordem,
               'ativo' => $faq->faq_ativo,
            ],
         ], 200);
      } catch (ValidationException $e) {
         return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors(),
         ], 422);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao atualizar FAQ',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Deleta um FAQ
    */
   public function destroy(int $id): JsonResponse
   {
      $faq = Faq::find($id);

      if (!$faq) {
         return response()->json(['message' => 'FAQ não encontrado'], 404);
      }

      $faq->delete();

      return response()->json([
         'message' => 'FAQ excluído com sucesso',
      ], 200);
   }

   /**
    * Reordena os FAQs
    */
   public function reorder(Request $request): JsonResponse
   {
      try {
         $validated = $request->validate([
            'faqs' => 'required|array',
            'faqs.*.id' => 'required|integer|exists:faq,faq_id',
            'faqs.*.ordem' => 'required|integer|min:0',
         ], [
            'faqs.required' => 'A lista de FAQs é obrigatória.',
            'faqs.array' => 'A lista de FAQs deve ser um array.',
            'faqs.*.id.required' => 'O ID do FAQ é obrigatório.',
            'faqs.*.id.exists' => 'O FAQ informado não existe.',
            'faqs.*.ordem.required' => 'A ordem do FAQ é obrigatória.',
            'faqs.*.ordem.integer' => 'A ordem deve ser um número inteiro.',
         ]);

         foreach ($validated['faqs'] as $item) {
            Faq::where('faq_id', $item['id'])->update([
               'faq_ordem' => $item['ordem'],
            ]);
         }

         return response()->json([
            'message' => 'FAQs reordenados com sucesso',
         ], 200);
      } catch (ValidationException $e) {
         return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors(),
         ], 422);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao reordenar FAQs',
            'error' => $e->getMessage(),
         ], 500);
      }
   }
}
