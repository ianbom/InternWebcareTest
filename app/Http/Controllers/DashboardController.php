<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function index(Request $request): Response|RedirectResponse
    {
        /** @var User $candidate */
        $candidate = $request->user();

        if ($candidate->role === 'admin') {
            return to_route('applications.index');
        }

        return Inertia::render('dashboard', $this->dashboardService->getCandidateDashboard($candidate));
    }
}
