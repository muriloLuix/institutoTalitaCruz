<?php

namespace App\Http\Controllers;

use App\Models\Parametro;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ParametroController extends Controller
{
   /**
    * Lista todos os parâmetros (público - para o frontend buscar)
    */
   public function index(): JsonResponse
   {
      $parametros = Parametro::all()->map(function ($parametro) {
         return [
            'id' => $parametro->par_id,
            'nome' => $parametro->par_nome,
            'valor' => $parametro->par_valor,
            'chave' => $parametro->par_chave,
            'descricao' => $parametro->par_descricao,
            'tipo' => $parametro->par_tipo,
         ];
      });

      return response()->json($parametros, 200);
   }

   /**
    * Busca um parâmetro específico pela chave (público)
    */
   public function show(string $chave): JsonResponse
   {
      $parametro = Parametro::where('par_chave', $chave)->first();

      if (!$parametro) {
         return response()->json(['message' => 'Parâmetro não encontrado'], 404);
      }

      return response()->json([
         'id' => $parametro->par_id,
         'nome' => $parametro->par_nome,
         'valor' => $parametro->par_valor,
         'chave' => $parametro->par_chave,
         'descricao' => $parametro->par_descricao,
         'tipo' => $parametro->par_tipo,
      ], 200);
   }

   /**
    * Lista todos os parâmetros para o admin (protegido)
    */
   public function list(): JsonResponse
   {
      $parametros = Parametro::orderBy('par_tipo')->orderBy('par_nome')->get()->map(function ($parametro) {
         return [
            'id' => $parametro->par_id,
            'nome' => $parametro->par_nome,
            'valor' => $parametro->par_valor,
            'chave' => $parametro->par_chave,
            'descricao' => $parametro->par_descricao,
            'tipo' => $parametro->par_tipo,
         ];
      });

      return response()->json($parametros, 200);
   }

   /**
    * Atualiza um parâmetro (protegido)
    */
   public function update(Request $request, int $id): JsonResponse
   {
      $request->validate([
         'valor' => 'required|string|max:1000',
      ]);

      $parametro = Parametro::find($id);

      if (!$parametro) {
         return response()->json(['message' => 'Parâmetro não encontrado'], 404);
      }

      // Usa update() diretamente para garantir que seja salvo
      $atualizado = Parametro::where('par_id', $id)
         ->update(['par_valor' => $request->valor]);

      if (!$atualizado) {
         return response()->json(['message' => 'Falha ao atualizar parâmetro'], 500);
      }

      // Recarrega o modelo atualizado
      $parametro->refresh();

      return response()->json([
         'message' => 'Parâmetro atualizado com sucesso',
         'parametro' => [
            'id' => $parametro->par_id,
            'nome' => $parametro->par_nome,
            'valor' => $parametro->par_valor,
            'chave' => $parametro->par_chave,
            'descricao' => $parametro->par_descricao,
            'tipo' => $parametro->par_tipo,
         ],
      ], 200);
   }

   /**
    * Atualiza múltiplos parâmetros (protegido)
    */
   public function updateMany(Request $request): JsonResponse
   {
      try {
         $request->validate([
            'parametros' => 'required|array|min:1',
            'parametros.*.id' => 'required|integer|exists:parametro,par_id',
            'parametros.*.valor' => 'nullable|string|max:1000', // Permite null e string vazia
         ], [
            'parametros.required' => 'O campo parâmetros é obrigatório.',
            'parametros.array' => 'O campo parâmetros deve ser um array.',
            'parametros.min' => 'É necessário pelo menos um parâmetro para atualizar.',
            'parametros.*.id.required' => 'O ID do parâmetro é obrigatório.',
            'parametros.*.id.integer' => 'O ID do parâmetro deve ser um número inteiro.',
            'parametros.*.id.exists' => 'O parâmetro informado não existe.',
            'parametros.*.valor.string' => 'O valor do parâmetro deve ser uma string.',
            'parametros.*.valor.max' => 'O valor do parâmetro não pode ter mais de 1000 caracteres.',
         ]);
      } catch (ValidationException $e) {
         return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors(),
         ], 422);
      }

      $atualizados = [];
      $erros = [];

      foreach ($request->parametros as $param) {
         try {
            // Valida se o ID foi enviado
            if (!isset($param['id']) || empty($param['id'])) {
               $erros[] = "ID do parâmetro não informado";
               continue;
            }

            // Converte null para string vazia
            $valor = $param['valor'] ?? '';
            $valor = is_null($valor) ? '' : (string) $valor;
            
            // Verifica se o parâmetro existe antes de atualizar
            $parametro = Parametro::find($param['id']);
            if (!$parametro) {
               $erros[] = "Parâmetro não encontrado ID: {$param['id']}";
               continue;
            }
            
            // Usa update() diretamente na query para garantir que seja salvo
            $atualizado = Parametro::where('par_id', $param['id'])
               ->update(['par_valor' => $valor]);
            
            if ($atualizado) {
               $atualizados[] = $param['id'];
            } else {
               $erros[] = "Falha ao atualizar parâmetro ID: {$param['id']} (par_chave: {$parametro->par_chave})";
            }
         } catch (\Exception $e) {
            $erros[] = "Erro ao atualizar parâmetro ID {$param['id']}: " . $e->getMessage();
         }
      }

      if (count($erros) > 0) {
         return response()->json([
            'message' => 'Alguns parâmetros não puderam ser atualizados',
            'atualizados' => $atualizados,
            'erros' => $erros,
         ], 207); // 207 Multi-Status
      }

      return response()->json([
         'message' => count($atualizados) . ' parâmetro(s) atualizado(s) com sucesso',
         'atualizados' => $atualizados,
      ], 200);
   }
}
