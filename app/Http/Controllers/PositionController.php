<?php

namespace App\Http\Controllers;

use App\Http\Requests\Position\StorePositionRequest;
use App\Http\Requests\Position\UpdatePositionRequest;
use App\Models\Position;
use App\Models\User;
use App\Services\PositionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function __construct(private readonly PositionService $positionService) {}

    public function index(Request $request): Response
    {
        if ($request->user()?->role === 'admin') {
            return Inertia::render('position/index', $this->positionService->getAdminPositionListing($request->query()));
        }

        $candidate = $this->authenticatedCandidate($request);

        $listing = $this->positionService->getCandidatePositionListing($candidate);

        return Inertia::render('position/list-position', [
            'positions' => collect($listing['positions'])->values()->all(),
            'hasAppliedPosition' => (bool) ($listing['hasAppliedPosition'] ?? false),
        ]);
    }

    public function store(StorePositionRequest $request): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->positionService->createPosition($request->validated(), $admin);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Position berhasil dibuat.',
        ]);

        return to_route('positions.index');
    }

    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $this->positionService->updatePosition($position, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Position berhasil diperbarui.',
        ]);

        return to_route('positions.index');
    }

    public function applyPosition(Request $request, Position $position): RedirectResponse
    {
        $candidate = $this->authenticatedCandidate($request);
        $result = $this->positionService->applyPosition($candidate, $position);

        Inertia::flash('toast', [
            'type' => $result['success'] ? 'success' : 'error',
            'message' => __($result['message']),
        ]);

        return to_route('positions.index');
    }

    private function authenticatedCandidate(Request $request): User
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless($user->role === 'candidate', 403);

        return $user;
    }
}
