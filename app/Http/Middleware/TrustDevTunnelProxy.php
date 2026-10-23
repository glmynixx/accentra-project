<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrustDevTunnelProxy
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower($request->getHost());
        $proxyIp = $request->server->get('REMOTE_ADDR');

        if (
            app()->environment('local')
            && str_ends_with($host, '.devtunnels.ms')
            && $proxyIp
        ) {
            $request->setTrustedProxies(
                [$proxyIp],
                Request::HEADER_X_FORWARDED_PROTO,
            );
        }

        return $next($request);
    }
}
