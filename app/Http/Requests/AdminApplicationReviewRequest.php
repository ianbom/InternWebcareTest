<?php

namespace App\Http\Requests;

use App\Services\AdminApplicationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'essay_reviews.*.answer_id' => ['nullable', 'integer'],
            'essay_reviews.*.score' => ['nullable'],
            'project_reviews' => ['nullable', 'array'],
            'project_reviews.*.project_submission_id' => ['nullable', 'integer'],
            'project_reviews.*.score' => ['nullable'],
            'project_reviews.*.score_notes' => ['nullable', 'string'],
        ];
    }
}
