
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // Faculty who created the task
            $table->foreignId('faculty_id')
                ->constrained('faculties')
                ->restrictOnDelete();

            // Section assigned to the task
            $table->foreignId('section_id')
                ->constrained('sections')
                ->restrictOnDelete();

            // Task information
            $table->string('title');
            $table->string('topic');
            $table->date('due_date');
            $table->unsignedInteger('points')->default(100);

            $table->text('description');
            $table->text('instructions')->nullable();

            // Draft, Active, Completed, Cancelled
            $table->string('status')->default('Draft');

            // Optional file attachment
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();

            $table->timestamps();

            // Prevent duplicate task titles within a section
            // for the same faculty
            $table->unique([
                'faculty_id',
                'section_id',
                'title',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

