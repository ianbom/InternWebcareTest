<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin can browse users with search filter sorting and query pagination', function () {
    $admin = User::factory()->create([
        'name' => 'Root Admin',
        'email' => 'root@example.test',
        'role' => 'admin',
        'created_at' => now()->subDays(5),
    ]);

    User::factory()->create([
        'name' => 'Alice Candidate',
        'email' => 'alice@example.test',
        'phone' => '0811111111',
        'role' => 'candidate',
        'cv_path' => 'cv/alice.pdf',
        'created_at' => now()->subDays(3),
    ]);

    User::factory()->create([
        'name' => 'Bob Candidate',
        'email' => 'bob@example.test',
        'phone' => '0822222222',
        'role' => 'candidate',
        'cv_path' => null,
        'created_at' => now()->subDays(2),
    ]);

    $this->actingAs($admin)
        ->get(route('users.index', [
            'search' => 'candidate',
            'role' => 'candidate',
            'has_cv' => '1',
            'sort' => 'name_asc',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Alice Candidate')
            ->where('users.data.0.email', 'alice@example.test')
            ->where('users.data.0.phone', '0811111111')
            ->where('users.data.0.role', 'candidate')
            ->where('users.data.0.cv_url', '/storage/cv/alice.pdf')
            ->where('filters.search', 'candidate')
            ->where('filters.role', 'candidate')
            ->where('filters.has_cv', '1')
            ->where('filters.sort', 'name_asc')
            ->where('users.links.0.url', fn (?string $url) => $url === null || str_contains($url, 'search=candidate')),
        );
});

test('admin can create user and update only password', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Created Candidate',
            'email' => 'created@example.test',
            'phone' => '0833333333',
            'role' => 'candidate',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])
        ->assertRedirect(route('users.index'));

    $user = User::query()->where('email', 'created@example.test')->firstOrFail();

    expect($user->name)->toBe('Created Candidate')
        ->and($user->phone)->toBe('0833333333')
        ->and($user->role)->toBe('candidate')
        ->and(Hash::check('Password123', $user->password))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('users.update', $user), [
            'name' => 'Should Not Change',
            'email' => 'changed@example.test',
            'phone' => '0899999999',
            'role' => 'admin',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])
        ->assertRedirect(route('users.index'));

    $user->refresh();

    expect($user->name)->toBe('Created Candidate')
        ->and($user->email)->toBe('created@example.test')
        ->and($user->phone)->toBe('0833333333')
        ->and($user->role)->toBe('candidate')
        ->and(Hash::check('NewPassword123', $user->password))->toBeTrue();
});

test('candidate cannot access admin user management', function () {
    $candidate = User::factory()->create(['role' => 'candidate']);
    $target = User::factory()->create(['role' => 'candidate']);

    $this->actingAs($candidate)
        ->get(route('users.index'))
        ->assertForbidden();

    $this->actingAs($candidate)
        ->post(route('users.store'), [
            'name' => 'Forbidden',
            'email' => 'forbidden@example.test',
            'role' => 'candidate',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])
        ->assertForbidden();

    $this->actingAs($candidate)
        ->put(route('users.update', $target), [
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])
        ->assertForbidden();
});

test('admin user validation rejects duplicate email and password mismatch', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $existing = User::factory()->create(['email' => 'exists@example.test']);

    $this->actingAs($admin)
        ->from(route('users.index'))
        ->post(route('users.store'), [
            'name' => 'Duplicate Email',
            'email' => $existing->email,
            'role' => 'candidate',
            'password' => 'Password123',
            'password_confirmation' => 'Different123',
        ])
        ->assertRedirect(route('users.index'))
        ->assertSessionHasErrors(['email', 'password']);
});
