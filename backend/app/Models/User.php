<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   /** @use HasFactory<\Database\Factories\UserFactory> */
   use HasFactory, Notifiable, HasApiTokens;

   /**
    * The table associated with the model.
    *
    * @var string
    */
   protected $table = 'usuario';

   /**
    * The primary key for the model.
    *
    * @var string
    */
   protected $primaryKey = 'usu_id';

   /**
    * Indicates if the model should be timestamped.
    *
    * @var bool
    */
   public $timestamps = true;

   /**
    * The name of the "created at" column.
    *
    * @var string
    */
   const CREATED_AT = 'usu_created_at';

   /**
    * The name of the "updated at" column.
    *
    * @var string
    */
   const UPDATED_AT = 'usu_updated_at';

   /**
    * The attributes that are mass assignable.
    *
    * @var list<string>
    */
   protected $fillable = [
      'usu_nome',
      'usu_email',
      'usu_password',
      'usu_tipo',
      'usu_ativo',
   ];

   /**
    * The attributes that should be hidden for serialization.
    *
    * @var list<string>
    */
   protected $hidden = [
      'usu_password',
      'usu_remember_token',
   ];

   /**
    * Get the attributes that should be cast.
    *
    * @return array<string, string>
    */
   protected function casts(): array
   {
      return [
         'usu_email_verified_at' => 'datetime',
         'usu_password' => 'hashed',
         'usu_ativo' => 'boolean',
      ];
   }

   /**
    * Get the name of the unique identifier for the user.
    *
    * @return string
    */
   public function getAuthIdentifierName()
   {
      return 'usu_email';
   }

   /**
    * Get the password for the user.
    *
    * @return string
    */
   public function getAuthPassword()
   {
      return $this->usu_password;
   }

   /**
    * Get the email address for authentication.
    *
    * @return string
    */
   public function getEmailForPasswordReset()
   {
      return $this->usu_email;
   }

   /**
    * Get the email address for verification.
    *
    * @return string
    */
   public function getEmailForVerification()
   {
      return $this->usu_email;
   }
}
