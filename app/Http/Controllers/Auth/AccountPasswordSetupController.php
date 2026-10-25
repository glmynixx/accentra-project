<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AccountPasswordSetupController extends Controller
{
    public function edit(Request $request, string $token)
    {
        $setupToken = $this->findSetupToken($token);

        abort_unless(
            $setupToken && $this->accountForSetupToken($setupToken),
            403,
            'This password setup link is invalid or has expired.',
        );

        return Inertia::render('accountSetupPassword', [
            'accountType' => $setupToken->account_type,
            'updateUrl' => $request->fullUrl(),
        ]);
    }

    public function update(Request $request, string $token)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', PasswordRule::min(12)],
        ]);

        $accountType = DB::transaction(function () use ($token, $validated): ?string {
            $setupToken = $this->findSetupToken($token, lockForUpdate: true);

            if (! $setupToken || ! ($account = $this->accountForSetupToken($setupToken))) {
                return null;
            }

            $account->forceFill([
                'password' => Hash::make($validated['password']),
                'remember_token' => Str::random(60),
            ])->save();

            DB::table('account_password_setup_tokens')
                ->where('email', $setupToken->email)
                ->where('account_type', $setupToken->account_type)
                ->delete();

            return $setupToken->account_type;
        });

        if (! $accountType) {
            throw ValidationException::withMessages([
                'password' => 'This password setup link is invalid or has expired. Request a new link from your administrator.',
            ]);
        }

        $loginRoute = match ($accountType) {
            'Admin' => 'login',
            'Student' => 'student.login',
            default => 'faculty.login',
        };

        return to_route($loginRoute)
            ->with('success', 'Password updated successfully. Please log in.');
    }

    private function findSetupToken(string $token, bool $lockForUpdate = false): ?object
    {
        $query = DB::table('account_password_setup_tokens')
            ->where('token_hash', hash('sha256', $token));

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        $setupToken = $query->first();

        return $setupToken && now()->lessThan($setupToken->expires_at)
            ? $setupToken
            : null;
    }

    private function accountForSetupToken(object $setupToken): User|Student|null
    {
        if ($setupToken->account_type === 'Student') {
            return Student::query()
                ->whereRaw('LOWER(email) = ?', [$setupToken->email])
                ->where('status', 'Active')
                ->first();
        }

        if ($setupToken->account_type === 'Faculty') {
            return User::query()
                ->whereRaw('LOWER(email) = ?', [$setupToken->email])
                ->where('role', 'Faculty')
                ->whereHas('faculty', fn ($query) => $query->where('status', 'Active'))
                ->first();
        }

        if ($setupToken->account_type === 'Admin') {
            return User::query()
                ->whereRaw('LOWER(email) = ?', [$setupToken->email])
                ->where('role', 'Admin')
                ->first();
        }

        return null;
    }
}
