<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ClienteController extends Controller
{
   /**
    * Lista todos os clientes (protegido)
    */
   public function index(Request $request): JsonResponse
   {
      $query = Cliente::withTrashed()->orderBy('cli_created_at', 'desc');

      // Filtro por status se fornecido
      if ($request->has('status')) {
         $query->where('cli_status', $request->status);
      }

      // Filtro por busca (nome, email, telefone, CPF, CNPJ)
      if ($request->has('search') && $request->search) {
         $search = $request->search;
         $query->where(function ($q) use ($search) {
            $q->where('cli_nome', 'like', "%{$search}%")
               ->orWhere('cli_email', 'like', "%{$search}%")
               ->orWhere('cli_telefone', 'like', "%{$search}%")
               ->orWhere('cli_cpf', 'like', "%{$search}%")
               ->orWhere('cli_cnpj', 'like', "%{$search}%")
               ->orWhere('cli_razao_social', 'like', "%{$search}%");
         });
      }

      $clientes = $query->get()->map(function ($cliente) {
         return [
            'id' => $cliente->cli_id,
            'nome' => $cliente->cli_nome,
            'email' => $cliente->cli_email,
            'tipoPessoa' => $cliente->cli_tipo_pessoa ?? 'fisica',
            'telefone' => $cliente->cli_telefone,
            'cpf' => $cliente->cli_cpf,
            'cnpj' => $cliente->cli_cnpj,
            'razaoSocial' => $cliente->cli_razao_social,
            'dataNascimento' => $cliente->cli_data_nascimento ? $cliente->cli_data_nascimento->format('Y-m-d') : null,
            'endereco' => $cliente->cli_endereco,
            'cidade' => $cliente->cli_cidade,
            'estado' => $cliente->cli_estado,
            'cep' => $cliente->cli_cep,
            'status' => $cliente->cli_status,
            'observacoes' => $cliente->cli_observacoes,
            'criadoEm' => $cliente->cli_created_at ? $cliente->cli_created_at->toIso8601String() : null,
            'atualizadoEm' => $cliente->cli_updated_at ? $cliente->cli_updated_at->toIso8601String() : null,
            'deletadoEm' => $cliente->cli_deleted_at ? $cliente->cli_deleted_at->toIso8601String() : null,
            'deletado' => $cliente->trashed(),
         ];
      });

      return response()->json($clientes, 200);
   }

   /**
    * Busca um cliente específico (protegido)
    */
   public function show(int $id): JsonResponse
   {
      $cliente = Cliente::withTrashed()->find($id);

      if (!$cliente) {
         return response()->json(['message' => 'Cliente não encontrado'], 404);
      }

      return response()->json([
         'id' => $cliente->cli_id,
         'nome' => $cliente->cli_nome,
         'email' => $cliente->cli_email,
         'tipoPessoa' => $cliente->cli_tipo_pessoa ?? 'fisica',
         'telefone' => $cliente->cli_telefone,
         'cpf' => $cliente->cli_cpf,
         'cnpj' => $cliente->cli_cnpj,
         'razaoSocial' => $cliente->cli_razao_social,
         'dataNascimento' => $cliente->cli_data_nascimento ? $cliente->cli_data_nascimento->format('Y-m-d') : null,
         'endereco' => $cliente->cli_endereco,
         'cidade' => $cliente->cli_cidade,
         'estado' => $cliente->cli_estado,
         'cep' => $cliente->cli_cep,
         'status' => $cliente->cli_status,
         'observacoes' => $cliente->cli_observacoes,
         'criadoEm' => $cliente->cli_created_at ? $cliente->cli_created_at->toIso8601String() : null,
         'atualizadoEm' => $cliente->cli_updated_at ? $cliente->cli_updated_at->toIso8601String() : null,
         'deletadoEm' => $cliente->cli_deleted_at ? $cliente->cli_deleted_at->toIso8601String() : null,
         'deletado' => $cliente->trashed(),
      ], 200);
   }

   /**
    * Atualiza um cliente (protegido)
    */
   public function update(Request $request, int $id): JsonResponse
   {
      $cliente = Cliente::withTrashed()->find($id);

      if (!$cliente) {
         return response()->json(['message' => 'Cliente não encontrado'], 404);
      }

      $request->validate([
         'nome' => 'required|string|max:255',
         'email' => 'required|email|max:255|unique:cliente,cli_email,' . $id . ',cli_id',
         'tipoPessoa' => 'required|in:fisica,juridica',
         'telefone' => 'nullable|string|max:20',
         'cpf' => 'nullable|string|max:14',
         'cnpj' => 'nullable|string|max:18',
         'razaoSocial' => 'nullable|string|max:255',
         'dataNascimento' => 'nullable|date',
         'endereco' => 'nullable|string|max:255',
         'cidade' => 'nullable|string|max:100',
         'estado' => 'nullable|string|max:2',
         'cep' => 'nullable|string|max:10',
         'status' => 'required|in:ativo,inativo,bloqueado',
         'observacoes' => 'nullable|string|max:1000',
      ], [
         'nome.required' => 'O nome é obrigatório.',
         'email.required' => 'O e-mail é obrigatório.',
         'email.email' => 'O e-mail deve ser válido.',
         'email.unique' => 'Este e-mail já está cadastrado.',
         'tipoPessoa.required' => 'O tipo de pessoa é obrigatório.',
         'tipoPessoa.in' => 'O tipo de pessoa deve ser: física ou jurídica.',
         'status.required' => 'O status é obrigatório.',
         'status.in' => 'O status deve ser: ativo, inativo ou bloqueado.',
      ]);

      $cliente->cli_nome = $request->nome;
      $cliente->cli_email = $request->email;
      $cliente->cli_tipo_pessoa = $request->tipoPessoa;
      $cliente->cli_telefone = $request->telefone;
      $cliente->cli_cpf = $request->tipoPessoa === 'fisica' ? $request->cpf : null;
      $cliente->cli_cnpj = $request->tipoPessoa === 'juridica' ? $request->cnpj : null;
      $cliente->cli_razao_social = $request->tipoPessoa === 'juridica' ? $request->razaoSocial : null;
      $cliente->cli_data_nascimento = $request->dataNascimento;
      $cliente->cli_endereco = $request->endereco;
      $cliente->cli_cidade = $request->cidade;
      $cliente->cli_estado = $request->estado;
      $cliente->cli_cep = $request->cep;
      $cliente->cli_status = $request->status;
      $cliente->cli_observacoes = $request->observacoes;

      $cliente->save();

      return response()->json([
         'message' => 'Cliente atualizado com sucesso',
         'cliente' => [
            'id' => $cliente->cli_id,
            'nome' => $cliente->cli_nome,
            'email' => $cliente->cli_email,
            'tipoPessoa' => $cliente->cli_tipo_pessoa ?? 'fisica',
            'telefone' => $cliente->cli_telefone,
            'cpf' => $cliente->cli_cpf,
            'cnpj' => $cliente->cli_cnpj,
            'razaoSocial' => $cliente->cli_razao_social,
            'dataNascimento' => $cliente->cli_data_nascimento ? $cliente->cli_data_nascimento->format('Y-m-d') : null,
            'endereco' => $cliente->cli_endereco,
            'cidade' => $cliente->cli_cidade,
            'estado' => $cliente->cli_estado,
            'cep' => $cliente->cli_cep,
            'status' => $cliente->cli_status,
            'observacoes' => $cliente->cli_observacoes,
            'criadoEm' => $cliente->cli_created_at ? $cliente->cli_created_at->toIso8601String() : null,
            'deletado' => $cliente->trashed(),
         ],
      ], 200);
   }

   /**
    * Remove um cliente (soft delete) (protegido)
    */
   public function destroy(int $id): JsonResponse
   {
      $cliente = Cliente::find($id);

      if (!$cliente) {
         return response()->json(['message' => 'Cliente não encontrado'], 404);
      }

      $cliente->delete(); // Soft delete

      return response()->json([
         'message' => 'Cliente excluído com sucesso',
      ], 200);
   }

   /**
    * Restaura um cliente excluído (protegido)
    */
   public function restore(int $id): JsonResponse
   {
      $cliente = Cliente::withTrashed()->find($id);

      if (!$cliente) {
         return response()->json(['message' => 'Cliente não encontrado'], 404);
      }

      if (!$cliente->trashed()) {
         return response()->json(['message' => 'Cliente não está excluído'], 400);
      }

      $cliente->restore();

      return response()->json([
         'message' => 'Cliente restaurado com sucesso',
      ], 200);
   }
}

