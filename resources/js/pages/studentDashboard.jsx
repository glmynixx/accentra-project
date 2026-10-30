
import { useEffect, useMemo, useState } from "react";

import {
    ArrowUpRight,
    BookOpen,
    BookCopy,
    CalendarDays,
    ChartNoAxesCombined,
    ClipboardList,
    FileCheck2,
    Landmark,
    NotebookPen,
    Scale,
    Clock,

} from "lucide-react";

import Icon from "../components/common/icon";
import StatsGrid from "../components/dashboard/statsGrid";
import StudentLayout from "../components/layout/studentLayout";

import {
    studentSections,
    studentTasks,
    studentDeadlines,
    studentResults,
} from "../assets/data/studentDashboardData";

// Accounting modules
const accountingModules = [
    {
        title: "Chart of Accounts",
        description: "View account classifications",
        icon: BookOpen,
        path: "/student/accounting/chart-of-accounts",
    },
    {
        title: "Journal Entries",
        description: "Review and record transactions",
        icon: NotebookPen,
        path: "/student/accounting/journal-entries",
    },
    {
        title: "General Ledger",
        description: "View ledger account records",
        icon: BookCopy,
        path: "/student/accounting/general-ledger",
    },
    {
        title: "Trial Balance",
        description: "Review debit and credit totals",
        icon: Scale,
        path: "/student/accounting/trial-balance",
    },
    {
        title: "Income Sheet",
        description: "Review revenues and expenses",
        icon: ChartNoAxesCombined,
        path: "/student/accounting/income-sheet",
    },
    {
        title: "Balance Sheet",
        description: "Review assets, liabilities, and equity",
        icon: Landmark,
        path: "/student/accounting/balance-sheet",
    },
];

// Dashboard panel
function Panel({ title, description, actionText, actionHref, children }) {
    return (
        <section
            className="
                min-w-0 overflow-hidden rounded-2xl
                border border-white/[0.13]
                bg-gradient-to-br from-[#17283A]/95 via-[#101F30]/95 to-[#0B1728]/95
                shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_35px_rgba(0,0,0,0.16)]
                backdrop-blur-[22px]
                transition-all duration-300
                hover:border-[#A9E5D2]/20
            "
        >
            {/* Card header */}
            <div
                className="
                    flex min-w-0 items-start justify-between gap-4
                    border-b border-white/[0.07]
                    px-5 py-5 sm:px-6 sm:py-6
                "
            >
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold tracking-tight text-white sm:text-[17px]">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1.5 text-xs leading-5 text-white/50 sm:text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {actionText && (
                    <a
                        href={
                            actionHref ||
                            (title === "Upcoming Deadlines"
                                ? "/student/tasks"
                                : title === "Recent Tasks"
                                  ? "/student/tasks"
                                  : title === "Recent Results"
                                    ? "/student/results"
                                    : "/student/accounting/chart-of-accounts")
                        }
                        className="
                            mt-0.5 inline-flex shrink-0 items-center gap-1
                            whitespace-nowrap rounded-lg
                            text-[11px] font-semibold text-[#A9E5D2]
                            transition-colors duration-200
                            hover:text-white
                            focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-[#A9E5D2]/50
                            sm:text-xs
                        "
                    >
                        {actionText}
                        <ArrowUpRight size={13} />
                    </a>
                )}
            </div>

            {children}
        </section>
    );
}

// Empty state
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

            <p className="text-sm font-semibold text-white/80">
                {message}
            </p>

            {description && (
                <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                    {description}
                </p>
            )}
        </div>
    );
}

