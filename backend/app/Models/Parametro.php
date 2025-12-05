<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametro extends Model
{
   protected $table = 'parametro';
   protected $primaryKey = 'par_id';
   public $timestamps = false;

   protected $fillable = [
      'par_nome',
      'par_valor',
      'par_chave',
      'par_descricao',
      'par_tipo',
   ];
}
