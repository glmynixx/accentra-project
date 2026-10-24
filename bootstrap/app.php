<?php

use App\Http\Middleware\EnsureActiveStudent;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureAdminLoginIp;
use App\Http\Middleware\EnsureFaculty;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TrustDevTunnelProxy;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: ['127.0.0.1', '::1']);

        $middleware->redirectGuestsTo(
            fn (Request $request): string => $request->is('student/*')
                ? route('student.login')
                : route('login'),
        );

        $middleware->redirectUsersTo(function (Request $request): string {
            $user = $request->user();

            return match ($user?->role) {
                'Student' => route('student.dashboard'),
                'Faculty' => route('faculty.dashboard'),
                'Admin' => route('dashboard'),
                default => route('login'),
            };
        });

        $middleware->web(
            prepend: [TrustDevTunnelProxy::class],
            append: [
                HandleInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ],
        );
        $middleware->alias([
            'admin' => EnsureAdmin::class,
            'admin.ip' => EnsureAdminLoginIp::class,
            'faculty' => EnsureFaculty::class,

            // Student middleware

            'student' => EnsureActiveStudent::class,
            'active.student' => EnsureActiveStudent::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
