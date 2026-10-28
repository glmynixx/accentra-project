
import React from "react";

export default function CardHeader({
    title,
    subtitle,
    description,
    action,
    actionText,
    children,
}) {
    const headerDescription = description ?? subtitle;

    return (
        <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {title}
                </h2>

                {headerDescription && (
                    <p className="mt-1 text-sm leading-6 text-white/50">
                        {headerDescription}
                    </p>
                )}
            </div>

            {(action || actionText || children) && (
                <div className="flex shrink-0 items-center gap-2">
                    {action}

                    {actionText && (
                        <span className="text-xs font-semibold text-[#A9E5D2]">
                            {actionText}
                        </span>
                    )}

                    {children}
                </div>
            )}
        </div>
    );
}
