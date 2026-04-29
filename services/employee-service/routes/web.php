<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{employee}', [EmployeeController::class, 'show']);
    Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy']);
});
