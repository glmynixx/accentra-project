
export default function CardHeader({
    title,
    description,
    subtitle,
    action,
    children,
}) {
    // Support both the existing Admin UI and updated Faculty UI.
    const isFacultyStyle =
        subtitle !== undefined ||
        action !== undefined ||
        children !== undefined;

    // Updated Faculty UI design.
    if (isFacultyStyle) {
        return (
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                        {title}
                    </h2>

                    {(subtitle || description) && (
                        <p className="mt-1 text-sm leading-6 text-white/50">
                            {subtitle || description}
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

    // Existing Admin UI design.
    return (
        <div
            className="
                flex items-center gap-4
                border-b border-[#DCE4EC]
                bg-gradient-to-r from-[#DCE6F0] to-white
                px-5 py-4
                max-[600px]:items-start
            "
        >
            <div className="min-w-0">
                <h3 className="text-[15px] font-bold tracking-tight text-[#243A52]">
                    {title}
                </h3>

                {description && (
                    <p className="mt-0.5 text-xs text-[#7A8999]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
