import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    FileText,
    Grid2X2,
    Lock,
    Send,
    Timer,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { submit as submitAssessmentRoute, warn as warnAssessmentRoute } from '@/routes/assessments';

// ─── Types ────────────────────────────────────────────────────────────────────

interface McqQuestion {
    id: number;
    type: 'multiple_choice';
    question_text: string;
    options: string[];
    order_index: number;
    saved_answer: string | null;
}

interface EssayQuestion {
    id: number;
    type: 'essay';
    question_text: string;
    options: [];
    order_index: number;
    saved_answer: string | null;
}

interface ProjectTask {
    id: number;
    title: string;
    description: string;
    deadline_hours: number;
}

interface Props {
    applicationId: number;
    status: string;
    expiresAt: string | null;
    remainingSeconds: number;
    position: { id: number; title: string };
    assessment: { id: number; title: string; duration_minutes: number };
    mcqQuestions: McqQuestion[];
    essayQuestions: EssayQuestion[];
    projectTasks: ProjectTask[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function secondsToDisplay(seconds: number): string {
    const m = Math.floor(Math.max(0, seconds) / 60)
        .toString()
        .padStart(2, '0');
    const s = (Math.max(0, seconds) % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
}

// ─── Phase types ──────────────────────────────────────────────────────────────

type Phase = 'mcq' | 'essay';

const SECURITY_ALERT =
    'Peringatan: aktivitas di luar halaman assessment terdeteksi. Tetap berada di halaman ini selama assessment berlangsung.';
const BLOCKED_ACTION_MESSAGE =
    'Aksi ini dinonaktifkan selama assessment untuk menjaga integritas pengerjaan.';
const REFRESH_WARNING_MESSAGE =
    'Jika halaman direfresh, jawaban Anda akan langsung dikumpulkan dan assessment dianggap selesai.';

// ─── Option label helper ──────────────────────────────────────────────────────

function labelOf(idx: number): string {
    return String.fromCharCode(65 + idx); // A, B, C, D…
}

function getCsrfToken(): string {
    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function shouldBlockShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();
    const withModifier = event.ctrlKey || event.metaKey;

    return (
        key === 'f12' ||
        key === 'printscreen' ||
        (withModifier && ['a', 'c', 'p', 's', 'u', 'v', 'x'].includes(key)) ||
        (event.ctrlKey && event.shiftKey && ['c', 'i', 'j'].includes(key))
    );
}

function isRefreshShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();

    return key === 'f5' || ((event.ctrlKey || event.metaKey) && key === 'r');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TakeAssesment({
    applicationId,
    assessment,
    remainingSeconds,
    mcqQuestions,
    essayQuestions,
    projectTasks,
}: Props) {
    // ── Phase & question cursor ───────────────────────────────────────────
    const [phase, setPhase] = useState<Phase>('mcq');
    const [mcqIndex, setMcqIndex] = useState(0);
    const [essayIndex, setEssayIndex] = useState(0);

    // ── Answer state ──────────────────────────────────────────────────────

    /** mcqAnswers[questionId] = label like "A" */
    const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>(() => {
        const init: Record<number, string> = {};
        mcqQuestions.forEach((q) => {
            if (q.saved_answer) {
                init[q.id] = q.saved_answer;
            }
        });

        return init;
    });

    /** essayAnswers[questionId] = essay text */
    const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>(
        () => {
            const init: Record<number, string> = {};
            essayQuestions.forEach((q) => {
                if (q.saved_answer) {
                    init[q.id] = q.saved_answer;
                }
            });

            return init;
        },
    );

    // ── Timer ─────────────────────────────────────────────────────────────
    const [secondsLeft, setSecondsLeft] = useState<number>(remainingSeconds);
    const [securityWarning, setSecurityWarning] = useState<string | null>(null);
    const [securityWarningCount, setSecurityWarningCount] = useState(0);
    const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
    const [isSubmitConfirmModalOpen, setIsSubmitConfirmModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const mcqAnswersRef = useRef(mcqAnswers);
    const essayAnswersRef = useRef(essayAnswers);
    const submittedRef = useRef(false);
    const unloadSubmittedRef = useRef(false);

    useEffect(() => {
        mcqAnswersRef.current = mcqAnswers;
    }, [mcqAnswers]);

    useEffect(() => {
        essayAnswersRef.current = essayAnswers;
    }, [essayAnswers]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);

        return () => clearInterval(id);
    }, [secondsLeft]);

    // ── Derived ───────────────────────────────────────────────────────────
    const currentMcq = mcqQuestions[mcqIndex] ?? null;
    const currentEssay = essayQuestions[essayIndex] ?? null;
    const answeredMcqCount = Object.keys(mcqAnswers).length;
    const answeredEssayCount = Object.keys(essayAnswers).filter((k) =>
        essayAnswers[Number(k)]?.trim(),
    ).length;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasAutoSubmittedRef = useRef(false);

    const submitUrl = submitAssessmentRoute.url(applicationId);

    const showSecurityWarning = useCallback((message: string) => {
        setSecurityWarning(message);
        setSecurityWarningCount((count) => count + 1);
    }, []);

    /** Fire-and-forget: record the violation in the backend (non-blocking). */
    const sendWarning = useCallback(
        (action: string, description?: string) => {
            if (submittedRef.current) return;

            const warnUrl = warnAssessmentRoute.url(applicationId);
            const csrfToken = getCsrfToken();

            void fetch(warnUrl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ action, description: description ?? null }),
            }).catch(() => {
                // Silently ignore network errors; warnings are best-effort.
            });
        },
        [applicationId],
    );

    const buildSubmitFormData = useCallback(() => {
        const formData = new FormData();
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            formData.append('_token', csrfToken);
        }

        Object.entries(mcqAnswersRef.current).forEach(
            ([questionId, answer]) => {
                formData.append(`mcq_answers[${questionId}]`, answer);
            },
        );

        Object.entries(essayAnswersRef.current).forEach(
            ([questionId, answer]) => {
                formData.append(`essay_answers[${questionId}]`, answer);
            },
        );

        return formData;
    }, []);

    const submitDuringUnload = useCallback(() => {
        if (submittedRef.current || unloadSubmittedRef.current) {
            return;
        }

        unloadSubmittedRef.current = true;
        submittedRef.current = true;

        const formData = buildSubmitFormData();

        if (navigator.sendBeacon?.(submitUrl, formData)) {
            return;
        }

        void fetch(submitUrl, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            keepalive: true,
            headers: {
                Accept: 'text/html, application/xhtml+xml',
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
        }).catch(() => {
            // Browser unload requests are best-effort; the server-side status guard handles duplicates.
        });
    }, [buildSubmitFormData, submitUrl]);

    // ── Submit ────────────────────────────────────────────────────────────
    const submitAssessment = useCallback(
        (requireConfirmation: boolean) => {
            if (isSubmitting || submittedRef.current) {
                return;
            }

            if (requireConfirmation) {
                setIsSubmitConfirmModalOpen(true);
                return;
            }

            submittedRef.current = true;
            setIsSubmitting(true);

            router.post(
                submitUrl,
                {
                    mcq_answers: mcqAnswers,
                    essay_answers: essayAnswers,
                },
                {
                    preserveScroll: false,
                    onError: () => {
                        submittedRef.current = false;
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        },
        [essayAnswers, isSubmitting, mcqAnswers, submitUrl],
    );

    const handleSubmit = useCallback(() => {
        submitAssessment(true);
    }, [submitAssessment]);

    const requestRefreshSubmit = useCallback(() => {
        showSecurityWarning(REFRESH_WARNING_MESSAGE);
        setIsRefreshModalOpen(true);
    }, [showSecurityWarning]);

    const cancelRefreshSubmit = useCallback(() => {
        setIsRefreshModalOpen(false);
    }, []);

    const confirmRefreshSubmit = useCallback(() => {
        setIsRefreshModalOpen(false);
        submitAssessment(false);
    }, [submitAssessment]);

    useEffect(() => {
        if (secondsLeft > 0 || hasAutoSubmittedRef.current) {
            return;
        }

        hasAutoSubmittedRef.current = true;
        setTimeout(() => submitAssessment(false), 0);
    }, [secondsLeft, submitAssessment]);

    useEffect(() => {
        const blockAction = (event: Event) => {
            event.preventDefault();
            const actionType = event.type; // 'copy', 'cut', 'paste', 'contextmenu', 'dragstart'
            showSecurityWarning(BLOCKED_ACTION_MESSAGE);
            sendWarning(actionType, BLOCKED_ACTION_MESSAGE);
        };
        const blockKeyboardShortcut = (event: KeyboardEvent) => {
            if (isRefreshShortcut(event)) {
                event.preventDefault();
                requestRefreshSubmit();
                sendWarning('refresh_attempt', `Keyboard shortcut: ${event.key}`);

                return;
            }

            if (!shouldBlockShortcut(event)) {
                return;
            }

            event.preventDefault();
            showSecurityWarning(BLOCKED_ACTION_MESSAGE);
            sendWarning('blocked_shortcut', `Key: ${event.key}`);

            if (event.key.toLowerCase() === 'printscreen') {
                void navigator.clipboard?.writeText('');
            }
        };
        const warnOnVisibilityChange = () => {
            if (document.hidden) {
                showSecurityWarning(SECURITY_ALERT);
                setIsSecurityModalOpen(true);
                sendWarning('tab_switch', 'Kandidat berpindah tab atau meminimalkan browser.');
            }
        };
        const submitOnPageHide = () => submitDuringUnload();
        const warnOnBeforeUnload = (event: BeforeUnloadEvent) => {
            if (submittedRef.current) {
                return;
            }

            event.preventDefault();
            event.returnValue = REFRESH_WARNING_MESSAGE;
        };

        document.addEventListener('copy', blockAction);
        document.addEventListener('cut', blockAction);
        document.addEventListener('paste', blockAction);
        document.addEventListener('contextmenu', blockAction);
        document.addEventListener('dragstart', blockAction);
        document.addEventListener('keydown', blockKeyboardShortcut);
        document.addEventListener('visibilitychange', warnOnVisibilityChange);
        window.addEventListener('pagehide', submitOnPageHide);
        window.addEventListener('beforeunload', warnOnBeforeUnload);

        return () => {
            document.removeEventListener('copy', blockAction);
            document.removeEventListener('cut', blockAction);
            document.removeEventListener('paste', blockAction);
            document.removeEventListener('contextmenu', blockAction);
            document.removeEventListener('dragstart', blockAction);
            document.removeEventListener('keydown', blockKeyboardShortcut);
            document.removeEventListener(
                'visibilitychange',
                warnOnVisibilityChange,
            );
            window.removeEventListener('pagehide', submitOnPageHide);
            window.removeEventListener('beforeunload', warnOnBeforeUnload);
        };
    }, [requestRefreshSubmit, sendWarning, showSecurityWarning, submitDuringUnload]);

    // ── Left sidebar nav items ────────────────────────────────────────────
    const phases: { key: Phase; label: string; icon: typeof ClipboardList }[] =
        [
            { key: 'mcq', label: 'Phase 1: MCQ', icon: Grid2X2 },
            { key: 'essay', label: 'Phase 2: Essay', icon: FileText },
        ];

    return (
        <>
            <Head title={`${assessment.title} - Webcare Intern`} />

            <div className="flex h-screen flex-col overflow-hidden bg-[#EEF0F5] select-none">
                {/* ── TOP BAR ──────────────────────────────────────────────── */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
                    {/* Brand */}
                    <span className="text-base font-bold text-primary">
                        {assessment.title}
                    </span>

                    {/* Timer */}
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                            Strict Mode Aktif
                            {securityWarningCount > 0 &&
                                ` · ${securityWarningCount} warning`}
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-[#EEF0F5] px-4 py-1.5">
                            <Timer className="h-4 w-4 text-primary" />
                            <span
                                className={`font-mono text-base font-bold tracking-tight ${secondsLeft < 300
                                        ? 'text-red-500'
                                        : 'text-primary'
                                    }`}
                            >
                                {secondsToDisplay(secondsLeft)}
                            </span>
                        </div>
                    </div>
                </header>

                {securityWarning && (
                    <div className="border-b border-red-200 bg-red-50 px-6 py-2 text-center text-sm font-semibold text-red-700">
                        {securityWarning}
                    </div>
                )}

                {isRefreshModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="refresh-warning-title"
                    >
                        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <Timer className="h-6 w-6" />
                            </div>
                            <h2
                                id="refresh-warning-title"
                                className="text-2xl font-black tracking-tight text-slate-900"
                            >
                                Refresh akan submit jawaban
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {REFRESH_WARNING_MESSAGE} Jika belum yakin,
                                pilih batal dan lanjutkan pengerjaan tanpa
                                merefresh halaman.
                            </p>
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={cancelRefreshSubmit}
                                    className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmRefreshSubmit}
                                    disabled={isSubmitting}
                                    className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? 'Mengirim...'
                                        : 'Submit Jawaban'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isSubmitConfirmModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="submit-confirm-title"
                    >
                        <div className="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                                <Send className="h-6 w-6" />
                            </div>
                            <h2
                                id="submit-confirm-title"
                                className="text-2xl font-black tracking-tight text-slate-900"
                            >
                                Submit Jawaban
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                Anda yakin ingin mengumpulkan? Jawaban tidak dapat diubah setelah submit.
                            </p>
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsSubmitConfirmModalOpen(false)}
                                    className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubmitConfirmModalOpen(false);
                                        submitAssessment(false);
                                    }}
                                    disabled={isSubmitting}
                                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Mengirim...' : 'Ya, Kumpulkan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isSecurityModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="security-alert-title"
                    >
                        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2
                                id="security-alert-title"
                                className="text-2xl font-black tracking-tight text-slate-900"
                            >
                                Peringatan Keamanan
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {SECURITY_ALERT}
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsSecurityModalOpen(false)}
                                    className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
                                >
                                    Mengerti
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── BODY (3-column) ──────────────────────────────────────── */}
                <div className="flex flex-1 overflow-hidden">
                    {/* ── LEFT SIDEBAR ─────────────────────────── */}
                    <aside className="flex w-52 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white p-4">
                        <div>
                            <div className="mb-4">
                                <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                    Mission Control
                                </p>
                                <h2 className="mt-0.5 text-[15px] font-extrabold text-primary">
                                    Assessment Brief
                                </h2>
                            </div>

                            <nav className="space-y-1.5">
                                {phases.map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setPhase(key)}
                                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${phase === key
                                                ? 'border-l-[3px] border-primary bg-blue-50 text-primary'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Mission Status */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-primary">
                                <Timer className="h-3.5 w-3.5" />
                                <span className="text-xs font-bold">
                                    Mission Status
                                </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-primary/70">
                                Critical Thinking Module Active
                            </p>
                            {/* Progress bar */}
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-blue-100">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${Math.round(
                                            ((answeredMcqCount +
                                                answeredEssayCount) /
                                                Math.max(
                                                    1,
                                                    mcqQuestions.length +
                                                    essayQuestions.length,
                                                )) *
                                            100,
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN CONTENT ──────────────────────────── */}
                    <main className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-8">
                            {/* ── MCQ PHASE ─────────────────────────────────── */}
                            {phase === 'mcq' && currentMcq && (
                                <>
                                    {/* Progress label */}
                                    <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                                        Question {mcqIndex + 1} of{' '}
                                        {mcqQuestions.length}
                                    </div>

                                    {/* Question text */}
                                    <h2 className="mb-6 text-2xl leading-snug font-extrabold text-gray-800">
                                        {currentMcq.question_text}
                                    </h2>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {(Array.isArray(currentMcq.options)
                                            ? currentMcq.options
                                            : []
                                        ).map((opt, idx) => {
                                            const label = labelOf(idx);
                                            const selected =
                                                mcqAnswers[currentMcq.id] ===
                                                label;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setMcqAnswers(
                                                            (prev) => ({
                                                                ...prev,
                                                                [currentMcq.id]:
                                                                    selected
                                                                        ? ''
                                                                        : label,
                                                            }),
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-150 ${selected
                                                            ? 'border-primary bg-white text-primary shadow-[0_0_0_1px_rgba(29,68,156,0.2)]'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-blue-50/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Radio circle */}
                                                        <div
                                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected
                                                                    ? 'border-primary bg-primary'
                                                                    : 'border-gray-300 bg-white'
                                                                }`}
                                                        >
                                                            {selected && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium">
                                                            {opt}
                                                        </span>
                                                    </div>
                                                    {selected && (
                                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex items-center justify-between">
                                        <button
                                            onClick={() => {
                                                if (mcqIndex > 0) {
                                                    setMcqIndex((i) => i - 1);
                                                }
                                            }}
                                            disabled={mcqIndex === 0}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-500 transition-all hover:border-primary/30 hover:bg-gray-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    mcqIndex <
                                                    mcqQuestions.length - 1
                                                ) {
                                                    setMcqIndex((i) => i + 1);
                                                } else if (
                                                    essayQuestions.length > 0
                                                ) {
                                                    setPhase('essay');
                                                    setEssayIndex(0);
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/30 hover:bg-blue-50"
                                        >
                                            {mcqIndex < mcqQuestions.length - 1
                                                ? 'Next'
                                                : 'Go to Essay Phase'}
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* MCQ: empty questions */}
                            {phase === 'mcq' && mcqQuestions.length === 0 && (
                                <div className="py-20 text-center">
                                    <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-400">
                                        Tidak ada soal pilihan ganda.
                                    </p>
                                </div>
                            )}

                            {/* ── ESSAY PHASE ────────────────────────────────── */}
                            {phase === 'essay' && currentEssay && (
                                <>
                                    <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                                        Essay {essayIndex + 1} of{' '}
                                        {essayQuestions.length}
                                    </div>

                                    <h2 className="mb-6 text-2xl leading-snug font-extrabold text-gray-800">
                                        {currentEssay.question_text}
                                    </h2>

                                    <div className="rounded-2xl border-2 border-gray-200 bg-white p-1 transition-colors duration-150 focus-within:border-primary">
                                        <textarea
                                            value={
                                                essayAnswers[currentEssay.id] ??
                                                ''
                                            }
                                            onChange={(e) =>
                                                setEssayAnswers((prev) => ({
                                                    ...prev,
                                                    [currentEssay.id]:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Tulis jawaban essay Anda di sini..."
                                            rows={12}
                                            className="w-full resize-none rounded-xl bg-transparent p-4 text-sm leading-relaxed text-gray-700 placeholder-gray-300 outline-none select-text"
                                        />
                                    </div>
                                    <p className="mt-2 text-right text-xs text-gray-400">
                                        {
                                            (
                                                essayAnswers[currentEssay.id] ??
                                                ''
                                            ).length
                                        }{' '}
                                        karakter
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex items-center justify-between">
                                        <button
                                            onClick={() => {
                                                if (essayIndex > 0) {
                                                    setEssayIndex((i) => i - 1);
                                                } else if (
                                                    mcqQuestions.length > 0
                                                ) {
                                                    setPhase('mcq');
                                                    setMcqIndex(
                                                        mcqQuestions.length - 1,
                                                    );
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-500 transition-all hover:border-primary/30 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    essayIndex <
                                                    essayQuestions.length - 1
                                                ) {
                                                    setEssayIndex((i) => i + 1);
                                                }
                                            }}
                                            disabled={
                                                essayIndex ===
                                                essayQuestions.length - 1
                                            }
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/30 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {phase === 'essay' &&
                                essayQuestions.length === 0 && (
                                    <div className="py-20 text-center">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                        <p className="text-gray-400">
                                            Tidak ada soal essay.
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* ── BOTTOM BAR ──────────────────────────────────── */}
                        <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-8 py-3">
                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
                            >
                                {isSubmitting
                                    ? 'Submitting...'
                                    : 'Submit Assesment'}
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </main>

                    {/* ── RIGHT SIDEBAR: Question Map ───────────── */}
                    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white p-4">
                        <div className="mb-3">
                            <h2 className="text-[15px] font-extrabold text-primary">
                                Question Map
                            </h2>
                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                Navigation Terminal
                            </p>
                        </div>

                        {/* MCQ grid */}
                        {mcqQuestions.length > 0 && (
                            <div className="mb-4">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                    <Grid2X2 className="h-3.5 w-3.5" />
                                    Pilihan Ganda
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {mcqQuestions.map((q, i) => {
                                        const answered = !!mcqAnswers[q.id];
                                        const isCurrent =
                                            phase === 'mcq' && i === mcqIndex;

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setPhase('mcq');
                                                    setMcqIndex(i);
                                                }}
                                                className={`flex h-7 w-full items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 ${isCurrent
                                                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-1'
                                                        : answered
                                                            ? 'bg-primary/80 text-white'
                                                            : 'border border-gray-200 bg-gray-50 text-gray-500 hover:border-primary/50 hover:text-primary'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Essay list */}
                        {essayQuestions.length > 0 && (
                            <div className="mb-4">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                    <FileText className="h-3.5 w-3.5" />
                                    Essay
                                </div>
                                <div className="space-y-1.5">
                                    {essayQuestions.map((q, i) => {
                                        const answered =
                                            !!essayAnswers[q.id]?.trim();
                                        const isCurrent =
                                            phase === 'essay' &&
                                            i === essayIndex;

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setPhase('essay');
                                                    setEssayIndex(i);
                                                }}
                                                className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 ${isCurrent
                                                        ? 'border-primary bg-blue-50 text-primary'
                                                        : answered
                                                            ? 'border-green-200 bg-green-50 text-green-700'
                                                            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-primary/40 hover:text-primary'
                                                    }`}
                                            >
                                                <span>
                                                    TASK{' '}
                                                    {String(i + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                                {answered ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                ) : (
                                                    <Lock className="h-3 w-3 text-gray-300" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Project tasks (read-only reference) */}
                        {projectTasks.length > 0 && (
                            <div>
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                    <ArrowLeft className="h-3.5 w-3.5 rotate-90 transform" />
                                    Project Tasks
                                </div>
                                <div className="space-y-1.5">
                                    {projectTasks.map((t, i) => (
                                        <div
                                            key={t.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-400"
                                        >
                                            <span className="font-semibold">
                                                TASK{' '}
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <Lock className="h-3 w-3" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="mt-auto pt-4">
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                                    Finished
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-full bg-gray-200" />
                                    Remaining
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
