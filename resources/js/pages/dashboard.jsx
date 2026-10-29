import { useMemo, useState } from "react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import StatsGrid from "../components/dashboard/statsGrid";
import RecentUsers from "../components/dashboard/recentUsers";
import SectionList from "../components/dashboard/sectionList";
import RecentActivities from "../components/dashboard/recentActivities";

import {
    activities,
    sections,
    stats,
    users,
} from "../assets/data/dashboardData";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [searchValue, setSearchValue] = useState("");

    const filteredUsers = useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        if (!query) return users;

        return users.filter((user) =>
            [
                user.id,
                user.name,
                user.username,
                user.role,
                user.section,
                user.status,
                user.dateAdded,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [searchValue]);

    const filteredSections = useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        if (!query) return sections;

        return sections.filter((section) =>
            [
                section.name,
                section.program,
                section.year,
                section.adviser,
                section.students,
                section.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [searchValue]);

    const handleMenuChange = (menu) => {
        setActiveMenu(menu);

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
                    pageTitle="Dashboard"
                    welcomeText="Welcome back, Admin!"
                    showPageInfo={false}
                    searchPlaceholder="Search users, sections..."
                />

                <div className="mt-6 min-w-0 space-y-6">
                    {/* Dashboard introduction */}
                    <section className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                        <div className="min-w-0">
                             <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9E5D2]">
                            Administration
                        </span>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Dashboard Overview
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                                Monitor users, academic sections, and recent
                                system activities in one place.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <span className="h-2 w-2 rounded-full bg-[#A9E5D2] shadow-[0_0_10px_rgba(169,229,210,0.45)]" />

                            <span className="text-xs font-medium text-[#A9E5D2]">
                                Admin Workspace
                            </span>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <section className="min-w-0">
                        <StatsGrid stats={stats} />
                    </section>

                    {/* Recent users */}
                    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] sm:p-6">
                        <RecentUsers users={filteredUsers} />
                    </section>

                    {/* Sections and activities */}
                    <section className="grid min-w-0 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 max-[1100px]:grid-cols-1">
                        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] sm:p-6">
                            <SectionList sections={filteredSections} />
                        </div>

                        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] sm:p-6">
                            <RecentActivities activities={activities} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
