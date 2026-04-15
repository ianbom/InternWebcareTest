<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PositionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function __construct(private readonly PositionService $positionService) {}

    public function index(Request $request): Response
    {
        $candidate = $request->user();
        if (! $candidate instanceof User) {
            abort(403);
        }

        $listing = $this->positionService->getCandidatePositionListing($candidate);

        return Inertia::render('position/list-position', [
            'positions' => collect($listing['positions'])->values()->all(),
            'hasAppliedPosition' => (bool) ($listing['hasAppliedPosition'] ?? false),
        ]);
    }
}
