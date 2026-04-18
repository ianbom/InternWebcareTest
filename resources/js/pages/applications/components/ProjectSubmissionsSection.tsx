import { FileArchive } from 'lucide-react';
import { formatDateTime } from '@/pages/shared/utils';
import type { AdminProjectSubmission } from '@/types';

type ProjectSubmissionsSectionProps = {
    onProjectNotesChange: (submissionId: number, scoreNotes: string) => void;
    onProjectScoreChange: (submissionId: number, score: string) => void;
    projectReviews: {
        project_submission_id: number;
        score: number | null;
        score_notes: string | null;
    }[];
    submissions: AdminProjectSubmission[];
};

export function ProjectSubmissionsSection({
    onProjectNotesChange,
    onProjectScoreChange,
    projectReviews,
    submissions,
}: ProjectSubmissionsSectionProps) {
    return (
        <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
            <h2 className="text-xl font-black text-[#102B5C]">
                Project Submissions
            </h2>
            <div className="mt-4 space-y-4">
                {submissions.map((submission) => {
                    const review = projectReviews.find(
                        (item) =>
                            item.project_submission_id === submission.submission_id,
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
                                                onProjectScoreChange(
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
                                                onProjectNotesChange(
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
                {submissions.length === 0 && (
                    <p className="text-sm text-[#6B7894]">
                        No project submissions available.
                    </p>
                )}
            </div>
        </section>
    );
}
