<?php

namespace App\Http\Controllers;

use App\Mail\NewAccountCredentials;
use App\Models\User;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\ActivityLog;
use App\Support\PasswordSetupLink;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

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
        'faculty_number' => [
            'required', 'string', 'max:50',
            'unique:faculties,faculty_number',
        ],
        'name' => 'required|string|max:255',
        'email' => [
            'required', 'email', 'max:255',
            'unique:faculties,email',
            'unique:users,email',
        ],
        'specialization' => 'required|string|max:255',
        'contact_number' => 'nullable|string|max:30',
        'address' => 'nullable|string',
        'status' => 'required|in:Active,Inactive',
    ]);

    $password = Str::password(20);

    try {
        DB::transaction(function () use ($validated, $password) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'role' => 'Faculty',
            ]);

            $faculty = Faculty::create([
                ...$validated,
                'user_id' => $user->id,
            ]);

            ActivityLog::create([
                'actor' => 'Admin',
                'action' => 'added a new faculty member',
                'module' => 'Faculty Management',
                'description' => $faculty->name,
                'icon' => 'user-plus',
            ]);

            $setupLink = app(PasswordSetupLink::class)->create($faculty->email, 'Faculty');

            Mail::to($faculty->email)->send(new NewAccountCredentials(
                $faculty->name,
                $faculty->email,
                'Faculty',
                $setupLink['url'],
            ));
        });
    } catch (TransportExceptionInterface $exception) {
        report($exception);

        throw ValidationException::withMessages([
            'email' => 'The faculty account was not created because its credentials could not be emailed. Check the mail configuration and try again.',
        ]);
    }

    return redirect()
        ->route('faculty')
        ->with('success', 'Faculty account created. Login credentials were sent to the faculty email address.');
}


    
public function update(Request $request, Faculty $faculty)
{
    $validated = $request->validate([
        'faculty_number' => [
            'required',
            'string',
            'max:50',
            Rule::unique('faculties', 'faculty_number')
                ->ignore($faculty->id),
        ],

        'name' => 'required|string|max:255',

        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('faculties', 'email')
                ->ignore($faculty->id),
            Rule::unique('users', 'email')
                ->ignore($faculty->user_id),
        ],

        'specialization' => 'required|string|max:255',
        'contact_number' => 'nullable|string|max:30',
        'address' => 'nullable|string',
        'status' => 'required|in:Active,Inactive',
    ]);

    DB::transaction(function () use ($faculty, $validated) {

        // Update faculty information.
        $faculty->update($validated);

        // Find the linked User account.
        $user = User::query()
            ->whereKey($faculty->user_id)
            ->where('role', 'Faculty')
            ->first();

        // Synchronize name and email.
        if ($user) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
        }

        // Record the update in Activity Logs.
        ActivityLog::create([
            'actor' => 'Admin',
            'action' => 'updated a faculty member',
            'module' => 'Faculty Management',
            'description' => $faculty->name,
            'icon' => 'user-pen',
        ]);

    });

    return redirect()
        ->route('faculty')
        ->with(
            'success',
            'Faculty information and linked user account updated successfully.'
        );
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

        return redirect()->route('faculty');
    }

    
public function destroy(Faculty $faculty)
{
    DB::transaction(function () use ($faculty) {
        $facultyName = $faculty->name;
        $userId = $faculty->user_id;

        // Delete the Faculty profile first
        $faculty->delete();

        // Delete its linked login account
        if ($userId) {
            User::whereKey($userId)
                ->where('role', 'Faculty')
                ->delete();
        }

        ActivityLog::create([
            'actor' => 'Admin',
            'action' => 'deleted a faculty member',
            'module' => 'Faculty Management',
            'description' => $facultyName,
            'icon' => 'trash-2',
        ]);
    });

    return redirect()
        ->route('faculty')
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
        ->route('faculty')
        ->with('success', 'Faculty sections updated successfully.');

        }

}
