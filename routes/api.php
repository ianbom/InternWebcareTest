<?php

use App\Http\Controllers\AssesmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['web', 'auth', 'verified', 'admin'])->group(function () {
    Route::get('bimsillah', [AssesmentController::class, 'tes']);
    Route::put('bom/{assessment}/project-tasks/{projectTask}', [AssesmentController::class, 'updateProjectTask2'])
        ->name('api.assessments.project-tasks.update');
    Route::get('bom/{assessment}/project-tasks/{projectTask}', [AssesmentController::class, 'tes'])
        ->name('api.assessments.project-tasks.update');
});


