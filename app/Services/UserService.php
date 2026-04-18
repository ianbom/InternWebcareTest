<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public const ROLES = ['admin', 'candidate'];

    public const SORTS = [
        'created_at_desc',
        'created_at_asc',
        'name_asc',
        'name_desc',
        'email_asc',
        'email_desc',
        'role_asc',
    ];

    /**
     * @param  array<string, mixed>  $filters
     * @return array{search: string, role: string, has_cv: string, sort: string}
     */
    public function normalizeFilters(array $filters): array
    {
        $role = (string) ($filters['role'] ?? '');
        $hasCv = (string) ($filters['has_cv'] ?? '');
        $sort = (string) ($filters['sort'] ?? '');

        return [
            'search' => trim((string) ($filters['search'] ?? '')),
            'role' => in_array($role, self::ROLES, true) ? $role : '',
            'has_cv' => in_array($hasCv, ['0', '1'], true) ? $hasCv : '',
            'sort' => in_array($sort, self::SORTS, true) ? $sort : 'created_at_desc',
        ];
    }

    /**
     * @param  array{search: string, role: string, has_cv: string, sort: string}  $filters
     */
    public function paginateUsers(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->select(['id', 'name', 'email', 'phone', 'cv_path', 'role', 'created_at', 'updated_at'])
            ->when($filters['search'] !== '', function ($query) use ($filters) {
                $search = $filters['search'];

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('cv_path', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] !== '', fn ($query) => $query->where('role', $filters['role']))
            ->when($filters['has_cv'] === '1', fn ($query) => $query->whereNotNull('cv_path'))
            ->when($filters['has_cv'] === '0', fn ($query) => $query->whereNull('cv_path'));

        match ($filters['sort']) {
            'created_at_asc' => $query->oldest('created_at')->orderBy('id'),
            'name_asc' => $query->orderBy('name')->orderBy('id'),
            'name_desc' => $query->orderByDesc('name')->orderByDesc('id'),
            'email_asc' => $query->orderBy('email')->orderBy('id'),
            'email_desc' => $query->orderByDesc('email')->orderByDesc('id'),
            'role_asc' => $query->orderBy('role')->orderBy('id'),
            default => $query->latest('created_at')->orderByDesc('id'),
        };

        return $query
            ->paginate(12)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'cv_path' => $user->cv_path,
                'cv_url' => $this->cvUrl($user->cv_path),
                'created_at' => $user->created_at?->toIso8601String(),
                'updated_at' => $user->updated_at?->toIso8601String(),
            ]);
    }

    /**
     * @return array{roles: list<array{value: string, label: string}>, cvOptions: list<array{value: string, label: string}>, sorts: list<array{value: string, label: string}>}
     */
    public function getFilterOptions(): array
    {
        return [
            'roles' => [
                ['value' => '', 'label' => 'Semua role'],
                ['value' => 'admin', 'label' => 'Admin'],
                ['value' => 'candidate', 'label' => 'Candidate'],
            ],
            'cvOptions' => [
                ['value' => '', 'label' => 'Semua CV'],
                ['value' => '1', 'label' => 'Ada CV'],
                ['value' => '0', 'label' => 'Belum ada CV'],
            ],
            'sorts' => [
                ['value' => 'created_at_desc', 'label' => 'Terbaru'],
                ['value' => 'created_at_asc', 'label' => 'Terlama'],
                ['value' => 'name_asc', 'label' => 'Nama A-Z'],
                ['value' => 'name_desc', 'label' => 'Nama Z-A'],
                ['value' => 'email_asc', 'label' => 'Email A-Z'],
                ['value' => 'email_desc', 'label' => 'Email Z-A'],
                ['value' => 'role_asc', 'label' => 'Role A-Z'],
            ],
        ];
    }

    /**
     * @param  array{name: string, email: string, phone?: string|null, role: string, password: string}  $data
     */
    public function createUser(array $data): User
    {
        return User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'password' => $data['password'],
        ]);
    }

    /**
     * @param  array{password: string}  $data
     */
    public function updatePassword(User $user, array $data): User
    {
        $user->update([
            'password' => $data['password'],
        ]);

        return $user->fresh();
    }

    private function cvUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return '/storage/'.collect(explode('/', $path))
            ->map(fn (string $segment) => rawurlencode($segment))
            ->implode('/');
    }
}
