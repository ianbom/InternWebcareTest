<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Assessment;
use App\Models\Position;
use App\Models\ProjectSubmission;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PositionService
{
    private const ACTIVE_SELECTION_STATUSES = [
        'pending',
        'in_progress',
        'submitted',
        'under_review',
    ];

    public function getCandidatePositionListing(User $candidate): array
    {
        return [
            'positions' => $this->getActivePositions(),
            'hasAppliedPosition' => $this->candidateHasAppliedPosition($candidate),
        ];
    }

    public function getAdminPositionListing(array $filters): array
    {
        $normalizedFilters = [
            'search' => trim((string) ($filters['search'] ?? '')),
            'is_active' => in_array((string) ($filters['is_active'] ?? ''), ['0', '1'], true)
                ? (string) $filters['is_active']
                : '',
            'sort' => in_array((string) ($filters['sort'] ?? ''), $this->adminPositionSorts(), true)
                ? (string) $filters['sort']
                : 'created_at_desc',
        ];

        $query = Position::query()
            ->with('createdBy:id,name')
            ->when($normalizedFilters['search'] !== '', function ($query) use ($normalizedFilters) {
                $search = $normalizedFilters['search'];

                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($normalizedFilters['is_active'] !== '', function ($query) use ($normalizedFilters) {
                $query->where('is_active', $normalizedFilters['is_active'] === '1');
            });

        match ($normalizedFilters['sort']) {
            'created_at_asc' => $query->oldest('created_at')->orderBy('id'),
            'title_asc' => $query->orderBy('title')->orderBy('id'),
            'title_desc' => $query->orderByDesc('title')->orderByDesc('id'),
            default => $query->latest('created_at')->orderByDesc('id'),
        };

        return [
            'positions' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(static fn (Position $position): array => [
                    'id' => $position->id,
                    'title' => $position->title,
                    'description' => $position->description,
                    'is_active' => $position->is_active,
                    'created_at' => $position->created_at?->toIso8601String(),
                    'updated_at' => $position->updated_at?->toIso8601String(),
                    'created_by_name' => $position->createdBy?->name,
                ]),
            'filters' => $normalizedFilters,
            'sortOptions' => [
                ['value' => 'created_at_desc', 'label' => 'Terbaru'],
                ['value' => 'created_at_asc', 'label' => 'Terlama'],
                ['value' => 'title_asc', 'label' => 'Judul A-Z'],
                ['value' => 'title_desc', 'label' => 'Judul Z-A'],
            ],
            'statusOptions' => [
                ['value' => '', 'label' => 'Semua status'],
                ['value' => '1', 'label' => 'Aktif'],
                ['value' => '0', 'label' => 'Nonaktif'],
            ],
        ];
    }

    public function createPosition(array $data, User $admin): Position
    {
        return Position::query()->create([
            'title' => $data['title'],
            'description' => $this->sanitizeDescription($data['description'] ?? null),
            'is_active' => (bool) $data['is_active'],
            'created_by' => $admin->id,
        ]);
    }

    public function updatePosition(Position $position, array $data): Position
    {
        $position->update([
            'title' => $data['title'],
            'description' => $this->sanitizeDescription($data['description'] ?? null),
            'is_active' => (bool) $data['is_active'],
        ]);

        return $position->fresh();
    }

    public function applyPosition(User $candidate, Position $position): array
    {
        return DB::transaction(function () use ($candidate, $position): array {
            User::query()
                ->whereKey($candidate->id)
                ->lockForUpdate()
                ->first();

            if (! $position->is_active) {
                return [
                    'success' => false,
                    'message' => 'Posisi sudah tidak tersedia.',
                ];
            }

            if ($this->candidateHasAppliedPosition($candidate)) {
                return [
                    'success' => false,
                    'message' => 'Anda sedang dalam proses seleksi dan belum bisa mendaftar posisi lain.',
                ];
            }

            if (! $this->hasCompleteCandidateProfile($candidate)) {
                return [
                    'success' => false,
                    'message' => 'Lengkapi profil Anda terlebih dahulu. Nomor telepon, CV, durasi magang, dan tanggal mulai magang wajib diisi sebelum mendaftar.',
                ];
            }

            $assessment = $this->getInitialAssessmentForPosition($position);
            if (! $assessment) {
                return [
                    'success' => false,
                    'message' => 'Posisi ini belum siap menerima pendaftaran.',
                ];
            }

            $projectTasks = $this->getProjectTasks($assessment->id);
            $maxDeadlineHours = $projectTasks->max('deadline_hours');
            $expires_at = $maxDeadlineHours ? now()->addHours($maxDeadlineHours) : null;

            $application = Application::query()->create([
                'candidate_id' => $candidate->id,
                'position_id' => $position->id,
                'assessment_id' => $assessment->id,
                'cv_snapshot' => $candidate->cv_path,
                'status' => 'pending',
                'expires_at' => $expires_at,
            ]);

            $this->createProjectSubmissions($application, $projectTasks);

            return [
                'success' => true,
                'message' => 'Pendaftaran berhasil. Silakan lanjutkan proses seleksi Anda.',
            ];
        });
    }

    private function createProjectSubmissions(Application $application, Collection $projectTasks): void
    {
        if ($projectTasks->isEmpty()) {
            return;
        }

        $now = now();

        ProjectSubmission::query()->insert(
            $projectTasks
                ->map(fn (ProjectTask $task) => [
                    'application_id' => $application->id,
                    'project_task_id' => $task->id,
                    'status' => 'not_submitted',
                    'started_at' => $now,
                    'deadline_at' => $now->copy()->addHours($task->deadline_hours),
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->all(),
        );
    }

    private function getActivePositions(): Collection
    {
        return Position::query()
            ->where('is_active', true)
            ->orderBy('title')
            ->get(['id', 'title', 'description'])
            ->map(fn (Position $position): array => [
                'id' => $position->id,
                'title' => $position->title,
                'description' => $position->description,
                'employment_type' => 'Program Magang Intensif',
                'work_type' => 'Hybrid',
                'work_location' => 'Sidoarjo',
                'work_hours' => 'Senin - Jumat',
                'duration' => '3-6 bulan',
                'quota' => 'Terbatas',
                'requirements' => $this->resolveRequirements($position),
                'benefits' => [
                    'Mentoring langsung bersama tim Webcare',
                    'Pengalaman project nyata dan portfolio-ready',
                    'Sertifikat magang setelah program selesai',
                    'Kesempatan rekomendasi untuk role lanjutan',
                ],
                'selection_flow' => [
                    'Kerjakan quiz seleksi',
                    'Kerjakan project',
                    'Tunggu review dari recruiter',
                    'Terima hasil akhir lamaran',
                ],
            ]);
    }

    /**
     * @return list<string>
     */
    private function resolveRequirements(Position $position): array
    {
        $title = strtolower($position->title);

        if (str_contains($title, 'ui') || str_contains($title, 'design')) {
            return [
                'Memahami dasar UI/UX dan design thinking',
                'Mampu menggunakan Figma atau tool desain sejenis',
                'Memiliki portfolio desain menjadi nilai tambah',
            ];
        }

        if (str_contains($title, 'data')) {
            return [
                'Memahami dasar spreadsheet dan analisis data',
                'Mampu membaca insight dari data sederhana',
                'Familiar dengan SQL atau dashboard analytics menjadi nilai tambah',
            ];
        }

        if (str_contains($title, 'marketing')) {
            return [
                'Memahami dasar digital marketing dan social media',
                'Mampu menulis copy singkat dan jelas',
                'Tertarik dengan campaign, SEO, atau performance marketing',
            ];
        }

        return [
            'Memahami dasar pemrograman web',
            'Familiar dengan HTML, CSS, JavaScript, atau framework terkait',
            'Mampu belajar mandiri dan bekerja dengan feedback',
        ];
    }

    private function getProjectTasks(int $assessmentId): Collection
    {
        return ProjectTask::query()
            ->where('assessment_id', $assessmentId)
            ->get();
    }

    private function candidateHasAppliedPosition(User $candidate): bool
    {
        return $candidate->applications()
            ->whereIn('status', self::ACTIVE_SELECTION_STATUSES)
            ->exists();
    }

    private function hasCompleteCandidateProfile(User $candidate): bool
    {
        return filled($candidate->phone)
            && filled($candidate->cv_path)
            && filled($candidate->duration)
            && filled($candidate->intern_start);
    }

    private function getInitialAssessmentForPosition(Position $position): ?Assessment
    {
        return $position->assessments()
            ->orderBy('id')
            ->first();
    }

    private function sanitizeDescription(?string $description): ?string
    {
        if ($description === null) {
            return null;
        }

        $trimmed = trim($description);
        if ($trimmed === '') {
            return null;
        }

        $allowedTags = '<p><br><strong><em><u><s><code><pre><ul><ol><li><blockquote><h1><h2><h3><hr>';
        $sanitized = strip_tags($trimmed, $allowedTags);

        // Remove inline attributes so only the allowed semantic tags remain.
        $sanitized = preg_replace('/<(\/?)([a-z0-9]+)(?:\s[^>]*)?>/i', '<$1$2>', $sanitized) ?? '';

        return trim($sanitized) !== '' ? $sanitized : null;
    }

    /**
     * @return list<string>
     */
    private function adminPositionSorts(): array
    {
        return [
            'created_at_desc',
            'created_at_asc',
            'title_asc',
            'title_desc',
        ];
    }
}
