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
        $student = $request->user('student');

        if (! $student || $student->status !== 'Active') {
            Auth::guard('student')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return to_route('student.login');
        }

        return $next($request);
    }
}
