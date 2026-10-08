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

  /* FILTER USERS */

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return users;
    }

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
        .includes(query)
    );
  }, [searchValue]);

  /* FILTER SECTIONS */

  const filteredSections = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return sections;
    }

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
        .includes(query)
    );
  }, [searchValue]);

  /* MENU HANDLER */

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f6f8]">
      {/* SIDEBAR */}

      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        open={sidebarOpen}
      />

      {/* MOBILE OVERLAY*/}

      <MobileOverlay
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT*/}

      <main
        className="
          ml-[250px]
          min-h-screen
          w-[calc(100%-250px)]
          min-w-0
          px-[30px]
          py-[25px]
          transition-all
          duration-300

          max-[1100px]:px-[24px]

          max-[768px]:ml-0
          max-[768px]:w-full
          max-[768px]:px-[18px]
          max-[768px]:py-[18px]

          max-[480px]:px-[14px]
          max-[480px]:py-[14px]
        "
      >
        {/* NAVBAR */}

        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        {/* PAGE CONTENT*/}

        <div className="mt-5 min-w-0 space-y-5">
          {/* STATISTICS*/}

          <div className="min-w-0">
            <StatsGrid stats={stats} />
          </div>

          {/*  RECENT USERS */}

          <div className="min-w-0">
            <RecentUsers users={filteredUsers} />
          </div>

          {/* SECTION + ACTIVITIES*/}

          <section
            className="
              grid
              min-w-0
              grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]
              gap-5

              max-[1100px]:grid-cols-1
            "
          >
            <div className="min-w-0">
              <SectionList sections={filteredSections} />
            </div>

            <div className="min-w-0">
              <RecentActivities activities={activities} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}