<?php

namespace App\Support;

use App\Models\Application;

class ApplicationStatusPresenter
{
    public const FINAL_STATUSES = ['approved', 'rejected'];

    public const ASSESSMENT_VISIBLE_STATUSES = [
        'pending',
        'in_progress',
        'submitted',
        'under_review',
    ];

    public static function label(string $status): string
    {
        return match ($status) {
            'pending' => 'Menunggu Quiz',
            'in_progress' => 'Quiz Berjalan',
            'submitted' => 'Quiz Terkirim',
            'under_review' => 'Menunggu Review',
            'approved' => 'Diterima',
            'rejected' => 'Ditolak',
            default => 'Status Tidak Diketahui',
        };
    }

    public static function flowLabel(Application $application): string
    {
        return match (self::activeStepFor($application)) {
            'quiz' => self::label($application->status),
            'project' => 'Project Berjalan',
            'review' => 'Menunggu Review',
            'result' => self::label($application->status),
            default => 'Data Diri',
        };
    }

    public static function tone(string $status): string
    {
        return match ($status) {
            'in_progress', 'submitted' => 'info',
            'pending', 'under_review' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            default => 'neutral',
        };
    }

    public static function headline(string $status): string
    {
        return match ($status) {
            'pending' => 'Quiz seleksi siap dimulai.',
            'in_progress' => 'Quiz seleksi sedang berjalan.',
            'submitted' => 'Quiz seleksi berhasil dikirim.',
            'under_review' => 'Lamaran sedang menunggu review.',
            'approved' => 'Selamat, lamaran Anda diterima.',
            'rejected' => 'Lamaran Anda belum diterima.',
            default => 'Pantau status lamaran Anda.',
        };
    }

    public static function flowHeadline(Application $application): string
    {
        return match (self::activeStepFor($application)) {
            'quiz' => self::headline($application->status),
            'project' => 'Tahap project sudah terbuka.',
            'review' => 'Semua pekerjaan sudah masuk ke tahap review.',
            'result' => self::headline($application->status),
            default => 'Lengkapi data diri terlebih dahulu.',
        };
    }

    public static function guidance(string $status, ?string $assessmentTitle = null): string
    {
        return match ($status) {
            'pending' => sprintf(
                'Tahap selanjutnya adalah %s. Siapkan koneksi internet yang stabil dan fokus selama sesi berlangsung.',
                $assessmentTitle ?: 'assessment',
            ),
            'in_progress' => 'Assessment sedang berjalan. Pastikan jawaban Anda tersimpan sebelum waktu berakhir.',
            'submitted' => 'Assessment sudah dikirim. Tim reviewer akan meninjau hasil Anda.',
            'under_review' => 'Lamaran Anda sedang dalam tahap review. Mohon tunggu hasil akhir dari tim recruiter.',
            'approved' => 'Selamat! Anda diterima untuk posisi ini. Tim recruiter akan menghubungi Anda untuk arahan berikutnya.',
            'rejected' => 'Terima kasih sudah mengikuti proses seleksi. Tetap semangat dan coba posisi lain yang sesuai.',
            default => 'Silakan pantau status lamaran Anda secara berkala.',
        };
    }

    public static function flowGuidance(Application $application, ?string $assessmentTitle = null): string
    {
        return match (self::activeStepFor($application)) {
            'quiz' => self::guidance($application->status, $assessmentTitle),
            'project' => 'Quiz Anda sudah terkirim. Lanjutkan dengan mengerjakan dan mengunggah project sesuai task yang tersedia.',
            'review' => self::hasProjectTasks($application)
                ? 'Quiz dan project Anda sudah dikirim. Tim reviewer akan menilai hasil pekerjaan Anda sebelum menentukan hasil akhir.'
                : 'Quiz Anda sudah dikirim. Tim reviewer akan menilai hasil Anda sebelum menentukan hasil akhir.',
            'result' => self::guidance($application->status, $assessmentTitle),
            default => 'Lengkapi profil, CV, dan data kontak sebelum melamar posisi.',
        };
    }

    public static function activeStep(string $status): string
    {
        return match ($status) {
            'submitted', 'under_review' => 'review',
            'approved', 'rejected' => 'result',
            default => 'assessment',
        };
    }

    public static function activeStepFor(Application $application): string
    {
        if (self::isFinal($application->status)) {
            return 'result';
        }

        if (in_array($application->status, ['pending', 'in_progress'], true)) {
            return 'quiz';
        }

        if ($application->status === 'submitted') {
            if (self::hasProjectTasks($application) && ! self::areProjectSubmissionsComplete($application)) {
                return 'project';
            }

            return 'review';
        }

        if ($application->status === 'under_review') {
            return 'review';
        }

        return 'profile';
    }

    public static function hasProjectTasks(Application $application): bool
    {
        if ($application->relationLoaded('assessment') && $application->assessment?->relationLoaded('projectTasks')) {
            return $application->assessment->projectTasks->isNotEmpty();
        }

        return $application->assessment?->projectTasks()->exists() ?? false;
    }

    public static function areProjectSubmissionsComplete(Application $application): bool
    {
        if (! self::hasProjectTasks($application)) {
            return false;
        }

        $projectTasksCount = $application->assessment?->projectTasks?->count() ?? 0;

        if (! $application->relationLoaded('projectSubmissions')) {
            $application->loadMissing('projectSubmissions');
        }

        return $projectTasksCount > 0
            && $application->projectSubmissions->count() >= $projectTasksCount
            && $application->projectSubmissions->every(
                fn ($submission): bool => in_array($submission->status, ['submitted', 'reviewed'], true),
            );
    }

    public static function isFinal(string $status): bool
    {
        return in_array($status, self::FINAL_STATUSES, true);
    }

    public static function isAssessmentVisible(string $status): bool
    {
        return in_array($status, self::ASSESSMENT_VISIBLE_STATUSES, true);
    }
}
