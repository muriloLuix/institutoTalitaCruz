<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
   return view('welcome');
});

// Rota para servir arquivos do storage
Route::get('/storage/{path}', function ($path) {
   $filePath = storage_path('app/public/' . $path);

   if (!file_exists($filePath)) {
      abort(404);
   }

   $file = file_get_contents($filePath);
   $type = mime_content_type($filePath);

   return response($file, 200)
      ->header('Content-Type', $type)
      ->header('Content-Disposition', 'inline');
})->where('path', '.*');
