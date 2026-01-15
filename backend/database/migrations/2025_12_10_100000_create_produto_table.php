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
      Schema::create('produto', function (Blueprint $table) {
         $table->bigIncrements('pro_id');
         $table->string('pro_nome');
         $table->text('pro_descricao');
         $table->text('pro_descricao_completa')->nullable();
         $table->decimal('pro_preco', 10, 2);
         $table->string('pro_imagem')->nullable();
         $table->string('pro_categoria'); // 'livros', 'mentorias', 'cursos', 'materiais'
         $table->string('pro_autor')->nullable();
         $table->boolean('pro_disponivel')->default(true);
         $table->integer('pro_estoque')->default(0)->nullable(); // Para produtos físicos
         $table->integer('pro_visualizacoes')->default(0);
         $table->integer('pro_vendas')->default(0);
         $table->decimal('pro_avaliacao_media', 3, 2)->default(0)->nullable();
         $table->integer('pro_numero_avaliacoes')->default(0);
         $table->text('pro_caracteristicas')->nullable(); // JSON com características do produto
         $table->text('pro_conteudo')->nullable(); // Descrição detalhada do conteúdo
         $table->string('pro_duracao')->nullable(); // Para cursos/mentorias
         $table->string('pro_nivel')->nullable(); // 'iniciante', 'intermediario', 'avancado'
         $table->boolean('pro_destaque')->default(false);
         $table->integer('pro_ordem')->default(0); // Para ordenação personalizada
         $table->string('pro_checkout_hotmart'); // Link de pagamento Hotmart (obrigatório)
         $table->timestamp('pro_created_at')->nullable();
         $table->timestamp('pro_updated_at')->nullable();
         $table->timestamp('pro_deleted_at')->nullable(); // Soft delete
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::dropIfExists('produto');
   }
};
