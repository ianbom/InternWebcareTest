<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\User;
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
                'title' => 'Web Developer',
                'description' => 'Membangun dan memelihara aplikasi web internal maupun eksternal.',
                'is_active' => true,
            ],
            [
                'title' => 'Graphic Designer',
                'description' => 'Mendesain materi visual untuk kebutuhan branding dan promosi digital.',
                'is_active' => true,
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'Merancang pengalaman pengguna dan antarmuka produk digital.',
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
