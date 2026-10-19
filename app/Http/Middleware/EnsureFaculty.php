<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFaculty
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            ! $request->user() ||
            $request->user()->role !== 'Faculty' ||
            ! $request->user()->faculty ||
            $request->user()->faculty->status !== 'Active'
        ) {
            abort(403, 'Unauthorized faculty access.');
        }

        return $next($request);
    }
}
