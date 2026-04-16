<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'application_id',
    'project_task_id',
    'status',
    'file_path',
    'notes',
    'score',
    'score_notes',
    'scored_by',
    'scored_at',
    'started_at',
    'submitted_at',
    'deadline_at',
])]
class ProjectSubmission extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'scored_at' => 'datetime',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
            'deadline_at' => 'datetime'
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function projectTask(): BelongsTo
    {
        return $this->belongsTo(ProjectTask::class);
    }

    public function scoredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scored_by');
    }
}
