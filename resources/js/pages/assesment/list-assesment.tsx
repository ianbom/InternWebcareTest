import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Clock,
    Code,
    FileText,
    Lightbulb,
    Lock,
    Rocket,
    Shield,
    Timer,
    Wifi,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    start as assessmentStart,
    take as assessmentTake,
} from '@/routes/assessments';
import { index as positionsIndex } from '@/routes/positions';
import { submit as projectSubmissionSubmit } from '@/routes/project-submissions';
import { StartConfirmationModal } from './components/candidate/StartConfirmationModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';
type StepKey = 'profile' | 'quiz' | 'project' | 'review' | 'result';

interface ProjectSubmission {
    id: number;
    status: 'not_submitted' | 'submitted' | 'reviewed';
    file_path: string | null;
    file_url: string | null;
    notes: string | null;
    score: number | null;
    score_notes: string | null;
    started_at: string | null;
    submitted_at: string | null;
    deadline_at: string | null;
}

interface ProjectTask {
    id: number;
    title: string;
    description: string;
    deadline_hours: number;
    submission: ProjectSubmission | null;
}

interface AssessmentData {
    id: number;
    title: string;
    duration_minutes: number;
    project_tasks: ProjectTask[];
}

interface ApplicationData {
    id: number;
    status: string;
    statusLabel: string;
    statusTone: StatusTone;
    activeStep: StepKey;
    headline: string;
    guidance: string;
    isFinalStatus: boolean;
    isAssessmentVisible: boolean;
    hasProjectTasks: boolean;
    areProjectSubmissionsComplete: boolean;
    started_at: string | null;
    expires_at: string | null;
    submitted_at: string | null;
    total_score: number | null;
    position: { id: number; title: string };
    assessment: AssessmentData;
}

interface Props {
    hasApplication: boolean;
    application: ApplicationData | null;
}

const INTELLIGENCE_BRIEFS = [
    {
        icon: Wifi,
        title: 'Koneksi Stabil',
        description:
            'Pastikan koneksi internet stabil selama quiz berlangsung untuk mencegah kegagalan transmisi data.',
    },
    {
        icon: Shield,
        title: 'Anti-Cheat System',
        description:
            'Hindari berpindah tab atau membuka browser lain untuk menjaga integritas penilaian.',
    },
    {
        icon: Timer,
        title: 'Auto-Submit',
        description:
            'Perhatikan sisa waktu di pojok layar. Misi akan terkirim otomatis saat waktu habis.',
    },
] as const;

const STATUS_BADGE_CLASSES: Record<StatusTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    info: 'bg-blue-50 text-blue-700',
    warning: 'bg-amber-50 text-amber-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-rose-50 text-rose-700',
};

