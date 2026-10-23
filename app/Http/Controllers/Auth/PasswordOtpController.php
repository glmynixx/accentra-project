<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetOtp;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class PasswordOtpController extends Controller
{
    private const OTP_EXPIRY_MINUTES = 10;

    private const MAX_OTP_ATTEMPTS = 5;

    public function sendAdminOtp(Request $request): RedirectResponse
    {
        return $this->sendOtp($request, 'Admin');
    }

    public function sendFacultyOtp(Request $request): RedirectResponse
    {
        return $this->sendOtp($request, 'Faculty');
    }

    public function sendStudentOtp(Request $request): RedirectResponse
    {
        return $this->sendOtp($request, 'Student');
    }

    public function resetAdminPassword(Request $request): RedirectResponse
    {
        return $this->resetPassword($request, 'Admin', 'login');
    }

    public function resetFacultyPassword(Request $request): RedirectResponse
    {
        return $this->resetPassword($request, 'Faculty', 'faculty.login');
    }

    public function resetStudentPassword(Request $request): RedirectResponse
    {
        return $this->resetPassword($request, 'Student', 'student.login');
    }

    private function sendOtp(Request $request, string $role): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = Str::lower(trim($validated['email']));
        $user = $this->eligibleUser($email, $role);

        if ($user) {
            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $now = now();

            DB::table('password_reset_otps')->updateOrInsert(
                ['role' => $role, 'email' => $email],
                [
                    'code_hash' => Hash::make($code),
                    'attempts' => 0,
                    'expires_at' => $now->copy()->addMinutes(self::OTP_EXPIRY_MINUTES),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );

            try {
                Mail::to($user->email)->send(new PasswordResetOtp($code));
            } catch (TransportExceptionInterface $exception) {
                DB::table('password_reset_otps')
                    ->where('role', $role)
                    ->where('email', $email)
                    ->delete();

                report($exception);

                throw ValidationException::withMessages([
                    'email' => 'We could not send the reset code. Check your email address or try again later.',
                ]);
            }
        }

        return back()->with(
            'status',
            'If an eligible account exists, a password reset code has been sent to its email address.',
        );
    }

    private function resetPassword(Request $request, string $role, string $loginRoute): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'code' => ['required', 'digits:6'],
            'password' => ['required', 'confirmed', PasswordRule::min(12)],
        ]);

        $email = Str::lower(trim($validated['email']));
        $reset = DB::transaction(function () use ($email, $role, $validated): bool {
            $otp = DB::table('password_reset_otps')
                ->where('role', $role)
                ->where('email', $email)
                ->lockForUpdate()
                ->first();

            if (
                ! $otp
                || $otp->attempts >= self::MAX_OTP_ATTEMPTS
                || now()->greaterThanOrEqualTo($otp->expires_at)
            ) {
                return false;
            }

            if (! Hash::check($validated['code'], $otp->code_hash)) {
                DB::table('password_reset_otps')
                    ->where('role', $role)
                    ->where('email', $email)
                    ->increment('attempts');

                return false;
            }

            $user = $this->eligibleUser($email, $role);

            if (! $user) {
                DB::table('password_reset_otps')
                    ->where('role', $role)
                    ->where('email', $email)
                    ->delete();

                return false;
            }

            $user->forceFill([
                'password' => Hash::make($validated['password']),
                'remember_token' => Str::random(60),
            ])->save();

            DB::table('password_reset_otps')
                ->where('role', $role)
                ->where('email', $email)
                ->delete();

            return true;
        });

        if (! $reset) {
            throw ValidationException::withMessages([
                'code' => 'The code is invalid or expired. Request a new code and try again.',
            ]);
        }

        return to_route($loginRoute)->with('success', 'Your password has been reset. Please log in.');
    }

    private function eligibleUser(string $email, string $role): User|Student|null
    {
        if ($role === 'Student') {
            return Student::query()
                ->whereRaw('LOWER(email) = ?', [$email])
                ->where('status', 'Active')
                ->first();
        }

        $query = User::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->where('role', $role);

        if ($role === 'Faculty') {
            $query->whereHas('faculty', fn ($faculty) => $faculty->where('status', 'Active'));
        }

        return $query->first();
    }
}
