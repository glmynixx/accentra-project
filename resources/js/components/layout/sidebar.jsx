import { useEffect, useState } from "react";

import Icon from "../common/icon";

const menuItems = [
  {
    label: "Dashboard",
    icon: "layout-dashboard",
    path: "/",
  },
];

const userManagementItems = [
  {
    label: "Faculty",
    icon: "graduation-cap",
    path: "/faculty",
  },
  {
    label: "Students",
    icon: "user-round",
    path: "/students",
  },
  {
    label: "Sections",
    icon: "layout-list",
    path: "/sections",
  },
];

const bottomMenuItems = [
  {
    label: "System Settings",
    icon: "settings",
    path: "/settings",
  },
  {
    label: "Logout",
    icon: "log-out",
    path: null,
  },
];

export default function Sidebar({
  activeMenu,
  onMenuChange,
  open = false,
}) {
  const isUserManagementActive = userManagementItems.some(
    (item) => activeMenu === item.label
  );

  const [userManagementOpen, setUserManagementOpen] = useState(
    isUserManagementActive
  );

  useEffect(() => {
    if (isUserManagementActive) {
      setUserManagementOpen(true);
    }
  }, [isUserManagementActive]);

  const handleNavigation = (event, item) => {
    event.preventDefault();

    onMenuChange?.(item.label);

    if (item.path) {
      window.location.href = item.path;
    }
  };

  const getMenuItemClasses = (isActive) => `
    group
    relative
    flex
    w-full
    items-center
    gap-3
    rounded-xl
    px-4
    py-3
    text-sm
    font-medium
    transition-all
    duration-200
    ease-out
    ${
      isActive
        ? "bg-white text-[#142A43] shadow-[0_5px_18px_rgba(0,0,0,0.12)]"
        : "text-[#C7D2E0] hover:bg-white/[0.08] hover:text-white"
    }
  `;

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-[60]
        flex
        h-screen
        w-[260px]
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-[#263B55]
        bg-[#142A43]
        shadow-[8px_0_30px_rgba(15,35,60,0.20)]
        transition-transform
        duration-300
        ease-out
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }
        min-[769px]:translate-x-0
      `}
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#36534E]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#294B70]/25 blur-3xl" />
      </div>

      {/* LOGO */}
      <div className="relative shrink-0 px-6 pb-7 pt-7">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white
              text-[#142A43]
              shadow-[0_6px_18px_rgba(0,0,0,0.15)]
            "
          >
            <span className="text-lg font-extrabold">A</span>
          </div>

          <div>
            <div
              className="
                text-[21px]
                font-bold
                tracking-tight
                text-white
              "
            >
              ACCENTRA
            </div>

            <div
              className="
                mt-0.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#8FA3BA]
              "
            >
              Accounting System
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

        {menuItems.map((item) => {
          const isActive = activeMenu === item.label;

          return (
            <a
              href={item.path}
              key={item.label}
              className={getMenuItemClasses(isActive)}
              onClick={(event) =>
                handleNavigation(event, item)
              }
            >
              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    bottom-1/2
                    h-7
                    w-1
                    -translate-y-1/2
                    rounded-r-full
                    bg-[#6FA58F]
                  "
                />
              )}

              <Icon
                name={item.icon}
                className={`
                  h-[18px]
                  w-[18px]
                  shrink-0
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "text-[#36534E]"
                      : "text-[#8FA3BA] group-hover:text-white"
                  }
                `}
              />

              <span>{item.label}</span>
            </a>
          );
        })}

        {/* USER MANAGEMENT */}
        <div>
          <button
            type="button"
            className={`
              group
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                isUserManagementActive
                  ? "bg-white/[0.08] text-white"
                  : "text-[#C7D2E0] hover:bg-white/[0.08] hover:text-white"
              }
            `}
            onClick={() =>
              setUserManagementOpen(
                (current) => !current
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon
                name="user-cog"
                className={`
                  h-[18px]
                  w-[18px]
                  shrink-0
                  transition-colors
                  duration-200
                  ${
                    isUserManagementActive
                      ? "text-[#7EB39A]"
                      : "text-[#8FA3BA] group-hover:text-white"
                  }
                `}
              />

              <span>User Management</span>
            </span>

            <span
              className={`
                flex
                h-5
                w-5
                items-center
                justify-center
                text-[#71869E]
                transition-transform
                duration-200
                ${
                  userManagementOpen
                    ? "rotate-180"
                    : "rotate-0"
                }
              `}
            >
              <Icon
                name="chevron-down"
                className="h-4 w-4"
              />
            </span>
          </button>

          {/* SUBMENU */}
          <div
            className={`
              grid
              transition-all
              duration-200
              ease-out
              ${
                userManagementOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="overflow-hidden">
              <div
                className="
                  relative
                  ml-5
                  mt-1
                  space-y-1
                  border-l
                  border-[#314863]
                  pl-3
                "
              >
                {userManagementItems.map((item) => {
                  const isActive =
                    activeMenu === item.label;

                  return (
                    <a
                      href={item.path}
                      key={item.label}
                      className={`
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-[13px]
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-white text-[#142A43] shadow-sm"
                            : "text-[#9FB0C2] hover:bg-white/[0.07] hover:text-white"
                        }
                      `}
                      onClick={(event) =>
                        handleNavigation(
                          event,
                          item
                        )
                      }
                    >
                      {isActive && (
                        <span
                          className="
                            absolute
                            -left-[17px]
                            top-1/2
                            h-5
                            w-0.5
                            -translate-y-1/2
                            rounded-full
                            bg-[#6FA58F]
                          "
                        />
                      )}

                      <Icon
                        name={item.icon}
                        className={`
                          h-4
                          w-4
                          shrink-0
                          transition-colors
                          duration-200
                          ${
                            isActive
                              ? "text-[#36534E]"
                              : "text-[#71869E] group-hover:text-[#B8D0C3]"
                          }
                        `}
                      />

                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MENU */}
        <div className="mt-auto pt-6">
          <div className="mb-4 border-t border-[#2B415B]" />

          <div className="space-y-1">
            {bottomMenuItems.map((item) => {
              const isActive =
                activeMenu === item.label;

              return (
                <a
                  href={item.path || "#"}
                  key={item.label}
                  className={getMenuItemClasses(isActive)}
                  onClick={(event) =>
                    handleNavigation(
                      event,
                      item
                    )
                  }
                >
                  <Icon
                    name={item.icon}
                    className={`
                      h-[18px]
                      w-[18px]
                      shrink-0
                      transition-colors
                      duration-200
                      ${
                        isActive
                          ? "text-[#36534E]"
                          : "text-[#8FA3BA] group-hover:text-white"
                      }
                    `}
                  />

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}

