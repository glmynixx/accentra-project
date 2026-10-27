<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    public function sections(): HasMany
{
    return $this->hasMany(Section::class, 'faculty_id');
}


     protected $fillable = [
        'user_id',
        'faculty_number',
        'subjects',
        'name',
        'email',
        'specialization',
        'contact_number',
        'address',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'subjects' => 'array',
        ];
    }

public function user()
{
    return $this->belongsTo(\App\Models\User::class);
}




}
