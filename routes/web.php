<?php

use App\Http\Controllers\AdminApplicationController;
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

    Route::middleware('admin')->group(function () {
        Route::get('applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::get('applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        Route::put('applications/{application}/review', [AdminApplicationController::class, 'updateReview'])->name('applications.review.update');

        Route::post('positions', [PositionController::class, 'store'])->name('positions.store');
        Route::put('positions/{position}', [PositionController::class, 'update'])->name('positions.update');

        Route::get('assessments', [AssesmentController::class, 'index'])->name('assessments.list');
        Route::post('assessments', [AssesmentController::class, 'store'])->name('assessments.store');
        Route::get('assessments/{assessment}', [AssesmentController::class, 'show'])->name('assessments.show');
        Route::put('assessments/{assessment}', [AssesmentController::class, 'update'])->name('assessments.update');
        Route::post('assessments/{assessment}/questions', [AssesmentController::class, 'storeQuestion'])
            ->name('assessments.questions.store');
        Route::put('assessments/{assessment}/questions/{question}', [AssesmentController::class, 'updateQuestion'])
            ->name('assessments.questions.update');
        Route::post('assessments/{assessment}/project-tasks', [AssesmentController::class, 'storeProjectTask'])
            ->name('assessments.project-tasks.store');
        Route::put('assessments/{assessment}/project-tasks/{projectTask}', [AssesmentController::class, 'updateProjectTask'])
            ->name('assessments.project-tasks.update');
    });

    Route::get('positions', [PositionController::class, 'index'])->name('positions.index');
    Route::post('positions/{position}/apply', [PositionController::class, 'applyPosition'])->name('positions.apply');
    Route::get('my-assesment', [AssesmentController::class, 'index'])->name('assessments.index');
    Route::post('assesment/{application}/start', [AssesmentController::class, 'startAssessment'])->name('assessments.start');
    Route::get('assesment/{application}/take', [AssesmentController::class, 'take'])->name('assessments.take');
    Route::post('assesment/{application}/submit', [AssesmentController::class, 'submit'])->name('assessments.submit');
    Route::post('assesment/{application}/warn', [AssesmentController::class, 'logWarning'])->name('assessments.warn');
    Route::post(
        'assesment/{application}/project-submissions/{projectSubmission}/submit',
        [ProjectSubmissionController::class, 'submit'],
    )->name('project-submissions.submit');
});

require __DIR__.'/settings.php';
