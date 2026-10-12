<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('/user', function (Request $request) {
    return $request->user();

})->middleware('auth:sanctum');

Route::get('/students', [StudentController::class, 'index']);

Route::post('/students', [StudentController::class, 'store']);

Route::get('/students/{student}', [StudentController::class, 'show']);

Route::put('/students/{student}', [StudentController::class, 'update']);
