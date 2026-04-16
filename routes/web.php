<?php

use App\Http\Controllers\AssesmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProjectSubmissionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('positions', [PositionController::class, 'index'])->name('positions.index');
    Route::post('positions/{position}/apply', [PositionController::class, 'applyPosition'])->name('positions.apply');
    Route::get('my-assesment', [AssesmentController::class, 'index'])->name('assessments.index');
    Route::post('assesment/{application}/start', [AssesmentController::class, 'startAssessment'])->name('assessments.start');
    Route::get('assesment/{application}/take', [AssesmentController::class, 'take'])->name('assessments.take');
    Route::post('assesment/{application}/submit', [AssesmentController::class, 'submit'])->name('assessments.submit');
    Route::post(
        'assesment/{application}/project-submissions/{projectSubmission}/submit',
        [ProjectSubmissionController::class, 'submit'],
    )->name('project-submissions.submit');
});

require __DIR__.'/settings.php';
