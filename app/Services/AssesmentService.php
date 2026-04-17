<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Application;
use App\Models\AssesmentWarning;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectTask;
use App\Models\Question;
use App\Models\User;
use App\Support\ApplicationStatusPresenter;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AssesmentService
{
    public function getAdminAssessmentListing(array $filters): array
    {
        $normalizedFilters = [
            'search' => trim((string) ($filters['search'] ?? '')),
            'position_id' => filled($filters['position_id'] ?? null) ? (string) $filters['position_id'] : '',
            'duration_min' => filled($filters['duration_min'] ?? null) ? (string) $filters['duration_min'] : '',
            'duration_max' => filled($filters['duration_max'] ?? null) ? (string) $filters['duration_max'] : '',
            'sort' => in_array((string) ($filters['sort'] ?? ''), $this->adminAssessmentSorts(), true)
                ? (string) $filters['sort']
                : 'created_at_desc',
        ];

        $query = Assessment::query()
            ->with(['position:id,title', 'createdBy:id,name'])
            ->withCount(['questions', 'projectTasks'])
            ->when($normalizedFilters['search'] !== '', function ($query) use ($normalizedFilters) {
                $search = $normalizedFilters['search'];

                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhereHas('position', fn ($query) => $query->where('title', 'like', "%{$search}%"));
                });
            })
            ->when($normalizedFilters['position_id'] !== '', function ($query) use ($normalizedFilters) {
                $query->where('position_id', $normalizedFilters['position_id']);
            })
            ->when($normalizedFilters['duration_min'] !== '', function ($query) use ($normalizedFilters) {
                $query->where('duration_minutes', '>=', (int) $normalizedFilters['duration_min']);
            })
            ->when($normalizedFilters['duration_max'] !== '', function ($query) use ($normalizedFilters) {
                $query->where('duration_minutes', '<=', (int) $normalizedFilters['duration_max']);
            });

        match ($normalizedFilters['sort']) {
            'created_at_asc' => $query->oldest('created_at')->orderBy('id'),
            'title_asc' => $query->orderBy('title')->orderBy('id'),
            'position_title_asc' => $query
                ->orderBy(Position::query()
                    ->select('title')
                    ->whereColumn('positions.id', 'assessments.position_id'))
                ->orderBy('assessments.id'),
            'duration_minutes_asc' => $query->orderBy('duration_minutes')->orderBy('id'),
            'duration_minutes_desc' => $query->orderByDesc('duration_minutes')->orderByDesc('id'),
            default => $query->latest('created_at')->orderByDesc('id'),
        };

        return [
            'assessments' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(static fn (Assessment $assessment): array => [
                    'id' => $assessment->id,
                    'title' => $assessment->title,
                    'duration_minutes' => $assessment->duration_minutes,
                    'position_id' => $assessment->position_id,
                    'position_title' => $assessment->position?->title,
                    'questions_count' => $assessment->questions_count,
                    'project_tasks_count' => $assessment->project_tasks_count,
                    'created_at' => $assessment->created_at?->toIso8601String(),
                    'updated_at' => $assessment->updated_at?->toIso8601String(),
                    'created_by_name' => $assessment->createdBy?->name,
                ]),
            'filters' => $normalizedFilters,
            'positionOptions' => $this->getPositionOptions(),
            'sortOptions' => [
                ['value' => 'created_at_desc', 'label' => 'Terbaru'],
                ['value' => 'created_at_asc', 'label' => 'Terlama'],
                ['value' => 'title_asc', 'label' => 'Judul A-Z'],
                ['value' => 'position_title_asc', 'label' => 'Posisi A-Z'],
                ['value' => 'duration_minutes_asc', 'label' => 'Durasi terkecil'],
                ['value' => 'duration_minutes_desc', 'label' => 'Durasi terbesar'],
            ],
        ];
    }

    public function getAdminAssessmentDetail(Assessment $assessment): array
    {
        $assessment->load([
            'position:id,title',
            'questions' => fn ($query) => $query->orderBy('order_index')->orderBy('id'),
            'projectTasks' => fn ($query) => $query->orderBy('id'),
        ]);

        return [
            'assessment' => [
                'id' => $assessment->id,
                'position_id' => $assessment->position_id,
                'title' => $assessment->title,
                'duration_minutes' => $assessment->duration_minutes,
                'created_at' => $assessment->created_at?->toIso8601String(),
                'updated_at' => $assessment->updated_at?->toIso8601String(),
            ],
            'position' => [
                'id' => $assessment->position->id,
                'title' => $assessment->position->title,
            ],
            'questions' => $assessment->questions
                ->map(fn (Question $question): array => [
                    'id' => $question->id,
                    'type' => $question->type,
                    'question_text' => $question->question_text,
                    'options' => is_array($question->options) ? array_values($question->options) : [],
                    'correct_answer' => $question->correct_answer,
                    'point_value' => (float) $question->point_value,
                    'order_index' => $question->order_index,
                ])
                ->values()
                ->all(),
            'project_tasks' => $assessment->projectTasks
                ->map(fn (ProjectTask $task): array => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'deadline_hours' => $task->deadline_hours,
                ])
                ->values()
                ->all(),
            'positionOptions' => $this->getPositionOptions(),
        ];
    }

    public function createAssessment(array $data, User $admin): Assessment
    {
        return Assessment::query()->create([
            'position_id' => $data['position_id'],
            'title' => $data['title'],
            'duration_minutes' => $data['duration_minutes'],
            'created_by' => $admin->id,
        ]);
    }

    public function updateAssessment(Assessment $assessment, array $data): Assessment
    {
        $assessment->update([
            'position_id' => $data['position_id'],
            'title' => $data['title'],
            'duration_minutes' => $data['duration_minutes'],
        ]);

        return $assessment->fresh();
    }

    public function createQuestion(Assessment $assessment, array $data): Question
    {
        return DB::transaction(function () use ($assessment, $data): Question {
            return $assessment->questions()->create($this->normalizeQuestionData($data));
        });
    }

    public function updateQuestion(Assessment $assessment, Question $question, array $data): Question
    {
        abort_unless($question->assessment_id === $assessment->id, 404);

        $question->update($this->normalizeQuestionData($data));

        return $question->fresh();
    }

    public function createProjectTask(Assessment $assessment, array $data): ProjectTask
    {
        return $assessment->projectTasks()->create([
            'title' => $data['title'],
            'description' => $data['description'],
            'deadline_hours' => $data['deadline_hours'],
        ]);
    }

    public function updateProjectTask(Assessment $assessment, ProjectTask $projectTask, array $data): ProjectTask
    {
        abort_unless($projectTask->assessment_id === $assessment->id, 404);

        $projectTask->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'deadline_hours' => $data['deadline_hours'],
        ]);

        return $projectTask->fresh();
    }

    public function getCandidateAssessments(User $candidate): array
    {
        $application = Application::query()
            ->where('candidate_id', $candidate->id)
            ->with([
                'position:id,title',
                'assessment:id,title,duration_minutes',
                'assessment.projectTasks:id,assessment_id,title,description,deadline_hours',
                'projectSubmissions:id,application_id,project_task_id,status,file_path,notes,score,score_notes,started_at,submitted_at,deadline_at',
            ])
            ->latest()
            ->first();

        if (! $application) {
            return [
                'application' => null,
                'hasApplication' => false,
            ];
        }

        $projectSubmissions = $application->projectSubmissions->keyBy('project_task_id');
        $status = $application->status;
        $isFinalStatus = ApplicationStatusPresenter::isFinal($status);
        $isAssessmentVisible = ApplicationStatusPresenter::isAssessmentVisible($status);
        $hasProjectTasks = ApplicationStatusPresenter::hasProjectTasks($application);
        $areProjectSubmissionsComplete = ApplicationStatusPresenter::areProjectSubmissionsComplete($application);

        return [
            'hasApplication' => true,
            'application' => [
                'id' => $application->id,
                'status' => $status,
                'statusLabel' => ApplicationStatusPresenter::flowLabel($application),
                'statusTone' => ApplicationStatusPresenter::tone($status),
                'activeStep' => ApplicationStatusPresenter::activeStepFor($application),
                'headline' => ApplicationStatusPresenter::flowHeadline($application),
                'guidance' => ApplicationStatusPresenter::flowGuidance($application, $application->assessment->title),
                'isFinalStatus' => $isFinalStatus,
                'isAssessmentVisible' => $isAssessmentVisible,
                'hasProjectTasks' => $hasProjectTasks,
                'areProjectSubmissionsComplete' => $areProjectSubmissionsComplete,
                'started_at' => $application->started_at?->toIso8601String(),
                'expires_at' => $application->expires_at?->toIso8601String(),
                'submitted_at' => $application->submitted_at?->toIso8601String(),
                'total_score' => $application->total_score ? (float) $application->total_score : null,
                'position' => [
                    'id' => $application->position->id,
                    'title' => $application->position->title,
                ],
                'assessment' => [
                    'id' => $application->assessment->id,
                    'title' => $application->assessment->title,
                    'duration_minutes' => $application->assessment->duration_minutes,
                    'project_tasks' => $isAssessmentVisible
                        ? $application->assessment->projectTasks
                            ->map(function ($task) use ($projectSubmissions) {
                                $submission = $projectSubmissions->get($task->id);

                                return [
                                    'id' => $task->id,
                                    'title' => $task->title,
                                    'description' => $task->description,
                                    'deadline_hours' => $task->deadline_hours,
                                    'submission' => $this->mapProjectSubmission($submission),
                                ];
                            })
                            ->values()
                            ->all()
                        : [],
                ],
            ],
        ];
    }

    /**
     * Start/take an assessment for a candidate.
     * Updates the application status and sets started_at and expires_at timestamps.
     */
    public function takeAssesment(Application $application): Application
    {
        // Only update if status is 'pending' (starting fresh)
        if ($application->status === 'pending') {
            $durationMinutes = $application->assessment->duration_minutes;

            $application->update([
                'status' => 'in_progress',
                'started_at' => now(),
                'expires_at' => now()->addMinutes($durationMinutes),
            ]);
        }

        return $application;
    }

    public function submitAssesment(Application $application, array $mcqAnswers = [], array $essayAnswers = []): Application
    {
        $application->load([
            'assessment.questions:id,assessment_id,type,correct_answer',
            'assessment.projectTasks:id,assessment_id',
        ]);

        $now = now();
        $totalScore = 0;

        $rows = $application->assessment->questions
            ->map(function ($question) use ($application, $mcqAnswers, $essayAnswers, $now, &$totalScore) {
                $rawAnswer = $question->type === 'multiple_choice'
                    ? ($mcqAnswers[$question->id] ?? $mcqAnswers[(string) $question->id] ?? null)
                    : ($essayAnswers[$question->id] ?? $essayAnswers[(string) $question->id] ?? null);

                $answerText = null;
                $score = null;

                if (is_string($rawAnswer)) {
                    $normalized = trim($rawAnswer);

                    if ($normalized !== '') {
                        $answerText = $question->type === 'multiple_choice'
                            ? strtoupper($normalized)
                            : $normalized;

                        if ($question->type === 'multiple_choice') {
                            $correctAnswer = is_string($question->correct_answer) ? strtoupper(trim($question->correct_answer)) : null;
                            $score = ($answerText === $correctAnswer && $correctAnswer !== null && $correctAnswer !== '') ? 1 : 0;
                            $totalScore += $score;
                        }
                    } elseif ($question->type === 'multiple_choice') {
                        $score = 0;
                    }
                } elseif ($question->type === 'multiple_choice') {
                    $score = 0;
                }

                return [
                    'application_id' => $application->id,
                    'question_id' => $question->id,
                    'answer_text' => $answerText,
                    'score' => $score,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            })
            ->all();

        if (! empty($rows)) {
            Answer::query()->upsert(
                $rows,
                ['application_id', 'question_id'],
                ['answer_text', 'score', 'updated_at'],
            );
        }

        $application->update([
            'status' => $application->assessment->projectTasks->isNotEmpty() ? 'submitted' : 'under_review',
            'submitted_at' => $application->submitted_at ?? $now,
            'total_score' => $totalScore,
        ]);

        return $application->fresh();
    }

    /**
     * Log a security warning/violation for a candidate during an assessment.
     *
     * @param  string  $action  One of the AssesmentWarning::ACTION_* constants
     * @param  string|null  $description  Optional extra context
     */
    public function logWarning(Application $application, string $action, ?string $description = null): AssesmentWarning
    {
        return AssesmentWarning::create([
            'assessment_id' => $application->assessment_id,
            'application_id' => $application->id,
            'candidate_id' => $application->candidate_id,
            'action' => $action,
            'description' => $description,
        ]);
    }

    /**
     * Get all assessment questions for the take-assesment page.
     * Groups questions by type (multiple_choice / essay) and attaches
     * the candidate's existing answers so the UI can pre-populate.
     */
    public function getAssessmentForCandidate(Application $application): array
    {
        // Load assessment with all questions ordered by order_index
        $application->load([
            'assessment.questions' => fn ($q) => $q->orderBy('order_index'),
            'assessment.projectTasks',
            'position:id,title',
            'answers:id,application_id,question_id,answer_text',
            'projectSubmissions:id,application_id,project_task_id,status,file_path,notes,score,score_notes,started_at,submitted_at,deadline_at',
        ]);

        $assessment = $application->assessment;
        $answersMap = $application->answers->keyBy('question_id');

        /**
         * @param  Collection  $questions
         */
        $mapQuestion = function ($question) use ($answersMap) {
            $answer = $answersMap->get($question->id);

            // Normalize options: could be null, JSON string, or already an array
            $options = $question->options;
            if (is_string($options)) {
                $options = json_decode($options, true) ?? [];
            }
            if (! is_array($options)) {
                $options = [];
            }

            return [
                'id' => $question->id,
                'type' => $question->type,
                'question_text' => $question->question_text,
                'options' => array_values($options),
                'order_index' => $question->order_index,
                'saved_answer' => $answer?->answer_text,
            ];
        };

        $mcqQuestions = $assessment->questions->where('type', 'multiple_choice')->values()->map($mapQuestion)->all();
        $essayQuestions = $assessment->questions->where('type', 'essay')->values()->map($mapQuestion)->all();
        $projectSubmissions = $application->projectSubmissions->keyBy('project_task_id');
        $projectTasks = $assessment->projectTasks->map(fn ($t) => [
            'id' => $t->id,
            'title' => $t->title,
            'description' => $t->description,
            'deadline_hours' => $t->deadline_hours,
            'submission' => $this->mapProjectSubmission($projectSubmissions->get($t->id)),
        ])->values()->all();
        $remainingSeconds = $application->expires_at
            ? max(0, $application->expires_at->getTimestamp() - now()->getTimestamp())
            : (int) ($assessment->duration_minutes * 60);

        return [
            'applicationId' => $application->id,
            'status' => $application->status,
            'expiresAt' => $application->expires_at?->toIso8601String(),
            'remainingSeconds' => $remainingSeconds,
            'position' => ['id' => $application->position->id, 'title' => $application->position->title],
            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'duration_minutes' => $assessment->duration_minutes,
            ],
            'mcqQuestions' => $mcqQuestions,
            'essayQuestions' => $essayQuestions,
            'projectTasks' => $projectTasks,
        ];
    }

    private function mapProjectSubmission($submission): ?array
    {
        if (! $submission) {
            return null;
        }

        return [
            'id' => $submission->id,
            'status' => $submission->status,
            'file_path' => $submission->file_path,
            'file_url' => $submission->file_path ? Storage::disk('public')->url($submission->file_path) : null,
            'notes' => $submission->notes,
            'score' => $submission->score !== null ? (float) $submission->score : null,
            'score_notes' => $submission->score_notes,
            'started_at' => $submission->started_at?->toIso8601String(),
            'submitted_at' => $submission->submitted_at?->toIso8601String(),
            'deadline_at' => $submission->deadline_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{id: int, title: string|null, is_active: bool}>
     */
    private function getPositionOptions(): array
    {
        return Position::query()
            ->orderBy('title')
            ->get(['id', 'title', 'is_active'])
            ->map(static fn (Position $position): array => [
                'id' => $position->id,
                'title' => $position->title,
                'is_active' => (bool) $position->is_active,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function adminAssessmentSorts(): array
    {
        return [
            'created_at_desc',
            'created_at_asc',
            'title_asc',
            'position_title_asc',
            'duration_minutes_asc',
            'duration_minutes_desc',
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeQuestionData(array $data): array
    {
        if ($data['type'] === 'essay') {
            return [
                'type' => 'essay',
                'question_text' => $data['question_text'],
                'options' => null,
                'correct_answer' => null,
                'point_value' => $data['point_value'],
                'order_index' => $data['order_index'],
            ];
        }

        return [
            'type' => 'multiple_choice',
            'question_text' => $data['question_text'],
            'options' => array_values($data['options'] ?? []),
            'correct_answer' => $data['correct_answer'],
            'point_value' => $data['point_value'],
            'order_index' => $data['order_index'],
        ];
    }
}
