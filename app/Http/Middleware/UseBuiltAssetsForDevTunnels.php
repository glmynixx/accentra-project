<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Vite;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UseBuiltAssetsForDevTunnels
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower($request->getHost());
        $forwardedHost = strtolower(
            trim(explode(',', (string) $request->headers->get('X-Forwarded-Host', ''))[0]),
        );
        $isLanAddress = filter_var($host, FILTER_VALIDATE_IP)
            && ! in_array($host, ['127.0.0.1', '::1'], true);

        $hotFile = app()->environment('local')
            && (
                str_ends_with($host, '.devtunnels.ms')
                || str_ends_with($forwardedHost, '.devtunnels.ms')
                || $isLanAddress
            )
                ? storage_path('framework/vite-hot-disabled')
                : public_path('hot');

        app(Vite::class)->useHotFile($hotFile);

        return $next($request);
    }
}
