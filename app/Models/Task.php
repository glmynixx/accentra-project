<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
    'faculty_id',
    'section_id',
    'subject_name',
    'title',
    'topic',
    'due_date',
    'points',
    'description',
    'instructions',
    'status',
    'attachment_path',
    'attachment_name',
    'subjects',
];

    protected $casts = [
        'due_date' => 'date',
        'points' => 'integer',
        'subjects' => 'array',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
