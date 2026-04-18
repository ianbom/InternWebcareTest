import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Check,
    Eye,
    Flag,
    Lightbulb,
    Sparkles,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { index as positionsIndex } from '@/routes/positions';

type StepKey = 'profile' | 'quiz' | 'project' | 'review' | 'result';
type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

interface CandidateData {
    name: string;
    email: string;
    phone: string | null;
    cv: {
        name: string;
        url: string;
    } | null;
    profileCompletion: number;
    hasCv: boolean;
    avatarInitials: string;
}

interface ApplicationData {
    positionTitle: string;
    appliedAt: string | null;
    status: string;
    statusLabel: string;
    statusTone: StatusTone;
    activeStep: StepKey;
    hasProjectTasks: boolean;
    areProjectSubmissionsComplete: boolean;
    headline: string;
    nextActionLabel: string | null;
    nextActionUrl: string | null;
    nextActionMethod: 'get' | 'post' | null;
    canOpenAssessment: boolean;
    guidance: string;
}

interface Props {
    candidate: CandidateData;
    application: ApplicationData | null;
}

const STEP_ITEMS = [
    { key: 'profile', label: 'Data Diri', icon: Check },
    { key: 'quiz', label: 'Quiz', icon: Sparkles },
    { key: 'project', label: 'Proyek', icon: Lightbulb },
    { key: 'review', label: 'Review', icon: Eye },
    { key: 'result', label: 'Hasil Akhir', icon: Flag },
] as const;

const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    info: 'bg-blue-50 text-blue-700',
    warning: 'bg-amber-50 text-amber-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-rose-50 text-rose-700',
};

const STATUS_PANEL_CLASSES: Record<StatusTone, string> = {
    neutral: 'bg-slate-50 text-slate-700',
    info: 'bg-blue-50 text-blue-800',
    warning: 'bg-amber-50 text-amber-800',
    success: 'bg-emerald-50 text-emerald-800',
    danger: 'bg-rose-50 text-rose-800',
};

function getStepState(
    stepKey: StepKey,
    activeStep: StepKey,
    hasProjectTasks: boolean,
): 'done' | 'active' | 'pending' | 'skipped' {
    if (stepKey === 'project' && !hasProjectTasks) {
        return 'skipped';
    }

    const stepOrder: StepKey[] = [
        'profile',
        'quiz',
        'project',
        'review',
        'result',
    ];
    const currentIndex = stepOrder.indexOf(activeStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) {
        return 'done';
    }

    if (stepIndex === currentIndex) {
        return 'active';
    }

    return 'pending';
}

function buildCvAlertMessage(hasCv: boolean): string {
    if (hasCv) {
        return 'CV Anda sudah terunggah. Pastikan selalu update versi terbaru.';
    }

    return 'Harap unggah CV Anda terlebih dahulu. Pastikan menggunakan CV terbaru';
}

