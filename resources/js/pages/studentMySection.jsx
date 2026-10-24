
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
} from "lucide-react";

import StudentLayout from "../components/layout/studentLayout";
import CardHeader from "../components/common/cardHeader";

const sectionInfo = {
    sectionCode: "SEC-001",
    sectionName: "BSAIS 11CA",
    program: "BS Accounting Information System",
    yearLevel: "1st Year",
    schoolYear: "2026-2027",
    semester: "1st Semester",
    faculty: "Cai Soriano",
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

const panelClass =
    "min-w-0 overflow-hidden rounded-2xl border border-[#C9D5E2] bg-white shadow-[0_5px_25px_rgba(27,53,83,0.06)] transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(27,53,83,0.09)]";

const inputClass =
    "h-10 w-full rounded-xl border border-[#C9D5E2] bg-white px-3.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#8795A5] focus:border-[#3B6FA5]/50 focus:ring-4 focus:ring-[#3B6FA5]/10";

const sectionThemes = {
    blue: {
        icon: "bg-[#D6E5F5] text-[#3B6FA5]",
        accent: "text-[#3B6FA5]",
        border: "border-[#C9D8EA]",
        focus: "focus:border-[#3B6FA5]/50 focus:ring-[#3B6FA5]/10",
    },
    green: {
        icon: "bg-[#E7EDF3] text-[#267653]",
        accent: "text-[#267653]",
        border: "border-[#B9D9C8]",
        focus: "focus:border-[#267653]/50 focus:ring-[#267653]/10",
    },
    purple: {
        icon: "bg-[#E7EDF3] text-[#B54747]",
        accent: "text-[#B54747]",
        border: "border-[#D8CCF4]",
        focus: "focus:border-[#7653B5]/50 focus:ring-[#7653B5]/10",
    },
};

function Panel({ title, description, children }) {
    return (
        <section className={panelClass}>
            <CardHeader title={title} description={description} />
            {children}
        </section>
    );
}

/* MINI AVATARS */
function StudentAvatar({ name, theme = "blue" }) {
    const initials = name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const colors = sectionThemes[theme];

    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${colors.border} ${colors.icon} text-xs font-bold`}
        >
            {initials}
        </div>
    );
}

function StatusBadge({ status }) {
    const normalized = status?.toLowerCase();

    const styles = {
        active: "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]",
        inactive: "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]",
    };

    const dotStyles = {
        active: "bg-[#31805E]",
        inactive: "bg-[#7C8794]",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                styles[normalized] ??
                "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    dotStyles[normalized] ?? "bg-[#7C8794]"
                }`}
            />
            {status}
        </span>
    );
}

function DayBadge({ day }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#E0D5FA] bg-[#E7EDF3] px-3 py-1.5 text-xs font-semibold text-[#B54747]">
            <CalendarDays size={14} />
            {day}
        </span>
    );
}

function SelectInput({ value, onChange, children, theme = "blue" }) {
    const colors = sectionThemes[theme];

    return (
        <div className="relative min-w-0">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`${inputClass} appearance-none pr-9 ${colors.focus}`}
            >
                {children}
            </select>

            <ChevronDown
                size={16}
                className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${colors.accent}`}
            />
        </div>
    );
}

function EmptyState({ message, theme = "blue" }) {
    const colors = sectionThemes[theme];

    return (
        <div className="px-5 py-10 text-center">
            <div
                className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${colors.icon}`}
            >
                <Search size={20} />
            </div>

            <p className="mt-3 text-sm font-semibold text-[#40566E]">
                {message}
            </p>

            <p className="mt-1 text-xs text-[#8795A5]">
                Try adjusting your search or filter.
            </p>
        </div>
    );
}

