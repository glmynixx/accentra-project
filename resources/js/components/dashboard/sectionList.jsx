import React from "react";
import CardHeader from "../common/cardHeader";

export default function SectionList({ sections = [] }) {
    return (
        <section className="min-w-0">
            <CardHeader
                title="Sections"
                subtitle="Overview of registered sections"
            />

            <div className="space-y-3">
                {sections.length > 0 ? (
                    sections.map((section, index) => {
                        const sectionName =
                            section.section_name ||
                            section.name ||
                            section.code ||
                            "Unnamed Section";

                        const sectionCode =
                            section.section_code ||
                            section.code ||
                            sectionName;

                        const status = String(
                            section.status || "Active",
                        );

                        const isActive =
                            status.toLowerCase() === "active";

                        return (
                            <div
                                key={section.id ?? index}
                                className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all duration-300 hover:border-[#A9E5D2]/25 hover:bg-white/[0.05] sm:gap-4 sm:p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.08] text-[#A9E5D2] transition-colors group-hover:bg-[#A9E5D2]/[0.12]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="4"
                                                width="18"
                                                height="16"
                                                rx="2"
                                            />
                                            <path d="M8 8h8M8 12h8M8 16h4" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-white/90">
                                            {sectionName}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-white/45">
                                            {sectionCode}
                                        </p>

                                        {section.program && (
                                            <p className="mt-1 truncate text-xs text-white/40">
                                                {section.program}
                                                {section.year
                                                    ? ` · ${section.year}`
                                                    : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
                                            isActive
                                                ? "border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.08] text-[#A9E5D2]"
                                                : "border-white/10 bg-white/[0.04] text-white/55"
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                isActive
                                                    ? "bg-[#A9E5D2]"
                                                    : "bg-white/40"
                                            }`}
                                        />
                                        {status}
                                    </span>

                                    {section.students_count != null && (
                                        <p className="text-xs text-white/45">
                                            {section.students_count} students
                                        </p>
                                    )}

                                    {section.students != null &&
                                        section.students_count == null && (
                                            <p className="text-xs text-white/45">
                                                {section.students} students
                                            </p>
                                        )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                        <p className="text-sm text-white/55">
                            No sections available.
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                            Registered sections will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
