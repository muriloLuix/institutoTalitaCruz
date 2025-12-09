<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;

class ProdutoImagem extends Model
{
   protected $table = 'produto_imagem';
   protected $primaryKey = 'pim_id';
   public $timestamps = true;

   const CREATED_AT = 'pim_created_at';
   const UPDATED_AT = 'pim_updated_at';

   protected $fillable = [
      'pim_produto_id',
      'pim_nome_arquivo',
      'pim_caminho',
      'pim_ordem',
      'pim_capa',
   ];

   protected $casts = [
      'pim_capa' => 'boolean',
   ];

   /**
    * Relacionamento com Produto
    */
   public function produto()
   {
      return $this->belongsTo(Produto::class, 'pim_produto_id', 'pro_id');
   }

   /**
    * Retorna a URL completa da imagem
    * Usa APP_URL do .env ou a URL base da requisição atual
    */
   public function getUrlAttribute(): string
   {
      $appUrl = config('app.url');
      
      // Se não estiver configurado, tenta usar a URL base da requisição
      if (!$appUrl || $appUrl === 'http://localhost') {
         $appUrl = URL::to('/');
      }
      
      return rtrim($appUrl, '/') . '/storage/' . ltrim($this->pim_caminho, '/');
   }
}

