<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Application;
use App\Models\Position;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminApplicationService
{
    public const STATUSES = [
        'pending',
        'in_progress',
        'submitted',
        'under_review',
        'approved',
        'rejected',
    ];

    public const REVIEW_STATUSES = [
        'under_review',
        'approved',
        'rejected',
    ];

    public const SORTS = [
        'created_at_desc',
        'created_at_asc',
        'submitted_at_desc',
        'candidate_name_asc',
        'position_title_asc',
        'total_score_desc',
    ];

    public function paginateApplications(array $filters): LengthAwarePaginator
    {
        $sort = $filters['sort'] ?? 'created_at_desc';

        $query = Application::query()
            ->select([
                'id',
                'candidate_id',
                'position_id',
                'status',
                'total_score',
                'created_at',
                'submitted_at',
                'reviewed_by',
            ])
            ->with([
                'candidate:id,name,email,phone',
                'position:id,title',
                'reviewedBy:id,name',
            ]);

        $this->applyFilters($query, $filters);
        $this->applySort($query, is_string($sort) ? $sort : 'created_at_desc');

        return $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Application $application): array => [
                'id' => $application->id,
                'candidate_name' => $application->candidate?->name,
                'email' => $application->candidate?->email,
                'phone' => $application->candidate?->phone,
                'position_title' => $application->position?->title,
                'status' => $application->status,
                'total_score' => $application->total_score !== null ? (float) $application->total_score : null,
                'created_at' => $application->created_at?->toIso8601String(),
                'submitted_at' => $application->submitted_at?->toIso8601String(),
                'reviewer_name' => $application->reviewedBy?->name,
            ]);
    }

    public function getApplicationDetail(Application $application): array
    {
        $application->load([
            'candidate:id,name,email,phone,cv_path,duration,intern_start',
            'position:id,title',
            'assessment:id,title,duration_minutes',
            'answers.question:id,type,question_text,correct_answer,point_value,order_index',
            'projectSubmissions.projectTask:id,title,description',
            'warnings:id,application_id,action,description,created_at',
        ]);

        $answers = $application->answers
            ->sortBy(fn (Answer $answer): int => (int) $answer->question?->order_index)
            ->values();

        return [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'created_at' => $application->created_at?->toIso8601String(),
                'started_at' => $application->started_at?->toIso8601String(),
                'submitted_at' => $application->submitted_at?->toIso8601String(),
                'expires_at' => $application->expires_at?->toIso8601String(),
                'total_score' => $application->total_score !== null ? (float) $application->total_score : null,
                'admin_notes' => $application->admin_notes,
                'reviewed_at' => $application->reviewed_at?->toIso8601String(),
            ],
            'candidate' => [
                'id' => $application->candidate?->id,
                'name' => $application->candidate?->name,
                'email' => $application->candidate?->email,
                'phone' => $application->candidate?->phone,
                'cv_url' => $this->storageUrl($application->cv_snapshot ?: $application->candidate?->cv_path),
                'duration' => $application->candidate?->duration,
                'intern_start' => $application->candidate?->intern_start ? \Carbon\Carbon::parse($application->candidate->intern_start)->toDateString() : null,
            ],
            'position' => [
                'id' => $application->position?->id,
                'title' => $application->position?->title,
            ],
            'assessment' => [
                'id' => $application->assessment?->id,
                'title' => $application->assessment?->title,
                'duration_minutes' => $application->assessment?->duration_minutes,
            ],
            'mcq_answers' => $answers
                ->filter(fn (Answer $answer): bool => $answer->question?->type === 'multiple_choice')
                ->map(fn (Answer $answer): array => [
                    'question_text' => $answer->question?->question_text,
                    'candidate_answer' => $answer->answer_text,
                    'correct_answer' => $answer->question?->correct_answer,
                    'auto_score' => $answer->score !== null ? (float) $answer->score : null,
                ])
                ->values()
                ->all(),
            'essay_answers' => $answers
                ->filter(fn (Answer $answer): bool => $answer->question?->type === 'essay')
                ->map(fn (Answer $answer): array => [
                    'answer_id' => $answer->id,
                    'question_text' => $answer->question?->question_text,
                    'answer_text' => $answer->answer_text,
                    'point_value' => $answer->question?->point_value !== null ? (float) $answer->question->point_value : null,
                    'score' => $answer->score !== null ? (float) $answer->score : null,
                    'scored_at' => $answer->scored_at?->toIso8601String(),
                ])
                ->values()
                ->all(),
            'project_submissions' => $application->projectSubmissions
                ->sortBy('id')
                ->map(fn (ProjectSubmission $submission): array => [
                    'submission_id' => $submission->id,
                    'task_title' => $submission->projectTask?->title,
                    'description' => $submission->projectTask?->description,
                    'candidate_notes' => $submission->notes,
                    'file_url' => $this->storageUrl($submission->file_path),
                    'deadline_at' => $submission->deadline_at?->toIso8601String(),
                    'submitted_at' => $submission->submitted_at?->toIso8601String(),
                    'score' => $submission->score !== null ? (float) $submission->score : null,
                    'score_notes' => $submission->score_notes,
                    'scored_at' => $submission->scored_at?->toIso8601String(),
                ])
                ->values()
                ->all(),
            'warnings' => $application->warnings
                ->sortBy('id')
                ->map(fn ($warning): array => [
                    'id' => $warning->id,
                    'action' => $warning->action,
                    'description' => $warning->description,
                    'created_at' => $warning->created_at?->toIso8601String(),
                ])
                ->values()
                ->all(),
        ];
    }

    public function updateReview(Application $application, User $admin, array $payload): Application
    {
        return DB::transaction(function () use ($application, $admin, $payload): Application {
            $reviewedAt = now();

            $application = Application::query()
                ->whereKey($application->id)
                ->lockForUpdate()
                ->firstOrFail();

            foreach ($payload['essay_reviews'] ?? [] as $review) {
                if (! is_array($review) || blank($review['answer_id'] ?? null)) {
                    continue;
                }

                Answer::query()
                    ->whereKey($review['answer_id'])
                    ->where('application_id', $application->id)
                    ->update([
                        'score' => $review['score'] ?? null,
                        'scored_by' => $admin->id,
                        'scored_at' => $reviewedAt,
                        'updated_at' => $reviewedAt,
                    ]);
            }

            foreach ($payload['project_reviews'] ?? [] as $review) {
                if (! is_array($review) || blank($review['project_submission_id'] ?? null)) {
                    continue;
                }

                ProjectSubmission::query()
                    ->whereKey($review['project_submission_id'])
                    ->where('application_id', $application->id)
                    ->update([
                        'status' => 'reviewed',
                        'score' => $review['score'] ?? null,
                        'score_notes' => $review['score_notes'] ?? null,
                        'scored_by' => $admin->id,
                        'scored_at' => $reviewedAt,
                        'updated_at' => $reviewedAt,
                    ]);
            }

            $application->update([
                'status' => $payload['status'],
                'admin_notes' => $payload['admin_notes'] ?? null,
                'reviewed_by' => $admin->id,
                'reviewed_at' => $reviewedAt,
            ]);

            return $application->fresh();
        });
    }

    public function getFilterOptions(): array
    {
        return [
            'statuses' => self::STATUSES,
            'review_statuses' => self::REVIEW_STATUSES,
            'sorts' => self::SORTS,
            'positions' => Position::query()
                ->orderBy('title')
                ->get(['id', 'title'])
                ->map(fn (Position $position): array => [
                    'id' => $position->id,
                    'title' => $position->title,
                ])
                ->all(),
        ];
    }

    public function normalizeFilters(array $input): array
    {
        return [
            'search' => $input['search'] ?? '',
            'status' => $input['status'] ?? '',
            'position_id' => isset($input['position_id']) ? (string) $input['position_id'] : '',
            'applied_from' => $input['applied_from'] ?? '',
            'applied_to' => $input['applied_to'] ?? '',
            'submitted_from' => $input['submitted_from'] ?? '',
            'submitted_to' => $input['submitted_to'] ?? '',
            'min_score' => isset($input['min_score']) ? (string) $input['min_score'] : '',
            'max_score' => isset($input['max_score']) ? (string) $input['max_score'] : '',
            'sort' => $input['sort'] ?? 'created_at_desc',
        ];
    }

    /**
     * @param  Builder<Application>  $query
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $search = $filters['search'] ?? null;

        if (filled($search)) {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->whereHas('candidate', function (Builder $candidateQuery) use ($search): void {
                        $candidateQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('position', function (Builder $positionQuery) use ($search): void {
                        $positionQuery->where('title', 'like', "%{$search}%");
                    });
            });
        }

        $query
            ->when(filled($filters['status'] ?? null), fn (Builder $query) => $query->where('status', $filters['status']))
            ->when(filled($filters['position_id'] ?? null), fn (Builder $query) => $query->where('position_id', $filters['position_id']))
            ->when(filled($filters['applied_from'] ?? null), fn (Builder $query) => $query->whereDate('created_at', '>=', $filters['applied_from']))
            ->when(filled($filters['applied_to'] ?? null), fn (Builder $query) => $query->whereDate('created_at', '<=', $filters['applied_to']))
            ->when(filled($filters['submitted_from'] ?? null), fn (Builder $query) => $query->whereDate('submitted_at', '>=', $filters['submitted_from']))
            ->when(filled($filters['submitted_to'] ?? null), fn (Builder $query) => $query->whereDate('submitted_at', '<=', $filters['submitted_to']))
            ->when(filled($filters['min_score'] ?? null), fn (Builder $query) => $query->where('total_score', '>=', $filters['min_score']))
            ->when(filled($filters['max_score'] ?? null), fn (Builder $query) => $query->where('total_score', '<=', $filters['max_score']));
    }

    /**
     * @param  Builder<Application>  $query
     */
    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'created_at_asc' => $query->orderBy('created_at')->orderBy('id'),
            'submitted_at_desc' => $query->orderByDesc('submitted_at')->orderByDesc('id'),
            'candidate_name_asc' => $query
                ->orderBy(User::query()
                    ->select('name')
                    ->whereColumn('users.id', 'applications.candidate_id'))
                ->orderBy('id'),
            'position_title_asc' => $query
                ->orderBy(Position::query()
                    ->select('title')
                    ->whereColumn('positions.id', 'applications.position_id'))
                ->orderBy('id'),
            'total_score_desc' => $query->orderByDesc('total_score')->orderByDesc('id'),
            default => $query->orderByDesc('created_at')->orderByDesc('id'),
        };
    }

    private function storageUrl(?string $path): ?string
    {
        return filled($path) ? Storage::disk('public')->url($path) : null;
    }
}
