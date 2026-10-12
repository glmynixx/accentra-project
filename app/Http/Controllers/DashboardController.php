<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\Section;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Models\ActivityLog;

class DashboardController extends Controller
{
    public function index()
    {
        $students = Student::with('sectionRecord')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_number,
                    'name' => $student->name,
                    'username' => $student->email,
                    'role' => 'Student',
                    'section' => $student->sectionRecord?->section_name ?? 'Unassigned',
                    'status' => $student->status,
                    'dateAdded' => $student->created_at?->format('F d, Y'),
                    'createdAt' => $student->created_at?->toISOString(),
                ];
            });

        $faculty = Faculty::latest()
            ->take(5)
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->faculty_number,
                    'name' => $member->name,
                    'username' => $member->email,
                    'role' => 'Faculty',
                    'section' => '—',
                    'status' => $member->status,
                    'dateAdded' => $member->created_at?->format('F d, Y'),
                    'createdAt' => $member->created_at?->toISOString(),
                ];
            });

        $recentUsers = $students
            ->concat($faculty)
            ->sortByDesc('createdAt')
            ->take(5)
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => Student::count() + Faculty::count(),
                'totalFaculty' => Faculty::count(),
                'totalStudents' => Student::count(),
                'totalSections' => Section::count(),
                

            ],

            
        'recentActivities' => ActivityLog::latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'icon' => $activity->icon,
                    'actor' => $activity->actor,
                    'action' => $activity->action,
                    'detail' => $activity->description
                        . ' • '
                        . $activity->created_at->format('M d, Y h:i A'),
                ];
            }),


            'recentUsers' => $recentUsers,

            'sectionEnrollment' => Section::with('faculty')
                ->withCount('students')
                ->orderBy('section_name')
                ->get(),
        ]);
    }
}