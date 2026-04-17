<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use App\Support\ApplicationStatusPresenter;
use Illuminate\Support\Facades\Storage;

class DashboardService
{
    public function getCandidateDashboard(User $candidate): array
    {
        $application = Application::query()
            ->where('candidate_id', $candidate->id)
            ->with([
                'position:id,title',
                'assessment:id,title,duration_minutes',
            ])
            ->latest()
            ->first();

        return [
            'candidate' => [
                'name' => $candidate->name,
                'email' => $candidate->email,
                'phone' => $candidate->phone,
                'cv' => $candidate->cv_path ? [
                    'name' => basename($candidate->cv_path),
                    'url' => Storage::disk('public')->url($candidate->cv_path),
                ] : null,
                'profileCompletion' => $this->calculateProfileCompletion($candidate),
                'hasCv' => filled($candidate->cv_path),
                'avatarInitials' => $this->buildInitials($candidate->name),
            ],
            'application' => $application ? $this->mapApplication($application) : null,
        ];
    }

    private function calculateProfileCompletion(User $candidate): int
    {
        $completion = 55;

        if (filled($candidate->phone)) {
            $completion += 15;
        }

        if (filled($candidate->cv_path)) {
            $completion += 30;
        }

        return min($completion, 100);
    }

    private function buildInitials(string $name): string
    {
        $parts = collect(explode(' ', trim($name)))
            ->filter()
            ->take(2)
            ->map(fn (string $part): string => strtoupper(substr($part, 0, 1)));

        return $parts->isNotEmpty() ? $parts->implode('') : 'U';
    }

    /**
     * @return array{
     *     positionTitle: string,
     *     appliedAt: ?string,
     *     status: string,
     *     statusLabel: string,
     *     statusTone: string,
     *     activeStep: string,
     *     headline: string,
     *     nextActionLabel: ?string,
     *     nextActionUrl: ?string,
     *     nextActionMethod: ?string,
     *     canOpenAssessment: bool,
     *     guidance: string
     * }
     */
    private function mapApplication(Application $application): array
    {
        $status = $application->status;

        return [
            'positionTitle' => $application->position->title,
            'appliedAt' => $application->created_at?->format('d M Y'),
            'status' => $status,
            'statusLabel' => ApplicationStatusPresenter::label($status),
            'statusTone' => ApplicationStatusPresenter::tone($status),
            'activeStep' => ApplicationStatusPresenter::activeStep($status),
            'headline' => ApplicationStatusPresenter::headline($status),
            'nextActionLabel' => $this->resolveActionLabel($status),
            'nextActionUrl' => $this->resolveActionUrl($application),
            'nextActionMethod' => $this->resolveActionMethod($status),
            'canOpenAssessment' => ! ApplicationStatusPresenter::isFinal($status),
            'guidance' => ApplicationStatusPresenter::guidance($status, $application->assessment->title),
        ];
    }

    private function resolveActionLabel(string $status): ?string
    {
        return match ($status) {
            'pending' => 'Mulai Assessment',
            'in_progress' => 'Lanjutkan Assessment',
            'submitted', 'under_review' => 'Lihat Status Assessment',
            'approved', 'rejected' => null,
            default => null,
        };
    }

    private function resolveActionUrl(Application $application): ?string
    {
        return match ($application->status) {
            'pending' => route('assessments.start', $application),
            'in_progress' => route('assessments.take', $application),
            'submitted', 'under_review' => route('assessments.index'),
            default => null,
        };
    }

    private function resolveActionMethod(string $status): ?string
    {
        return match ($status) {
            'pending' => 'post',
            'in_progress', 'submitted', 'under_review' => 'get',
            default => null,
        };
    }
}
