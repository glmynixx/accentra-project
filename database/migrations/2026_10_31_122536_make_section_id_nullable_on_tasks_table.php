<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('section_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Only roll back after every task has a valid section_id.
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('section_id')->nullable(false)->change();
        });
    }
};

