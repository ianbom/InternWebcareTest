<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssesmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assessmentBlueprints = [
            'Web Developer' => [
                ['title' => 'Laravel Fundamentals Test', 'duration_minutes' => 90],
                ['title' => 'Frontend Logic & API Integration', 'duration_minutes' => 75],
            ],
            'Graphic Designer' => [
                ['title' => 'Visual Design Principles', 'duration_minutes' => 60],
                ['title' => 'Branding Case Study', 'duration_minutes' => 80],
            ],
            'UI/UX Designer' => [
                ['title' => 'UX Research & Problem Solving', 'duration_minutes' => 70],
                ['title' => 'Wireframing and Prototyping', 'duration_minutes' => 75],
            ],
        ];

        foreach ($assessmentBlueprints as $positionTitle => $assessments) {
            $position = Position::where('title', $positionTitle)->first();

            if (! $position) {
                continue;
            }

            foreach ($assessments as $assessment) {
                Assessment::updateOrCreate(
                    [
                        'position_id' => $position->id,
                        'title' => $assessment['title'],
                    ],
                    [
                        'duration_minutes' => $assessment['duration_minutes'],
                        'created_by' => 1,
                    ],
                );
            }
        }
    }
}
