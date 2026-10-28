import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import {
    Search,
    Eye,
    Users,
    GraduationCap,
    CalendarDays,
    BookOpen,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    UserRound,
    Building2,
    ClipboardList,
    RotateCcw,
    Layers,
    UserCheck,
    ChartNoAxesColumn,
} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

const initialSections = [
    {
        id: "SEC-001",
        name: "BSAIS 11CA",
        program: "BS Accounting Information System",
        yearLevel: "1st Year",
        academicYear: "2026-2027",
        semester: "1st Semester",
        facultyAssigned: "Cai Soriano",
        status: "Active",
        students: [
            { id: "2026-1001", name: "Angela Mae Santos", status: "Active" },
            { id: "2026-1002", name: "Joshua Miguel Reyes", status: "Active" },
            { id: "2026-1003", name: "Sofia Marie Cruz", status: "Active" },
            { id: "2026-1004", name: "Daniel James Garcia", status: "Inactive" },
            { id: "2026-1005", name: "Isabella Grace Flores", status: "Active" },
        ],
    },
    {
        id: "SEC-002",
        name: "BSAIS 21CA",
        program: "BS Accounting Information System",
        yearLevel: "2nd Year",
        academicYear: "2026-2027",
        semester: "1st Semester",
        facultyAssigned: "Cai Soriano",
        status: "Active",
        students: [
            { id: "2026-2001", name: "Gabriel Thomas Mendoza", status: "Active" },
            { id: "2026-2002", name: "Chloe Anne Dela Cruz", status: "Active" },
            { id: "2026-2003", name: "Nathaniel Lopez", status: "Active" },
            { id: "2026-2004", name: "Samantha Reyes", status: "Active" },
        ],
    },
    {
        id: "SEC-003",
        name: "BSEN 31CE",
        program: "BS Entrepreneurship",
        yearLevel: "3rd Year",
        academicYear: "2026-2027",
        semester: "1st Semester",
        facultyAssigned: "Cai Soriano",
        status: "Active",
        students: [
            { id: "2026-3001", name: "Andrea Nicole Ramos", status: "Active" },
            { id: "2026-3002", name: "Mark Anthony Villanueva", status: "Inactive" },
            { id: "2026-3003", name: "Patricia Mae Aquino", status: "Active" },
            { id: "2026-3004", name: "John Carlo Bautista", status: "Active" },
            { id: "2026-3005", name: "Kimberly Ann Torres", status: "Active" },
            { id: "2026-3006", name: "Miguel Angelo Castillo", status: "Active" },
        ],
    },
    {
        id: "SEC-004",
        name: "BSAIS 41CA",
        program: "BS Accounting Information System",
        yearLevel: "1st Year",
        academicYear: "2025-2026",
        semester: "2nd Semester",
        facultyAssigned: "Cai Soriano",
        status: "Inactive",
        students: [
            { id: "2026-4001", name: "Beatrice Anne Lim", status: "Active" },
            { id: "2026-4002", name: "Francis Gabriel Tan", status: "Active" },
            { id: "2026-4003", name: "Nicole Marie Diaz", status: "Inactive" },
        ],
    },
    {
        id: "SEC-005",
        name: "BSEN 21CE",
        program: "BS Entrepreneurship",
        yearLevel: "2nd Year",
        academicYear: "2026-2027",
        semester: "2nd Semester",
        facultyAssigned: "Cai Soriano",
        status: "Active",
        students: [
            { id: "2026-5001", name: "Paolo Miguel Santos", status: "Active" },
            { id: "2026-5002", name: "Francesca Mae Garcia", status: "Active" },
            { id: "2026-5003", name: "Adrian James Cruz", status: "Active" },
        ],
    },
];

const PROGRAMS = [
    "BS Accounting Information System",
    "BS Entrepreneurship",
];

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const ACADEMIC_YEARS = ["2025-2026", "2026-2027", "2027-2028"];
const SEMESTERS = ["1st Semester", "2nd Semester"];
const SECTION_STATUSES = ["Active", "Inactive"];
const ITEMS_PER_PAGE = 5;

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

