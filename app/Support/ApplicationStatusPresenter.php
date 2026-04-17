<?php

namespace App\Support;

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
            'pending' => 'Menunggu Assessment',
            'in_progress' => 'Assessment Berjalan',
            'submitted' => 'Assessment Terkirim',
            'under_review' => 'Sedang Direview',
            'approved' => 'Diterima',
            'rejected' => 'Ditolak',
            default => 'Status Tidak Diketahui',
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
            'pending' => 'Assessment siap dimulai.',
            'in_progress' => 'Assessment sedang berjalan.',
            'submitted' => 'Assessment berhasil dikirim.',
            'under_review' => 'Lamaran sedang direview.',
            'approved' => 'Selamat, lamaran Anda diterima.',
            'rejected' => 'Lamaran Anda belum diterima.',
            default => 'Pantau status lamaran Anda.',
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

    public static function activeStep(string $status): string
    {
        return match ($status) {
            'submitted', 'under_review' => 'review',
            'approved', 'rejected' => 'result',
            default => 'assessment',
        };
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
