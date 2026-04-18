import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ClipboardCheck,
    FileArchive,
    FileText,
    MessageSquareText,
    Save,
    ShieldCheck,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { index } from '@/routes/applications';
import { update } from '@/routes/applications/review';
import type {
    AdminApplicationDetail,
    AdminApplicationStatus,
    AdminAssessmentSummary,
    AdminCandidateDetail,
    AdminEssayAnswer,
    AdminMcqAnswer,
    AdminPositionSummary,
    AdminProjectSubmission,
    AdminReviewStatus,
    AdminAssessmentWarning,
    EssayReviewInput,
    ProjectReviewInput,
} from '@/types';

type ReviewFormData = {
    status: AdminReviewStatus;
    admin_notes: string;
    essay_reviews: EssayReviewInput[];
    project_reviews: ProjectReviewInput[];
};

type Props = {
    application: AdminApplicationDetail;
    candidate: AdminCandidateDetail;
    position: AdminPositionSummary;
    assessment: AdminAssessmentSummary;
    mcq_answers: AdminMcqAnswer[];
    essay_answers: AdminEssayAnswer[];
    project_submissions: AdminProjectSubmission[];
    warnings: AdminAssessmentWarning[];
};

const STATUS_LABELS: Record<AdminApplicationStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
};

const REVIEW_STATUSES: AdminReviewStatus[] = [
    'under_review',
    'approved',
    'rejected',
];

const STATUS_CLASSES: Record<AdminApplicationStatus, string> = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-50 text-blue-700',
    submitted: 'bg-amber-50 text-amber-700',
    under_review: 'bg-indigo-50 text-indigo-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-rose-50 text-rose-700',
};

function formatDateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function getInitialReviewStatus(status: AdminApplicationStatus): AdminReviewStatus {
    return REVIEW_STATUSES.includes(status as AdminReviewStatus)
        ? (status as AdminReviewStatus)
        : 'under_review';
}

function currentQuery(): Record<string, string> {
    if (typeof window === 'undefined') {
        return {};
    }

    return Object.fromEntries(new URLSearchParams(window.location.search));
}

function getError(
    errors: Partial<Record<keyof ReviewFormData, string>>,
    key: string,
): string | undefined {
    return (errors as Record<string, string | undefined>)[key];
}

