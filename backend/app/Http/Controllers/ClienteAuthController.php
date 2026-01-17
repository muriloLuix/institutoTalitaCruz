<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ClienteAuthController extends Controller
{
   /**
    * Cadastro de novo cliente
    */
   public function cadastro(Request $request): JsonResponse
   {
      // Validação dos dados
      $validated = $request->validate([
         'nome' => 'required|string|max:255',
         'email' => 'required|email|max:255|unique:cliente,cli_email',
         'senha' => 'required|string|min:6',
         'tipo_pessoa' => 'required|in:fisica,juridica',
         'telefone' => 'required|string|max:20',
         'cpf' => 'nullable|string|max:14|required_if:tipo_pessoa,fisica',
         'cnpj' => 'nullable|string|max:18|required_if:tipo_pessoa,juridica',
         'razao_social' => 'nullable|string|max:255|required_if:tipo_pessoa,juridica',
         'data_nascimento' => 'nullable|date',
         'endereco' => 'required|string|max:500',
         'cidade' => 'required|string|max:100',
         'estado' => 'required|string|max:2',
         'cep' => 'required|string|max:10',
      ], [
         'nome.required' => 'O nome é obrigatório.',
         'email.required' => 'O e-mail é obrigatório.',
         'email.email' => 'O e-mail deve ser válido.',
         'email.unique' => 'Este e-mail já está cadastrado.',
         'senha.required' => 'A senha é obrigatória.',
         'senha.min' => 'A senha deve ter no mínimo 6 caracteres.',
         'tipo_pessoa.required' => 'O tipo de pessoa é obrigatório.',
         'tipo_pessoa.in' => 'O tipo de pessoa deve ser: física ou jurídica.',
         'telefone.required' => 'O telefone é obrigatório.',
         'cpf.required_if' => 'O CPF é obrigatório para pessoa física.',
         'cnpj.required_if' => 'O CNPJ é obrigatório para pessoa jurídica.',
         'razao_social.required_if' => 'A razão social é obrigatória para pessoa jurídica.',
         'endereco.required' => 'O endereço é obrigatório.',
         'cidade.required' => 'A cidade é obrigatória.',
         'estado.required' => 'O estado é obrigatório.',
         'cep.required' => 'O CEP é obrigatório.',
      ]);

      // Verifica se CPF/CNPJ já existe
      if ($validated['tipo_pessoa'] === 'fisica' && $validated['cpf']) {
         $cpfExists = Cliente::where('cli_cpf', $validated['cpf'])->first();
         if ($cpfExists) {
            throw ValidationException::withMessages([
               'cpf' => ['Este CPF já está cadastrado.'],
            ]);
         }
      }

      if ($validated['tipo_pessoa'] === 'juridica' && $validated['cnpj']) {
         $cnpjExists = Cliente::where('cli_cnpj', $validated['cnpj'])->first();
         if ($cnpjExists) {
            throw ValidationException::withMessages([
               'cnpj' => ['Este CNPJ já está cadastrado.'],
            ]);
         }
      }

      // Cria o cliente
      $cliente = Cliente::create([
         'cli_nome' => $validated['nome'],
         'cli_email' => $validated['email'],
         'cli_password' => Hash::make($validated['senha']),
         'cli_tipo_pessoa' => $validated['tipo_pessoa'],
         'cli_telefone' => $validated['telefone'],
         'cli_cpf' => $validated['tipo_pessoa'] === 'fisica' ? $validated['cpf'] : null,
         'cli_cnpj' => $validated['tipo_pessoa'] === 'juridica' ? $validated['cnpj'] : null,
         'cli_razao_social' => $validated['tipo_pessoa'] === 'juridica' ? $validated['razao_social'] : null,
         'cli_data_nascimento' => $validated['data_nascimento'] ?? null,
         'cli_endereco' => $validated['endereco'],
         'cli_cidade' => $validated['cidade'],
         'cli_estado' => strtoupper($validated['estado']),
         'cli_cep' => $validated['cep'],
         'cli_status' => 'ativo',
      ]);

      // Cria um token para o cliente
      $token = $cliente->createToken('cliente-token', ['*'], now()->addDays(30))->plainTextToken;

      return response()->json([
         'message' => 'Cadastro realizado com sucesso!',
         'token' => $token,
         'cliente' => [
            'id' => $cliente->cli_id,
            'nome' => $cliente->cli_nome,
            'email' => $cliente->cli_email,
            'tipoPessoa' => $cliente->cli_tipo_pessoa,
         ],
      ], 201);
   }

   /**
    * Login de cliente
    */
   public function login(Request $request): JsonResponse
   {
      // Validação dos dados
      $request->validate([
         'email' => 'required|email',
         'password' => 'required|string',
         'remember' => 'boolean',
      ], [
         'email.required' => 'O e-mail é obrigatório.',
         'email.email' => 'O e-mail deve ser válido.',
         'password.required' => 'A senha é obrigatória.',
      ]);

      // Busca o cliente pelo email
      $cliente = Cliente::where('cli_email', $request->email)->first();

      // Verifica se o cliente existe
      if (!$cliente) {
         throw ValidationException::withMessages([
            'email' => ['Esta conta não existe. Verifique o e-mail informado.'],
         ]);
      }

      // Verifica se a senha está correta
      if (!Hash::check($request->password, $cliente->cli_password)) {
         throw ValidationException::withMessages([
            'email' => ['As credenciais fornecidas estão incorretas.'],
         ]);
      }

      // Verifica se o cliente está ativo
      if ($cliente->cli_status !== 'ativo') {
         throw ValidationException::withMessages([
            'email' => ['Sua conta está inativa ou bloqueada. Entre em contato com o suporte.'],
         ]);
      }

      // Cria um novo token
      $tokenName = $request->boolean('remember') ? 'cliente-remember-token' : 'cliente-token';
      $expiresAt = $request->boolean('remember') ? now()->addDays(30) : now()->addHours(8);
      
      $token = $cliente->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

      // Retorna o token e os dados do cliente
      return response()->json([
         'token' => $token,
         'cliente' => [
            'id' => $cliente->cli_id,
            'nome' => $cliente->cli_nome,
            'email' => $cliente->cli_email,
            'tipoPessoa' => $cliente->cli_tipo_pessoa,
         ],
         'expires_at' => $expiresAt->toIso8601String(),
      ], 200);
   }

   /**
    * Logout de cliente
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
    * Retorna os dados do cliente autenticado
    */
   public function me(Request $request): JsonResponse
   {
      $cliente = $request->user();

      return response()->json([
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
         ],
      ], 200);
   }

   /**
    * Atualiza os dados do cliente autenticado
    */
   public function update(Request $request): JsonResponse
   {
      $cliente = $request->user();

      // Validação dos dados
      $validated = $request->validate([
         'nome' => 'sometimes|required|string|max:255',
         'email' => 'sometimes|required|email|max:255|unique:cliente,cli_email,' . $cliente->cli_id . ',cli_id',
         'telefone' => 'sometimes|nullable|string|max:20',
         'data_nascimento' => 'sometimes|nullable|date',
         'endereco' => 'sometimes|nullable|string|max:500',
         'cidade' => 'sometimes|nullable|string|max:100',
         'estado' => 'sometimes|nullable|string|max:2',
         'cep' => 'sometimes|nullable|string|max:10',
         'razao_social' => 'sometimes|nullable|string|max:255',
      ], [
         'nome.required' => 'O nome é obrigatório.',
         'email.required' => 'O e-mail é obrigatório.',
         'email.email' => 'O e-mail deve ser válido.',
         'email.unique' => 'Este e-mail já está cadastrado.',
      ]);

      // Atualiza apenas os campos fornecidos
      if (isset($validated['nome'])) {
         $cliente->cli_nome = $validated['nome'];
      }
      if (isset($validated['email'])) {
         $cliente->cli_email = $validated['email'];
      }
      if (isset($validated['telefone'])) {
         $cliente->cli_telefone = $validated['telefone'];
      }
      if (isset($validated['data_nascimento'])) {
         $cliente->cli_data_nascimento = $validated['data_nascimento'];
      }
      if (isset($validated['endereco'])) {
         $cliente->cli_endereco = $validated['endereco'];
      }
      if (isset($validated['cidade'])) {
         $cliente->cli_cidade = $validated['cidade'];
      }
      if (isset($validated['estado'])) {
         $cliente->cli_estado = strtoupper($validated['estado']);
      }
      if (isset($validated['cep'])) {
         $cliente->cli_cep = $validated['cep'];
      }
      if (isset($validated['razao_social'])) {
         $cliente->cli_razao_social = $validated['razao_social'];
      }

      $cliente->save();

      return response()->json([
         'message' => 'Perfil atualizado com sucesso!',
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
         ],
      ], 200);
   }

   /**
    * Altera a senha do cliente autenticado
    */
   public function alterarSenha(Request $request): JsonResponse
   {
      $cliente = $request->user();

      // Validação dos dados
      $validated = $request->validate([
         'senha_atual' => 'required|string',
         'senha_nova' => 'required|string|min:6',
         'senha_nova_confirmacao' => 'required|string|same:senha_nova',
      ], [
         'senha_atual.required' => 'A senha atual é obrigatória.',
         'senha_nova.required' => 'A nova senha é obrigatória.',
         'senha_nova.min' => 'A nova senha deve ter no mínimo 6 caracteres.',
         'senha_nova_confirmacao.required' => 'A confirmação da nova senha é obrigatória.',
         'senha_nova_confirmacao.same' => 'As senhas não coincidem.',
      ]);

      // Verifica se a senha atual está correta
      if (!Hash::check($validated['senha_atual'], $cliente->cli_password)) {
         throw ValidationException::withMessages([
            'senha_atual' => ['A senha atual está incorreta.'],
         ]);
      }

      // Atualiza a senha
      $cliente->cli_password = Hash::make($validated['senha_nova']);
      $cliente->save();

      return response()->json([
         'message' => 'Senha alterada com sucesso!',
      ], 200);
   }

   /**
    * Retorna os pedidos do cliente autenticado
    */
   public function pedidos(Request $request): JsonResponse
   {
      $cliente = $request->user();

      // Busca os pedidos do cliente com relacionamentos
      $pedidos = \App\Models\Pedido::where('ped_cliente_id', $cliente->cli_id)
         ->with(['produto.imagens'])
         ->orderBy('ped_created_at', 'desc')
         ->get();

      // Helper para obter URL do storage
      $getStorageUrl = function ($path) {
         $appUrl = config('app.url');
         if (!$appUrl || $appUrl === 'http://localhost') {
            $appUrl = \Illuminate\Support\Facades\URL::to('/');
         }
         return rtrim($appUrl, '/') . '/storage/' . ltrim($path, '/');
      };

      // Formata os dados para retornar
      $pedidosFormatados = $pedidos->map(function ($pedido) use ($getStorageUrl) {
         $imagemCapaUrl = null;
         
         if ($pedido->produto && $pedido->produto->imagens) {
            $imagemCapa = $pedido->produto->imagens->where('pim_capa', true)->first();
            if (!$imagemCapa) {
               $imagemCapa = $pedido->produto->imagens->first();
            }
            if ($imagemCapa) {
               $imagemCapaUrl = $getStorageUrl($imagemCapa->pim_caminho);
            }
         }

         return [
            'id' => $pedido->ped_id,
            'produto' => $pedido->produto ? [
               'id' => $pedido->produto->pro_id,
               'nome' => $pedido->produto->pro_nome,
               'descricao' => $pedido->produto->pro_descricao,
               'preco' => (float) $pedido->produto->pro_preco,
               'imagemCapa' => $imagemCapaUrl,
            ] : null,
            'status' => $pedido->ped_status,
            'valor' => (float) $pedido->ped_valor,
            'dataCompra' => $pedido->ped_data_compra ? $pedido->ped_data_compra->format('Y-m-d H:i:s') : null,
            'dataPagamento' => $pedido->ped_data_pagamento ? $pedido->ped_data_pagamento->format('Y-m-d H:i:s') : null,
            'dataCancelamento' => $pedido->ped_data_cancelamento ? $pedido->ped_data_cancelamento->format('Y-m-d H:i:s') : null,
            'transacaoHotmart' => $pedido->ped_transacao_hotmart,
            'observacoes' => $pedido->ped_observacoes,
            'criadoEm' => $pedido->ped_created_at ? $pedido->ped_created_at->format('Y-m-d H:i:s') : null,
         ];
      });

      return response()->json([
         'pedidos' => $pedidosFormatados,
      ], 200);
   }
}
