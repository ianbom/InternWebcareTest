import type {
    AdminReviewStatus,
    EssayReviewInput,
    ProjectReviewInput,
} from '@/types';

export type PositionOption = {
    id: number;
    title: string;
};

export type ReviewFormData = {
    status: AdminReviewStatus;
    admin_notes: string;
    essay_reviews: EssayReviewInput[];
    project_reviews: ProjectReviewInput[];
};