const STATUS_PANEL_CLASSES: Record<StatusTone, string> = {
    neutral: 'border-slate-200 bg-slate-50 text-slate-700',
    info: 'border-blue-100 bg-blue-50 text-blue-800',
    warning: 'border-amber-100 bg-amber-50 text-amber-800',
    success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
    danger: 'border-rose-100 bg-rose-50 text-rose-800',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(value: string | null): string | null {
    if (!value) {
        return null;
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function getSubmissionBadge(status: ProjectSubmission['status'] | null): {
    label: string;
    className: string;
} {
    switch (status) {
        case 'submitted':
            return {
                label: 'Terkirim',
                className: 'bg-emerald-50 text-emerald-600',
            };
        case 'reviewed':
            return {
                label: 'Direview',
                className: 'bg-blue-50 text-primary',
            };
        default:
            return {
                label: 'Belum Dikirim',
                className: 'bg-gray-100 text-gray-500',
            };
    }
}

function extractFileName(path: string | null): string | null {
    if (!path) {
        return null;
    }

    const segments = path.split('/');

    return segments[segments.length - 1] ?? path;
}



// ─── Component ────────────────────────────────────────────────────────────────

export default function ListAssesment({ hasApplication, application }: Props) {
    const activeStep = application?.activeStep ?? 'profile';
    const hasProjectTasks = application?.hasProjectTasks ?? false;
    const quizActive = activeStep === 'quiz';
    const projectActive = activeStep === 'project';
    const reviewActive = activeStep === 'review';
    const quizDone = ['project', 'review', 'result'].includes(activeStep);
    const projectDone =
        hasProjectTasks &&
        (application?.areProjectSubmissionsComplete ||
            ['review', 'result'].includes(activeStep));
    const [projectFiles, setProjectFiles] = useState<
        Record<number, File | null>
    >({});
    const [projectNotes, setProjectNotes] = useState<Record<number, string>>(
        () =>
            application?.assessment.project_tasks.reduce<
                Record<number, string>
            >((acc, task) => {
                acc[task.id] = task.submission?.notes ?? '';

                return acc;
            }, {}) ?? {},
    );
    const [submittingTaskId, setSubmittingTaskId] = useState<number | null>(
        null,
    );
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);

    const canSubmitProject = projectActive;

    const handleProjectFileChange = (
        taskId: number,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;

        setProjectFiles((prev) => ({
            ...prev,
            [taskId]: file,
        }));
    };

    const handleProjectSubmit = (task: ProjectTask) => {
        const submission = task.submission;
        const selectedFile = projectFiles[task.id];

        if (
            !application ||
            !submission ||
            !selectedFile ||
            submittingTaskId !== null
        ) {
            return;
        }

        setSubmittingTaskId(task.id);

        router.post(
            projectSubmissionSubmit.url({
                application: application.id,
                projectSubmission: submission.id,
            }),
            {
                submission_file: selectedFile,
                notes: projectNotes[task.id] ?? '',
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setSubmittingTaskId(null),
            },
        );
    };

    /* ── No application: empty state ──────────────────────────────────── */
    if (!hasApplication || !application) {
        return (
            <AppLayout>
                <Head title="Assessment Saya - Webcare Intern" />
                <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="mx-auto max-w-sm rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Rocket className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-800">
                            Belum Ada Assessment
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            Anda belum mendaftar ke posisi magang apapun. Daftar
                            terlebih dahulu untuk mendapatkan assessment.
                        </p>
                        <Link
                            href={positionsIndex.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                            Lihat Posisi Magang
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (application.isFinalStatus || !application.isAssessmentVisible) {
        const isApproved = application.status === 'approved';
        const FinalIcon = isApproved ? CheckCircle2 : FileText;

        return (
            <AppLayout>
                <Head title="Assessment Saya - Webcare Intern" />
                <div className="min-h-screen p-4 sm:p-8">
                    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center gap-5">
                        <div className="w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_20px_70px_rgba(29,68,156,0.12)]">
                            <div
                                className={`border-b p-8 text-center ${
                                    STATUS_PANEL_CLASSES[application.statusTone]
                                }`}
                            >
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                                    <FinalIcon className="h-8 w-8" />
                                </div>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase ${
                                        STATUS_BADGE_CLASSES[
                                            application.statusTone
                                        ]
                                    }`}
                                >
                                    {application.statusLabel}
                                </span>
                                <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
                                    {application.headline}
                                </h1>
                                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed">
                                    {application.guidance}
                                </p>
                            </div>

                            <div className="grid gap-4 p-6 sm:grid-cols-2">
                                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5">
                                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Posisi Dilamar
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                        {application.position.title}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5">
                                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Assessment
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                        Tidak ada assessment aktif
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 px-6 py-5 text-center text-sm text-gray-500">
                                Konten assessment, project task, deadline, dan
                                form upload disembunyikan karena proses lamaran
                                sudah mencapai status final.
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    /* ── Main page ─────────────────────────────────────────────────────── */
    return (
        <AppLayout>
            <Head title="Assessment Saya - Webcare Intern" />

            <div className="min-h-screen p-4 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                        <div className="min-w-0 lg:max-w-3xl">
                            {/* ── Hero: Greeting + Bubble ─────────────────────────── */}
                            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                {/* Left: Greeting */}
                                <div className="max-w-xs">
                                    <h1 className="text-3xl leading-tight font-extrabold text-primary">
                                        Halo, Kandidat! Siap untuk misi{' '}
                                        <span className="text-primary">
                                            {application.position.title}-mu?
                                        </span>
                                    </h1>
                                </div>

                                {/* Right: Notification bubble */}
                                <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:max-w-[240px]">
                                    <p className="flex-1 text-sm leading-relaxed text-gray-600">
                                        <span className="mb-0.5 block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                                            {hasProjectTasks
                                                ? 'Deadline Pengerjaan'
                                                : 'Mode Seleksi'}
                                        </span>
                                        <span className="block font-bold text-gray-800">
                                            {hasProjectTasks
                                                ? application?.assessment
                                                      ?.project_tasks[0]
                                                      ?.submission?.deadline_at
                                                    ? formatDateTime(
                                                          application.assessment
                                                              .project_tasks[0]
                                                              .submission
                                                              .deadline_at,
                                                      )
                                                    : '-'
                                                : 'Quiz saja'}
                                        </span>
                                    </p>
                                    {/* Rocket icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* <div
                                className={`mb-8 rounded-3xl border p-5 ${
                                    STATUS_PANEL_CLASSES[application.statusTone]
                                }`}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase ${
                                                STATUS_BADGE_CLASSES[
                                                    application.statusTone
                                                ]
                                            }`}
                                        >
                                            {application.statusLabel}
                                        </span>
                                        <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-900">
                                            {application.headline}
                                        </h2>
                                        <p className="mt-2 max-w-2xl text-sm leading-relaxed">
                                            {application.guidance}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-gray-800 shadow-sm">
                                        {application.position.title}
                                    </div>
                                </div>
                            </div> */}

                            {/* ── Timeline ─────────────────────────────────────────── */}
                            <div className="relative">
                                {/* Vertical spine */}
                                <div className="absolute top-0 left-[19px] h-full w-0.5 bg-gray-200" />

                                <div className="space-y-5">
                                    {/* ── Step 1: Ujian Assessment ────────────────── */}
                                    <div className="relative flex items-start gap-4">
                                        {/* Timeline icon */}
                                        <div
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                quizDone
                                                    ? 'border-green-400 bg-green-400'
                                                    : quizActive
                                                      ? 'border-primary bg-primary shadow-[0_0_0_4px_rgba(29,68,156,0.15)]'
                                                      : 'border-gray-200 bg-gray-100'
                                            }`}
                                        >
                                            {quizDone ? (
                                                <CheckCircle2 className="h-5 w-5 text-white" />
                                            ) : (
                                                <Zap
                                                    className={`h-5 w-5 ${quizActive ? 'text-white' : 'text-gray-400'}`}
                                                />
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div
                                            className={`flex-1 rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
                                                quizActive
                                                    ? 'border-l-4 border-t-gray-100 border-r-gray-100 border-b-gray-100 border-l-primary shadow-[0_4px_20px_rgba(29,68,156,0.08)]'
                                                    : 'border-gray-100 opacity-60'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                {/* Left info */}
                                                <div>
                                                    {quizActive && (
                                                        <span className="mb-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                                                            Tahap Aktif
                                                        </span>
                                                    )}
                                                    {quizDone && (
                                                        <span className="mb-2 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-green-600 uppercase">
                                                            Selesai
                                                        </span>
                                                    )}
                                                    <h2 className="text-lg font-bold text-gray-800">
                                                        Tahap 1:{' '}
                                                        {
                                                            application
                                                                .assessment
                                                                .title
                                                        }
                                                    </h2>
                                                    {/* Meta */}
                                                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {
                                                                application
                                                                    .assessment
                                                                    .duration_minutes
                                                            }{' '}
                                                            Min
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            MCQ &amp; Essay
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* CTA */}
                                                {quizActive &&
                                                    application.status ===
                                                        'pending' && (
                                                        <button
                                                            onClick={() => setIsStartModalOpen(true)}
                                                            className="mt-2 flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg sm:mt-0"
                                                        >
                                                            Mulai Quiz
                                                            <ArrowRight className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                {quizActive &&
                                                    application.status ===
                                                        'in_progress' && (
                                                        <Link
                                                            href={assessmentTake.url(
                                                                application.id,
                                                            )}
                                                            className="mt-2 flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg sm:mt-0"
                                                        >
                                                            Lanjutkan Quiz
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Step 2: Project Simulasi ─────────────────── */}
                                    {application.assessment.project_tasks
                                        .length > 0 && (
                                        <div className="relative flex items-start gap-4">
                                            {/* Timeline icon */}
                                            <div
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                    projectDone
                                                        ? 'border-green-400 bg-green-400'
                                                        : projectActive
                                                          ? 'border-primary bg-primary shadow-[0_0_0_4px_rgba(29,68,156,0.15)]'
                                                          : 'border-gray-200 bg-gray-100'
                                                }`}
                                            >
                                                {projectDone ? (
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                ) : (
                                                    <Lock
                                                        className={`h-4 w-4 ${projectActive ? 'text-white' : 'text-gray-400'}`}
                                                    />
                                                )}
                                            </div>

                                            {/* Card */}
                                            <div
                                                className={`flex-1 rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
                                                    projectActive
                                                        ? 'border-l-4 border-t-gray-100 border-r-gray-100 border-b-gray-100 border-l-primary shadow-[0_4px_20px_rgba(29,68,156,0.08)]'
                                                        : 'border-gray-100 opacity-50'
                                                }`}
                                            >
                                                {/* If locked, show single-line collapsed */}
                                                {!projectActive ? (
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h2 className="text-lg font-bold text-gray-400">
                                                                Tahap 2: Project
                                                                Simulasi
                                                            </h2>
                                                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    {application
                                                                        .assessment
                                                                        .project_tasks[0]
                                                                        ?.deadline_hours ??
                                                                        48}
                                                                    -hour
                                                                    deadline
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Code className="h-3.5 w-3.5" />
                                                                    Technical
                                                                    Implementation
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                                            {projectDone ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Lock className="h-4 w-4" />
                                                            )}
                                                            <span className="font-medium">
                                                                {projectDone
                                                                    ? 'Selesai'
                                                                    : 'Terkunci'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* If unlocked, expand all tasks */
                                                    <div>
                                                        <span
                                                            className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                                                                projectDone
                                                                    ? 'bg-green-50 text-green-600'
                                                                    : canSubmitProject
                                                                      ? 'bg-blue-50 text-primary'
                                                                      : 'bg-green-50 text-green-600'
                                                            }`}
                                                        >
                                                            {projectDone
                                                                ? 'Selesai'
                                                                : canSubmitProject
                                                                  ? 'Tahap Aktif'
                                                                  : 'Tahap Selesai'}
                                                        </span>
                                                        <h2 className="text-lg font-bold text-gray-800">
                                                            Tahap 2: Project
                                                            Simulasi
                                                        </h2>
                                                        <p className="mt-1 text-sm leading-relaxed text-gray-500">
                                                            Upload file project
                                                            untuk setiap task
                                                            yang tersedia. File
                                                            yang sudah diunggah
                                                            bersifat final dan
                                                            tidak dapat diubah
                                                            kembali, pastikan
                                                            file sudah benar
                                                            sebelum dikirim.
                                                        </p>
                                                        <div className="mt-4 space-y-3">
                                                            {application.assessment.project_tasks.map(
                                                                (task, idx) => {
                                                                    const submission =
                                                                        task.submission;
                                                                    const badge =
                                                                        getSubmissionBadge(
                                                                            submission?.status ??
                                                                                null,
                                                                        );
                                                                    const isReviewed =
                                                                        submission?.status ===
                                                                        'reviewed';
                                                                    const hasSubmitted =
                                                                        submission?.status ===
                                                                            'submitted' ||
                                                                        isReviewed;
                                                                    const isSubmitting =
                                                                        submittingTaskId ===
                                                                        task.id;
                                                                    const currentFileName =
                                                                        extractFileName(
                                                                            submission?.file_path ??
                                                                                null,
                                                                        );
                                                                    const selectedFileName =
                                                                        projectFiles[
                                                                            task
                                                                                .id
                                                                        ]?.name;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                task.id
                                                                            }
                                                                            className="rounded-xl border border-gray-100 bg-[#F9FAFB] p-4"
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                                                                    {idx +
                                                                                        1}
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                                        <h3 className="font-semibold text-gray-800">
                                                                                            {
                                                                                                task.title
                                                                                            }
                                                                                        </h3>
                                                                                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                                                                                            <Clock className="h-3 w-3" />
                                                                                            {
                                                                                                task.deadline_hours
                                                                                            }{' '}
                                                                                            jam
                                                                                        </span>
                                                                                        <span
                                                                                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
                                                                                        >
                                                                                            {
                                                                                                badge.label
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                                                                                        {
                                                                                            task.description
                                                                                        }
                                                                                    </p>

                                                                                    <div className="mt-4 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                                                                                        <div className="grid gap-1 text-xs text-gray-500 sm:grid-cols-2">
                                                                                            <span>
                                                                                                Deadline:{' '}
                                                                                                <span className="font-semibold text-gray-700">
                                                                                                    {formatDateTime(
                                                                                                        submission?.deadline_at ??
                                                                                                            null,
                                                                                                    ) ??
                                                                                                        '-'}
                                                                                                </span>
                                                                                            </span>
                                                                                            <span>
                                                                                                Submitted:{' '}
                                                                                                <span className="font-semibold text-gray-700">
                                                                                                    {formatDateTime(
                                                                                                        submission?.submitted_at ??
                                                                                                            null,
                                                                                                    ) ??
                                                                                                        '-'}
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>

                                                                                        {submission?.file_url && (
                                                                                            <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-primary">
                                                                                                <a
                                                                                                    href={
                                                                                                        submission.file_url
                                                                                                    }
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                    className="font-semibold underline underline-offset-4"
                                                                                                >
                                                                                                    Lihat
                                                                                                    file
                                                                                                </a>
                                                                                                <span className="ml-2 text-xs text-primary/80">
                                                                                                    {currentFileName
                                                                                                        ? `(${currentFileName})`
                                                                                                        : ''}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}

                                                                                        {submission &&
                                                                                            submission.score !==
                                                                                                null && (
                                                                                                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                                                                                    Nilai:{' '}
                                                                                                    <span className="font-semibold">
                                                                                                        {
                                                                                                            submission.score
                                                                                                        }
                                                                                                    </span>
                                                                                                    {submission.score_notes
                                                                                                        ? ` - ${submission.score_notes}`
                                                                                                        : ''}
                                                                                                </div>
                                                                                            )}

                                                                                        <div>
                                                                                            <label
                                                                                                htmlFor={`project-file-${task.id}`}
                                                                                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                                                                                            >
                                                                                                Upload
                                                                                                File
                                                                                                Project
                                                                                            </label>
                                                                                            <input
                                                                                                id={`project-file-${task.id}`}
                                                                                                type="file"
                                                                                                accept=".zip,.rar,.7z,.pdf,.doc,.docx,.ppt,.pptx"
                                                                                                disabled={
                                                                                                    !canSubmitProject ||
                                                                                                    hasSubmitted ||
                                                                                                    isSubmitting
                                                                                                }
                                                                                                onChange={(
                                                                                                    event,
                                                                                                ) =>
                                                                                                    handleProjectFileChange(
                                                                                                        task.id,
                                                                                                        event,
                                                                                                    )
                                                                                                }
                                                                                                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                                                                            />
                                                                                            <p className="mt-1 text-xs text-gray-400">
                                                                                                Maksimal
                                                                                                10
                                                                                                MB.
                                                                                                Gunakan
                                                                                                format
                                                                                                file
                                                                                                yang
                                                                                                sesuai
                                                                                                dengan
                                                                                                kebutuhan
                                                                                                task.
                                                                                            </p>
                                                                                            {selectedFileName && (
                                                                                                <p className="mt-1 text-xs font-medium text-primary">
                                                                                                    File
                                                                                                    dipilih:{' '}
                                                                                                    {
                                                                                                        selectedFileName
                                                                                                    }
                                                                                                </p>
                                                                                            )}
                                                                                        </div>

                                                                                        <div>
                                                                                            <label
                                                                                                htmlFor={`project-notes-${task.id}`}
                                                                                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                                                                                            >
                                                                                                Catatan
                                                                                                Submission
                                                                                            </label>
                                                                                            <textarea
                                                                                                id={`project-notes-${task.id}`}
                                                                                                rows={
                                                                                                    4
                                                                                                }
                                                                                                value={
                                                                                                    projectNotes[
                                                                                                        task
                                                                                                            .id
                                                                                                    ] ??
                                                                                                    ''
                                                                                                }
                                                                                                disabled={
                                                                                                    !canSubmitProject ||
                                                                                                    hasSubmitted ||
                                                                                                    isSubmitting
                                                                                                }
                                                                                                onChange={(
                                                                                                    event,
                                                                                                ) =>
                                                                                                    setProjectNotes(
                                                                                                        (
                                                                                                            prev,
                                                                                                        ) => ({
                                                                                                            ...prev,
                                                                                                            [task.id]:
                                                                                                                event
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                        }),
                                                                                                    )
                                                                                                }
                                                                                                placeholder="Tambahkan catatan singkat, link demo, atau instruksi menjalankan project."
                                                                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-50"
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                                                            <p className="text-xs text-gray-400">
                                                                                                {hasSubmitted
                                                                                                    ? 'Submission ini sudah terkirim secara final dan tidak bisa diubah lagi.'
                                                                                                    : canSubmitProject
                                                                                                      ? 'Pastikan file final sudah benar sebelum dikirim.'
                                                                                                      : 'Upload dinonaktifkan karena tahap project sudah selesai.'}
                                                                                            </p>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    handleProjectSubmit(
                                                                                                        task,
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    !submission ||
                                                                                                    !projectFiles[
                                                                                                        task
                                                                                                            .id
                                                                                                    ] ||
                                                                                                    !canSubmitProject ||
                                                                                                    hasSubmitted ||
                                                                                                    isSubmitting
                                                                                                }
                                                                                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
                                                                                            >
                                                                                                {isSubmitting
                                                                                                    ? 'Mengirim...'
                                                                                                    : 'Kirim Project'}
                                                                                                <ArrowRight className="h-4 w-4" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {application.assessment.project_tasks
                                        .length === 0 && (
                                        <div className="relative flex items-start gap-4">
                                            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-300">
                                                <Code className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 rounded-2xl border border-dashed border-gray-200 bg-white p-5 opacity-80 shadow-sm">
                                                <span className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                                    Dilewati
                                                </span>
                                                <h2 className="text-lg font-bold text-gray-800">
                                                    Tahap 2: Project
                                                </h2>
                                                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                                                    Assessment untuk posisi ini
                                                    hanya membutuhkan quiz.
                                                    Setelah quiz dikirim, proses
                                                    langsung masuk ke tahap
                                                    review.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative flex items-start gap-4">
                                        <div
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                reviewActive
                                                    ? 'border-primary bg-primary text-white shadow-[0_0_0_4px_rgba(29,68,156,0.15)]'
                                                    : activeStep === 'result'
                                                      ? 'border-green-400 bg-green-400 text-white'
                                                      : 'border-gray-200 bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {activeStep === 'result' ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <FileText className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div
                                            className={`flex-1 rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
                                                reviewActive
                                                    ? 'border-l-4 border-t-gray-100 border-r-gray-100 border-b-gray-100 border-l-primary shadow-[0_4px_20px_rgba(29,68,156,0.08)]'
                                                    : 'border-gray-100 opacity-70'
                                            }`}
                                        >
                                            <span
                                                className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                                                    reviewActive
                                                        ? 'bg-blue-50 text-primary'
                                                        : activeStep ===
                                                            'result'
                                                          ? 'bg-green-50 text-green-600'
                                                          : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {reviewActive
                                                    ? 'Tahap Aktif'
                                                    : activeStep === 'result'
                                                      ? 'Selesai'
                                                      : 'Menunggu'}
                                            </span>
                                            <h2 className="text-lg font-bold text-gray-800">
                                                Tahap 3: Menunggu Review
                                            </h2>
                                            <p className="mt-1 text-sm leading-relaxed text-gray-500">
                                                {hasProjectTasks
                                                    ? 'Tim reviewer akan memeriksa hasil quiz dan project yang sudah Anda kirim sebelum menentukan hasil akhir.'
                                                    : 'Tim reviewer akan memeriksa hasil quiz Anda sebelum menentukan hasil akhir.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="lg:sticky lg:top-24">
                            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(29,68,156,0.08)]">
                                <div className="mb-5 flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Lightbulb className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">
                                            Intelligence Brief
                                        </h2>
                                        <p className="text-xs font-medium text-gray-400">
                                            Mission Support Active
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {INTELLIGENCE_BRIEFS.map((brief) => {
                                        const Icon = brief.icon;

                                        return (
                                            <div
                                                key={brief.title}
                                                className="rounded-2xl border border-gray-100 bg-white p-4"
                                            >
                                                <div className="mb-2 flex items-center gap-2 text-primary">
                                                    <Icon className="h-4 w-4" />
                                                    <p className="text-sm font-semibold text-primary">
                                                        {brief.title}
                                                    </p>
                                                </div>
                                                <p className="text-xs leading-relaxed text-gray-500">
                                                    {brief.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <StartConfirmationModal 
                isOpen={isStartModalOpen}
                onClose={() => setIsStartModalOpen(false)}
                onConfirm={() => router.post(assessmentStart.url(application.id))}
            />
        </AppLayout>
    );
}
