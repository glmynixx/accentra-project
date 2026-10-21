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
} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

/*
|--------------------------------------------------------------------------
| SAMPLE SECTION DATA
|--------------------------------------------------------------------------
*/

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
            { id: "2025-2001", name: "Gabriel Thomas Mendoza", status: "Active" },
            { id: "2025-2002", name: "Chloe Anne Dela Cruz", status: "Active" },
            { id: "2025-2003", name: "Nathaniel Lopez", status: "Active" },
            { id: "2025-2004", name: "Samantha Reyes", status: "Active" },
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
            { id: "2024-3001", name: "Andrea Nicole Ramos", status: "Active" },
            { id: "2024-3002", name: "Mark Anthony Villanueva", status: "Inactive" },
            { id: "2024-3003", name: "Patricia Mae Aquino", status: "Active" },
            { id: "2024-3004", name: "John Carlo Bautista", status: "Active" },
            { id: "2024-3005", name: "Kimberly Ann Torres", status: "Active" },
            { id: "2024-3006", name: "Miguel Angelo Castillo", status: "Active" },
        ],
    },
    {
        id: "SEC-004",
        name: "BSAIS 12CB",
        program: "BS Accounting Information System",
        yearLevel: "1st Year",
        academicYear: "2025-2026",
        semester: "2nd Semester",
        facultyAssigned: "Cai Soriano",
        status: "Inactive",
        students: [
            { id: "2025-1101", name: "Beatrice Anne Lim", status: "Active" },
            { id: "2025-1102", name: "Francis Gabriel Tan", status: "Active" },
            { id: "2025-1103", name: "Nicole Marie Diaz", status: "Inactive" },
        ],
    },
    {
        id: "SEC-005",
        name: "BSEN 21CA",
        program: "BS Entrepreneurship",
        yearLevel: "2nd Year",
        academicYear: "2026-2027",
        semester: "2nd Semester",
        facultyAssigned: "Cai Soriano",
        status: "Active",
        students: [
            { id: "2025-2101", name: "Paolo Miguel Santos", status: "Active" },
            { id: "2025-2102", name: "Francesca Mae Garcia", status: "Active" },
            { id: "2025-2103", name: "Adrian James Cruz", status: "Active" },
        ],
    },
];

const PROGRAMS = [
    "BS Accounting Information System",
    "BS Entrepreneurship",
];

const YEAR_LEVELS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
];

const ACADEMIC_YEARS = [
    "2025-2026",
    "2026-2027",
    "2027-2028",
];

const SEMESTERS = [
    "1st Semester",
    "2nd Semester",
    "Summer",
];

const SECTION_STATUSES = ["Active", "Inactive"];
const ITEMS_PER_PAGE = 5;

/*
|--------------------------------------------------------------------------
| REUSABLE STYLES
|--------------------------------------------------------------------------
*/

const inputClass =
    "w-full rounded-xl border border-[#C9D6E4] bg-white px-3.5 py-2.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| STATUS BADGES
|--------------------------------------------------------------------------
*/

function SectionStatus({ status }) {
    const isActive = status === "Active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                isActive
                    ? "border-[#B9D9C8] bg-[#F0F8F3] text-[#267653]"
                    : "border-[#C8D0D9] bg-[#F0F3F6] text-[#647181]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-[#31805E]" : "bg-[#7C8794]"
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                isActive
                    ? "border-[#B9DCC9] bg-[#E3F3E9] text-[#28734D]"
                    : "border-[#E5C5C9] bg-[#F9E8EA] text-[#A6404B]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-[#31805E]" : "bg-[#C65360]"
                }`}
            />
            {status}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| VIEW-ONLY ACTION BUTTON
|--------------------------------------------------------------------------
*/

function ActionButton({ label, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#BFCFDF] bg-[#E6EDF4] text-[#1B3553] transition-all duration-200 hover:border-[#91A9C0] hover:bg-[#D5E1EC] hover:shadow-sm active:scale-95"
        >
            {children}
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    borderColor,
    accentColor,
    iconBackground,
    bars,
}) {
    return (
        <div
            className={`group relative min-w-0 overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} p-5 shadow-[0_5px_22px_rgba(27,53,83,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]`}
        >
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
                {bars.map((bar, index) => (
                    <span
                        key={index}
                        className={`w-1.5 rounded-full ${bar}`}
                    />
                ))}
            </div>

            <div
                className={`absolute bottom-0 left-0 h-1 w-full ${accentColor}`}
            />

            <div className="relative flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBackground} text-white shadow-[0_4px_10px_rgba(27,53,83,0.16)] transition-transform duration-200 group-hover:scale-105`}
                >
                    <Icon size={21} />
                </div>

                <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#526579]">
                        {title}
                    </span>

                    <span className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
                        {value}
                    </span>

                    <span className="mt-1 block text-[11px] text-[#738396]">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| FILTER SELECT
