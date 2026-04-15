
PRODUCT REQUIREMENTS DOCUMENT

InternHub

Sistem Seleksi Kandidat Magang Berbasis Web

Versi	1.0.0
Status	Draft
Tanggal	April 2026
Penulis	Tim Product
Audience	Engineering, Design, QA, Stakeholder
Warna Primary : #0b20e9

1. Ringkasan Eksekutif
InternHub adalah platform web untuk mengelola proses seleksi kandidat magang secara end-to-end. Platform ini dirancang untuk menggantikan proses manual berbasis email dan spreadsheet dengan sistem terpusat yang mencakup pendaftaran kandidat, distribusi assessment, penilaian, dan keputusan akhir oleh admin.

Masalah utama yang diselesaikan:
•	Proses seleksi magang yang tidak terstruktur dan memakan waktu admin.
•	Tidak ada standarisasi soal assessment antar posisi.
•	Kesulitan memantau status ratusan kandidat secara bersamaan.
•	Risiko kebocoran soal akibat distribusi manual via email.

Solusi yang ditawarkan:
•	Portal terpusat untuk kandidat mendaftar, mengerjakan assessment, dan mengumpulkan project.
•	Sistem randomisasi assessment per posisi untuk keamanan soal.
•	Dashboard admin real-time untuk memantau dan mengevaluasi kandidat.
•	Mekanisme timer otomatis untuk batas waktu pengerjaan assessment.

2. Tujuan dan Sasaran
2.1 Tujuan Bisnis
•	Mempercepat proses seleksi magang dari rata-rata 2 minggu menjadi kurang dari 5 hari kerja.
•	Meningkatkan objektivitas penilaian melalui scoring otomatis untuk soal pilihan ganda.
•	Mengurangi beban administratif tim HR minimal 60% dibandingkan proses manual.
•	Memastikan kerahasiaan soal assessment dengan sistem distribusi acak.

2.2 Tujuan Produk
•	Membangun platform web yang dapat diakses dari browser modern tanpa instalasi tambahan.
•	Mendukung 2 role pengguna: kandidat dan admin, dengan hak akses yang berbeda.
•	Menyediakan mekanisme timer assessment yang akurat di sisi server.
•	Menghasilkan laporan penilaian yang dapat digunakan sebagai dasar keputusan.

2.3 Metrik Keberhasilan
Metrik	Target	Periode
Waktu seleksi end-to-end	< 5 hari kerja	Per batch rekrutmen
Tingkat penyelesaian assessment	> 85%	Per bulan
Kepuasan admin (survey)	> 4.0 / 5.0	Kuartal pertama
Akurasi auto-scoring MC	100%	Continuous
Uptime sistem	> 99.5%	Per bulan

3. Pengguna dan Persona
3.1 Kandidat Magang
Profil: Mahasiswa atau fresh graduate yang sedang mencari pengalaman magang di perusahaan.
•	Usia: 19–25 tahun, terbiasa menggunakan perangkat digital.
•	Motivasi: Ingin mendapatkan pengalaman kerja di bidang yang diminati.
•	Pain point: Proses pendaftaran yang berbelit, tidak tahu status lamaran, ketidakpastian jadwal.
•	Ekspektasi: Proses yang transparan, interface yang mudah digunakan, feedback yang jelas.

3.2 Admin HR
Profil: Staf HR atau tim rekrutmen yang bertanggung jawab atas proses seleksi magang.
•	Usia: 25–40 tahun, pengguna komputer sehari-hari.
•	Motivasi: Menemukan kandidat terbaik dengan efisiensi waktu dan sumber daya.
•	Pain point: Volume pelamar tinggi, penilaian essay yang menyita waktu, komunikasi status yang manual.
•	Ekspektasi: Dashboard yang informatif, proses scoring yang mudah, filter dan pencarian yang andal.

