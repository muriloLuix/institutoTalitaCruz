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
        Schema::create('biografia', function (Blueprint $table) {
            $table->id('bio_id');
            $table->string('bio_nome');
            $table->text('bio_descricao');
            $table->string('bio_imagem')->nullable();
            $table->integer('bio_alunos')->default(0);
            $table->integer('bio_anos_experiencia')->default(0);
            $table->string('bio_dedicacao')->default('100%');
            $table->boolean('bio_ativo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biografia');
    }
};
