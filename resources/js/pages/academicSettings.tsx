
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import {
    GraduationCap,
    Pencil,
    CalendarDays,
    Layers3,
    BookOpen,
    X,
    Save,
    ListOrdered,
    CircleCheck,
    Clock3,
    Archive,
} from "lucide-react";

import SettingsLayout, {
    settingsCardClass,
    settingsInputClass,
    settingsButtonClass,
} from "../components/layout/settingsLayout";

const defaultYearLevels = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
];

const semesters = [
    "First Semester",
    "Second Semester",
];

const periodStatuses = [
    "Active",
    "Upcoming",
    "Closed",
];

const programs = [
    { value: "Bachelor of Science in Accounting Information Systems", label: "Bachelor of Science in Accounting Information Systems" },
    { value: "Bachelor of Science in Entrepreneurship", label: "Bachelor of Science in Entrepreneurship" },
];

type AcademicSettingsValues = {
    academicYear: string;
    semester: string;
    periodStatus: PeriodStatus;
    defaultProgram: string;
    yearLevels: string[];
};

type PeriodStatus = (typeof periodStatuses)[number];
type EditSection = "all" | "period" | "structure";
type AcademicSettingsPageProps = {
    academicSettings: AcademicSettingsValues;
    updatedAt: string | null;
};

function SettingsSectionHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={22} />
            </div>

            <div className="min-w-0">
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-white/45">
                    {description}
                </p>
            </div>
        </div>
    );
}

function FieldLabel({ children }: { children: ReactNode }) {
    return (
        <span className="mb-2 block text-sm font-medium text-white/65">
            {children}
        </span>
    );
}

