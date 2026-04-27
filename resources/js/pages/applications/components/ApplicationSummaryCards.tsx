import { ClipboardCheck, FileText, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/pages/shared/utils';
import type {
    AdminApplicationDetail,
    AdminAssessmentSummary,
    AdminCandidateDetail,
    AdminProjectSubmission,
} from '@/types';

type ApplicationSummaryCardsProps = {
    application: AdminApplicationDetail;
    assessment: AdminAssessmentSummary;
    candidate: AdminCandidateDetail;
    projectSubmissions: AdminProjectSubmission[];
};

export function ApplicationSummaryCards({
    application,
    assessment,
    candidate,
    projectSubmissions,
}: ApplicationSummaryCardsProps) {
    return (
        <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                    <ClipboardCheck className="size-5" />
                    <h2 className="font-black text-[#102B5C]">Application</h2>
                </div>
                <dl className="space-y-2 text-sm">
                    <SummaryRow label="Applied" value={formatDateTime(application.created_at)} />
                    <SummaryRow label="Started" value={formatDateTime(application.started_at)} />
                    <SummaryRow label="Submitted" value={formatDateTime(application.submitted_at)} />
                    <SummaryRow label="Deadline" value={formatDateTime(projectSubmissions[0]?.deadline_at)} />
                </dl>
            </div>

            <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                    <ShieldCheck className="size-5" />
                    <h2 className="font-black text-[#102B5C]">Candidate</h2>
                </div>
                <dl className="space-y-2 text-sm">
                    <SummaryRow label="Email" value={candidate.email ?? '-'} breakAll />
                    <SummaryRow label="Phone" value={candidate.phone ?? '-'} />
                    <SummaryRow
                        label="Internship Duration"
                        value={candidate.duration ? `${candidate.duration} bulan` : '-'}
                    />
                    <SummaryRow
                        label="Intern Start"
                        value={candidate.intern_start ?? '-'}
                    />
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
                                <span className="font-semibold text-[#102B5C]">-</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="rounded-[22px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                <div className="mb-3 flex items-center gap-2 text-[#1D449C]">
                    <FileText className="size-5" />
                    <h2 className="font-black text-[#102B5C]">Assessment</h2>
                </div>
                <dl className="space-y-2 text-sm">
                    <SummaryRow label="Title" value={assessment.title ?? '-'} />
                    <SummaryRow
                        label="Duration"
                        value={`${assessment.duration_minutes ?? '-'} minutes`}
                    />
                    <SummaryRow label="Reviewed" value={formatDateTime(application.reviewed_at)} />
                </dl>
            </div>
        </section>
    );
}

function SummaryRow({
    breakAll = false,
    label,
    value,
}: {
    breakAll?: boolean;
    label: string;
    value: string;
}) {
    return (
        <div>
            <dt className="text-[#6B7894]">{label}</dt>
            <dd className={`${breakAll ? 'break-all ' : ''}font-semibold text-[#102B5C]`}>
                {value}
            </dd>
        </div>
    );
}
