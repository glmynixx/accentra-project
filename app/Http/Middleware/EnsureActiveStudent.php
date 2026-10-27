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
        $student = Auth::guard('student')->user();

        if ($student) {
            if ($student->status !== 'Active') {
                Auth::guard('student')->logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('student.login')
                    ->withErrors(['login' => 'Your student account is inactive or unavailable.']);
            }

            return $next($request);
        }

        $user = Auth::guard('web')->user();
        if (! $user || $user->role !== 'Student') {
            abort(403, 'Unauthorized student access.');
        }

        $student = $user->student;
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
