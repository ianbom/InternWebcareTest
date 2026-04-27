export type AdminApplicationStatus =
    | 'pending'
    | 'in_progress'
    | 'submitted'
    | 'under_review'
    | 'approved'
    | 'rejected';

export type AdminReviewStatus = 'under_review' | 'approved' | 'rejected';

export type AdminApplicationSort =
    | 'created_at_desc'
    | 'created_at_asc'
    | 'submitted_at_desc'
    | 'candidate_name_asc'
    | 'position_title_asc'
    | 'total_score_desc';

export type AdminApplicationListItem = {
    id: number;
    candidate_name: string | null;
    email: string | null;
    phone: string | null;
    position_title: string | null;
    status: AdminApplicationStatus;
    total_score: number | null;
    created_at: string | null;
    submitted_at: string | null;
    reviewer_name: string | null;
};

export type AdminApplicationFilters = {
    search: string;
    status: string;
    position_id: string;
    applied_from: string;
    applied_to: string;
    submitted_from: string;
    submitted_to: string;
    min_score: string;
    max_score: string;
    sort: AdminApplicationSort;
};

export type AdminApplicationDetail = {
    id: number;
    status: AdminApplicationStatus;
    created_at: string | null;
    started_at: string | null;
    submitted_at: string | null;
    expires_at: string | null;
    total_score: number | null;
    admin_notes: string | null;
    reviewed_at: string | null;
};

export type AdminCandidateDetail = {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    cv_url: string | null;
    duration: number | null;
    intern_start: string | null;
};

export type AdminPositionSummary = {
    id: number;
    title: string | null;
};

export type AdminAssessmentSummary = {
    id: number;
    title: string | null;
    duration_minutes: number | null;
};

export type AdminMcqAnswer = {
    question_text: string | null;
    candidate_answer: string | null;
    correct_answer: string | null;
    auto_score: number | null;
};

export type AdminEssayAnswer = {
    answer_id: number;
    question_text: string | null;
    answer_text: string | null;
    point_value: number | null;
    score: number | null;
    scored_at: string | null;
};

export type AdminProjectSubmission = {
    submission_id: number;
    task_title: string | null;
    description: string | null;
    candidate_notes: string | null;
    file_url: string | null;
    deadline_at: string | null;
    submitted_at: string | null;
    score: number | null;
    score_notes: string | null;
    scored_at: string | null;
};

export type AdminAssessmentWarning = {
    id: number;
    action: string | null;
    description: string | null;
    created_at: string | null;
};

export type EssayReviewInput = {
    answer_id: number;
    score: number | null;
};

export type ProjectReviewInput = {
    project_submission_id: number;
    score: number | null;
    score_notes: string | null;
};

export type Paginated<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
};
