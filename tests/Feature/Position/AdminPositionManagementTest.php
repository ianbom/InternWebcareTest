<?php

use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin can browse positions with search filter sorting and query pagination', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    Position::query()->create([
        'title' => 'Backend Developer',
        'description' => 'Build internal APIs.',
        'is_active' => true,
        'created_at' => now()->subDays(3),
    ]);

    Position::query()->create([
        'title' => 'Frontend Developer',
        'description' => 'Build customer-facing React screens.',
        'is_active' => true,
        'created_at' => now()->subDays(2),
    ]);

    Position::query()->create([
        'title' => 'Legacy Support',
        'description' => 'Inactive hiring plan.',
        'is_active' => false,
        'created_at' => now()->subDay(),
    ]);

    $this->actingAs($admin)
        ->get(route('positions.index', [
            'search' => 'developer',
            'is_active' => '1',
            'sort' => 'title_asc',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('position/index')
            ->has('positions.data', 2)
            ->where('positions.data.0.title', 'Backend Developer')
            ->where('positions.data.1.title', 'Frontend Developer')
            ->where('filters.search', 'developer')
            ->where('filters.is_active', '1')
            ->where('filters.sort', 'title_asc')
            ->where('positions.links.0.url', fn (?string $url) => $url === null || str_contains($url, 'search=developer')),
        );
});

test('admin can create and update a position', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('positions.store'), [
            'title' => 'Product Designer',
            'description' => 'Design internship product workflows.',
            'is_active' => true,
        ])
        ->assertRedirect(route('positions.index'));

    $position = Position::query()->where('title', 'Product Designer')->firstOrFail();

    $this->assertDatabaseHas('positions', [
        'id' => $position->id,
        'description' => 'Design internship product workflows.',
        'is_active' => true,
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->put(route('positions.update', $position), [
            'title' => 'Senior Product Designer',
            'description' => 'Lead product design internship projects.',
            'is_active' => false,
        ])
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('positions', [
        'id' => $position->id,
        'title' => 'Senior Product Designer',
        'description' => 'Lead product design internship projects.',
        'is_active' => false,
        'created_by' => $admin->id,
    ]);
});

test('candidate cannot access admin position mutations', function () {
    $candidate = User::factory()->create(['role' => 'candidate']);
    $position = Position::query()->create([
        'title' => 'Backend Developer',
        'description' => 'Build internal APIs.',
        'is_active' => true,
    ]);

    $this->actingAs($candidate)
        ->post(route('positions.store'), [
            'title' => 'Forbidden Position',
            'description' => 'Should not be created.',
            'is_active' => true,
        ])
        ->assertForbidden();

    $this->actingAs($candidate)
        ->put(route('positions.update', $position), [
            'title' => 'Forbidden Update',
            'description' => 'Should not be updated.',
            'is_active' => false,
        ])
        ->assertForbidden();
});
