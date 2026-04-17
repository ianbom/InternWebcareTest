<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\StoreAssessmentRequest;
use App\Http\Requests\Assessment\UpdateAssessmentRequest;
use App\Http\Requests\ProjectTask\StoreProjectTaskRequest;
use App\Http\Requests\ProjectTask\UpdateProjectTaskRequest;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Models\Application;
use App\Models\Assessment;
use App\Models\ProjectTask;
use App\Models\Question;
use App\Models\User;
use App\Services\AssesmentService;
use Illuminate\Http\JsonResponse;
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
        if ($request->routeIs('assessments.list')) {
            return Inertia::render('assesment/index', $this->assesmentService->getAdminAssessmentListing($request->query()));
        }

        $candidate = $request->user();
        abort_unless($candidate?->role === 'candidate', 403);

        return Inertia::render('assesment/list-assesment', $this->assesmentService->getCandidateAssessments($candidate));
    }

    public function store(StoreAssessmentRequest $request): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->assesmentService->createAssessment($request->validated(), $admin);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Assessment berhasil dibuat.',
        ]);

        return to_route('assessments.list');
    }

    public function show(Assessment $assessment): Response
    {
        return Inertia::render('assesment/show', $this->assesmentService->getAdminAssessmentDetail($assessment));
    }

    public function update(UpdateAssessmentRequest $request, Assessment $assessment): RedirectResponse
    {
        $this->assesmentService->updateAssessment($assessment, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Assessment berhasil diperbarui.',
        ]);

        return to_route('assessments.list');
    }

    public function storeQuestion(StoreQuestionRequest $request, Assessment $assessment): RedirectResponse
    {
        $this->assesmentService->createQuestion($assessment, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Question berhasil dibuat.',
        ]);

        return to_route('assessments.show', $assessment);
    }

    public function updateQuestion(
        UpdateQuestionRequest $request,
        Assessment $assessment,
        Question $question,
    ): RedirectResponse {
        $this->assesmentService->updateQuestion($assessment, $question, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Question berhasil diperbarui.',
        ]);

        return to_route('assessments.show', $assessment);
    }

    public function storeProjectTask(StoreProjectTaskRequest $request, Assessment $assessment): RedirectResponse
    {
        $this->assesmentService->createProjectTask($assessment, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Project task berhasil dibuat.',
        ]);

        return to_route('assessments.show', $assessment);
    }

    public function updateProjectTask(
        UpdateProjectTaskRequest $request,
        Assessment $assessment,
        ProjectTask $projectTask,
    ): RedirectResponse {
        $this->assesmentService->updateProjectTask($assessment, $projectTask, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Project task berhasil diperbarui.',
        ]);

        return to_route('assessments.show', $assessment);
    }

    /**
     * Start/take an assessment - sets the application to in_progress
     * and redirects to the take-assesment page.
     */
    public function startAssessment(Request $request, Application $application)
    {
        // Ensure this application belongs to the authenticated candidate
        abort_unless($application->candidate_id === $request->user()->id, 403);

        if ($application->status === 'in_progress') {
            return redirect()->route('assessments.take', $application);
        }

        if ($application->status !== 'pending') {
            return to_route('assessments.index');
        }

        // Start the assessment
        $this->assesmentService->takeAssesment($application);

        return redirect()->route('assessments.take', $application);
    }

    /**
     * Take / continue the assessment (take-assesment page).
     * Only the owning candidate may access this page.
     */
    public function take(Request $request, Application $application): Response|RedirectResponse
    {
        // Ensure this application belongs to the authenticated candidate
        abort_unless($application->candidate_id === $request->user()->id, 403);

        if ($application->status !== 'in_progress') {
            return to_route('assessments.index');
        }

        return Inertia::render('assesment/take-assesment', $this->assesmentService->getAssessmentForCandidate($application));
    }

    /**
     * Submit and complete the assessment attempt.
     */
    public function submit(Request $request, Application $application): RedirectResponse
    {
        abort_unless($application->candidate_id === $request->user()->id, 403);

        if ($application->status !== 'in_progress') {
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

    /**
     * Log a security warning/violation made by a candidate during an assessment.
     * Accepts a JSON body: { "action": "tab_switch", "description": "..." }
     */
    public function logWarning(Request $request, Application $application): JsonResponse
    {
        abort_unless($application->candidate_id === $request->user()?->id, 403);

        if ($application->status !== 'in_progress') {
            return response()->json(['message' => 'Assessment is not in progress.'], 422);
        }

        $validated = $request->validate([
            'action' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $warning = $this->assesmentService->logWarning(
            $application,
            $validated['action'],
            $validated['description'] ?? null,
        );

        return response()->json([
            'message' => 'Warning logged.',
            'id' => $warning->id,
        ], 201);
    }
}
