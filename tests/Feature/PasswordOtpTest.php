<?php

use App\Mail\PasswordResetOtp;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

it('sends an otp and resets an admin password after verification', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'Admin',
    ]);

    $this->from(route('password.request'))
        ->post(route('password.otp.send'), ['email' => $user->email])
        ->assertRedirect(route('password.request'));

    $otp = DB::table('password_reset_otps')
        ->where('email', $user->email)
        ->first();

    expect($otp)->not->toBeNull()
        ->and($otp->code_hash)->not->toBeEmpty();

    $code = null;
    Mail::assertSent(PasswordResetOtp::class, function (PasswordResetOtp $mail) use (&$code) {
        $code = $mail->code;

        return true;
    });

    expect($code)->toMatch('/^\d{6}$/')
        ->and(Hash::check($code, $otp->code_hash))->toBeTrue();

    $newPassword = 'A-strong-new-password-23';

    $this->from(route('password.request'))
        ->post(route('password.otp.reset'), [
            'email' => $user->email,
            'code' => $code,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ])
        ->assertRedirect(route('login'));

    expect(Hash::check($newPassword, $user->fresh()->password))->toBeTrue()
        ->and(DB::table('password_reset_otps')->where('email', $user->email)->exists())->toBeFalse();
});

it('rejects an invalid otp and records the failed attempt', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'Admin',
    ]);

    $this->from(route('password.request'))
        ->post(route('password.otp.send'), ['email' => $user->email]);

    $sentCode = null;
    Mail::assertSent(PasswordResetOtp::class, function (PasswordResetOtp $mail) use (&$sentCode) {
        $sentCode = $mail->code;

        return true;
    });
    $invalidCode = str_pad((string) (((int) $sentCode + 1) % 1_000_000), 6, '0', STR_PAD_LEFT);

    $this->from(route('password.request'))
        ->post(route('password.otp.reset'), [
            'email' => $user->email,
            'code' => $invalidCode,
            'password' => 'A-strong-new-password-23',
            'password_confirmation' => 'A-strong-new-password-23',
        ])
        ->assertSessionHasErrors('code');

    expect(DB::table('password_reset_otps')->where('email', $user->email)->value('attempts'))->toBe(1);
});

it('does not allow an expired otp to reset the password', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => 'Admin',
    ]);

    $this->from(route('password.request'))
        ->post(route('password.otp.send'), ['email' => $user->email]);

    $code = null;
    Mail::assertSent(PasswordResetOtp::class, function (PasswordResetOtp $mail) use (&$code) {
        $code = $mail->code;

        return true;
    });

    $this->travel(11)->minutes();

    $this->from(route('password.request'))
        ->post(route('password.otp.reset'), [
            'email' => $user->email,
            'code' => $code,
            'password' => 'A-strong-new-password-23',
            'password_confirmation' => 'A-strong-new-password-23',
        ])
        ->assertSessionHasErrors('code');

    expect(Hash::check('A-strong-new-password-23', $user->fresh()->password))->toBeFalse();
});

it('returns a generic response when no eligible account exists', function () {
    Mail::fake();

    $this->from(route('password.request'))
        ->post(route('password.otp.send'), ['email' => 'missing@example.com'])
        ->assertRedirect(route('password.request'))
        ->assertSessionHas('status');

    Mail::assertNothingSent();
    expect(DB::table('password_reset_otps')->exists())->toBeFalse();
});
