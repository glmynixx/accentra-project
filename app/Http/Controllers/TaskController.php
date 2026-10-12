<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::query()
            ->orderBy('due_date')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($tasks->map(fn (Task $task) => $this->serializeTask($task)));
    }

    public function downloadAttachment(Task $task): StreamedResponse
    {
        abort_unless(
            $task->attachment_path && Storage::disk('local')->exists($task->attachment_path),
            404,
        );

        return Storage::disk('local')->download(
            $task->attachment_path,
            $task->attachment_name ?? basename($task->attachment_path),
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'topic' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],
            'due_date' => ['required', 'date_format:Y-m-d'],
            'points' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'status' => ['nullable', 'string', 'max:50', Rule::in(['Draft', 'Active', 'Completed', 'Cancelled'])],
            'description' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'date_created' => ['nullable', 'date_format:Y-m-d'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,png,jpg,jpeg'],
        ]);

        $attachment = $request->file('attachment');
        $attachmentPath = $attachment?->store('task-attachments');

        $task = Task::create([
            'title' => trim($validated['title']),
            'topic' => trim($validated['topic']),
            'section' => trim($validated['section']),
            'due_date' => $validated['due_date'],
            'points' => $validated['points'] ?? 100,
            'status' => $validated['status'] ?? 'Draft',
            'description' => $validated['description'] ?? null,
            'instructions' => $validated['instructions'] ?? null,
            'date_created' => $validated['date_created'] ?? now()->toDateString(),
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachment?->getClientOriginalName(),
        ]);

        return response()->json($this->serializeTask($task), 201);
    }

    public function show(Task $task): JsonResponse
    {
        return response()->json($this->serializeTask($task));
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'topic' => ['sometimes', 'required', 'string', 'max:255'],
            'section' => ['sometimes', 'required', 'string', 'max:255'],
            'due_date' => ['sometimes', 'required', 'date_format:Y-m-d'],
            'points' => ['sometimes', 'integer', 'min:1', 'max:1000'],
            'status' => ['sometimes', 'string', 'max:50', Rule::in(['Draft', 'Active', 'Completed', 'Cancelled'])],
            'description' => ['sometimes', 'nullable', 'string'],
            'instructions' => ['sometimes', 'nullable', 'string'],
            'date_created' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'attachment' => ['sometimes', 'nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,png,jpg,jpeg'],
            'remove_attachment' => ['sometimes', 'boolean'],
        ]);

        $previousAttachmentPath = $task->attachment_path;
        $attachment = $request->file('attachment');
        $attachmentPath = $attachment?->store('task-attachments');
        $removeAttachment = (bool) ($validated['remove_attachment'] ?? false);

        $payload = [
            'title' => $validated['title'] ?? $task->title,
            'topic' => $validated['topic'] ?? $task->topic,
            'section' => $validated['section'] ?? $task->section,
            'due_date' => $validated['due_date'] ?? $task->due_date,
            'points' => $validated['points'] ?? $task->points,
            'status' => $validated['status'] ?? $task->status,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $task->description,
            'instructions' => array_key_exists('instructions', $validated) ? $validated['instructions'] : $task->instructions,
            'date_created' => array_key_exists('date_created', $validated) ? $validated['date_created'] : $task->date_created,
            'attachment_path' => $attachmentPath ?? ($removeAttachment ? null : $task->attachment_path),
            'attachment_name' => $attachment
                ? $attachment->getClientOriginalName()
                : ($removeAttachment ? null : $task->attachment_name),
        ];

        $task->fill($payload);
        $task->save();

        if (($attachment || $removeAttachment) && $previousAttachmentPath) {
            Storage::disk('local')->delete($previousAttachmentPath);
        }

        return response()->json($this->serializeTask($task));
    }

    public function destroy(Task $task): JsonResponse
    {
        $attachmentPath = $task->attachment_path;
        $task->delete();

        if ($attachmentPath) {
            Storage::disk('local')->delete($attachmentPath);
        }

        return response()->json(['message' => 'Task deleted successfully.']);
    }

    private function serializeTask(Task $task): array
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'topic' => $task->topic,
            'section' => $task->section,
            'due_date' => $task->due_date?->format('Y-m-d') ?? null,
            'points' => (int) ($task->points ?? 100),
            'status' => $task->status,
            'description' => $task->description,
            'instructions' => $task->instructions,
            'date_created' => $task->date_created?->format('Y-m-d') ?? null,
            'attachment' => $task->attachment_path ? [
                'name' => $task->attachment_name ?? basename($task->attachment_path),
                'url' => route('faculty.tasks.attachment', $task),
            ] : null,
            'created_at' => $task->created_at?->toDateTimeString(),
            'updated_at' => $task->updated_at?->toDateTimeString(),
        ];
    }
}
