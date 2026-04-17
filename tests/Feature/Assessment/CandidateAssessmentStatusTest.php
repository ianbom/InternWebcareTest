<?php

use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createCandidateAssessmentStatusApplication(string $status): array
{
    $candidate = User::factory()->create(['role' => 'candidate']);
    $position = Position::query()->create([
        'title' => 'Backend Developer',
        'description' => 'Build APIs.',
        'is_active' => true,
    ]);
    $assessment = Assessment::query()->create([
        'position_id' => $position->id,
        'title' => 'Backend Assessment',
        'duration_minutes' => 90,
    ]);
    $projectTask = ProjectTask::query()->create([
        'assessment_id' => $assessment->id,
        'title' => 'Build REST API',
        'description' => 'Create a small REST API.',
        'deadline_hours' => 48,
    ]);
    $application = Application::query()->create([
        'candidate_id' => $candidate->id,
        'position_id' => $position->id,
        'assessment_id' => $assessment->id,
        'status' => $status,
    ]);

    return compact('candidate', 'position', 'assessment', 'projectTask', 'application');
}

test('candidate assessment page hides assessment content for final statuses', function (string $status, string $label, string $tone) {
    $fixture = createCandidateAssessmentStatusApplication($status);

    $this->actingAs($fixture['candidate'])
        ->get(route('assessments.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assesment/list-assesment')
            ->where('hasApplication', true)
            ->where('application.status', $status)
            ->where('application.statusLabel', $label)
            ->where('application.statusTone', $tone)
            ->where('application.isFinalStatus', true)
            ->where('application.isAssessmentVisible', false)
            ->where('application.position.title', 'Backend Developer')
            ->has('application.assessment.project_tasks', 0)
        );
})->with([
    ['approved', 'Diterima', 'success'],
    ['rejected', 'Ditolak', 'danger'],
]);

test('candidate assessment page keeps assessment content for active statuses', function (string $status, string $label, string $tone) {
    $fixture = createCandidateAssessmentStatusApplication($status);

    $this->actingAs($fixture['candidate'])
        ->get(route('assessments.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assesment/list-assesment')
            ->where('hasApplication', true)
            ->where('application.status', $status)
            ->where('application.statusLabel', $label)
            ->where('application.statusTone', $tone)
            ->where('application.isFinalStatus', false)
            ->where('application.isAssessmentVisible', true)
            ->has('application.assessment.project_tasks', 1)
        );
})->with([
    ['pending', 'Menunggu Assessment', 'warning'],
    ['in_progress', 'Assessment Berjalan', 'info'],
    ['submitted', 'Assessment Terkirim', 'info'],
    ['under_review', 'Sedang Direview', 'warning'],
]);
