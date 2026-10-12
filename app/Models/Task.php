<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'topic',
        'section',
        'due_date',
        'points',
        'status',
        'description',
        'instructions',
        'date_created',
        'attachment_path',
        'attachment_name',
    ];

    protected $casts = [
        'due_date' => 'date:Y-m-d',
        'date_created' => 'date:Y-m-d',
    ];
}
