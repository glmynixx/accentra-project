
import { useState } from "react";

import FacultySidebar from "./facultySidebar";
import Navbar from "./navbar";
import MobileOverlay from "./mobileOverlay";

export default function FacultyLayout({
    activeMenu,
    title,
    subtitle,
    search,
    onSearchChange,
    searchValue,
    showPageInfo = true,
    showSearch = true,
    children,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentSearch = search ?? searchValue ?? "";

    const handleMenuChange = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0B1728] text-slate-100">
            {/* Background effects */}
            <div
                className="pointer-events-none fixed inset-0"
                aria-hidden="true"
            >
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(169,229,210,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(169,229,210,0.12) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />

                <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#36534E]/20 blur-[120px]" />

                <div className="absolute -bottom-48 left-[25%] h-[420px] w-[420px] rounded-full bg-[#1B3553]/35 blur-[120px]" />
            </div>

            {/* Sidebar */}
            <FacultySidebar
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                open={sidebarOpen}
            />

            {/* Mobile sidebar overlay */}
            <MobileOverlay
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <main
                className="
                    relative z-10
                    ml-[260px] min-h-screen w-[calc(100%-260px)]
                    min-w-0 px-[30px] py-[25px]
                    transition-all duration-300
                    max-[1100px]:px-[24px]
                    max-[768px]:ml-0 max-[768px]:w-full
                    max-[768px]:px-[18px] max-[768px]:py-[18px]
                    max-[480px]:px-[14px] max-[480px]:py-[14px]
                "
            >
                <Navbar
                    onMenuToggle={() => setSidebarOpen(true)}
                    searchValue={currentSearch}
                    onSearchChange={onSearchChange}
                    pageTitle={title ?? "Dashboard"}
                    welcomeText={subtitle ?? "Welcome back!"}
                    profileName="Faculty"
                    profileRole="Faculty Member"
                    avatarText="FC"
                    searchPlaceholder={`Search ${(title ?? "Dashboard").toLowerCase()}...`}
                    showPageInfo={false}
                    showSearch={showSearch}
                />

                <div className="mt-5 min-w-0 space-y-5">
                    {children}
                </div>
            </main>
        </div>
    );
}
