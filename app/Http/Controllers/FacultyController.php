<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\ActivityLog;

class FacultyController extends Controller
{
    
public function index()
{
    return Inertia::render('facultyManagement', [
        'faculty' => Faculty::with('sections')
            ->orderBy('name')
            ->get(),

        'availableSections' => \App\Models\Section::orderBy('section_name')
            ->get(['id', 'section_name', 'faculty_id']),
    ]);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
        'faculty_number' => 'required|string|max:50|unique:faculties,faculty_number',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:faculties,email',
        'specialization' => 'required|string|max:255',
        'contact_number' => 'nullable|string|max:30',
        'address' => 'nullable|string',
        'status' => 'required|in:Active,Inactive',
    ]);

    Faculty::create($validated);
    ActivityLog::create([
    'actor' => 'Admin',
    'action' => 'added a new faculty member',
    'module' => 'Faculty Management',
    'description' => $validated['name'],
    'icon' => 'user-plus',
]);

    return redirect()
        ->route('faculty.index')
        ->with('success', 'Faculty added successfully.');

    }

    public function show(Faculty $faculty)
    {
        return response()->json($faculty);
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'faculty_number' => [
                'required', 'string', 'max:50',
                Rule::unique('faculties', 'faculty_number')->ignore($faculty->id),
            ],
            'name' => 'required|string|max:255',
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('faculties', 'email')->ignore($faculty->id),
            ],
            'specialization' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        $faculty->update($validated);
        ActivityLog::create([
        'actor' => 'Admin',
        'action' => 'updated a faculty member',
        'module' => 'Faculty Management',
        'description' => $faculty->name,
        'icon' => 'user-pen',
]);

        return redirect()->route('faculty.index')
            ->with('success', 'Faculty updated successfully.');
    }

    public function updateStatus(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'status' => 'required|in:Active,Inactive',
        ]);

        $faculty->update($validated);

        ActivityLog::create([
        'actor' => 'Admin',
        'action' => $validated['status'] === 'Active'
            ? 'activated a faculty member'
            : 'deactivated a faculty member',
        'module' => 'Faculty Management',
        'description' => $faculty->name,
        'icon' => 'user-check',
        ]);

        return redirect()->route('faculty.index');
    }

    public function destroy(Faculty $faculty)
    {
        $facultyName = $faculty->name;

        $faculty->delete();

        ActivityLog::create([
            'actor' => 'Admin',
            'action' => 'deleted a faculty member',
            'module' => 'Faculty Management',
            'description' => $facultyName,
            'icon' => 'user-minus',
        ]);

        return redirect()->route('faculty.index')
            ->with('success', 'Faculty deleted successfully.');
    }

    public function assignSections(Request $request, Faculty $faculty)
    {
    $validated = $request->validate([
        

        'section_ids' => 'required|array',
        'section_ids.*' => 'integer|distinct|exists:sections,id',
    ]);

    \Illuminate\Support\Facades\DB::transaction(function () use ($faculty, $validated) {
        \App\Models\Section::where('faculty_id', $faculty->id)
            ->update(['faculty_id' => null]);

        \App\Models\Section::whereIn('id', $validated['section_ids'])
            ->update(['faculty_id' => $faculty->id]);
    });

    ActivityLog::create([
    'actor' => 'Admin',
    'action' => 'updated faculty section assignments',
    'module' => 'Faculty Management',
    'description' => $faculty->name,
    'icon' => 'layers-3',
]);

    return redirect()
        ->route('faculty.index')
        ->with('success', 'Faculty sections updated successfully.');

        }

}
