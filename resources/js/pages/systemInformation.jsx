import { useState } from "react";

import { Head } from "@inertiajs/react";
import {
    Info,
    Eye,
    Clock3,
    Activity,
    Users,
    GraduationCap,
    UserRound,
    X,
    Layers3,
    Database,
    Server,
    CalendarClock,
    Code2,
    Tag,
    RefreshCw,
    CheckCircle2,
    CircleAlert,
    Settings2,
    ShieldCheck,
} from "lucide-react";

import SettingsLayout, {
    settingsCardClass,
    settingsButtonClass,
} from "../components/layout/settingsLayout";

const systemInformation = [
    {
        label: "Total Users",
        value: "123",
        description: "All registered administrator, faculty, and student accounts.",
        icon: Users,
    },
    {
        label: "Total Students",
        value: "118",
        description: "Registered student accounts.",
        icon: UserRound,
    },
    {
        label: "Total Faculty",
        value: "5",
        description: "Registered faculty accounts.",
        icon: GraduationCap,
    },
    {
        label: "Total Sections",
        value: "4",
        description: "Academic sections maintained in the system.",
        icon: Layers3,
    },
];

const statusInformation = [
    {
        label: "Server Time",
        value: "Not connected",
        description: "Application server clock and timestamp availability.",
        icon: Clock3,
    },
    {
        label: "Database Status",
        value: "Not verified",
        description: "Database connection and query availability.",
        icon: Database,
    },
    {
        label: "Server Status",
        value: "Not verified",
        description: "Application service availability.",
        icon: Server,
    },
    {
        label: "Most Recent Update",
        value: "Not available",
        description: "Latest recorded application update.",
        icon: RefreshCw,
    },
];

const versionInformation = [
    {
        label: "System Name",
        value: "ACCENTRA",
        description: "Accounting Information System.",
        icon: Info,
    },
    {
        label: "Version",
        value: "v1.0.0",
        description: "Application release identifier.",
        icon: Tag,
    },
    {
        label: "Framework",
        value: "Laravel (PHP)",
        description: "Backend application framework.",
        icon: Code2,
    },
    {
        label: "Database",
        value: "MySQL",
        description: "Database engine and connection configuration.",
        icon: Database,
    },
    {
        label: "Environment",
        value: "Not configured",
        description: "Application runtime environment.",
        icon: Settings2,
    },
    {
        label: "Last Updated",
        value: "—",
        description: "Date of the latest recorded system update.",
        icon: CalendarClock,
    },
];

