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
        Schema::create('contato', function (Blueprint $table) {
            $table->id('con_id');
            $table->string('con_nome');
            $table->string('con_email');
            $table->string('con_telefone');
            $table->string('con_mensagem');
            $table->timestamp('con_created_at')->nullable();
            $table->timestamp('con_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contato');
    }
};
