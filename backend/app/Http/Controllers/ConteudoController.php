<?php

namespace App\Http\Controllers;

use App\Models\Parametro;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class ConteudoController extends Controller
{
   /**
    * Retorna a URL completa para um arquivo no storage
    * Usa APP_URL do .env ou a URL base da requisição atual
    */
   private function getStorageUrl(string $path): string
   {
      $appUrl = config('app.url');
      
      // Se não estiver configurado, tenta usar a URL base da requisição
      if (!$appUrl || $appUrl === 'http://localhost') {
         $appUrl = URL::to('/');
      }
      
      return rtrim($appUrl, '/') . '/storage/' . ltrim($path, '/');
   }

   /**
    * Upload da imagem de fundo da seção Hotmart (admin)
    */
   public function uploadHotmartBackground(Request $request): JsonResponse
   {
      $request->validate([
         'imagem' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
      ], [
         'imagem.required' => 'É necessário enviar uma imagem.',
         'imagem.image' => 'O arquivo deve ser uma imagem.',
         'imagem.mimes' => 'A imagem deve ser do tipo: jpeg, jpg, png ou webp.',
         'imagem.max' => 'A imagem não pode ter mais de 5MB.',
      ]);

      try {
         $imagem = $request->file('imagem');
         $pasta = 'conteudo/hotmart';

         // Criar pasta se não existir
         if (!Storage::disk('public')->exists($pasta)) {
            Storage::disk('public')->makeDirectory($pasta);
         }

         // Buscar imagem antiga se existir
         $parametroAntigo = Parametro::where('par_chave', 'hotmart_background_image')->first();
         $imagemAntiga = null;
         if ($parametroAntigo && $parametroAntigo->par_valor) {
            // Extrair o caminho relativo da URL
            $urlAntiga = $parametroAntigo->par_valor;
            if (strpos($urlAntiga, '/storage/') !== false) {
               $caminhoAntigo = str_replace('/storage/', '', parse_url($urlAntiga, PHP_URL_PATH));
               if (Storage::disk('public')->exists($caminhoAntigo)) {
                  $imagemAntiga = $caminhoAntigo;
               }
            }
         }

         // Gerar nome único para o arquivo
         $nomeOriginal = $imagem->getClientOriginalName();
         $extensao = $imagem->getClientOriginalExtension();
         $nomeArquivo = 'hotmart_background_' . time() . '_' . Str::random(8) . '.' . $extensao;
         
         // Caminho relativo
         $caminhoRelativo = "{$pasta}/{$nomeArquivo}";
         
         // Salvar arquivo
         $imagem->storeAs($pasta, $nomeArquivo, 'public');

         // Gerar URL completa
         $url = $this->getStorageUrl($caminhoRelativo);

         // Criar ou atualizar parâmetro
         $parametro = Parametro::updateOrCreate(
            ['par_chave' => 'hotmart_background_image'],
            [
               'par_nome' => 'Imagem de Fundo - Produtos e Cursos Exclusivos',
               'par_valor' => $url,
               'par_descricao' => 'URL da imagem de fundo da seção "Produtos e Cursos Exclusivos"',
               'par_tipo' => 'geral',
            ]
         );

         // Remover imagem antiga se existir e for diferente da nova
         if ($imagemAntiga && $imagemAntiga !== $caminhoRelativo) {
            Storage::disk('public')->delete($imagemAntiga);
         }

         return response()->json([
            'message' => 'Imagem de fundo atualizada com sucesso',
            'url' => $url,
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao fazer upload da imagem',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Remove a imagem de fundo da seção Hotmart (admin)
    */
   public function removeHotmartBackground(): JsonResponse
   {
      try {
         $parametro = Parametro::where('par_chave', 'hotmart_background_image')->first();

         if (!$parametro || !$parametro->par_valor) {
            return response()->json([
               'message' => 'Nenhuma imagem de fundo encontrada',
            ], 404);
         }

         // Extrair o caminho relativo da URL
         $url = $parametro->par_valor;
         $caminho = null;
         
         if (strpos($url, '/storage/') !== false) {
            $caminho = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
            
            // Remover arquivo do storage
            if (Storage::disk('public')->exists($caminho)) {
               Storage::disk('public')->delete($caminho);
            }
         }

         // Remover parâmetro ou limpar valor
         $parametro->par_valor = '';
         $parametro->save();

         return response()->json([
            'message' => 'Imagem de fundo removida com sucesso',
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao remover imagem de fundo',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Upload da imagem de fundo de um card de bônus (admin)
    */
   public function uploadBonusCardBackground(Request $request): JsonResponse
   {
      $request->validate([
         'imagem' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
         'card_id' => 'required|in:1,2', // ID do card (1 ou 2)
      ], [
         'imagem.required' => 'É necessário enviar uma imagem.',
         'imagem.image' => 'O arquivo deve ser uma imagem.',
         'imagem.mimes' => 'A imagem deve ser do tipo: jpeg, jpg, png ou webp.',
         'imagem.max' => 'A imagem não pode ter mais de 5MB.',
         'card_id.required' => 'É necessário informar o ID do card.',
         'card_id.in' => 'O ID do card deve ser 1 ou 2.',
      ]);

      try {
         $imagem = $request->file('imagem');
         $cardId = $request->input('card_id');
         $pasta = 'conteudo/bonus';
         $chaveParametro = "bonus_card_{$cardId}_background_image";

         // Criar pasta se não existir
         if (!Storage::disk('public')->exists($pasta)) {
            Storage::disk('public')->makeDirectory($pasta);
         }

         // Buscar imagem antiga se existir
         $parametroAntigo = Parametro::where('par_chave', $chaveParametro)->first();
         $imagemAntiga = null;
         if ($parametroAntigo && $parametroAntigo->par_valor) {
            // Extrair o caminho relativo da URL
            $urlAntiga = $parametroAntigo->par_valor;
            if (strpos($urlAntiga, '/storage/') !== false) {
               $caminhoAntigo = str_replace('/storage/', '', parse_url($urlAntiga, PHP_URL_PATH));
               if (Storage::disk('public')->exists($caminhoAntigo)) {
                  $imagemAntiga = $caminhoAntigo;
               }
            }
         }

         // Gerar nome único para o arquivo
         $nomeOriginal = $imagem->getClientOriginalName();
         $extensao = $imagem->getClientOriginalExtension();
         $nomeArquivo = "bonus_card_{$cardId}_" . time() . '_' . Str::random(8) . '.' . $extensao;
         
         // Caminho relativo
         $caminhoRelativo = "{$pasta}/{$nomeArquivo}";
         
         // Salvar arquivo
         $imagem->storeAs($pasta, $nomeArquivo, 'public');

         // Gerar URL completa
         $url = $this->getStorageUrl($caminhoRelativo);

         // Criar ou atualizar parâmetro
         $parametro = Parametro::updateOrCreate(
            ['par_chave' => $chaveParametro],
            [
               'par_nome' => "Imagem de Fundo - Card de Bônus {$cardId}",
               'par_valor' => $url,
               'par_descricao' => "URL da imagem de fundo do card de bônus {$cardId}",
               'par_tipo' => 'geral',
            ]
         );

         // Remover imagem antiga se existir e for diferente da nova
         if ($imagemAntiga && $imagemAntiga !== $caminhoRelativo) {
            Storage::disk('public')->delete($imagemAntiga);
         }

         return response()->json([
            'message' => 'Imagem de fundo do card atualizada com sucesso',
            'url' => $url,
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao fazer upload da imagem',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Remove a imagem de fundo de um card de bônus (admin)
    */
   public function removeBonusCardBackground(Request $request): JsonResponse
   {
      $request->validate([
         'card_id' => 'required|in:1,2', // ID do card (1 ou 2)
      ], [
         'card_id.required' => 'É necessário informar o ID do card.',
         'card_id.in' => 'O ID do card deve ser 1 ou 2.',
      ]);

      try {
         $cardId = $request->input('card_id');
         $chaveParametro = "bonus_card_{$cardId}_background_image";
         
         $parametro = Parametro::where('par_chave', $chaveParametro)->first();

         if (!$parametro || !$parametro->par_valor) {
            return response()->json([
               'message' => 'Nenhuma imagem de fundo encontrada',
            ], 404);
         }

         // Extrair o caminho relativo da URL
         $url = $parametro->par_valor;
         $caminho = null;
         
         if (strpos($url, '/storage/') !== false) {
            $caminho = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
            
            // Remover arquivo do storage
            if (Storage::disk('public')->exists($caminho)) {
               Storage::disk('public')->delete($caminho);
            }
         }

         // Remover parâmetro ou limpar valor
         $parametro->par_valor = '';
         $parametro->save();

         return response()->json([
            'message' => 'Imagem de fundo removida com sucesso',
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao remover imagem de fundo',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Upload da imagem de fundo de um card Hotmart (admin)
    */
   public function uploadHotmartCardBackground(Request $request): JsonResponse
   {
      $request->validate([
         'imagem' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
         'card_id' => 'required|in:1,2,3', // ID do card (1, 2 ou 3)
      ], [
         'imagem.required' => 'É necessário enviar uma imagem.',
         'imagem.image' => 'O arquivo deve ser uma imagem.',
         'imagem.mimes' => 'A imagem deve ser do tipo: jpeg, jpg, png ou webp.',
         'imagem.max' => 'A imagem não pode ter mais de 5MB.',
         'card_id.required' => 'É necessário informar o ID do card.',
         'card_id.in' => 'O ID do card deve ser 1, 2 ou 3.',
      ]);

      try {
         $imagem = $request->file('imagem');
         $cardId = $request->input('card_id');
         $pasta = 'conteudo/hotmart';
         $chaveParametro = "hotmart_card_{$cardId}_background_image";

         // Criar pasta se não existir
         if (!Storage::disk('public')->exists($pasta)) {
            Storage::disk('public')->makeDirectory($pasta);
         }

         // Buscar imagem antiga se existir
         $parametroAntigo = Parametro::where('par_chave', $chaveParametro)->first();
         $imagemAntiga = null;
         if ($parametroAntigo && $parametroAntigo->par_valor) {
            // Extrair o caminho relativo da URL
            $urlAntiga = $parametroAntigo->par_valor;
            if (strpos($urlAntiga, '/storage/') !== false) {
               $caminhoAntigo = str_replace('/storage/', '', parse_url($urlAntiga, PHP_URL_PATH));
               if (Storage::disk('public')->exists($caminhoAntigo)) {
                  $imagemAntiga = $caminhoAntigo;
               }
            }
         }

         // Gerar nome único para o arquivo
         $nomeOriginal = $imagem->getClientOriginalName();
         $extensao = $imagem->getClientOriginalExtension();
         $nomeArquivo = "hotmart_card_{$cardId}_" . time() . '_' . Str::random(8) . '.' . $extensao;
         
         // Caminho relativo
         $caminhoRelativo = "{$pasta}/{$nomeArquivo}";
         
         // Salvar arquivo
         $imagem->storeAs($pasta, $nomeArquivo, 'public');

         // Gerar URL completa
         $url = $this->getStorageUrl($caminhoRelativo);

         // Criar ou atualizar parâmetro
         $parametro = Parametro::updateOrCreate(
            ['par_chave' => $chaveParametro],
            [
               'par_nome' => "Imagem de Fundo - Card Hotmart {$cardId}",
               'par_valor' => $url,
               'par_descricao' => "URL da imagem de fundo do card Hotmart {$cardId}",
               'par_tipo' => 'geral',
            ]
         );

         // Remover imagem antiga se existir e for diferente da nova
         if ($imagemAntiga && $imagemAntiga !== $caminhoRelativo) {
            Storage::disk('public')->delete($imagemAntiga);
         }

         return response()->json([
            'message' => 'Imagem de fundo do card atualizada com sucesso',
            'url' => $url,
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao fazer upload da imagem',
            'error' => $e->getMessage(),
         ], 500);
      }
   }

   /**
    * Remove a imagem de fundo de um card Hotmart (admin)
    */
   public function removeHotmartCardBackground(Request $request): JsonResponse
   {
      $request->validate([
         'card_id' => 'required|in:1,2,3', // ID do card (1, 2 ou 3)
      ], [
         'card_id.required' => 'É necessário informar o ID do card.',
         'card_id.in' => 'O ID do card deve ser 1, 2 ou 3.',
      ]);

      try {
         $cardId = $request->input('card_id');
         $chaveParametro = "hotmart_card_{$cardId}_background_image";
         
         $parametro = Parametro::where('par_chave', $chaveParametro)->first();

         if (!$parametro || !$parametro->par_valor) {
            return response()->json([
               'message' => 'Nenhuma imagem de fundo encontrada',
            ], 404);
         }

         // Extrair o caminho relativo da URL
         $url = $parametro->par_valor;
         $caminho = null;
         
         if (strpos($url, '/storage/') !== false) {
            $caminho = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
            
            // Remover arquivo do storage
            if (Storage::disk('public')->exists($caminho)) {
               Storage::disk('public')->delete($caminho);
            }
         }

         // Remover parâmetro ou limpar valor
         $parametro->par_valor = '';
         $parametro->save();

         return response()->json([
            'message' => 'Imagem de fundo removida com sucesso',
         ], 200);
      } catch (\Exception $e) {
         return response()->json([
            'message' => 'Erro ao remover imagem de fundo',
            'error' => $e->getMessage(),
         ], 500);
      }
   }
}
