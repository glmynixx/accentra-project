<?php

use App\Http\Middleware\TrustDevTunnelProxy;
use Illuminate\Http\Request;

it('trusts forwarded https only for local dev tunnel requests', function () {
    Request::setTrustedProxies([], Request::HEADER_X_FORWARDED_PROTO);
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create(
        'http://accentra-8000.asse.devtunnels.ms/login',
        'GET',
        [],
        [],
        [],
        [
            'REMOTE_ADDR' => '198.51.100.20',
            'HTTP_X_FORWARDED_PROTO' => 'https',
        ],
    );

    app(TrustDevTunnelProxy::class)->handle(
        $request,
        function (Request $request) {
            expect($request->isSecure())->toBeTrue();

            return response()->noContent();
        },
    );
});

it('does not trust forwarded https from non tunnel requests', function () {
    Request::setTrustedProxies([], Request::HEADER_X_FORWARDED_PROTO);
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create(
        'http://example.test/login',
        'GET',
        [],
        [],
        [],
        [
            'REMOTE_ADDR' => '198.51.100.20',
            'HTTP_X_FORWARDED_PROTO' => 'https',
        ],
    );

    app(TrustDevTunnelProxy::class)->handle(
        $request,
        function (Request $request) {
            expect($request->isSecure())->toBeFalse();

            return response()->noContent();
        },
    );
});
