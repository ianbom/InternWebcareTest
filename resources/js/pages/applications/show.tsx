import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
                        <StatusBadge status={application.status} />
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
                        </div>
                    </section>

                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-5">
                            <ApplicationSummaryCards
                                application={application}
                                assessment={assessment}
                                candidate={candidate}
                            />

                            <form
                                onSubmit={reviewForm.submitReview}
                                className="space-y-5"
                            >
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

                                <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)] xl:hidden">
                                    <ReviewPanel
                                        data={reviewForm.data}
                                        errors={reviewForm.errors}
                                        processing={reviewForm.processing}
                                        setData={reviewForm.setData}
                                    />
                                </aside>
                                <div className="xl:hidden">
                                    <WarningsPanel warnings={warnings} />
                                </div>
                            </form>
                        </div>

                        <form
                            onSubmit={reviewForm.submitReview}
                            className="hidden xl:sticky xl:top-24 xl:flex xl:flex-col xl:gap-5"
                        >
                            <aside className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                                <ReviewPanel
                                    data={reviewForm.data}
                                    errors={reviewForm.errors}
                                    processing={reviewForm.processing}
                                    setData={reviewForm.setData}
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
