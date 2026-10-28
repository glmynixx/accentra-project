import { useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    X,
    CalendarDays,
} from "lucide-react";

import Icon from "../components/common/icon";
import CardHeader from "../components/common/cardHeader";
import StatsGrid from "../components/dashboard/statsGrid";
import FacultyLayout from "../components/layout/facultyLayout";

import {  
    facultyDashboardSections as sections,
    facultyDashboardTasks as tasks,
    facultyDashboardSubmissions as submissions,
    facultyDashboardDeadlines as deadlines,
} from "../assets/data/facultyData";

function parseDeadline(value) {
    if (!value) return null;

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(String(value));
    const date = new Date(isDateOnly ? `${value}T23:59:00` : value);

    return Number.isNaN(date.getTime()) ? null : date;
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
    const status = currentStatus?.toLowerCase();

    if (status === "completed") return "Completed";
    if (["cancelled", "canceled"].includes(status)) return "Cancelled";

    const date = parseDeadline(deadline);

    if (!date) return "No Deadline";
    if (date.getTime() < Date.now()) return "Overdue";
    if (date.getTime() - Date.now() <= 86400000) return "Due Soon";

    return "Upcoming";
}

function Panel({ title, description, actionText, children }) {
    return (
        <section
            className="
                min-w-0 overflow-hidden rounded-2xl
                border border-white/[0.13]
                bg-gradient-to-br from-white/[0.105] to-white/[0.025]
                p-5
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)]
                backdrop-blur-[22px]
                transition-all duration-300
                hover:border-[#A9E5D2]/20
                sm:p-6
            "
        >
            <CardHeader
                title={title}
                description={description}
                actionText={actionText}
            />

            {children}
        </section>
    );
}

function StatusBadge({ status }) {
    const normalized = String(status || "Unknown").toLowerCase();

    const colors = {
        active: "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        approved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        reviewed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        submitted: "border-sky-400/20 bg-sky-400/10 text-sky-300",
        upcoming: "border-sky-400/20 bg-sky-400/10 text-sky-300",
        "no deadline": "border-white/10 bg-white/[0.05] text-white/50",
        "pending review": "border-amber-400/20 bg-amber-400/10 text-amber-300",
        "due soon": "border-amber-400/20 bg-amber-400/10 text-amber-300",
        overdue: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        cancelled: "border-white/10 bg-white/[0.05] text-white/50",
        "returned for revision":
            "border-rose-400/20 bg-rose-400/10 text-rose-300",
    };

    return (
        <span
            className={`
                inline-flex whitespace-nowrap rounded-full border
                px-2.5 py-1 text-[11px] font-semibold
                ${
                    colors[normalized] ||
                    "border-white/10 bg-white/[0.05] text-white/60"
                }
            `}
        >
            {status || "Unknown"}
        </span>
    );
}

function EmptyState({ icon, message, description }) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div
                className="
                    mb-3 flex h-12 w-12 items-center justify-center rounded-2xl
                    border border-[#A9E5D2]/15 bg-[#477F73]/10
                    text-[#A9E5D2]
                "
            >
                <Icon name={icon} size={21} />
            </div>

            <p className="text-sm font-semibold text-white/80">{message}</p>

            {description && (
                <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                    {description}
                </p>
            )}
        </div>
    );
}

