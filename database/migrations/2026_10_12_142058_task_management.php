<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('topic');
            $table->string('section');
            $table->date('due_date');
            $table->unsignedInteger('points')->default(100);
            $table->string('status')->default('Draft');
            $table->text('description')->nullable();
            $table->longText('instructions')->nullable();
            $table->date('date_created')->nullable();
            $table->timestamps();

            $table->index(['section', 'status']);
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