4. Alur Pengguna (User Flow)
4.1 Alur Kandidat
1.	Kandidat membuka website dan melakukan registrasi (nama, email, password, nomor telepon, upload CV).
2.	Kandidat login dan melihat daftar posisi magang yang tersedia (hanya posisi aktif).
3.	Kandidat memilih satu posisi dan mengkonfirmasi pendaftaran. Sistem secara acak menentukan satu assessment dari pool assessment posisi tersebut.
4.	Kandidat dapat melihat detail posisi dan assessment yang akan dikerjakan (judul, durasi). Soal belum ditampilkan.
5.	Kandidat memulai assessment. Timer mulai berjalan. Sistem mencatat started_at dan menghitung expires_at.
6.	Kandidat mengerjakan soal pilihan ganda dan essay dalam satu sesi berwaktu.
7.	Kandidat submit assessment sebelum timer habis. Jawaban MC langsung dinilai otomatis. Jawaban essay menunggu review admin.
8.	Kandidat mendapatkan akses ke halaman project task. Sistem mencatat waktu mulai project dan menghitung deadline (deadline_hours dari waktu assign).
9.	Kandidat mengupload file hasil project beserta catatan/link repository sebelum deadline.
10.	Kandidat dapat memantau status aplikasi (pending, in_progress, submitted, under_review, approved, rejected) di dashboard.

4.2 Alur Admin
11.	Admin login dengan akun yang telah dikonfigurasi (role: admin).
12.	Admin melihat dashboard utama berisi ringkasan statistik: total aplikasi per status, posisi terpopuler, aplikasi baru hari ini.
13.	Admin dapat mengelola posisi: tambah, edit, aktifkan/nonaktifkan posisi.
14.	Admin dapat mengelola assessment per posisi: tambah assessment, atur durasi, tambah soal (MC/essay), tambah project task.
15.	Admin membuka daftar aplikasi masuk dengan filter berdasarkan posisi, status, dan tanggal.
16.	Admin membuka detail aplikasi kandidat: melihat CV snapshot, jawaban assessment, dan hasil project.
17.	Admin menilai jawaban essay secara manual (mengisi score per soal essay).
18.	Admin menilai project submission (mengisi score dan score_notes).
19.	Setelah semua penilaian selesai, admin mengubah status aplikasi menjadi approved atau rejected disertai admin_notes.

5. Fitur dan Requirements
5.1 Modul Autentikasi
FR-AUTH-01: Registrasi Kandidat
•	Kandidat dapat mendaftar dengan mengisi nama lengkap, email, password, nomor telepon, dan upload file CV (format PDF, maksimal 5MB).
•	Email harus unik di seluruh sistem. Sistem menampilkan pesan error jika email sudah terdaftar.
•	Password minimal 8 karakter, mengandung huruf dan angka.
•	Setelah registrasi berhasil, kandidat diarahkan ke halaman login.

FR-AUTH-02: Login
•	Semua pengguna (admin dan kandidat) login melalui satu halaman login menggunakan email dan password.
•	Sistem membedakan dashboard yang ditampilkan berdasarkan role setelah login berhasil.
•	Sesi login berlaku selama 8 jam atau hingga pengguna logout.

FR-AUTH-03: Manajemen Profil Kandidat
•	Kandidat dapat memperbarui data profil (nama, telepon) dan mengupload ulang CV terbaru.
•	Perubahan CV hanya memperbarui cv_path di tabel users. CV yang sudah digunakan saat mendaftar (cv_snapshot di tabel applications) tidak berubah.

5.2 Modul Posisi
FR-POS-01: Daftar Posisi (Kandidat)
•	Kandidat yang belum mendaftar melihat semua posisi aktif (is_active = true) dengan judul, deskripsi singkat, dan tombol 'Daftar'.
•	Kandidat yang sudah mendaftar ke suatu posisi tidak dapat mendaftar ke posisi lain manapun. Tombol 'Daftar' di semua posisi dinonaktifkan.
•	Posisi yang tidak aktif tidak ditampilkan kepada kandidat.

FR-POS-02: Manajemen Posisi (Admin)
•	Admin dapat membuat posisi baru dengan mengisi judul dan deskripsi.
•	Admin dapat mengaktifkan atau menonaktifkan posisi. Posisi nonaktif tidak tampil di halaman kandidat namun data historisnya tetap tersimpan.
•	Admin dapat mengedit judul dan deskripsi posisi yang sudah ada.

5.3 Modul Assessment
FR-ASS-01: Randomisasi Assessment
•	Saat kandidat mendaftar ke suatu posisi, sistem secara acak memilih satu assessment dari seluruh assessment yang tersedia untuk posisi tersebut.
•	Assessment yang terpilih dicatat di kolom assessment_id pada tabel applications dan tidak dapat berubah setelahnya.

