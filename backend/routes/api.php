<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParametroController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContatoController;

// Rota de login de administrador (login admin)
Route::post('/admin/login', [AdminController::class, 'login']);


// ROTAS DE CONTATO
Route::post('/contato', [ContatoController::class, 'enviar']);

// Rota de configurações de parametros
Route::get('/parametros', [ParametroController::class, 'index']);

?>