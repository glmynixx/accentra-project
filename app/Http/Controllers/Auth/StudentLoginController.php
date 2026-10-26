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
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $email = Str::lower(trim($validated['email']));

        // Find an active student using their email address.
        $student = Student::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->where('status', 'Active')
            ->first();

        if (!$student || !$student->user_id) {
            throw ValidationException::withMessages([
                'email' => 'Invalid student email or password.',
            ]);
        }

        // Find the linked Student user account.
        $user = User::query()
            ->whereKey($student->user_id)
            ->where('role', 'Student')
            ->first();

        // Verify that the user exists and the password matches.
        if (
            !$user ||
            !Hash::check($validated['password'], $user->password)
        ) {
            throw ValidationException::withMessages([
                'email' => 'Invalid student email or password.',
            ]);
        }

        // Log in the authenticated student.
        Auth::guard('web')->login(
            $user,
            $request->boolean('remember')
        );

        // Regenerate the session to prevent session fixation.
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