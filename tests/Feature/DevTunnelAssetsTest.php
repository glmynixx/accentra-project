<?php

use App\Http\Middleware\UseBuiltAssetsForDevTunnels;
use Illuminate\Foundation\Vite;
use Illuminate\Http\Request;

it('registers the tunnel asset middleware before rendering web pages', function () {
    app()->detectEnvironment(fn () => 'local');

    $response = $this->get('https://accentra-8000.asse.devtunnels.ms/student/login');

    $response->assertOk()
        ->assertDontSee('http://localhost:5173', false)
        ->assertSee('/build/assets/', false);
});

it('uses built assets on local dev tunnel requests even when Vite is running', function () {
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create(
        'http://accentra-8000.asse.devtunnels.ms/student/login',
    );

    app(UseBuiltAssetsForDevTunnels::class)->handle(
        $request,
        fn () => response()->noContent(),
    );

    expect(app(Vite::class)->hotFile())
        ->toBe(storage_path('framework/vite-hot-disabled'))
        ->and(app(Vite::class)->isRunningHot())->toBeFalse();
});

it('keeps Vite hot reload enabled for non tunnel local requests', function () {
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create('http://localhost/student/login');

    app(UseBuiltAssetsForDevTunnels::class)->handle(
        $request,
        fn () => response()->noContent(),
    );

    expect(app(Vite::class)->hotFile())->toBe(public_path('hot'));
});

it('uses built assets for local network IP requests', function () {
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create('http://192.168.100.29:8000/student/login');

    app(UseBuiltAssetsForDevTunnels::class)->handle(
        $request,
        fn () => response()->noContent(),
    );

    expect(app(Vite::class)->hotFile())
        ->toBe(storage_path('framework/vite-hot-disabled'))
        ->and(app(Vite::class)->isRunningHot())->toBeFalse();
});

it('uses built assets when the Dev Tunnel host is forwarded by its proxy', function () {
    app()->detectEnvironment(fn () => 'local');

    $request = Request::create(
        'http://localhost/student/dashboard',
        'GET',
        [],
        [],
        [],
        ['HTTP_X_FORWARDED_HOST' => 'gmh5dm93-8000.asse.devtunnels.ms'],
    );

    app(UseBuiltAssetsForDevTunnels::class)->handle(
        $request,
        fn () => response()->noContent(),
    );

    expect(app(Vite::class)->hotFile())
        ->toBe(storage_path('framework/vite-hot-disabled'))
        ->and(app(Vite::class)->isRunningHot())->toBeFalse();
});
