<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
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
     *     activeStep: string,
     *     nextActionLabel: string,
     *     nextActionUrl: string,
     *     guidance: string
     * }
     */
    private function mapApplication(Application $application): array
    {
        return [
            'positionTitle' => $application->position->title,
            'appliedAt' => $application->created_at?->format('d M Y'),
            'status' => $application->status,
            'activeStep' => $this->resolveActiveStep($application->status),
            'nextActionLabel' => $this->resolveActionLabel($application->status),
            'nextActionUrl' => $this->resolveActionUrl($application),
            'guidance' => $this->resolveGuidance($application),
        ];
    }

    private function resolveActiveStep(string $status): string
    {
        return match ($status) {
            'submitted', 'under_review' => 'review',
            'approved', 'rejected' => 'result',
            default => 'assessment',
        };
    }

    private function resolveActionLabel(string $status): string
    {
        return match ($status) {
            'in_progress' => 'Lanjutkan Assessment',
            'submitted', 'under_review' => 'Pantau Progress Seleksi',
            'approved', 'rejected' => 'Lihat Hasil Akhir',
            default => 'Mulai Assessment Sekarang',
        };
    }

    private function resolveActionUrl(Application $application): string
    {
        return match ($application->status) {
            'pending' => "/assessments/{$application->assessment_id}/start",
            'in_progress' => "/assessments/{$application->assessment_id}/continue",
            default => '/assesment',
        };
    }

    private function resolveGuidance(Application $application): string
    {
        return match ($application->status) {
            'in_progress' => 'Assessment sedang berjalan. Pastikan jawaban Anda tersimpan sebelum waktu berakhir.',
            'submitted' => 'Assessment sudah dikirim. Tim reviewer akan meninjau hasil Anda.',
            'under_review' => 'Lamaran Anda sedang dalam tahap review. Mohon tunggu hasil akhir dari tim recruiter.',
            'approved' => 'Selamat! Anda lolos ke tahap akhir. Cek arahan lanjutan dari recruiter.',
            'rejected' => 'Terima kasih sudah mengikuti proses seleksi. Tetap semangat dan coba posisi lainnya.',
            default => "Tahap selanjutnya adalah {$application->assessment->title}. Siapkan koneksi internet yang stabil dan fokus selama sesi berlangsung.",
        };
    }
}
