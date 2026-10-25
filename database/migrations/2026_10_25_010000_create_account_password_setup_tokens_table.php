<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_password_setup_tokens', function (Blueprint $table) {
            $table->string('email');
            $table->string('account_type', 20);
            $table->string('token_hash', 64);
            $table->timestamp('expires_at');
            $table->timestamps();
            $table->primary(['email', 'account_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_password_setup_tokens');
    }
};
