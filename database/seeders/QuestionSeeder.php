<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questionBlueprints = [

            // ── Front-End Developer ──────────────────────────────────────
            'Front-End Developer Assessment' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa fungsi utama HTML?',
                    'options' => [
                        'A' => 'Mengatur logika program',
                        'B' => 'Membuat struktur halaman web',
                        'C' => 'Mengatur database',
                        'D' => 'Mengelola server',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'CSS digunakan untuk?',
                    'options' => [
                        'A' => 'Struktur website',
                        'B' => 'Styling tampilan website',
                        'C' => 'Backend logic',
                        'D' => 'Database',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Mana yang termasuk CSS Flexbox property?',
                    'options' => [
                        'A' => 'display: grid',
                        'B' => 'justify-content',
                        'C' => 'position: absolute',
                        'D' => 'float: left',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Fungsi JavaScript dalam website adalah?',
                    'options' => [
                        'A' => 'Styling',
                        'B' => 'Struktur',
                        'C' => 'Interaksi dan logika',
                        'D' => 'Hosting',
                    ],
                    'correct_answer' => 'C',
                    'point_value' => 10,
                    'order_index' => 4,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa itu DOM?',
                    'options' => [
                        'A' => 'Database Object Model',
                        'B' => 'Document Object Model',
                        'C' => 'Data Object Method',
                        'D' => 'Design Object Mode',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 5,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Cara mengambil data dari API di JavaScript?',
                    'options' => [
                        'A' => 'querySelector',
                        'B' => 'fetch()',
                        'C' => 'console.log',
                        'D' => 'alert',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 6,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Mana contoh event di JavaScript?',
                    'options' => [
                        'A' => 'loop',
                        'B' => 'click',
                        'C' => 'variable',
                        'D' => 'function',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 7,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa fungsi media query?',
                    'options' => [
                        'A' => 'Mengatur database',
                        'B' => 'Membuat responsive design',
                        'C' => 'Mengatur server',
                        'D' => 'Debugging',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 8,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Tag HTML untuk input user adalah?',
                    'options' => [
                        'A' => '<div>',
                        'B' => '<input>',
                        'C' => '<span>',
                        'D' => '<form>',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 9,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Platform deploy frontend yang umum digunakan adalah?',
                    'options' => [
                        'A' => 'MySQL',
                        'B' => 'Netlify',
                        'C' => 'MongoDB',
                        'D' => 'PHP',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 10,
                ],
            ],

            // ── Back-End Developer ───────────────────────────────────────
            'Back-End Developer Assessment' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa itu backend?',
                    'options' => [
                        'A' => 'Tampilan website',
                        'B' => 'Sistem di sisi server',
                        'C' => 'Design UI',
                        'D' => 'CSS styling',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'HTTP method untuk mengambil data adalah?',
                    'options' => [
                        'A' => 'POST',
                        'B' => 'PUT',
                        'C' => 'GET',
                        'D' => 'DELETE',
                    ],
                    'correct_answer' => 'C',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa fungsi database?',
                    'options' => [
                        'A' => 'Styling',
                        'B' => 'Menyimpan data',
                        'C' => 'Membuat UI',
                        'D' => 'Animasi',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa itu REST API?',
                    'options' => [
                        'A' => 'Sistem design',
                        'B' => 'Arsitektur komunikasi data berbasis HTTP',
                        'C' => 'Bahasa pemrograman',
                        'D' => 'Database',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 4,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Mana contoh database relational?',
                    'options' => [
                        'A' => 'MongoDB',
                        'B' => 'MySQL',
                        'C' => 'Redis',
                        'D' => 'Firebase',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 5,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Fungsi hashing password adalah?',
                    'options' => [
                        'A' => 'Mempercepat login',
                        'B' => 'Mengamankan data password',
                        'C' => 'Menghapus password',
                        'D' => 'Menyimpan password plain text',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 6,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa itu middleware?',
                    'options' => [
                        'A' => 'UI design',
                        'B' => 'Perantara request & response',
                        'C' => 'Database',
                        'D' => 'Hosting',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 7,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'JSON digunakan untuk?',
                    'options' => [
                        'A' => 'Styling',
                        'B' => 'Format pertukaran data',
                        'C' => 'Database',
                        'D' => 'Server',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 8,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Endpoint API biasanya berbentuk?',
                    'options' => [
                        'A' => 'File CSS',
                        'B' => 'URL',
                        'C' => 'Image',
                        'D' => 'Script HTML',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 9,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Framework backend populer adalah?',
                    'options' => [
                        'A' => 'Bootstrap',
                        'B' => 'Express.js',
                        'C' => 'Tailwind',
                        'D' => 'Figma',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 10,
                ],
            ],

            // ── Graphic Designer ─────────────────────────────────────────
            'Graphic Designer Assessment' => [
                [
                    'type' => 'essay',
                    'question_text' => 'Software apa yang Anda gunakan untuk mendesain? Sebutkan dan jelaskan alasannya.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 1,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Skill desain lain apa yang Anda miliki selain software desain grafis utama Anda?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 2,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Cantumkan link portofolio desain Anda (Behance, Dribbble, Google Drive, dll.).',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Berapa lama waktu yang Anda butuhkan untuk menyelesaikan 3 desain feed Instagram bertema Digital Agency (ukuran 1080×1080)?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Ceritakan pengalaman Anda bekerja untuk klien atau project desain sebelumnya.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],

            // ── Video Editor ─────────────────────────────────────────────
            'Video Editor Assessment' => [
                [
                    'type' => 'essay',
                    'question_text' => 'Sebutkan software video editor yang Anda gunakan dan jelaskan kenapa memilih itu.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 25,
                    'order_index' => 1,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Cantumkan link portofolio video editing Anda (YouTube, Google Drive, Vimeo, dll.).',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 25,
                    'order_index' => 2,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Berapa lama waktu yang Anda butuhkan untuk mengedit 1 video berdurasi 30–60 detik dengan musik, transisi, dan subtitle?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 25,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Ceritakan pengalaman Anda mengerjakan project video untuk klien sebelumnya.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 25,
                    'order_index' => 4,
                ],
            ],
        ];

        foreach ($questionBlueprints as $assessmentTitle => $questions) {
            $assessment = Assessment::where('title', $assessmentTitle)->first();

            if (! $assessment) {
                continue;
            }

            foreach ($questions as $question) {
                Question::updateOrCreate(
                    [
                        'assessment_id' => $assessment->id,
                        'question_text' => $question['question_text'],
                    ],
                    [
                        ...$question,
                        'assessment_id' => $assessment->id,
                    ],
                );
            }
        }
    }
}
