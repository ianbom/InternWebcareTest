<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ProjectSubmission;
use App\Services\ProjectSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectSubmissionController extends Controller
{
    public function __construct(private readonly ProjectSubmissionService $projectSubmissionService) {}

    public function submit(
        Request $request,
        Application $application,
        ProjectSubmission $projectSubmission,
    ): RedirectResponse {
        // abort_unless($application->candidate_id === $request->user()->id, 403);
        // abort_unless($projectSubmission->application_id === $application->id, 404);

        $validated = $request->validate([
            'submission_file' => ['required', 'file', 'max:10240'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->projectSubmissionService->submitForCandidate(
            $application,
            $projectSubmission,
            $validated['submission_file'],
            $validated['notes'] ?? null,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Project berhasil dikumpulkan.',
        ]);

        return to_route('assessments.index');
    }
}
