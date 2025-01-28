<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {

    // Endpoint: /api/auth/register
    Route::post('/register', [AuthController::class, 'register']);

    // Endpoint: /api/auth/login
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

//
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // list admin routes:
    // Route::apiResource('projects', ProjectController::class);
});

Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
    // List member routes :
    //Route::apiResource('tasks', TaskController::class);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
