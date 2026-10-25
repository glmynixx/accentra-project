<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Mail\NewAccountCredentials;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Support\PasswordSetupLink;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\ActivityLog;


class StudentController extends Controller
{
    // 1. View, search, and filter students
    public function index(Request $request)
    {
        $query = Student::with('sectionRecord');

        // Search students
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('student_number', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by course
        if ($request->filled('course')) {
            $query->where('course', $request->course);
        }

        return Inertia::render('studentManagement', [
            'students' => $query->orderBy('name')->get(),
            'filters' => $request->only([
                'search',
                'status',
                'course',
            ]),

            'availableSections' => \App\Models\Section::where('status', 'Active')
                ->orderBy('section_name')
                ->get(['id', 'section_name', 'course', 'year_level']),

        ]);
        
    }

    // 2. Add student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|max:50|unique:students,student_number',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:students,email',
            'course' => 'required|string|max:100',
            'year_level' => 'required|string|max:50',
            'contact_number' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Inactive',
            'section_id' => [
                'required',
                'integer',
                Rule::exists('sections', 'id')->where('status', 'Active'),
            ],
            'section' => 'nullable|string|max:255',
        ]);

        $password = Str::password(20);

        try {
            DB::transaction(function () use ($validated, $password) {
                $student = Student::create([
                    ...$validated,
                    'password' => Hash::make($password),
                ]);

                ActivityLog::create([
                    'actor' => 'Admin',
                    'action' => 'added a new student',
                    'module' => 'Student Management',
                    'description' => $student->name,
                    'icon' => 'user-plus',
                ]);

                $setupLink = app(PasswordSetupLink::class)->create($student->email, 'Student');

                Mail::to($student->email)->send(new NewAccountCredentials(
                    $student->name,
                    $student->email,
                    'Student',
                    $setupLink['url'],
                ));
            });
        } catch (TransportExceptionInterface $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'email' => 'The student account was not created because its credentials could not be emailed. Check the mail configuration and try again.',
            ]);
        }

        return redirect()
            ->route('students')
            ->with('success', 'Student added. Login credentials were sent to the student email address.');
    }

    // 3. View student information
    public function show(Student $student)
    {
        return response()->json($student);
    }

    // 4. Edit student information
    
public function update(Request $request, Student $student)
{
    $validated = $request->validate([
        'student_number' => [
            'required',
            'string',
            'max:50',
            Rule::unique('students', 'student_number')
                ->ignore($student->id),
        ],
        'name' => 'required|string|max:255',
        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('students', 'email')
                ->ignore($student->id),
        ],
        'course' => 'required|string|max:100',
        'year_level' => 'required|string|max:50',
        'section_id' => 'required|integer|exists:sections,id',
        'section' => 'nullable|string|max:255',
        'contact_number' => 'nullable|string|max:30',
        'address' => 'nullable|string|max:255',
        'status' => 'required|in:Active,Inactive',
    ]);

    $student->update($validated);

    ActivityLog::create([
    'actor' => 'Admin',
    'action' => 'updated a student',
    'module' => 'Student Management',
    'description' => $student->name,
    'icon' => 'user-pen',
]);

    return redirect()
        ->route('students')
        ->with('success', 'Student updated successfully!');
}


    // 5. Activate or Deactivate Student
    public function updateStatus(Request $request, Student $student)
    {
        // Validate the requested status
        $validated = $request->validate([
            'status' => 'required|in:Active,Inactive',
        ]);

        // Update the student's status in MySQL
        $student->update(['status' => $validated['status']]);

        ActivityLog::create([
        'actor' => 'Admin',
        'action' => strtolower($validated['status']) === 'active'
            ? 'activated a student'
            : 'deactivated a student',
        'module' => 'Student Management',
        'description' => $student->name,
        'icon' => 'user-check',
    ]);

        // Return to Student Management
        return redirect()
            ->route('students')
            ->with(
                'success',
                'Student status updated successfully!'
            );


    }

    
    // 6. Delete Student
    public function destroy(Student $student)
    {
        $student->delete();
        ActivityLog::create([
        'actor' => 'Admin',
        'action' => 'deleted a student',
        'module' => 'Student Management',
        'description' => $student->name,
        'icon' => 'user-minus',
    ]);

        return redirect()
            ->route('students')
            ->with('success', 'Student deleted successfully!');
    }

    
}
