<?php

namespace Database\Seeders;

use App\Models\Biografia;
use Illuminate\Database\Seeder;

class BiografiaSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $descricao = "Com anos de experiência no ensino de inglês, Talita Cruz dedica sua carreira a transformar a vida de seus alunos através de um método único e eficaz de aprendizado.\n\nSua paixão pelo ensino e comprometimento com a excelência fazem dela uma das coachs mais respeitadas na área, ajudando centenas de pessoas a alcançarem fluência no idioma inglês.\n\nAtravés de seus livros, cursos e mentorias, Talita compartilha conhecimento e técnicas comprovadas que aceleram o processo de aprendizado, tornando o inglês acessível para todos.";

      Biografia::create([
         'bio_nome' => 'Talita Cruz',
         'bio_descricao' => $descricao,
         'bio_imagem' => null, // Será configurado depois
         'bio_alunos' => 500,
         'bio_anos_experiencia' => 10,
         'bio_dedicacao' => '100%',
         'bio_ativo' => true,
      ]);
   }
}
