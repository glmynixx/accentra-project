<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{

    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'student_number',
        'name',
        'email',
        'course',
        'year_level',
        'section',
        'contact_number',
        'address',
        'status',
        'section_id',
    ];

    public function sectionRecord()
    
    {
        return $this->belongsTo(Section::class, 'section_id');
    }
}
