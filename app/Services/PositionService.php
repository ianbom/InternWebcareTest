<?php

namespace App\Services;

use App\Models\Position;
use App\Models\User;
use Illuminate\Support\Collection;

class PositionService
{
    /**
     * @return array{
     *     positions: Collection<int, array{id: int, title: string, description: ?string}>,
     *     hasAppliedPosition: bool
     * }
     */
    public function getCandidatePositionListing(User $candidate): array
    {
        return [
            'positions' => $this->getActivePositions(),
            'hasAppliedPosition' => $this->candidateHasAppliedPosition($candidate),
        ];
    }

    /**
     * @return Collection<int, array{id: int, title: string, description: ?string}>
     */
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

    private function candidateHasAppliedPosition(User $candidate): bool
    {
        return $candidate->applications()->exists();
    }
}
