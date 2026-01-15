<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ParametroController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContatoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ProdutoImagemController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\BiografiaController;
use App\Http\Controllers\ConteudoController;
use App\Http\Controllers\CarrinhoController;

// Rotas públicas (com verificação de manutenção)
// Exceção: login do admin e rotas de parâmetros necessárias para verificar manutenção
Route::post('/admin/login', [AdminController::class, 'login']);
Route::get('/parametros/many', [ParametroController::class, 'showMany']); // Necessário para verificar manutenção no frontend

// Rota de debug para verificar IP (remover em produção se necessário)
Route::get('/debug/ip', function (Request $request) {
    $clientIp = $request->ip();
    $headers = [
        'HTTP_CF_CONNECTING_IP' => $request->server('HTTP_CF_CONNECTING_IP'),
        'HTTP_X_FORWARDED_FOR' => $request->server('HTTP_X_FORWARDED_FOR'),
        'HTTP_X_REAL_IP' => $request->server('HTTP_X_REAL_IP'),
        'HTTP_CLIENT_IP' => $request->server('HTTP_CLIENT_IP'),
        'REMOTE_ADDR' => $request->server('REMOTE_ADDR'),
    ];
    
    return response()->json([
        'ip_detectado' => $clientIp,
        'headers' => $headers,
        'todos_ips' => $request->ips(),
    ]);
});

Route::middleware('maintenance')->group(function () {
    Route::post('/contato', [ContatoController::class, 'enviar']);
    Route::get('/parametros', [ParametroController::class, 'index']);
    Route::get('/parametros/{chave}', [ParametroController::class, 'show']);

    // Rotas públicas de produtos
    Route::get('/produtos', [ProdutoController::class, 'index']);
    Route::get('/produtos/{id}', [ProdutoController::class, 'show']);

    // Rotas públicas de FAQ e Biografia
    Route::get('/faq', [FaqController::class, 'index']);
    Route::get('/biografia', [BiografiaController::class, 'show']);

    // Rotas públicas de carrinho
    Route::get('/carrinho', [CarrinhoController::class, 'index']);
    Route::get('/carrinho/total', [CarrinhoController::class, 'total']);
    Route::post('/carrinho', [CarrinhoController::class, 'store']);
    Route::put('/carrinho/{id}', [CarrinhoController::class, 'update']);
    Route::delete('/carrinho/{id}', [CarrinhoController::class, 'destroy']);
    Route::delete('/carrinho', [CarrinhoController::class, 'limpar']);
});

// Rotas protegidas (requerem autenticação)
Route::middleware('auth:sanctum')->group(function () {
   // Rotas de admin autenticado
   Route::post('/admin/logout', [AdminController::class, 'logout']);
   Route::get('/admin/me', [AdminController::class, 'me']);
   
   // Rotas de parâmetros (admin)
   Route::get('/admin/parametros', [ParametroController::class, 'list']);
   Route::post('/admin/parametros', [ParametroController::class, 'store']);
   Route::put('/admin/parametros/{id}', [ParametroController::class, 'update']);
   Route::put('/admin/parametros', [ParametroController::class, 'updateMany']);
   
   // Rotas de usuários (admin)
   Route::get('/admin/usuarios', [UsuarioController::class, 'index']);
   Route::get('/admin/usuarios/{id}', [UsuarioController::class, 'show']);
   Route::post('/admin/usuarios', [UsuarioController::class, 'store']);
   Route::put('/admin/usuarios/{id}', [UsuarioController::class, 'update']);
   Route::delete('/admin/usuarios/{id}', [UsuarioController::class, 'destroy']);
   
   // Rotas de clientes (admin) - apenas visualizar, editar e excluir
   Route::get('/admin/clientes', [ClienteController::class, 'index']);
   Route::get('/admin/clientes/{id}', [ClienteController::class, 'show']);
   Route::put('/admin/clientes/{id}', [ClienteController::class, 'update']);
   Route::delete('/admin/clientes/{id}', [ClienteController::class, 'destroy']);
   Route::post('/admin/clientes/{id}/restore', [ClienteController::class, 'restore']);
   
   // Rotas de produtos (admin) - CRUD completo
   Route::get('/admin/produtos', [ProdutoController::class, 'indexAdmin']);
   Route::get('/admin/produtos/{id}', [ProdutoController::class, 'showAdmin']);
   Route::post('/admin/produtos', [ProdutoController::class, 'store']);
   Route::put('/admin/produtos/{id}', [ProdutoController::class, 'update']);
   Route::delete('/admin/produtos/{id}', [ProdutoController::class, 'destroy']);
   Route::post('/admin/produtos/{id}/restore', [ProdutoController::class, 'restore']);
   
   // Rotas de imagens de produtos (admin)
   Route::post('/admin/produtos/{id}/imagens', [ProdutoImagemController::class, 'upload']);
   Route::post('/admin/produtos/{produtoId}/imagens/{imagemId}/capa', [ProdutoImagemController::class, 'definirCapa']);
   Route::put('/admin/produtos/{produtoId}/imagens/reordenar', [ProdutoImagemController::class, 'reordenar']);
   Route::delete('/admin/produtos/{produtoId}/imagens/{imagemId}', [ProdutoImagemController::class, 'destroy']);
   
   // Rotas de FAQ (admin) - rotas específicas antes das rotas com parâmetros
   Route::get('/admin/faq', [FaqController::class, 'indexAdmin']);
   Route::post('/admin/faq', [FaqController::class, 'store']);
   Route::put('/admin/faq/reordenar', [FaqController::class, 'reorder']);
   Route::get('/admin/faq/{id}', [FaqController::class, 'show']);
   Route::put('/admin/faq/{id}', [FaqController::class, 'update']);
   Route::delete('/admin/faq/{id}', [FaqController::class, 'destroy']);
   
   // Rotas de Biografia (admin)
   Route::get('/admin/biografia', [BiografiaController::class, 'showAdmin']);
   Route::put('/admin/biografia/{id}', [BiografiaController::class, 'update']);
   
   // Rotas de Conteúdo (admin)
   Route::post('/admin/conteudo/hotmart-background', [ConteudoController::class, 'uploadHotmartBackground']);
   Route::delete('/admin/conteudo/hotmart-background', [ConteudoController::class, 'removeHotmartBackground']);
   Route::post('/admin/conteudo/bonus-card-background', [ConteudoController::class, 'uploadBonusCardBackground']);
   Route::delete('/admin/conteudo/bonus-card-background', [ConteudoController::class, 'removeBonusCardBackground']);
});

?>