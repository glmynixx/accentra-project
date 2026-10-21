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
import CardHeader from "../components/common/cardHeader";
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

// Empty state
function EmptyState({ icon, message, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F4F6] text-[#8190A0]">
        <Icon name={icon} size={21} />
      </div>

      <p className="text-sm font-semibold text-[#40566E]">
        {message}
      </p>

      {description && (
        <p className="mt-1 max-w-xs text-xs leading-5 text-[#8A98A7]">
          {description}
        </p>
      )}
    </div>
  );
}

// Status badge
function StudentStatusBadge({ status }) {
  const normalized = String(status || "")
    .toLowerCase()
    .trim();

  const styles = {
    active:
      "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
    available:
      "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",

    "not started":
      "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",

    pending:
      "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",

    "in progress":
      "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",

    "pending submission":
      "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",

    submitted:
      "border-[#C9D8EA] bg-[#EAF1F9] text-[#3B6FA5]",

    completed:
      "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",

    released:
      "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",

    overdue:
      "border-[#F0C9C9] bg-[#FCEAEA] text-[#B54747]",

    upcoming:
      "border-[#C9D8EA] bg-[#EAF1F9] text-[#3B6FA5]",

    "due soon":
      "border-[#F0D8A8] bg-[#FFF4D9] text-[#946A16]",
  };

  const dotStyles = {
    active: "bg-[#31805E]",
    available: "bg-[#31805E]",
    completed: "bg-[#31805E]",
    released: "bg-[#31805E]",

    "not started": "bg-[#7C8794]",

    submitted: "bg-[#3B6FA5]",
    upcoming: "bg-[#3B6FA5]",

    pending: "bg-[#D6A13A]",
    "in progress": "bg-[#D6A13A]",
    "pending submission": "bg-[#D6A13A]",
    "due soon": "bg-[#D6A13A]",

    overdue: "bg-[#C94B4B]",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[normalized] ||
        "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          dotStyles[normalized] || "bg-[#7C8794]"
        }`}
      />

      {status || "Unknown"}
    </span>
  );
}

// Parse date without UTC shifting YYYY-MM-DD values
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
    date.getDate()
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

// Deadline status: used only for Upcoming Deadlines
function getDeadlineStatus(deadline, currentDate = new Date()) {
  const dueDate = parseCalendarDate(deadline);

  if (!dueDate) return "Upcoming";

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const daysRemaining = Math.round(
    (dueDate.getTime() - today.getTime()) /
      (24 * 60 * 60 * 1000)
  );

  if (daysRemaining < 0) return "Overdue";
  if (daysRemaining <= 1) return "Due Soon";

  return "Upcoming";
}

// Recent Tasks status: based on submission progress, not due date
function getTaskDisplayStatus(item) {
  const status = String(
    item.submissionStatus || item.status || "Not Started"
  )
    .toLowerCase()
    .trim();

  if (["submitted", "completed", "released"].includes(status)) {
    return "Submitted";
  }

  if (
    status === "in progress" ||
    status === "in-progress"
  ) {
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
    item.score !== undefined &&
    item.total !== undefined;

  const taskDisplayStatus =
    type === "task"
      ? getTaskDisplayStatus(item)
      : null;

  return (
    <div className="flex min-w-0 items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#F7F9FB] sm:gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          type === "deadline"
            ? "bg-[#EAF1F9] text-[#3B6FA5]"
            : type === "result"
              ? "bg-[#E1F0E8] text-[#267653]"
              : "bg-[#36534E]/10 text-[#36534E]"
        }`}
      >
        <IconComponent size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#243A52]">
          {item.title}
        </p>

        <p className="mt-1 truncate text-xs text-[#7A8999]">
          {item.subject ||
            item.section ||
            item.description ||
            "Accounting"}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#7A8999]">
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
          <StudentStatusBadge
            status={taskDisplayStatus}
          />
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
      background: "bg-[#EAF1F9]",
      icon: "bg-[#D6E5F5] text-[#3B6FA5]",
      border: "hover:border-[#8FB4DE]",
    },
    "Journal Entries": {
      background: "bg-[#FFF4E5]",
      icon: "bg-[#FCE4C4] text-[#B87524]",
      border: "hover:border-[#E8BE83]",
    },
    "General Ledger": {
      background: "bg-[#E1F0E8]",
      icon: "bg-[#CBE5D6] text-[#267653]",
      border: "hover:border-[#8FC6A8]",
    },
    "Trial Balance": {
      background: "bg-[#F0EAFE]",
      icon: "bg-[#E0D5FA] text-[#7653B5]",
      border: "hover:border-[#B9A2E8]",
    },
    "Income Sheet": {
      background: "bg-[#E2F5F3]",
      icon: "bg-[#C7EAE5] text-[#23877D]",
      border: "hover:border-[#8ACFC5]",
    },
    "Balance Sheet": {
      background: "bg-[#FCEAEA]",
      icon: "bg-[#F5D1D1] text-[#B54747]",
      border: "hover:border-[#E5A5A5]",
    },
  };

  const colors = moduleColors[module.title] || {
    background: "bg-[#F0F4F6]",
    icon: "bg-[#DDE5E8] text-[#36534E]",
    border: "hover:border-[#36534E]/40",
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(module)}
      className={`group flex min-h-[150px] min-w-0 flex-col justify-between rounded-2xl border border-[#C9D5E2] ${colors.background} p-5 text-left shadow-[0_5px_25px_rgba(27,53,83,0.06)] transition-all duration-200 hover:-translate-y-0.5 ${colors.border} hover:shadow-[0_8px_30px_rgba(27,53,83,0.09)] focus:outline-none focus:ring-2 focus:ring-[#36534E]/20`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon} transition-transform duration-200 group-hover:scale-105`}
        >
          <ModuleIcon size={21} />
        </div>

        <ArrowUpRight
          size={17}
          className="text-[#9AA7B5] transition-colors group-hover:text-[#36534E]"
        />
      </div>

      <div className="mt-5 min-w-0">
        <h3 className="text-sm font-bold text-[#243A52]">
          {module.title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-[#60758A]">
          {module.description}
        </p>
      </div>
    </button>
  );
}


export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Refresh the deadline date calculation every minute
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
        matchesSearch(task, normalizedSearch)
      ),
    [normalizedSearch]
  );

  // Filter and sort deadlines
  const filteredDeadlines = useMemo(
    () =>
      studentDeadlines
        .filter((deadline) =>
          matchesSearch(deadline, normalizedSearch)
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
    [normalizedSearch]
  );

  // Filter results
  const filteredResults = useMemo(
    () =>
      studentResults.filter((result) =>
        matchesSearch(result, normalizedSearch)
      ),
    [normalizedSearch]
  );

  // Filter accounting modules
  const filteredModules = useMemo(
    () =>
      accountingModules.filter((module) =>
        [module.title, module.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      ),
    [normalizedSearch]
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
        .trim()
    )
  ).length;

  const pendingSubmissionCount = studentTasks.filter((task) => {
    const status = getTaskDisplayStatus(task);

    return status !== "Submitted";
  }).length;

  const releasedResultsCount = studentResults.filter(
    (result) =>
      String(result.status || "released")
        .toLowerCase()
        .trim() === "released"
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

        {/* SUMMARY CARDS */}
        <StatsGrid stats={stats} />

        {/* DEADLINES + RECENT TASKS */}
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel
            title="Upcoming Deadlines"
            description="Track your upcoming accounting activities"
            actionText="View Deadlines"
          >
            <div className="divide-y divide-[#E5EBF1]">
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
          </Panel>

          <Panel
            title="Recent Tasks"
            description="Your latest assignments and accounting activities"
            actionText="View Tasks"
          >
            <div className="divide-y divide-[#E5EBF1]">
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
          </Panel>
        </div>

        {/* RECENT RESULTS */}
        <Panel
          title="Recent Results"
          description="View your recently released assessment results"
          actionText="View Results"
        >
          <div className="divide-y divide-[#E5EBF1]">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <ActivityRow
                  key={item.id ?? item.title ?? index}
                  item={item}
                  type="result"
                  currentDate={currentDate}
                />
              ))
            ) : (
              <EmptyState
                icon="file-check-2"
                message="No results available"
                description="Your released quiz, exam, and task results will appear here."
              />
            )}
          </div>
        </Panel>

        {/* ACCOUNTING MODULES */}
        <Panel
          title="Accounting Modules"
          description="Access your accounting records and financial statements"
          actionText="Explore Modules"
        >
          <div className="grid min-w-0 grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
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
