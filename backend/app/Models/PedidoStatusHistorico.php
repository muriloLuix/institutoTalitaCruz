<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoStatusHistorico extends Model
{
   protected $table = 'pedido_status_historico';
   protected $primaryKey = 'psh_id';
   public $timestamps = false;

   const CREATED_AT = 'psh_created_at';

   protected $fillable = [
      'psh_pedido_id',
      'psh_status_anterior',
      'psh_status_novo',
      'psh_observacoes',
      'psh_dados_webhook',
   ];

   protected $casts = [
      'psh_dados_webhook' => 'array',
   ];

   /**
    * Relacionamento com Pedido
    */
   public function pedido()
   {
      return $this->belongsTo(Pedido::class, 'psh_pedido_id', 'ped_id');
   }
}
