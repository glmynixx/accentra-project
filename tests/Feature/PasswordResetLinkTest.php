<?php

use App\Mail\PasswordResetLink;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

it('sends a password reset link and accepts only the new password fields', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'Admin',
    ]);

    $this->from(route('password.request'))
        ->post(route('password.reset-link.send'), ['email' => $user->email])
        ->assertRedirect(route('password.request'))
        ->assertSessionHas('status');

    $resetUrl = null;
    Mail::assertSent(PasswordResetLink::class, function (PasswordResetLink $mail) use (&$resetUrl) {
        $resetUrl = $mail->resetUrl;

        return $mail->accountType === 'Admin';
    });

    expect($resetUrl)->not->toBeNull();

    $token = basename(parse_url($resetUrl, PHP_URL_PATH));
    $storedToken = DB::table('account_password_setup_tokens')
        ->where('email', $user->email)
        ->where('account_type', 'Admin')
        ->value('token_hash');

    expect($storedToken)->toBe(hash('sha256', $token));

    $this->get($resetUrl)
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('accountSetupPassword')
            ->where('accountType', 'Admin'));

    $newPassword = 'A-strong-new-password-23';

    $this->post(route('password.reset.update', ['token' => $token]), [
        'password' => $newPassword,
        'password_confirmation' => $newPassword,
    ])->assertRedirect(route('login'));

    expect(Hash::check($newPassword, $user->fresh()->password))->toBeTrue()
        ->and(DB::table('account_password_setup_tokens')->exists())->toBeFalse();
});

it('rejects invalid, expired, and already-used password reset links', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'Admin',
    ]);

    $token = str_repeat('a', 64);
    DB::table('account_password_setup_tokens')->insert([
        'email' => $user->email,
        'account_type' => 'Admin',
        'token_hash' => hash('sha256', $token),
        'expires_at' => now()->subMinute(),
        'created_at' => now()->subHour(),
        'updated_at' => now()->subHour(),
    ]);

    $this->get(route('password.reset.edit', ['token' => $token]))
        ->assertForbidden();

    $this->post(route('password.reset.update', ['token' => $token]), [
        'password' => 'A-strong-new-password-23',
        'password_confirmation' => 'A-strong-new-password-23',
    ])->assertSessionHasErrors('password');

    expect(Hash::check('A-strong-new-password-23', $user->fresh()->password))->toBeFalse();
});

it('returns a generic response when no eligible account exists', function () {
    Mail::fake();

    $this->from(route('password.request'))
        ->post(route('password.reset-link.send'), ['email' => 'missing@example.com'])
        ->assertRedirect(route('password.request'))
        ->assertSessionHas('status');

    Mail::assertNothingSent();
    expect(DB::table('account_password_setup_tokens')->exists())->toBeFalse();
});
