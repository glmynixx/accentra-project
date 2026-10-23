<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
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
            'login' => ['required_without:email', 'nullable', 'string', 'max:255'],
            'email' => ['required_without:login', 'nullable', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $identifierField = $request->filled('login') ? 'login' : 'email';
        $identifier = trim($validated[$identifierField]);

        $student = Student::query()
            ->where(function ($query) use ($identifier) {
                $query->whereRaw('LOWER(email) = ?', [Str::lower($identifier)])
                    ->orWhere('student_number', $identifier);
            })
            ->where('status', 'Active')
            ->first();

        if (! $student || ! $student->password || ! Hash::check($validated['password'], $student->password)) {
            throw ValidationException::withMessages([
                $identifierField => 'Invalid student email, student number, or password.',
            ]);
        }

        Auth::guard('student')->login($student, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('student')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('student.login');
    }
}
