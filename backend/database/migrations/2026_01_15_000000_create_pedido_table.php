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
        Schema::create('pedido', function (Blueprint $table) {
            $table->bigIncrements('ped_id');
            $table->unsignedBigInteger('ped_cliente_id')->nullable(); // Cliente cadastrado (pode ser null)
            $table->unsignedBigInteger('ped_produto_id'); // Produto comprado
            $table->string('ped_status')->default('pendente'); // 'pendente', 'pago', 'cancelado', 'reembolsado', 'expirado'
            $table->decimal('ped_valor', 10, 2); // Valor pago
            $table->string('ped_transacao_hotmart')->nullable()->unique(); // ID da transação na Hotmart
            $table->string('ped_checkout_hotmart'); // Link de checkout usado
            $table->string('ped_email_comprador'); // Email do comprador (caso não tenha cliente cadastrado)
            $table->string('ped_nome_comprador'); // Nome do comprador
            $table->string('ped_telefone_comprador')->nullable(); // Telefone do comprador
            $table->text('ped_dados_webhook')->nullable(); // Dados completos do webhook da Hotmart (JSON)
            $table->timestamp('ped_data_compra')->nullable(); // Data/hora da compra
            $table->timestamp('ped_data_pagamento')->nullable(); // Data/hora do pagamento confirmado
            $table->timestamp('ped_data_cancelamento')->nullable(); // Data/hora do cancelamento
            $table->text('ped_observacoes')->nullable(); // Observações internas
            $table->timestamp('ped_created_at')->nullable();
            $table->timestamp('ped_updated_at')->nullable();
            $table->timestamp('ped_deleted_at')->nullable(); // Soft delete

            // Foreign keys
            $table->foreign('ped_cliente_id')->references('cli_id')->on('cliente')->onDelete('set null');
            $table->foreign('ped_produto_id')->references('pro_id')->on('produto')->onDelete('restrict');

            // Indexes
            $table->index('ped_status');
            $table->index('ped_transacao_hotmart');
            $table->index('ped_email_comprador');
            $table->index('ped_data_compra');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido');
    }
};