FR-ASS-02: Pengerjaan Assessment
•	Kandidat dapat memulai assessment dari dashboard. Timer dimulai saat tombol 'Mulai Assessment' ditekan.
•	Timer ditampilkan secara real-time (countdown) di halaman pengerjaan.
•	Sistem menyimpan waktu mulai (started_at) dan batas waktu (expires_at = started_at + duration_minutes) di sisi server.
•	Jika timer habis (waktu server melewati expires_at), sistem otomatis melakukan submit dengan jawaban yang sudah terisi.
•	Soal ditampilkan dalam satu halaman dengan scroll, diurutkan berdasarkan order_index.
•	Kandidat dapat menyimpan draft jawaban sementara sebelum submit final.

FR-ASS-03: Manajemen Assessment (Admin)
•	Admin dapat membuat assessment baru untuk suatu posisi, mengisi judul dan durasi (dalam menit).
•	Admin dapat menambahkan soal ke dalam assessment: memilih tipe (pilihan ganda atau essay), mengisi teks soal, mengisi opsi jawaban (untuk MC), menentukan jawaban benar (untuk MC), dan mengatur bobot nilai.
•	Admin dapat mengatur urutan soal (order_index).
•	Admin dapat menambahkan satu atau lebih project task ke dalam assessment, mengisi judul, deskripsi, dan deadline pengerjaan dalam jam.

5.4 Modul Penilaian
FR-SCR-01: Auto-Scoring Pilihan Ganda
•	Setelah kandidat submit assessment, sistem otomatis mencocokkan jawaban MC dengan correct_answer.
•	Jika jawaban benar, score diisi dengan nilai point_value soal tersebut. Jika salah, score diisi 0.
•	Proses auto-scoring terjadi secara sinkron segera setelah submit.

FR-SCR-02: Penilaian Essay (Admin)
•	Admin melihat daftar jawaban essay dari seorang kandidat beserta teks soal aslinya.
•	Admin mengisi nilai numerik untuk setiap jawaban essay (antara 0 dan point_value soal).
•	Sistem mencatat admin yang memberikan nilai (scored_by) dan waktu penilaian (scored_at).

FR-SCR-03: Penilaian Project
•	Admin melihat file project yang diupload kandidat dan dapat mengunduhnya.
•	Admin mengisi nilai project (score) dan catatan feedback (score_notes).
•	Sistem mencatat admin yang memberikan nilai dan waktu penilaian.

FR-SCR-04: Agregasi Nilai
•	Total score dihitung setelah semua penilaian (MC, essay, project) selesai.
•	Total score = jumlah semua score dari tabel answers + jumlah score dari tabel project_submissions.
•	Admin dapat melihat breakdown nilai per komponen (MC, essay, project) di halaman detail aplikasi.

5.5 Modul Manajemen Aplikasi (Admin)
FR-APP-01: Dashboard Admin
•	Menampilkan statistik ringkasan: total aplikasi, aplikasi per status, rata-rata skor per posisi.
•	Menampilkan daftar aplikasi terbaru yang masuk (submitted atau under_review).

FR-APP-02: Daftar dan Filter Aplikasi
•	Admin dapat melihat semua aplikasi dengan filter: posisi, status, dan rentang tanggal pendaftaran.
•	Admin dapat mencari kandidat berdasarkan nama atau email.
•	Daftar dapat diurutkan berdasarkan tanggal daftar, total score, atau nama kandidat.

FR-APP-03: Detail Aplikasi dan Keputusan
•	Admin dapat melihat halaman detail satu aplikasi: info kandidat, CV snapshot, jawaban assessment, dan submission project.
•	Admin dapat mengubah status aplikasi ke approved atau rejected.
•	Admin wajib mengisi admin_notes (alasan keputusan) sebelum menyimpan perubahan status.
•	Perubahan status dicatat bersama reviewed_by (ID admin) dan reviewed_at (timestamp).

6. Alur Status Aplikasi
Setiap aplikasi kandidat melewati satu dari alur status berikut:

Status	Trigger	Keterangan
pending	Saat kandidat mendaftar	Aplikasi baru dibuat. Assessment sudah ditentukan tapi belum dimulai.
in_progress	Saat kandidat menekan 'Mulai Assessment'	Timer berjalan. Kandidat sedang mengerjakan soal.
submitted	Saat kandidat submit assessment	Semua jawaban tersimpan. Menunggu review admin.
under_review	Saat admin membuka detail aplikasi	Admin sedang menilai essay dan project.
approved	Saat admin mengubah status ke approved	Kandidat diterima sebagai magang.
rejected	Saat admin mengubah status ke rejected	Kandidat tidak lolos seleksi.

