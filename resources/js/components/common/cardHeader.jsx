import React from "react";

export default function CardHeader({
    title,
    subtitle,
    action,
    children,
}) {
    return (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-1 text-sm leading-6 text-white/50">
                        {subtitle}
                    </p>
                )}
            </div>

            {(action || children) && (
                <div className="flex shrink-0 items-center gap-2">
                    {action}
                    {children}
                </div>
            )}
        </div>
    );
}