<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReceptController;
use App\Http\Controllers\Api\SastojakController;
use Illuminate\Http\Request;

// --- AUTH ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// --- RECEPT ROUTES ---
Route::get('/recepti', [ReceptController::class, 'index']);
Route::get('/recepti/{id}', [ReceptController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recepti', [ReceptController::class, 'store']); //amater + profesionalac
    Route::put('/recepti/{id}', [ReceptController::class, 'update']); // vlasnik recepta
    Route::delete('/recepti/{id}', [ReceptController::class, 'destroy']); // vlasnik recepta
    Route::post('/recepti/{id}/potvrda', [ReceptController::class, 'potvrdi']); //profesionalac
});

// --- SASTOJAK ROUTES ---
Route::get('/sastojci', [SastojakController::class, 'index']);

Route::middleware('auth:sanctum')->group (function () {
    Route::post('/sastojci', [SastojakController::class, 'store']);
    Route::delete('/sastojci/{id}', [SastojakController::class, 'destroy']);
    Route::put('/sastojci/{id}/dostupno', [SastojakController::class, 'updateDostupno']); //dobavljac

});