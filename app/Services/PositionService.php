<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectSubmission;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PositionService
{
    private const ACTIVE_SELECTION_STATUSES = [
        'pending',
        'in_progress',
        'submitted',
        'under_review',
    ];

    public function getCandidatePositionListing(User $candidate): array
    {
        return [
            'positions' => $this->getActivePositions(),
            'hasAppliedPosition' => $this->candidateHasAppliedPosition($candidate),
        ];
    }

    public function applyPosition(User $candidate, Position $position): array
    {
        return DB::transaction(function () use ($candidate, $position): array {
            User::query()
                ->whereKey($candidate->id)
                ->lockForUpdate()
                ->first();

            if (! $position->is_active) {
                return [
                    'success' => false,
                    'message' => 'Posisi sudah tidak tersedia.',
                ];
            }

            if ($this->candidateHasAppliedPosition($candidate)) {
                return [
                    'success' => false,
                    'message' => 'Anda sedang dalam proses seleksi dan belum bisa mendaftar posisi lain.',
                ];
            }

            $assessment = $this->getInitialAssessmentForPosition($position);
            if (! $assessment) {
                return [
                    'success' => false,
                    'message' => 'Posisi ini belum siap menerima pendaftaran.',
                ];
            }

            $projectTasks = $this->getProjectTasks($assessment->id);
            $maxDeadlineHours = $projectTasks->max('deadline_hours');
            $expires_at = $maxDeadlineHours ? now()->addHours($maxDeadlineHours) : null;

            $application = Application::query()->create([
                'candidate_id' => $candidate->id,
                'position_id' => $position->id,
                'assessment_id' => $assessment->id,
                'cv_snapshot' => $candidate->cv_path,
                'status' => 'pending',
                'expires_at' => $expires_at,
            ]);

            $this->createProjectSubmissions($application, $projectTasks);

            return [
                'success' => true,
                'message' => 'Pendaftaran berhasil. Silakan lanjutkan proses seleksi Anda.',
            ];
        });
    }

    private function createProjectSubmissions(Application $application, Collection $projectTasks): void
    {
        if ($projectTasks->isEmpty()) {
            return;
        }

        $now = now();

        ProjectSubmission::query()->insert(
            $projectTasks
                ->map(fn (ProjectTask $task) => [
                    'application_id' => $application->id,
                    'project_task_id' => $task->id,
                    'status' => 'not_submitted',
                    'started_at' => $now,
                    'deadline_at' => $now->copy()->addHours($task->deadline_hours),
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->all(),
        );
    }

    private function getActivePositions(): Collection
    {
        return Position::query()
            ->where('is_active', true)
            ->orderBy('title')
            ->get(['id', 'title', 'description'])
            ->map(static fn (Position $position): array => [
                'id' => $position->id,
                'title' => $position->title,
                'description' => $position->description,
            ]);
    }

    private function getProjectTasks(int $assessmentId): Collection
    {
        return ProjectTask::query()
            ->where('assessment_id', $assessmentId)
            ->get();
    }

    private function candidateHasAppliedPosition(User $candidate): bool
    {
        return $candidate->applications()
            ->whereIn('status', self::ACTIVE_SELECTION_STATUSES)
            ->exists();
    }

    private function getInitialAssessmentForPosition(Position $position): ?Assessment
    {
        return $position->assessments()
            ->orderBy('id')
            ->first();
    }
}
