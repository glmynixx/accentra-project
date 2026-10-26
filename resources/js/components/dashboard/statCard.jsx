import React from "react";
import {
    UsersRound,
    GraduationCap,
    UserRound,
    Layers3,
} from "lucide-react";

const iconMap = {
    "users-round": UsersRound,
    "graduation-cap": GraduationCap,
    "user-round": UserRound,
    "layers-3": Layers3,
};

export default function StatCard({
    title,
    label,
    value,
    subtitle,
    icon,
    accent = "#A9E5D2",
}) {
    const Icon = typeof icon === "string" ? iconMap[icon] : icon;

    return (
        <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] transition-all duration-300 hover:-translate-y-1 hover:border-[#A9E5D2]/40 hover:from-white/[0.12] hover:to-white/[0.05] sm:p-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.12] blur-3xl transition-opacity duration-300 group-hover:opacity-25"
                style={{ backgroundColor: accent }}
            />

            <div className="relative flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/60">
                        {label ?? title}
                    </p>

                    <p className="mt-3 break-words text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl">
                        {value ?? 0}
                    </p>

                    {subtitle && (
                        <p className="mt-3 text-xs leading-5 text-white/50">
                            {subtitle}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                        style={{ color: accent }}
                    >
                        <Icon
                            className="h-5 w-5"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>

            <div
                className="relative mt-5 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-16"
                style={{ backgroundColor: accent }}
            />
        </div>
    );
}