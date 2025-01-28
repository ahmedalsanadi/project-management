<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
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
    Route::apiResource('projects', ProjectController::class);

});

Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
    // List member routes :


});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::apiResource('tasks', TaskController::class);

});


Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
