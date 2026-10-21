import { useState } from "react";

import StudentSidebar from "./studentSidebar";
import Navbar from "./navbar";
import MobileOverlay from "./mobileOverlay";

export default function StudentLayout({
  activeMenu = "Dashboard",
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f6f8]">
      <StudentSidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        open={sidebarOpen}
      />

      <MobileOverlay
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className="
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
          pageTitle={title ?? "Student Dashboard"}
          welcomeText={subtitle ?? "Welcome back!"}
          profileName="Student"
          profileRole="Student"
          avatarText="ST"
          searchPlaceholder={`Search ${(title ?? "Dashboard").toLowerCase()}...`}
          showPageInfo={showPageInfo}
          showSearch={showSearch}
        />

        <div className="mt-5 min-w-0 space-y-5">
          {children}
        </div>
      </main>
    </div>
  );
}