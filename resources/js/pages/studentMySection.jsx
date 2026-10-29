
import { useMemo, useState } from "react";
import {
    Search,
    GraduationCap,
    BookOpen,
    CalendarDays,
    CalendarRange,
    UserRound,
    Hash,
    Clock,
    MapPin,
    ChevronDown,
    Filter,
    Layers,
    Users,
    X,
    RotateCcw,
    ClipboardList,
    ChartNoAxesColumn,
    UserCheck,
} from "lucide-react";

import StudentLayout from "../components/layout/studentLayout";

const sectionInfo = {
    sectionCode: "SEC-001",
    sectionName: "BSAIS 11CA",
    program: "BS Accounting Information System",
    yearLevel: "1st Year",
    schoolYear: "2026-2027",
    semester: "1st Semester",
    faculty: "Cai Soriano",
    status: "Active",
};

const students = [
    { id: "2026-0001", name: "Juan Dela Cruz", email: "juan.delacruz@accentra.com", status: "Active" },
    { id: "2026-0002", name: "Maria Santos", email: "maria.santos@accentra.com", status: "Active" },
    { id: "2026-0003", name: "Angela Reyes", email: "angela.reyes@accentra.com", status: "Active" },
    { id: "2026-0004", name: "Mark Villanueva", email: "mark.villanueva@accentra.com", status: "Inactive" },
    { id: "2026-0005", name: "Sofia Mendoza", email: "sofia.mendoza@accentra.com", status: "Active" },
];

const schedules = [
    {
        id: 1,
        subject: "Fundamentals of Accounting",
        code: "ACCT 101",
        day: "Monday",
        time: "8:00 AM – 10:00 AM",
        room: "Room 201",
        faculty: "Cai Soriano",
    },
    {
        id: 2,
        subject: "Computer Fundamentals",
        code: "COMP 101",
        day: "Wednesday",
        time: "10:00 AM – 12:00 PM",
        room: "Computer Laboratory",
        faculty: "Cai Soriano",
    },
    {
        id: 3,
        subject: "Business Mathematics",
        code: "MATH 101",
        day: "Friday",
        time: "1:00 PM – 3:00 PM",
        room: "Room 203",
        faculty: "Cai Soriano",
    },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const inputClass =
    "w-full rounded-xl border border-white/[0.10] bg-[#071522]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-[#A9E5D2]/45 focus:ring-2 focus:ring-[#A9E5D2]/[0.08]";

const panelClass =
    "min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.075] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px]";

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function Panel({ title, description, children, action }) {
    return (
        <section className={panelClass}>
            <div className="flex flex-col gap-3 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="min-w-0">
                    <h2 className="text-base font-bold text-white/90">
                        {title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                        {description}
                    </p>
                </div>

                {action}
            </div>

            {children}
        </section>
    );
}

function SectionStatus({ status }) {
    const isActive = status === "Active";

    return (
        <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                isActive
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.05] text-white/50"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-emerald-300" : "bg-white/35"
                }`}
            />
            {status}
        </span>
    );
}

function StudentStatus({ status }) {
    const isActive = status === "Active";

    return (
        <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                isActive
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-rose-400/20 bg-rose-400/10 text-rose-300"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-emerald-300" : "bg-rose-300"
                }`}
            />
            {status}
        </span>
    );
}

function StudentAvatar({ name }) {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-xs font-bold text-[#A9E5D2]">
            {getInitials(name)}
        </div>
    );
}

