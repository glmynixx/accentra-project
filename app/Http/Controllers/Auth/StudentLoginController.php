<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentLoginController extends Controller
{
    public function login(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $identifier = trim($validated['login']);

        // Find the active student by email or student number.
        $student = Student::query()
            ->where(function ($query) use ($identifier) {
                $query->whereRaw(
                    'LOWER(email) = ?',
                    [Str::lower($identifier)]
                )->orWhere('student_number', $identifier);
            })
            ->where('status', 'Active')
            ->first();

        if (!$student || !$student->user_id) {
            throw ValidationException::withMessages([
                'login' => 'Invalid student email, student number, or password.',
            ]);
        }

        // Find the student's linked login account.
        $user = User::query()
            ->whereKey($student->user_id)
            ->where('role', 'Student')
            ->first();

        // Verify password from users table.
        if (
            !$user ||
            !Hash::check($validated['password'], $user->password)
        ) {
            throw ValidationException::withMessages([
                'login' => 'Invalid student email, student number, or password.',
            ]);
        }

        // Authenticate using Laravel's web guard.
        Auth::guard('web')->login(
            $user,
            $request->boolean('remember')
        );

        $request->session()->regenerate();

        return redirect()->route('student.dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('student.login');
    }
}