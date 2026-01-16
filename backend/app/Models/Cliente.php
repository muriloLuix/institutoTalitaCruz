<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Cliente extends Authenticatable
{
   use SoftDeletes, HasApiTokens;

   protected $table = 'cliente';
   protected $primaryKey = 'cli_id';
   public $timestamps = true;

   const CREATED_AT = 'cli_created_at';
   const UPDATED_AT = 'cli_updated_at';
   const DELETED_AT = 'cli_deleted_at';

   protected $fillable = [
      'cli_nome',
      'cli_email',
      'cli_password',
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

   protected $hidden = [
      'cli_password',
   ];

   protected $casts = [
      'cli_data_nascimento' => 'date',
      'cli_password' => 'hashed',
   ];

   /**
    * Get the name of the unique identifier for the user.
    */
   public function getAuthIdentifierName()
   {
      return 'cli_email';
   }

   /**
    * Get the password for the user.
    */
   public function getAuthPassword()
   {
      return $this->cli_password;
   }

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

