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
