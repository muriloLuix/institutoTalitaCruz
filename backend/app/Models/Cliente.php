<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
   use SoftDeletes;

   protected $table = 'cliente';
   protected $primaryKey = 'cli_id';
   public $timestamps = true;

   const CREATED_AT = 'cli_created_at';
   const UPDATED_AT = 'cli_updated_at';
   const DELETED_AT = 'cli_deleted_at';

   protected $fillable = [
      'cli_nome',
      'cli_email',
      'cli_tipo_pessoa',
      'cli_telefone',
      'cli_cpf',
      'cli_cnpj',
      'cli_razao_social',
      'cli_data_nascimento',
      'cli_endereco',
      'cli_cidade',
      'cli_estado',
      'cli_cep',
      'cli_status',
      'cli_observacoes',
   ];

   protected $casts = [
      'cli_data_nascimento' => 'date',
   ];

   /**
    * Scope para buscar apenas clientes ativos
    */
   public function scopeAtivos($query)
   {
      return $query->where('cli_status', 'ativo');
   }

   /**
    * Scope para buscar apenas clientes inativos
    */
   public function scopeInativos($query)
   {
      return $query->where('cli_status', 'inativo');
   }

   /**
    * Relacionamento com Pedidos
    */
   public function pedidos()
   {
      return $this->hasMany(Pedido::class, 'ped_cliente_id', 'cli_id');
   }
}

