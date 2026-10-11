import { useMemo, useState } from "react";

import {
  Eye,
  Pencil,
  Trash2,
  X,
  FileText,
  CalendarDays,
  Clock,
  AlertTriangle,
} from "lucide-react";

import Icon from "../components/common/icon";
import CardHeader from "../components/common/cardHeader";
import StatusBadge from "../components/common/statusBadge";
import StatsGrid from "../components/dashboard/statsGrid";
import FacultyLayout from "../components/layout/facultyLayout";

import {
  facultyDashboardSections as sections,
  facultyDashboardTasks as tasks,
  facultyDashboardSubmissions as submissions,
  facultyDashboardDeadlines as deadlines,
} from "../assets/data/facultyData";

// Helper functions for normalizing and formatting date-based deadline values.
function parseDeadline(value) {
  if (!value) return null;

  // Supports YYYY-MM-DD and YYYY-MM-DDTHH:mm.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(String(value));

  const parsed = new Date(
    dateOnly ? `${value}T23:59:00` : value
  );

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDeadline(value) {
  const date = parseDeadline(value);

  if (!date) return "No deadline set";

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDeadlineStatus(deadline, currentStatus) {
  if (currentStatus?.toLowerCase() === "completed") {
    return "Completed";
  }

  if (
    currentStatus?.toLowerCase() === "cancelled" ||
    currentStatus?.toLowerCase() === "canceled"
  ) {
    return "Cancelled";
  }

  const date = parseDeadline(deadline);

  if (!date) return "No Deadline";

  const remaining = date.getTime() - Date.now();

  if (remaining < 0) return "Overdue";
  if (remaining <= 24 * 60 * 60 * 1000) return "Due Soon";

  return "Upcoming";
}

function toDateTimeInput(value) {
  if (!value) return "";

  const date = parseDeadline(value);
  if (!date) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

// Shared panel wrapper for content blocks
function Panel({ title, description, actionText, children }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#C9D5E2] bg-white shadow-[0_5px_25px_rgba(27,53,83,0.06)] transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(27,53,83,0.09)]">
      <CardHeader
        title={title}
        description={description}
        actionText={actionText}
      />
      {children}
    </section>
  );
}

// Badge styles
function FacultyStatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const styles = {
    active: "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
    draft: "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",
    submitted: "border-[#C9D8EA] bg-[#EAF1F9] text-[#3B6FA5]",
    "pending review": "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",
    reviewed: "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
    approved: "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
    "returned for revision": "border-[#F0C9C9] bg-[#FCEAEA] text-[#B54747]",
    overdue: "border-[#F0C9C9] bg-[#FCEAEA] text-[#B54747]",
    upcoming: "border-[#C9D8EA] bg-[#EAF1F9] text-[#3B6FA5]",
    "due soon": "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",
    "no deadline": "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",
    cancelled: "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",
    canceled: "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",
    completed: "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
  };

  const dotStyles = {
    active: "bg-[#31805E]",
    reviewed: "bg-[#31805E]",
    approved: "bg-[#31805E]",
    completed: "bg-[#31805E]",
    submitted: "bg-[#3B6FA5]",
    upcoming: "bg-[#3B6FA5]",
    "pending review": "bg-[#D6A13A]",
    "due soon": "bg-[#D6A13A]",
    overdue: "bg-[#C94B4B]",
    "returned for revision": "bg-[#C94B4B]",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[normalized] ??
        "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          dotStyles[normalized] ?? "bg-[#7C8794]"
        }`}
      />
      {status || "Unknown"}
    </span>
  );
}

// mini avatar
function StudentAvatar({ name }) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D6E2DE] bg-[#36534E]/10 text-xs font-bold text-[#36534E]">
      {initials || "ST"}
    </div>
  );
}

// Empty state shown when a section, task, or deadline list has no items
function EmptyState({ icon, message, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F4F6] text-[#8190A0]">
        <Icon name={icon} size={21} />
      </div>

      <p className="text-sm font-semibold text-[#40566E]">{message}</p>

      {description && (
        <p className="mt-1 max-w-xs text-xs leading-5 text-[#8A98A7]">
          {description}
        </p>
      )}
    </div>
  );
}

// Section summary row with student count and section status.
function SectionRow({ section }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#F7F9FB] sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#36534E]/10 text-[#36534E]">
        <Icon name="layers-3" size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#243A52]">
          {section.name}
        </p>

        <p className="mt-1 truncate text-xs text-[#7A8999]">
          {section.program} · {section.year}
        </p>

        {section.adviser && (
          <p className="mt-1 truncate text-xs text-[#9AA7B5]">
            Adviser: {section.adviser}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-[#243A52]">
          {Number(section.students) || 0}
        </p>
        <p className="mb-2 text-[11px] text-[#7A8999]">Students</p>
        <StatusBadge status={section.status} />
      </div>
    </div>
  );
}

// Task item row
function TaskRow({ task }) {
  const deadlineValue =
    task.deadline ?? task.dueDate ?? task.due ?? task.due_date;

  return (
    <div className="flex min-w-0 items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#F7F9FB] sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF1F9] text-[#3B6FA5]">
        <Icon name="clipboard-list" size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#243A52]">
          {task.title}
        </p>

        <p className="mt-1 truncate text-xs text-[#7A8999]">
          {task.section}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#7A8999]">
          <CalendarDays size={13} />
          <span>
            {deadlineValue
              ? formatDeadline(deadlineValue)
              : "No deadline set"}
          </span>
        </p>
      </div>

      <div className="shrink-0">
        <FacultyStatusBadge status={task.status} />
      </div>
    </div>
  );
}


// Deadline list item
function DeadlineRow({ deadline }) {
  const status = getDeadlineStatus(
    deadline.deadline ?? deadline.dueDate,
    deadline.status
  );

  const isOverdue = status === "Overdue";
  const isDueSoon = status === "Due Soon";
  const isCompleted = status === "Completed";

  const iconStyle = isOverdue
    ? "bg-[#FCEAEA] text-[#B54747]"
    : isDueSoon
      ? "bg-[#FFF4D9] text-[#946A16]"
      : isCompleted
        ? "bg-[#E1F0E8] text-[#267653]"
        : "bg-[#EAF1F9] text-[#3B6FA5]";

  const dateStyle = isOverdue
    ? "font-semibold text-[#B54747]"
    : isDueSoon
      ? "font-semibold text-[#946A16]"
      : "text-[#718096]";

  return (
    <div className="flex min-w-0 items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#F7F9FB] sm:gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <CalendarDays size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#243A52]">
          {deadline.title}
        </p>

        <p className="mt-1 truncate text-xs text-[#7A8999]">
          {deadline.section || "No section specified"}
        </p>

        <p className={`mt-2 flex flex-wrap items-center gap-1.5 text-xs ${dateStyle}`}>
          <Clock size={13} />
          <span>
            {formatDeadline(deadline.deadline ?? deadline.dueDate)}
          </span>
        </p>
      </div>

      <div className="shrink-0">
        <FacultyStatusBadge status={status} />
      </div>
    </div>
  );
}

// Submission table row
function SubmissionRow({ submission, onView, onEdit, onDelete }) {
  const actionButton =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95";

  return (
    <tr className="border-b border-[#E5EBF1] transition-colors duration-150 last:border-b-0 hover:bg-[#F7F9FB]">
      <td className="px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <StudentAvatar name={submission.student} />

          <div className="min-w-0">
            <p className="max-w-[170px] truncate text-sm font-semibold text-[#243A52]">
              {submission.student}
            </p>

            <p className="mt-1 truncate text-xs text-[#9AA7B5]">
              {submission.section}
            </p>
          </div>
        </div>
      </td>

      <td className="max-w-[200px] px-5 py-4">
        <p className="truncate text-sm text-[#50647A]">
          {submission.task}
        </p>
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#7A8999]">
        {submission.date || "—"}
      </td>

      <td className="px-5 py-4">
        <FacultyStatusBadge status={submission.status} />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="View submission"
            aria-label={`View submission from ${submission.student}`}
            onClick={() => onView(submission)}
            className={`${actionButton} border-[#BFCFDF] bg-[#E6EDF4] text-[#1B3553] hover:bg-[#D5E1EC]`}
          >
            <Eye size={15} />
          </button>

          <button
            type="button"
            title="Edit submission"
            aria-label={`Edit submission from ${submission.student}`}
            onClick={() => onEdit(submission)}
            className={`${actionButton} border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100`}
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            title="Delete submission"
            aria-label={`Delete submission from ${submission.student}`}
            onClick={() => onDelete(submission)}
            className={`${actionButton} border-red-200 bg-red-50 text-red-500 hover:bg-red-100`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Modal that previews a student's submission details before editing
function SubmissionModal({ submission, onClose, onEdit }) {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C1C2D]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#142A43] to-[#294B70] px-6 py-5">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
              <FileText size={20} />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C7D8E8]">
              Submission Information
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Submission Details
            </h2>

            <p className="mt-1 text-sm text-[#D5E0EB]">
              Review the student's submitted work information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 bg-[#EEF2F6] p-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#D6E0E9] bg-white p-4">
            <StudentAvatar name={submission.student} />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#243A52]">
                {submission.student || "Unknown student"}
              </p>
              <p className="mt-1 text-xs text-[#7A8999]">
                {submission.section || "No section specified"}
              </p>
            </div>

            <div className="hidden sm:block">
              <FacultyStatusBadge status={submission.status} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#526579]">
              Submission Details
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Task", submission.task || "Not specified"],
                ["Submission Date", submission.date || "Not specified"],
                ["Section", submission.section || "Not specified"],
                ["Submission ID", submission.id ?? "N/A"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#D6E0E9] bg-white p-4"
                >
                  <p className="text-[11px] font-semibold text-[#8190A0]">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#243A52]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#D6E0E9] bg-white p-4 sm:hidden">
            <p className="mb-2 text-xs font-semibold text-[#8190A0]">
              Current Status
            </p>
            <FacultyStatusBadge status={submission.status} />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#D6E0E9] bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#BFD2E5] bg-[#EEF4F9] px-4 py-2.5 text-sm font-semibold text-[#294B70] transition-colors hover:bg-[#E0EAF3]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onEdit(submission)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#294B70]"
          >
            <Pencil size={15} />
            Edit Submission
          </button>
        </div>
      </div>
    </div>
  );
}

// EDIT SUBMISSION MODAL

function EditSubmissionModal({ submission, onClose, onSave }) {
  const [form, setForm] = useState({
    student: submission?.student || "",
    section: submission?.section || "",
    task: submission?.task || "",
    date: submission?.date || "",
    status: submission?.status || "Pending Review",
  });

  if (!submission) return null;

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-[#C9D6E4] bg-white px-3 py-2.5 text-sm text-[#243A52] outline-none transition focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10";

  const labelClass =
    "text-xs font-semibold text-[#526579]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#142A43]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#142A43] to-[#294B70] px-6 py-5">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D5E0EB]">
              Submission Management
            </span>

            <h2 className="mt-3 text-lg font-bold text-white">
              Edit Submission
            </h2>

            <p className="mt-1 text-sm text-[#D5E0EB]">
              Update the submission information and status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave({ ...submission, ...form });
          }}
        >
          <div className="grid grid-cols-1 gap-4 bg-[#EEF2F6] p-5 sm:grid-cols-2 sm:p-6">
            <label className={labelClass}>
              Student Name
              <input
                required
                value={form.student}
                onChange={(event) =>
                  updateField("student", event.target.value)
                }
                className={inputClass}
                placeholder="Enter student name"
              />
            </label>

            <label className={labelClass}>
              Section
              <input
                value={form.section}
                onChange={(event) =>
                  updateField("section", event.target.value)
                }
                className={inputClass}
                placeholder="Enter section"
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Task Title
              <input
                required
                value={form.task}
                onChange={(event) =>
                  updateField("task", event.target.value)
                }
                className={inputClass}
                placeholder="Enter task title"
              />
            </label>

            <label className={labelClass}>
              Submission Date
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  updateField("date", event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Submission Status
              <select
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
                className={inputClass}
              >
                <option value="Submitted">Submitted</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Returned for Revision">
                  Returned for Revision
                </option>
                <option value="Approved">Approved</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-[#D6E0E9] bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#BFD2E5] bg-[#EEF4F9] px-4 py-2.5 text-sm font-semibold text-[#294B70] transition-colors hover:bg-[#E0EAF3]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#294B70]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// DELETE CONFIRMATION
function DeleteSubmissionModal({ submission, onClose, onConfirm }) {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#142A43]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E2BFC3] bg-white shadow-2xl">
        <div className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2BFC3] bg-[#FBEEF0] text-[#A94A55]">
            <Trash2 size={22} />
          </div>

          <h2 className="text-lg font-bold text-[#243A52]">
            Delete Submission?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#718096]">
            Are you sure you want to delete the submission from{" "}
            <span className="font-semibold text-[#243A52]">
              {submission.student}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-[#243A52]">
              {submission.task}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E5EBF1] bg-[#F9FBFC] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#BFD2E5] bg-[#EEF4F9] px-4 py-2.5 text-sm font-semibold text-[#294B70] transition-colors hover:bg-[#E0EAF3]"
          >
            Keep Submission
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#A94A55] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#913C46]"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD 

export default function FacultyDashboard() {
  const [search, setSearch] = useState("");
  const [submissionItems, setSubmissionItems] = useState(submissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [deletingSubmission, setDeletingSubmission] = useState(null);

  const normalizedSearch = search.trim().toLowerCase();

  const matchesSearch = (values) =>
    values
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);

  const filteredSections = useMemo(
    () =>
      sections.filter((section) =>
        matchesSearch([
          section.name,
          section.program,
          section.year,
          section.adviser,
          section.status,
        ])
      ),
    [normalizedSearch]
  );

  const filteredTasks = useMemo(
  () =>
    tasks.filter((task) =>
      matchesSearch([
        task.title,
        task.section,
        task.deadline,
        task.dueDate,
        task.due,
        task.status,
      ])
    ),
  [normalizedSearch]
);

  const filteredSubmissions = useMemo(
    () =>
      submissionItems.filter((submission) =>
        matchesSearch([
          submission.student,
          submission.task,
          submission.section,
          submission.date,
          submission.status,
        ])
      ),
    [normalizedSearch, submissionItems]
  );

  const filteredDeadlines = useMemo(
    () =>
      deadlines.filter((deadline) =>
        matchesSearch([
          deadline.title,
          deadline.section,
          deadline.deadline,
          deadline.dueDate,
          getDeadlineStatus(
            deadline.deadline ?? deadline.dueDate,
            deadline.status
          ),
        ])
      ),
    [normalizedSearch]
  );

  const stats = [
    {
      label: "Assigned Sections",
      value: sections.length,
      icon: "layers-3",
      variant: "navy",
    },
    {
      label: "Total Students",
      value: sections.reduce(
        (total, section) => total + (Number(section.students) || 0),
        0
      ),
      icon: "users",
      variant: "green",
    },
    {
      label: "Active Tasks",
      value: tasks.filter(
        (task) => task.status?.toLowerCase() === "active"
      ).length,
      icon: "clipboard-list",
      variant: "blue",
    },
    {
      label: "Pending Reviews",
      value: submissionItems.filter((submission) =>
        ["pending review", "submitted"].includes(
          submission.status?.toLowerCase()
        )
      ).length,
      icon: "file-clock",
      variant: "teal",
    },
  ];

  const handleEditSubmission = (submission) => {
    setSelectedSubmission(null);
    setEditingSubmission(submission);
  };

  const handleSaveSubmission = (updatedSubmission) => {
    setSubmissionItems((previous) =>
      previous.map((item) =>
        item.id === updatedSubmission.id ? updatedSubmission : item
      )
    );

    setEditingSubmission(null);
  };

  const handleConfirmDelete = () => {
    const deletedId = deletingSubmission?.id;

    setSubmissionItems((previous) =>
      previous.filter((item) => item.id !== deletedId)
    );

    setDeletingSubmission(null);
    setSelectedSubmission((previous) =>
      previous?.id === deletedId ? null : previous
    );
  };

  return (
    <FacultyLayout
      title="Faculty Dashboard"
      showSearch
      search={search}
      onSearchChange={setSearch}
    >
      <div className="space-y-6">
        {normalizedSearch && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C9D5E2] bg-white px-4 py-3">
            <p className="text-sm text-[#50647A]">
              Search results for{" "}
              <span className="font-semibold text-[#243A52]">
                "{search.trim()}"
              </span>
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-[#36534E] transition-colors hover:text-[#243A52]"
            >
              Clear search
            </button>
          </div>
        )}

        <StatsGrid stats={stats} />

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel
            title="Assigned Sections"
            description="Your current academic sections"
            actionText="View Sections"
          >
            <div className="divide-y divide-[#E5EBF1]">
              {filteredSections.length > 0 ? (
                filteredSections.map((section, index) => (
                  <SectionRow
                    key={section.id ?? section.name ?? index}
                    section={section}
                  />
                ))
              ) : (
                <EmptyState
                  icon="layers-3"
                  message="No sections found"
                  description="Try searching for a different section, program, or year level."
                />
              )}
            </div>
          </Panel>

          <Panel
            title="Recent Tasks"
            description="Recently created accounting activities"
            actionText="Task Overview"
          >
            <div className="divide-y divide-[#E5EBF1]">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <TaskRow
                    key={task.id ?? task.title ?? index}
                    task={task}
                    
                  />
                ))
              ) : (
                <EmptyState
                  icon="clipboard-list"
                  message="No tasks found"
                  description="Tasks matching your search will appear here."
                />
              )}
            </div>
          </Panel>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel
            title="Upcoming Deadlines"
            description="Track activity deadlines and submission status"
            actionText="View Deadlines"
          >
            <div className="divide-y divide-[#E5EBF1]">
              {filteredDeadlines.length > 0 ? (
                filteredDeadlines.map((deadline, index) => (
                  <DeadlineRow
                    key={deadline.id ?? deadline.title ?? index}
                    deadline={deadline}
                  />
                ))
              ) : (
                <EmptyState
                  icon="calendar-clock"
                  message="No deadlines found"
                  description="There are no deadlines matching your search."
                />
              )}
            </div>
          </Panel>

          <Panel
            title="Recent Submissions"
            description="Latest student task submissions"
            actionText="View Submissions"
          >
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                    {["Student", "Task", "Date", "Status", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission, index) => (
                      <SubmissionRow
                        key={
                          submission.id ??
                          `${submission.student}-${index}`
                        }
                        submission={submission}
                        onView={setSelectedSubmission}
                        onEdit={handleEditSubmission}
                        onDelete={setDeletingSubmission}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState
                          icon="file-text"
                          message="No submissions found"
                          description="Student submissions matching your search will appear here."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {selectedSubmission && (
          <SubmissionModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onEdit={handleEditSubmission}
          />
        )}

        {editingSubmission && (
          <EditSubmissionModal
            key={editingSubmission.id ?? editingSubmission.student}
            submission={editingSubmission}
            onClose={() => setEditingSubmission(null)}
            onSave={handleSaveSubmission}
          />
        )}

        {deletingSubmission && (
          <DeleteSubmissionModal
            submission={deletingSubmission}
            onClose={() => setDeletingSubmission(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </FacultyLayout>
  );
}