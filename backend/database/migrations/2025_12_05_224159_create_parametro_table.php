<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   /**
    * Run the migrations.
    */
   public function up(): void
   {
      Schema::create('parametro', function (Blueprint $table) {
         $table->id('par_id');
         $table->string('par_nome');
         $table->string('par_valor');
         $table->string('par_chave');
         $table->string('par_descricao');
         $table->string('par_tipo');
         $table->timestamps();
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::dropIfExists('parametro');
   }
};
