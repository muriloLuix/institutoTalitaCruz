<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cliente', function (Blueprint $table) {
            $table->bigIncrements('cli_id');
            $table->string('cli_nome');
            $table->string('cli_email')->unique();
            $table->string('cli_password'); // Senha para autenticação
            $table->string('cli_tipo_pessoa')->default('fisica'); // 'fisica' ou 'juridica'
            $table->string('cli_telefone')->nullable();
            $table->string('cli_cpf')->nullable();
            $table->string('cli_cnpj')->nullable();
            $table->string('cli_razao_social')->nullable();
            $table->date('cli_data_nascimento')->nullable();
            $table->string('cli_endereco')->nullable();
            $table->string('cli_cidade')->nullable();
            $table->string('cli_estado')->nullable();
            $table->string('cli_cep')->nullable();
            $table->string('cli_status')->default('ativo'); // 'ativo', 'inativo', 'bloqueado'
            $table->text('cli_observacoes')->nullable();
            $table->timestamp('cli_created_at')->nullable();
            $table->timestamp('cli_updated_at')->nullable();
            $table->timestamp('cli_deleted_at')->nullable(); // Soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente');
    }
};

