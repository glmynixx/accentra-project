import Icon from "../common/icon";

const menuItems = [
{ label: "Dashboard", icon: "layout-dashboard", path: "/faculty/dashboard" },
{ label: "My Sections", icon: "layers", path: "/faculty/sections" },
{ label: "Content Management", icon: "files", path: "/faculty/content" },
{ label: "Task Management", icon: "clipboard-list", path: "/faculty/tasks" },
{ label: "Submissions", icon: "folder-check", path: "/faculty/submissions" },
{ label: "Results", icon: "chart-no-axes-column", path: "/faculty/results" },
{ label: "My Accounts", icon: "user-round", path: "/faculty/account" },
];

export default function FacultySidebar({
activeMenu = "Dashboard",
onMenuChange,
open = false,
}) {
const handleNavigation = (event, item) => { 
event.preventDefault();
onMenuChange?.(item.label);

if (item.path) {
  window.location.href = item.path;
}


};

const itemClasses = (active) => `     group relative flex w-full items-center gap-3 rounded-xl
    px-4 py-3 text-sm font-medium transition-all duration-200
    ${
      active
        ? "bg-white text-[#142A43] shadow-[0_5px_18px_rgba(0,0,0,0.12)]"
        : "text-[#C7D2E0] hover:bg-white/[0.08] hover:text-white"
    }
  `;

return (
<aside
className={`         fixed left-0 top-0 z-[60] flex h-screen w-[260px]
        shrink-0 flex-col overflow-hidden border-r border-[#263B55]
        bg-[#142A43] shadow-[8px_0_30px_rgba(15,35,60,0.20)]
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        min-[769px]:translate-x-0
      `}
>
{/* Background */} <div className="pointer-events-none absolute inset-0 overflow-hidden"> <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#36534E]/20 blur-3xl" /> <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#294B70]/25 blur-3xl" /> </div>

  {/* Logo */}
  <div className="relative shrink-0 px-6 pb-7 pt-7">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#142A43] shadow-md">
        <span className="text-lg font-extrabold">A</span>
      </div>

      <div>
        <div className="text-[21px] font-bold tracking-tight text-white">
          ACCENTRA
        </div>
        <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8FA3BA]">
          Accounting System
        </div>
      </div>
    </div>
  </div>

  {/* Faculty navigation */}
  <nav className="relative flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
    {menuItems.map((item) => {
      const active = activeMenu === item.label;

      return (
        <a
          href={item.path}
          key={item.label}
          aria-current={active ? "page" : undefined}
          className={itemClasses(active)}
          onClick={(event) => handleNavigation(event, item)}
        >
          {active && (
            <span className="absolute bottom-1/2 left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#6FA58F]" />
          )}

          <Icon
            name={item.icon}
            className={`h-[18px] w-[18px] shrink-0 ${
              active
                ? "text-[#36534E]"
                : "text-[#8FA3BA] group-hover:text-white"
            }`}
          />

          <span>{item.label}</span>
        </a>
      );
    })}


  </nav>
</aside>

);
}
