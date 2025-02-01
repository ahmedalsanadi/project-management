<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    if (Auth::check()) {
        return response()->json($request->user());
    } else {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
})->middleware('auth:sanctum');

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
    Route::get('/members', [TaskController::class, 'getMembers']);
    Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);

});

Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
    // List member routes :


});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::apiResource('tasks', TaskController::class);

    Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);


    Route::post('/logout', [AuthController::class, 'logout']);

});



