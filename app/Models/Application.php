<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'candidate_id',
    'position_id',
    'assessment_id',
    'cv_snapshot',
    'status',
    'started_at',
    'expires_at',
    'submitted_at',
    'total_score',
    'reviewed_by',
    'reviewed_at',
    'admin_notes',
])]
class Application extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'expires_at' => 'datetime',
            'submitted_at' => 'datetime',
            'total_score' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function projectSubmissions(): HasMany
    {
        return $this->hasMany(ProjectSubmission::class);
    }

    public function warnings(): HasMany
    {
        return $this->hasMany(AssesmentWarning::class);
    }
}
