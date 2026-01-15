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
        Schema::create('pedido_status_historico', function (Blueprint $table) {
            $table->bigIncrements('psh_id');
            $table->unsignedBigInteger('psh_pedido_id'); // ID do pedido
            $table->string('psh_status_anterior')->nullable(); // Status anterior
            $table->string('psh_status_novo'); // Novo status
            $table->text('psh_observacoes')->nullable(); // Observações sobre a mudança
            $table->text('psh_dados_webhook')->nullable(); // Dados do webhook que causou a mudança (JSON)
            $table->timestamp('psh_created_at')->nullable();

            // Foreign key
            $table->foreign('psh_pedido_id')->references('ped_id')->on('pedido')->onDelete('cascade');

            // Indexes
            $table->index('psh_pedido_id');
            $table->index('psh_status_novo');
            $table->index('psh_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_status_historico');
    }
};
