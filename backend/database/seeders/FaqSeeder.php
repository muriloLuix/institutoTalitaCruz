<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $faqs = [
         [
            'faq_pergunta' => 'Como funciona o método de ensino?',
            'faq_resposta' => 'Nosso método é baseado em técnicas comprovadas que combinam teoria e prática, focando na comunicação real e no aprendizado progressivo. Cada aluno recebe atenção personalizada para garantir o melhor resultado.',
            'faq_ordem' => 1,
            'faq_ativo' => true,
         ],
         [
            'faq_pergunta' => 'Preciso ter conhecimento prévio de inglês?',
            'faq_resposta' => 'Não! Nossos cursos e materiais são desenvolvidos para todos os níveis, desde iniciantes até avançados. Você pode começar do zero e evoluir no seu próprio ritmo.',
            'faq_ordem' => 2,
            'faq_ativo' => true,
         ],
         [
            'faq_pergunta' => 'Como acesso os materiais após a compra?',
            'faq_resposta' => 'Após a confirmação da compra, você receberá um e-mail com todas as instruções de acesso. Os materiais digitais ficam disponíveis imediatamente, e os físicos são enviados pelos Correios.',
            'faq_ordem' => 3,
            'faq_ativo' => true,
         ],
         [
            'faq_pergunta' => 'As mentorias são individuais ou em grupo?',
            'faq_resposta' => 'Oferecemos ambos os formatos! Você pode escolher entre mentorias individuais para um acompanhamento mais personalizado, ou mentorias em grupo para interagir com outros alunos.',
            'faq_ordem' => 4,
            'faq_ativo' => true,
         ],
         [
            'faq_pergunta' => 'Qual a duração dos cursos?',
            'faq_resposta' => 'A duração varia conforme o curso escolhido. Alguns são de curta duração (4-6 semanas) e outros são mais extensos (3-6 meses). Todos os cursos podem ser acessados por tempo ilimitado após a compra.',
            'faq_ordem' => 5,
            'faq_ativo' => true,
         ],
         [
            'faq_pergunta' => 'Há suporte após a compra?',
            'faq_resposta' => 'Sim! Oferecemos suporte completo através do nosso chat online, e-mail e também temos uma seção de perguntas frequentes. Estamos sempre disponíveis para ajudar você em sua jornada de aprendizado.',
            'faq_ordem' => 6,
            'faq_ativo' => true,
         ],
      ];

      foreach ($faqs as $faq) {
         Faq::create($faq);
      }
   }
}
