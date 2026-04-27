export type StepKey = 'profile' | 'quiz' | 'project' | 'review' | 'result';
export type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

export interface CandidateData {
    name: string;
    email: string;
    phone: string | null;
    duration: number | null;
    internStart: string | null;
    cv: {
        name: string;
        url: string;
    } | null;
    profileCompletion: number;
    hasCv: boolean;
    avatarInitials: string;
}

export interface ApplicationData {
    positionTitle: string;
    appliedAt: string | null;
    status: string;
    statusLabel: string;
    statusTone: StatusTone;
    activeStep: StepKey;
    hasProjectTasks: boolean;
    areProjectSubmissionsComplete: boolean;
    headline: string;
    nextActionLabel: string | null;
    nextActionUrl: string | null;
    nextActionMethod: 'get' | 'post' | null;
    canOpenAssessment: boolean;
    guidance: string;
}
