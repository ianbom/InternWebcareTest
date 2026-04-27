<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            [
                'title' => 'Front-End Developer',
                'description' => 'Membangun tampilan website yang responsif menggunakan HTML, CSS, dan JavaScript. Bertugas membuat landing page, mengintegrasikan API, dan memastikan pengalaman pengguna yang baik.',
                'is_active' => true,
            ],
            [
                'title' => 'Back-End Developer',
                'description' => 'Membangun sistem di sisi server, membuat REST API, mengelola database, dan menyusun dokumentasi teknis untuk mendukung kebutuhan sistem e-commerce maupun aplikasi internal.',
                'is_active' => true,
            ],
            [
                'title' => 'Graphic Designer',
                'description' => 'Membuat desain visual untuk kebutuhan media sosial dan branding digital. Bertanggung jawab menghasilkan konten visual yang konsisten, menarik, dan sesuai identitas perusahaan.',
                'is_active' => true,
            ],
            [
                'title' => 'Video Editor',
                'description' => 'Mengedit video promosi dan konten digital dengan menambahkan musik, transisi, dan subtitle. Menghasilkan video yang menarik dan profesional sesuai kebutuhan perusahaan.',
                'is_active' => true,
            ],
        ];

        foreach ($positions as $position) {
            Position::updateOrCreate(
                ['title' => $position['title']],
                [...$position, 'created_by' => 1],
            );
        }
    }
}
