<?php

use App\Models\Answer;
use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectSubmission;
use App\Models\ProjectTask;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createAdminApplicationFixture(array $overrides = []): array
{
    $candidate = User::factory()->create([
        'name' => $overrides['candidate_name'] ?? 'Jane Candidate',
        'email' => $overrides['candidate_email'] ?? fake()->unique()->safeEmail(),
        'phone' => $overrides['candidate_phone'] ?? '08123456789',
        'cv_path' => $overrides['cv_path'] ?? 'cv/jane.pdf',
        'role' => 'candidate',
    ]);

    $position = Position::query()->create([
        'title' => $overrides['position_title'] ?? 'Backend Developer',
        'description' => 'Build reliable internal APIs.',
        'is_active' => true,
    ]);

    $assessment = Assessment::query()->create([
        'position_id' => $position->id,
        'title' => $overrides['assessment_title'] ?? 'Backend Assessment',
        'duration_minutes' => 90,
    ]);

    $application = Application::query()->create([
        'candidate_id' => $candidate->id,
        'position_id' => $position->id,
        'assessment_id' => $assessment->id,
        'cv_snapshot' => $candidate->cv_path,
        'status' => $overrides['status'] ?? 'submitted',
        'started_at' => $overrides['started_at'] ?? now()->subDays(2),
        'submitted_at' => $overrides['submitted_at'] ?? now()->subDay(),
        'expires_at' => $overrides['expires_at'] ?? now()->addDays(2),
        'total_score' => $overrides['total_score'] ?? 7,
        'created_at' => $overrides['created_at'] ?? now()->subDays(3),
        'updated_at' => now(),
    ]);

    $mcqQuestion = Question::query()->create([
        'assessment_id' => $assessment->id,
        'type' => 'multiple_choice',
        'question_text' => 'Which HTTP method retrieves data?',
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

    $mcqAnswer = Answer::query()->create([
        'application_id' => $application->id,
        'question_id' => $mcqQuestion->id,
        'answer_text' => 'GET',
        'score' => 1,
    ]);

    $essayAnswer = Answer::query()->create([
        'application_id' => $application->id,
        'question_id' => $essayQuestion->id,
        'answer_text' => 'Dependencies are injected from outside the class.',
        'score' => null,
    ]);

    $projectTask = ProjectTask::query()->create([
        'assessment_id' => $assessment->id,
        'title' => 'Build REST API',
        'description' => 'Create a small REST API and upload the repository archive.',
        'deadline_hours' => 48,
    ]);

    $projectSubmission = ProjectSubmission::query()->create([
        'application_id' => $application->id,
        'project_task_id' => $projectTask->id,
        'status' => 'submitted',
        'file_path' => 'project-submissions/'.$application->id.'/api.zip',
        'notes' => 'Includes README and tests.',
        'deadline_at' => now()->addDay(),
        'submitted_at' => now()->subHours(4),
    ]);

    return compact(
        'candidate',
        'position',
        'assessment',
        'application',
        'mcqQuestion',
        'essayQuestion',
        'mcqAnswer',
        'essayAnswer',
        'projectTask',
        'projectSubmission',
    );
}

test('guest is redirected to login for admin application routes', function () {
    $fixture = createAdminApplicationFixture();

    $this->get(route('applications.index'))->assertRedirect(route('login'));
    $this->get(route('applications.show', $fixture['application']))->assertRedirect(route('login'));
    $this->put(route('applications.review.update', $fixture['application']), [])->assertRedirect(route('login'));
});

test('candidate receives forbidden response for admin application routes', function () {
    $fixture = createAdminApplicationFixture();
    $candidate = User::factory()->create(['role' => 'candidate']);

    $this->actingAs($candidate)->get(route('applications.index'))->assertForbidden();
    $this->actingAs($candidate)->get(route('applications.show', $fixture['application']))->assertForbidden();
    $this->actingAs($candidate)->put(route('applications.review.update', $fixture['application']), [])->assertForbidden();
});

test('admin can access list and detail while dashboard redirects to applications', function () {
    $fixture = createAdminApplicationFixture();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('applications.index'));

    $this->actingAs($admin)
        ->get(route('applications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('applications/index')
            ->has('applications.data', 1)
            ->where('applications.data.0.candidate_name', $fixture['candidate']->name)
            ->where('applications.data.0.email', $fixture['candidate']->email)
            ->where('applications.data.0.phone', $fixture['candidate']->phone)
            ->where('applications.data.0.position_title', $fixture['position']->title)
            ->where('applications.data.0.status', 'submitted')
            ->where('applications.data.0.total_score', 7.0),
        );

    $this->actingAs($admin)
        ->get(route('applications.show', $fixture['application']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('applications/show')
            ->where('application.id', $fixture['application']->id)
            ->where('candidate.name', $fixture['candidate']->name)
            ->where('candidate.cv_url', Storage::disk('public')->url('cv/jane.pdf'))
            ->where('position.title', $fixture['position']->title)
            ->where('assessment.title', $fixture['assessment']->title)
            ->has('mcq_answers', 1)
            ->where('mcq_answers.0.question_text', 'Which HTTP method retrieves data?')
            ->where('mcq_answers.0.candidate_answer', 'GET')
            ->where('mcq_answers.0.correct_answer', 'GET')
            ->where('mcq_answers.0.auto_score', 1.0)
            ->has('essay_answers', 1)
            ->where('essay_answers.0.answer_id', $fixture['essayAnswer']->id)
            ->where('essay_answers.0.point_value', 5.0)
            ->has('project_submissions', 1)
            ->where('project_submissions.0.submission_id', $fixture['projectSubmission']->id)
            ->where('project_submissions.0.file_url', Storage::disk('public')->url('project-submissions/'.$fixture['application']->id.'/api.zip')),
        );
});

test('admin list supports search filters sorting and pagination query persistence', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    createAdminApplicationFixture([
        'candidate_name' => 'Alice Backend',
        'candidate_email' => 'alice@example.test',
        'candidate_phone' => '08111111111',
        'position_title' => 'Backend Developer',
        'status' => 'submitted',
        'total_score' => 9,
        'created_at' => now()->subDays(4),
        'submitted_at' => now()->subDays(3),
    ]);

    $second = createAdminApplicationFixture([
        'candidate_name' => 'Bob Analyst',
        'candidate_email' => 'bob@example.test',
        'candidate_phone' => '08222222222',
        'position_title' => 'Data Analyst',
        'status' => 'approved',
        'total_score' => 4,
        'created_at' => now()->subDay(),
        'submitted_at' => now()->subHours(8),
    ]);

    createAdminApplicationFixture([
        'candidate_name' => 'Charlie Designer',
        'candidate_email' => 'charlie@example.test',
        'candidate_phone' => '08333333333',
        'position_title' => 'UI Designer',
        'status' => 'rejected',
        'total_score' => 2,
        'created_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
    ]);

    $this->actingAs($admin)
        ->get(route('applications.index', [
            'search' => 'bob',
            'status' => 'approved',
            'position_id' => $second['position']->id,
            'applied_from' => now()->subDays(2)->toDateString(),
            'applied_to' => now()->toDateString(),
            'submitted_from' => now()->subDay()->toDateString(),
            'submitted_to' => now()->toDateString(),
            'min_score' => 3,
            'max_score' => 5,
            'sort' => 'candidate_name_asc',
            'page' => 1,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('applications/index')
            ->has('applications.data', 1)
            ->where('applications.data.0.candidate_name', 'Bob Analyst')
            ->where('filters.search', 'bob')
            ->where('filters.status', 'approved')
            ->where('filters.position_id', (string) $second['position']->id)
            ->where('filters.sort', 'candidate_name_asc')
            ->where('applications.links.0.url', fn (?string $url) => $url === null || str_contains($url, 'search=bob')),
        );

    $this->actingAs($admin)
        ->get(route('applications.index', ['sort' => 'total_score_desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('applications.data.0.candidate_name', 'Alice Backend')
            ->where('applications.data.1.candidate_name', 'Bob Analyst')
            ->where('applications.data.2.candidate_name', 'Charlie Designer'),
        );
});

test('admin can save review scores notes and final status without changing auto score', function () {
    $fixture = createAdminApplicationFixture(['total_score' => 7]);
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->put(route('applications.review.update', $fixture['application']), [
            'status' => 'approved',
            'admin_notes' => 'Strong submission and clear communication.',
            'essay_reviews' => [
                [
                    'answer_id' => $fixture['essayAnswer']->id,
                    'score' => 4.5,
                ],
            ],
            'project_reviews' => [
                [
                    'project_submission_id' => $fixture['projectSubmission']->id,
                    'score' => 8.75,
                    'score_notes' => 'API is complete and documented.',
                ],
            ],
        ])
        ->assertRedirect(route('applications.show', $fixture['application']));

    $this->assertDatabaseHas('applications', [
        'id' => $fixture['application']->id,
        'status' => 'approved',
        'admin_notes' => 'Strong submission and clear communication.',
        'reviewed_by' => $admin->id,
        'total_score' => 7,
    ]);

    $this->assertDatabaseHas('answers', [
        'id' => $fixture['essayAnswer']->id,
        'score' => 4.5,
        'scored_by' => $admin->id,
    ]);

    $this->assertDatabaseHas('project_submissions', [
        'id' => $fixture['projectSubmission']->id,
        'status' => 'reviewed',
        'score' => 8.75,
        'score_notes' => 'API is complete and documented.',
        'scored_by' => $admin->id,
    ]);

    expect($fixture['application']->fresh()->reviewed_at)->not->toBeNull();
    expect($fixture['essayAnswer']->fresh()->scored_at)->not->toBeNull();
    expect($fixture['projectSubmission']->fresh()->scored_at)->not->toBeNull();
});

test('essay review score cannot exceed question point value', function () {
    $fixture = createAdminApplicationFixture();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->from(route('applications.show', $fixture['application']))
        ->put(route('applications.review.update', $fixture['application']), [
            'status' => 'under_review',
            'essay_reviews' => [
                [
                    'answer_id' => $fixture['essayAnswer']->id,
                    'score' => 6,
                ],
            ],
            'project_reviews' => [],
        ])
        ->assertSessionHasErrors('essay_reviews.0.score');

    expect($fixture['essayAnswer']->fresh()->score)->toBeNull();
});
