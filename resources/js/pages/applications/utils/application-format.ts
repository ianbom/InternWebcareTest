import type {
    AdminApplicationStatus,
    AdminReviewStatus,
} from '@/types';

export const STATUS_LABELS: Record<AdminApplicationStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
};

export const SORT_LABELS: Record<string, string> = {
    created_at_desc: 'Applied newest',
    created_at_asc: 'Applied oldest',
    submitted_at_desc: 'Submitted newest',
    candidate_name_asc: 'Candidate A-Z',
    position_title_asc: 'Position A-Z',
    total_score_desc: 'Top auto score',
};

export const STATUS_CLASSES: Record<AdminApplicationStatus, string> = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-50 text-blue-700',
    submitted: 'bg-amber-50 text-amber-700',
    under_review: 'bg-indigo-50 text-indigo-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-rose-50 text-rose-700',
};

export const REVIEW_STATUSES: AdminReviewStatus[] = [
    'under_review',
    'approved',
    'rejected',
];

export function getInitialReviewStatus(
    status: AdminApplicationStatus,
): AdminReviewStatus {
    return REVIEW_STATUSES.includes(status as AdminReviewStatus)
        ? (status as AdminReviewStatus)
        : 'under_review';
}

export function currentQuery(): Record<string, string> {
    if (typeof window === 'undefined') {
        return {};
    }

    return Object.fromEntries(new URLSearchParams(window.location.search));
}
