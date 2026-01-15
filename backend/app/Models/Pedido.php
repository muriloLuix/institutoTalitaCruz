<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
   use SoftDeletes;

   protected $table = 'pedido';
   protected $primaryKey = 'ped_id';
   public $timestamps = true;

   const CREATED_AT = 'ped_created_at';
   const UPDATED_AT = 'ped_updated_at';
   const DELETED_AT = 'ped_deleted_at';

   protected $fillable = [
      'ped_cliente_id',
      'ped_produto_id',
      'ped_status',
      'ped_valor',
      'ped_transacao_hotmart',
      'ped_checkout_hotmart',
      'ped_email_comprador',
      'ped_nome_comprador',
      'ped_telefone_comprador',
      'ped_dados_webhook',
      'ped_data_compra',
      'ped_data_pagamento',
      'ped_data_cancelamento',
      'ped_observacoes',
   ];

   protected $casts = [
      'ped_valor' => 'decimal:2',
      'ped_data_compra' => 'datetime',
      'ped_data_pagamento' => 'datetime',
      'ped_data_cancelamento' => 'datetime',
      'ped_dados_webhook' => 'array',
   ];

   /**
    * Relacionamento com Cliente
    */
   public function cliente()
   {
      return $this->belongsTo(Cliente::class, 'ped_cliente_id', 'cli_id');
   }

   /**
    * Relacionamento com Produto
    */
   public function produto()
   {
      return $this->belongsTo(Produto::class, 'ped_produto_id', 'pro_id');
   }

   /**
    * Relacionamento com Histórico de Status
    */
   public function historicoStatus()
   {
      return $this->hasMany(PedidoStatusHistorico::class, 'psh_pedido_id', 'ped_id')
                  ->orderBy('psh_created_at', 'desc');
   }

   /**
    * Scope para buscar pedidos por status
    */
   public function scopePorStatus($query, $status)
   {
      return $query->where('ped_status', $status);
   }

   /**
    * Scope para buscar pedidos pagos
    */
   public function scopePagos($query)
   {
      return $query->where('ped_status', 'pago');
   }

   /**
    * Scope para buscar pedidos pendentes
    */
   public function scopePendentes($query)
   {
      return $query->where('ped_status', 'pendente');
   }

   /**
    * Scope para buscar pedidos por cliente
    */
   public function scopePorCliente($query, $clienteId)
   {
      return $query->where('ped_cliente_id', $clienteId);
   }

   /**
    * Scope para buscar pedidos por produto
    */
   public function scopePorProduto($query, $produtoId)
   {
      return $query->where('ped_produto_id', $produtoId);
   }

   /**
    * Scope para buscar pedidos por email
    */
   public function scopePorEmail($query, $email)
   {
      return $query->where('ped_email_comprador', $email);
   }

   /**
    * Atualiza o status do pedido e registra no histórico
    */
   public function atualizarStatus($novoStatus, $observacoes = null, $dadosWebhook = null)
   {
      $statusAnterior = $this->ped_status;
      
      $this->ped_status = $novoStatus;
      
      // Atualiza datas conforme o status
      if ($novoStatus === 'pago' && !$this->ped_data_pagamento) {
         $this->ped_data_pagamento = now();
      } elseif ($novoStatus === 'cancelado' && !$this->ped_data_cancelamento) {
         $this->ped_data_cancelamento = now();
      }
      
      $this->save();

      // Registra no histórico
      PedidoStatusHistorico::create([
         'psh_pedido_id' => $this->ped_id,
         'psh_status_anterior' => $statusAnterior,
         'psh_status_novo' => $novoStatus,
         'psh_observacoes' => $observacoes,
         'psh_dados_webhook' => $dadosWebhook ? json_encode($dadosWebhook) : null,
      ]);

      return $this;
   }
}
