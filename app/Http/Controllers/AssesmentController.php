<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Application;
use App\Services\AssesmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssesmentController extends Controller
{
    public function __construct(private readonly AssesmentService $assesmentService) {}

    /** Candidate's assessment overview (list-assesment page). */
    public function index(Request $request): Response
    {
        $candidate = $request->user();
        

        return Inertia::render('assesment/list-assesment', $this->assesmentService->getCandidateAssessments($candidate));
    }

    /**
     * Start/take an assessment - sets the application to in_progress
     * and redirects to the take-assesment page.
     */
    public function startAssessment(Request $request, Application $application)
    {
        // Ensure this application belongs to the authenticated candidate
        abort_unless($application->candidate_id === $request->user()->id, 403);

        // Start the assessment
        $this->assesmentService->takeAssesment($application);

        return redirect()->route('assessments.take', $application);
    }

    /**
     * Take / continue the assessment (take-assesment page).
     * Only the owning candidate may access this page.
     */
    public function take(Request $request, Application $application): Response
    {
        // Ensure this application belongs to the authenticated candidate
        abort_unless($application->candidate_id === $request->user()->id, 403);

        return Inertia::render('assesment/take-assesment', $this->assesmentService->getAssessmentForCandidate($application));
    }

    /**
     * Submit and complete the assessment attempt.
     */
    public function submit(Request $request, Application $application): RedirectResponse
    {
        abort_unless($application->candidate_id === $request->user()->id, 403);

        if (in_array($application->status, ['submitted', 'under_review', 'approved', 'rejected'], true)) {
            return to_route('assessments.index');
        }

        $validated = $request->validate([
            'mcq_answers' => ['nullable', 'array'],
            'mcq_answers.*' => ['nullable', 'string'],
            'essay_answers' => ['nullable', 'array'],
            'essay_answers.*' => ['nullable', 'string'],
        ]);

        $mcqAnswers = $validated['mcq_answers'] ?? [];
        $essayAnswers = $validated['essay_answers'] ?? [];

        $this->assesmentService->submitAssesment(
            $application,
            $mcqAnswers,
            $essayAnswers,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Assessment berhasil dikumpulkan.',
        ]);

        return to_route('assessments.index');
    }
}
