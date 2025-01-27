<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
});

//
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Route::apiResource('projects', ProjectController::class);
});

Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
    // Route::apiResource('tasks', TaskController::class);
});
