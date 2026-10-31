import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    CheckCircle2,
    CalendarDays,
    BookOpen,
    Send,
    Paperclip,
    AlertCircle,
    Ban,
    Users,
    User,

} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

const ITEMS_PER_PAGE = 6;
const STUDENTS_PER_PAGE = 8;

const panelClass =
    "rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px]";

const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#A9E5D2] px-4 py-2.5 text-sm font-bold text-[#10251F] transition hover:bg-[#C0F0E1] disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50";

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#091725] px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#A9E5D2]/70";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-300";

const actionButtonBase =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0C1B2A] disabled:cursor-not-allowed disabled:opacity-30";

const actionButtonStyles = {
    view: `${actionButtonBase} border-sky-400/20 bg-sky-400/[0.07] text-sky-300 hover:border-sky-400/40 hover:bg-sky-400/15 focus:ring-sky-400/40`,
    edit: `${actionButtonBase} border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.06] text-[#A9E5D2] hover:border-[#A9E5D2]/40 hover:bg-[#A9E5D2]/15 focus:ring-[#A9E5D2]/40`,
    publish: `${actionButtonBase} border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-400/15 focus:ring-emerald-400/40`,
    cancel: `${actionButtonBase} border-amber-400/20 bg-amber-400/[0.07] text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/15 focus:ring-amber-400/40`,
    delete: `${actionButtonBase} border-rose-400/20 bg-rose-400/[0.07] text-rose-300 hover:border-rose-400/40 hover:bg-rose-400/15 focus:ring-rose-400/40`,
};

const emptyForm = {
    title: "",
    topic: "",
    subject_id: "",
    due: "",
    points: "100",
    status: "Draft",
    description: "",
    instructions: "",
    attachment: null,
    remove_attachment: false,
};

const getSubjectName = (subject) =>
    subject?.subject_name ??
    subject?.name ??
    subject?.title ??
    "Untitled Subject";

const getSubjectCode = (subject) =>
    subject?.subject_code ?? subject?.code ?? "";

const getTaskSubjectName = (task) =>
    task?.subject?.subject_name ??
    task?.subject?.name ??
    task?.subject?.title ??
    task?.subject_name ??
    "Unassigned subject";

const getTaskSectionName = (task) => {
    if (task?.section_id == null) return "All Enrolled Students";
    return typeof task?.section === "string"
        ? task.section
        : task?.section?.section_name ??
          task?.section_name ??
          "Unassigned section";
};

const getDisplayId = (task) => task?.displayId ?? task?.display_id ?? "";

const getStudentName = (student) =>
    student?.full_name ??
    student?.name ??
    [
        student?.first_name,
        student?.middle_name,
        student?.last_name,
    ]
        .filter(Boolean)
        .join(" ") ??
    "Unnamed Student";

const getStudentNumber = (student) =>
    student?.student_number ??
    student?.student_no ??
    student?.usn ??
    student?.student_id ??
    student?.id ??
    "—";

const getStudentSectionId = (student) =>
    student?.section_id ??
    student?.section?.id ??
    student?.sectionId ??
    "";

const getStudentSectionName = (student, sections) => {
    const directName =
        typeof student?.section === "string"
            ? student.section
            : student?.section?.section_name ??
              student?.section?.name ??
              student?.section_name;

    if (directName) return directName;

    const section = sections.find(
        (item) =>
            String(item.id) === String(getStudentSectionId(student)),
    );

    return (
        section?.section_name ??
        section?.name ??
        "Unassigned section"
    );
};


const normalizeSubjectValue = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\\s+/g, " ");

const studentHasSubject = (student, subject) => {
    if (!student || subject == null) return false;

    // A student's subjects may be stored as IDs, subject names, or objects.
    // Compare against every known identifier for the selected subject.
    const subjectValues = [
        typeof subject === "object" ? subject.id : subject,
        typeof subject === "object"
            ? subject.subject_id ?? subject.subject_name ?? subject.name ?? subject.title
            : null,
        typeof subject === "object"
            ? subject.subject_name ?? subject.name ?? subject.title
            : null,
        typeof subject === "object"
            ? subject.subject_code ?? subject.code
            : null,
    ]
        .map(normalizeSubjectValue)
        .filter(Boolean);

    const assignmentValues = [
        student.subject_ids,
        student.subjectIds,
        student.assigned_subject_ids,
        student.subjects,
        student.assignedSubjects,
    ].filter(Array.isArray);

    const hasArrayAssignment = assignmentValues.some((items) =>
        items.some((item) => {
            const values =
                typeof item === "object" && item !== null
                    ? [
                          item.id,
                          item.subject_id,
                          item.subject_name,
                          item.name,
                          item.title,
                          item.subject_code,
                          item.code,
                      ]
                    : [item];

            return values.some((value) => {
                const normalized = normalizeSubjectValue(value);
                return normalized && subjectValues.includes(normalized);
            });
        }),
    );

    const singleSubjectValues = [
        student.subject_id,
        student.assigned_subject_id,
        student.subject_name,
    ]
        .map(normalizeSubjectValue)
        .filter(Boolean);

    return (
        hasArrayAssignment ||
        singleSubjectValues.some((value) => subjectValues.includes(value))
    );
};

