<?php

namespace App\Http\Requests;

use App\Models\Answer;
use App\Models\Application;
use App\Models\ProjectSubmission;
use App\Services\AdminApplicationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AdminApplicationReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(AdminApplicationService::REVIEW_STATUSES)],
            'admin_notes' => ['nullable', 'string'],
            'essay_reviews' => ['nullable', 'array'],
            'essay_reviews.*.answer_id' => ['required', 'integer', Rule::exists('answers', 'id')],
            'essay_reviews.*.score' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'project_reviews' => ['nullable', 'array'],
            'project_reviews.*.project_submission_id' => ['required', 'integer', Rule::exists('project_submissions', 'id')],
            'project_reviews.*.score' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'project_reviews.*.score_notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var Application $application */
                $application = $this->route('application');

                $this->validateEssayReviews($validator, $application);
                $this->validateProjectReviews($validator, $application);
            },
        ];
    }

    private function validateEssayReviews(Validator $validator, Application $application): void
    {
        $reviews = $this->input('essay_reviews', []);

        if (! is_array($reviews) || $reviews === []) {
            return;
        }

        $answers = Answer::query()
            ->with('question:id,type,point_value')
            ->whereIn('id', collect($reviews)->pluck('answer_id')->filter()->all())
            ->get()
            ->keyBy('id');

        foreach ($reviews as $index => $review) {
            if (! is_array($review) || ! isset($review['answer_id'])) {
                continue;
            }

            $answer = $answers->get((int) $review['answer_id']);
            $score = $review['score'] ?? null;

            if (! $answer || $answer->application_id !== $application->id || $answer->question?->type !== 'essay') {
                $validator->errors()->add("essay_reviews.{$index}.answer_id", 'The selected essay answer is invalid.');

                continue;
            }

            if ($score !== null && $score !== '' && (float) $score > (float) $answer->question->point_value) {
                $validator->errors()->add(
                    "essay_reviews.{$index}.score",
                    'The essay score may not exceed the question point value.',
                );
            }
        }
    }

    private function validateProjectReviews(Validator $validator, Application $application): void
    {
        $reviews = $this->input('project_reviews', []);

        if (! is_array($reviews) || $reviews === []) {
            return;
        }

        $submissions = ProjectSubmission::query()
            ->whereIn('id', collect($reviews)->pluck('project_submission_id')->filter()->all())
            ->get()
            ->keyBy('id');

        foreach ($reviews as $index => $review) {
            if (! is_array($review) || ! isset($review['project_submission_id'])) {
                continue;
            }

            $submission = $submissions->get((int) $review['project_submission_id']);

            if (! $submission || $submission->application_id !== $application->id) {
                $validator->errors()->add(
                    "project_reviews.{$index}.project_submission_id",
                    'The selected project submission is invalid.',
                );
            }
        }
    }
}
