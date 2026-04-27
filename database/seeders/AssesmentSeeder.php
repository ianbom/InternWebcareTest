<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\Position;
use Illuminate\Database\Seeder;

class AssesmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assessmentBlueprints = [
            'Front-End Developer' => [
                ['title' => 'Front-End Developer Assessment', 'duration_minutes' => 60],
            ],
            'Back-End Developer' => [
                ['title' => 'Back-End Developer Assessment', 'duration_minutes' => 60],
            ],
            'Graphic Designer' => [
                ['title' => 'Graphic Designer Assessment', 'duration_minutes' => 45],
            ],
            'Video Editor' => [
                ['title' => 'Video Editor Assessment', 'duration_minutes' => 45],
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
