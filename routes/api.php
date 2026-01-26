<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// --- AUTH ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// --- RECEPT ROUTES ---
Route::get('/recepati', [ReceptController::class, 'index']);
Route::get('/recepati/{id}', [ReceptController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recepati', [ReceptController::class, 'store']); //amater + profesionalac
    Route::put('/recepati/{id}', [ReceptController::class, 'update']); // vlasnik recepta
    Route::delete('/recepati/{id}', [ReceptController::class, 'destroy']); // vlasnik recepta
    Route::post('/recepati/{id}/potvrda', [ReceptController::class, 'potvrdi']); //profesionalac
});

// --- SASTOJAK ROUTES ---
Route::get('/sastojci', [SastojakController::class, 'index']);

Route::middleware('auth:sanctum')->group (function () {
    Route::post('/sastojci', [SastojakController::class, 'store']);
    Route::delete('/sastojci/{id}', [SastojakController::class, 'destroy']);
    Route::put('/sastojci/{id}/dostupno', [SastojakController::class, 'updateDostupno']); //dobavljac

});