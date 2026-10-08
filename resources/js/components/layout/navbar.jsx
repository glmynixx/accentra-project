import Icon from "../common/icon";

export default function Navbar({
  onMenuToggle,
  searchValue = "",
  onSearchChange,
  showPageInfo = true,
  showSearch = true,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        mb-6
        flex
        min-h-[72px]
        items-center
        justify-between
        gap-5
        rounded-2xl
        border
        border-[#263B55]
        bg-[#142A43]
        px-5
        py-3.5
        shadow-[0_6px_24px_rgba(15,35,60,0.16)]
        transition-all
        duration-300
        max-[900px]:gap-3
        max-[600px]:px-4
      "
    >
      {/* Left Side */}
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-5
          max-[900px]:gap-3
        "
      >
        {/* Mobile Menu */}
        <button
          type="button"
          className="
            hidden
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-[#3A506A]
            bg-white/[0.08]
            text-[#C7D2E0]
            transition-all
            duration-200
            hover:bg-white/[0.14]
            hover:text-white
            active:scale-95
            max-[768px]:flex
          "
          aria-label="Open menu"
          onClick={onMenuToggle}
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>

        {/* Page Information */}
        {showPageInfo && (
          <div className="min-w-0 shrink-0">
            <h1
              className="
                text-xl
                font-bold
                tracking-tight
                text-white
                max-[600px]:text-lg
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-0.5
                text-xs
                text-[#8FA3BA]
                max-[600px]:hidden
              "
            >
              Welcome back, Admin!
            </p>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div
            className="
              flex
              h-10
              min-w-0
              max-w-[420px]
              flex-1
              items-center
              gap-2.5
              rounded-xl
              border
              border-[#3A506A]
              bg-[#0F2239]/60
              px-3.5
              text-[#8FA3BA]
              transition-all
              duration-200
              focus-within:border-[#6FA58F]/60
              focus-within:bg-[#0F2239]
              focus-within:ring-4
              focus-within:ring-[#6FA58F]/10
              max-[600px]:max-w-none
            "
          >
            <Icon
              name="search"
              className="h-4 w-4 shrink-0"
            />

            <input
              type="text"
              value={searchValue}
              onChange={(event) =>
                onSearchChange?.(event.target.value)
              }
              placeholder="Search users, sections..."
              aria-label="Search users and sections"
              className="
                min-w-0
                flex-1
                border-0
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-[#71869E]
              "
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-3
        "
      >
        {/* Notification */}
        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[#3A506A]
            bg-white/[0.08]
            text-[#AFC0D2]
            transition-all
            duration-200
            hover:bg-white/[0.14]
            hover:text-white
            active:scale-95
          "
          aria-label="Notifications"
        >
          <Icon
            name="bell"
            className="h-[18px] w-[18px]"
          />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              border-2
              border-[#142A43]
              bg-[#6FA58F]
            "
          />
        </button>

        {/* Admin Profile */}
        <div
          className="
            flex
            cursor-pointer
            items-center
            gap-2.5
            rounded-xl
            px-2
            py-1.5
            transition-colors
            duration-200
            hover:bg-white/[0.08]
            max-[600px]:px-0
          "
        >
          {/* Avatar */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#36534E]
              text-xs
              font-bold
              text-white
              shadow-[0_4px_12px_rgba(0,0,0,0.18)]
              ring-2
              ring-white/10
            "
          >
            AD
          </div>

          {/* Admin Details */}
          <div
            className="
              flex
              min-w-0
              flex-col
              max-[600px]:hidden
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Admin
            </span>

            <span
              className="
                mt-0.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-[#71869E]
              "
            >
              Administrator
            </span>
          </div>

          <Icon
            name="chevron-down"
            className="
              h-4
              w-4
              text-[#71869E]
              transition-colors
              duration-200
              group-hover:text-white
              max-[600px]:hidden
            "
          />
        </div>
      </div>
    </header>
  );
}