function ItemRow({ icon, title, subtitle, detail, status }) {
    return (
        <div
            className="
                group flex min-w-0 items-center gap-3.5
                px-0 py-4
                transition-colors duration-200
                hover:bg-[#A9E5D2]/[0.035]
            "
        >
            <div
                className="
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    border border-[#A9E5D2]/15 bg-[#477F73]/15
                    text-[#A9E5D2]
                    transition-colors duration-200
                    group-hover:border-[#A9E5D2]/25
                    group-hover:bg-[#477F73]/20
                "
            >
                <Icon name={icon} size={19} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/90">
                    {title || "Untitled"}
                </p>

                <p className="mt-1 truncate text-xs text-white/45">
                    {subtitle || "No details available"}
                </p>

                {detail && (
                    <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-white/40">
                        <CalendarDays size={13} />
                        {detail}
                    </p>
                )}
            </div>

            {status && (
                <div className="shrink-0">
                    <StatusBadge status={status} />
                </div>
            )}
        </div>
    );
}

function StudentAvatar({ name }) {
    const initials = String(name || "Student")
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            className="
                flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                border border-[#A9E5D2]/20 bg-[#477F73]/15
                text-xs font-bold text-[#A9E5D2]
            "
        >
            {initials}
        </div>
    );
}

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div
            className="
                fixed inset-0 z-[100] flex items-center justify-center
                bg-[#020912]/80 p-4 backdrop-blur-md
            "
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                className="
                    max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl
                    border border-white/[0.12] bg-[#0C1B2A]
                    shadow-[0_25px_100px_rgba(0,0,0,0.55)]
                "
            >
                <div
                    className="
                        flex items-start justify-between gap-4
                        border-b border-white/[0.08]
                        bg-gradient-to-r from-[#14283A] to-[#0D1D2C]
                        px-5 py-5 sm:px-6
                    "
                >
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9E5D2]">
                            Submission Management
                        </p>

                        <h2 className="mt-2 text-lg font-bold text-white">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-white/50">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="
                            flex h-9 w-9 shrink-0 items-center justify-center
                            rounded-lg border border-white/10 text-white/60
                            transition-colors hover:border-white/20
                            hover:bg-white/[0.07] hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    required = false,
    type = "text",
    options,
}) {
    const inputClass = `
        mt-1.5 w-full rounded-xl border border-white/[0.10]
        bg-[#071522] px-3 py-2.5 text-sm text-white
        outline-none transition-all
        placeholder:text-white/25
        focus:border-[#A9E5D2]/45 focus:ring-2
        focus:ring-[#A9E5D2]/[0.07]
    `;

    return (
        <label className="block text-xs font-semibold text-white/60">
            {label}

            {options ? (
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                />
            )}
        </label>
    );
}

export default function FacultyDashboard() {
    const [search, setSearch] = useState("");
    const [submissionItems, setSubmissionItems] = useState(submissions);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [deletingSubmission, setDeletingSubmission] = useState(null);

    const query = search.trim().toLowerCase();

    const matchesSearch = (values) =>
        !query ||
        values
            .filter((value) => value !== null && value !== undefined)
            .join(" ")
            .toLowerCase()
            .includes(query);

    const filteredSections = useMemo(
        () =>
            sections.filter((item) =>
                matchesSearch([
                    item.name,
                    item.program,
                    item.year,
                    item.adviser,
                    item.status,
                ])
            ),
        [query]
    );

    const filteredTasks = useMemo(
        () =>
            tasks.filter((item) =>
                matchesSearch([
                    item.title,
                    item.section,
                    item.deadline,
                    item.dueDate,
                    item.due,
                    item.status,
                ])
            ),
        [query]
    );

    const filteredDeadlines = useMemo(
        () =>
            deadlines.filter((item) =>
                matchesSearch([
                    item.title,
                    item.section,
                    item.deadline,
                    item.dueDate,
                    getDeadlineStatus(
                        item.deadline ?? item.dueDate,
                        item.status
                    ),
                ])
            ),
        [query]
    );

    const filteredSubmissions = useMemo(
        () =>
            submissionItems.filter((item) =>
                matchesSearch([
                    item.student,
                    item.task,
                    item.section,
                    item.date,
                    item.status,
                ])
            ),
        [query, submissionItems]
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
                (total, section) =>
                    total + (Number(section.students) || 0),
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
            value: submissionItems.filter((item) =>
                ["pending review", "submitted"].includes(
                    item.status?.toLowerCase()
                )
            ).length,
            icon: "file-clock",
            variant: "teal",
        },
    ];

    const saveSubmission = (event) => {
        event.preventDefault();

        const updated = editingSubmission;

        setSubmissionItems((previous) => {
            const exists = previous.some(
                (item) => item.id === updated.id
            );

            if (exists) {
                return previous.map((item) =>
                    item.id === updated.id ? updated : item
                );
            }

            return [...previous, { ...updated, id: Date.now() }];
        });

        setEditingSubmission(null);
    };

    const updateField = (field, value) => {
        setEditingSubmission((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const panelRows = (items, icon, emptyMessage, getRow) =>
        items.length ? (
            <div className="divide-y divide-white/[0.07]">
                {items.map((item, index) => (
                    <div key={item.id ?? item.title ?? item.name ?? index}>
                        {getRow(item, icon)}
                    </div>
                ))}
            </div>
        ) : (
            <EmptyState
                icon={icon}
                message={emptyMessage}
                description="Try changing your search or check back later."
            />
        );

    return (
        <FacultyLayout
            title="Faculty Dashboard"
            showSearch
            search={search}
            onSearchChange={setSearch}
            activeMenu={"Dashboard"}
        >
            <div className="relative min-w-0 space-y-6 text-white">
                {/* Dashboard introduction */}
                <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A9E5D2]">
                            Faculty
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Dashboard Overview
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                            Manage your academic sections, accounting tasks,
                            deadlines, and student submissions in one place.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />

                        <span className="text-xs font-medium text-[#A9E5D2]">
                            Faculty Workspace
                        </span>
                    </div>
                </section>

                {/* Search results */}
                {query && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                        <p className="text-sm text-white/65">
                            Search results for{" "}
                            <span className="font-semibold text-[#A9E5D2]">
                                "{search.trim()}"
                            </span>
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="text-xs font-semibold text-[#A9E5D2] transition-colors hover:text-white"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <section className="min-w-0">
                    <StatsGrid stats={stats} />
                </section>

                {/* Assigned sections and recent tasks */}
                <section className="grid min-w-0 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 max-[1100px]:grid-cols-1">
                    <Panel
                        title="Assigned Sections"
                        description="Your current academic sections"
                       
                    >
                        {panelRows(
                            filteredSections,
                            "layers-3",
                            "No sections found",
                            (section) => (
                                <ItemRow
                                    icon="layers-3"
                                    title={section.name}
                                    subtitle={`${section.program || ""} · ${section.year || ""}`}
                                    detail={
                                        section.adviser
                                            ? `Adviser: ${section.adviser}`
                                            : ""
                                    }
                                    status={section.status}
                                />
                            )
                        )}
                    </Panel>

                    <Panel
                        title="Recent Tasks"
                        description="Recently created accounting activities"
                        
                    >
                        {panelRows(
                            filteredTasks,
                            "clipboard-list",
                            "No tasks found",
                            (task) => (
                                <ItemRow
                                    icon="clipboard-list"
                                    title={task.title}
                                    subtitle={task.section}
                                    detail={formatDeadline(
                                        task.deadline ??
                                            task.dueDate ??
                                            task.due ??
                                            task.due_date
                                    )}
                                    status={task.status}
                                />
                            )
                        )}
                    </Panel>
                </section>

                {/* Upcoming deadlines and recent submissions */}
                <section className="grid min-w-0 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 max-[1100px]:grid-cols-1">
                    <Panel
                        title="Upcoming Deadlines"
                        description="Track activity deadlines and submission status"
                      
                    >
                        {panelRows(
                            filteredDeadlines,
                            "calendar-clock",
                            "No deadlines found",
                            (item) => (
                                <ItemRow
                                    icon="calendar-clock"
                                    title={item.title}
                                    subtitle={
                                        item.section || "No section specified"
                                    }
                                    detail={formatDeadline(
                                        item.deadline ?? item.dueDate
                                    )}
                                    status={getDeadlineStatus(
                                        item.deadline ?? item.dueDate,
                                        item.status
                                    )}
                                />
                            )
                        )}
                    </Panel>

                    <Panel
                        title="Recent Submissions"
                        description="Review and manage student task submissions"
                    
                    >
                        <div className="-mx-5 overflow-x-auto sm:-mx-6">
                            <table className="w-full min-w-[650px] border-collapse text-left">
                                <thead>
                                    <tr className="border-y border-white/[0.08] bg-white/[0.025]">
                                        {[
                                            "Student",
                                            "Task",
                                            "Status",
                                            "Actions",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredSubmissions.length ? (
                                        filteredSubmissions.map((item, index) => (
                                            <tr
                                                key={
                                                    item.id ??
                                                    `${item.student}-${index}`
                                                }
                                                className="border-b border-white/[0.07] transition-colors last:border-0 hover:bg-[#A9E5D2]/[0.035]"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <StudentAvatar
                                                            name={item.student}
                                                        />

                                                        <div className="min-w-0">
                                                            <p className="max-w-[130px] truncate text-sm font-semibold text-white/90">
                                                                {item.student}
                                                            </p>

                                                            <p className="mt-1 max-w-[130px] truncate text-xs text-white/40">
                                                                {item.section}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="max-w-[150px] px-4 py-4">
                                                    <p className="truncate text-sm text-white/65">
                                                        {item.task}
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/35">
                                                        {item.date || "—"}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <StatusBadge status={item.status} />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            title="View submission"
                                                            aria-label="View submission"
                                                            onClick={() =>
                                                                setSelectedSubmission(item)
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                                        >
                                                            <Eye size={15} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title="Edit submission"
                                                            aria-label="Edit submission"
                                                            onClick={() =>
                                                                setEditingSubmission({ ...item })
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2] transition-colors hover:bg-[#477F73]/25"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title="Delete submission"
                                                            aria-label="Delete submission"
                                                            onClick={() =>
                                                                setDeletingSubmission(item)
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-400/15 bg-rose-400/[0.07] text-rose-300 transition-colors hover:bg-rose-400/15"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                <EmptyState
                                                    icon="file-text"
                                                    message="No submissions found"
                                                    description="Submissions matching your search will appear here."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </section>

                {/* View submission modal */}
                {selectedSubmission && (
                    <Modal
                        title="Submission Details"
                        subtitle="Review the student's submitted work information."
                        onClose={() => setSelectedSubmission(null)}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-xl border border-[#A9E5D2]/10 bg-[#A9E5D2]/[0.035] p-4">
                                <StudentAvatar name={selectedSubmission.student} />

                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white">
                                        {selectedSubmission.student}
                                    </p>

                                    <p className="mt-1 text-xs text-white/45">
                                        {selectedSubmission.section}
                                    </p>
                                </div>
                            </div>

                            {[
                                ["Task", selectedSubmission.task],
                                ["Submission Date", selectedSubmission.date],
                                ["Section", selectedSubmission.section],
                                ["Submission ID", selectedSubmission.id],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"
                                >
                                    <p className="text-xs text-white/40">
                                        {label}
                                    </p>

                                    <p className="mt-1 break-words text-sm font-semibold text-white/85">
                                        {value || "Not specified"}
                                    </p>
                                </div>
                            ))}

                            <div className="flex flex-wrap justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSubmission(null)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/[0.05] hover:text-white"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingSubmission({
                                            ...selectedSubmission,
                                        });
                                        setSelectedSubmission(null);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/20 px-4 py-2.5 text-sm font-semibold text-[#A9E5D2] transition-colors hover:bg-[#477F73]/30"
                                >
                                    <Pencil size={15} />
                                    Edit Submission
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Edit submission modal */}
                {editingSubmission && (
                    <Modal
                        title="Edit Submission"
                        subtitle="Update the submission information and status."
                        onClose={() => setEditingSubmission(null)}
                    >
                        <form onSubmit={saveSubmission} className="space-y-4">
                            <Field
                                label="Student Name"
                                required
                                value={editingSubmission.student || ""}
                                onChange={(value) => updateField("student", value)}
                            />

                            <Field
                                label="Section"
                                value={editingSubmission.section || ""}
                                onChange={(value) => updateField("section", value)}
                            />

                            <Field
                                label="Task Title"
                                required
                                value={editingSubmission.task || ""}
                                onChange={(value) => updateField("task", value)}
                            />

                            <Field
                                label="Submission Date"
                                type="date"
                                value={editingSubmission.date || ""}
                                onChange={(value) => updateField("date", value)}
                            />

                            <Field
                                label="Submission Status"
                                value={editingSubmission.status || "Pending Review"}
                                onChange={(value) => updateField("status", value)}
                                options={[
                                    "Submitted",
                                    "Pending Review",
                                    "Reviewed",
                                    "Returned for Revision",
                                    "Approved",
                                ]}
                            />

                            <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingSubmission(null)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/[0.05] hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/20 px-4 py-2.5 text-sm font-semibold text-[#A9E5D2] transition-colors hover:bg-[#477F73]/30"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Delete confirmation modal */}
                {deletingSubmission && (
                    <Modal
                        title="Delete Submission?"
                        subtitle="This action cannot be undone."
                        onClose={() => setDeletingSubmission(null)}
                    >
                        <p className="text-sm leading-6 text-white/65">
                            Are you sure you want to delete the submission from{" "}
                            <strong className="text-white">
                                {deletingSubmission.student}
                            </strong>{" "}
                            for{" "}
                            <strong className="text-white">
                                {deletingSubmission.task}
                            </strong>
                            ?
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeletingSubmission(null)}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/[0.05] hover:text-white"
                            >
                                Keep Submission
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const deletedId = deletingSubmission.id;

                                    setSubmissionItems((previous) =>
                                        previous.filter(
                                            (item) => item.id !== deletedId
                                        )
                                    );

                                    setSelectedSubmission((previous) =>
                                        previous?.id === deletedId
                                            ? null
                                            : previous
                                    );

                                    setDeletingSubmission(null);
                                }}
                                className="rounded-xl border border-rose-400/20 bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/25"
                            >
                                Delete Submission
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </FacultyLayout>
    );
}
