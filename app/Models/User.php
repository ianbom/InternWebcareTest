<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'phone', 'cv_path', 'role', 'duration', 'intern_start'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function positionsCreated(): HasMany
    {
        return $this->hasMany(Position::class, 'created_by');
    }

    public function assessmentsCreated(): HasMany
    {
        return $this->hasMany(Assessment::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'candidate_id');
    }

    public function applicationsReviewed(): HasMany
    {
        return $this->hasMany(Application::class, 'reviewed_by');
    }

    public function answersScored(): HasMany
    {
        return $this->hasMany(Answer::class, 'scored_by');
    }

    public function projectSubmissionsScored(): HasMany
    {
        return $this->hasMany(ProjectSubmission::class, 'scored_by');
    }
}
