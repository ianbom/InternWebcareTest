<?php

namespace App\Http\Requests\Question;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
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
            'type' => ['required', Rule::in(['multiple_choice', 'essay'])],
            'question_text' => ['required', 'string'],
            'options' => ['exclude_if:type,essay', 'required_if:type,multiple_choice', 'array', 'min:2'],
            'options.*' => ['required', 'string', 'max:255'],
            'correct_answer' => ['exclude_if:type,essay', 'required_if:type,multiple_choice', 'string', 'max:255'],
            'point_value' => ['required', 'numeric', 'min:0', 'max:999.99'],
            'order_index' => ['required', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('type') === 'essay') {
            $this->merge([
                'options' => null,
                'correct_answer' => null,
            ]);

            return;
        }

        if (is_array($this->input('options'))) {
            $this->merge([
                'options' => array_values(array_filter(
                    array_map(static fn ($option) => is_string($option) ? trim($option) : $option, $this->input('options')),
                    static fn ($option) => is_string($option) ? $option !== '' : filled($option),
                )),
            ]);
        }
    }
}
