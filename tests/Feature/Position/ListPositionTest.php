<?php

use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to login page on positions list', function () {
    $response = $this->get(route('positions.index'));

    $response->assertRedirect(route('login'));
});

test('candidate can view active positions in card listing page', function () {
    Position::query()->create([
        'title' => 'Backend Developer',
        'description' => 'Membangun API untuk kebutuhan internal.',
        'is_active' => true,
    ]);
    Position::query()->create([
        'title' => 'Data Analyst',
        'description' => 'Melakukan analisis data kandidat dan performa seleksi.',
        'is_active' => true,
    ]);
    Position::query()->create([
        'title' => 'Inactive Position',
        'description' => 'Posisi ini tidak boleh tampil.',
        'is_active' => false,
    ]);

    $candidate = User::factory()->create([
        'role' => 'candidate',
    ]);

    $this->actingAs($candidate)
        ->get(route('positions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('position/list-position')
            ->where('hasAppliedPosition', false)
            ->has('positions', 2)
            ->where('positions.0.title', 'Backend Developer')
            ->where('positions.1.title', 'Data Analyst'),
        );
});

test('admin can access role aware positions management page', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($admin)
        ->get(route('positions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('position/index'),
        );
});
