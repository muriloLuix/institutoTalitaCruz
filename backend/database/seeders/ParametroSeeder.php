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
         // Parâmetros de Manutenção
         [
            'par_nome' => 'Manutenção Ativa',
            'par_valor' => '0',
            'par_chave' => 'manutencao_ativa',
            'par_descricao' => 'Ativa ou desativa o modo de manutenção do site. Quando ativo, apenas IPs cadastrados podem acessar o site. Use 1 para ativar e 0 para desativar.',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'IPs Permitidos Durante Manutenção',
            'par_valor' => '',
            'par_chave' => 'manutencao_ips_permitidos',
            'par_descricao' => 'Lista de IPs que podem acessar o site durante a manutenção. Separe por vírgula ou um por linha. Exemplo: 192.168.1.1, 10.0.0.1',
            'par_tipo' => 'geral',
         ],
         // Parâmetros dos Cards Hotmart (3 cards)
         // Card 1
         [
            'par_nome' => 'Badge do Card Hotmart 1',
            'par_valor' => 'Mais Vendido',
            'par_chave' => 'hotmart_card_1_badge',
            'par_descricao' => 'Texto do badge do card 1 (ex: Mais Vendido)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card Hotmart 1',
            'par_valor' => 'Coleção Completa',
            'par_chave' => 'hotmart_card_1_titulo',
            'par_descricao' => 'Título principal do card 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card Hotmart 1',
            'par_valor' => 'Livros e materiais didáticos',
            'par_chave' => 'hotmart_card_1_descricao',
            'par_descricao' => 'Descrição/subtítulo do card 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Label do Preço do Card 1',
            'par_valor' => 'A partir de',
            'par_chave' => 'hotmart_card_1_preco_label',
            'par_descricao' => 'Texto antes do preço do card 1 (ex: A partir de)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Preço do Card Hotmart 1',
            'par_valor' => 'R$ 99,90',
            'par_chave' => 'hotmart_card_1_preco',
            'par_descricao' => 'Valor do preço exibido no card 1',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Link do Botão do Card Hotmart 1',
            'par_valor' => '/loja',
            'par_chave' => 'hotmart_card_1_botao_link',
            'par_descricao' => 'URL de destino do botão "Ver produto na loja" do card 1 (ex: /loja para rota interna ou https://... para link externo)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Imagem de Fundo do Card Hotmart 1',
            'par_valor' => '',
            'par_chave' => 'hotmart_card_1_background_image',
            'par_descricao' => 'URL da imagem de fundo do card Hotmart 1',
            'par_tipo' => 'geral',
         ],
         // Card 2
         [
            'par_nome' => 'Badge do Card Hotmart 2',
            'par_valor' => 'Novidade',
            'par_chave' => 'hotmart_card_2_badge',
            'par_descricao' => 'Texto do badge do card 2 (ex: Novidade)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card Hotmart 2',
            'par_valor' => 'Curso Premium',
            'par_chave' => 'hotmart_card_2_titulo',
            'par_descricao' => 'Título principal do card 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card Hotmart 2',
            'par_valor' => 'Aprenda com os melhores',
            'par_chave' => 'hotmart_card_2_descricao',
            'par_descricao' => 'Descrição/subtítulo do card 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Label do Preço do Card 2',
            'par_valor' => 'A partir de',
            'par_chave' => 'hotmart_card_2_preco_label',
            'par_descricao' => 'Texto antes do preço do card 2 (ex: A partir de)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Preço do Card Hotmart 2',
            'par_valor' => 'R$ 149,90',
            'par_chave' => 'hotmart_card_2_preco',
            'par_descricao' => 'Valor do preço exibido no card 2',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Link do Botão do Card Hotmart 2',
            'par_valor' => '/loja',
            'par_chave' => 'hotmart_card_2_botao_link',
            'par_descricao' => 'URL de destino do botão "Ver produto na loja" do card 2 (ex: /loja para rota interna ou https://... para link externo)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Imagem de Fundo do Card Hotmart 2',
            'par_valor' => '',
            'par_chave' => 'hotmart_card_2_background_image',
            'par_descricao' => 'URL da imagem de fundo do card Hotmart 2',
            'par_tipo' => 'geral',
         ],
         // Card 3
         [
            'par_nome' => 'Badge do Card Hotmart 3',
            'par_valor' => 'Destaque',
            'par_chave' => 'hotmart_card_3_badge',
            'par_descricao' => 'Texto do badge do card 3 (ex: Destaque)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Título do Card Hotmart 3',
            'par_valor' => 'Mentoria Exclusiva',
            'par_chave' => 'hotmart_card_3_titulo',
            'par_descricao' => 'Título principal do card 3',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Descrição do Card Hotmart 3',
            'par_valor' => 'Transforme sua carreira',
            'par_chave' => 'hotmart_card_3_descricao',
            'par_descricao' => 'Descrição/subtítulo do card 3',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Label do Preço do Card 3',
            'par_valor' => 'A partir de',
            'par_chave' => 'hotmart_card_3_preco_label',
            'par_descricao' => 'Texto antes do preço do card 3 (ex: A partir de)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Preço do Card Hotmart 3',
            'par_valor' => 'R$ 199,90',
            'par_chave' => 'hotmart_card_3_preco',
            'par_descricao' => 'Valor do preço exibido no card 3',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Link do Botão do Card Hotmart 3',
            'par_valor' => '/loja',
            'par_chave' => 'hotmart_card_3_botao_link',
            'par_descricao' => 'URL de destino do botão "Ver produto na loja" do card 3 (ex: /loja para rota interna ou https://... para link externo)',
            'par_tipo' => 'geral',
         ],
         [
            'par_nome' => 'Imagem de Fundo do Card Hotmart 3',
            'par_valor' => '',
            'par_chave' => 'hotmart_card_3_background_image',
            'par_descricao' => 'URL da imagem de fundo do card Hotmart 3',
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
         // Parâmetro para total de avaliações
         [
            'par_nome' => 'Total de Avaliações',
            'par_valor' => '3',
            'par_chave' => 'avaliacao_total',
            'par_descricao' => 'Número total de avaliações cadastradas',
            'par_tipo' => 'avaliacoes',
         ],
         // Avaliação 1
         [
            'par_nome' => 'Nome do Cliente - Avaliação 1',
            'par_valor' => 'Maria Silva',
            'par_chave' => 'avaliacao_1_nome',
            'par_descricao' => 'Nome do cliente na avaliação 1',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Curso/Produto - Avaliação 1',
            'par_valor' => 'Mentoria Personalizada',
            'par_chave' => 'avaliacao_1_curso',
            'par_descricao' => 'Curso ou produto relacionado à avaliação 1',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Estrelas - Avaliação 1',
            'par_valor' => '5',
            'par_chave' => 'avaliacao_1_estrelas',
            'par_descricao' => 'Número de estrelas (1-5) da avaliação 1',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Mensagem - Avaliação 1',
            'par_valor' => 'A mentoria com a Talita transformou completamente minha vida profissional. Os insights e o acompanhamento foram fundamentais para eu alcançar meus objetivos. Recomendo de coração!',
            'par_chave' => 'avaliacao_1_mensagem',
            'par_descricao' => 'Mensagem/comentário da avaliação 1',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ativo - Avaliação 1',
            'par_valor' => '1',
            'par_chave' => 'avaliacao_1_ativo',
            'par_descricao' => 'Se a avaliação 1 está ativa',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ordem - Avaliação 1',
            'par_valor' => '1',
            'par_chave' => 'avaliacao_1_ordem',
            'par_descricao' => 'Ordem de exibição da avaliação 1',
            'par_tipo' => 'avaliacoes',
         ],
         // Avaliação 2
         [
            'par_nome' => 'Nome do Cliente - Avaliação 2',
            'par_valor' => 'João Santos',
            'par_chave' => 'avaliacao_2_nome',
            'par_descricao' => 'Nome do cliente na avaliação 2',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Curso/Produto - Avaliação 2',
            'par_valor' => 'Inglês Business',
            'par_chave' => 'avaliacao_2_curso',
            'par_descricao' => 'Curso ou produto relacionado à avaliação 2',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Estrelas - Avaliação 2',
            'par_valor' => '5',
            'par_chave' => 'avaliacao_2_estrelas',
            'par_descricao' => 'Número de estrelas (1-5) da avaliação 2',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Mensagem - Avaliação 2',
            'par_valor' => 'Excelente curso! Consegui melhorar muito meu inglês para reuniões e apresentações. A metodologia é prática e eficiente. Já estou aplicando no meu trabalho.',
            'par_chave' => 'avaliacao_2_mensagem',
            'par_descricao' => 'Mensagem/comentário da avaliação 2',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ativo - Avaliação 2',
            'par_valor' => '1',
            'par_chave' => 'avaliacao_2_ativo',
            'par_descricao' => 'Se a avaliação 2 está ativa',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ordem - Avaliação 2',
            'par_valor' => '2',
            'par_chave' => 'avaliacao_2_ordem',
            'par_descricao' => 'Ordem de exibição da avaliação 2',
            'par_tipo' => 'avaliacoes',
         ],
         // Avaliação 3
         [
            'par_nome' => 'Nome do Cliente - Avaliação 3',
            'par_valor' => 'Ana Costa',
            'par_chave' => 'avaliacao_3_nome',
            'par_descricao' => 'Nome do cliente na avaliação 3',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Curso/Produto - Avaliação 3',
            'par_valor' => 'Pacotes Terapêuticos',
            'par_chave' => 'avaliacao_3_curso',
            'par_descricao' => 'Curso ou produto relacionado à avaliação 3',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Estrelas - Avaliação 3',
            'par_valor' => '5',
            'par_chave' => 'avaliacao_3_estrelas',
            'par_descricao' => 'Número de estrelas (1-5) da avaliação 3',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Mensagem - Avaliação 3',
            'par_valor' => 'Os pacotes terapêuticos me ajudaram a superar desafios pessoais que carregava há anos. A abordagem é única e realmente funciona. Gratidão imensa!',
            'par_chave' => 'avaliacao_3_mensagem',
            'par_descricao' => 'Mensagem/comentário da avaliação 3',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ativo - Avaliação 3',
            'par_valor' => '1',
            'par_chave' => 'avaliacao_3_ativo',
            'par_descricao' => 'Se a avaliação 3 está ativa',
            'par_tipo' => 'avaliacoes',
         ],
         [
            'par_nome' => 'Ordem - Avaliação 3',
            'par_valor' => '3',
            'par_chave' => 'avaliacao_3_ordem',
            'par_descricao' => 'Ordem de exibição da avaliação 3',
            'par_tipo' => 'avaliacoes',
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
