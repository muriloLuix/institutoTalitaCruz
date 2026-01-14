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
        Schema::create('carrinho_item', function (Blueprint $table) {
            $table->bigIncrements('car_id');
            $table->string('car_session_id', 100)->index(); // Para identificar visitantes
            $table->unsignedBigInteger('usu_id')->nullable()->index(); // Para quando houver autenticação de clientes
            $table->unsignedBigInteger('pro_id');
            $table->integer('car_quantidade')->default(1);
            $table->decimal('car_preco_unitario', 10, 2); // Preço no momento da adição (histórico)
            $table->timestamp('car_created_at')->nullable();
            $table->timestamp('car_updated_at')->nullable();
            
            // Foreign keys
            $table->foreign('pro_id')->references('pro_id')->on('produto')->onDelete('cascade');
            $table->foreign('usu_id')->references('usu_id')->on('usuario')->onDelete('cascade');
            
            // Índice único para evitar duplicatas (mesmo produto na mesma sessão/usuário)
            $table->unique(['car_session_id', 'pro_id'], 'carrinho_session_produto_unique');
            $table->unique(['usu_id', 'pro_id'], 'carrinho_usuario_produto_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrinho_item');
    }
};
