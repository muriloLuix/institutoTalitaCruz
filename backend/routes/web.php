<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return view('welcome');
});

// Serve presentation video stored in storage/app/private
Route::get('/videos/apresentacao.mp4', function () {
    $path = storage_path('app/private/videos/apresentacao/videoApresentacao.mp4');
    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path, [
        'Content-Type' => 'video/mp4',
        'Content-Disposition' => 'inline; filename="videoApresentacao.mp4"',
    ]);
});
