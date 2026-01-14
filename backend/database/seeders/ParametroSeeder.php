<?php

namespace Database\Seeders;

use App\Models\Parametro;
use Illuminate\Database\Seeder;

class ParametroSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $parametros = [
         [
            'par_nome' => 'Nome do Site',
            'par_valor' => 'Instituto Talita Cruz',
            'par_chave' => 'site_nome',
            'par_descricao' => 'Nome do site exibido no título da página e no painel administrativo',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Site',
            'par_valor' => 'Aprenda inglês com excelência e transforme seu futuro',
            'par_chave' => 'site_descricao',
            'par_descricao' => 'Descrição do site usada em meta tags para SEO (aparece no Google)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'URL da Logo',
            'par_valor' => '..\public\images\logos\logoFooter.png',
            'par_chave' => 'site_logo_url',
            'par_descricao' => 'URL da logo principal do site (exibida no header e footer)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'URL da Página (Favicon)',
            'par_valor' => '',
            'par_chave' => 'site_favicon_url',
            'par_descricao' => 'URL do favicon (ícone exibido na aba do navegador)',
            'par_tipo' => 'geral',
         ],
         // Parâmetros de Contato
         [
            'par_nome' => 'E-mail de Contato',
            'par_valor' => 'contato@institutotalitacruz.com.br',
            'par_chave' => 'contato_email',
            'par_descricao' => 'E-mail principal para contato (exibido na página de contato)',
            'par_tipo' => 'contato',
         ],
         [
            'par_nome' => 'WhatsApp',
            'par_valor' => '(00) 00000-0000',
            'par_chave' => 'contato_whatsapp',
            'par_descricao' => 'Número do WhatsApp formatado (exibido na página de contato)',
            'par_tipo' => 'contato',
         ],
         [
            'par_nome' => 'Número WhatsApp (Link)',
            'par_valor' => '5500000000000',
            'par_chave' => 'contato_whatsapp_numero',
            'par_descricao' => 'Número do WhatsApp apenas com números (para criar link clicável, formato: 55DDDNUMERO sem espaços ou caracteres especiais)',
            'par_tipo' => 'contato',
         ],
         [
            'par_nome' => 'Horário de Funcionamento - Semana',
            'par_valor' => 'Segunda a Sexta: 9h às 18h',
            'par_chave' => 'contato_horario_semana',
            'par_descricao' => 'Horário de funcionamento de segunda a sexta-feira',
            'par_tipo' => 'contato',
         ],
         [
            'par_nome' => 'Horário de Funcionamento - Sábado',
            'par_valor' => 'Sábado: 9h às 13h',
            'par_chave' => 'contato_horario_sabado',
            'par_descricao' => 'Horário de funcionamento aos sábados',
            'par_tipo' => 'contato',
         ],
         // Parâmetros de Redes Sociais
         [
            'par_nome' => 'Instagram',
            'par_valor' => '',
            'par_chave' => 'contato_instagram',
            'par_descricao' => 'URL do perfil do Instagram (ex: https://instagram.com/usuario)',
            'par_tipo' => 'redes-sociais',
         ],
         [
            'par_nome' => 'Facebook',
            'par_valor' => '',
            'par_chave' => 'contato_facebook',
            'par_descricao' => 'URL da página do Facebook (ex: https://facebook.com/pagina)',
            'par_tipo' => 'redes-sociais',
         ],
         [
            'par_nome' => 'YouTube',
            'par_valor' => '',
            'par_chave' => 'contato_youtube',
            'par_descricao' => 'URL do canal do YouTube (ex: https://youtube.com/@usuario)',
            'par_tipo' => 'redes-sociais',
         ],
         [
            'par_nome' => 'LinkedIn',
            'par_valor' => '',
            'par_chave' => 'contato_linkedin',
            'par_descricao' => 'URL do perfil do LinkedIn (ex: https://linkedin.com/in/usuario)',
            'par_tipo' => 'redes-sociais',
         ],
         [
            'par_nome' => 'TikTok',
            'par_valor' => '',
            'par_chave' => 'contato_tiktok',
            'par_descricao' => 'URL do perfil do TikTok (ex: https://tiktok.com/@usuario)',
            'par_tipo' => 'redes-sociais',
         ],
         [
            'par_nome' => 'Twitter/X',
            'par_valor' => '',
            'par_chave' => 'contato_twitter',
            'par_descricao' => 'URL do perfil do Twitter/X (ex: https://twitter.com/usuario)',
            'par_tipo' => 'redes-sociais',
         ],
         // Parâmetros de Integrações
         [
            'par_nome' => 'Hotmart - API Key',
            'par_valor' => '',
            'par_chave' => 'hotmart_api_key',
            'par_descricao' => 'Chave de API do Hotmart para integração (obtida no painel do Hotmart)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Hotmart - API Secret',
            'par_valor' => '',
            'par_chave' => 'hotmart_api_secret',
            'par_descricao' => 'Secret da API do Hotmart (mantenha em segurança, não compartilhe)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Hotmart - URL do Produto',
            'par_valor' => '',
            'par_chave' => 'hotmart_url',
            'par_descricao' => 'URL do produto/página no Hotmart (ex: https://pay.hotmart.com/...)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Hotmart - Webhook Secret',
            'par_valor' => '',
            'par_chave' => 'hotmart_webhook_secret',
            'par_descricao' => 'Secret do webhook do Hotmart para validação de eventos (opcional)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Chat - API Key',
            'par_valor' => '',
            'par_chave' => 'chat_api_key',
            'par_descricao' => 'Chave de API do serviço de chat (ex: OpenAI, Dialogflow, etc)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Chat - API URL',
            'par_valor' => '',
            'par_chave' => 'chat_api_url',
            'par_descricao' => 'URL base da API do chat (ex: https://api.openai.com/v1)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Chat - Modelo',
            'par_valor' => '',
            'par_chave' => 'chat_model',
            'par_descricao' => 'Modelo do chat a ser utilizado (ex: gpt-3.5-turbo, gpt-4, etc)',
            'par_tipo' => 'integracoes',
         ],
         [
            'par_nome' => 'Chat - Ativar Integração',
            'par_valor' => 'false',
            'par_chave' => 'chat_ativo',
            'par_descricao' => 'Ativa ou desativa a integração do chat (true/false)',
            'par_tipo' => 'integracoes',
         ],
         // Parâmetros do Card Hotmart
         [
            'par_nome' => 'Imagem de Fundo do Card Hotmart',
            'par_valor' => '',
            'par_chave' => 'hotmart_background_image',
            'par_descricao' => 'URL da imagem de fundo do card na seção "Produtos e Cursos Exclusivos"',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Badge do Card Hotmart',
            'par_valor' => 'Mais Vendido',
            'par_chave' => 'hotmart_card_badge',
            'par_descricao' => 'Texto do badge do card (ex: Mais Vendido)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card Hotmart',
            'par_valor' => 'Coleção Completa',
            'par_chave' => 'hotmart_card_titulo',
            'par_descricao' => 'Título principal do card',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card Hotmart',
            'par_valor' => 'Livros e materiais didáticos',
            'par_chave' => 'hotmart_card_descricao',
            'par_descricao' => 'Descrição/subtítulo do card',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Label do Preço do Card',
            'par_valor' => 'A partir de',
            'par_chave' => 'hotmart_card_preco_label',
            'par_descricao' => 'Texto antes do preço (ex: A partir de)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Preço do Card Hotmart',
            'par_valor' => 'R$ 99,90',
            'par_chave' => 'hotmart_card_preco',
            'par_descricao' => 'Valor do preço exibido no card',
            'par_tipo' => 'geral',
         ],
         // Parâmetros do Card de Bônus 1
         [
            'par_nome' => 'Ícone do Card de Bônus 1',
            'par_valor' => 'fas fa-heart',
            'par_chave' => 'bonus_card_1_icon',
            'par_descricao' => 'Classe do ícone Font Awesome para o card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card de Bônus 1',
            'par_valor' => 'Sessão Cortesia de Terapia',
            'par_chave' => 'bonus_card_1_titulo',
            'par_descricao' => 'Título principal do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Subtítulo do Card de Bônus 1',
            'par_valor' => 'Triagem Gratuita',
            'par_chave' => 'bonus_card_1_subtitulo',
            'par_descricao' => 'Subtítulo/badge do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card de Bônus 1',
            'par_valor' => 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.',
            'par_chave' => 'bonus_card_1_descricao',
            'par_descricao' => 'Descrição do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Features do Card de Bônus 1',
            'par_valor' => 'Avaliação personalizada,Identificação de necessidades,Plano de ação inicial',
            'par_chave' => 'bonus_card_1_features',
            'par_descricao' => 'Lista de features do card de bônus 1 (separadas por vírgula)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Texto do Botão do Card de Bônus 1',
            'par_valor' => 'Agendar Triagem',
            'par_chave' => 'bonus_card_1_cta',
            'par_descricao' => 'Texto do botão CTA do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Link do Botão do Card de Bônus 1',
            'par_valor' => '',
            'par_chave' => 'bonus_card_1_link',
            'par_descricao' => 'URL de destino do botão do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Imagem de Fundo do Card de Bônus 1',
            'par_valor' => 'http://localhost:5173/src/assets/images/pessoais/fotoEmPeComLivro.jpg',
            'par_chave' => 'bonus_card_1_background_image',
            'par_descricao' => 'URL da imagem de fundo do card de bônus 1',
            'par_tipo' => 'geral',
         ],
         // Parâmetros do Card de Bônus 2
         [
            'par_nome' => 'Ícone do Card de Bônus 2',
            'par_valor' => 'fas fa-graduation-cap',
            'par_chave' => 'bonus_card_2_icon',
            'par_descricao' => 'Classe do ícone Font Awesome para o card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card de Bônus 2',
            'par_valor' => 'Aula Demonstrativa',
            'par_chave' => 'bonus_card_2_titulo',
            'par_descricao' => 'Título principal do card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Subtítulo do Card de Bônus 2',
            'par_valor' => 'Experimente Grátis',
            'par_chave' => 'bonus_card_2_subtitulo',
            'par_descricao' => 'Subtítulo/badge do card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card de Bônus 2',
            'par_valor' => 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.',
            'par_chave' => 'bonus_card_2_descricao',
            'par_descricao' => 'Descrição do card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Features do Card de Bônus 2',
            'par_valor' => 'Métodos exclusivos,Aula interativa,Material didático incluso',
            'par_chave' => 'bonus_card_2_features',
            'par_descricao' => 'Lista de features do card de bônus 2 (separadas por vírgula)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Texto do Botão do Card de Bônus 2',
            'par_valor' => 'Agendar Aula Demo',
            'par_chave' => 'bonus_card_2_cta',
            'par_descricao' => 'Texto do botão CTA do card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Link do Botão do Card de Bônus 2',
            'par_valor' => 'https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit',
            'par_chave' => 'bonus_card_2_link',
            'par_descricao' => 'URL de destino do botão do card de bônus 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Imagem de Fundo do Card de Bônus 2',
            'par_valor' => 'http://localhost:5173/src/assets/images/pessoais/fotoEmPeOlhandoEsquerda.jpg',
            'par_chave' => 'bonus_card_2_background_image',
            'par_descricao' => 'URL da imagem de fundo do card de bônus 2',
            'par_tipo' => 'geral',
         ],
      ];

      foreach ($parametros as $parametro) {
         $exists = Parametro::where('par_chave', $parametro['par_chave'])->exists();

         if (!$exists) {
            Parametro::create($parametro);
            $this->command->info("✅ Parâmetro '{$parametro['par_nome']}' criado com sucesso!");
         } else {
            $this->command->warn("⚠️  Parâmetro '{$parametro['par_nome']}' já existe no banco de dados.");
         }
      }

      $this->command->newLine();
      $this->command->info('✅ Seeders de parâmetros concluída!');
   }
}
