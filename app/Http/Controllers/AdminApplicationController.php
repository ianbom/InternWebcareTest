<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminApplicationIndexRequest;
use App\Http\Requests\AdminApplicationReviewRequest;
use App\Models\Application;
use App\Models\User;
use App\Services\AdminApplicationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminApplicationController extends Controller
{
    public function __construct(private readonly AdminApplicationService $adminApplicationService) {}

    public function index(AdminApplicationIndexRequest $request): Response
    {
        $filters = $this->adminApplicationService->normalizeFilters($request->validated());

        return Inertia::render('applications/index', [
            'applications' => $this->adminApplicationService->paginateApplications($filters),
            'filters' => $filters,
            'options' => $this->adminApplicationService->getFilterOptions(),
        ]);
    }

    public function show(Application $application): Response
    {
        return Inertia::render(
            'applications/show',
            $this->adminApplicationService->getApplicationDetail($application),
        );
    }

    public function updateReview(
        AdminApplicationReviewRequest $request,
        Application $application,
    ): RedirectResponse {
        /** @var User $admin */
        $admin = $request->user();

        $this->adminApplicationService->updateReview(
            $application,
            $admin,
            $request->validated(),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Review application berhasil disimpan.',
        ]);

        return to_route('applications.show', [
            'application' => $application,
            ...$request->query(),
        ]);
    }
}
