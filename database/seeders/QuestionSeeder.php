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
            'Laravel Fundamentals Test' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Apa fungsi utama migration di Laravel?',
                    'options' => [
                        'A' => 'Mengelola skema database secara versioned',
                        'B' => 'Membuat tampilan Blade',
                        'C' => 'Menjalankan queue worker',
                        'D' => 'Membuat route API otomatis',
                    ],
                    'correct_answer' => 'A',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Method manakah yang tepat untuk relasi satu ke banyak pada model User terhadap Post?',
                    'options' => [
                        'A' => 'belongsTo',
                        'B' => 'hasMany',
                        'C' => 'hasOneThrough',
                        'D' => 'belongsToMany',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Perintah Artisan untuk membuat migration baru adalah...',
                    'options' => [
                        'A' => 'php artisan make:seed',
                        'B' => 'php artisan migrate:refresh',
                        'C' => 'php artisan make:migration',
                        'D' => 'php artisan db:seed',
                    ],
                    'correct_answer' => 'C',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Jelaskan strategi Anda untuk mencegah N+1 query pada modul listing data di Laravel.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Bagaimana Anda menyusun struktur validasi request agar mudah dirawat pada aplikasi Laravel skala menengah?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],
            'Frontend Logic & API Integration' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Status code HTTP yang tepat untuk response berhasil membuat resource baru adalah...',
                    'options' => [
                        'A' => '200',
                        'B' => '201',
                        'C' => '204',
                        'D' => '302',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Teknik terbaik untuk menghindari race condition saat multiple request async di frontend adalah...',
                    'options' => [
                        'A' => 'Menaikkan timeout request',
                        'B' => 'Menggunakan request cancellation / abort controller',
                        'C' => 'Menyimpan data di localStorage',
                        'D' => 'Menyembunyikan tombol submit',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Metode HTTP yang umum dipakai untuk partial update data adalah...',
                    'options' => [
                        'A' => 'POST',
                        'B' => 'PUT',
                        'C' => 'PATCH',
                        'D' => 'GET',
                    ],
                    'correct_answer' => 'C',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Jelaskan pendekatan Anda untuk menangani state loading, error, dan success pada form yang terhubung ke API.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Bagaimana Anda memastikan integrasi frontend-backend tetap konsisten saat API berkembang?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],
            'Visual Design Principles' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Prinsip desain yang menekankan perbedaan elemen agar informasi mudah dipindai adalah...',
                    'options' => [
                        'A' => 'Repetition',
                        'B' => 'Contrast',
                        'C' => 'Alignment',
                        'D' => 'Proximity',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Format file yang paling tepat untuk logo berbasis vektor adalah...',
                    'options' => [
                        'A' => 'SVG',
                        'B' => 'JPG',
                        'C' => 'PNG 8-bit',
                        'D' => 'GIF',
                    ],
                    'correct_answer' => 'A',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Dalam teori warna, kombinasi warna yang berseberangan pada color wheel disebut...',
                    'options' => [
                        'A' => 'Analogous',
                        'B' => 'Monochromatic',
                        'C' => 'Complementary',
                        'D' => 'Triadic',
                    ],
                    'correct_answer' => 'C',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Bagaimana Anda menentukan hierarki visual pada poster promosi agar pesan utama langsung terlihat?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Jelaskan proses Anda dalam memilih tipografi untuk brand yang menargetkan Gen Z.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],
            'Branding Case Study' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Elemen berikut yang termasuk brand identity adalah...',
                    'options' => [
                        'A' => 'Logo, palet warna, dan tipografi',
                        'B' => 'Server response time',
                        'C' => 'Struktur database',
                        'D' => 'Algoritma sorting',
                    ],
                    'correct_answer' => 'A',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Tujuan utama brand guideline adalah...',
                    'options' => [
                        'A' => 'Mempercepat proses coding',
                        'B' => 'Menjaga konsistensi komunikasi visual',
                        'C' => 'Mengurangi ukuran file desain',
                        'D' => 'Meningkatkan jumlah halaman website',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Materi yang paling tepat untuk mengukur awareness kampanye visual adalah...',
                    'options' => [
                        'A' => 'Laporan bug',
                        'B' => 'A/B testing click-through visual',
                        'C' => 'Daftar commit git',
                        'D' => 'Skema tabel relasi',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Uraikan langkah Anda saat melakukan redesign identitas visual brand yang dianggap sudah outdated.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Bagaimana Anda menyelaraskan konsep kreatif dengan objective bisnis pada sebuah campaign?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],
            'UX Research & Problem Solving' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Metode yang paling tepat untuk menggali pain point pengguna awal adalah...',
                    'options' => [
                        'A' => 'Usability testing',
                        'B' => 'User interview',
                        'C' => 'A/B testing',
                        'D' => 'Heuristic evaluation',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Dokumen yang memetakan tujuan pengguna, langkah, dan hambatan disebut...',
                    'options' => [
                        'A' => 'Component library',
                        'B' => 'User journey map',
                        'C' => 'ERD',
                        'D' => 'Product backlog',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Pendekatan prioritisasi masalah UX yang umum dipakai adalah...',
                    'options' => [
                        'A' => 'Severity × Frequency',
                        'B' => 'FIFO Queue',
                        'C' => 'Bubble Sort',
                        'D' => 'Round Robin',
                    ],
                    'correct_answer' => 'A',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Jelaskan bagaimana Anda memvalidasi hipotesis masalah sebelum masuk tahap desain solusi.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Berikan contoh cara Anda menerjemahkan insight riset menjadi rekomendasi fitur yang terukur.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
                ],
            ],
            'Wireframing and Prototyping' => [
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Tujuan utama low-fidelity wireframe adalah...',
                    'options' => [
                        'A' => 'Final visual untuk tim marketing',
                        'B' => 'Menguji struktur dan alur dengan cepat',
                        'C' => 'Menghasilkan animasi final',
                        'D' => 'Menggantikan user testing',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 1,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Interactive prototype paling berguna untuk...',
                    'options' => [
                        'A' => 'Mengukur performa server',
                        'B' => 'Menguji alur interaksi pengguna',
                        'C' => 'Migrasi database',
                        'D' => 'Menulis unit test backend',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 2,
                ],
                [
                    'type' => 'multiple_choice',
                    'question_text' => 'Komponen desain yang dapat digunakan ulang untuk menjaga konsistensi UI disebut...',
                    'options' => [
                        'A' => 'User persona',
                        'B' => 'Design system component',
                        'C' => 'Journey map',
                        'D' => 'Heatmap',
                    ],
                    'correct_answer' => 'B',
                    'point_value' => 10,
                    'order_index' => 3,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Bagaimana Anda menyeimbangkan kebutuhan bisnis dengan kenyamanan pengguna saat menyusun alur onboarding?',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 4,
                ],
                [
                    'type' => 'essay',
                    'question_text' => 'Jelaskan kriteria Anda dalam menentukan kapan desain sudah siap dipindahkan ke high-fidelity prototype.',
                    'options' => null,
                    'correct_answer' => null,
                    'point_value' => 20,
                    'order_index' => 5,
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
