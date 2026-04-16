<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Application;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class AssesmentService
{
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
                'application'    => null,
                'hasApplication' => false,
            ];
        }

        $projectSubmissions = $application->projectSubmissions->keyBy('project_task_id');

        return [
            'hasApplication' => true,
            'application'    => [
                'id'           => $application->id,
                'status'       => $application->status,
                'started_at'   => $application->started_at?->toIso8601String(),
                'expires_at'   => $application->expires_at?->toIso8601String(),
                'submitted_at' => $application->submitted_at?->toIso8601String(),
                'total_score'  => $application->total_score ? (float) $application->total_score : null,
                'position'     => [
                    'id'    => $application->position->id,
                    'title' => $application->position->title,
                ],
                'assessment'   => [
                    'id'               => $application->assessment->id,
                    'title'            => $application->assessment->title,
                    'duration_minutes' => $application->assessment->duration_minutes,
                    'project_tasks'    => $application->assessment->projectTasks
                        ->map(function ($task) use ($projectSubmissions) {
                            $submission = $projectSubmissions->get($task->id);

                            return [
                                'id'             => $task->id,
                                'title'          => $task->title,
                                'description'    => $task->description,
                                'deadline_hours' => $task->deadline_hours,
                                'submission'     => $this->mapProjectSubmission($submission),
                            ];
                        })
                        ->values()
                        ->all(),
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
                'status'     => 'in_progress',
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
                    } else if ($question->type === 'multiple_choice') {
                        $score = 0;
                    }
                } else if ($question->type === 'multiple_choice') {
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
            'status' => 'submitted',
            'submitted_at' => $application->submitted_at ?? $now,
            'total_score' => $totalScore,
        ]);

        return $application->fresh();
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

        $assessment   = $application->assessment;
        $answersMap   = $application->answers->keyBy('question_id');

        /**
         * @param Collection $questions
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
                'id'            => $question->id,
                'type'          => $question->type,
                'question_text' => $question->question_text,
                'options'       => array_values($options),
                'order_index'   => $question->order_index,
                'saved_answer'  => $answer?->answer_text,
            ];
        };

        $mcqQuestions   = $assessment->questions->where('type', 'multiple_choice')->values()->map($mapQuestion)->all();
        $essayQuestions = $assessment->questions->where('type', 'essay')->values()->map($mapQuestion)->all();
        $projectSubmissions = $application->projectSubmissions->keyBy('project_task_id');
        $projectTasks   = $assessment->projectTasks->map(fn ($t) => [
            'id'             => $t->id,
            'title'          => $t->title,
            'description'    => $t->description,
            'deadline_hours' => $t->deadline_hours,
            'submission'     => $this->mapProjectSubmission($projectSubmissions->get($t->id)),
        ])->values()->all();
        $remainingSeconds = $application->expires_at
            ? max(0, $application->expires_at->getTimestamp() - now()->getTimestamp())
            : (int) ($assessment->duration_minutes * 60);

        return [
            'applicationId'  => $application->id,
            'status'         => $application->status,
            'expiresAt'      => $application->expires_at?->toIso8601String(),
            'remainingSeconds' => $remainingSeconds,
            'position'       => ['id' => $application->position->id, 'title' => $application->position->title],
            'assessment'     => [
                'id'               => $assessment->id,
                'title'            => $assessment->title,
                'duration_minutes' => $assessment->duration_minutes,
            ],
            'mcqQuestions'   => $mcqQuestions,
            'essayQuestions' => $essayQuestions,
            'projectTasks'   => $projectTasks,
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
}
