import React from "react";
import CardHeader from "../common/cardHeader";
import Icon from "../common/icon";

const getActivityStyle = (activity) => {
    const text = [
        activity.description,
        activity.action,
        activity.message,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (
        text.includes("added") ||
        text.includes("created") ||
        text.includes("new student")
    ) {
        return {
            icon: "user-plus",
            color: "text-[#A9E5D2]",
            background: "bg-[#A9E5D2]/10",
            border: "border-[#A9E5D2]/20",
        };
    }

    if (text.includes("section")) {
        return {
            icon: "layers",
            color: "text-[#93C5FD]",
            background: "bg-[#93C5FD]/10",
            border: "border-[#93C5FD]/20",
        };
    }

    if (text.includes("activat")) {
        return {
            icon: "user-check",
            color: "text-[#86EFAC]",
            background: "bg-[#86EFAC]/10",
            border: "border-[#86EFAC]/20",
        };
    }

    if (text.includes("setting") || text.includes("config")) {
        return {
            icon: "settings",
            color: "text-[#FDBA74]",
            background: "bg-[#FDBA74]/10",
            border: "border-[#FDBA74]/20",
        };
    }

    if (
        text.includes("profile") ||
        text.includes("updated") ||
        text.includes("edited")
    ) {
        return {
            icon: "user-round-pen",
            color: "text-[#D8B4FE]",
            background: "bg-[#D8B4FE]/10",
            border: "border-[#D8B4FE]/20",
        };
    }

    return {
        icon: "activity",
        color: "text-[#A9E5D2]",
        background: "bg-[#A9E5D2]/10",
        border: "border-[#A9E5D2]/20",
    };
};

const getUserName = (activity) => {
    const user =
        activity.user_name ??
        activity.actor_name ??
        activity.causer_name ??
        activity.performed_by ??
        activity.user ??
        activity.causer ??
        activity.actor;

    if (typeof user === "string") {
        return user.trim() || null;
    }

    if (user && typeof user === "object") {
        return (
            user.name ??
            user.full_name ??
            user.username ??
            null
        );
    }

    return null;
};

const getUserRole = (activity) => {
    const role =
        activity.user_role ??
        activity.actor_role ??
        activity.causer_role ??
        activity.role ??
        activity.user?.role ??
        activity.causer?.role ??
        activity.actor?.role;

    if (typeof role === "string" && role.trim()) {
        return role;
    }

    if (Array.isArray(role) && role.length > 0) {
        return role
            .map((item) =>
                typeof item === "string" ? item : item?.name
            )
            .filter(Boolean)
            .join(", ");
    }

    return null;
};

const getTarget = (activity) => {
    const target =
        activity.target_name ??
        activity.subject_name ??
        activity.details ??
        activity.detail;

    if (typeof target === "string" && target.trim()) {
        return target;
    }

    if (target && typeof target === "object") {
        return (
            target.name ??
            target.title ??
            target.description ??
            null
        );
    }

    return null;
};

const getTimestamp = (activity) =>
    activity.created_at ??
    activity.time ??
    activity.date ??
    null;

export default function RecentActivities({ activities = [] }) {
    return (
        <section
            className="
                min-w-0 overflow-hidden rounded-2xl
                border border-white/[0.13]
                bg-gradient-to-br from-white/[0.105] to-white/[0.025]
                p-5
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)]
                backdrop-blur-[22px]
                sm:p-6
            "
        >
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <CardHeader
                        title="Recent Activities"
                        subtitle="Who did what in the system"
                    />
                </div>

                <div
                    className="
                        flex shrink-0 items-center gap-1.5
                        rounded-full border border-[#A9E5D2]/20
                        bg-[#A9E5D2]/[0.07] px-2.5 py-1
                        text-[10px] font-medium text-[#A9E5D2]
                    "
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A9E5D2]" />
                    Activity log
                </div>
            </div>

            {activities.length > 0 ? (
                <div className="space-y-1">
                    {activities.map((activity, index) => {
                        const style = getActivityStyle(activity);

                        const userName = getUserName(activity);
                        const userRole = getUserRole(activity);

                        const description =
                            activity.description ||
                            activity.action ||
                            activity.message ||
                            "System activity";

                        const target = getTarget(activity);
                        const timestamp = getTimestamp(activity);

                        return (
                            <div
                                key={activity.id ?? index}
                                className="
                                    group flex min-w-0 items-start gap-3
                                    rounded-xl border border-transparent
                                    p-3 transition-all duration-200
                                    hover:border-white/[0.07]
                                    hover:bg-white/[0.035]
                                "
                            >
                                <div
                                    className={`
                                        flex h-10 w-10 shrink-0
                                        items-center justify-center
                                        rounded-xl border
                                        ${style.border}
                                        ${style.background}
                                        ${style.color}
                                        transition-transform duration-200
                                        group-hover:scale-105
                                    `}
                                >
                                    <Icon
                                        name={style.icon}
                                        className="h-[18px] w-[18px]"
                                    />
                                </div>

                                <div className="min-w-0 flex-1 py-0.5">
                                    {/* Actor */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-white">
                                            {userName || "Unknown user"}
                                        </span>

                                        {userRole && (
                                            <span
                                                className="
                                                    rounded-md border
                                                    border-white/10
                                                    bg-white/[0.04]
                                                    px-1.5 py-0.5
                                                    text-[9px] font-medium
                                                    uppercase tracking-wide
                                                    text-white/50
                                                "
                                            >
                                                {userRole}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <p className="mt-1 break-words text-sm leading-5 text-white/65">
                                        {description}
                                    </p>

                                    {/* Target or affected record */}
                                    {target && (
                                        <div className="mt-2 flex min-w-0 items-start gap-1.5">
                                            <Icon
                                                name="file-text"
                                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/35"
                                            />

                                            <span className="min-w-0 break-words text-xs text-[#A9E5D2]/80">
                                                {target}
                                            </span>
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    {timestamp && (
                                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/40">
                                            <Icon
                                                name="clock-3"
                                                className="h-3 w-3 shrink-0"
                                            />
                                            <span>{timestamp}</span>
                                        </div>
                                    )}
                                </div>

                                <Icon
                                    name="chevron-right"
                                    className="
                                        mt-3 h-4 w-4 shrink-0
                                        text-white/20
                                        transition-all duration-200
                                        group-hover:translate-x-0.5
                                        group-hover:text-white/50
                                    "
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/40">
                        <Icon
                            name="history"
                            className="h-5 w-5"
                        />
                    </div>

                    <p className="text-sm font-medium text-white/70">
                        No recent activities
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                        System updates will appear here when available.
                    </p>
                </div>
            )}
        </section>
    );
}