/* Summary Card */
function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    accent = "mint",
}) {
    const tones = {
        navy: "bg-[#294B70]/25 text-[#C4D9F0] border-[#7292B4]/20",
        mint: "bg-[#477F73]/25 text-[#A9E5D2] border-[#A9E5D2]/20",
        slate: "bg-slate-400/10 text-slate-300 border-slate-300/15",
        blue: "bg-sky-400/10 text-sky-200 border-sky-200/15",
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
                    accent === "mint"
                        ? "bg-[#A9E5D2]/40"
                        : "bg-white/10"
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

function SectionDetailsModal({ section, onClose }) {
    const [studentSearch, setStudentSearch] = useState("");
    const [studentStatusFilter, setStudentStatusFilter] = useState("");

    const filteredStudents = useMemo(() => {
        const search = studentSearch.trim().toLowerCase();

        return section.students.filter((student) => {
            const matchesSearch =
                !search ||
                student.id.toLowerCase().includes(search) ||
                student.name.toLowerCase().includes(search);

            const matchesStatus =
                !studentStatusFilter ||
                student.status === studentStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [section.students, studentSearch, studentStatusFilter]);

    const informationCards = [
        { label: "Program", value: section.program },
        { label: "Section Name", value: section.name },
        { label: "Year Level", value: section.yearLevel },
        { label: "Academic Year", value: section.academicYear },
        { label: "Semester", value: section.semester },
    ];

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020912]/80 p-3 backdrop-blur-md sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="section-modal-title"
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.13] bg-[#0C1B2A] shadow-[0_25px_100px_rgba(0,0,0,0.55)]"
            >
                {/* Fixed modal header */}
                <div className="shrink-0 border-b border-white/[0.08] bg-gradient-to-r from-[#14283A] to-[#0D1D2C] px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2] sm:h-12 sm:w-12">
                                <Layers size={22} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9E5D2]">
                                    Section Information
                                </p>

                                <h2
                                    id="section-modal-title"
                                    className="mt-1.5 break-words text-lg font-bold text-white sm:text-xl"
                                >
                                    {section.name}
                                </h2>

                                <span className="mt-2 inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/50">
                                    {section.id}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close section details"
                            title="Close"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable modal content */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white/90">
                                Section & Academic Details
                            </h3>
                            <p className="mt-1 text-xs text-white/45">
                                Complete information about your assigned section
                            </p>
                        </div>

                        <SectionStatus status={section.status} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {informationCards.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-4 py-3.5"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                                    {item.label}
                                </p>

                                <p className="mt-2 break-words text-sm font-semibold text-white/85">
                                    {item.value || "—"}
                                </p>
                            </div>
                        ))}

                        <div className="rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 px-4 py-3.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                                Number of Students
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <Users size={16} className="text-[#A9E5D2]" />
                                <strong className="text-sm font-semibold text-white/85">
                                    {section.students.length} students
                                </strong>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3.5 sm:col-span-2 lg:col-span-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                                Faculty Assigned
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                    <UserRound size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="break-words text-sm font-semibold text-white/85">
                                        {section.facultyAssigned}
                                    </p>
                                    <p className="mt-1 text-xs text-white/40">
                                        Assigned Faculty
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student list */}
                    <section className="mt-6 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-br from-white/[0.055] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <div className="flex shrink-0 flex-col gap-3 border-b border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                    <Users size={18} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-white/90">
                                        Student List
                                    </h3>
                                    <p className="mt-1 text-xs text-white/40">
                                        Enrolled students in this section
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
                                <GraduationCap
                                    size={14}
                                    className="text-[#A9E5D2]"
                                />
                                {filteredStudents.length}{" "}
                                {filteredStudents.length === 1
                                    ? "student"
                                    : "students"}
                            </span>
                        </div>

                        {/* Search and status filter */}
                        <div className="relative z-10 shrink-0 border-b border-white/[0.08] bg-[#102131] px-4 py-4 sm:px-5">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
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
                                        placeholder="Search student ID or name..."
                                        aria-label="Search students"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>

                                <select
                                    value={studentStatusFilter}
                                    onChange={(event) =>
                                        setStudentStatusFilter(event.target.value)
                                    }
                                    aria-label="Filter students by status"
                                    className={inputClass}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Scrollable student table */}
                        <div className="max-h-[300px] min-h-[120px] flex-1 overflow-auto overscroll-contain">
                            <table className="w-full min-w-[540px] border-collapse text-left">
                                <thead className="sticky top-0 z-[1] bg-[#14283A]">
                                    <tr className="border-b border-white/[0.08]">
                                        {["Student ID", "Name", "Status"].map(
                                            (heading) => (
                                                <th
                                                    key={heading}
                                                    className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 sm:px-5"
                                                >
                                                    {heading}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/[0.07]">
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="transition-colors hover:bg-[#A9E5D2]/[0.035]"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-white/55 sm:px-5">
                                                {student.id}
                                            </td>

                                            <td className="px-4 py-3.5 sm:px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-xs font-bold text-[#A9E5D2]">
                                                        {getInitials(student.name)}
                                                    </div>

                                                    <span className="text-sm font-semibold text-white/85">
                                                        {student.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5 sm:px-5">
                                                <StudentStatus
                                                    status={student.status}
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-5 py-12 text-center"
                                            >
                                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                                    <Users size={20} />
                                                </div>

                                                <h4 className="mt-3 text-sm font-bold text-white/85">
                                                    No students found
                                                </h4>

                                                <p className="mt-1 text-xs text-white/40">
                                                    Try changing your search or status filter.
                                                </p>

                                                {(studentSearch ||
                                                    studentStatusFilter) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setStudentSearch("");
                                                            setStudentStatusFilter("");
                                                        }}
                                                        className="mt-3 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                                    >
                                                        Clear student filters
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Student count footer */}
                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] px-4 py-3 sm:px-5">
                            <p className="text-xs text-white/40">
                                Showing{" "}
                                <strong className="font-semibold text-white/75">
                                    {filteredStudents.length}
                                </strong>{" "}
                                of{" "}
                                <strong className="font-semibold text-white/75">
                                    {section.students.length}
                                </strong>{" "}
                                students
                            </p>

                            {(studentSearch || studentStatusFilter) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStudentSearch("");
                                        setStudentStatusFilter("");
                                    }}
                                    className="text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* modal footer */}
                <div className="flex shrink-0 justify-end border-t border-white/[0.08] bg-[#0A1724] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function FacultySections() {
    const [sections] = useState(initialSections);

    const [search, setSearch] = useState("");
    const [programFilter, setProgramFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [selectedSection, setSelectedSection] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredSections = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return sections.filter((section) => {
            const matchesSearch =
                !normalizedSearch ||
                section.name.toLowerCase().includes(normalizedSearch) ||
                section.program.toLowerCase().includes(normalizedSearch);

            const matchesProgram =
                !programFilter || section.program === programFilter;

            const matchesYear =
                !yearFilter || section.yearLevel === yearFilter;

            const matchesAcademicYear =
                !academicYearFilter ||
                section.academicYear === academicYearFilter;

            const matchesSemester =
                !semesterFilter || section.semester === semesterFilter;

            const matchesStatus =
                !statusFilter || section.status === statusFilter;

            return (
                matchesSearch &&
                matchesProgram &&
                matchesYear &&
                matchesAcademicYear &&
                matchesSemester &&
                matchesStatus
            );
        });
    }, [
        sections,
        search,
        programFilter,
        yearFilter,
        academicYearFilter,
        semesterFilter,
        statusFilter,
    ]);

    const counts = useMemo(
        () => ({
            total: sections.length,

            active: sections.filter(
                (section) => section.status === "Active"
            ).length,

            students: sections.reduce(
                (total, section) => total + section.students.length,
                0
            ),

            activeStudents: sections.reduce(
                (total, section) =>
                    total +
                    section.students.filter(
                        (student) => student.status === "Active"
                    ).length,
                0
            ),
        }),
        [sections]
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredSections.length / ITEMS_PER_PAGE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedSections = filteredSections.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const resetFilters = () => {
        setSearch("");
        setProgramFilter("");
        setYearFilter("");
        setAcademicYearFilter("");
        setSemesterFilter("");
        setStatusFilter("");
        setCurrentPage(1);
    };

    const hasFilters = Boolean(
        search ||
            programFilter ||
            yearFilter ||
            academicYearFilter ||
            semesterFilter ||
            statusFilter
    );

    const updateFilter = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    return (
        <FacultyLayout
            activeMenu="My Sections"
            showPageInfo={false}
            showSearch={false}
        >
            <div className="relative min-w-0 space-y-6 pb-8 text-white">
                {/* Page heading */}
                <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A9E5D2]">
                            Faculty
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            My Sections
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                            View your assigned sections and monitor enrolled students.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />

                        <span className="text-xs font-medium text-[#A9E5D2]">
                            Academic Year 2026-2027
                        </span>
                    </div>
                </section>

                {/* Summary Cards */}
                <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Sections"
                        value={counts.total}
                        description="All assigned sections"
                        icon={Layers}
                        accent="navy"
                    />

                    <SummaryCard
                        title="Active Sections"
                        value={counts.active}
                        description="Currently active sections"
                        icon={ChartNoAxesColumn}
                        accent="mint"
                    />

                    <SummaryCard
                        title="Total Students"
                        value={counts.students}
                        description="Across assigned sections"
                        icon={Users}
                        accent="slate"
                    />

                    <SummaryCard
                        title="Active Students"
                        value={counts.activeStudents}
                        description="Students with active status"
                        icon={UserCheck}
                        accent="blue"
                    />
                </section>

                {/* Section list panel */}
                <section className={panelClass}>
                    <div className="flex flex-col gap-3 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-base font-bold text-white/90">
                                Section List
                            </h2>

                            <p className="mt-1 text-xs text-white/40">
                                View and review your assigned academic sections
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
                            <ClipboardList
                                size={14}
                                className="text-[#A9E5D2]"
                            />
                            {filteredSections.length}{" "}
                            {filteredSections.length === 1
                                ? "section"
                                : "sections"}
                        </span>
                    </div>

                    {/* Search and filters */}
                    <div className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0C1B2A] px-4 py-4 shadow-[0_8px_16px_rgba(0,0,0,0.12)] sm:px-5">
                        <div className="mb-3">
                            <div className="relative min-w-0">
                                <Search
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        updateFilter(setSearch, event.target.value)
                                    }
                                    placeholder="Search sections or programs..."
                                    aria-label="Search sections"
                                    className={`${inputClass} pl-10 pr-10`}
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateFilter(setSearch, "")
                                        }
                                        aria-label="Clear search"
                                        title="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 transition hover:bg-white/[0.08] hover:text-white"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
                            <FilterSelect
                                label="Program"
                                value={programFilter}
                                options={PROGRAMS}
                                onChange={(value) =>
                                    updateFilter(setProgramFilter, value)
                                }
                            />

                            <FilterSelect
                                label="Year Level"
                                value={yearFilter}
                                options={YEAR_LEVELS}
                                onChange={(value) =>
                                    updateFilter(setYearFilter, value)
                                }
                            />

                            <FilterSelect
                                label="Academic Year"
                                value={academicYearFilter}
                                options={ACADEMIC_YEARS}
                                onChange={(value) =>
                                    updateFilter(setAcademicYearFilter, value)
                                }
                            />

                            <FilterSelect
                                label="Semester"
                                value={semesterFilter}
                                options={SEMESTERS}
                                onChange={(value) =>
                                    updateFilter(setSemesterFilter, value)
                                }
                            />

                            <FilterSelect
                                label="Status"
                                value={statusFilter}
                                options={SECTION_STATUSES}
                                onChange={(value) =>
                                    updateFilter(setStatusFilter, value)
                                }
                            />
                        </div>

                        {hasFilters && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                >
                                    <RotateCcw size={13} />
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Section table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                                    {[
                                        "Section",
                                        "Program",
                                        "Year Level",
                                        "Students",
                                        "Status",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/[0.07]">
                                {paginatedSections.map((section) => (
                                    <tr
                                        key={section.id}
                                        className="transition-colors hover:bg-[#A9E5D2]/[0.035]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                                    <Layers size={17} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white/90">
                                                        {section.name}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-white/40">
                                                        {section.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="max-w-[260px] px-5 py-4 text-sm text-white/55">
                                            {section.program}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-white/60">
                                                {section.yearLevel}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/65">
                                                <Users
                                                    size={15}
                                                    className="text-[#A9E5D2]"
                                                />
                                                {section.students.length}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <SectionStatus
                                                status={section.status}
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                title="View Details"
                                                aria-label={`View details for ${section.name}`}
                                                onClick={() =>
                                                    setSelectedSection(section)
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2] transition-all duration-200 hover:bg-[#477F73]/30 hover:text-white active:scale-95"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {paginatedSections.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center"
                                        >
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                                                <Search size={21} />
                                            </div>

                                            <h3 className="mt-4 text-sm font-bold text-white/85">
                                                {hasFilters
                                                    ? "No matching sections found"
                                                    : "No sections available"}
                                            </h3>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/40">
                                                {hasFilters
                                                    ? "Try changing your search or filters to find a section."
                                                    : "There are currently no sections assigned to you."}
                                            </p>

                                            {hasFilters && (
                                                <button
                                                    type="button"
                                                    onClick={resetFilters}
                                                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#A9E5D2] transition hover:text-white"
                                                >
                                                    <RotateCcw size={14} />
                                                    Clear filters
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <p className="text-xs text-white/40">
                            Showing{" "}
                            <strong className="font-semibold text-white/75">
                                {filteredSections.length === 0
                                    ? 0
                                    : (safePage - 1) * ITEMS_PER_PAGE + 1}
                            </strong>{" "}
                            to{" "}
                            <strong className="font-semibold text-white/75">
                                {Math.min(
                                    safePage * ITEMS_PER_PAGE,
                                    filteredSections.length
                                )}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-white/75">
                                {filteredSections.length}
                            </strong>{" "}
                            sections
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                aria-label="Previous page"
                                title="Previous page"
                                disabled={safePage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1)
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={
                                        page === safePage ? "page" : undefined
                                    }
                                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition ${
                                        page === safePage
                                            ? "border-[#A9E5D2]/25 bg-[#477F73]/25 text-[#A9E5D2]"
                                            : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.08] hover:text-white"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                aria-label="Next page"
                                title="Next page"
                                disabled={safePage >= totalPages}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(totalPages, page + 1)
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {selectedSection && (
                <SectionDetailsModal
                    key={selectedSection.id}
                    section={selectedSection}
                    onClose={() => setSelectedSection(null)}
                />
            )}
        </FacultyLayout>
    );
}