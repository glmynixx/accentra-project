export default function CardHeader({
    title,
    description,
    subtitle,
    action,
    actionText,
    children,
}) {
    const headerDescription = description ?? subtitle;
    const isFacultyStyle =
        subtitle !== undefined || action !== undefined || children !== undefined || actionText !== undefined;

    if (isFacultyStyle) {
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

    return (
        <div className="flex items-center gap-4 border-b border-[#DCE4EC] bg-gradient-to-r from-[#DCE6F0] to-white px-5 py-4 max-[600px]:items-start">
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