function SummaryCard({ title, value, description, icon: Icon, accent = "mint" }) {
    const tones = {
        navy: "border-[#7292B4]/20 bg-[#294B70]/25 text-[#C4D9F0]",
        mint: "border-[#A9E5D2]/20 bg-[#477F73]/25 text-[#A9E5D2]",
        slate: "border-slate-300/15 bg-slate-400/10 text-slate-300",
        blue: "border-sky-200/15 bg-sky-400/10 text-sky-200",
    };

    return (
        <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] transition duration-300 hover:-translate-y-1 hover:border-white/20">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/[0.025] blur-2xl transition group-hover:bg-white/[0.06]"
            />

            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <span className="block text-xs font-semibold text-white/55">
                        {title}
                    </span>

                    <strong className="mt-2 block text-3xl font-bold tracking-tight text-white">
                        {value}
                    </strong>

                    <span className="mt-1.5 block text-[11px] text-white/35">
                        {description}
                    </span>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tones[accent]}`}
                >
                    <Icon size={21} strokeWidth={1.8} />
                </div>
            </div>

            <div
                className={`absolute bottom-0 left-0 h-px w-full ${
                    accent === "mint" ? "bg-[#A9E5D2]/40" : "bg-white/10"
                }`}
            />
        </div>
    );
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-white/55">
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={`${inputClass} appearance-none pr-9`}
                >
                    <option value="">All {label}</option>

                    {options.map((option) => (
                        <option
                            key={option}
                            value={option}
                            className="bg-[#0C1B2A]"
                        >
                            {option}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                />
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon = Search, title, description, action }) {
    return (
        <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={21} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-white/85">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/40">
                {description}
            </p>

            {action}
        </div>
    );
}

function DayBadge({ day }) {
    return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200">
            <CalendarDays size={14} />
            {day}
        </span>
    );
}

export default function StudentMySection() {
    const [studentSearch, setStudentSearch] = useState("");
    const [studentStatus, setStudentStatus] = useState("");
    const [selectedDay, setSelectedDay] = useState("All");

    const filteredStudents = useMemo(() => {
        const query = studentSearch.trim().toLowerCase();

        return students.filter((student) => {
            const matchesSearch =
                !query ||
                student.id.toLowerCase().includes(query) ||
                student.name.toLowerCase().includes(query) ||
                student.email.toLowerCase().includes(query);

            const matchesStatus =
                !studentStatus || student.status === studentStatus;

            return matchesSearch && matchesStatus;
        });
    }, [studentSearch, studentStatus]);

    const filteredSchedules = useMemo(() => {
        if (selectedDay === "All") return schedules;

        return schedules.filter((schedule) => schedule.day === selectedDay);
    }, [selectedDay]);

    const totalStudents = students.length;
    const totalActive = students.filter(
        (student) => student.status === "Active",
    ).length;

    const resetStudentFilters = () => {
        setStudentSearch("");
        setStudentStatus("");
    };

    const hasStudentFilters = Boolean(studentSearch || studentStatus);

    return (
        <StudentLayout
            activeMenu="My Section"
            title="My Section"
            subtitle="View your section information, classmates, and schedule."
            showPageInfo={false}
            showSearch={false}
        >
            <div className="relative mx-auto min-w-0 w-full max-w-[1600px] space-y-6 pb-8 text-white">
                {/* Page heading */}
                <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                       
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9E5D2]">
                            Academic Management
                        </span>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            My Section
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                            View your assigned section, classmates, academic
                            information, and class schedule.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />

                        <span className="text-xs font-medium text-[#A9E5D2]">
                            Academic Year {sectionInfo.schoolYear}
                        </span>
                    </div>
                </section>

                {/* Summary cards */}
                <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="My Section"
                        value={sectionInfo.sectionName}
                        description={sectionInfo.sectionCode}
                        icon={Layers}
                        accent="navy"
                    />

                    <SummaryCard
                        title="Total Students"
                        value={totalStudents}
                        description="Enrolled in your section"
                        icon={Users}
                        accent="mint"
                    />

                    <SummaryCard
                        title="Active Students"
                        value={totalActive}
                        description="Students with active status"
                        icon={UserCheck}
                        accent="slate"
                    />

                    <SummaryCard
                        title="Class Schedules"
                        value={schedules.length}
                        description="Scheduled classes this semester"
                        icon={CalendarRange}
                        accent="blue"
                    />
                </section>

                {/* Section information */}
                <Panel
                    title="Section Information"
                    description="Review your assigned section and academic details."
                    action={<SectionStatus status={sectionInfo.status} />}
                >
                    <div className="border-b border-white/[0.08] bg-gradient-to-r from-[#14283A]/80 to-[#0D1D2C]/70 p-5 sm:p-6">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2]">
                                    <Layers size={25} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9E5D2]">
                                        Assigned Section
                                    </p>

                                    <h2 className="mt-1.5 break-words text-xl font-bold tracking-tight text-white sm:text-2xl">
                                        {sectionInfo.sectionName}
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-white/45">
                                        Section ID: {sectionInfo.sectionCode}
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                Enrolled
                            </span>
                        </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/10 text-sky-300 transition-transform group-hover:scale-105">
                                <BookOpen size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    Program
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.program}
                                </p>
                            </div>
                        </div>

                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-400/10 text-amber-300 transition-transform group-hover:scale-105">
                                <GraduationCap size={21} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    Year Level
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.yearLevel}
                                </p>
                            </div>
                        </div>

                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10 text-emerald-300 transition-transform group-hover:scale-105">
                                <CalendarRange size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    School Year
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.schoolYear}
                                </p>
                            </div>
                        </div>

                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-purple-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-300/15 bg-purple-400/10 text-purple-300 transition-transform group-hover:scale-105">
                                <CalendarDays size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    Semester
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.semester}
                                </p>
                            </div>
                        </div>

                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-300 transition-transform group-hover:scale-105">
                                <UserRound size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    Assigned Faculty
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.faculty}
                                </p>
                            </div>
                        </div>

                        <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300/25">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-400/10 text-rose-300 transition-transform group-hover:scale-105">
                                <Hash size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white/45">
                                    Section Code
                                </p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white/85">
                                    {sectionInfo.sectionCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Student list */}
                <Panel
                    title="Students List"
                    description="View students enrolled in your assigned section."
                    action={
                        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
                            <Users size={14} className="text-[#A9E5D2]" />
                            {filteredStudents.length}{" "}
                            {filteredStudents.length === 1 ? "student" : "students"}
                        </span>
                    }
                >
                   {/* Search and filters */}
<div className="border-b border-white/[0.08] bg-[#102131] px-4 py-4 sm:px-5">
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
        {/* Search */}
        <div className="relative min-w-0">
            <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
                type="text"
                value={studentSearch}
                onChange={(event) =>
                    setStudentSearch(event.target.value)
                }
                placeholder="Search student ID, name, or email..."
                aria-label="Search classmates"
                className={`${inputClass} pl-10 pr-10`}
            />

            {studentSearch && (
                <button
                    type="button"
                    onClick={() => setStudentSearch("")}
                    aria-label="Clear student search"
                    title="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 transition hover:bg-white/[0.08] hover:text-white"
                >
                    <X size={15} />
                </button>
            )}
        </div>

        {/* Status filter */}
        <FilterSelect
            value={studentStatus}
            options={["Active", "Inactive"]}
            onChange={setStudentStatus}
        />
    </div>

</div>

                    {/* Students table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[700px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                                    {["Student ID", "Student", "Email Address", "Status"].map(
                                        (heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40"
                                            >
                                                {heading}
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/[0.07]">
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="transition-colors hover:bg-[#A9E5D2]/[0.035]"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-white/55">
                                            {student.id}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <StudentAvatar name={student.name} />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-white/85">
                                                        {student.name}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-white/40">
                                                        Students
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-white/50">
                                            {student.email}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StudentStatus status={student.status} />
                                        </td>
                                    </tr>
                                ))}

                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>
                                            <EmptyState
                                                icon={Users}
                                                title="No classmates found"
                                                description="Try changing your search or status filter."
                                                action={
                                                    hasStudentFilters ? (
                                                        <button
                                                            type="button"
                                                            onClick={resetStudentFilters}
                                                            className="mt-4 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                                        >
                                                            Clear filters
                                                        </button>
                                                    ) : null
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/[0.08] px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Showing{" "}
                            <strong className="font-semibold text-white/75">
                                {filteredStudents.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-white/75">
                                {students.length}
                            </strong>{" "}
                            Students
                        </p>
                    </div>
                </Panel>

                {/* Section schedule */}
                <Panel
                    title="Section Schedule"
                    description="View your class days, times, assigned rooms, and faculty."
                    action={
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
                            <CalendarDays size={14} className="text-[#A9E5D2]" />
                            {filteredSchedules.length}{" "}
                            {filteredSchedules.length === 1 ? "class" : "classes"}
                        </span>
                    }
                >
                    <div className="flex flex-col gap-4 border-b border-white/[0.08] bg-[#102131] p-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                <CalendarRange size={19} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white/80">
                                    Class timetable
                                </p>
                                <p className="mt-1 text-xs text-white/40">
                                    School Year {sectionInfo.schoolYear} · {sectionInfo.semester}
                                </p>
                            </div>
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-2 sm:w-64 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                            <label className="flex items-center gap-2 text-xs font-semibold text-white/50">
                                <Filter size={14} className="text-[#A9E5D2]" />
                                Filter day
                            </label>

                            <div className="relative min-w-0">
                                <select
                                    value={selectedDay}
                                    onChange={(event) => setSelectedDay(event.target.value)}
                                    aria-label="Filter class schedule by day"
                                    className={`${inputClass} appearance-none pr-9`}
                                >
                                    <option value="All">All Days</option>
                                    {DAYS.map((day) => (
                                        <option
                                            key={day}
                                            value={day}
                                            className="bg-[#0C1B2A]"
                                        >
                                            {day}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    size={15}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[850px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                                    {["Subject", "Day", "Time", "Room", "Faculty"].map(
                                        (heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40"
                                            >
                                                {heading}
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/[0.07]">
                                {filteredSchedules.map((schedule) => (
                                    <tr
                                        key={schedule.id}
                                        className="transition-colors hover:bg-[#A9E5D2]/[0.035]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                                    <BookOpen size={17} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white/85">
                                                        {schedule.subject}
                                                    </p>
                                                    <p className="mt-1 text-xs text-white/40">
                                                        {schedule.code}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <DayBadge day={schedule.day} />
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                <Clock size={15} className="shrink-0 text-[#A9E5D2]" />
                                                {schedule.time}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                <MapPin size={15} className="shrink-0 text-[#A9E5D2]" />
                                                {schedule.room}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <StudentAvatar name={schedule.faculty} />
                                                <span className="text-sm font-medium text-white/70">
                                                    {schedule.faculty}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredSchedules.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState
                                                icon={CalendarDays}
                                                title="No classes scheduled"
                                                description={`There are no classes scheduled for ${selectedDay}.`}
                                                action={
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedDay("All")}
                                                        className="mt-4 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                                    >
                                                        Show all days
                                                    </button>
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/[0.08] px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Showing{" "}
                            <strong className="font-semibold text-white/75">
                                {filteredSchedules.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-white/75">
                                {schedules.length}
                            </strong>{" "}
                            scheduled classes
                        </p>

                        {selectedDay !== "All" && (
                            <button
                                type="button"
                                onClick={() => setSelectedDay("All")}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                            >
                                <RotateCcw size={13} />
                                Clear day filter
                            </button>
                        )}
                    </div>
                </Panel>
            </div>
        </StudentLayout>
    );
}
