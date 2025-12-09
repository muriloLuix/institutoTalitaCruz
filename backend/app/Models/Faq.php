<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
   protected $table = 'faq';
   protected $primaryKey = 'faq_id';
   public $timestamps = true;

   const CREATED_AT = 'created_at';
   const UPDATED_AT = 'updated_at';

   protected $fillable = [
      'faq_pergunta',
      'faq_resposta',
      'faq_ordem',
      'faq_ativo',
   ];

   protected $casts = [
      'faq_ativo' => 'boolean',
      'faq_ordem' => 'integer',
   ];

   /**
    * Scope para buscar apenas FAQs ativos
    */
   public function scopeAtivos($query)
   {
      return $query->where('faq_ativo', true);
   }

   /**
    * Scope para ordenar por ordem
    */
   public function scopeOrdenados($query)
   {
      return $query->orderBy('faq_ordem', 'asc');
   }
}
