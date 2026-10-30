
import { useState } from "react";

import Sidebar from "../layout/sidebar";
import Navbar from "../layout/navbar";
import MobileOverlay from "../layout/mobileOverlay";

export const settingsCardClass =
    "min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px]";

export const settingsInputClass =
    "mt-2 w-full rounded-xl border border-white/[0.13] bg-[#071522]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#A9E5D2]/50 focus:ring-2 focus:ring-[#A9E5D2]/10";

export const settingsButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/15 px-4 py-2.5 text-sm font-semibold text-[#A9E5D2] transition hover:bg-[#477F73]/25 disabled:cursor-not-allowed disabled:opacity-50";

export default function SettingsLayout({
    activeMenu,
    pageTitle,
    description,
    children,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleMenuChange = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#071522] font-sans text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#477F73]/25 blur-[120px]" />
                <div className="absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-[130px]" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#477F73]/10 blur-[110px]" />
            </div>

            <Sidebar
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                open={sidebarOpen}
            />

            <MobileOverlay
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="relative z-10 ml-[260px] min-h-screen w-[calc(100%-260px)] min-w-0 px-[30px] py-[25px] transition-all duration-300 max-[1100px]:px-6 max-[768px]:ml-0 max-[768px]:w-full max-[768px]:px-[18px] max-[768px]:py-[18px] max-[480px]:px-[14px] max-[480px]:py-[14px]">
                <Navbar
                    onMenuToggle={() => setSidebarOpen(true)}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    pageTitle={pageTitle}
                    welcomeText="Welcome back, Admin!"
                    showPageInfo={false}
                    searchPlaceholder="Search settings..."
                />

                <div className="mt-6 min-w-0 space-y-6">
                    <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A9E5D2]">
                                Administration
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                {pageTitle}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                                {description}
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5">
                            <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />
                            <span className="text-xs font-medium text-[#A9E5D2]">
                                Admin Workspace
                            </span>
                        </div>
                    </section>

                    {children}
                </div>
            </main>
        </div>
    );
}