function StatusBadge({ status }: { status: PeriodStatus }) {
    const styles: Record<PeriodStatus, string> = {
        Active: "border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2]",
        Upcoming: "border-sky-300/20 bg-sky-400/10 text-sky-200",
        Closed: "border-white/10 bg-white/[0.06] text-white/50",
    };

    const icons: Record<PeriodStatus, LucideIcon> = {
        Active: CircleCheck,
        Upcoming: Clock3,
        Closed: Archive,
    };

    const Icon = icons[status] || Clock3;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                styles[status] || styles.Active
            }`}
        >
            <Icon size={14} />
            {status}
        </span>
    );
}

export default function AcademicSettings() {
    const { academicSettings } = usePage<AcademicSettingsPageProps>().props;
    const [settings, setSettings] = useState(academicSettings);
    const [draft, setDraft] = useState(academicSettings);
    const [editing, setEditing] = useState(false);
    const [editSection, setEditSection] = useState<EditSection>("all");
    const [message, setMessage] = useState("");

    const openEditor = (section: EditSection = "all") => {
        setDraft({
            ...settings,
            yearLevels: [...settings.yearLevels],
        });
        setEditSection(section);
        setMessage("");
        setEditing(true);
    };

    const closeEditor = () => {
        setEditing(false);
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setDraft((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleYearLevelChange = (yearLevel: string, checked: boolean) => {
        setDraft((current) => ({
            ...current,
            yearLevels: checked
                ? defaultYearLevels.filter(
                      (year) =>
                          current.yearLevels.includes(year) ||
                          year === yearLevel,
                  )
                : current.yearLevels.filter(
                      (year) => year !== yearLevel,
                  ),
        }));
    };

    const saveSettings = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            (editSection === "all" || editSection === "period") &&
            !draft.academicYear.trim()
        ) {
            setMessage("Please enter the current academic year.");
            return;
        }

        if (
            (editSection === "all" || editSection === "structure") &&
            draft.yearLevels.length === 0
        ) {
            setMessage("Please select at least one year level.");
            return;
        }

        const updatedSettings = {
            ...draft,
            academicYear: draft.academicYear.trim(),
            yearLevels: defaultYearLevels.filter((year) =>
                draft.yearLevels.includes(year),
            ),
        };

        router.post("/settings/academic", updatedSettings, {
            onSuccess: () => {
                setSettings(updatedSettings);
                setEditing(false);
                setMessage("Academic settings saved successfully.");
            },
            onError: () => {
                setMessage("Please review the academic settings and try again.");
            },
        });
    };

    const activeYearLevels = settings.yearLevels;

    return (
        <SettingsLayout
            activeMenu="Academic Settings"
            pageTitle="Academic Settings"
            description="Manage the academic period, programs, and available year levels."
        >
            <Head title="Academic Settings" />

            <div className="space-y-6">
                {message && (
                    <div
                        role="status"
                        className="flex items-start justify-between gap-3 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-3 text-sm text-[#A9E5D2]"
                    >
                        <p>{message}</p>

                        <button
                            type="button"
                            onClick={() => setMessage("")}
                            aria-label="Dismiss message"
                            className="shrink-0 rounded-md p-1 text-[#A9E5D2]/70 hover:bg-white/[0.05] hover:text-[#A9E5D2]"
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

                {/* Academic Information */}
                <section
                    className={`${settingsCardClass} min-w-0 p-5 sm:p-6`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SettingsSectionHeader
                            icon={CalendarDays}
                            title="Academic Information"
                            description="Manage the current academic year and semester."
                        />

                        <button
                            type="button"
                            onClick={() => openEditor("period")}
                            className={settingsButtonClass}
                        >
                            <Pencil size={15} />
                            Edit Settings
                        </button>
                    </div>

                    <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                            <div className="flex items-center gap-2 text-white/45">
                                <CalendarDays size={16} />
                                <span className="text-xs">
                                    Current Academic Year
                                </span>
                            </div>

                            <p className="mt-3 break-words text-lg font-semibold text-white">
                                {settings.academicYear || "Not configured"}
                            </p>
                        </div>

                        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                            <div className="flex items-center gap-2 text-white/45">
                                <Layers3 size={16} />
                                <span className="text-xs">
                                    Current Semester
                                </span>
                            </div>

                            <p className="mt-3 break-words text-lg font-semibold text-white">
                                {settings.semester}
                            </p>
                        </div>

                        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                            <p className="text-xs text-white/45">
                                Academic Period Status
                            </p>

                            <div className="mt-3">
                                <StatusBadge status={settings.periodStatus} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Structure */}
                <section
                    className={`${settingsCardClass} min-w-0 p-5 sm:p-6`}
                >
                    <SettingsSectionHeader
                        icon={GraduationCap}
                        title="Academic Structure"
                        description="Set the default academic program and available year levels."
                    />

                    <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Default Program */}
                        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#477F73]/15 text-[#A9E5D2]">
                                    <BookOpen size={19} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        Default Program
                                    </h3>
                                    <p className="mt-1 text-xs text-white/40">
                                        Default program for new academic
                                        configurations.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-xs text-white/45">
                                    Currently selected program
                                </p>

                                <p className="mt-2 break-words text-base font-semibold text-white">
                                    {settings.defaultProgram ||
                                        "No program configured"}
                                </p>
                            </div>
                        </div>

                        {/* Year Levels */}
                        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#477F73]/15 text-[#A9E5D2]">
                                        <ListOrdered size={19} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Year Levels
                                        </h3>
                                        <p className="mt-1 text-xs text-white/40">
                                            Available academic year levels.
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full border border-[#A9E5D2]/15 bg-[#477F73]/10 px-2.5 py-1 text-xs font-medium text-[#A9E5D2]">
                                    {activeYearLevels.length} selected
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {defaultYearLevels.map((year, index) => {
                                    const isSelected =
                                        activeYearLevels.includes(year);

                                    return (
                                        <div
                                            key={year}
                                            className={`flex min-w-0 items-center gap-2 rounded-xl border p-3 ${
                                                isSelected
                                                    ? "border-[#A9E5D2]/15 bg-[#477F73]/10"
                                                    : "border-white/[0.08] bg-white/[0.02] opacity-50"
                                            }`}
                                        >
                                            <span
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                                    isSelected
                                                        ? "bg-[#477F73]/20 text-[#A9E5D2]"
                                                        : "bg-white/[0.06] text-white/45"
                                                }`}
                                            >
                                                {index + 1}
                                            </span>

                                            <span className="text-sm text-white/75">
                                                {year}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-white/[0.08] pt-5">
                        <button
                            type="button"
                            onClick={() => openEditor("structure")}
                            className={settingsButtonClass}
                        >
                            <Pencil size={15} />
                            Manage Academic Structure
                        </button>
                    </div>
                </section>
            </div>

            {/* Edit Academic Settings Modal */}
            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#030B12]/80 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={saveSettings}
                        className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/[0.13] bg-[#0B1B29] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.08] p-5 sm:p-6">
                            <div>
                                <h2 className="font-semibold text-white">
                                    {editSection === "period"
                                        ? "Edit Academic Information"
                                        : editSection === "structure"
                                          ? "Manage Academic Structure"
                                          : "Edit Academic Settings"}
                                </h2>
                                <p className="mt-1 text-xs text-white/45">
                                    {editSection === "period"
                                        ? "Update the academic year, semester, and period status."
                                        : editSection === "structure"
                                          ? "Choose the default program and available year levels."
                                          : "Update the academic period and structure."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditor}
                                aria-label="Close"
                                className="rounded-lg p-2 text-white/55 hover:bg-white/[0.08] hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            {/* Academic Information fields */}
                            {(editSection === "all" ||
                                editSection === "period") && (
                                <>
                                    <label className="block">
                                        <FieldLabel>
                                            Current Academic Year
                                        </FieldLabel>

                                        <input
                                            type="text"
                                            name="academicYear"
                                            value={draft.academicYear}
                                            onChange={handleChange}
                                            placeholder="e.g. 2026-2027"
                                            pattern="[0-9]{4}-[0-9]{4}"
                                            title="Use the format YYYY-YYYY, such as 2026-2027."
                                            className={settingsInputClass}
                                            required
                                        />
                                    </label>

                                    <label className="block">
                                        <FieldLabel>
                                            Current Semester
                                        </FieldLabel>

                                        <select
                                            name="semester"
                                            value={draft.semester}
                                            onChange={handleChange}
                                            className={settingsInputClass}
                                        >
                                            {semesters.map((semester) => (
                                                <option
                                                    key={semester}
                                                    value={semester}
                                                    className="bg-[#0B1B29]"
                                                >
                                                    {semester}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block">
                                        <FieldLabel>
                                            Academic Period Status
                                        </FieldLabel>

                                        <select
                                            name="periodStatus"
                                            value={draft.periodStatus}
                                            onChange={handleChange}
                                            className={settingsInputClass}
                                        >
                                            {periodStatuses.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                    className="bg-[#0B1B29]"
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </>
                            )}

                            {/* Academic Structure fields */}
                            {(editSection === "all" ||
                                editSection === "structure") && (
                                <>
                                    <label className="block">
                                        <FieldLabel>
                                            Default Program
                                        </FieldLabel>

                                        <select
                                            name="defaultProgram"
                                            value={draft.defaultProgram}
                                            onChange={handleChange}
                                            className={settingsInputClass}
                                            required
                                        >
                                            {programs.map((program) => (
                                                <option
                                                    key={program.value}
                                                    value={program.value}
                                                    className="bg-[#0B1B29]"
                                                >
                                                    {program.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <div>
                                        <FieldLabel>
                                            Available Year Levels
                                        </FieldLabel>

                                        <p className="mb-3 text-xs leading-5 text-white/40">
                                            Select the year levels to be used in the system.
                                        </p>

                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {defaultYearLevels.map((year) => (
                                                <label
                                                    key={year}
                                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 transition hover:bg-white/[0.05]"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={draft.yearLevels.includes(
                                                            year,
                                                        )}
                                                        onChange={(event) =>
                                                            handleYearLevelChange(
                                                                year,
                                                                event.target.checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-[#A9E5D2]"
                                                    />

                                                    <span className="text-sm text-white/80">
                                                        {year}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:justify-end sm:p-6">
                            <button
                                type="button"
                                onClick={closeEditor}
                                className="rounded-xl border border-white/[0.12] px-4 py-2.5 text-sm text-white/65 hover:bg-white/[0.05]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={settingsButtonClass}
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </SettingsLayout>
    );
}
