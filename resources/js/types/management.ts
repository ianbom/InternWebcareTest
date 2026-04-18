export type PositionSort =
    | 'created_at_desc'
    | 'created_at_asc'
    | 'title_asc'
    | 'title_desc';

export type PositionListItem = {
    id: number;
    title: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    created_by_name: string | null;
};

export type PositionFilters = {
    search: string;
    is_active: string;
    sort: PositionSort;
};

export type AssessmentSort =
    | 'created_at_desc'
    | 'created_at_asc'
    | 'title_asc'
    | 'position_title_asc'
    | 'duration_minutes_asc'
    | 'duration_minutes_desc';

export type AssessmentListItem = {
    id: number;
    title: string;
    duration_minutes: number;
    position_id: number;
    position_title: string | null;
    questions_count: number;
    project_tasks_count: number;
    created_at: string | null;
    updated_at: string | null;
    created_by_name: string | null;
};

export type AssessmentFilters = {
    search: string;
    position_id: string;
    duration_min: string;
    duration_max: string;
    sort: AssessmentSort;
};

export type PositionOption = {
    id: number;
    title: string;
    is_active: boolean;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type AdminUserRole = 'admin' | 'candidate';

export type AdminUserSort =
    | 'created_at_desc'
    | 'created_at_asc'
    | 'name_asc'
    | 'name_desc'
    | 'email_asc'
    | 'email_desc'
    | 'role_asc';

export type AdminUserListItem = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: AdminUserRole;
    cv_path: string | null;
    cv_url: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminUserFilters = {
    search: string;
    role: string;
    has_cv: string;
    sort: AdminUserSort;
};

export type AdminUserFormData = {
    name: string;
    email: string;
    phone: string;
    role: AdminUserRole;
    password: string;
    password_confirmation: string;
};

export type AdminUserPasswordFormData = {
    password: string;
    password_confirmation: string;
};

export type AssessmentSummary = {
    id: number;
    position_id: number;
    title: string;
    duration_minutes: number;
    created_at: string | null;
    updated_at: string | null;
};

export type AssessmentDetailPosition = {
    id: number;
    title: string;
};

export type QuestionType = 'multiple_choice' | 'essay';

export type AssessmentQuestion = {
    id: number;
    type: QuestionType;
    question_text: string;
    options: string[];
    correct_answer: string | null;
    point_value: number;
    order_index: number;
};

export type AssessmentProjectTask = {
    id: number;
    title: string;
    description: string;
    deadline_hours: number;
};

export type AssessmentDetail = {
    assessment: AssessmentSummary;
    position: AssessmentDetailPosition;
    questions: AssessmentQuestion[];
    project_tasks: AssessmentProjectTask[];
    positionOptions: PositionOption[];
};

export type PositionFormData = {
    title: string;
    description: string;
    is_active: boolean;
};

export type AssessmentFormData = {
    position_id: string;
    title: string;
    duration_minutes: string;
};

export type QuestionFormData = {
    type: QuestionType;
    question_text: string;
    options: string[];
    correct_answer: string;
    point_value: string;
    order_index: string;
};

export type ProjectTaskFormData = {
    title: string;
    description: string;
    deadline_hours: string;
};