export default function ApplicationsShow({
    application,
    candidate,
    position,
    assessment,
    mcq_answers,
    essay_answers,
    project_submissions,
    warnings,
}: Props) {
    const page = usePage();
    const listQuery = currentQuery();
    const backHref = index.url({ query: listQuery });
    const { data, setData, put, processing, errors } = useForm<ReviewFormData>({
        status: getInitialReviewStatus(application.status),
        admin_notes: application.admin_notes ?? '',
        essay_reviews: essay_answers.map((answer) => ({
            answer_id: answer.answer_id,
            score: answer.score,
        })),
        project_reviews: project_submissions.map((submission) => ({
            project_submission_id: submission.submission_id,
            score: submission.score,
            score_notes: submission.score_notes,
        })),
    });

    const setEssayScore = (answerId: number, score: string) => {
        setData(
            'essay_reviews',
            data.essay_reviews.map((review) =>
                review.answer_id === answerId
                    ? {
                          ...review,
                          score: score === '' ? null : Number(score),
                      }
                    : review,
            ),
        );
    };

    const setProjectScore = (submissionId: number, score: string) => {
        setData(
            'project_reviews',
            data.project_reviews.map((review) =>
                review.project_submission_id === submissionId
                    ? {
                          ...review,
                          score: score === '' ? null : Number(score),
                      }
                    : review,
            ),
        );
    };

    const setProjectNotes = (submissionId: number, scoreNotes: string) => {
        setData(
            'project_reviews',
            data.project_reviews.map((review) =>
                review.project_submission_id === submissionId
                    ? {
                          ...review,
                          score_notes: scoreNotes,
                      }
                    : review,
            ),
        );
    };

    const submitReview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(update.url(application.id, { query: listQuery }), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Application - ${candidate.name ?? 'Candidate'}`} />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 rounded-full border border-[#DCE3F2] bg-white px-4 py-2 text-sm font-bold text-[#102B5C] transition hover:bg-[#F7F9FD]"
                        >
                            <ArrowLeft className="size-4" />
                            Back to list
                        </Link>
                        <span
                            className={`rounded-full px-4 py-2 text-sm font-bold ${STATUS_CLASSES[application.status]}`}
                        >
                            {STATUS_LABELS[application.status]}
                        </span>
                    </div>

                    <section className="overflow-hidden rounded-[28px] bg-[#102B5C] text-white shadow-[0_24px_70px_rgba(16,43,92,0.24)]">
                        <div className="grid gap-6 p-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8FB4FF]">
                                    Detail Application
                                </p>
                                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                    {candidate.name ?? 'Candidate'}
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                                    Review jawaban assessment, submission project,
                                    dan keputusan akhir untuk posisi {position.title ?? '-'}.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                <p className="text-sm text-blue-100">Auto score</p>
                                <p className="mt-2 text-5xl font-black">
                                    {application.total_score ?? '-'}
                                </p>
                                <p className="mt-2 text-xs text-blue-100">
                                    Tidak digabung dengan nilai essay/project.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-5">
                            <section className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                                        <ClipboardCheck className="size-5" />
                                        <h2 className="font-black text-[#102B5C]">
                                            Application
                                        </h2>
                                    </div>
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-[#6B7894]">Applied</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {formatDateTime(application.created_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">Started</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {formatDateTime(application.started_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">Submitted</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {formatDateTime(application.submitted_at)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                                        <ShieldCheck className="size-5" />
                                        <h2 className="font-black text-[#102B5C]">
                                            Candidate
                                        </h2>
                                    </div>
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-[#6B7894]">Email</dt>
                                            <dd className="break-all font-semibold text-[#102B5C]">
                                                {candidate.email ?? '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">Phone</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {candidate.phone ?? '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">CV</dt>
                                            <dd>
                                                {candidate.cv_url ? (
                                                    <a
                                                        href={candidate.cv_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-bold text-[#1D449C] underline underline-offset-4"
                                                    >
                                                        Open CV
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-[#102B5C]">
                                                        -
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                                        <FileText className="size-5" />
                                        <h2 className="font-black text-[#102B5C]">
                                            Assessment
                                        </h2>
                                    </div>
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-[#6B7894]">Title</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {assessment.title ?? '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">Duration</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {assessment.duration_minutes ?? '-'} minutes
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[#6B7894]">Reviewed</dt>
                                            <dd className="font-semibold text-[#102B5C]">
                                                {formatDateTime(application.reviewed_at)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </section>

                          

                            <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                <h2 className="text-xl font-black text-[#102B5C]">
                                    MCQ Answers
                                </h2>
                                <div className="mt-4 space-y-3">
                                    {mcq_answers.map((answer, index) => (
                                        <div
                                            key={`${answer.question_text}-${index}`}
                                            className="rounded-2xl bg-[#F7F9FD] p-4"
                                        >
                                            <p className="font-bold text-[#102B5C]">
                                                {index + 1}. {answer.question_text}
                                            </p>
                                            <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                                                <span className="rounded-xl bg-white px-3 py-2">
                                                    Candidate: <b>{answer.candidate_answer ?? '-'}</b>
                                                </span>
                                                <span className="rounded-xl bg-white px-3 py-2">
                                                    Correct: <b>{answer.correct_answer ?? '-'}</b>
                                                </span>
                                                <span className="rounded-xl bg-white px-3 py-2">
                                                    Auto score: <b>{answer.auto_score ?? '-'}</b>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {mcq_answers.length === 0 && (
                                        <p className="text-sm text-[#6B7894]">
                                            No MCQ answers submitted.
                                        </p>
                                    )}
                                </div>
                            </section>

                            <form onSubmit={submitReview} className="space-y-5">
                                <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <h2 className="text-xl font-black text-[#102B5C]">
                                        Essay Answers
                                    </h2>
                                    <div className="mt-4 space-y-4">
                                        {essay_answers.map((answer, index) => {
                                            const review = data.essay_reviews.find(
                                                (item) => item.answer_id === answer.answer_id,
                                            );
                                            const error = getError(
                                                errors,
                                                `essay_reviews.${index}.score`,
                                            );

                                            return (
                                                <div
                                                    key={answer.answer_id}
                                                    className="rounded-2xl border border-[#E7ECF6] bg-[#F7F9FD] p-4"
                                                >
                                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-[#102B5C]">
                                                                {index + 1}. {answer.question_text}
                                                            </p>
                                                            <p className="mt-3 whitespace-pre-line rounded-xl bg-white p-3 text-sm leading-6 text-[#526078]">
                                                                {answer.answer_text ?? '-'}
                                                            </p>
                                                        </div>
                                                        <label className="w-full lg:w-44">
                                                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                                                                Score / {answer.point_value ?? 0}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={answer.point_value ?? undefined}
                                                                step="0.01"
                                                                value={review?.score ?? ''}
                                                                onChange={(event) =>
                                                                    setEssayScore(
                                                                        answer.answer_id,
                                                                        event.target.value,
                                                                    )
                                                                }
                                                                className="mt-2 h-11 w-full rounded-2xl border border-[#DCE3F2] bg-white px-3 text-sm font-bold text-[#102B5C] outline-none focus:border-[#3D72D1]"
                                                            />
                                                            {error && (
                                                                <p className="mt-1 text-xs font-semibold text-rose-600">
                                                                    {error}
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {essay_answers.length === 0 && (
                                            <p className="text-sm text-[#6B7894]">
                                                No essay answers submitted.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <h2 className="text-xl font-black text-[#102B5C]">
                                        Project Submissions
                                    </h2>
                                    <div className="mt-4 space-y-4">
                                        {project_submissions.map((submission) => {
                                            const review = data.project_reviews.find(
                                                (item) =>
                                                    item.project_submission_id ===
                                                    submission.submission_id,
                                            );

                                            return (
                                                <div
                                                    key={submission.submission_id}
                                                    className="rounded-2xl border border-[#E7ECF6] bg-[#F7F9FD] p-4"
                                                >
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <FileArchive className="size-5 text-[#1D449C]" />
                                                                <h3 className="font-black text-[#102B5C]">
                                                                    {submission.task_title ?? '-'}
                                                                </h3>
                                                            </div>
                                                            <p className="mt-2 text-sm leading-6 text-[#526078]">
                                                                {submission.description ?? '-'}
                                                            </p>
                                                            <div className="mt-3 grid gap-2 text-xs text-[#6B7894] md:grid-cols-2">
                                                                <span>
                                                                    Deadline:{' '}
                                                                    <b>{formatDateTime(submission.deadline_at)}</b>
                                                                </span>
                                                                <span>
                                                                    Submitted:{' '}
                                                                    <b>{formatDateTime(submission.submitted_at)}</b>
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 rounded-xl bg-white p-3 text-sm text-[#526078]">
                                                                Candidate notes:{' '}
                                                                <b>{submission.candidate_notes ?? '-'}</b>
                                                            </p>
                                                            {submission.file_url && (
                                                                <a
                                                                    href={submission.file_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#102B5C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D449C]"
                                                                >
                                                                    <FileArchive className="size-4" />
                                                                    Open file
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="grid w-full gap-3 lg:w-64">
                                                            <label>
                                                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                                                                    Project Score
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={review?.score ?? ''}
                                                                    onChange={(event) =>
                                                                        setProjectScore(
                                                                            submission.submission_id,
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                    className="mt-2 h-11 w-full rounded-2xl border border-[#DCE3F2] bg-white px-3 text-sm font-bold text-[#102B5C] outline-none focus:border-[#3D72D1]"
                                                                />
                                                            </label>
                                                            <label>
                                                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                                                                    Score Notes
                                                                </span>
                                                                <textarea
                                                                    rows={4}
                                                                    value={review?.score_notes ?? ''}
                                                                    onChange={(event) =>
                                                                        setProjectNotes(
                                                                            submission.submission_id,
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                    className="mt-2 w-full rounded-2xl border border-[#DCE3F2] bg-white px-3 py-2 text-sm text-[#102B5C] outline-none focus:border-[#3D72D1]"
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {project_submissions.length === 0 && (
                                            <p className="text-sm text-[#6B7894]">
                                                No project submissions available.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)] xl:hidden">
                                    <ReviewPanel
                                        data={data}
                                        setData={setData}
                                        processing={processing}
                                        errors={errors}
                                    />
                                </aside>
                                <div className="xl:hidden">
                                    <WarningsPanel warnings={warnings} />
                                </div>
                            </form>
                        </div>

                        <form
                            onSubmit={submitReview}
                            className="hidden xl:flex xl:flex-col xl:gap-5 xl:sticky xl:top-24"
                        >
                            <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                <ReviewPanel
                                    data={data}
                                    setData={setData}
                                    processing={processing}
                                    errors={errors}
                                />
                            </aside>
                            <WarningsPanel warnings={warnings} />
                        </form>
                    </div>

                    {page.props.errors && Object.keys(page.props.errors).length > 0 && (
                        <p className="text-sm font-semibold text-rose-600">
                            Please check the highlighted review fields.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

function ReviewPanel({
    data,
    setData,
    processing,
    errors,
}: {
    data: ReviewFormData;
    setData: ReturnType<typeof useForm<ReviewFormData>>['setData'];
    processing: boolean;
    errors: Partial<Record<keyof ReviewFormData, string>>;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1D449C]">
                <MessageSquareText className="size-5" />
                <h2 className="text-xl font-black text-[#102B5C]">
                    Review Panel
                </h2>
            </div>

            <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                    Final status
                </span>
                <select
                    value={data.status}
                    onChange={(event) =>
                        setData('status', event.target.value as AdminReviewStatus)
                    }
                    className="mt-2 h-11 w-full rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 text-sm font-bold text-[#102B5C] outline-none focus:border-[#3D72D1]"
                >
                    {REVIEW_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
                {errors.status && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                        {errors.status}
                    </p>
                )}
            </label>

            <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                    Admin notes
                </span>
                <textarea
                    rows={8}
                    value={data.admin_notes}
                    onChange={(event) => setData('admin_notes', event.target.value)}
                    placeholder="Catatan internal untuk keputusan akhir..."
                    className="mt-2 w-full rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 py-2 text-sm leading-6 text-[#102B5C] outline-none focus:border-[#3D72D1]"
                />
            </label>

            <button
                type="submit"
                disabled={processing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1D449C] px-5 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(29,68,156,0.25)] transition hover:bg-[#17377E] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? (
                    'Saving...'
                ) : (
                    <>
                        <Save className="size-4" />
                        Save Review
                    </>
                )}
            </button>

            <div className="rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                <CheckCircle2 className="mb-2 size-4" />
                Saving sets reviewer and review timestamp. Auto score remains
                unchanged.
            </div>
        </div>
    );
}

function WarningsPanel({ warnings }: { warnings: AdminAssessmentWarning[] }) {
    if (warnings.length === 0) return null;

    return (
        <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
            <div className="mb-4 flex items-center gap-2 text-rose-600">
                <AlertTriangle className="size-5" />
                <h2 className="text-xl font-black text-[#102B5C]">
                    Assessment Warnings
                    <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-sm font-bold text-rose-600">
                        {warnings.length}
                    </span>
                </h2>
            </div>
            <div className="space-y-3">
                {warnings.map((warning) => (
                    <div
                        key={warning.id}
                        className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="font-bold text-rose-900 capitalize">
                                    {warning.action?.replace(/_/g, ' ')}
                                </p>
                                <p className="mt-1 text-sm text-rose-700">
                                    {warning.description ?? '-'}
                                </p>
                            </div>
                            <span className="whitespace-nowrap text-xs font-semibold text-rose-500">
                                {formatDateTime(warning.created_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
