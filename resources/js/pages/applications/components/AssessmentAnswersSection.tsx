import { FieldError } from '@/pages/shared/FieldError';
import type { AdminEssayAnswer, AdminMcqAnswer } from '@/types';

type AssessmentAnswersSectionProps = {
    errors: Record<string, string | undefined>;
    essayAnswers: AdminEssayAnswer[];
    essayReviews: {
        answer_id: number;
        score: number | null;
    }[];
    mcqAnswers: AdminMcqAnswer[];
    onEssayScoreChange: (answerId: number, score: string) => void;
};

export function AssessmentAnswersSection({
    errors,
    essayAnswers,
    essayReviews,
    mcqAnswers,
    onEssayScoreChange,
}: AssessmentAnswersSectionProps) {
    return (
        <>
            <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                <h2 className="text-xl font-black text-[#102B5C]">MCQ Answers</h2>
                <div className="mt-4 space-y-3">
                    {mcqAnswers.map((answer, index) => (
                        <div
                            key={`${answer.question_text}-${index}`}
                            className="rounded-2xl bg-[#F7F9FD] p-4"
                        >
                            <p className="font-bold text-[#102B5C]">
                                {index + 1}. {answer.question_text}
                            </p>
                            <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                                <span className="rounded-xl bg-white px-3 py-2">
                                    Candidate: <b>{answer.candidate_answer ?? '-'}</b>
                                </span>
                                <span className="rounded-xl bg-white px-3 py-2">
                                    Correct: <b>{answer.correct_answer ?? '-'}</b>
                                </span>
                                <span className="rounded-xl bg-white px-3 py-2">
                                    Auto score: <b>{answer.auto_score ?? '-'}</b>
                                </span>
                            </div>
                        </div>
                    ))}
                    {mcqAnswers.length === 0 && (
                        <p className="text-sm text-[#6B7894]">
                            No MCQ answers submitted.
                        </p>
                    )}
                </div>
            </section>

            <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
                <h2 className="text-xl font-black text-[#102B5C]">Essay Answers</h2>
                <div className="mt-4 space-y-4">
                    {essayAnswers.map((answer, index) => {
                        const review = essayReviews.find(
                            (item) => item.answer_id === answer.answer_id,
                        );

                        return (
                            <div
                                key={answer.answer_id}
                                className="rounded-2xl border border-[#E7ECF6] bg-[#F7F9FD] p-4"
                            >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-[#102B5C]">
                                            {index + 1}. {answer.question_text}
                                        </p>
                                        <p className="mt-3 whitespace-pre-line rounded-xl bg-white p-3 text-sm leading-6 text-[#526078]">
                                            {answer.answer_text ?? '-'}
                                        </p>
                                    </div>
                                    <label className="w-full lg:w-44">
                                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                                            Score / {answer.point_value ?? 0}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            max={answer.point_value ?? undefined}
                                            step="0.01"
                                            value={review?.score ?? ''}
                                            onChange={(event) =>
                                                onEssayScoreChange(
                                                    answer.answer_id,
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 h-11 w-full rounded-2xl border border-[#DCE3F2] bg-white px-3 text-sm font-bold text-[#102B5C] outline-none focus:border-[#3D72D1]"
                                        />
                                        <FieldError message={errors[`essay_reviews.${index}.score`]} />
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                    {essayAnswers.length === 0 && (
                        <p className="text-sm text-[#6B7894]">
                            No essay answers submitted.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
