<?php

use App\Http\Controllers\AssesmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::put('assessments/{assessment}/project-tasks/{projectTask}', [AssesmentController::class, 'updateProjectTask'])
        ->name('api.assessments.project-tasks.update');
});
