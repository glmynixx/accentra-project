import Icon from "../common/icon";

export default function Navbar({
    onMenuToggle,
    searchValue = "",
    onSearchChange,
    showPageInfo = true,
    showSearch = true,
    profileName = "Admin",
    profileRole = "Administrator",
    avatarText = "AD",
    pageTitle = "Dashboard",
    welcomeText = "Welcome back, Admin!",
    searchPlaceholder = "Search users, sections...",
}) {
    return (
        <header
            className="
                sticky top-0 z-30 mb-6
                flex h-[72px] w-full min-w-0
                items-center justify-between gap-4
                rounded-2xl border border-[#263B55]
                bg-[#071522] px-5
                shadow-[0_6px_24px_rgba(15,35,60,0.16)]
                transition-all duration-300
                max-[900px]:gap-3
                max-[600px]:mb-4
                max-[600px]:h-16
                max-[600px]:rounded-xl
                max-[600px]:px-3
            "
        >
            {/* Left Side */}
            <div className="flex min-w-0 flex-1 items-center gap-5 max-[900px]:gap-3">
                {/* Mobile Menu */}
                <button
                    type="button"
                    className="
                        hidden h-10 w-10 shrink-0
                        items-center justify-center rounded-xl
                        border border-[#3A506A] bg-white/[0.08]
                        text-[#C7D2E0] transition-all duration-200
                        hover:bg-white/[0.14] hover:text-white
                        active:scale-95 max-[768px]:flex
                    "
                    aria-label="Open menu"
                    onClick={onMenuToggle}
                >
                    <Icon name="menu" className="h-5 w-5" />
                </button>

                {/* Page Information */}
                {showPageInfo && (
                    <div className="min-w-0 shrink-0 max-[600px]:hidden">
                        <h1 className="truncate text-xl font-bold tracking-tight text-white">
                            {pageTitle}
                        </h1>

                        <p className="mt-0.5 truncate text-xs text-[#8FA3BA]">
                            {welcomeText}
                        </p>
                    </div>
                )}

                {/* Search */}
                {showSearch && (
                    <div
                        className="
                            flex h-10 min-w-0 max-w-[420px] flex-1
                            items-center gap-2.5 rounded-xl
                            border border-[#3A506A] bg-[#0F2239]/60
                            px-3.5 text-[#8FA3BA]
                            transition-all duration-200
                            focus-within:border-[#6FA58F]/60
                            focus-within:bg-[#0F2239]
                            focus-within:ring-4
                            focus-within:ring-[#6FA58F]/10
                            max-[600px]:max-w-none
                        "
                    >
                        <Icon name="search" className="h-4 w-4 shrink-0" />

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(event) =>
                                onSearchChange?.(event.target.value)
                            }
                            placeholder={searchPlaceholder}
                            aria-label="Search"
                            className="
                                min-w-0 w-full flex-1 border-0
                                bg-transparent text-sm text-white
                                outline-none
                                placeholder:text-[#71869E]
                            "
                        />
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex shrink-0 items-center gap-3 max-[600px]:gap-2">
                {/* Notifications */}
                <button
                    type="button"
                    className="
                        relative flex h-10 w-10 shrink-0
                        items-center justify-center rounded-xl border
                        border-[#3A506A] bg-white/[0.08]
                        text-[#AFC0D2] transition-all duration-200
                        hover:bg-white/[0.14] hover:text-white
                        active:scale-95
                    "
                    aria-label="Notifications"
                >
                    <Icon name="bell" className="h-[18px] w-[18px]" />

                    <span
                        aria-hidden="true"
                        className="
                            absolute right-2 top-2 h-2 w-2
                            rounded-full border-2 border-[#142A43]
                            bg-[#6FA58F]
                        "
                    />
                </button>

                {/* User Profile */}
                <button
                    type="button"
                    className="
                        group flex min-w-0 items-center gap-2.5
                        rounded-xl px-2 py-1.5 text-left
                        transition-colors duration-200
                        hover:bg-white/[0.08]
                        max-[600px]:px-0
                    "
                    aria-label={`Profile: ${profileName}`}
                >
                    {/* Avatar */}
                    <div
                        className="
                            flex h-9 w-9 shrink-0 items-center
                            justify-center rounded-full bg-[#36534E]
                            text-xs font-bold text-white
                            shadow-[0_4px_12px_rgba(0,0,0,0.18)]
                            ring-2 ring-white/10
                        "
                    >
                        {avatarText}
                    </div>

                    {/* User Details */}
                    <div className="flex min-w-0 flex-col max-[600px]:hidden">
                        <span className="truncate text-sm font-semibold text-white">
                            {profileName}
                        </span>

                        <span
                            className="
                                mt-0.5 truncate text-[10px] font-medium
                                uppercase tracking-wide text-[#71869E]
                            "
                        >
                            {profileRole}
                        </span>
                    </div>

                    <Icon
                        name="chevron-down"
                        className="
                            h-4 w-4 shrink-0 text-[#71869E]
                            transition-colors duration-200
                            group-hover:text-white
                            max-[600px]:hidden
                        "
                    />
                </button>
            </div>
        </header>
    );
}