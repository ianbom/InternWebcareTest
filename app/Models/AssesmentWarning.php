<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssesmentWarning extends Model
{
    protected $fillable = [
        'assessment_id',
        'application_id',
        'candidate_id',
        'action',
        'description',
    ];

    /** Action type constants */
    public const ACTION_TAB_SWITCH = 'tab_switch';

    public const ACTION_BLOCKED_KEY = 'blocked_shortcut';

    public const ACTION_CONTEXT_MENU = 'context_menu';

    public const ACTION_COPY = 'copy';

    public const ACTION_CUT = 'cut';

    public const ACTION_PASTE = 'paste';

    public const ACTION_DRAGSTART = 'dragstart';

    public const ACTION_REFRESH = 'refresh_attempt';

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}
