<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminLoginIp
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower($request->getHost());

        if (
            app()->environment('local')
            && config('admin.allow_devtunnels')
            && str_ends_with($host, '.devtunnels.ms')
        ) {
            return $next($request);
        }

        $ip = $request->ip();

        if (
            app()->environment('local')
            && in_array($ip, ['127.0.0.1', '::1'], true)
        ) {
            return $next($request);
        }

        $allowedIps = config('admin.allowed_ips', []);

        if ($ip && $allowedIps !== [] && IpUtils::checkIp($ip, $allowedIps)) {
            return $next($request);
        }

        abort(Response::HTTP_FORBIDDEN);
    }
}
