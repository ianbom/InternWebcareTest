<?php

namespace App\Services;

use App\Models\Application;
use App\Models\ProjectSubmission;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProjectSubmissionService
{
    public function submitForCandidate(
        Application $application,
        ProjectSubmission $projectSubmission,
        UploadedFile $submissionFile,
        ?string $notes = null,
    ): ProjectSubmission {
        return DB::transaction(function () use ($application, $projectSubmission, $submissionFile, $notes): ProjectSubmission {
            $submission = ProjectSubmission::query()
                ->whereKey($projectSubmission->id)
                ->lockForUpdate()
                ->firstOrFail();

            $this->ensureSubmissionCanBeUpdated($application, $submission);

            if ($submission->file_path) {
                Storage::disk('public')->delete($submission->file_path);
            }

            $filePath = $submissionFile->store(
                sprintf('project-submissions/%d', $application->id),
                'public',
            );

            $submittedAt = now();

            $submission->update([
                'status' => 'submitted',
                'file_path' => $filePath,
                'notes' => $notes,
                'submitted_at' => $submittedAt,
            ]);

            $application->load('projectSubmissions');

            $allProjectsSubmitted = $application->projectSubmissions
                ->every(fn (ProjectSubmission $projectSubmission): bool => in_array(
                    $projectSubmission->status,
                    ['submitted', 'reviewed'],
                    true,
                ));

            if ($allProjectsSubmitted) {
                $application->update(['status' => 'under_review']);
            }

            return $submission->fresh(['projectTask']);
        });
    }

    private function ensureSubmissionCanBeUpdated(
        Application $application,
        ProjectSubmission $projectSubmission,
    ): void {
        if ($application->status !== 'submitted') {
            throw ValidationException::withMessages([
                'submission_file' => 'Project belum dapat dikumpulkan pada tahap ini.',
            ]);
        }

        if ($projectSubmission->status === 'reviewed') {
            throw ValidationException::withMessages([
                'submission_file' => 'Project yang sudah direview tidak dapat diubah.',
            ]);
        }

        if ($projectSubmission->deadline_at && now()->greaterThan($projectSubmission->deadline_at)) {
            throw ValidationException::withMessages([
                'submission_file' => 'Batas waktu pengumpulan project sudah berakhir.',
            ]);
        }
    }
}
