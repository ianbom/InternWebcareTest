<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\ProjectTask;
use Illuminate\Database\Seeder;

class ProjectTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectTaskBlueprints = [
            'Laravel Fundamentals Test' => [
                [
                    'title' => 'Build Mini Blog API',
                    'description' => 'Buat REST API sederhana untuk modul blog (CRUD post + authentication) menggunakan Laravel. Sertakan dokumentasi endpoint dan struktur database.',
                    'deadline_hours' => 72,
                ],
            ],
            'Frontend Logic & API Integration' => [
                [
                    'title' => 'Dashboard Konsumsi API',
                    'description' => 'Bangun halaman dashboard frontend yang menampilkan data dari API eksternal/internal dengan state loading, error handling, search, dan pagination.',
                    'deadline_hours' => 72,
                ],
            ],
            'Visual Design Principles' => [
                [
                    'title' => 'Campaign Poster Set',
                    'description' => 'Rancang 3 varian poster digital untuk kampanye produk yang sama dengan mempertahankan konsistensi visual, hierarki informasi, dan tipografi.',
                    'deadline_hours' => 48,
                ],
            ],
            'Branding Case Study' => [
                [
                    'title' => 'Brand Identity Revamp',
                    'description' => 'Lakukan studi kasus rebranding untuk UMKM fiktif: logo, warna, tipografi, moodboard, serta contoh penerapan pada media sosial.',
                    'deadline_hours' => 72,
                ],
            ],
            'UX Research & Problem Solving' => [
                [
                    'title' => 'UX Audit & Improvement Plan',
                    'description' => 'Lakukan audit UX pada aplikasi publik pilihan Anda, identifikasi minimal 5 masalah utama, lalu susun prioritas perbaikan berbasis dampak.',
                    'deadline_hours' => 60,
                ],
            ],
            'Wireframing and Prototyping' => [
                [
                    'title' => 'End-to-End Feature Prototype',
                    'description' => 'Buat wireframe dan prototype interaktif untuk alur utama sebuah fitur (minimal 5 layar) lengkap dengan flow dan alasan keputusan desain.',
                    'deadline_hours' => 60,
                ],
            ],
        ];

        foreach ($projectTaskBlueprints as $assessmentTitle => $projectTasks) {
            $assessment = Assessment::where('title', $assessmentTitle)->first();

            if (! $assessment) {
                continue;
            }

            foreach ($projectTasks as $projectTask) {
                ProjectTask::updateOrCreate(
                    [
                        'assessment_id' => $assessment->id,
                        'title' => $projectTask['title'],
                    ],
                    [
                        ...$projectTask,
                        'assessment_id' => $assessment->id,
                    ],
                );
            }
        }
    }
}