const formatDate = (value) => {
    if (!value) return "No due date";

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getAttachmentName = (attachment) => {
    if (!attachment) return "";

    if (typeof attachment === "string") {
        return attachment.split("/").pop();
    }

    return attachment.name ?? attachment.filename ?? "Attachment";
};

const isBrowserFile = (value) =>
    typeof File !== "undefined" && value instanceof File;

function StatusBadge({ status }) {
    const currentStatus = status || "Draft";
    const styles = {
        Published:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        Draft: "border-slate-400/20 bg-slate-400/10 text-slate-300",
        Cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        Overdue:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
        Submitted: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    };
    const dots = {
        Published: "bg-emerald-300",
        Draft: "bg-slate-300",
        Cancelled: "bg-rose-300",
        Overdue: "bg-amber-300",
        Submitted: "bg-sky-300",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                styles[currentStatus] ?? styles.Draft
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    dots[currentStatus] ?? "bg-slate-300"
                }`}
            />
            {currentStatus}
        </span>
    );
}

function TaskModal({
    mode,
    task,
    formData,
    setFormData,
    subjects,
    sections,
    onClose,
    onSubmit,
    processing,
}) {
    const [mounted, setMounted] = useState(false);
    const isView = mode === "view";

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [mounted, onClose]);

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const attachment =
        (formData.remove_attachment ? null : formData.attachment) ??
        (!formData.remove_attachment && task?.attachment_path
            ? {
                  name:
                      task.attachment_name ??
                      task.attachment_path.split("/").pop(),
                  url: `/faculty/tasks/${task.id}/attachment`,
              }
            : null);
    const assignedSubject = subjects.find(
        (subject) => String(subject.id) === String(formData.subject_id),
    );
    const assignedSubjectName = assignedSubject
        ? [
              getSubjectCode(assignedSubject),
              getSubjectName(assignedSubject),
          ]
              .filter(Boolean)
              .join(" — ")
        : task
          ? getTaskSubjectName(task)
          : "No subject selected";

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            return window.alert("Please enter a task title.");
        }

        if (!formData.subject_id) {
            return window.alert("Please select an assigned subject.");
        }

        onSubmit(event);
    };

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#030B13]/85 p-3 backdrop-blur-md sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                className="relative my-auto flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0C1B2A] shadow-[0_25px_100px_rgba(0,0,0,0.6)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0C1B2A] px-5 py-4">
                    <div>
                        <h2
                            id="task-modal-title"
                            className="font-bold text-white"
                        >
                            {isView
                                ? "Task Details"
                                : mode === "edit"
                                  ? "Edit Task"
                                  : "Create Task"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {isView
                                ? "Review the details of this task."
                                : "Provide the details for your accounting task."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                    {isView ? (
                        <div className="space-y-5">
                            <div className="rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.05] p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#A9E5D2]">
                                            {getSubjectCode(
                                                subjects.find(
                                                    (subject) =>
                                                        String(subject.id) ===
                                                        String(
                                                            task?.subject_id ??
                                                                task?.subject?.id,
                                                        ),
                                                ),
                                            ) || "Accounting Subject"}
                                        </p>

                                        <h3 className="break-words text-xl font-bold text-white">
                                            {task?.title || "Untitled Task"}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {task?.topic || "No topic specified"}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-500">
                                            ID: {getDisplayId(task) || task?.id}
                                        </p>
                                    </div>

                                    <StatusBadge status={task?.status} />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    ["Subject", getTaskSubjectName(task)],
                                    ["Section", getTaskSectionName(task)],
                                    [
                                        "Due Date",
                                        formatDate(task?.due ?? task?.due_date),
                                    ],
                                    ["Points", task?.points ?? 100],
                                    [
                                        "Assigned Students",
                                        task?.recipient_count ??
                                            task?.recipient_student_ids?.length ??
                                            "Not specified",
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                                    >
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 break-words text-sm text-slate-200">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className={labelClass}>Description</p>
                                <div className="min-h-20 whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-[#091725] p-4 text-sm leading-6 text-slate-300">
                                    {task?.description ||
                                        "No description provided."}
                                </div>
                            </div>

                            <div>
                                <p className={labelClass}>Instructions</p>
                                <div className="min-h-20 whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-[#091725] p-4 text-sm leading-6 text-slate-300">
                                    {task?.instructions ||
                                        "No additional instructions."}
                                </div>
                            </div>

                            {attachment && (
                                <div className="flex items-center gap-2 break-all rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.04] p-3 text-sm text-[#A9E5D2]">
                                    <Paperclip size={16} className="shrink-0" />
                                    {getAttachmentName(attachment)}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={buttonSecondary}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSubmit(null, "edit", task)}
                                    className={buttonPrimary}
                                >
                                    <Pencil size={15} />
                                    Edit Task
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Task Title *</label>
                                <input
                                    required
                                    maxLength={255}
                                    className={inputClass}
                                    value={formData.title}
                                    onChange={(e) =>
                                        updateField("title", e.target.value)
                                    }
                                    placeholder="e.g. Journal Entries Activity"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Topic</label>
                                <input
                                    className={inputClass}
                                    required
                                    value={formData.topic}
                                    onChange={(e) =>
                                        updateField("topic", e.target.value)
                                    }
                                    placeholder="e.g. Adjusting Entries"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Assigned Subject *
                                    </label>
                                    <div
                                        className={`${inputClass} flex min-h-10.5 items-center`}
                                    >
                                        {assignedSubjectName}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.05] p-3 sm:col-span-2">
                                    <p className="text-xs font-semibold text-[#A9E5D2]">
                                        All Enrolled Students
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        This task will be available to every student enrolled in the selected subject, regardless of section.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelClass}>Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        className={inputClass}
                                        value={formData.due}
                                        onChange={(e) =>
                                            updateField("due", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Total Points</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className={inputClass}
                                        value={formData.points}
                                        onChange={(e) =>
                                            updateField("points", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    rows={3}
                                    className={`${inputClass} resize-y`}
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        updateField("description", e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Instructions</label>
                                <textarea
                                    rows={3}
                                    className={`${inputClass} resize-y`}
                                    value={formData.instructions}
                                    onChange={(e) =>
                                        updateField("instructions", e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Attachment (max 10 MB)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
                                    className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#A9E5D2] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#10251F]`}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        if (file.size > 10 * 1024 * 1024) {
                                            window.alert(
                                                "The attachment must not exceed 10 MB.",
                                            );
                                            e.target.value = "";
                                            return;
                                        }

                                        updateField("attachment", file);
                                        updateField("remove_attachment", false);
                                    }}
                                />

                                {attachment &&
                                    !isBrowserFile(formData.attachment) && (
                                        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
                                            <span className="break-all">
                                                {getAttachmentName(attachment)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateField("attachment", null);
                                                    updateField(
                                                        "remove_attachment",
                                                        true,
                                                    );
                                                }}
                                                className="shrink-0 text-rose-300 hover:text-rose-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                {isBrowserFile(formData.attachment) && (
                                    <p className="mt-2 text-xs text-[#A9E5D2]">
                                        {formData.attachment.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    className={inputClass}
                                    value={formData.status}
                                    onChange={(e) =>
                                        updateField("status", e.target.value)
                                    }
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={buttonSecondary}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || subjects.length === 0}
                                    className={buttonPrimary}
                                >
                                    <Plus size={16} />
                                    {mode === "edit"
                                        ? "Save Changes"
                                        : "Create Task"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}

function ConfirmationModal({ confirmAction, onClose, onConfirm, processing }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape" && !processing) onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [mounted, onClose, processing]);

    if (!mounted || !confirmAction) return null;

    const { action, task } = confirmAction;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#030B13]/85 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !processing) {
                    onClose();
                }
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0C1B2A] p-5 shadow-[0_25px_100px_rgba(0,0,0,0.6)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                    <AlertCircle size={21} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-white">
                    {action === "delete"
                        ? "Delete this task?"
                        : action === "publish"
                          ? "Publish this task?"
                          : "Cancel this task?"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    {action === "delete"
                        ? "This action will permanently delete the task from the database."
                        : action === "publish"
                          ? "This task will be published and saved in the database."
                          : "This task will be cancelled and saved in the database."}
                </p>

                <p className="mt-3 break-words rounded-lg bg-white/[0.04] p-3 text-sm font-semibold text-slate-200">
                    {task?.title}
                </p>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={buttonSecondary}
                        disabled={processing}
                    >
                        Keep Task
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            action === "delete"
                                ? "bg-rose-600 hover:bg-rose-500"
                                : "bg-[#477F73] hover:bg-[#568F82]"
                        }`}
                        disabled={processing}
                    >
                        {processing ? (
                            "Processing..."
                        ) : (
                            <>
                                {action === "delete" ? (
                                    <Trash2 size={15} />
                                ) : action === "publish" ? (
                                    <Send size={15} />
                                ) : (
                                    <Ban size={15} />
                                )}
                                {action === "delete"
                                    ? "Delete Task"
                                    : action === "publish"
                                      ? "Publish Task"
                                      : "Cancel Task"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default function TaskManagement() {
    const {
        tasks: databaseTasks = [],
        sections: assignedSections = [],
        assignedSubjects: databaseSubjects = [],
        students: databaseStudents = [],
        flash = {},
    } = usePage().props;

    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [sectionFilter, setSectionFilter] = useState("All Sections");
    const [currentPage, setCurrentPage] = useState(1);

    const [studentSearch, setStudentSearch] = useState("");
    const [studentSectionFilter, setStudentSectionFilter] =
        useState("All Sections");
    const [studentPage, setStudentPage] = useState(1);

    const [modalMode, setModalMode] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [processing, setProcessing] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const subjects = useMemo(() =>
        (Array.isArray(databaseSubjects) ? databaseSubjects : []).filter(
            (subject) => subject && subject.id != null,
        ), [databaseSubjects]);

    const sections = useMemo(
        () =>
            (Array.isArray(assignedSections) ? assignedSections : []).filter(
                (section) => section && section.id != null,
            ),
        [assignedSections],
    );

    const students = useMemo(() =>
        (Array.isArray(databaseStudents) ? databaseStudents : []).filter(
            (student) => student && student.id != null,
        ), [databaseStudents]);

    const tasks = useMemo(() =>
        (Array.isArray(databaseTasks) ? databaseTasks : []).map((task) => ({
            ...task,
            displayId: getDisplayId(task) || `TSK-${String(task.id).padStart(3, "0")}`,
            subject_id: task.subject_id ?? task.subject_name ?? "",
            due: task.due ?? task.due_date ?? "",
            status: task.status === "Active" ? "Published" : task.status,
            attachment: task.attachment ?? (task.attachment_path ? {
                name: task.attachment_name ?? task.attachment_path.split("/").pop(),
                url: `/faculty/tasks/${task.id}/attachment`,
            } : null),
        })), [databaseTasks]);

const selectedSubject = selectedSubjectId
    ? subjects.find(
          (subject) => String(subject.id) === String(selectedSubjectId),
      ) ?? null
    : null;

    const subjectTasks = useMemo(
        () =>
            selectedSubject
                ? tasks.filter(
                      (task) =>
                          String(task.subject_id) === String(selectedSubject.id),
                  )
                : [],
        [tasks, selectedSubject],
    );

    const subjectStudents = useMemo(() => {
        if (!selectedSubject) return [];

        return students.filter((student) => {
            

            const studentSectionId = getStudentSectionId(student);

            const matchesSection =
                studentSectionFilter === "All Sections" ||
                String(studentSectionId) === String(studentSectionFilter);

            const query = studentSearch.trim().toLowerCase();

            const matchesSearch =
                !query ||
                [
                    getStudentName(student),
                    getStudentNumber(student),
                    student?.email,
                    getStudentSectionName(student, sections),
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(query),
                );

            const matchesSubject = studentHasSubject(student, selectedSubject);

            return matchesSubject && matchesSection && matchesSearch;
        });
    }, [
        students,
        selectedSubject,
        studentSearch,
        studentSectionFilter,
        sections,
    ]);

    const studentTotalPages = Math.max(
        1,
        Math.ceil(subjectStudents.length / STUDENTS_PER_PAGE),
    );

    const safeStudentPage = Math.min(studentPage, studentTotalPages);

    const paginatedStudents = useMemo(() => {
        const start = (safeStudentPage - 1) * STUDENTS_PER_PAGE;
        return subjectStudents.slice(start, start + STUDENTS_PER_PAGE);
    }, [subjectStudents, safeStudentPage]);

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();
        const tasksToFilter = showAllTasks ? tasks : subjectTasks;

        return tasksToFilter.filter((task) => {
            const matchesSearch =
                !query ||
                [
                    task.title,
                    task.topic,
                    task.description,
                    getTaskSectionName(task),
                    getTaskSubjectName(task),
                    getDisplayId(task),
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(query),
                );

            const matchesStatus =
                statusFilter === "All Status" ||
                String(task.status ?? "Draft") === statusFilter;

            const selectedSection = sections.find(
                (section) => String(section.id) === sectionFilter,
            );

            const matchesSection =
                sectionFilter === "All Sections" ||
                task.section_id == null ||
                String(task.section_id ?? task.section?.id ?? "") ===
                    sectionFilter ||
                getTaskSectionName(task) ===
                    (selectedSection?.section_name ?? selectedSection?.name);

            return matchesSearch && matchesStatus && matchesSection;
        });
    }, [tasks, subjectTasks, showAllTasks, search, statusFilter, sectionFilter, sections]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredTasks.length / ITEMS_PER_PAGE),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedTasks = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTasks, safePage]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("All Status");
        setSectionFilter("All Sections");
        setCurrentPage(1);
        setStudentSearch("");
        setStudentSectionFilter("All Sections");
        setStudentPage(1);
    };

    const openAddModal = (subject = selectedSubject) => {
        setSelectedTask(null);
        setFormData({
            ...emptyForm,
            subject_id: subject?.id != null ? String(subject.id) : "",
        });
        setModalMode("create");
    };

    const openEditModal = (task) => {
        setSelectedTask(task);

        setFormData({
            ...emptyForm,
            title: task.title ?? "",
            topic: task.topic ?? "",
            subject_id: String(task.subject_id ?? task.subject?.id ?? task.subject_name ?? ""),
            due: String(task.due ?? task.due_date ?? "").slice(0, 10),
            points: String(task.points ?? 100),
            status: task.status ?? "Draft",
            description: task.description ?? "",
            instructions: task.instructions ?? "",
            attachment: task.attachment ?? null,
            remove_attachment: false,
        });

        setModalMode("edit");
    };

    const openViewModal = (task) => {
        setSelectedTask(task);
        setModalMode("view");
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedTask(null);
        setFormData(emptyForm);
        setProcessing(false);
    };

    const handleSubmit = (event, overrideMode = null, overrideTask = null) => {
        if (overrideMode === "edit" && overrideTask) {
            openEditModal(overrideTask);
            return;
        }
        event?.preventDefault();
        if (processing) return;

        const isEdit = modalMode === "edit" && selectedTask?.id != null;
        const payload = new FormData();
        payload.append("title", formData.title.trim());
        payload.append("topic", formData.topic.trim());
        payload.append("subject_name", String(formData.subject_id));
        // Empty section_id is converted to null by Laravel; tasks are subject-wide.
        payload.append("section_id", "");
        payload.append("due_date", formData.due);
        payload.append("points", String(formData.points));
        payload.append("description", formData.description.trim());
        payload.append("instructions", formData.instructions.trim());
        payload.append("status", formData.status === "Published" ? "Active" : formData.status);
        if (isBrowserFile(formData.attachment)) {
            payload.append("attachment", formData.attachment);
        }
        if (formData.remove_attachment) payload.append("remove_attachment", "1");
        if (isEdit) payload.append("_method", "PUT");

        setProcessing(true);
        router.post(isEdit ? `/faculty/tasks/${selectedTask.id}` : "/faculty/tasks", payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setCurrentPage(1);
            },
            onError: (errors) => window.alert(Object.values(errors).join("\n") || "Unable to save task."),
            onFinish: () => setProcessing(false),
        });
    };

    const runTaskAction = (action, task) => {
        setConfirmAction({ action, task });
    };

    const confirmTaskAction = () => {
        if (!confirmAction?.task?.id || processing) return;
        const { action, task } = confirmAction;
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmAction(null);
                setCurrentPage(1);
            },
            onError: (errors) => window.alert(Object.values(errors).join("\n") || "Unable to complete task action."),
            onFinish: () => setProcessing(false),
        };
        setProcessing(true);
        if (action === "delete") {
            router.delete(`/faculty/tasks/${task.id}`, options);
        } else if (action === "publish" || action === "cancel") {
            router.patch(`/faculty/tasks/${task.id}/${action}`, {}, options);
        } else {
            setProcessing(false);
        }
    };

    return (
              <FacultyLayout
                        activeMenu="Task Management"
                        showPageInfo={false}
                        showSearch={false}
                    >
            <Head title="Task Management" />

            <div className="space-y-6 pb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                         <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9E5D2]">
                           Faculty Workspace
                        </span>
                        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Task Management
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">
                            Create accounting activities, manage deadlines,
                            and organize tasks by assigned subject.
                        </p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">
                        <CheckCircle2 size={17} />
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
                        <AlertCircle size={17} />
                        {flash.error}
                    </div>
                )}

                <section>
                    <div className={`${panelClass} mb-4 p-5`}>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="font-bold text-white">My Subjects</h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    Select a subject to view its tasks and students, or view every task across all assigned subjects.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAllTasks(true);
                                        setSelectedSubjectId("");
                                        resetFilters();
                                    }}
                                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${showAllTasks ? "border-[#A9E5D2]/40 bg-[#A9E5D2]/10 text-[#A9E5D2]" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-[#A9E5D2]/30 hover:text-[#A9E5D2]"}`}
                                >
                                    View All Tasks
                                </button>
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                                    {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {subjects.map((subject, index) => {
                            const active =
                                String(selectedSubject?.id) === String(subject.id);

                            const subjectTaskCount = tasks.filter(
                                (task) =>
                                    String(task.subject_id) === String(subject.id),
                            ).length;

                            const subjectStudentCount = students.filter((student) =>
                                studentHasSubject(student, subject),
                            ).length;

                            const subjectColors = [
                                {
                                    icon: "bg-[#294B70]/30 text-[#C4D9F0]",
                                    line: "from-[#294B70]/50",
                                },
                                {
                                    icon: "bg-[#477F73]/25 text-[#A9E5D2]",
                                    line: "from-[#477F73]/50",
                                },
                                {
                                    icon: "bg-sky-400/10 text-sky-300",
                                    line: "from-sky-400/40",
                                },
                                {
                                    icon: "bg-slate-400/10 text-slate-300",
                                    line: "from-slate-400/30",
                                },
                            ];

                            const color =
                                subjectColors[index % subjectColors.length];

                            return (
                                <button
                                    key={subject.id}
                                    type="button"
                                    onClick={() => {
                                        setShowAllTasks(false);
                                        setSelectedSubjectId(String(subject.id));
                                        resetFilters();
                                    }}
                                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                                        active
                                            ? "border-[#A9E5D2]/50 bg-[#A9E5D2]/[0.08] shadow-[0_0_25px_rgba(169,229,210,0.06)]"
                                            : "border-white/[0.10] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <div
                                        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${color.line} to-transparent`}
                                    />

                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.icon}`}
                                        >
                                            <BookOpen size={19} />
                                        </div>

                                        {active && (
                                            <CheckCircle2
                                                size={18}
                                                className="text-[#A9E5D2]"
                                            />
                                        )}
                                    </div>

                                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        {getSubjectCode(subject) || "Accounting Subject"}
                                    </p>

                                    <h3 className="mt-1 min-h-[42px] text-sm font-bold leading-5 text-white">
                                        {getSubjectName(subject)}
                                    </h3>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
                                        <span className="text-xs text-slate-400">
                                            {subjectTaskCount} task
                                            {subjectTaskCount !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {subjectStudentCount} student
                                            {subjectStudentCount !== 1 ? "s" : ""}
                                        </span>
                                        <span
                                            className={`text-xs font-semibold ${
                                                active
                                                    ? "text-[#A9E5D2]"
                                                    : "text-slate-500 group-hover:text-slate-300"
                                            }`}
                                        >
                                            {active ? "Selected" : "View"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    </div>
                </section>

                {(selectedSubject || showAllTasks) ? (
                    <>
                        <section
                            className={`${panelClass} flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9E5D2]">
                                    {showAllTasks ? "All Assigned Subjects" : "Selected Subject"}
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-white">
                                    {showAllTasks ? "All Tasks" : getSubjectName(selectedSubject)}
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    {showAllTasks ? "Tasks from every assigned subject." : (getSubjectCode(selectedSubject) || "Accounting Subject")}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => openAddModal(selectedSubject)}
                                className={buttonPrimary}
                            >
                                <Plus size={16} />
                                Add Task
                            </button>
                        </section>

                    {/* TASK MANAGEMENT */}
                        <section className={`${panelClass} overflow-hidden`}>
                            <div className="border-b border-white/[0.08] p-4 sm:p-5">
                                <h2 className="font-bold text-white">
                                    Tasks and Activities
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    View, edit, publish, or manage tasks.
                                </p>
                            </div>

                            <div className="grid gap-3 border-b border-white/[0.08] p-4 sm:grid-cols-3">
                                <div>
                                   
                                    <div className="relative">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                        />
                                        <input
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            placeholder="Search tasks..."
                                            className={`${inputClass} pl-9`}
                                        />
                                    </div>
                                </div>

                                <div>
                                   
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className={inputClass}
                                    >
                                        <option>All Status</option>
                                        <option>Published</option>
                                        <option>Draft</option>
                                        <option>Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                   
                                    <select
                                        value={sectionFilter}
                                        onChange={(e) => {
                                            setSectionFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="All Sections">
                                            All Sections
                                        </option>
                                        {sections.map((section) => (
                                            <option
                                                key={section.id}
                                                value={String(section.id)}
                                            >
                                                {section.section_name ??
                                                    section.name ??
                                                    `Section ${section.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                                            {[
                                                "Task Details",
                                                "Topic",
                                                "Subject",
                                                "Due Date",
                                                "Points",
                                                "Attachment",
                                                "Status",
                                                "Actions",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/[0.06]">
                                        {paginatedTasks.length > 0 ? (
                                            paginatedTasks.map((task) => {
                                                const attachment =
                                                    task.attachment ??
                                                    (task.attachment_path
                                                        ? {
                                                              name:
                                                                  task.attachment_name ??
                                                                  task.attachment_path
                                                                      .split("/")
                                                                      .pop(),
                                                              url: `/faculty/tasks/${task.id}/attachment`,
                                                          }
                                                        : null);

                                                const subject = subjects.find(
                                                    (item) =>
                                                        String(item.id) ===
                                                        String(task.subject_id),
                                                );

                                                return (
                                                    <tr
                                                        key={task.id}
                                                        className="transition hover:bg-white/[0.025]"
                                                    >
                                                        <td className="max-w-[240px] px-4 py-4">
                                                            <p className="text-sm font-semibold text-slate-200">
                                                                {task.title}
                                                            </p>
                                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#A9E5D2]">
                                                                {getSubjectCode(subject) ||
                                                                    "Accounting Subject"}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-slate-500">
                                                                ID: {getDisplayId(task) || task.id}
                                                            </p>
                                                        </td>

                                                        <td className="max-w-[180px] px-4 py-4 text-xs text-slate-400">
                                                            {task.topic || "—"}
                                                        </td>

                                                        <td className="px-4 py-4 text-xs text-slate-300">
                                                            <span className="inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.06] px-2.5 py-1 text-xs font-medium text-[#BDEBDD]">
                                                                <BookOpen size={13} className="shrink-0" />
                                                                <span className="truncate">{getSubjectName(subject || task.subject || { subject_name: task.subject_name })}</span>
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4">
                                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                                <CalendarDays
                                                                    size={14}
                                                                    className="text-slate-500"
                                                                />
                                                                {formatDate(task.due ?? task.due_date)}
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4 text-xs text-slate-300">
                                                            {task.points ?? 100}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {attachment ? (
                                                                <span
                                                                    title={getAttachmentName(attachment)}
                                                                    className="inline-flex max-w-[150px] items-center gap-2 text-xs text-[#A9E5D2]"
                                                                >
                                                                    <Paperclip size={14} />
                                                                    <span className="truncate">
                                                                        {getAttachmentName(attachment)}
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-slate-600">
                                                                    No file
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <StatusBadge status={task.status} />
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    title="View task"
                                                                    aria-label="View task"
                                                                    onClick={() => openViewModal(task)}
                                                                    className={actionButtonStyles.view}
                                                                >
                                                                    <Eye size={15} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    title="Edit task"
                                                                    aria-label="Edit task"
                                                                    onClick={() => openEditModal(task)}
                                                                    className={actionButtonStyles.edit}
                                                                >
                                                                    <Pencil size={15} />
                                                                </button>

                                                                {task.status === "Published" ? (
                                                                    <button
                                                                        type="button"
                                                                        title="Cancel task"
                                                                        aria-label="Cancel task"
                                                                        onClick={() => runTaskAction("cancel", task)}
                                                                        className={actionButtonStyles.cancel}
                                                                    >
                                                                        <Ban size={15} />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        title="Publish task"
                                                                        aria-label="Publish task"
                                                                        onClick={() => runTaskAction("publish", task)}
                                                                        disabled={task.status === "Cancelled"}
                                                                        className={actionButtonStyles.publish}
                                                                    >
                                                                        <Send size={15} />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    title="Delete task"
                                                                    aria-label="Delete task"
                                                                    onClick={() => runTaskAction("delete", task)}
                                                                    className={actionButtonStyles.delete}
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-14 text-center">
                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
                                                        <ClipboardList size={23} />
                                                    </div>
                                                    <p className="mt-3 text-sm font-semibold text-slate-300">
                                                        No tasks found
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Try changing your filters or create a new task.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddModal(selectedSubject)}
                                                        className={`${buttonPrimary} mt-4`}
                                                    >
                                                        <Plus size={15} />
                                                        Create Task
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-slate-500">
                                    {filteredTasks.length === 0
                                        ? "No results"
                                        : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                                              safePage * ITEMS_PER_PAGE,
                                              filteredTasks.length,
                                          )} of ${filteredTasks.length} tasks`}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        aria-label="Previous page"
                                        disabled={safePage <= 1}
                                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition ${page === safePage ? "border-[#A9E5D2] bg-[#A9E5D2] text-[#10251F]" : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        aria-label="Next page"
                                        disabled={safePage >= totalPages}
                                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </section>
                
                        {/* STUDENT LIST */}
                        {selectedSubject && !showAllTasks && <section className={`${panelClass} overflow-hidden`}>
                            <div className="flex flex-col gap-3 border-b border-white/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Users
                                            size={19}
                                            className="text-[#A9E5D2]"
                                        />
                                        <h2 className="font-bold text-white">
                                            Student List
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Students assigned to{" "}
                                        {getSubjectName(selectedSubject)}.
                                    </p>
                                </div>

                                <span className="w-fit rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.06] px-3 py-1 text-xs font-semibold text-[#A9E5D2]">
                                    {subjectStudents.length} student
                                    {subjectStudents.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="grid gap-3 border-b border-white/[0.08] p-4 sm:grid-cols-2">
                                <div>
                                  
                                    <div className="relative">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                        />
                                        <input
                                            value={studentSearch}
                                            onChange={(event) => {
                                                setStudentSearch(event.target.value);
                                                setStudentPage(1);
                                            }}
                                            placeholder="Name or student ID..."
                                            className={`${inputClass} pl-9`}
                                        />
                                    </div>
                                </div>

                                <div>

                                    <select
                                        value={studentSectionFilter}
                                        onChange={(event) => {
                                            setStudentSectionFilter(event.target.value);
                                            setStudentPage(1);
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="All Sections">
                                            All Sections
                                        </option>
                                        {sections.map((section) => (
                                            <option
                                                key={section.id}
                                                value={String(section.id)}
                                            >
                                                {section.section_name ??
                                                    section.name ??
                                                    `Section ${section.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                                            {[
                                                "Student",
                                                "Student ID",
                                                "Section",
                                                "Email",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/[0.06]">
                                        {paginatedStudents.length > 0 ? (
                                            paginatedStudents.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className="transition hover:bg-white/[0.025]"
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                aria-hidden="true"
                                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#A9E5D2]/25 bg-gradient-to-br from-[#A9E5D2]/20 to-[#A9E5D2]/[0.04] text-[11px] font-bold uppercase tracking-wide text-[#BDEBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                                            >
                                                                {getStudentName(student)
                                                                    .split(/\s+/)
                                                                    .filter(Boolean)
                                                                    .slice(0, 2)
                                                                    .map((part) => part[0])
                                                                    .join("") || "ST"}
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-200">
                                                                {getStudentName(student)}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4 text-xs text-slate-300">
                                                        {getStudentNumber(student)}
                                                    </td>

                                                    <td className="px-4 py-4 text-xs text-slate-300">
                                                        {getStudentSectionName(
                                                            student,
                                                            sections,
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-xs text-slate-400">
                                                        {student.email ?? "—"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-12 text-center"
                                                >
                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
                                                        <Users size={23} />
                                                    </div>
                                                    <p className="mt-3 text-sm font-semibold text-slate-300">
                                                        No students found
                                                    </p>
                                                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                                                        There are no students matching
                                                        this subject and filter.
                                                        Students appear here when their section is assigned to this faculty.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-slate-500">
                                    {subjectStudents.length === 0
                                        ? "No students to display"
                                        : `Showing ${
                                              (safeStudentPage - 1) *
                                                  STUDENTS_PER_PAGE +
                                              1
                                          }–${Math.min(
                                              safeStudentPage * STUDENTS_PER_PAGE,
                                              subjectStudents.length,
                                          )} of ${subjectStudents.length} students`}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        aria-label="Previous student page"
                                        disabled={safeStudentPage <= 1}
                                        onClick={() =>
                                            setStudentPage((page) => Math.max(1, page - 1))
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from(
                                        { length: studentTotalPages },
                                        (_, index) => index + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            aria-label={`Go to student page ${page}`}
                                            onClick={() => setStudentPage(page)}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition ${page === safeStudentPage ? "border-[#A9E5D2] bg-[#A9E5D2] text-[#10251F]" : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        aria-label="Next student page"
                                        disabled={safeStudentPage >= studentTotalPages}
                                        onClick={() =>
                                            setStudentPage((page) => Math.min(studentTotalPages, page + 1))
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </section>}
                         </>
                ) : (
                    <section className={`${panelClass} mb-6 flex flex-col items-center justify-center border-dashed px-6 py-12 text-center`}>
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] text-[#A9E5D2]">
                            <BookOpen size={25} />
                        </div>
                        <h2 className="text-base font-bold text-white">Select a subject to view tasks</h2>
                        <p className="mt-1 max-w-md text-sm text-slate-400">Choose one of your enrolled subjects above. Its assigned tasks, status, and deadlines will appear here.</p>
                    </section>
                )}
                {modalMode && (
                    <TaskModal
                        mode={modalMode}
                        task={selectedTask}
                        formData={formData}
                        setFormData={setFormData}
                        subjects={subjects}
                        sections={sections}
                        onClose={closeModal}
                        onSubmit={handleSubmit}
                        processing={processing}
                    />
                )}

                {confirmAction && (
                    <ConfirmationModal
                        confirmAction={confirmAction}
                        onClose={() => setConfirmAction(null)}
                        onConfirm={confirmTaskAction}
                        processing={processing}
                    />
                )}
            </div>
        </FacultyLayout>
    );
}