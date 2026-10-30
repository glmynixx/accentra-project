<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FacultySectionController extends Controller
{
    public function index()
    {
        $faculty = Faculty::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->firstOrFail();

        $sections = Section::where('faculty_id', $faculty->id)
            ->orderBy('section_name')
            ->get();

        $students = Student::whereIn(
            'section_id',
            $sections->pluck('id')
        )
            ->orderBy('name')
            ->get()
            ->groupBy('section_id');

        $formattedSections = $sections->map(function ($section) use ($faculty, $students) {

            $sectionStudents = $students->get($section->id, collect());

            return [
                'id' => (string) $section->id,
                'name' => $section->section_name ?? '',
                'program' => $section->course ?? '',
                'yearLevel' => $section->year_level ?? '',
                'academicYear' => $section->school_year ?? '',
                'semester' => 'Not specified',
                'facultyAssigned' => $faculty->name ?? '',
                'status' => $section->status ?? 'Inactive',

                'students' => $sectionStudents->map(function ($student) {
                    return [
                        'databaseId' => $student->id,
                        'id' => (string) ($student->student_number ?? ''),
                        'name' => $student->name ?? '',
                        'status' => $student->status ?? 'Inactive',
                        'subjects' => [],
                    ];
                })->values()->all(),
            ];
        });

        return Inertia::render('facultySections', [
            'databaseSections' => $formattedSections->values()->all(),
            'availableSubjects' => [],
        ]);
        
    }
}
