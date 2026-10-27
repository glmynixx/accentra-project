import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Icon from "../common/icon";

const menuItems = [
    { label: "Dashboard", icon: "layout-dashboard", path: "/dashboard" },
];

const userManagementItems = [
    { label: "Faculty", icon: "graduation-cap", path: "/faculty" },
    { label: "Students", icon: "user-round", path: "/students" },
    { label: "Sections", icon: "layout-list", path: "/sections" },
];

const settingsItems = [
    {
        label: "General Settings",
        icon: "settings",
        path: "/settings/general",
    },
    {
        label: "Academic Settings",
        icon: "graduation-cap",
        path: "/settings/academic",
    },
    {
        label: "System Information",
        icon: "info",
        path: "/settings/information",
    },
];

const bottomMenuItems = [
    { label: "Logout", icon: "log-out", path: null },
];

export default function Sidebar({ activeMenu, onMenuChange, open = false }) {
    const isUserManagementActive = userManagementItems.some(
        (item) => activeMenu === item.label,
    );
    const isSettingsActive = settingsItems.some(
        (item) => activeMenu === item.label,
    );
    const [userManagementOpen, setUserManagementOpen] = useState(isUserManagementActive);
    const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (isUserManagementActive) setUserManagementOpen(true);
    }, [isUserManagementActive]);

    useEffect(() => {
        if (isSettingsActive) setSettingsOpen(true);
    }, [isSettingsActive]);

    const handleNavigation = (event, item) => {
        event.preventDefault();
        onMenuChange?.(item.label);
        if (item.path) router.visit(item.path);
    };

    const handleLogout = () => {
        if (isLoggingOut) return;
        router.post("/logout", {}, {
            onStart: () => setIsLoggingOut(true),
            onFinish: () => setIsLoggingOut(false),
        });
    };

    const getMenuItemClasses = (isActive) =>
        `group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-[#A9E5D2]/10 text-[#A9E5D2] ring-1 ring-inset ring-[#A9E5D2]/20"
                : "text-white/65 hover:bg-white/[0.06] hover:text-white"
        }`;

    const renderItem = (item) => {
        const isActive = activeMenu === item.label;

        if (item.label === "Logout") {
            return (
                <button
                    key={item.label}
                    type="button"
                    className={getMenuItemClasses(false)}
                    onClick={() => setShowLogoutModal(true)}
                >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.label}</span>
                </button>
            );
        }

        return (
            <a
                key={item.label}
                href={item.path || "#"}
                aria-current={isActive ? "page" : undefined}
                className={getMenuItemClasses(isActive)}
                onClick={(event) => handleNavigation(event, item)}
            >
                {isActive && (
                    <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-[#A9E5D2]" />
                )}
                <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
            </a>
        );
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 z-[60] flex h-screen w-[260px] shrink-0 flex-col overflow-hidden border-r border-white/[0.13] bg-[#071522]/95 shadow-[8px_0_40px_rgba(0,0,0,0.25)] backdrop-blur-[22px] transition-transform duration-300 ease-out ${
                    open ? "translate-x-0" : "-translate-x-full"
                } min-[769px]:translate-x-0`}
            >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#477F73]/20 blur-[100px]" />
                    <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#477F73]/15 blur-[110px]" />
                </div>

                <div className="relative shrink-0 border-b border-white/[0.08] px-6 pb-6 pt-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#A9E5D2]/20 bg-[#A9E5D2]/10 text-lg font-extrabold text-[#A9E5D2]">A</div>
                        <div>
                            <div className="text-[21px] font-bold tracking-tight text-white">ACCENTRA</div>
                            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Accounting System</div>
                        </div>
                    </div>
                </div>

                <nav className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-5">
                    <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Main</p>
                    {menuItems.map(renderItem)}

                    <div className="mt-6">
                        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Management</p>
                        <button
                            type="button"
                            aria-expanded={userManagementOpen}
                            onClick={() => setUserManagementOpen((current) => !current)}
                            className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                isUserManagementActive
                                    ? "bg-white/[0.05] text-white"
                                    : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon name="user-cog" className="h-[18px] w-[18px] text-[#A9E5D2]" />
                                User Management
                            </span>
                            <span className={`transition-transform duration-200 ${userManagementOpen ? "rotate-180" : ""}`}>
                                <Icon name="chevron-down" className="h-4 w-4" />
                            </span>
                        </button>
                        <div className={`grid transition-all duration-200 ${
                            userManagementOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}>
                            <div className="overflow-hidden">
                                <div className="relative ml-5 mt-2 space-y-1 border-l border-white/[0.10] pl-3">
                                    {userManagementItems.map(renderItem)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Settings</p>
                        <button
                            type="button"
                            aria-expanded={settingsOpen}
                            onClick={() => setSettingsOpen((current) => !current)}
                            className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                isSettingsActive
                                    ? "bg-white/[0.05] text-white"
                                    : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon name="user-cog" className="h-[18px] w-[18px] text-[#A9E5D2]" />
                                Settings
                            </span>
                            <span className={`transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""}`}>
                                <Icon name="chevron-down" className="h-4 w-4" />
                            </span>
                        </button>
                        <div className={`grid transition-all duration-200 ${
                            settingsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}>
                            <div className="overflow-hidden">
                                <div className="relative ml-5 mt-2 space-y-1 border-l border-white/[0.10] pl-3">
                                    {settingsItems.map(renderItem)}
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8">
                        <div className="mb-4 border-t border-white/[0.08]" />
                        <div className="space-y-1">
                            {bottomMenuItems.map(renderItem)}
                        </div>
                    </div>
                </nav>
            </aside>

            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07111F]/70 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isLoggingOut) {
                            setShowLogoutModal(false);
                        }
                    }}
                >
                    <div role="dialog" aria-modal="true" aria-labelledby="logout-modal-title" aria-describedby="logout-modal-description" className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-[#102437] to-[#071522] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between border-b border-white/[0.10] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <Icon name="log-out" className="h-5 w-5 text-[#A9E5D2]" />
                                <div>
                                    <h2 id="logout-modal-title" className="text-base font-semibold text-white">Log Out</h2>
                                    <p className="mt-1 text-xs text-white/40">ACCENTRA · Admin Portal</p>
                                </div>
                            </div>
                            <button type="button" aria-label="Close logout confirmation" disabled={isLoggingOut} onClick={() => setShowLogoutModal(false)} className="rounded-lg p-2 text-white/60 hover:bg-white/[0.08] hover:text-white">
                                <Icon name="x" className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="px-6 py-6">
                            <p id="logout-modal-description" className="text-sm leading-6 text-white/70">Are you sure you want to log out of your account?</p>
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
                                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-[#A9E5D2]/70" />
                                <p className="text-xs leading-5 text-white/45">You will need to log in again to access your admin dashboard.</p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] px-6 py-4 sm:flex-row sm:justify-end">
                            <button type="button" disabled={isLoggingOut} onClick={() => setShowLogoutModal(false)} className="rounded-lg border border-white/[0.13] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/65 hover:bg-white/[0.08] disabled:opacity-50">Cancel</button>
                            <button type="button" disabled={isLoggingOut} onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-400/20 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-70">
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
