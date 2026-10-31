<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Section;
use App\Models\Student;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    private function faculty(): Faculty
    {
        return Faculty::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->firstOrFail();
    }

    private function taskForFaculty(int $id): Task
    {
        return Task::where('faculty_id', $this->faculty()->id)
            ->findOrFail($id);
    }

    private function assignedSubjectNames(Faculty $faculty): array
    {
        return collect($faculty->subjects ?? [])
            ->filter(fn ($subject) => is_string($subject) && trim($subject) !== '')
            ->map(fn ($subject) => trim($subject))
            ->unique()
            ->values()
            ->all();
    }

    private function validateTask(Request $request, ?Task $task = null): array
    {
        $faculty = $this->faculty();

        return $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tasks', 'title')
                    ->where('faculty_id', $faculty->id)
                    ->where('section_id', $request->input('section_id'))
                    ->ignore($task?->id),
            ],
            'subject_name' => [
                'required',
                'string',
                'max:255',
                Rule::in($this->assignedSubjectNames($faculty)),
            ],
            'topic' => ['required', 'string', 'max:255'],
            'section_id' => [
                'nullable',
                'integer',
                Rule::exists('sections', 'id')
                    ->where('faculty_id', $faculty->id),
            ],
            'due_date' => ['required', 'date'],
            'points' => ['required', 'integer', 'min:1'],
            'description' => ['required', 'string'],
            'instructions' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Draft', 'Active'])],
            'attachment' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,png,jpg,jpeg',
            ],
            'remove_attachment' => ['nullable', 'boolean'],
        ]);
    }

    public function index()
    {
        $faculty = $this->faculty();
        $assignedSubjectNames = $this->assignedSubjectNames($faculty);

        $assignedSubjects = collect($assignedSubjectNames)
            ->map(fn ($subject) => [
                'id' => $subject,
                'subject_name' => $subject,
                'subject_code' => '',
            ])
            ->all();

        $tasks = Task::where('faculty_id', $faculty->id)
            ->with('section:id,section_name')
            ->latest()
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'subject_id' => $task->subject_name,
                'subject_name' => $task->subject_name,
                'topic' => $task->topic,
                'section_id' => $task->section_id,
                'section' => $task->section_id === null
                    ? 'All Enrolled Students'
                    : ($task->section?->section_name ?? 'Unassigned section'),
                'due' => $task->due_date?->format('Y-m-d'),
                'points' => $task->points,
                'description' => $task->description,
                'instructions' => $task->instructions,
                'status' => $task->status === 'Active'
                    ? 'Published'
                    : $task->status,
                'dateCreated' => $task->created_at?->format('Y-m-d'),
                'attachment' => $task->attachment_path ? [
                    'name' => $task->attachment_name,
                    'url' => route('faculty.tasks.attachment', $task->id),
                ] : null,
            ])
            ->values()
            ->all();

        // Get active students across all sections who are enrolled
        // in at least one subject assigned to this faculty.
        $studentsQuery = Student::query()
            ->where('status', 'Active')
            ->with('sectionRecord:id,section_name');

        if (count($assignedSubjectNames) > 0) {
            $studentsQuery->where(function ($query) use ($assignedSubjectNames) {
                foreach ($assignedSubjectNames as $subjectName) {
                    $query->orWhereJsonContains('subjects', $subjectName);
                }
            });
        } else {
            $studentsQuery->whereRaw('1 = 0');
        }

        $students = $studentsQuery
            ->get([
                'id',
                'student_number',
                'name',
                'email',
                'section_id',
                'subjects',
            ])
            ->map(fn (Student $student) => [
                'id' => $student->id,
                'student_number' => $student->student_number,
                'name' => $student->name,
                'email' => $student->email,
                'section_id' => $student->section_id,
                'section' => $student->sectionRecord ? [
                    'id' => $student->sectionRecord->id,
                    'section_name' => $student->sectionRecord->section_name,
                ] : null,
                'subjects' => $student->subjects ?? [],
            ])
            ->values()
            ->all();

        // Include every section.
        $sections = Section::orderBy('section_name')
            ->get(['id', 'section_name']);

        return Inertia::render('facultyTaskManagement', [
            'tasks' => $tasks,
            'sections' => $sections,
            'assignedSubjects' => $assignedSubjects,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateTask($request);

        $data = collect($validated)
            ->except(['attachment', 'remove_attachment'])
            ->all();

        $data['faculty_id'] = $this->faculty()->id;

        // NULL means students from ALL sections can receive this task,
        // provided they are enrolled in the selected subject.
        $data['section_id'] = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            $data['attachment_path'] = $file->store(
                'task-attachments',
                'local'
            );

            $data['attachment_name'] = $file->getClientOriginalName();
        }

        try {
            Task::create($data);
        } catch (\Throwable $e) {
            if (isset($data['attachment_path'])) {
                Storage::disk('local')->delete($data['attachment_path']);
            }

            throw $e;
        }

        return redirect()->route('faculty.tasks')
            ->with(
                'success',
                'Task created successfully for all students enrolled in this subject.'
            );
    }

    public function update(Request $request, int $id)
    {
        $task = $this->taskForFaculty($id);
        $validated = $this->validateTask($request, $task);

        $data = collect($validated)
            ->except(['attachment', 'remove_attachment'])
            ->all();

        // Edited tasks also become available across all sections.
        $data['section_id'] = null;

        $oldAttachment = $task->attachment_path;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            $data['attachment_path'] = $file->store(
                'task-attachments',
                'local'
            );

            $data['attachment_name'] = $file->getClientOriginalName();
        } elseif ($request->boolean('remove_attachment')) {
            $data['attachment_path'] = null;
            $data['attachment_name'] = null;
        }

        try {
            $task->update($data);
        } catch (\Throwable $e) {
            if (
                isset($data['attachment_path']) &&
                $data['attachment_path'] !== $oldAttachment
            ) {
                Storage::disk('local')->delete($data['attachment_path']);
            }

            throw $e;
        }

        if ($oldAttachment && $oldAttachment !== $task->attachment_path) {
            Storage::disk('local')->delete($oldAttachment);
        }

        return redirect()->route('faculty.tasks')
            ->with('success', 'Task updated successfully.');
    }

    public function publish(int $id)
    {
        $task = $this->taskForFaculty($id);

        abort_unless($task->status === 'Draft', 422);

        $task->update(['status' => 'Active']);

        return redirect()->route('faculty.tasks')
            ->with('success', 'Task published successfully.');
    }

    public function cancel(int $id)
    {
        $task = $this->taskForFaculty($id);

        abort_unless($task->status === 'Active', 422);

        $task->update(['status' => 'Cancelled']);

        return redirect()->route('faculty.tasks')
            ->with('success', 'Task cancelled successfully.');
    }

    public function destroy(int $id)
    {
        $task = $this->taskForFaculty($id);
        $attachment = $task->attachment_path;

        $task->delete();

        if ($attachment) {
            Storage::disk('local')->delete($attachment);
        }

        return redirect()->route('faculty.tasks')
            ->with('success', 'Task deleted successfully.');
    }

    public function downloadAttachment(int $id)
    {
        $task = $this->taskForFaculty($id);

        abort_unless($task->attachment_path, 404);

        $disk = Storage::disk('local');

        abort_unless($disk->exists($task->attachment_path), 404);

        return response()->download(
            $disk->path($task->attachment_path),
            $task->attachment_name ?: basename($task->attachment_path),
        );
    }
}
