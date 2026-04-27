<?php

use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('candidate can apply to an active position', function () {
    $candidate = User::factory()->create([
        'role' => 'candidate',
        'phone' => '081234567890',
        'cv_path' => 'cv/candidate.pdf',
        'duration' => 6,
        'intern_start' => '2026-06-01',
    ]);

    $position = Position::query()->create([
        'title' => 'Frontend Developer',
        'description' => 'Membangun antarmuka web.',
        'is_active' => true,
    ]);

    $assessment = Assessment::query()->create([
        'position_id' => $position->id,
        'title' => 'Frontend Assessment',
        'duration_minutes' => 60,
    ]);

    $this->actingAs($candidate)
        ->post(route('positions.apply', $position))
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('applications', [
        'candidate_id' => $candidate->id,
        'position_id' => $position->id,
        'assessment_id' => $assessment->id,
        'status' => 'pending',
        'cv_snapshot' => 'cv/candidate.pdf',
    ]);
});

test('candidate cannot apply when required profile data is incomplete', function (array $candidateOverrides) {
    $candidate = User::factory()->create([
        'role' => 'candidate',
        'phone' => '081234567890',
        'cv_path' => 'cv/candidate.pdf',
        'duration' => 6,
        'intern_start' => '2026-06-01',
        ...$candidateOverrides,
    ]);

    $position = Position::query()->create([
        'title' => 'Frontend Developer',
        'description' => 'Membangun antarmuka web.',
        'is_active' => true,
    ]);

    Assessment::query()->create([
        'position_id' => $position->id,
        'title' => 'Frontend Assessment',
        'duration_minutes' => 60,
    ]);

    $this->actingAs($candidate)
        ->post(route('positions.apply', $position))
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseCount('applications', 0);
})->with([
    'missing phone' => [['phone' => null]],
    'missing cv' => [['cv_path' => null]],
    'missing duration' => [['duration' => null]],
    'missing intern start' => [['intern_start' => null]],
]);

test('candidate cannot apply when already in selection process', function () {
    $candidate = User::factory()->create([
        'role' => 'candidate',
    ]);

    $activePosition = Position::query()->create([
        'title' => 'Backend Developer',
        'description' => 'Membangun API.',
        'is_active' => true,
    ]);

    $activeAssessment = Assessment::query()->create([
        'position_id' => $activePosition->id,
        'title' => 'Backend Assessment',
        'duration_minutes' => 90,
    ]);

    Application::query()->create([
        'candidate_id' => $candidate->id,
        'position_id' => $activePosition->id,
        'assessment_id' => $activeAssessment->id,
        'status' => 'in_progress',
    ]);

    $newPosition = Position::query()->create([
        'title' => 'Data Analyst',
        'description' => 'Analisis data.',
        'is_active' => true,
    ]);

    Assessment::query()->create([
        'position_id' => $newPosition->id,
        'title' => 'Data Assessment',
        'duration_minutes' => 75,
    ]);

    $this->actingAs($candidate)
        ->post(route('positions.apply', $newPosition))
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseCount('applications', 1);
    $this->assertDatabaseMissing('applications', [
        'candidate_id' => $candidate->id,
        'position_id' => $newPosition->id,
    ]);
});

test('candidate can apply again after previous selection is rejected', function () {
    $candidate = User::factory()->create([
        'role' => 'candidate',
    ]);

    $oldPosition = Position::query()->create([
        'title' => 'UI/UX Designer',
        'description' => 'Riset dan desain produk.',
        'is_active' => true,
    ]);

    $oldAssessment = Assessment::query()->create([
        'position_id' => $oldPosition->id,
        'title' => 'UX Assessment',
        'duration_minutes' => 70,
    ]);

    Application::query()->create([
        'candidate_id' => $candidate->id,
        'position_id' => $oldPosition->id,
        'assessment_id' => $oldAssessment->id,
        'status' => 'rejected',
    ]);

    $newPosition = Position::query()->create([
        'title' => 'Graphic Designer',
        'description' => 'Desain materi visual.',
        'is_active' => true,
    ]);

    $newAssessment = Assessment::query()->create([
        'position_id' => $newPosition->id,
        'title' => 'Graphic Assessment',
        'duration_minutes' => 65,
    ]);

    $this->actingAs($candidate)
        ->post(route('positions.apply', $newPosition))
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('applications', [
        'candidate_id' => $candidate->id,
        'position_id' => $newPosition->id,
        'assessment_id' => $newAssessment->id,
        'status' => 'pending',
    ]);
});

test('admin cannot apply to a position', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $position = Position::query()->create([
        'title' => 'Web Developer',
        'description' => 'Membangun aplikasi web.',
        'is_active' => true,
    ]);

    Assessment::query()->create([
        'position_id' => $position->id,
        'title' => 'Web Assessment',
        'duration_minutes' => 60,
    ]);

    $this->actingAs($admin)
        ->post(route('positions.apply', $position))
        ->assertForbidden();

    $this->assertDatabaseCount('applications', 0);
});
