import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import StatsGrid from "../components/dashboard/statsGrid";
import RecentUsers from "../components/dashboard/recentUsers";
import SectionList from "../components/dashboard/sectionList";
import RecentActivities from "../components/dashboard/recentActivities";
import {
    stats as staticStats,
} from "../assets/data/dashboardData";

export default function Dashboard() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [searchValue, setSearchValue] = useState("");
  
  const {
    stats: dashboardStats = {},
    recentUsers = [],
    sectionEnrollment = [],
    recentActivities = [],
} = usePage().props;
const activities = recentActivities;
console.log("DASHBOARD SECTIONS:", sectionEnrollment);




const users = useMemo(() => {
    return recentUsers.map((user) => ({
        ...user,
        initials: user.name
            ? user.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()
            : "?",
    }));
}, [recentUsers]);

  console.log("DASHBOARD DATA FROM LARAVEL:", dashboardStats);



const stats = useMemo(() => {
    const databaseValues = {
        "Total Users": dashboardStats.totalUsers ?? 0,
        "Faculty": dashboardStats.totalFaculty ?? 0,
        "Students": dashboardStats.totalStudents ?? 0,
        "Sections": dashboardStats.totalSections ?? 0,
    };

    return staticStats.map((stat) => ({
        ...stat,
        value: databaseValues[stat.label] ?? stat.value,
    }));
}, [
    dashboardStats.totalUsers,
    dashboardStats.totalFaculty,
    dashboardStats.totalStudents,
    dashboardStats.totalSections,
]);


const sections = useMemo(() => {
    return sectionEnrollment.map((section) => ({
        id: section.id,
        name: section.section_name,
        program: section.course,
        year: section.year_level,
        adviser: section.faculty?.name ?? "Unassigned",
        students: Number(section.students_count ?? 0),
        status: section.status,
    }));
}, [sectionEnrollment]);




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
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase()
            .includes(query)
    );
}, [searchValue, sections]);


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
          ml-62.5
          min-h-screen
          w-[calc(100%-250px)]
          min-w-0
          px-7.5
          py-6.25
          transition-all
          duration-300

          max-[1100px]:px-6

          max-[768px]:ml-0
          max-[768px]:w-full
          max-[768px]:px-4.5
          max-[768px]:py-4.5

          max-[480px]:px-3.5
          max-[480px]:py-3.5
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

          <div className="min-w-0">
            <StatsGrid stats={stats} />
          </div>

          <div className="min-w-0">
            <RecentUsers users={filteredUsers} />
          </div>

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