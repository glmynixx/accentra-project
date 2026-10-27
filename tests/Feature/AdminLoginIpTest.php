<?php

use App\Models\User;

it('redirects the root page to the landing page', function () {
    $this->get('/')
        ->assertRedirect('/landingpage');
});

it('blocks the admin login page and submission from an unlisted ip', function () {
    config(['admin.allowed_ips' => ['203.0.113.10']]);

    $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.20'])
        ->get(route('login'))
        ->assertForbidden();

    $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.20'])
        ->post(route('admin.login.submit'), [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])
        ->assertForbidden();
});

it('allows admin login requests from an allowlisted ip', function () {
    config(['admin.allowed_ips' => ['203.0.113.10']]);

    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->get(route('login'))
        ->assertOk();
});

it('allows localhost for admin login in the local environment', function () {
    app()->detectEnvironment(fn () => 'local');
    config(['admin.allowed_ips' => []]);

    $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
        ->get(route('login'))
        ->assertOk();
});

it('allows admin login through a dev tunnel in the local environment', function () {
    app()->detectEnvironment(fn () => 'local');
    config([
        'admin.allow_devtunnels' => true,
        'admin.allowed_ips' => [],
    ]);

    $this->withServerVariables([
        'REMOTE_ADDR' => '198.51.100.20',
    ])->get('http://accentra-8000.asse.devtunnels.ms/login')
        ->assertOk();
});

it('keeps an admin authenticated through the dev tunnel after login', function () {
    app()->detectEnvironment(fn () => 'local');
    config([
        'admin.allow_devtunnels' => true,
        'admin.allowed_ips' => [],
    ]);

    $password = 'A-strong-admin-password-23';
    User::factory()->create([
        'email' => 'tunnel-admin@example.com',
        'password' => $password,
        'role' => 'Admin',
    ]);

    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);

    $this->withServerVariables([
        'REMOTE_ADDR' => '198.51.100.20',
    ])->post('https://accentra-8000.asse.devtunnels.ms/login', [
        'email' => 'tunnel-admin@example.com',
        'password' => $password,
    ])->assertRedirect('/dashboard')
        ->assertSessionHasNoErrors();

    $this->assertAuthenticatedAs(User::where('email', 'tunnel-admin@example.com')->first(), 'web');
    $this->withServerVariables([
        'REMOTE_ADDR' => '198.51.100.20',
    ])->get('https://accentra-8000.asse.devtunnels.ms/dashboard')
        ->assertOk();
});

it('does not allow a dev tunnel through the admin ip restriction outside local', function () {
    app()->detectEnvironment(fn () => 'production');
    config([
        'admin.allow_devtunnels' => true,
        'admin.allowed_ips' => [],
    ]);

    $this->withServerVariables([
        'REMOTE_ADDR' => '198.51.100.20',
    ])->get('http://accentra-8000.asse.devtunnels.ms/login')
        ->assertForbidden();
});
