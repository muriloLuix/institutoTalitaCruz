<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ClienteSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $clientes = [
         // Pessoa Física
         [
            'cli_nome' => 'Maria Silva',
            'cli_email' => 'maria.silva@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(11) 98765-4321',
            'cli_cpf' => '123.456.789-00',
            'cli_data_nascimento' => '1990-05-15',
            'cli_endereco' => 'Rua das Flores, 123',
            'cli_cidade' => 'São Paulo',
            'cli_estado' => 'SP',
            'cli_cep' => '01234-567',
            'cli_status' => 'ativo',
            'cli_observacoes' => 'Cliente interessado em cursos de inglês avançado.',
            'cli_created_at' => Carbon::now()->subDays(30),
         ],
         [
            'cli_nome' => 'João Santos',
            'cli_email' => 'joao.santos@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(21) 99876-5432',
            'cli_cpf' => '987.654.321-00',
            'cli_data_nascimento' => '1985-08-22',
            'cli_endereco' => 'Avenida Principal, 456',
            'cli_cidade' => 'Rio de Janeiro',
            'cli_estado' => 'RJ',
            'cli_cep' => '20000-000',
            'cli_status' => 'ativo',
            'cli_observacoes' => null,
            'cli_created_at' => Carbon::now()->subDays(25),
         ],
         [
            'cli_nome' => 'Ana Costa',
            'cli_email' => 'ana.costa@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(31) 91234-5678',
            'cli_cpf' => '456.789.123-00',
            'cli_data_nascimento' => '1992-11-10',
            'cli_endereco' => 'Rua Central, 789',
            'cli_cidade' => 'Belo Horizonte',
            'cli_estado' => 'MG',
            'cli_cep' => '30000-000',
            'cli_status' => 'inativo',
            'cli_observacoes' => 'Cliente inativo há mais de 3 meses.',
            'cli_created_at' => Carbon::now()->subDays(60),
         ],
         [
            'cli_nome' => 'Pedro Oliveira',
            'cli_email' => 'pedro.oliveira@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(41) 98888-7777',
            'cli_cpf' => '789.123.456-00',
            'cli_data_nascimento' => '1988-03-05',
            'cli_endereco' => 'Avenida Brasil, 321',
            'cli_cidade' => 'Curitiba',
            'cli_estado' => 'PR',
            'cli_cep' => '80000-000',
            'cli_status' => 'ativo',
            'cli_observacoes' => 'Cliente VIP - desconto especial aplicado.',
            'cli_created_at' => Carbon::now()->subDays(15),
         ],
         [
            'cli_nome' => 'Carla Ferreira',
            'cli_email' => 'carla.ferreira@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(51) 97777-6666',
            'cli_cpf' => '321.654.987-00',
            'cli_data_nascimento' => '1995-07-18',
            'cli_endereco' => 'Rua dos Estudantes, 654',
            'cli_cidade' => 'Porto Alegre',
            'cli_estado' => 'RS',
            'cli_cep' => '90000-000',
            'cli_status' => 'bloqueado',
            'cli_observacoes' => 'Cliente bloqueado por inadimplência.',
            'cli_created_at' => Carbon::now()->subDays(90),
         ],
         [
            'cli_nome' => 'Roberto Alves',
            'cli_email' => 'roberto.alves@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(85) 96666-5555',
            'cli_cpf' => '654.321.789-00',
            'cli_data_nascimento' => '1987-12-25',
            'cli_endereco' => 'Avenida Beira Mar, 987',
            'cli_cidade' => 'Fortaleza',
            'cli_estado' => 'CE',
            'cli_cep' => '60000-000',
            'cli_status' => 'ativo',
            'cli_observacoes' => null,
            'cli_created_at' => Carbon::now()->subDays(10),
         ],
         [
            'cli_nome' => 'Juliana Lima',
            'cli_email' => 'juliana.lima@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(47) 95555-4444',
            'cli_cpf' => '147.258.369-00',
            'cli_data_nascimento' => '1993-04-30',
            'cli_endereco' => 'Rua da Praia, 147',
            'cli_cidade' => 'Florianópolis',
            'cli_estado' => 'SC',
            'cli_cep' => '88000-000',
            'cli_status' => 'ativo',
            'cli_observacoes' => 'Interessada em mentorias individuais.',
            'cli_created_at' => Carbon::now()->subDays(5),
         ],
         [
            'cli_nome' => 'Fernando Souza',
            'cli_email' => 'fernando.souza@email.com',
            'cli_tipo_pessoa' => 'fisica',
            'cli_telefone' => '(61) 94444-3333',
            'cli_cpf' => '258.369.147-00',
            'cli_data_nascimento' => '1991-09-12',
            'cli_endereco' => 'Quadra 100, Bloco A, Apto 101',
            'cli_cidade' => 'Brasília',
            'cli_estado' => 'DF',
            'cli_cep' => '70000-000',
            'cli_status' => 'inativo',
            'cli_observacoes' => null,
            'cli_created_at' => Carbon::now()->subDays(45),
         ],
         // Pessoa Jurídica
         [
            'cli_nome' => 'Tech Solutions LTDA',
            'cli_email' => 'contato@techsolutions.com.br',
            'cli_tipo_pessoa' => 'juridica',
            'cli_telefone' => '(11) 3456-7890',
            'cli_cnpj' => '12.345.678/0001-90',
            'cli_razao_social' => 'Tech Solutions Tecnologia LTDA',
            'cli_endereco' => 'Avenida Paulista, 1000',
            'cli_cidade' => 'São Paulo',
            'cli_estado' => 'SP',
            'cli_cep' => '01310-100',
            'cli_status' => 'ativo',
            'cli_observacoes' => 'Empresa interessada em treinamentos corporativos.',
            'cli_created_at' => Carbon::now()->subDays(20),
         ],
         [
            'cli_nome' => 'Educação & Cia',
            'cli_email' => 'comercial@educacaoecia.com.br',
            'cli_tipo_pessoa' => 'juridica',
            'cli_telefone' => '(21) 2345-6789',
            'cli_cnpj' => '98.765.432/0001-10',
            'cli_razao_social' => 'Educação & Cia Serviços Educacionais ME',
            'cli_endereco' => 'Rua do Ouvidor, 50',
            'cli_cidade' => 'Rio de Janeiro',
            'cli_estado' => 'RJ',
            'cli_cep' => '20040-030',
            'cli_status' => 'ativo',
            'cli_observacoes' => null,
            'cli_created_at' => Carbon::now()->subDays(12),
         ],
         [
            'cli_nome' => 'Instituto de Idiomas ABC',
            'cli_email' => 'contato@institutoabc.com.br',
            'cli_tipo_pessoa' => 'juridica',
            'cli_telefone' => '(31) 3456-7890',
            'cli_cnpj' => '11.222.333/0001-44',
            'cli_razao_social' => 'Instituto de Idiomas ABC EIRELI',
            'cli_endereco' => 'Avenida Afonso Pena, 3000',
            'cli_cidade' => 'Belo Horizonte',
            'cli_estado' => 'MG',
            'cli_cep' => '30130-009',
            'cli_status' => 'inativo',
            'cli_observacoes' => 'Parceria em negociação.',
            'cli_created_at' => Carbon::now()->subDays(50),
         ],
      ];

      foreach ($clientes as $cliente) {
         $exists = Cliente::where('cli_email', $cliente['cli_email'])->exists();
         
         if (!$exists) {
            Cliente::create($cliente);
            $this->command->info("✅ Cliente '{$cliente['cli_nome']}' criado com sucesso!");
         } else {
            $this->command->warn("⚠️  Cliente '{$cliente['cli_nome']}' já existe no banco de dados.");
         }
      }

      $this->command->newLine();
      $this->command->info('✅ Seeders de clientes concluída!');
   }
}

