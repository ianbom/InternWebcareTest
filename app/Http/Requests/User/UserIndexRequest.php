<?php

namespace App\Http\Requests\User;

use App\Services\UserService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserIndexRequest extends FormRequest
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
            'role' => ['nullable', 'string', Rule::in(UserService::ROLES)],
            'has_cv' => ['nullable', 'string', Rule::in(['0', '1'])],
            'sort' => ['nullable', 'string', Rule::in(UserService::SORTS)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
