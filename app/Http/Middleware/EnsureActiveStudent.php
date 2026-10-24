<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveStudent
{
    public function handle(Request $request, Closure $next): Response
    {
        // Get the authenticated user from the web guard.
        $user = $request->user();

        // Check that the user has the Student role.
        if (!$user || $user->role !== 'Student') {
            abort(403, 'Unauthorized student access.');
        }

        // Get the Student profile linked to this user.
        $student = $user->student;

        // Check that the Student profile exists and is active.
        if (!$student || $student->status !== 'Active') {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('student.login')
                ->withErrors([
                    'login' => 'Your student account is inactive or unavailable.',
                ]);
        }

        return $next($request);
    }
}
