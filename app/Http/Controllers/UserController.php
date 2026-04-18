<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserPasswordRequest;
use App\Http\Requests\User\UserIndexRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    public function index(UserIndexRequest $request): Response
    {
        $filters = $this->userService->normalizeFilters($request->validated());

        return Inertia::render('users/index', [
            'users' => $this->userService->paginateUsers($filters),
            'filters' => $filters,
            'options' => $this->userService->getFilterOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'User berhasil dibuat.',
        ]);

        return to_route('users.index');
    }

    public function update(UpdateUserPasswordRequest $request, User $user): RedirectResponse
    {
        $this->userService->updatePassword($user, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Password user berhasil diperbarui.',
        ]);

        return to_route('users.index', $request->query());
    }
}
