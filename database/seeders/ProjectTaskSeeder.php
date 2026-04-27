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

            // ── Front-End Developer ──────────────────────────────────────
            'Front-End Developer Assessment' => [
                [
                    'title' => 'Landing Page Responsif',
                    'description' => "Buat 1 landing page responsif dengan minimal 3 section: Hero, About/Services, dan Contact/CTA.\n\nKetentuan:\n- Gunakan HTML, CSS, dan JavaScript murni atau framework frontend pilihan Anda.\n- Halaman harus tampil baik di mobile maupun desktop.\n- Deploy project ke platform pilihan Anda (Netlify, Vercel, dll.).\n\nHasil yang dikumpulkan:\n- Link repository GitHub\n- Link website yang sudah di-deploy",
                    'deadline_hours' => 72,
                ],
            ],

            // ── Back-End Developer ───────────────────────────────────────
            'Back-End Developer Assessment' => [
                [
                    'title' => 'REST API Sederhana E-Commerce',
                    'description' => "Buat API sederhana untuk sistem e-commerce menggunakan framework backend pilihan Anda (Node.js/Express, Laravel, dll.).\n\nFitur minimal yang harus ada:\n- CRUD produk (create, read, update, delete)\n- Autentikasi (register & login)\n- Minimal 1 relasi antar tabel (misal: produk & kategori)\n\nDokumentasi wajib disertakan:\n- Arsitektur sistem\n- Teknologi yang digunakan\n- ERD (Entity Relationship Diagram)\n\nHasil yang dikumpulkan:\n- Link repository GitHub\n- File dokumentasi (PDF/DOC) atau README yang lengkap",
                    'deadline_hours' => 72,
                ],
            ],

            // ── Graphic Designer ─────────────────────────────────────────
            'Graphic Designer Assessment' => [
                [
                    'title' => '3 Desain Feed Instagram – Digital Agency',
                    'description' => "Buat 3 desain feed Instagram bertema Digital Agency.\n\nKetentuan:\n- Ukuran: 1080×1080 px\n- Tema: Digital Agency (modern, profesional)\n- Konsisten dalam palet warna, tipografi, dan gaya visual\n- Setiap desain harus menarik dan siap posting\n\nHasil yang dikumpulkan:\n- File desain (format PNG/JPG resolusi tinggi)\n- Link Google Drive atau Behance/Dribbble",
                    'deadline_hours' => 72,
                ],
            ],

            // ── Video Editor ─────────────────────────────────────────────
            'Video Editor Assessment' => [
                [
                    'title' => 'Edit Video Promosi 30–60 Detik',
                    'description' => "Edit 1 video promosi berdurasi 30–60 detik menggunakan software video editor pilihan Anda.\n\nKetentuan:\n- Tambahkan musik latar yang sesuai\n- Tambahkan transisi antar klip\n- Tambahkan subtitle/teks keterangan\n- Video harus terasa profesional dan menarik\n\nHasil yang dikumpulkan:\n- Link video hasil edit (YouTube unlisted, Google Drive, atau Vimeo)\n- Sertakan file mentah jika memungkinkan",
                    'deadline_hours' => 72,
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
