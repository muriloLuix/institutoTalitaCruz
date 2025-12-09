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
        Schema::create('produto_imagem', function (Blueprint $table) {
            $table->bigIncrements('pim_id');
            $table->unsignedBigInteger('pim_produto_id');
            $table->string('pim_nome_arquivo'); // Nome do arquivo original
            $table->string('pim_caminho'); // Caminho relativo (produtos/{id}/imagem.jpg)
            $table->integer('pim_ordem')->default(0); // Para ordenar as imagens
            $table->boolean('pim_capa')->default(false); // Se é a imagem de capa
            $table->timestamp('pim_created_at')->nullable();
            $table->timestamp('pim_updated_at')->nullable();
            
            $table->foreign('pim_produto_id')
                  ->references('pro_id')
                  ->on('produto')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produto_imagem');
    }
};