export default function Dashboard({ candidate, application }: Props) {
    const activeStep = application?.activeStep ?? 'profile';
    const showActiveApplication = Boolean(application);
    const actionMethod = application?.nextActionMethod ?? 'get';
    const hasProjectTasks = application?.hasProjectTasks ?? false;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] shadow-[0_10px_28px_rgba(15,62,148,0.25)]">
                            <div className="grid min-h-[170px] md:grid-cols-[minmax(0,1fr)_154px]">
                                <div className="p-7">
                                    <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                                        Selamat Datang, {candidate.name}!
                                    </h1>
                                    <p className="mt-4 max-w-md text-lg leading-relaxed text-blue-100">
                                        Satu langkah lagi menuju karir impianmu.
                                        Mari selesaikan assessment hari ini.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-6 shadow-[0_8px_24px_rgba(19,41,89,0.08)]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-4xl font-bold tracking-tight text-[#0F1E46]">
                                        Status Lamaran Anda
                                    </h2>
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#65708C]">
                                        <span className="rounded-full bg-[#E8F0FF] px-3 py-1 text-xs font-bold tracking-wide text-[#0E3F97]">
                                            {showActiveApplication
                                                ? 'ACTIVE APPLICATION'
                                                : 'BELUM ADA LAMARAN'}
                                        </span>
                                        {application?.statusLabel && (
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                                                    STATUS_TONE_CLASSES[
                                                        application.statusTone
                                                    ]
                                                }`}
                                            >
                                                {application.statusLabel}
                                            </span>
                                        )}
                                        {application?.appliedAt && (
                                            <span>&bull;</span>
                                        )}
                                        {application?.appliedAt && (
                                            <span>
                                                Dilamar pada{' '}
                                                {application.appliedAt}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-sm font-medium text-[#65708C]">
                                        Posisi
                                    </p>
                                    <p className="text-3xl font-bold text-[#0E3F97]">
                                        {application?.positionTitle ??
                                            'Belum memilih posisi'}
                                    </p>
                                </div>
                            </div>

                            <div className="relative mt-8">
                                <div className="absolute top-5 right-6 left-6 h-0.5 bg-[#DCE2EE]" />

                                <div className="relative grid grid-cols-5 gap-3">
                                    {STEP_ITEMS.map((step) => {
                                        const Icon = step.icon;
                                        const state = getStepState(
                                            step.key,
                                            activeStep,
                                            hasProjectTasks,
                                        );

                                        return (
                                            <div
                                                key={step.key}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                                        state === 'done'
                                                            ? 'border-[#0E3F97] bg-[#0E3F97] text-white'
                                                            : state === 'active'
                                                              ? 'border-[#78A0FF] bg-[#78A0FF] text-white shadow-[0_0_0_4px_rgba(120,160,255,0.25)]'
                                                              : state ===
                                                                  'skipped'
                                                                ? 'border-dashed border-[#DCE2EE] bg-white text-[#A6AFC2]'
                                                                : 'border-[#DCE2EE] bg-[#F1F4FA] text-[#A6AFC2]'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <p
                                                    className={`text-xs font-semibold ${
                                                        state === 'pending' ||
                                                        state === 'skipped'
                                                            ? 'text-[#8A94AA]'
                                                            : 'text-[#0E3F97]'
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>
                                                {state === 'skipped' && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                                        Dilewati
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div
                                className={`mt-8 rounded-2xl p-8 text-center ${
                                    application
                                        ? STATUS_PANEL_CLASSES[
                                              application.statusTone
                                          ]
                                        : 'bg-[#F3F5FB] text-[#3F4A63]'
                                }`}
                            >
                                <h3 className="text-2xl font-black text-[#0F1E46]">
                                    {application?.headline ??
                                        'Belum ada lamaran aktif'}
                                </h3>
                                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed">
                                    {application?.guidance ??
                                        'Anda belum memiliki lamaran aktif. Silakan pilih posisi terlebih dahulu untuk memulai assessment.'}
                                </p>

                                {application?.nextActionUrl &&
                                application.nextActionLabel ? (
                                    <Link
                                        href={application.nextActionUrl}
                                        method={actionMethod}
                                        as={
                                            actionMethod === 'post'
                                                ? 'button'
                                                : 'a'
                                        }
                                        className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-[#0E3F97] px-8 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,63,151,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#0B3682]"
                                    >
                                        {application.nextActionLabel}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : !application ? (
                                    <Link
                                        href={positionsIndex.url()}
                                        className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-[#0E3F97] px-8 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,63,151,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#0B3682]"
                                    >
                                        Pilih Posisi Sekarang
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <p className="mt-6 text-sm font-bold text-[#0F1E46]">
                                        Status final sudah tersedia. Tidak ada
                                        assessment aktif yang perlu dikerjakan.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-[#F3CC8B] bg-[#FFF6E8] p-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E2951A]" />
                                <p className="text-xs leading-relaxed font-semibold text-[#8A5A0A]">
                                    {buildCvAlertMessage(candidate.hasCv)}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(19,41,89,0.08)]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEF9] text-xs font-bold text-[#0E3F97]">
                                    {candidate.avatarInitials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-[#0F1E46]">
                                        Profile Completion
                                    </p>
                                    <p className="text-xs font-semibold text-[#2A8C4A]">
                                        {candidate.profileCompletion}% Complete
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-[#E3E8F2]">
                                <div
                                    className="h-1.5 rounded-full bg-[#0E3F97]"
                                    style={{
                                        width: `${candidate.profileCompletion}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(19,41,89,0.08)]">
                            <p className="text-xs font-bold tracking-wide text-[#7A849B]">
                                DATA USER
                            </p>
                            <div className="mt-3 space-y-3 text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#7A849B]">
                                        Name
                                    </p>
                                    <p className="font-medium text-[#0F1E46]">
                                        {candidate.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#7A849B]">
                                        Email
                                    </p>
                                    <p className="font-medium break-all text-[#0F1E46]">
                                        {candidate.email}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#7A849B]">
                                        Phone
                                    </p>
                                    <p className="font-medium text-[#0F1E46]">
                                        {candidate.phone ?? '-'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[#7A849B]">
                                        CV
                                    </p>
                                    {candidate.cv ? (
                                        <a
                                            href={candidate.cv.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium break-all text-[#0E3F97] underline decoration-[#C3D2F7] underline-offset-4 transition-colors hover:text-[#0B3682]"
                                        >
                                            Lihat CV
                                        </a>
                                    ) : (
                                        <p className="font-medium text-[#0F1E46]">
                                            Belum upload CV
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(19,41,89,0.08)]">
                            <div className="mb-3 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-[#0E3F97]" />
                                <p className="text-xs font-bold tracking-wide text-[#7A849B]">
                                    TIPS ASSESSMENT
                                </p>
                            </div>
                            <div className="rounded-2xl bg-[#4B4F63] p-3 text-xs leading-relaxed text-white/95">
                                “Pelajari kembali struktur data dan algoritma
                                dasar untuk posisi Web Developer. Kebanyakan
                                soal akan menguji logika dasar JavaScript.”
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
