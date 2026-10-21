import { useState } from "react";
import Icon from "../common/icon";

const menuItems = [
  {
    label: "Dashboard",
    icon: "layout-dashboard",
    path: "/faculty/dashboard",
  },
  {
    label: "My Sections",
    icon: "layers",
    path: "/faculty/sections",
  },
  {
    label: "Content Management",
    icon: "files",
    path: "/faculty/content",
  },
  {
    label: "Task Management",
    icon: "clipboard-list",
    path: "/faculty/tasks",
  },
  {
    label: "Submissions",
    icon: "folder-check",
    path: "/faculty/submissions",
  },
  {
    label: "Results",
    icon: "chart-no-axes-column",
    path: "/faculty/results",
  },
  {
    label: "My Account",
    icon: "user-round",
    path: "/faculty/my-account",
  },
];

export default function FacultySidebar({
  activeMenu = "Dashboard",
  onMenuChange,
  open = false,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (event, item) => {
    event.preventDefault();

    onMenuChange?.(item.label);

    if (item.path) {
      window.location.href = item.path;
    }
  };

  const itemClasses = (active) =>
    `group relative flex w-full items-center gap-3 rounded-xl
    px-4 py-3 text-sm font-medium transition-all duration-200
    ${
      active
        ? "bg-white text-[#142A43] shadow-[0_5px_18px_rgba(0,0,0,0.12)]"
        : "text-[#C7D2E0] hover:bg-white/[0.08] hover:text-white"
    }`;

  const handleLogout = (event) => {
    event.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/logout";

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    if (csrfToken) {
      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "_token";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-[260px]
          shrink-0 flex-col overflow-hidden border-r border-[#263B55]
          bg-[#142A43] shadow-[8px_0_30px_rgba(15,35,60,0.20)]
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          min-[769px]:translate-x-0`}
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#36534E]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#294B70]/25 blur-3xl" />
        </div>

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

        {/* Faculty Navigation */}
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

        {/* Logout - original navigation style */}
        <div className="relative shrink-0 border-t border-white/10 px-3 py-4">
          <a
            href="/logout"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#C7D2E0] transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <Icon
              name="log-out"
              className="h-[18px] w-[18px] shrink-0 text-[#8FA3BA] group-hover:text-white"
            />

            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07111F]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isLoggingOut
            ) {
              setShowLogoutModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-description"
            className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#DCE3EA] bg-white shadow-[0_24px_70px_rgba(7,17,31,0.25)]"
          >
            {/* Navy Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#142A43] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-[#D5A2A2]">
                  <Icon name="log-out" className="h-[18px] w-[18px]" />
                </div>

                <div>
                  <h2
                    id="logout-modal-title"
                    className="text-base font-semibold tracking-tight text-white"
                  >
                    Log Out
                  </h2>

                  <p className="mt-1 text-[11px] font-medium tracking-wide text-[#A9B8C9]">
                    ACCENTRA · Faculty Portal
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close logout confirmation"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A9B8C9] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>

            {/* White Body */}
            <div className="bg-white px-6 py-6">
              <p
                id="logout-modal-description"
                className="text-sm leading-6 text-[#405166]"
              >
                Are you sure you want to log out of your account?
              </p>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E5EAF0] bg-[#F6F8FA] px-4 py-3">
                <Icon
                  name="info"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#71869B]"
                />

                <p className="text-xs leading-5 text-[#718096]">
                  You will need to log in again to access your faculty
                  dashboard.
                </p>
              </div>
            </div>

            {/* White Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#E7ECF1] bg-white px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-[#D5DEE7] bg-white px-5 py-2.5 text-sm font-medium text-[#40566E] transition-colors hover:bg-[#F3F6F8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={confirmLogout}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#A50104] bg-[#A50104] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#590004] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Icon name="log-out" className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}