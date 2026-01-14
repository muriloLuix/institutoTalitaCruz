<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarrinhoItem extends Model
{
   protected $table = 'carrinho_item';
   protected $primaryKey = 'car_id';
   public $timestamps = true;

   const CREATED_AT = 'car_created_at';
   const UPDATED_AT = 'car_updated_at';

   protected $fillable = [
      'car_session_id',
      'usu_id',
      'pro_id',
      'car_quantidade',
      'car_preco_unitario',
   ];

   protected $casts = [
      'car_quantidade' => 'integer',
      'car_preco_unitario' => 'decimal:2',
   ];

   /**
    * Relacionamento com produto
    */
   public function produto()
   {
      return $this->belongsTo(Produto::class, 'pro_id', 'pro_id');
   }

   /**
    * Relacionamento com usuário (opcional)
    */
   public function usuario()
   {
      return $this->belongsTo(User::class, 'usu_id', 'usu_id');
   }

   /**
    * Scope para buscar itens por session_id
    */
   public function scopePorSession($query, $sessionId)
   {
      return $query->where('car_session_id', $sessionId);
   }

   /**
    * Scope para buscar itens por usuário
    */
   public function scopePorUsuario($query, $userId)
   {
      return $query->where('usu_id', $userId);
   }

   /**
    * Calcula o total do item (quantidade * preço unitário)
    */
   public function getTotalAttribute()
   {
      return $this->car_quantidade * $this->car_preco_unitario;
   }
}
