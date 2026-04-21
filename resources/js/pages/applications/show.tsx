import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Briefcase, User2, Clock, TriangleAlert } from 'lucide-react';
import { index } from '@/routes/applications';
import type {
    AdminApplicationDetail,
    AdminAssessmentSummary,
    AdminAssessmentWarning,
    AdminCandidateDetail,
    AdminEssayAnswer,
    AdminMcqAnswer,
    AdminPositionSummary,
    AdminProjectSubmission,
} from '@/types';

import { ApplicationSummaryCards } from './components/ApplicationSummaryCards';
import { AssessmentAnswersSection } from './components/AssessmentAnswersSection';
import { ProjectSubmissionsSection } from './components/ProjectSubmissionsSection';
import { ReviewPanel } from './components/ReviewPanel';
import { StatusBadge } from './components/StatusBadge';
import { WarningsPanel } from './components/WarningsPanel';
import { useApplicationReviewForm } from './hooks/useApplicationReviewForm';
import { currentQuery } from './utils/application-format';

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
    const reviewForm = useApplicationReviewForm(
        application,
        essay_answers,
        project_submissions,
        listQuery,
    );
    const flatErrors = reviewForm.errors as Record<string, string | undefined>;

    const hasErrors =
        page.props.errors && Object.keys(page.props.errors).length > 0;

    return (
        <>
            <Head title={`Application — ${candidate.name ?? 'Candidate'}`} />

            <div className="min-h-screen space-y-5 p-4 sm:p-5">

                {/* ── Top bar: back link + status ── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 rounded-full border border-[#DCE3F2] bg-white px-4 py-2 text-sm font-bold text-[#102B5C] shadow-[0_2px_8px_rgba(16,43,92,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,43,92,0.12)]"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke daftar
                    </Link>
                    <StatusBadge status={application.status} />
                </div>

                {/* ── Hero header ── */}
                <section className="relative overflow-hidden rounded-[28px] bg-[#102B5C] text-white shadow-[0_24px_70px_rgba(16,43,92,0.28)]">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-[#1D449C]/50 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-12 left-1/3 size-48 rounded-full bg-[#3D72D1]/30 blur-2xl" />

                    <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto]">
                        {/* Left: candidate info */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8FB4FF]">
                                Detail Application
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                {candidate.name ?? 'Candidate'}
                            </h1>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <HeroPill icon={<Briefcase className="size-3.5" />}>
                                    {position.title ?? '-'}
                                </HeroPill>
                                <HeroPill icon={<User2 className="size-3.5" />}>
                                    {candidate.email ?? '-'}
                                </HeroPill>
                                {assessment.duration_minutes && (
                                    <HeroPill icon={<Clock className="size-3.5" />}>
                                        {assessment.duration_minutes} menit
                                    </HeroPill>
                                )}
                                {warnings.length > 0 && (
                                    <HeroPill
                                        icon={<TriangleAlert className="size-3.5 text-rose-300" />}
                                        danger
                                    >
                                        {warnings.length} peringatan
                                    </HeroPill>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Summary cards ── */}
                <ApplicationSummaryCards
                    application={application}
                    assessment={assessment}
                    candidate={candidate}
                />

                {/* ── Main 2-column layout ── */}
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">

                    {/* Left column: assessment + project */}
                    <div className="space-y-5">
                        <form onSubmit={reviewForm.submitReview} className="space-y-5">
                            <AssessmentAnswersSection
                                errors={flatErrors}
                                essayAnswers={essay_answers}
                                essayReviews={reviewForm.data.essay_reviews}
                                mcqAnswers={mcq_answers}
                                onEssayScoreChange={reviewForm.setEssayScore}
                            />

                            <ProjectSubmissionsSection
                                onProjectNotesChange={reviewForm.setProjectNotes}
                                onProjectScoreChange={reviewForm.setProjectScore}
                                projectReviews={reviewForm.data.project_reviews}
                                submissions={project_submissions}
                            />

                            {/* Review panel + warnings — mobile only (shows inline under content) */}
                            <div className="space-y-5 xl:hidden">
                                <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                    <ReviewPanel
                                        data={reviewForm.data}
                                        errors={reviewForm.errors}
                                        processing={reviewForm.processing}
                                        setData={reviewForm.setData}
                                    />
                                </aside>
                                <WarningsPanel warnings={warnings} />
                            </div>
                        </form>
                    </div>

                    {/* Right column: sticky sidebar — desktop only */}
                    <form
                        onSubmit={reviewForm.submitReview}
                        className="hidden xl:flex xl:flex-col xl:gap-5"
                    >
                        <div className="sticky top-24 flex flex-col gap-5">
                            <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                <ReviewPanel
                                    data={reviewForm.data}
                                    errors={reviewForm.errors}
                                    processing={reviewForm.processing}
                                    setData={reviewForm.setData}
                                />
                            </aside>
                            <WarningsPanel warnings={warnings} />
                        </div>
                    </form>
                </div>

                {/* ── Global validation error notice ── */}
                {hasErrors && (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                        Terdapat field yang belum diisi dengan benar. Periksa kembali review assessment dan project.
                    </p>
                )}
            </div>
        </>
    );
}

/* ── Small helper component for hero pills ── */
function HeroPill({
    children,
    danger = false,
    icon,
}: {
    children: React.ReactNode;
    danger?: boolean;
    icon: React.ReactNode;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                danger
                    ? 'bg-rose-500/20 text-rose-200'
                    : 'bg-white/10 text-white/90'
            }`}
        >
            {icon}
            {children}
        </span>
    );
}
