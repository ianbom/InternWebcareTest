<?php

use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createCandidateDashboardApplication(string $status): array
{
    $candidate = User::factory()->create(['role' => 'candidate']);
    $position = Position::query()->create([
        'title' => 'Frontend Developer',
        'description' => 'Build candidate-facing interfaces.',
        'is_active' => true,
    ]);
    $assessment = Assessment::query()->create([
        'position_id' => $position->id,
        'title' => 'Frontend Assessment',
        'duration_minutes' => 60,
    ]);
    $application = Application::query()->create([
        'candidate_id' => $candidate->id,
        'position_id' => $position->id,
        'assessment_id' => $assessment->id,
        'status' => $status,
    ]);

    return compact('candidate', 'position', 'assessment', 'application');
}

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('candidate dashboard returns null application when candidate has not applied', function () {
    $candidate = User::factory()->create(['role' => 'candidate']);

    $this->actingAs($candidate)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('application', null)
        );
});

test('candidate dashboard exposes start action for pending application', function () {
    $fixture = createCandidateDashboardApplication('pending');

    $this->actingAs($fixture['candidate'])
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('application.status', 'pending')
            ->where('application.statusLabel', 'Menunggu Assessment')
            ->where('application.statusTone', 'warning')
            ->where('application.activeStep', 'assessment')
            ->where('application.nextActionLabel', 'Mulai Assessment')
            ->where('application.nextActionUrl', route('assessments.start', $fixture['application']))
            ->where('application.nextActionMethod', 'post')
            ->where('application.canOpenAssessment', true)
        );
});

test('candidate dashboard exposes take action for in progress application', function () {
    $fixture = createCandidateDashboardApplication('in_progress');

    $this->actingAs($fixture['candidate'])
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('application.status', 'in_progress')
            ->where('application.statusLabel', 'Assessment Berjalan')
            ->where('application.statusTone', 'info')
            ->where('application.nextActionLabel', 'Lanjutkan Assessment')
            ->where('application.nextActionUrl', route('assessments.take', $fixture['application']))
            ->where('application.nextActionMethod', 'get')
            ->where('application.canOpenAssessment', true)
        );
});

test('candidate dashboard uses assessment overview action while application is waiting for review', function (string $status, string $label, string $tone) {
    $fixture = createCandidateDashboardApplication($status);

    $this->actingAs($fixture['candidate'])
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('application.status', $status)
            ->where('application.statusLabel', $label)
            ->where('application.statusTone', $tone)
            ->where('application.activeStep', 'review')
            ->where('application.nextActionLabel', 'Lihat Status Assessment')
            ->where('application.nextActionUrl', route('assessments.index'))
            ->where('application.nextActionMethod', 'get')
            ->where('application.canOpenAssessment', true)
        );
})->with([
    ['submitted', 'Assessment Terkirim', 'info'],
    ['under_review', 'Sedang Direview', 'warning'],
]);

test('candidate dashboard shows final result without active assessment action', function (string $status, string $label, string $tone) {
    $fixture = createCandidateDashboardApplication($status);

    $this->actingAs($fixture['candidate'])
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('application.status', $status)
            ->where('application.statusLabel', $label)
            ->where('application.statusTone', $tone)
            ->where('application.activeStep', 'result')
            ->where('application.nextActionLabel', null)
            ->where('application.nextActionUrl', null)
            ->where('application.nextActionMethod', null)
            ->where('application.canOpenAssessment', false)
        );
})->with([
    ['approved', 'Diterima', 'success'],
    ['rejected', 'Ditolak', 'danger'],
]);
