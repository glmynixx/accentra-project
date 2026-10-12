<?php

use App\Models\Task;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('stores task records and attachments using the database fields', function () {
    Storage::fake('local');

    $response = $this->post('/faculty/tasks', [
        'title' => 'Journal Entries Exercise',
        'topic' => 'Journal Entries',
        'section' => 'BSAIS 11CA',
        'due_date' => '2026-10-20',
        'points' => '100',
        'status' => 'Draft',
        'description' => 'Complete the journal entries.',
        'instructions' => 'Show your work.',
        'date_created' => '2026-10-12',
        'attachment' => UploadedFile::fake()->create(
            'instructions.pdf',
            20,
            'application/pdf',
        ),
    ]);

    $task = Task::query()->firstOrFail();
    $attachmentPath = $task->attachment_path;

    $response
        ->assertCreated()
        ->assertJsonPath('due_date', '2026-10-20')
        ->assertJsonPath('date_created', '2026-10-12')
        ->assertJsonPath('attachment.name', 'instructions.pdf');

    expect($task->due_date->format('Y-m-d'))->toBe('2026-10-20')
        ->and($task->date_created->format('Y-m-d'))->toBe('2026-10-12')
        ->and($task->attachment_path)->not->toBeNull();

    Storage::disk('local')->assertExists($attachmentPath);

    $this->get(route('faculty.tasks.attachment', $task))->assertOk();

    $this->post("/faculty/tasks/{$task->id}", [
        '_method' => 'PUT',
        'status' => 'Active',
        'remove_attachment' => '1',
    ])
        ->assertOk()
        ->assertJsonPath('status', 'Active')
        ->assertJsonPath('attachment', null);

    $task->refresh();

    expect($task->attachment_path)->toBeNull()
        ->and($task->attachment_name)->toBeNull();

    Storage::disk('local')->assertMissing(
        $attachmentPath,
    );
});