7. Requirements Non-Fungsional
7.1 Performa
•	Halaman utama dan dashboard harus load dalam < 2 detik pada koneksi 4G.
•	API endpoint harus merespons dalam < 500ms untuk operasi read, < 1000ms untuk operasi write.
•	Sistem harus dapat menangani minimal 200 pengguna aktif secara bersamaan.

7.2 Keamanan
•	Semua komunikasi menggunakan HTTPS (TLS 1.2+).
•	Password disimpan menggunakan hashing bcrypt (cost factor >= 12).
•	Akses ke halaman dan API diproteksi menggunakan JWT atau session token.
•	Timer assessment divalidasi di sisi server, bukan hanya di sisi klien.
•	Kandidat hanya dapat mengakses data aplikasi miliknya sendiri.
•	Upload file divalidasi tipe (hanya PDF) dan ukuran (maksimal 5MB untuk CV, 20MB untuk project).

7.3 Keandalan
•	Target uptime sistem: 99.5% per bulan.
•	Jawaban assessment disimpan secara otomatis (auto-save) setiap 30 detik untuk mencegah kehilangan data akibat koneksi terputus.
•	Database menggunakan backup harian dengan retensi 30 hari.

7.4 Usability
•	Antarmuka harus responsif dan dapat digunakan di browser mobile (layar >= 375px).
•	Semua form harus memiliki validasi inline dan pesan error yang jelas dalam Bahasa Indonesia.
•	Proses pengerjaan assessment harus dapat diselesaikan tanpa panduan tambahan (zero learning curve).

8. Batasan dan Asumsi
8.1 Batasan (Constraints)
•	Platform ini hanya mendukung bahasa Indonesia (tidak multibahasa pada versi 1.0).
•	Notifikasi email ke kandidat (misalnya saat status berubah) tidak termasuk dalam scope v1.0 dan akan dipertimbangkan di versi berikutnya.
•	Satu kandidat hanya dapat mendaftar ke satu posisi. Fitur multi-posisi tidak tersedia di v1.0.
•	Tidak ada integrasi dengan platform pihak ketiga (LinkedIn, Google, dll) di v1.0.
•	File yang diupload disimpan di server lokal atau object storage; CDN belum dalam scope v1.0.

8.2 Asumsi
•	Admin akan dibuat secara manual oleh tim teknis melalui database seeding; tidak ada fitur self-register untuk admin.
•	Setiap posisi memiliki minimal satu assessment aktif sebelum dibuka untuk kandidat.
•	Koneksi internet kandidat dianggap cukup stabil untuk mengerjakan assessment berbasis web.
•	Soal essay dinilai secara manual oleh admin; tidak ada AI scoring di v1.0.

9. Halaman dan Komponen UI
9.1 Halaman untuk Kandidat
Halaman	Konten Utama
/register	Form registrasi: nama, email, password, telepon, upload CV
/login	Form login email & password
/dashboard	Status aplikasi, tombol mulai assessment, progress project
/positions	Daftar posisi aktif, deskripsi singkat, tombol daftar
/assessment/:id	Soal MC & essay, timer countdown, tombol submit
/project/:id	Detail project task, countdown deadline, form upload file
/profile	Edit profil, update CV

9.2 Halaman untuk Admin
Halaman	Konten Utama
/admin/dashboard	Statistik ringkasan, grafik status, aplikasi terbaru
/admin/positions	Tabel posisi, tambah/edit posisi, toggle aktif
/admin/positions/:id/assessments	Daftar assessment per posisi, kelola soal & project task
/admin/applications	Tabel semua aplikasi, filter & pencarian
/admin/applications/:id	Detail kandidat: CV, jawaban, project, form scoring, keputusan

10. Open Issues dan Keputusan Tertunda
#	Isu	Opsi	Status
1	Notifikasi email ke kandidat saat status berubah	Integrasi SMTP / third-party (SendGrid, Mailgun)	Belum diputuskan
2	Batas jumlah percobaan login (brute-force protection)	Rate limiting per IP / per email	Perlu dikaji
3	Proctoring assessment (anti-cheat)	Tab switching detection, full-screen enforcement	Out of scope v1.0
4	Mekanisme refund posisi (batalkan pendaftaran)	Kandidat dapat batalkan sebelum mulai assessment	Perlu dikaji
5	Dashboard analytics historis per batch rekrutmen	Export CSV / visualisasi chart	Direncanakan v1.1

11. Riwayat Revisi
Versi	Tanggal	Penulis	Perubahan
1.0.0	April 2026	Tim Product	Draft pertama

— Akhir Dokumen —
