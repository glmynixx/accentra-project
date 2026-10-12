<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
     protected $fillable = [
        'faculty_number',
        'name',
        'email',
        'specialization',
        'contact_number',
        'address',
        'status',
    ];

    public function sections()
{
    return $this->hasMany(Section::class, 'faculty_id');
}



}
