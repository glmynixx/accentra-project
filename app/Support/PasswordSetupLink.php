<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasswordSetupLink
{
    /** @return array{url: string, tokenHash: string} */
    public function create(string $email, string $accountType): array
    {
        $token = Str::random(64);
        $now = now();
        $tokenHash = hash('sha256', $token);

        DB::table('account_password_setup_tokens')->updateOrInsert(
            ['email' => Str::lower(trim($email)), 'account_type' => $accountType],
            [
                'token_hash' => $tokenHash,
                'expires_at' => $now->copy()->addMinutes(60),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        $path = route('password.reset.edit', ['token' => $token], absolute: false);

        return [
            'url' => rtrim((string) config('app.url'), '/').$path,
            'tokenHash' => $tokenHash,
        ];
    }
}