function SectionHeader({ icon: Icon, title, description }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={20} />
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

function InformationRow({ icon: Icon, label, value, description }) {
    return (
        <div className="flex min-w-0 items-start gap-3 border-b border-white/[0.07] py-3 last:border-0 last:pb-0">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={16} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs text-white/50">{label}</p>

                <p className="mt-1 break-words text-sm font-medium text-white">
                    {value}
                </p>

                {description && (
                    <p className="mt-1 text-xs leading-5 text-white/40">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatusIndicator({ label, value }) {
    const isVerified =
        value === "Connected" ||
        value === "Online" ||
        value === "Operational";

    const isUnavailable =
        value === "Not verified" ||
        value === "Not connected" ||
        value === "Not available" ||
        value === "—";

    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white/65">
                {label}
            </span>

            <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                    isVerified
                        ? "border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2]"
                        : isUnavailable
                          ? "border-white/10 bg-white/[0.04] text-white/45"
                          : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                }`}
            >
                {isVerified ? (
                    <CheckCircle2 size={13} />
                ) : (
                    <CircleAlert size={13} />
                )}
                {value}
            </span>
        </div>
    );
}

function DetailTile({ icon: Icon, label, value, description }) {
    return (
        <div className="flex h-full min-w-0 flex-col rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-5 text-white/60">{label}</p>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                    <Icon size={17} />
                </div>
            </div>

            <p className="mt-4 break-words text-2xl font-bold tracking-tight text-white">
                {value}
            </p>

            <p className="mt-2 flex-1 text-xs leading-5 text-white/40">
                {description}
            </p>
        </div>
    );
}

export default function SystemInformation() {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <SettingsLayout
            activeMenu="System Information"
            pageTitle="System Information"
            description="View system statistics, application health, and version details."
        >
            <Head title="System Information" />

            <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                
                <section
                    className={`${settingsCardClass} flex h-full min-w-0 flex-col p-5 sm:p-6`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SectionHeader
                            icon={Info}
                            title="System Information"
                            description="System-wide user and section statistics."
                        />

                        <button
                            type="button"
                            onClick={() => setShowDetails(true)}
                            className={settingsButtonClass}
                        >
                            <Eye size={16} />
                            View
                        </button>
                    </div>

                    <div className="mt-6 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        {systemInformation.map(
                            ({ label, value, description, icon: Icon }) => (
                                <DetailTile
                                    key={label}
                                    icon={Icon}
                                    label={label}
                                    value={value}
                                    description={description}
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#477F73]/10 text-[#A9E5D2]">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white">
                                    Account and Record Management
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/40">
                                    These statistics summarize registered
                                    accounts and academic records maintained
                                    by ACCENTRA. 
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

               
                <section
                    className={`${settingsCardClass} flex h-full min-w-0 flex-col p-5 sm:p-6`}
                >
                    <SectionHeader
                        icon={Activity}
                        title="System Status Overview"
                        description="Monitor application availability and system health."
                    />

                    <div className="mt-5 flex-1 space-y-5">
                        {statusInformation.slice(0, 3).map(
                            ({ label, value, description, icon: Icon }) => (
                                <div key={label} className="space-y-2">
                                    <StatusIndicator
                                        label={label}
                                        value={value}
                                    />

                                    <div className="flex items-start gap-2 pl-1">
                                        <Icon
                                            size={14}
                                            className="mt-0.5 shrink-0 text-white/30"
                                        />

                                        <p className="text-xs leading-5 text-white/40">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="mt-5 border-t border-white/[0.07] pt-3">
                        <InformationRow
                            icon={RefreshCw}
                            label="Most Recent Update"
                            value="Not available"
                            
                        />
                    </div>

                    
                </section>

                <section
                    className={`${settingsCardClass} min-w-0 p-5 sm:p-6 xl:col-span-2`}
                >
                    <SectionHeader
                        icon={Code2}
                        title="System Version"
                        description="Application identity and technology configuration."
                    />

                    <div className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                        {versionInformation.map(
                            ({ label, value, description, icon: Icon }) => (
                                <InformationRow
                                    key={label}
                                    icon={Icon}
                                    label={label}
                                    value={value}
                                    description={description}
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <div className="flex items-start gap-3">
                            <Settings2
                                size={18}
                                className="mt-0.5 shrink-0 text-[#A9E5D2]"
                            />

                            <div>
                                <p className="text-sm font-medium text-white">
                                    Configuration Information
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/45">
                                   Displays the application's current version, technical configuration, database connection, environment, and update status to ensure the system is properly configured and operational.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Detailed System Information Modal */}
            {showDetails && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#030B12]/80 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowDetails(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="system-info-title"
                        className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.13] bg-[#0B1B29] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
                            <div>
                                <h2
                                    id="system-info-title"
                                    className="font-semibold text-white"
                                >
                                    System Information
                                </h2>

                                <p className="mt-1 text-xs text-white/45">
                                    Available system details and configuration.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setShowDetails(false)}
                                className="rounded-lg p-2 text-white/55 hover:bg-white/[0.08] hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="space-y-5 p-5">
                            <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A9E5D2]">
                                    System Information
                                </h3>

                                {systemInformation.map(
                                    ({ label, value, description, icon: Icon }) => (
                                        <InformationRow
                                            key={label}
                                            icon={Icon}
                                            label={label}
                                            value={value}
                                            description={description}
                                        />
                                    ),
                                )}
                            </div>

                            <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A9E5D2]">
                                    System Status Overview
                                </h3>

                                {statusInformation.map(
                                    ({ label, value, description, icon: Icon }) => (
                                        <InformationRow
                                            key={label}
                                            icon={Icon}
                                            label={label}
                                            value={value}
                                            description={description}
                                        />
                                    ),
                                )}
                            </div>

                            <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A9E5D2]">
                                    System Version
                                </h3>

                                {versionInformation.map(
                                    ({ label, value, description, icon: Icon }) => (
                                        <InformationRow
                                            key={label}
                                            icon={Icon}
                                            label={label}
                                            value={value}
                                            description={description}
                                        />
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-white/[0.08] p-5">
                            <button
                                type="button"
                                onClick={() => setShowDetails(false)}
                                className={settingsButtonClass}
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </SettingsLayout>
    );
}
