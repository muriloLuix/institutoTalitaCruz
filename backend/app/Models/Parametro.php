<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametro extends Model
{
   protected $table = 'parametro';
   protected $primaryKey = 'par_id';
   public $timestamps = true;

   protected $fillable = [
      'par_nome',
      'par_valor',
      'par_chave',
      'par_descricao',
      'par_tipo',
   ];

   /**
    * Busca um parâmetro pela chave
    */
   public static function getByChave(string $chave): ?string
   {
      $parametro = self::where('par_chave', $chave)->first();
      return $parametro ? $parametro->par_valor : null;
   }
}
