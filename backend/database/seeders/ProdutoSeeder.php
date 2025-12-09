<?php

namespace Database\Seeders;

use App\Models\Produto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProdutoSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $produtos = [
         [
            'pro_nome' => 'Livro: Inglês para Iniciantes',
            'pro_descricao' => 'Guia completo para começar sua jornada no inglês',
            'pro_descricao_completa' => 'Este livro é perfeito para quem está começando a aprender inglês. Com exercícios práticos, explicações claras e exemplos do dia a dia, você terá uma base sólida para desenvolver suas habilidades no idioma.',
            'pro_preco' => 99.90,
            'pro_imagem' => null,
            'pro_categoria' => 'livros',
            'pro_autor' => 'Talita Cruz',
            'pro_disponivel' => true,
            'pro_estoque' => 50,
            'pro_caracteristicas' => json_encode([
               'paginas' => 250,
               'idioma' => 'Português/Inglês',
               'formato' => 'Digital e Físico',
            ]),
            'pro_conteudo' => '20 capítulos com exercícios práticos, áudios para pronúncia, vocabulário essencial e dicas de estudo.',
            'pro_duracao' => null,
            'pro_nivel' => 'iniciante',
            'pro_destaque' => true,
            'pro_ordem' => 1,
            'pro_created_at' => Carbon::now()->subDays(30),
         ],
         [
            'pro_nome' => 'Mentoria Individual',
            'pro_descricao' => 'Acompanhamento personalizado 1 a 1',
            'pro_descricao_completa' => 'Sessões individuais de mentoria com foco nas suas necessidades específicas. Desenvolvemos um plano de estudos personalizado e acompanhamos seu progresso de perto.',
            'pro_preco' => 299.90,
            'pro_imagem' => null,
            'pro_categoria' => 'mentorias',
            'pro_autor' => 'Talita Cruz',
            'pro_disponivel' => true,
            'pro_estoque' => null,
            'pro_caracteristicas' => json_encode([
               'sessoes' => '4 sessões mensais',
               'duracao_sessao' => '1 hora',
               'plataforma' => 'Online',
            ]),
            'pro_conteudo' => 'Plano de estudos personalizado, correção de exercícios, prática de conversação, feedback detalhado e materiais exclusivos.',
            'pro_duracao' => '4 horas/mês',
            'pro_nivel' => null,
            'pro_destaque' => true,
            'pro_ordem' => 2,
            'pro_created_at' => Carbon::now()->subDays(25),
         ],
         [
            'pro_nome' => 'Curso Completo de Inglês',
            'pro_descricao' => 'Curso online com mais de 50 horas de conteúdo',
            'pro_descricao_completa' => 'Curso completo do básico ao avançado com mais de 50 horas de conteúdo em vídeo, exercícios interativos, certificado de conclusão e suporte durante todo o curso.',
            'pro_preco' => 499.90,
            'pro_imagem' => null,
            'pro_categoria' => 'cursos',
            'pro_autor' => 'Talita Cruz',
            'pro_disponivel' => true,
            'pro_estoque' => null,
            'pro_caracteristicas' => json_encode([
               'horas' => 50,
               'modulos' => 12,
               'certificado' => true,
               'acesso_vitalicio' => true,
            ]),
            'pro_conteudo' => '12 módulos completos, mais de 200 exercícios, áudios para download, material complementar em PDF e grupo exclusivo de alunos.',
            'pro_duracao' => '50 horas',
            'pro_nivel' => 'intermediario',
            'pro_destaque' => true,
            'pro_ordem' => 3,
            'pro_created_at' => Carbon::now()->subDays(20),
         ],
         [
            'pro_nome' => 'Pacote de Exercícios',
            'pro_descricao' => 'Mais de 200 exercícios práticos',
            'pro_descricao_completa' => 'Pacote completo com mais de 200 exercícios práticos de gramática, vocabulário, leitura e escrita. Ideal para praticar e fixar o conteúdo aprendido.',
            'pro_preco' => 49.90,
            'pro_imagem' => null,
            'pro_categoria' => 'materiais',
            'pro_autor' => 'Talita Cruz',
            'pro_disponivel' => true,
            'pro_estoque' => null,
            'pro_caracteristicas' => json_encode([
               'exercicios' => 200,
               'gabarito' => true,
               'formato' => 'PDF',
            ]),
            'pro_conteudo' => '200+ exercícios organizados por nível, gabarito completo, explicações detalhadas e dicas de estudo.',
            'pro_duracao' => null,
            'pro_nivel' => null,
            'pro_destaque' => false,
            'pro_ordem' => 4,
            'pro_created_at' => Carbon::now()->subDays(15),
         ],
         [
            'pro_nome' => 'Livro: Pronúncia Perfeita',
            'pro_descricao' => 'Domine a pronúncia do inglês americano',
            'pro_descricao_completa' => 'Aprenda a pronunciar corretamente o inglês americano com este guia completo. Inclui áudios, exercícios práticos e técnicas de pronúncia.',
            'pro_preco' => 129.90,
            'pro_imagem' => null,
            'pro_categoria' => 'livros',
            'pro_autor' => 'Maria Silva',
            'pro_disponivel' => true,
            'pro_estoque' => 30,
            'pro_caracteristicas' => json_encode([
               'paginas' => 180,
               'audios' => true,
               'formato' => 'Digital e Físico',
            ]),
            'pro_conteudo' => 'Guia completo de pronúncia, áudios nativos, exercícios práticos e técnicas avançadas.',
            'pro_duracao' => null,
            'pro_nivel' => 'avancado',
            'pro_destaque' => false,
            'pro_ordem' => 5,
            'pro_created_at' => Carbon::now()->subDays(10),
         ],
         [
            'pro_nome' => 'Curso Avançado de Gramática',
            'pro_descricao' => 'Aprofunde seus conhecimentos gramaticais',
            'pro_descricao_completa' => 'Curso focado em gramática avançada para quem já tem uma base sólida no inglês. Aprenda estruturas complexas e nuances do idioma.',
            'pro_preco' => 399.90,
            'pro_imagem' => null,
            'pro_categoria' => 'cursos',
            'pro_autor' => 'João Santos',
            'pro_disponivel' => false,
            'pro_estoque' => null,
            'pro_caracteristicas' => json_encode([
               'horas' => 30,
               'modulos' => 8,
               'certificado' => true,
            ]),
            'pro_conteudo' => '8 módulos avançados, exercícios complexos, análise de textos e certificado de conclusão.',
            'pro_duracao' => '30 horas',
            'pro_nivel' => 'avancado',
            'pro_destaque' => false,
            'pro_ordem' => 6,
            'pro_created_at' => Carbon::now()->subDays(5),
         ],
      ];

      foreach ($produtos as $produto) {
         $exists = Produto::where('pro_nome', $produto['pro_nome'])->exists();
         
         if (!$exists) {
            Produto::create($produto);
            $this->command->info("✅ Produto '{$produto['pro_nome']}' criado com sucesso!");
         } else {
            $this->command->warn("⚠️  Produto '{$produto['pro_nome']}' já existe no banco de dados.");
         }
      }

      $this->command->newLine();
      $this->command->info('✅ Seeders de produtos concluída!');
   }
}

