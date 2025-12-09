<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biografia extends Model
{
   protected $table = 'biografia';
   protected $primaryKey = 'bio_id';
   public $timestamps = true;

   const CREATED_AT = 'created_at';
   const UPDATED_AT = 'updated_at';

   protected $fillable = [
      'bio_nome',
      'bio_descricao',
      'bio_imagem',
      'bio_alunos',
      'bio_anos_experiencia',
      'bio_dedicacao',
      'bio_ativo',
   ];

   protected $casts = [
      'bio_ativo' => 'boolean',
      'bio_alunos' => 'integer',
      'bio_anos_experiencia' => 'integer',
   ];

   /**
    * Scope para buscar apenas biografias ativas
    */
   public function scopeAtivas($query)
   {
      return $query->where('bio_ativo', true);
   }
}
