import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { update } from '@/routes/applications/review';
import type {
    AdminApplicationDetail,
    AdminEssayAnswer,
    AdminProjectSubmission,
} from '@/types';
import type { ReviewFormData } from '../types';
import { getInitialReviewStatus } from '../utils/application-format';

export function useApplicationReviewForm(
    application: AdminApplicationDetail,
    essayAnswers: AdminEssayAnswer[],
    projectSubmissions: AdminProjectSubmission[],
    listQuery: Record<string, string>,
) {
    const form = useForm<ReviewFormData>({
        status: getInitialReviewStatus(application.status),
        admin_notes: application.admin_notes ?? '',
        essay_reviews: essayAnswers.map((answer) => ({
            answer_id: answer.answer_id,
            score: answer.score,
        })),
        project_reviews: projectSubmissions.map((submission) => ({
            project_submission_id: submission.submission_id,
            score: submission.score,
            score_notes: submission.score_notes,
        })),
    });

    const setEssayScore = (answerId: number, score: string) => {
        form.setData(
            'essay_reviews',
            form.data.essay_reviews.map((review) =>
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
        form.setData(
            'project_reviews',
            form.data.project_reviews.map((review) =>
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
        form.setData(
            'project_reviews',
            form.data.project_reviews.map((review) =>
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

        form.put(update.url(application.id, { query: listQuery }), {
            preserveScroll: true,
        });
    };

    return {
        ...form,
        setEssayScore,
        setProjectNotes,
        setProjectScore,
        submitReview,
    };
}