// Status badge
function StudentStatusBadge({ status }) {
    const normalized = String(status || "Unknown")
        .toLowerCase()
        .trim();

    const styles = {
        active:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        available:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        completed:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        released:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

        "not started":
            "border-white/10 bg-white/[0.05] text-white/50",

        pending:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
        "in progress":
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
        "pending submission":
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
        "due soon":
            "border-amber-400/20 bg-amber-400/10 text-amber-300",

        submitted:
            "border-sky-400/20 bg-sky-400/10 text-sky-300",
        upcoming:
            "border-sky-400/20 bg-sky-400/10 text-sky-300",

        overdue:
            "border-rose-400/20 bg-rose-400/10 text-rose-300",
    };

    const dotStyles = {
        active: "bg-emerald-300",
        available: "bg-emerald-300",
        completed: "bg-emerald-300",
        released: "bg-emerald-300",
        "not started": "bg-white/40",
        submitted: "bg-sky-300",
        upcoming: "bg-sky-300",
        pending: "bg-amber-300",
        "in progress": "bg-amber-300",
        "pending submission": "bg-amber-300",
        "due soon": "bg-amber-300",
        overdue: "bg-rose-300",
    };

    return (
        <span
            className={`
                inline-flex max-w-full items-center gap-1.5 whitespace-nowrap
                rounded-full border px-2.5 py-1 text-[11px] font-semibold
                ${
                    styles[normalized] ||
                    "border-white/10 bg-white/[0.05] text-white/60"
                }
            `}
        >
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    dotStyles[normalized] || "bg-white/40"
                }`}
            />

            {status || "Unknown"}
        </span>
    );
}

// Parse dates 
function parseCalendarDate(value) {
    if (!value) return null;

    if (typeof value === "string") {
        const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (match) {
            const year = Number(match[1]);
            const month = Number(match[2]);
            const day = Number(match[3]);

            const date = new Date(year, month - 1, day);

            if (
                date.getFullYear() !== year ||
                date.getMonth() !== month - 1 ||
                date.getDate() !== day
            ) {
                return null;
            }

            return date;
        }
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
}

// Date formatter
function formatDate(value) {
    const date = parseCalendarDate(value);

    if (!date) return "No date set";

    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Deadline status
function getDeadlineStatus(deadline, currentDate = new Date()) {
    const dueDate = parseCalendarDate(deadline);

    if (!dueDate) return "Upcoming";

    const today = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
    );

    const daysRemaining = Math.round(
        (dueDate.getTime() - today.getTime()) /
            (24 * 60 * 60 * 1000),
    );

    if (daysRemaining < 0) return "Overdue";
    if (daysRemaining <= 1) return "Due Soon";

    return "Upcoming";
}

// Recent task status
function getTaskDisplayStatus(item) {
    const status = String(
        item.submissionStatus || item.status || "Not Started",
    )
        .toLowerCase()
        .trim();

    if (["submitted", "completed", "released"].includes(status)) {
        return "Submitted";
    }

    if (["in progress", "in-progress"].includes(status)) {
        return "In Progress";
    }

    return "Not Started";
}

// Search helper
function matchesSearch(item, query) {
    if (!query) return true;

    return [
        item.title,
        item.subject,
        item.section,
        item.description,
        item.status,
        item.type,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
}

// Activity row
function ActivityRow({ item, type, currentDate }) {
    const deadline =
        item.deadline ?? item.dueDate ?? item.due_date;

    const IconComponent =
        type === "deadline"
            ? CalendarDays
            : type === "result"
              ? FileCheck2
              : ClipboardList;

    const resultHasScore =
        item.score !== undefined && item.total !== undefined;

    const taskDisplayStatus =
        type === "task" ? getTaskDisplayStatus(item) : null;

    return (
        <div
            className="
                group flex min-w-0 items-center gap-3.5
                px-5 py-4 transition-colors duration-200
                hover:bg-[#A9E5D2]/[0.035]
                sm:gap-4 sm:px-6
            "
        >
            <div
                className={`
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-xl border border-white/[0.06]
                    ${
                        type === "deadline"
                            ? "bg-sky-400/10 text-sky-300"
                            : type === "result"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-[#477F73]/15 text-[#A9E5D2]"
                    }
                `}
            >
                <IconComponent size={19} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/90">
                    {item.title || "Untitled"}
                </p>

                <p className="mt-1 truncate text-xs text-white/45">
                    {item.subject ||
                        item.section ||
                        item.description ||
                        "Accounting"}
                </p>

                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-white/40">
                    {type === "result" ? (
                        <>
                            <FileCheck2 size={13} />

                            <span>
                                {resultHasScore
                                    ? `Score: ${item.score}/${item.total}`
                                    : "Assessment result"}
                            </span>

                            <span>•</span>

                            <span>
                                {item.releasedAt
                                    ? `Released ${formatDate(item.releasedAt)}`
                                    : "Recently released"}
                            </span>
                        </>
                    ) : (
                        <>
                            {type === "deadline" ? (
                                <Clock size={13} />
                            ) : (
                                <CalendarDays size={13} />
                            )}

                            <span>
                                {deadline
                                    ? `Due ${formatDate(deadline)}`
                                    : "No deadline set"}
                            </span>
                        </>
                    )}
                </p>
            </div>

            <div className="shrink-0">
                {type === "deadline" ? (
                    <StudentStatusBadge
                        status={getDeadlineStatus(deadline, currentDate)}
                    />
                ) : type === "result" ? (
                    <StudentStatusBadge
                        status={item.status || "Released"}
                    />
                ) : (
                    <StudentStatusBadge status={taskDisplayStatus} />
                )}
            </div>
        </div>
    );
}

// Accounting module card
function AccountingModuleCard({ module, onOpen }) {
    const ModuleIcon = module.icon;

    const moduleColors = {
        "Chart of Accounts": {
            icon: "text-sky-300 bg-sky-400/10",
            border: "hover:border-sky-300/30",
        },
        "Journal Entries": {
            icon: "text-amber-300 bg-amber-400/10",
            border: "hover:border-amber-300/30",
        },
        "General Ledger": {
            icon: "text-emerald-300 bg-emerald-400/10",
            border: "hover:border-emerald-300/30",
        },
        "Trial Balance": {
            icon: "text-purple-300 bg-purple-400/10",
            border: "hover:border-purple-300/30",
        },
        "Income Sheet": {
            icon: "text-teal-300 bg-teal-400/10",
            border: "hover:border-teal-300/30",
        },
        "Balance Sheet": {
            icon: "text-rose-300 bg-rose-400/10",
            border: "hover:border-rose-300/30",
        },
    };

    const colors = moduleColors[module.title] || {
        icon: "text-[#A9E5D2] bg-[#477F73]/15",
        border: "hover:border-[#A9E5D2]/25",
    };

    return (
        <button
            type="button"
            onClick={() => onOpen(module)}
            className={`
                group flex min-h-[150px] min-w-0 flex-col justify-between
                rounded-2xl border border-white/[0.12]
                bg-gradient-to-br from-white/[0.055] to-white/[0.015]
                p-5 text-left
                shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-white/[0.055]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                focus:outline-none focus:ring-2 focus:ring-[#A9E5D2]/30
                ${colors.border}
            `}
        >
            <div className="flex w-full items-start justify-between gap-3">
                <div
                    className={`
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-xl border border-white/[0.06]
                        transition-transform duration-200 group-hover:scale-105
                        ${colors.icon}
                    `}
                >
                    <ModuleIcon size={21} />
                </div>

                <ArrowUpRight
                    size={17}
                    className="text-white/35 transition-colors group-hover:text-[#A9E5D2]"
                />
            </div>

            <div className="mt-5 min-w-0">
                <h3 className="text-sm font-bold text-white/90">
                    {module.title}
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-white/45">
                    {module.description}
                </p>
            </div>
        </button>
    );
}

export default function StudentDashboard() {
    const [search, setSearch] = useState("");
    const [currentDate, setCurrentDate] = useState(() => new Date());

    // Refresh deadline calculations every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const normalizedSearch = search.trim().toLowerCase();

    // Filter tasks
    const filteredTasks = useMemo(
        () =>
            studentTasks.filter((task) =>
                matchesSearch(task, normalizedSearch),
            ),
        [normalizedSearch],
    );

    // Filter and sort deadlines
    const filteredDeadlines = useMemo(
        () =>
            studentDeadlines
                .filter((deadline) =>
                    matchesSearch(deadline, normalizedSearch),
                )
                .sort((a, b) => {
                    const firstDate =
                        a.deadline ?? a.dueDate ?? a.due_date;

                    const secondDate =
                        b.deadline ?? b.dueDate ?? b.due_date;

                    const first = parseCalendarDate(firstDate);
                    const second = parseCalendarDate(secondDate);

                    return (
                        (first?.getTime() ?? Infinity) -
                        (second?.getTime() ?? Infinity)
                    );
                }),
        [normalizedSearch],
    );

    // Filter results
    const filteredResults = useMemo(
        () =>
            studentResults.filter((result) =>
                matchesSearch(result, normalizedSearch),
            ),
        [normalizedSearch],
    );

    // Filter accounting modules
    const filteredModules = useMemo(
        () =>
            accountingModules.filter((module) =>
                [module.title, module.description]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch),
            ),
        [normalizedSearch],
    );

    // Summary cards
    const activeTaskCount = studentTasks.filter((task) =>
        [
            "not started",
            "active",
            "available",
            "pending",
            "in progress",
        ].includes(
            String(task.status || "Not Started")
                .toLowerCase()
                .trim(),
        ),
    ).length;

    const pendingSubmissionCount = studentTasks.filter(
        (task) => getTaskDisplayStatus(task) !== "Submitted",
    ).length;

    const releasedResultsCount = studentResults.filter(
        (result) =>
            String(result.status || "released")
                .toLowerCase()
                .trim() === "released",
    ).length;

    const stats = [
        {
            label: "My Section",
            value: studentSections.length,
            icon: "layers-3",
            variant: "navy",
        },
        {
            label: "Active Tasks",
            value: activeTaskCount,
            icon: "clipboard-list",
            variant: "green",
        },
        {
            label: "Pending Submissions",
            value: pendingSubmissionCount,
            icon: "file-clock",
            variant: "blue",
        },
        {
            label: "Released Results",
            value: releasedResultsCount,
            icon: "file-check-2",
            variant: "teal",
        },
    ];

    const handleModuleOpen = (module) => {
        window.location.href = module.path;
    };

    return (
        <StudentLayout
            activeMenu="Dashboard"
            title="Student Dashboard"
            search={search}
            onSearchChange={setSearch}
        >
            <div className="relative min-w-0 space-y-6 text-white">
                {/* Dashboard introduction */}
                <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                       
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9E5D2]">
                            Student
                        </span>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Dashboard Overview
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                            Keep track of your accounting activities,
                            assignments, upcoming deadlines, and assessment
                            results in one place.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />

                        <span className="text-xs font-medium text-[#A9E5D2]">
                            Student Workspace
                        </span>
                    </div>
                </section>

                {/* Search results */}
                {normalizedSearch && (
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

               
{/* Deadlines and Recent Tasks */}
<section className="grid min-w-0 grid-cols-1 items-stretch gap-5 min-[1101px]:grid-cols-2">
    <Panel
        title="Upcoming Deadlines"
        description="Track your upcoming accounting activities"
    >
        <div className="flex h-full min-h-[280px] flex-col">
            <div className="flex-1 divide-y divide-white/[0.07]">
                {filteredDeadlines.length > 0 ? (
                    filteredDeadlines.map((item, index) => (
                        <ActivityRow
                            key={item.id ?? item.title ?? index}
                            item={item}
                            type="deadline"
                            currentDate={currentDate}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon="calendar-clock"
                        message="No deadlines found"
                        description="Your upcoming deadlines will appear here."
                    />
                )}
            </div>
        </div>
    </Panel>

    <Panel
        title="Recent Tasks"
        description="Your latest assignments and accounting activities"
    >
        <div className="flex h-full min-h-[280px] flex-col">
            <div className="flex-1 divide-y divide-white/[0.07]">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((item, index) => (
                        <ActivityRow
                            key={item.id ?? item.title ?? index}
                            item={item}
                            type="task"
                            currentDate={currentDate}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon="clipboard-list"
                        message="No recent tasks"
                        description="Tasks assigned to your section will appear here."
                    />
                )}
            </div>
        </div>
    </Panel>
</section>

                {/* Accounting modules */}
                <Panel
                    title="Accounting Modules"
                    description="Access your accounting records and financial statements"
                    actionHref="/student/accounting/chart-of-accounts"
                >
                    <div className="grid min-w-0 grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                        {filteredModules.length > 0 ? (
                            filteredModules.map((module) => (
                                <AccountingModuleCard
                                    key={module.title}
                                    module={module}
                                    onOpen={handleModuleOpen}
                                />
                            ))
                        ) : (
                            <div className="sm:col-span-2 lg:col-span-3">
                                <EmptyState
                                    icon="calculator"
                                    message="No accounting modules found"
                                    description="Try searching for a different accounting module."
                                />
                            </div>
                        )}
                    </div>
                </Panel>
            </div>
        </StudentLayout>
    );
}
