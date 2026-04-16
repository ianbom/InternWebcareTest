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
    User,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

// ─── Option label helper ──────────────────────────────────────────────────────

function labelOf(idx: number): string {
    return String.fromCharCode(65 + idx); // A, B, C, D…
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
    const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>(() => {
        const init: Record<number, string> = {};
        essayQuestions.forEach((q) => {
            if (q.saved_answer) {
                init[q.id] = q.saved_answer;
            }
        });

        return init;
    });

    // ── Timer ─────────────────────────────────────────────────────────────
    const [secondsLeft, setSecondsLeft] = useState<number>(remainingSeconds);

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
    const answeredEssayCount = Object.keys(essayAnswers).filter((k) => essayAnswers[Number(k)]?.trim()).length;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasAutoSubmittedRef = useRef(false);

    // ── Submit ────────────────────────────────────────────────────────────
    const submitAssessment = useCallback(
        (requireConfirmation: boolean) => {
            if (isSubmitting) {
                return;
            }

            if (requireConfirmation && !confirm('Anda yakin ingin mengumpulkan? Jawaban tidak dapat diubah setelah submit.')) {
                return;
            }

            setIsSubmitting(true);

            router.post(
                `/assesment/${applicationId}/submit`,
                {
                    mcq_answers: mcqAnswers,
                    essay_answers: essayAnswers,
                },
                {
                    preserveScroll: false,
                    onFinish: () => setIsSubmitting(false),
                },
            );
        },
        [applicationId, essayAnswers, isSubmitting, mcqAnswers],
    );

    const handleSubmit = useCallback(() => {
        submitAssessment(true);
    }, [submitAssessment]);

    useEffect(() => {
        if (secondsLeft > 0 || hasAutoSubmittedRef.current) {
            return;
        }

        hasAutoSubmittedRef.current = true;
        setTimeout(() => submitAssessment(false), 0);
    }, [secondsLeft, submitAssessment]);

    // ── Left sidebar nav items ────────────────────────────────────────────
    const phases: { key: Phase; label: string; icon: typeof ClipboardList }[] = [
        { key: 'mcq', label: 'Phase 1: MCQ', icon: Grid2X2 },
        { key: 'essay', label: 'Phase 2: Essay', icon: FileText },
    ];

    return (
        <>
            <Head title={`${assessment.title} - Webcare Intern`} />

            <div className="flex h-screen flex-col overflow-hidden bg-[#EEF0F5]">

                {/* ── TOP BAR ──────────────────────────────────────────────── */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
                    {/* Brand */}
                    <span className="text-base font-bold text-primary">
                        {assessment.title}
                    </span>

                    {/* Timer */}
                    <div className="flex items-center gap-2 rounded-full bg-[#EEF0F5] px-4 py-1.5">
                        <Timer className="h-4 w-4 text-primary" />
                        <span
                            className={`font-mono text-base font-bold tracking-tight ${
                                secondsLeft < 300 ? 'text-red-500' : 'text-primary'
                            }`}
                        >
                            {secondsToDisplay(secondsLeft)}
                        </span>
                    </div>
                </header>

                {/* ── BODY (3-column) ──────────────────────────────────────── */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ── LEFT SIDEBAR ─────────────────────────── */}
                    <aside className="flex w-52 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white p-4">
                        <div>
                            <div className="mb-4">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                                            phase === key
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
                                <span className="text-xs font-bold">Mission Status</span>
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
                                            ((answeredMcqCount + answeredEssayCount) /
                                                Math.max(1, mcqQuestions.length + essayQuestions.length)) *
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
                                    <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        Question {mcqIndex + 1} of {mcqQuestions.length}
                                    </div>

                                    {/* Question text */}
                                    <h2 className="mb-6 text-2xl font-extrabold leading-snug text-gray-800">
                                        {currentMcq.question_text}
                                    </h2>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {(Array.isArray(currentMcq.options) ? currentMcq.options : []).map((opt, idx) => {
                                            const label = labelOf(idx);
                                            const selected = mcqAnswers[currentMcq.id] === label;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setMcqAnswers((prev) => ({
                                                            ...prev,
                                                            [currentMcq.id]: selected ? '' : label,
                                                        }))
                                                    }
                                                    className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-150 ${
                                                        selected
                                                            ? 'border-primary bg-white text-primary shadow-[0_0_0_1px_rgba(29,68,156,0.2)]'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-blue-50/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Radio circle */}
                                                        <div
                                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                                                selected
                                                                    ? 'border-primary bg-primary'
                                                                    : 'border-gray-300 bg-white'
                                                            }`}
                                                        >
                                                            {selected && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium">{opt}</span>
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
                                                if (mcqIndex > 0) setMcqIndex((i) => i - 1);
                                            }}
                                            disabled={mcqIndex === 0}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-500 transition-all hover:border-primary/30 hover:bg-gray-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (mcqIndex < mcqQuestions.length - 1) {
                                                    setMcqIndex((i) => i + 1);
                                                } else if (essayQuestions.length > 0) {
                                                    setPhase('essay');
                                                    setEssayIndex(0);
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/30 hover:bg-blue-50"
                                        >
                                            {mcqIndex < mcqQuestions.length - 1 ? 'Next' : 'Go to Essay Phase'}
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* MCQ: empty questions */}
                            {phase === 'mcq' && mcqQuestions.length === 0 && (
                                <div className="py-20 text-center">
                                    <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-400">Tidak ada soal pilihan ganda.</p>
                                </div>
                            )}

                            {/* ── ESSAY PHASE ────────────────────────────────── */}
                            {phase === 'essay' && currentEssay && (
                                <>
                                    <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        Essay {essayIndex + 1} of {essayQuestions.length}
                                    </div>

                                    <h2 className="mb-6 text-2xl font-extrabold leading-snug text-gray-800">
                                        {currentEssay.question_text}
                                    </h2>

                                    <div className="rounded-2xl border-2 border-gray-200 bg-white p-1 focus-within:border-primary transition-colors duration-150">
                                        <textarea
                                            value={essayAnswers[currentEssay.id] ?? ''}
                                            onChange={(e) =>
                                                setEssayAnswers((prev) => ({
                                                    ...prev,
                                                    [currentEssay.id]: e.target.value,
                                                }))
                                            }
                                            placeholder="Tulis jawaban essay Anda di sini..."
                                            rows={12}
                                            className="w-full resize-none rounded-xl bg-transparent p-4 text-sm leading-relaxed text-gray-700 placeholder-gray-300 outline-none"
                                        />
                                    </div>
                                    <p className="mt-2 text-right text-xs text-gray-400">
                                        {(essayAnswers[currentEssay.id] ?? '').length} karakter
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex items-center justify-between">
                                        <button
                                            onClick={() => {
                                                if (essayIndex > 0) {
                                                    setEssayIndex((i) => i - 1);
                                                } else if (mcqQuestions.length > 0) {
                                                    setPhase('mcq');
                                                    setMcqIndex(mcqQuestions.length - 1);
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-500 transition-all hover:border-primary/30 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (essayIndex < essayQuestions.length - 1) {
                                                    setEssayIndex((i) => i + 1);
                                                }
                                            }}
                                            disabled={essayIndex === essayQuestions.length - 1}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary/30 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {phase === 'essay' && essayQuestions.length === 0 && (
                                <div className="py-20 text-center">
                                    <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-400">Tidak ada soal essay.</p>
                                </div>
                            )}
                        </div>

                        {/* ── BOTTOM BAR ──────────────────────────────────── */}
                        <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-8 py-3">

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Assesment'}
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </main>

                    {/* ── RIGHT SIDEBAR: Question Map ───────────── */}
                    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white p-4">
                        <div className="mb-3">
                            <h2 className="text-[15px] font-extrabold text-primary">Question Map</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
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
                                        const isCurrent = phase === 'mcq' && i === mcqIndex;

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
 setPhase('mcq'); setMcqIndex(i); 
}}
                                                className={`flex h-7 w-full items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 ${
                                                    isCurrent
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
                                        const answered = !!essayAnswers[q.id]?.trim();
                                        const isCurrent = phase === 'essay' && i === essayIndex;

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => {
 setPhase('essay'); setEssayIndex(i); 
}}
                                                className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                                                    isCurrent
                                                        ? 'border-primary bg-blue-50 text-primary'
                                                        : answered
                                                        ? 'border-green-200 bg-green-50 text-green-700'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-primary/40 hover:text-primary'
                                                }`}
                                            >
                                                <span>TASK {String(i + 1).padStart(2, '0')}</span>
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
                                                TASK {String(i + 1).padStart(2, '0')}
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