export default function StudentMySection() {
    const [studentSearch] = useState("");
    const [studentStatus] = useState("All");
    const [selectedDay, setSelectedDay] = useState("All");

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const query = studentSearch.toLowerCase().trim();

            const matchesSearch =
                student.id.toLowerCase().includes(query) ||
                student.name.toLowerCase().includes(query) ||
                student.email.toLowerCase().includes(query);

            const matchesStatus =
                studentStatus === "All" || student.status === studentStatus;

            return matchesSearch && matchesStatus;
        });
    }, [studentSearch, studentStatus]);

    const filteredSchedules = useMemo(() => {
        if (selectedDay === "All") return schedules;

        return schedules.filter((schedule) => schedule.day === selectedDay);
    }, [selectedDay]);

    const totalStudents = students.length;
    const totalActive = students.filter(
        (student) => student.status === "Active"
    ).length;

    return (
        <StudentLayout
            activeMenu="My Section"
            title="My Section"
            subtitle="View your section information, classmates, and schedule."
            showPageInfo={false}
            showSearch={false}
        >
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
                {/* PAGE HEADING */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#294B70]">
                            Academic Management
                        </span>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                            My Section
                        </h1>

                        <p className="mt-1 text-sm text-[#738396]">
                            View your section information and schedule.
                        </p>
                    </div>
                </div>

                {/* STUDENT INFORMATION */}
                <Panel
                    title="Student Information"
                    description="Your assigned section and academic details."
                >
                    <div className="border-b border-[#C9D8EA] bg-[#E7EDF3] p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#D6E5F5] text-[#3B6FA5]">
                                    <Layers size={25} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#60758A]">
                                        Assigned Section
                                    </p>

                                    <h2 className="mt-1 break-words text-xl font-bold tracking-tight text-[#243A52] sm:text-2xl">
                                        {sectionInfo.sectionName}
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-[#3B6FA5]">
                                        {sectionInfo.sectionCode}
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#B9D9C8] bg-[#E1F0E8] px-3 py-1.5 text-xs font-semibold text-[#267653]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#31805E]" />
                                Enrolled
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                        {/* PROGRAM */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#D4E2F1] bg-[#EAF1F9] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8FB4DE] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D6E5F5] text-[#3B6FA5] transition-transform duration-200 group-hover:scale-105">
                                <BookOpen size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#60758A]">Program</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.program}
                                </p>
                            </div>
                        </div>

                        {/* YEAR LEVEL */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#F1D9B8] bg-[#FFF4E5] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E8BE83] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FCE4C4] text-[#B87524] transition-transform duration-200 group-hover:scale-105">
                                <GraduationCap size={21} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#98774F]">Year Level</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.yearLevel}
                                </p>
                            </div>
                        </div>

                        {/* SCHOOL YEAR */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#B9D9C8] bg-[#E1F0E8] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8FC6A8] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CBE5D6] text-[#267653] transition-transform duration-200 group-hover:scale-105">
                                <CalendarRange size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#56816C]">School Year</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.schoolYear}
                                </p>
                            </div>
                        </div>

                        {/* SEMESTER */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#D8CCF4] bg-[#F0EAFE] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B9A2E8] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0D5FA] text-[#7653B5] transition-transform duration-200 group-hover:scale-105">
                                <CalendarDays size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#8068A9]">Semester</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.semester}
                                </p>
                            </div>
                        </div>

                        {/* ASSIGNED FACULTY */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#B8E0DA] bg-[#E2F5F3] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8ACFC5] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7EAE5] text-[#23877D] transition-transform duration-200 group-hover:scale-105">
                                <UserRound size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#528E87]">Assigned Faculty</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.faculty}
                                </p>
                            </div>
                        </div>

                        {/* SECTION CODE */}
                        <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#F0CACA] bg-[#FCEAEA] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5A5A5] hover:shadow-md">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5D1D1] text-[#B54747] transition-transform duration-200 group-hover:scale-105">
                                <Hash size={20} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-[#A36565]">Section Code</p>
                                <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#243A52]">
                                    {sectionInfo.sectionCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* STUDENT LIST */}
                <section className={panelClass}>
                
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <CardHeader
                                title="Student List"
                                description="View the students enrolled in your section."
                            />
                        </div>

                        {/* STUDENT COUNTS */}
                        <div className="flex flex-wrap items-center gap-2 px-5 pb-4 sm:shrink-0 sm:py-0 sm:pl-0">
                            <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B9D9C8] bg-[#E1F0E8] px-3 py-1">
                                <GraduationCap size={13} className="text-[#267653]" />
                                <span className="text-[11px] font-semibold text-[#267653]">
                                    Total Students:
                                </span>
                                <span className="text-[11px] font-bold text-[#267653]">
                                    {totalStudents}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B9D9C8] bg-[#E1F0E8] px-3 py-1">
                                <UserRound size={13} className="text-[#267653]" />
                                <span className="text-[11px] font-semibold text-[#267653]">
                                    Active Students:
                                </span>
                                <span className="text-[11px] font-bold text-[#267653]">
                                    {totalActive}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[650px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#B9D9C8] bg-[#E7EDF3]">
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Student ID
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Student
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Email Address
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="border-b border-[#E5EBF1] transition-colors duration-150 last:border-b-0 hover:bg-[#F3F9F5]"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#40566E]">
                                                {student.id}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <StudentAvatar
                                                        name={student.name}
                                                        theme="green"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-[#243A52]">
                                                            {student.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-[#9AA7B5]">
                                                            Student
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#50647A]">
                                                {student.email}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={student.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>
                                            <EmptyState
                                                message="No students found."
                                                theme="green"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-[#E5EBF1] px-5 py-4 text-xs text-[#7A8999] sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Showing{" "}
                            <span className="font-semibold text-[#243A52]">
                                {filteredStudents.length}
                            </span>
                            {" "}of{" "}
                            <span className="font-semibold text-[#243A52]">
                                {students.length}
                            </span>
                            {" "}students
                        </p>
                    </div>
                </section>

                {/* SECTION SCHEDULE */}
                <Panel
                    title="Section Schedule"
                    description="View your class days, times, and assigned rooms."
                >
                    <div className="flex flex-col gap-3 border-b border-[#D8CCF4] bg-[#E7EDF3] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#526579]">
                            <CalendarDays size={18} className="text-[#B54747]" />
                            <span>Class · {sectionInfo.schoolYear}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter size={16} className="shrink-0 text-[#B54747]" />
                            <div className="min-w-[160px]">
                                <SelectInput
                                    value={selectedDay}
                                    onChange={setSelectedDay}
                                    theme="purple"
                                >
                                    <option value="All">All Days</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Friday">Friday</option>
                                </SelectInput>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[750px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#D8CCF4] bg-[#E7EDF3]">
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Subject
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Day
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Time
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Room
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#53677D]">
                                        Faculty
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule) => (
                                        <tr
                                            key={schedule.id}
                                            className="border-b border-[#E5EBF1] transition-colors duration-150 last:border-b-0 hover:bg-[#E7EDF3]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E7EDF3] text-[#B54747]">
                                                        <BookOpen size={17} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-[#243A52]">
                                                            {schedule.subject}
                                                        </p>
                                                        <p className="mt-1 text-xs text-[#7A8999]">
                                                            {schedule.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <DayBadge day={schedule.day} />
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-[#50647A]">
                                                    <Clock size={16} className="shrink-0 text-[#B54747]" />
                                                    {schedule.time}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-[#50647A]">
                                                    <MapPin size={16} className="shrink-0 text-[#B54747]" />
                                                    {schedule.room}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <StudentAvatar
                                                        name={schedule.faculty}
                                                        theme="purple"
                                                    />
                                                    <span className="text-sm font-medium text-[#50647A]">
                                                        {schedule.faculty}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState
                                                message="No classes scheduled for this day."
                                                theme="purple"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            </div>
        </StudentLayout>
    );
}