|--------------------------------------------------------------------------
*/

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-[#526579]">
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
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8292A3]"
                />
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| SECTION DETAILS MODAL
|--------------------------------------------------------------------------
*/

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
        {
            label: "Section Name",
            value: section.name,
            style: "border-[#C9D6E3] bg-white",
        },
        {
            label: "Program",
            value: section.program,
            style: "border-[#C9D6E3] bg-white",
        },
        {
            label: "Year Level",
            value: section.yearLevel,
            style: "border-[#B9D5C8] bg-[#F0F8F3]",
        },
        {
            label: "Academic Year",
            value: section.academicYear,
            style: "border-[#C9D6E3] bg-white",
        },
        {
            label: "Semester",
            value: section.semester,
            style: "border-[#C9D6E3] bg-white",
        },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0C1C2D]/60 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="section-modal-title"
                className="my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]"
            >
                <div className="bg-gradient-to-br from-[#142A43] via-[#1B3553] to-[#294B70] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white sm:h-16 sm:w-16">
                                <Building2 size={25} />
                            </div>

                            <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C8D8E8]">
                                    Section Information
                                </span>

                                <h2
                                    id="section-modal-title"
                                    className="mt-1 break-words text-xl font-bold text-white sm:text-2xl"
                                >
                                    {section.name}
                                </h2>

                                <span className="mt-1.5 inline-block rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">
                                    {section.id}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close section details"
                            title="Close"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#EEF2F6] px-4 py-5 sm:px-6 sm:py-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-[#1B3553]">
                                Section & Academic Details
                            </h3>

                            <p className="mt-0.5 text-xs text-[#738396]">
                                Complete information about your assigned section
                            </p>
                        </div>

                        <SectionStatus status={section.status} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {informationCards.map((item) => (
                            <div
                                key={item.label}
                                className={`rounded-xl border px-4 py-3.5 ${item.style}`}
                            >
                                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                                    {item.label}
                                </span>

                                <strong className="mt-1 block break-words text-sm font-semibold text-[#243A52]">
                                    {item.value || "—"}
                                </strong>
                            </div>
                        ))}

                        <div className="rounded-xl border border-[#BFD2E5] bg-[#EEF4F9] px-4 py-3.5">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                                Number of Students
                            </span>

                            <div className="mt-2 flex items-center gap-2">
                                <Users size={18} className="text-[#294B70]" />

                                <strong className="text-sm font-semibold text-[#243A52]">
                                    {section.students.length} students
                                </strong>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5 sm:col-span-2 lg:col-span-3">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                                Faculty Assigned
                            </span>

                            <div className="mt-2 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EDF4] text-[#294B70]">
                                    <UserRound size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="break-words text-sm font-semibold text-[#243A52]">
                                        {section.facultyAssigned}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#8292A3]">
                                        Assigned Faculty
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="mt-6 overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                        <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70]">
                                    <Users size={19} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-[#1B3553]">
                                        Student List
                                    </h3>

                                    <p className="mt-0.5 text-xs text-[#738396]">
                                        Enrolled students in this section
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-white px-3 py-1.5 text-xs font-semibold text-[#526579]">
                                <GraduationCap size={14} />
                                {filteredStudents.length}{" "}
                                {filteredStudents.length === 1
                                    ? "student"
                                    : "students"}
                            </span>
                        </div>

                        <div className="border-b border-[#DCE4EC] bg-[#F7F9FB] px-4 py-4 sm:px-5">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
                                <div className="relative min-w-0">
                                    <Search
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
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
                                    <option value="">Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[540px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-[#C9D6E3] bg-[#E7EDF3]">
                                        {["Student ID", "Name", "Status"].map(
                                            (heading) => (
                                                <th
                                                    key={heading}
                                                    className="whitespace-nowrap px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#53677D] sm:px-5"
                                                >
                                                    {heading}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#E5EBF1]">
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="transition-colors hover:bg-[#F7F9FC]"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[#526579] sm:px-5">
                                                {student.id}
                                            </td>

                                            <td className="px-4 py-3.5 sm:px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-xs font-bold text-[#294B70]">
                                                        {getInitials(student.name)}
                                                    </div>

                                                    <span className="text-sm font-semibold text-[#243A52]">
                                                        {student.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5 sm:px-5">
                                                <StudentStatus status={student.status} />
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-5 py-12 text-center"
                                            >
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#8292A3]">
                                                    <Users size={22} />
                                                </div>

                                                <h4 className="mt-3 text-sm font-bold text-[#243A52]">
                                                    No students found
                                                </h4>

                                                <p className="mt-1 text-xs text-[#8292A3]">
                                                    Try changing your search or status filter.
                                                </p>

                                                {(studentSearch || studentStatusFilter) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setStudentSearch("");
                                                            setStudentStatusFilter("");
                                                        }}
                                                        className="mt-3 text-xs font-semibold text-[#294B70] hover:text-[#1B3553]"
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

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE4EC] bg-white px-4 py-3 sm:px-5">
                            <p className="text-xs text-[#738396]">
                                Showing{" "}
                                <strong className="font-semibold text-[#243A52]">
                                    {filteredStudents.length}
                                </strong>{" "}
                                of{" "}
                                <strong className="font-semibold text-[#243A52]">
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
                                    className="text-xs font-semibold text-[#294B70] hover:text-[#1B3553]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-2 border-t border-[#DCE4EC] bg-white px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#142A43] hover:shadow-md active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| MAIN FACULTY SECTIONS PAGE
|--------------------------------------------------------------------------
*/

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

    /*
    |--------------------------------------------------------------------------
    | SECTION FILTERING
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | SUMMARY COUNTS
    |--------------------------------------------------------------------------
    */

    const counts = useMemo(
        () => ({
            total: sections.length,

            active: sections.filter(
                (section) => section.status === "Active",
            ).length,

            students: sections.reduce(
                (total, section) => total + section.students.length,
                0,
            ),

            activeStudents: sections.reduce(
                (total, section) =>
                    total +
                    section.students.filter(
                        (student) => student.status === "Active",
                    ).length,
                0,
            ),
        }),
        [sections],
    );

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredSections.length / ITEMS_PER_PAGE),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedSections = filteredSections.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
    );

    /*
    |--------------------------------------------------------------------------
    | FILTER HANDLERS
    |--------------------------------------------------------------------------
    */

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
        statusFilter,
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
            <div className="mx-auto w-full max-w-[1600px] pb-8">
                {/* Page heading */}

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#294B70]">
                            Academic Management
                        </span>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                            My Sections
                        </h1>

                        <p className="mt-1 text-sm text-[#738396]">
                            View your assigned sections and monitor enrolled students.
                        </p>
                    </div>

                    <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-3.5 py-2.5 text-sm text-[#526579] shadow-sm">
                        <CalendarDays size={17} className="text-[#294B70]" />
                        <span>Academic Year</span>
                        <span className="font-semibold text-[#1B3553]">
                            2026-2027
                        </span>
                    </div>
                </div>

                {/* Summary cards */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Sections"
                        value={counts.total}
                        description="All assigned sections"
                        icon={ClipboardList}
                        gradient="from-[#E2EAF2] via-[#EDF2F7] to-white"
                        borderColor="border-[#AFC1D4]"
                        accentColor="bg-[#1B3553]/20"
                        iconBackground="bg-[#1B3553]"
                        bars={[
                            "h-3 bg-[#AFC1D4]",
                            "h-5 bg-[#8FA9C1]",
                            "h-8 bg-[#6F8CA8]",
                            "h-6 bg-[#AFC1D4]",
                        ]}
                    />

                    <SummaryCard
                        title="Active Sections"
                        value={counts.active}
                        description="Currently active sections"
                        icon={BookOpen}
                        gradient="from-[#E3F0EA] via-[#EFF6F2] to-white"
                        borderColor="border-[#B9D5C8]"
                        accentColor="bg-[#31805E]/30"
                        iconBackground="bg-[#31795B]"
                        bars={[
                            "h-3 bg-[#B9D9C8]",
                            "h-5 bg-[#8FC1A7]",
                            "h-7 bg-[#5E9C7A]",
                            "h-9 bg-[#31795B]",
                        ]}
                    />

                    <SummaryCard
                        title="Total Students"
                        value={counts.students}
                        description="Across assigned sections"
                        icon={Users}
                        gradient="from-[#E6EAF0] via-[#F0F3F6] to-white"
                        borderColor="border-[#C8D0D9]"
                        accentColor="bg-[#64748B]/25"
                        iconBackground="bg-[#5E6C7C]"
                        bars={[
                            "h-8 bg-[#CBD3DC]",
                            "h-5 bg-[#AAB4BF]",
                            "h-6 bg-[#7C8794]",
                            "h-3 bg-[#5E6C7C]",
                        ]}
                    />

                    <SummaryCard
                        title="Active Students"
                        value={counts.activeStudents}
                        description="Students with active status"
                        icon={GraduationCap}
                        gradient="from-[#DFE8F2] via-[#EAF0F6] to-white"
                        borderColor="border-[#AFC2D8]"
                        accentColor="bg-[#294B70]/30"
                        iconBackground="bg-[#294B70]"
                        bars={[
                            "h-4 bg-[#AFC2D8]",
                            "h-7 bg-[#7898B8]",
                            "h-5 bg-[#52789D]",
                            "h-9 bg-[#294B70]",
                        ]}
                    />
                </div>

                {/* Section list panel */}

                <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                    {/* Panel header */}

                    <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#1B3553]">
                                Section List
                            </h2>

                            <p className="mt-0.5 text-xs text-[#738396]">
                                View and review your assigned academic sections
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-white px-3 py-1.5 text-xs font-semibold text-[#526579]">
                            <ClipboardList size={14} />
                            {filteredSections.length}{" "}
                            {filteredSections.length === 1 ? "section" : "sections"}
                        </span>
                    </div>

                    {/* Search and filters */}

                    <div className="border-b border-[#DCE4EC] bg-[#F7F9FB] px-4 py-4 sm:px-5">
                        <div className="mb-3">
                            <div className="relative min-w-0">
                                <Search
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
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
                                        onClick={() => updateFilter(setSearch, "")}
                                        aria-label="Clear search"
                                        title="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8292A3] transition hover:bg-[#E7EDF3] hover:text-[#243A52]"
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
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294B70] transition hover:text-[#1B3553]"
                                >
                                    <RotateCcw size={13} />
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Table */}

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#C9D6E3] bg-[#E7EDF3]">
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
                                            className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#53677D]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E5EBF1]">
                                {paginatedSections.map((section) => (
                                    <tr
                                        key={section.id}
                                        className="group transition-colors hover:bg-[#F7F9FC]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#294B70]">
                                                    <Building2 size={18} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-[#243A52]">
                                                        {section.name}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-[#8292A3]">
                                                        {section.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="max-w-[260px] px-5 py-4 text-sm text-[#526579]">
                                            {section.program}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex whitespace-nowrap rounded-lg border border-[#D5DFE9] bg-[#F5F8FB] px-2.5 py-1.5 text-xs font-semibold text-[#526579]">
                                                {section.yearLevel}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#526579]">
                                                <Users
                                                    size={15}
                                                    className="text-[#8292A3]"
                                                />
                                                {section.students.length}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <SectionStatus status={section.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <ActionButton
                                                    label={`View details for ${section.name}`}
                                                    onClick={() =>
                                                        setSelectedSection(section)
                                                    }
                                                >
                                                    <Eye size={16} />
                                                </ActionButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {paginatedSections.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#8292A3]">
                                                <Search size={23} />
                                            </div>

                                            <h3 className="mt-4 text-sm font-bold text-[#243A52]">
                                                {hasFilters
                                                    ? "No matching sections found"
                                                    : "No sections available"}
                                            </h3>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#8292A3]">
                                                {hasFilters
                                                    ? "Try changing your search or filters to find a section."
                                                    : "There are currently no sections assigned to you."}
                                            </p>

                                            {hasFilters && (
                                                <button
                                                    type="button"
                                                    onClick={resetFilters}
                                                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#294B70] hover:text-[#1B3553]"
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

                    <div className="flex flex-col gap-3 border-t border-[#DCE4EC] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <p className="text-xs text-[#738396]">
                            Showing{" "}
                            <strong className="font-semibold text-[#243A52]">
                                {filteredSections.length === 0
                                    ? 0
                                    : (safePage - 1) * ITEMS_PER_PAGE + 1}
                            </strong>{" "}
                            to{" "}
                            <strong className="font-semibold text-[#243A52]">
                                {Math.min(
                                    safePage * ITEMS_PER_PAGE,
                                    filteredSections.length,
                                )}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-[#243A52]">
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
                                        Math.max(1, page - 1),
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9D6E3] bg-white text-[#526579] transition hover:bg-[#EEF4F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1,
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
                                            ? "border-[#1B3553] bg-[#1B3553] text-white shadow-sm"
                                            : "border-[#C9D6E3] bg-white text-[#526579] hover:bg-[#EEF4F9]"
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
                                        Math.min(totalPages, page + 1),
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9D6E3] bg-white text-[#526579] transition hover:bg-[#EEF4F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Section details modal */}

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