Enum role_user {
  admin
  candidate
}

Enum application_status {
  pending       // baru mendaftar, belum mulai assessment
  in_progress   // sedang mengerjakan assessment
  submitted     // sudah submit, menunggu review admin
  under_review  // sedang direview admin
  approved
  rejected
}

Enum question_type {
  multiple_choice
  essay
}

Enum submission_status {
  not_submitted
  submitted
  reviewed
}

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────
Table users {
  id          bigint      [pk, increment]
  name        varchar(100) [not null]
  email       varchar(150) [unique, not null]
  password    varchar(255) [not null]
  phone       varchar(20)
  cv_path     varchar(255) [note: 'path file CV terkini milik kandidat']
  role        role_user   [not null, default: 'candidate']
  created_at  timestamp   [default: `now()`]
  updated_at  timestamp
}

// ─────────────────────────────────────────
// POSITIONS
// ─────────────────────────────────────────
Table positions {
  id          bigint      [pk, increment]
  title       varchar(100) [not null, note: 'Web Developer, Graphic Designer, dll']
  description text
  is_active   boolean     [default: true]
  created_by  bigint      [ref: > users.id]
  created_at  timestamp   [default: `now()`]
  updated_at  timestamp
}

// ─────────────────────────────────────────
// ASSESSMENTS
// ─────────────────────────────────────────
Table assessments {
  id               bigint [pk, increment]
  position_id      bigint [not null, ref: > positions.id]
  title            varchar(150) [not null]
  duration_minutes int    [not null, note: 'waktu pengerjaan soal pilihan ganda & essay']
  created_by       bigint [ref: > users.id]
  created_at       timestamp [default: `now()`]
  updated_at       timestamp
}

// ─────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────
Table questions {
  id             bigint        [pk, increment]
  assessment_id  bigint        [not null, ref: > assessments.id]
  type           question_type [not null]
  question_text  text          [not null]
  options        json          [note: 'multiple_choice: [{key, text}, ...] | null jika essay']
  correct_answer varchar(10)   [note: 'key jawaban benar untuk MC | null jika essay']
  point_value    decimal(5,2)  [not null, default: 1, note: 'bobot nilai per soal']
  order_index    int           [not null, default: 1]
  created_at     timestamp     [default: `now()`]
  updated_at     timestamp
}

// ─────────────────────────────────────────
// PROJECT TASKS
// ─────────────────────────────────────────
Table project_tasks {
  id             bigint       [pk, increment]
  assessment_id  bigint       [not null, ref: > assessments.id]
  title          varchar(150) [not null]
  description    text         [not null]
  deadline_hours int          [not null, note: 'durasi pengerjaan project dari waktu assign']
  created_at     timestamp    [default: `now()`]
  updated_at     timestamp
}

// ─────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────
Table applications {
  id            bigint             [pk, increment]
  candidate_id  bigint             [not null, ref: > users.id]
  position_id   bigint             [not null, ref: > positions.id]
  assessment_id bigint             [not null, ref: > assessments.id, note: 'assessment yang dirandom saat mendaftar']
  cv_snapshot   varchar(255)       [note: 'path CV kandidat saat mendaftar, tidak berubah meski CV diupdate']
  status        application_status [default: 'pending']
  started_at    timestamp          [note: 'waktu mulai mengerjakan soal — trigger set expires_at']
  expires_at    timestamp          [note: 'started_at + assessments.duration_minutes, diset saat started_at diisi']
  submitted_at  timestamp          [note: 'waktu submit soal oleh kandidat']
  total_score   decimal(5,2)       [note: 'agregat nilai dari answers + project_submissions, diisi setelah semua dinilai']
  reviewed_by   bigint             [ref: > users.id, note: 'admin yang melakukan review akhir']
  reviewed_at   timestamp
  admin_notes   text               [note: 'catatan keputusan approve/reject dari admin']
  created_at    timestamp          [default: `now()`]
  updated_at    timestamp

  indexes {
    candidate_id [note: 'Index biasa untuk performa query pencarian kandidat']
    status       [note: 'Index biasa untuk performa filter dashboard admin']
  }
}

// ─────────────────────────────────────────
// ANSWERS
// ─────────────────────────────────────────
Table answers {
  id             bigint       [pk, increment]
  application_id bigint       [not null, ref: > applications.id]
  question_id    bigint       [not null, ref: > questions.id]
  answer_text    text         [note: 'isi jawaban untuk essay maupun key jawaban MC']
  score          decimal(5,2) [note: 'otomatis untuk MC | diisi manual admin untuk essay']
  scored_by      bigint       [ref: > users.id, note: 'admin yang menilai essay, null untuk MC']
  scored_at      timestamp
  created_at     timestamp    [default: `now()`]
  updated_at     timestamp

  indexes {
    (application_id, question_id) [unique, note: '1 jawaban per soal per aplikasi']
  }
}

// ─────────────────────────────────────────
// PROJECT SUBMISSIONS
// ─────────────────────────────────────────
Table project_submissions {
  id              bigint            [pk, increment]
  application_id  bigint            [not null, ref: > applications.id]
  project_task_id bigint            [not null, ref: > project_tasks.id]
  status          submission_status [default: 'not_submitted']
  file_path       varchar(255)      [note: 'path file yang diupload kandidat']
  notes           text              [note: 'catatan tambahan atau link repository dari kandidat']
  score           decimal(5,2)      [note: 'nilai project dari admin']
  score_notes     text              [note: 'feedback admin terhadap project']
  scored_by       bigint            [ref: > users.id]
  scored_at       timestamp
  started_at      timestamp
  submitted_at    timestamp
  created_at      timestamp         [default: `now()`]
  updated_at      timestamp

  indexes {
    (application_id, project_task_id) [unique, note: '1 submission per task per aplikasi']
  }
}