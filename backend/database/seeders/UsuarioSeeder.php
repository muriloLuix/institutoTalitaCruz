<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      // Array com os usuários a serem criados
      $usuarios = [
         [
            'usu_nome' => 'Murilo Luiz Jaboinski',
            'usu_email' => 'contato@kisky.com.br',
            'usu_password' => 'Mury1204*',
         ],
         [
            'usu_nome' => 'Talita Cruz',
            'usu_email' => 'email@exemplo.com',
            'usu_password' => 'Admin123',
         ],
      ];

      foreach ($usuarios as $usuarioData) {
         $usuarioExists = User::where('usu_email', $usuarioData['usu_email'])->exists();

         if (!$usuarioExists) {
            User::create([
               'usu_nome' => $usuarioData['usu_nome'],
               'usu_email' => $usuarioData['usu_email'],
               'usu_password' => Hash::make($usuarioData['usu_password']),
               'usu_email_verified_at' => now(),
            ]);

            $this->command->info("✅ Usuário '{$usuarioData['usu_nome']}' criado com sucesso!");
            $this->command->info("   Email: {$usuarioData['usu_email']}");
            $this->command->info("   Senha: {$usuarioData['usu_password']}");
         } else {
            $this->command->warn("⚠️  Usuário '{$usuarioData['usu_nome']}' já existe no banco de dados.");
         }
      }

      $this->command->newLine();
      $this->command->warn('⚠️  IMPORTANTE: Altere as senhas após o primeiro login!');
   }
}
