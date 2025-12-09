<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produto extends Model
{
   use SoftDeletes;

   protected $table = 'produto';
   protected $primaryKey = 'pro_id';
   public $timestamps = true;

   const CREATED_AT = 'pro_created_at';
   const UPDATED_AT = 'pro_updated_at';
   const DELETED_AT = 'pro_deleted_at';

   protected $fillable = [
      'pro_nome',
      'pro_descricao',
      'pro_descricao_completa',
      'pro_preco',
      'pro_imagem',
      'pro_categoria',
      'pro_autor',
      'pro_disponivel',
      'pro_estoque',
      'pro_visualizacoes',
      'pro_vendas',
      'pro_avaliacao_media',
      'pro_numero_avaliacoes',
      'pro_caracteristicas',
      'pro_conteudo',
      'pro_duracao',
      'pro_nivel',
      'pro_destaque',
      'pro_ordem',
   ];

   protected $casts = [
      'pro_preco' => 'decimal:2',
      'pro_disponivel' => 'boolean',
      'pro_destaque' => 'boolean',
      'pro_avaliacao_media' => 'decimal:2',
      'pro_caracteristicas' => 'array',
   ];

   /**
    * Scope para buscar apenas produtos disponíveis
    */
   public function scopeDisponiveis($query)
   {
      return $query->where('pro_disponivel', true);
   }

   /**
    * Scope para buscar produtos em destaque
    */
   public function scopeDestaque($query)
   {
      return $query->where('pro_destaque', true);
   }

   /**
    * Scope para filtrar por categoria
    */
   public function scopePorCategoria($query, $categoria)
   {
      if ($categoria && $categoria !== 'todos') {
         return $query->where('pro_categoria', $categoria);
      }
      return $query;
   }

   /**
    * Incrementa visualizações
    */
   public function incrementarVisualizacoes()
   {
      $this->increment('pro_visualizacoes');
   }

   /**
    * Relacionamento com imagens
    */
   public function imagens()
   {
      return $this->hasMany(ProdutoImagem::class, 'pim_produto_id', 'pro_id')
                  ->orderBy('pim_ordem')
                  ->orderBy('pim_capa', 'desc');
   }

   /**
    * Retorna a imagem de capa
    */
   public function imagemCapa()
   {
      return $this->hasOne(ProdutoImagem::class, 'pim_produto_id', 'pro_id')
                  ->where('pim_capa', true)
                  ->orWhere(function ($query) {
                     $query->orderBy('pim_ordem')->limit(1);
                  });
   }
}

