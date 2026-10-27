<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class FacultyLoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $identifier = trim($credentials['email']);
        $faculty = Faculty::query()
            ->where(function ($query) use ($identifier) {
                $query->where('faculty_number', $identifier)
                    ->orWhereRaw('LOWER(email) = ?', [strtolower($identifier)]);
            })
            ->first();

        $user = $faculty
            ? User::query()->whereKey($faculty->user_id)->where('role', 'Faculty')->first()
            : null;

        $authenticated = $user && Auth::attempt([
            'email' => $user->email,
            'password' => $credentials['password'],
            'role' => 'Faculty',
        ], $request->boolean('remember'));

        if (! $authenticated) {
            throw ValidationException::withMessages([
                'email' => 'Invalid faculty email or password.',
            ]);
        }

        if (! $faculty || $faculty->status !== 'Active') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'Your faculty account is inactive or unavailable.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('faculty.dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('faculty.login');
    }
}
