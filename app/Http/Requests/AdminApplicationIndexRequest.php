<?php

namespace App\Http\Requests;

use App\Services\AdminApplicationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminApplicationIndexRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(AdminApplicationService::STATUSES)],
            'position_id' => ['nullable', 'integer', Rule::exists('positions', 'id')],
            'applied_from' => ['nullable', 'date'],
            'applied_to' => ['nullable', 'date', 'after_or_equal:applied_from'],
            'submitted_from' => ['nullable', 'date'],
            'submitted_to' => ['nullable', 'date', 'after_or_equal:submitted_from'],
            'min_score' => ['nullable', 'numeric', 'min:0'],
            'max_score' => ['nullable', 'numeric', 'min:0', 'gte:min_score'],
            'sort' => ['nullable', 'string', Rule::in(AdminApplicationService::SORTS)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
