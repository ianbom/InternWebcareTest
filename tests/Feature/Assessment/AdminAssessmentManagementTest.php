<?php

use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectTask;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createAssessmentFixture(array $assessmentOverrides = []): array
{
    $position = Position::query()->create([
        'title' => $assessmentOverrides['position_title'] ?? 'Backend Developer',
        'description' => 'Build internal APIs.',
        'is_active' => true,
    ]);

    $assessment = Assessment::query()->create([
        'position_id' => $position->id,
        'title' => $assessmentOverrides['title'] ?? 'Backend Assessment',
        'duration_minutes' => $assessmentOverrides['duration_minutes'] ?? 90,
        'created_at' => $assessmentOverrides['created_at'] ?? now()->subDay(),
    ]);

    $mcqQuestion = Question::query()->create([
        'assessment_id' => $assessment->id,
        'type' => 'multiple_choice',
        'question_text' => 'Which HTTP method reads data?',
        'options' => ['GET', 'POST', 'PATCH'],
        'correct_answer' => 'GET',
        'point_value' => 1,
        'order_index' => 1,
    ]);

    $essayQuestion = Question::query()->create([
        'assessment_id' => $assessment->id,
        'type' => 'essay',
        'question_text' => 'Explain dependency injection.',
        'point_value' => 5,
        'order_index' => 2,
    ]);

    $projectTask = ProjectTask::query()->create([
        'assessment_id' => $assessment->id,
        'title' => 'Build REST API',
        'description' => 'Create a small REST API with tests.',
        'deadline_hours' => 48,
    ]);

    return compact('position', 'assessment', 'mcqQuestion', 'essayQuestion', 'projectTask');
}

test('guest and candidate cannot access admin assessment pages', function () {
    $fixture = createAssessmentFixture();
    $candidate = User::factory()->create(['role' => 'candidate']);

    $this->get(route('assessments.list'))->assertRedirect(route('login'));
    $this->get(route('assessments.show', $fixture['assessment']))->assertRedirect(route('login'));

    $this->actingAs($candidate)->get(route('assessments.list'))->assertForbidden();
    $this->actingAs($candidate)->get(route('assessments.show', $fixture['assessment']))->assertForbidden();
});

test('admin can browse assessments with search filters sorting and pagination query', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    createAssessmentFixture([
        'position_title' => 'Backend Developer',
        'title' => 'Backend Assessment',
        'duration_minutes' => 90,
        'created_at' => now()->subDays(2),
    ]);

    $frontend = createAssessmentFixture([
        'position_title' => 'Frontend Developer',
        'title' => 'React Assessment',
        'duration_minutes' => 60,
        'created_at' => now()->subDay(),
    ]);

    createAssessmentFixture([
        'position_title' => 'Data Analyst',
        'title' => 'SQL Assessment',
        'duration_minutes' => 45,
        'created_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('assessments.list', [
            'search' => 'react',
            'position_id' => $frontend['position']->id,
            'duration_min' => 30,
            'duration_max' => 90,
            'sort' => 'duration_minutes_asc',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assesment/index')
            ->has('assessments.data', 1)
            ->where('assessments.data.0.title', 'React Assessment')
            ->where('assessments.data.0.position_title', 'Frontend Developer')
            ->where('filters.search', 'react')
            ->where('filters.position_id', (string) $frontend['position']->id)
            ->where('filters.sort', 'duration_minutes_asc')
            ->where('assessments.links.0.url', fn (?string $url) => $url === null || str_contains($url, 'search=react')),
        );
});

test('admin can create update and view assessment detail payload', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $position = Position::query()->create([
        'title' => 'QA Engineer',
        'description' => 'Test product quality.',
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->post(route('assessments.store'), [
            'position_id' => $position->id,
            'title' => 'QA Assessment',
            'duration_minutes' => 75,
        ])
        ->assertRedirect(route('assessments.list'));

    $assessment = Assessment::query()->where('title', 'QA Assessment')->firstOrFail();

    $this->assertDatabaseHas('assessments', [
        'id' => $assessment->id,
        'position_id' => $position->id,
        'duration_minutes' => 75,
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->put(route('assessments.update', $assessment), [
            'position_id' => $position->id,
            'title' => 'Updated QA Assessment',
            'duration_minutes' => 80,
        ])
        ->assertRedirect(route('assessments.list'));

    $this->actingAs($admin)
        ->get(route('assessments.show', $assessment))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assesment/show')
            ->where('assessment.id', $assessment->id)
            ->where('assessment.title', 'Updated QA Assessment')
            ->where('position.title', 'QA Engineer')
            ->has('questions', 0)
            ->has('project_tasks', 0),
        );
});

test('admin can create and update mcq and essay questions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $fixture = createAssessmentFixture();

    $this->actingAs($admin)
        ->post(route('assessments.questions.store', $fixture['assessment']), [
            'type' => 'multiple_choice',
            'question_text' => 'What is Laravel?',
            'options' => ['Framework', 'Database', 'Browser'],
            'correct_answer' => 'Framework',
            'point_value' => 2,
            'order_index' => 3,
        ])
        ->assertRedirect(route('assessments.show', $fixture['assessment']));

    $question = Question::query()->where('question_text', 'What is Laravel?')->firstOrFail();

    $this->assertDatabaseHas('questions', [
        'id' => $question->id,
        'assessment_id' => $fixture['assessment']->id,
        'type' => 'multiple_choice',
        'correct_answer' => 'Framework',
        'point_value' => 2,
        'order_index' => 3,
    ]);

    $this->actingAs($admin)
        ->put(route('assessments.questions.update', [$fixture['assessment'], $question]), [
            'type' => 'essay',
            'question_text' => 'Explain Laravel service container.',
            'options' => null,
            'correct_answer' => null,
            'point_value' => 5,
            'order_index' => 4,
        ])
        ->assertRedirect(route('assessments.show', $fixture['assessment']));

    $question->refresh();

    expect($question->type)->toBe('essay');
    expect($question->options)->toBeNull();
    expect($question->correct_answer)->toBeNull();
});

test('mcq question requires options and correct answer', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $fixture = createAssessmentFixture();

    $this->actingAs($admin)
        ->from(route('assessments.show', $fixture['assessment']))
        ->post(route('assessments.questions.store', $fixture['assessment']), [
            'type' => 'multiple_choice',
            'question_text' => 'Incomplete MCQ',
            'point_value' => 1,
            'order_index' => 5,
        ])
        ->assertSessionHasErrors(['options', 'correct_answer']);
});

test('admin can create and update project task', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $fixture = createAssessmentFixture();

    $this->actingAs($admin)
        ->post(route('assessments.project-tasks.store', $fixture['assessment']), [
            'title' => 'Create landing page',
            'description' => 'Build a responsive landing page.',
            'deadline_hours' => 24,
        ])
        ->assertRedirect(route('assessments.show', $fixture['assessment']));

    $task = ProjectTask::query()->where('title', 'Create landing page')->firstOrFail();

    $this->actingAs($admin)
        ->put(route('assessments.project-tasks.update', [$fixture['assessment'], $task]), [
            'title' => 'Create landing page v2',
            'description' => 'Build a responsive landing page with tests.',
            'deadline_hours' => 36,
        ])
        ->assertRedirect(route('assessments.show', $fixture['assessment']));

    $this->assertDatabaseHas('project_tasks', [
        'id' => $task->id,
        'assessment_id' => $fixture['assessment']->id,
        'title' => 'Create landing page v2',
        'description' => 'Build a responsive landing page with tests.',
        'deadline_hours' => 36,
    ]);
});
