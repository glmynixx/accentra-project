import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  KeyRound,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  UserRoundCheck,
  UserRoundX,
  GraduationCap,
} from "lucide-react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import { faculty as initialFaculty } from "../assets/data/facultyData";

export default function FacultyManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Faculty");
  const [faculty, setFaculty] = useState(initialFaculty);

  const [searchValue, setSearchValue] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalType, setModalType] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [deleteFaculty, setDeleteFaculty] = useState(null);
  const [resetFaculty, setResetFaculty] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const facultyPerPage = 5;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    specialization: "",
    contactNumber: "",
    address: "",
    assignedSections: [],
    status: "Active",
    dateAdded: "",
  });

  /* =======================================================
     INITIALS
  ======================================================= */

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =======================================================
     SECTIONS
  ======================================================= */

  const sections = useMemo(() => {
    const allSections = faculty.flatMap(
      (member) => member.assignedSections || []
    );

    return ["All", ...new Set(allSections)];
  }, [faculty]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredFaculty = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return faculty.filter((member) => {
      const matchesSearch =
        !query ||
        [
          member.id,
          member.name,
          member.email,
          member.specialization,
          member.contactNumber,
          member.address,
          (member.assignedSections || []).join(" "),
          member.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesSection =
        sectionFilter === "All" ||
        (member.assignedSections || []).includes(sectionFilter);

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [faculty, searchValue, sectionFilter, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFaculty.length / facultyPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    (safeCurrentPage - 1) * facultyPerPage;

  const paginatedFaculty = filteredFaculty.slice(
    startIndex,
    startIndex + facultyPerPage
  );

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalFaculty = faculty.length;

  const activeFaculty = faculty.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveFaculty = faculty.filter(
    (member) => member.status === "Inactive"
  ).length;

  const assignedFaculty = faculty.filter(
    (member) =>
      (member.assignedSections || []).length > 0
  ).length;

  /* =======================================================
     MENU
  ======================================================= */

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  /* =======================================================
     MODALS
  ======================================================= */

  const openAddModal = () => {
    setFormData({
      id: `FAC-${String(faculty.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      specialization: "",
      contactNumber: "",
      address: "",
      assignedSections: [],
      status: "Active",
      dateAdded: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    setModalType("add");
  };

  const openEditModal = (member) => {
    setSelectedFaculty(member);

    setFormData({
      ...member,
      assignedSections: [
        ...(member.assignedSections || []),
      ],
    });

    setModalType("edit");
  };

  const openViewModal = (member) => {
    setSelectedFaculty(member);
    setModalType("view");
  };

  const openAssignModal = (member) => {
    setSelectedFaculty(member);

    setFormData({
      ...member,
      assignedSections: [
        ...(member.assignedSections || []),
      ],
    });

    setModalType("assign");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFaculty(null);
  };

  /* =======================================================
     FORM
  ======================================================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleSection = (section) => {
    setFormData((current) => {
      const exists =
        current.assignedSections.includes(section);

      return {
        ...current,
        assignedSections: exists
          ? current.assignedSections.filter(
              (item) => item !== section
            )
          : [
              ...current.assignedSections,
              section,
            ],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modalType === "add") {
      setFaculty((current) => [
        ...current,
        formData,
      ]);
    }

    if (modalType === "edit") {
      setFaculty((current) =>
        current.map((member) =>
          member.id === formData.id
            ? formData
            : member
        )
      );
    }

    if (modalType === "assign") {
      setFaculty((current) =>
        current.map((member) =>
          member.id === formData.id
            ? {
                ...member,
                assignedSections:
                  formData.assignedSections,
              }
            : member
        )
      );
    }

    closeModal();
  };

  /* =======================================================
     ACCOUNT STATUS
  ======================================================= */

  const toggleAccountStatus = (member) => {
    setFaculty((current) =>
      current.map((item) =>
        item.id === member.id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      )
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const confirmDelete = () => {
    if (!deleteFaculty) return;

    setFaculty((current) =>
      current.filter(
        (member) => member.id !== deleteFaculty.id
      )
    );

    setDeleteFaculty(null);
  };

  /* =======================================================
     RESET CREDENTIALS
  ======================================================= */

  const handleResetCredentials = () => {
    setResetFaculty(null);
  };

  /* =======================================================
     FILTER RESET
  ======================================================= */

  const resetFilters = () => {
    setSearchValue("");
    setSectionFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  /* =======================================================
     SHARED INPUT STYLE
  ======================================================= */

  const inputClass = `
    w-full
    rounded-xl
    border
    border-[#C9D6E4]
    bg-[#F4F7FA]
    px-3.5
    py-2.5
    text-sm
    font-medium
    text-[#263A50]
    outline-none
    transition-all
    placeholder:text-[#8A98A8]
    hover:border-[#9FB3C8]
    hover:bg-white
    focus:border-[#1B3553]
    focus:bg-white
    focus:ring-4
    focus:ring-[#1B3553]/10
  `;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#EEF2F6]">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        open={sidebarOpen}
      />

      <MobileOverlay
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

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
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          showPageInfo={false}
          showSearch={false}
        />

        <div className="mt-6 min-w-0 space-y-5">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              max-[640px]:items-start
              max-[640px]:flex-col
            "
          >
            <div className="min-w-0">
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-[#BFD0E1]
                  bg-[#DCE6F0]
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#1B3553]
                "
              >
                User Management
              </span>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                  text-[#243A52]
                  max-[480px]:text-xl
                "
              >
                Faculty Management
              </h1>

              <p className="mt-1 text-sm text-[#65768A]">
                Manage faculty accounts and information.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-[#1B3553]
                px-4
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#142A43]
                hover:shadow-md
                active:scale-[0.98]
                max-[640px]:w-full
                max-[640px]:justify-center
              "
            >
              <Plus size={18} />
              Add Faculty
            </button>
          </div>

      {/* ===================================================== */}
{/* SUMMARY CARDS */}
{/* ===================================================== */}

<div
  className="
    grid
    grid-cols-1
    gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
>
  {/* TOTAL FACULTY */}
  <div
    className="
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-[#AFC1D4]
      bg-gradient-to-br
      from-[#E2EAF2]
      via-[#EDF2F7]
      to-white
      p-5
      shadow-[0_5px_22px_rgba(27,53,83,0.10)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]
    "
  >
    {/* Statistical decoration */}
    <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
      <span className="h-3 w-1.5 rounded-sm bg-[#AFC1D4]" />
      <span className="h-5 w-1.5 rounded-sm bg-[#8FA9C1]" />
      <span className="h-8 w-1.5 rounded-sm bg-[#6F8CA8]" />
      <span className="h-6 w-1.5 rounded-sm bg-[#AFC1D4]" />
    </div>

    <div className="absolute bottom-0 left-0 h-1 w-full bg-[#1B3553]/20" />

    <div className="relative flex items-center gap-4">
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#1B3553]
          text-white
          shadow-[0_5px_12px_rgba(27,53,83,0.20)]
          transition-transform
          duration-200
          group-hover:scale-105
        "
      >
        <Users size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#50647A]">
          Total Faculty
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {totalFaculty}
        </strong>
      </div>
    </div>
  </div>


  {/* ACTIVE ACCOUNTS */}
  <div
    className="
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-[#B9D5C8]
      bg-gradient-to-br
      from-[#E3F0EA]
      via-[#EFF6F2]
      to-white
      p-5
      shadow-[0_5px_22px_rgba(27,53,83,0.08)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_12px_30px_rgba(27,53,83,0.14)]
    "
  >
    {/* Statistical decoration */}
    <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
      <span className="h-3 w-1.5 rounded-sm bg-[#B9D9C8]" />
      <span className="h-5 w-1.5 rounded-sm bg-[#8FC1A7]" />
      <span className="h-7 w-1.5 rounded-sm bg-[#5E9C7A]" />
      <span className="h-9 w-1.5 rounded-sm bg-[#31795B]" />
    </div>

    <div className="absolute bottom-0 left-0 h-1 w-full bg-[#31805E]/30" />

    <div className="relative flex items-center gap-4">
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#31795B]
          text-white
          shadow-[0_5px_12px_rgba(49,121,91,0.18)]
          transition-transform
          duration-200
          group-hover:scale-105
        "
      >
        <UserRoundCheck size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#587363]">
          Active Accounts
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {activeFaculty}
        </strong>
      </div>
    </div>
  </div>


  {/* INACTIVE ACCOUNTS */}
  <div
    className="
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-[#C8D0D9]
      bg-gradient-to-br
      from-[#E6EAF0]
      via-[#F0F3F6]
      to-white
      p-5
      shadow-[0_5px_22px_rgba(27,53,83,0.08)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_12px_30px_rgba(27,53,83,0.14)]
    "
  >
    {/* Statistical decoration */}
    <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
      <span className="h-8 w-1.5 rounded-sm bg-[#CBD3DC]" />
      <span className="h-5 w-1.5 rounded-sm bg-[#AAB4BF]" />
      <span className="h-6 w-1.5 rounded-sm bg-[#7C8794]" />
      <span className="h-3 w-1.5 rounded-sm bg-[#5E6C7C]" />
    </div>

    <div className="absolute bottom-0 left-0 h-1 w-full bg-[#64748B]/25" />

    <div className="relative flex items-center gap-4">
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#5E6C7C]
          text-white
          shadow-[0_5px_12px_rgba(94,108,124,0.18)]
          transition-transform
          duration-200
          group-hover:scale-105
        "
      >
        <UserRoundX size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#5E6D7E]">
          Inactive Accounts
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {inactiveFaculty}
        </strong>
      </div>
    </div>
  </div>


  {/* ASSIGNED FACULTY */}
  <div
    className="
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-[#AFC2D8]
      bg-gradient-to-br
      from-[#DFE8F2]
      via-[#EAF0F6]
      to-white
      p-5
      shadow-[0_5px_22px_rgba(27,53,83,0.10)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]
    "
  >
    {/* Statistical decoration */}
    <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
      <span className="h-4 w-1.5 rounded-sm bg-[#AFC2D8]" />
      <span className="h-7 w-1.5 rounded-sm bg-[#7898B8]" />
      <span className="h-5 w-1.5 rounded-sm bg-[#52789D]" />
      <span className="h-9 w-1.5 rounded-sm bg-[#294B70]" />
    </div>

    <div className="absolute bottom-0 left-0 h-1 w-full bg-[#294B70]/30" />

    <div className="relative flex items-center gap-4">
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#294B70]
          text-white
          shadow-[0_5px_12px_rgba(41,75,112,0.20)]
          transition-transform
          duration-200
          group-hover:scale-105
        "
      >
        <GraduationCap size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#50677F]">
          Assigned Faculty
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {assignedFaculty}
        </strong>
      </div>
    </div>
  </div>
</div>

         {/* =================================================
    FACULTY LIST
================================================= */}

<section
  className="
    min-w-0
    overflow-hidden
    rounded-2xl
    border
    border-[#C9D5E2]
    bg-white
    shadow-[0_5px_25px_rgba(27,53,83,0.08)]
  "
>
  {/* FACULTY LIST HEADER */}

  <div
    className="
      border-b
      border-[#DCE4EC]
      bg-gradient-to-r
      from-[#DCE6F0]
      to-white
      px-5
      py-4
    "
  >
   <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-[#1B3553]" />

                  <h2 className="text-[15px] font-bold tracking-tight text-[#142A43]">
                    Faculty List
                  </h2>
                </div>

    <p className="mt-0.5 text-xs text-[#7A8999]">
      View and manage faculty accounts.
    </p>
</div>
</div>

  {/* FILTER ROW */}

  <div
    className="
      border-b
      border-[#DCE4EC]
      bg-[#F3F6F9]
      px-5
      py-4
    "
  >
    <div
      className="
        grid
        grid-cols-1
        gap-3
        md:grid-cols-[minmax(0,1fr)_180px_160px_auto]
        md:items-center
      "
    >
      {/* SEARCH */}

      <div
        className="
          flex
          h-10
          min-w-0
          items-center
          gap-2.5
          rounded-xl
          border
          border-[#C9D6E3]
          bg-white
          px-3.5
          text-[#65768A]
          transition-all
          duration-200
          focus-within:border-[#1B3553]/30
          focus-within:ring-4
          focus-within:ring-[#1B3553]/5
        "
      >
        <Search
          size={17}
          className="shrink-0"
        />

        <input
          type="text"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search faculty..."
          className="
            min-w-0
            flex-1
            border-0
            bg-transparent
            text-sm
            text-[#243A52]
            outline-none
            placeholder:text-[#8A99AA]
          "
        />
      </div>

      {/* SECTION FILTER */}

      <select
        value={sectionFilter}
        onChange={(event) => {
          setSectionFilter(event.target.value);
          setCurrentPage(1);
        }}
        className="
          h-10
          w-full
          rounded-xl
          border
          border-[#C9D6E3]
          bg-white
          px-3
          text-sm
          font-medium
          text-[#526579]
          outline-none
          transition-all
          focus:border-[#1B3553]/30
          focus:ring-4
          focus:ring-[#1B3553]/5
        "
      >
        {sections.map((section) => (
          <option
            value={section}
            key={section}
          >
            {section === "All"
              ? "All Sections"
              : section}
          </option>
        ))}
      </select>

      {/* STATUS FILTER */}

      <select
        value={statusFilter}
        onChange={(event) => {
          setStatusFilter(event.target.value);
          setCurrentPage(1);
        }}
        className="
          h-10
          w-full
          rounded-xl
          border
          border-[#C9D6E3]
          bg-white
          px-3
          text-sm
          font-medium
          text-[#526579]
          outline-none
          transition-all
          focus:border-[#1B3553]/30
          focus:ring-4
          focus:ring-[#1B3553]/5
        "
      >
        <option value="All">
          All Status
        </option>

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>
      </select>

    </div>
  </div>

  {/* TABLE */}
  <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Faculty ID
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Name
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Assigned Sections
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Date Added
                    </th>

                    <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Actions
                    </th>
                  </tr>
                </thead>
      <tbody>
        {paginatedFaculty.length > 0 ? (
          paginatedFaculty.map((member) => (
            <tr
              key={member.id}
              className="
                border-b
                border-[#E3E9EF]
                transition-colors
                duration-150
                last:border-b-0
                hover:bg-[#F7F9FB]
              "
            >
              {/* ID */}

              <td className="px-5 py-4">
                          <span className="text-xs font-bold text-[#1B3553]">
                            {member.id}
                          </span>
                        </td>

              {/* NAME */}

              <td className="px-5 py-4 align-middle">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#DCE6F0]
                      text-xs
                      font-bold
                      text-[#1B3553]
                    "
                  >
                    {getInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <div
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-[#243A52]
                      "
                    >
                      {member.name}
                    </div>

                    <div
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-[#7A8999]
                      "
                    >
                      {member.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* ASSIGNED SECTIONS */}

              <td className="px-5 py-4 align-middle">
                {(member.assignedSections || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {member.assignedSections.map((section) => (
                      <span
                        key={section}
                        className="
                          inline-flex
                          items-center
                          rounded-lg
                          border
                          border-[#C4D4E3]
                          bg-[#EAF0F6]
                          px-2
                          py-1
                          text-[11px]
                          font-semibold
                          text-[#294B70]
                        "
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span
                    className="
                      text-xs
                      italic
                      text-[#7A8999]
                    "
                  >
                    Not Assigned
                  </span>
                )}
              </td>

              {/* STATUS */}

              <td className="px-5 py-4 align-middle">
                {member.status === "Active" ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#B9D9C8]
                      bg-[#E1F0E8]
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-[#267653]
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#31805E]
                      "
                    />
                    Active
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#CBD3DC]
                      bg-[#E7EBEF]
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-[#647181]
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#7C8794]
                      "
                    />
                    Inactive
                  </span>
                )}
              </td>

              {/* DATE */}

              <td className="px-5 py-4 align-middle">
                <span className="text-sm text-[#526579]">
                  {member.dateAdded}
                </span>
              </td>

              {/* ACTIONS */}

              <td className="px-5 py-4 align-middle">
                <div
                  className="
                    flex
                    items-center
                    justify-end
                    gap-1.5
                  "
                >
                  <button
                    type="button"
                    title="View"
                    onClick={() => openViewModal(member)}
                    className="
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg border border-[#C9D6E3] bg-white
                      text-[#526579] shadow-sm transition-all
                      duration-200 hover:border-[#9FB4C9]
                      hover:bg-[#E7EDF3] hover:text-[#1B3553]
                      active:scale-95
                    "
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    title="Edit"
                    onClick={() => openEditModal(member)}
                    className="
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg border border-[#BFD2E5] bg-[#EEF4F9]
                      text-[#294B70] transition-all duration-200
                      hover:bg-[#DCE8F2] hover:text-[#1B3553]
                      active:scale-95
                    "
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    title="Assign Sections"
                    onClick={() => openAssignModal(member)}
                    className="
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg border border-[#BFD2E5] bg-[#EEF4F9]
                      text-[#294B70] transition-all duration-200
                      hover:bg-[#DCE8F2] hover:text-[#1B3553]
                      active:scale-95
                    "
                  >
                    <GraduationCap size={15} />
                  </button>

                  <button
                    type="button"
                    title={
                      member.status === "Active"
                        ? "Deactivate"
                        : "Activate"
                    }
                    onClick={() => toggleAccountStatus(member)}
                    className={
                      member.status === "Active"
                        ? `
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-lg border border-[#E6D2A8] bg-[#FFF7E6]
                          text-[#9A6B16] transition-all duration-200
                          hover:bg-[#FCEBC3] hover:text-[#80580F]
                          active:scale-95
                        `
                        : `
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-lg border border-[#B9D9C8] bg-[#E1F0E8]
                          text-[#267653] transition-all duration-200
                          hover:bg-[#D3E9DC] hover:text-[#1D6044]
                          active:scale-95
                        `
                    }
                  >
                    {member.status === "Active" ? (
                      <UserX size={15} />
                    ) : (
                      <UserCheck size={15} />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Reset Credentials"
                    onClick={() => setResetFaculty(member)}
                    className="
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg border border-[#D7C7A8] bg-[#FAF5E9]
                      text-[#8A6A25] transition-all duration-200
                      hover:bg-[#F4EBD6] hover:text-[#70551E]
                      active:scale-95
                    "
                  >
                    <KeyRound size={15} />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    onClick={() => setDeleteFaculty(member)}
                    className="
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg border border-[#E2BFC3] bg-[#FBEEF0]
                      text-[#A94A55] transition-all duration-200
                      hover:bg-[#F7DDE1] hover:text-[#8E3742]
                      active:scale-95
                    "
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="px-5 py-14 text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  className="
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#E7EDF3]
                    text-[#7A8999]
                  "
                >
                  <Users size={25} />
                </div>

                <strong
                  className="
                    text-sm
                    font-semibold
                    text-[#243A52]
                  "
                >
                  No faculty found
                </strong>

                <span
                  className="
                    mt-1
                    text-xs
                    text-[#7A8999]
                  "
                >
                  Try changing your search or filters.
                </span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

   {/* =================================================== */}
            {/* PAGINATION */}
            {/* =================================================== */}

            {filteredFaculty.length > 0 && (
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-t
                  border-[#D8E1EA]
                  bg-[#F3F6F9]
                  px-5
                  py-4
                  max-[600px]:flex-col
                  max-[600px]:items-start
                "
              >
                <span className="text-xs font-medium text-[#718195]">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + facultyPerPage,
                    filteredFaculty.length
                  )}{" "}
                  of {filteredFaculty.length}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#C6D3E0]
                      bg-white
                      text-[#526579]
                      transition-all
                      hover:border-[#9FB3C8]
                      hover:bg-[#E1E9F1]
                      hover:text-[#1B3553]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        flex
                        h-8
                        min-w-8
                        items-center
                        justify-center
                        rounded-lg
                        px-2
                        text-xs
                        font-semibold
                        transition-all
                        duration-200
                        ${
                          safeCurrentPage === page
                            ? "bg-[#1B3553] text-white shadow-[0_3px_8px_rgba(27,53,83,0.20)]"
                            : "border border-[#C6D3E0] bg-white text-[#526579] hover:bg-[#E1E9F1] hover:text-[#1B3553]"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#C6D3E0]
                      bg-white
                      text-[#526579]
                      transition-all
                      hover:border-[#9FB3C8]
                      hover:bg-[#E1E9F1]
                      hover:text-[#1B3553]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

     {/* ========================================================= */}
      {/* VIEW FACULTY MODAL */}
      {/* ========================================================= */}

      {modalType === "view" && selectedFaculty && (
        <div
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-[#0C1C2D]/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={closeModal}
        >
          <div
            className="
              my-auto
              w-full
              max-w-3xl
              overflow-hidden
              rounded-2xl
              border
              border-[#B8C9DA]
              bg-white
              shadow-[0_25px_70px_rgba(10,30,50,0.30)]
            "
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-[#142A43]
                via-[#1B3553]
                to-[#294B70]
                px-6
                py-6
              "
            >
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/25
                      bg-white/15
                      text-base
                      font-bold
                      text-white
                      shadow-lg
                      backdrop-blur-sm
                    "
                  >
                    {getInitials(selectedFaculty.name)}
                  </div>

                  <div className="min-w-0">
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-[#C8D8E8]
                      "
                    >
                      Faculty Information
                    </span>

                    <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                      {selectedFaculty.name}
                    </h2>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">
                        {selectedFaculty.id}
                      </span>

                      <span className="text-xs text-[#B8C9DA]">
                        Faculty Account
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeModal}
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    transition-all
                    hover:bg-white/20
                  "
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* INFORMATION */}

            <div className="bg-[#EEF2F6] px-6 py-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-[#1B3553]">
                  Personal & Academic Details
                </h3>

                <p className="mt-0.5 text-xs text-[#738396]">
                  Faculty account information
                </p>
              </div>

              {/* 2-COLUMN DETAILS — NO EMPTY RIGHT SIDE */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* FACULTY ID */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Faculty ID
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.id || "—"}
                  </strong>
                </div>

                {/* NAME */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Name
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.name || "—"}
                  </strong>
                </div>

                {/* EMAIL */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Email Address
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.email || "—"}
                  </strong>
                </div>

                {/* SPECIALIZATION */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Specialization
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.specialization || "—"}
                  </strong>
                </div>

                {/* Contact Number*/}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Contact Number
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.contactNumber || "—"}
                  </strong>
                </div>

                {/* Assigned Sections */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Assigned Sections
                  </span>

                  <strong
                  className="
                    mt-1.5
                    block
                    break-words
                    text-sm
                    font-semibold
                    text-[#243A52]
                  "
                >
                  {(selectedFaculty.assignedSections || [])
                    .length > 0
                    ? selectedFaculty.assignedSections.join(
                        ", "
                      )
                    : "Not Assigned"}
                </strong>
              </div>
                {/* ADDRESS */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Address
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.address || "—"}
                  </strong>
                </div>

                {/* DATE ADDED */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Date Added
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedFaculty.dateAdded || "—"}
                  </strong>
                </div>

                {/* ACCOUNT STATUS */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-3.5
                    shadow-[0_2px_8px_rgba(27,53,83,0.05)]
                    transition-all
                    hover:border-[#9FB4C9]
                    hover:shadow-[0_5px_15px_rgba(27,53,83,0.09)]
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#BFCFDF] transition-colors group-hover:bg-[#1B3553]" />

                  <span className="block pl-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                    Account Status
                  </span>

                  <span
                    className={`
                      mt-1.5
                      ml-1
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      bg-white
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      ${
                        selectedFaculty.status === "Active"
                          ? "border-[#B9D9C8] text-[#267653]"
                          : "border-[#CBD3DC] text-[#647181]"
                      }
                    `}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedFaculty.status === "Active"
                          ? "bg-[#31805E]"
                          : "bg-[#7C8794]"
                      }`}
                    />

                    {selectedFaculty.status}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-[#DCE4EC]
                bg-white
                px-5
                py-4
                max-[480px]:flex-col
                max-[480px]:items-stretch
              "
            >
              <button
                type="button"
                onClick={() =>
                  openEditModal(selectedFaculty)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#BFD2E5]
                  bg-[#EEF4F9]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#294B70]
                  transition-all
                  hover:bg-[#DCE8F2]
                  hover:text-[#1B3553]
                "
              >
                <Pencil size={16} />
                Edit Faculty
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="
                  rounded-xl
                  border
                  border-[#C9D6E3]
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#526579]
                  shadow-sm
                  transition-all
                  hover:bg-[#E7EDF3]
                  hover:text-[#243A52]
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT FACULTY MODAL
      ===================================================== */}

      {(modalType === "add" ||
        modalType === "edit") && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#142A43]/40
            px-4
            py-6
            backdrop-blur-sm
          "
          onClick={closeModal}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-2xl
              border
              border-[#C9D5E2]
              bg-white
              shadow-[0_20px_60px_rgba(27,53,83,0.20)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-gradient-to-r
                from-[#1B3553]
                via-[#294B70]
                to-[#365C7E]
                px-5
                py-5
              "
            >
              <div>
                <span
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white/80
                  "
                >
                  User Management
                </span>

                <h2 className="mt-2 text-lg font-bold text-white">
                  {modalType === "add"
                    ? "Add Faculty"
                    : "Edit Faculty"}
                </h2>

                <p className="mt-0.5 text-xs text-white/65">
                  {modalType === "add"
                    ? "Create a new faculty account."
                    : "Update faculty information."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-white/70
                  transition-colors
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  px-5
                  py-5
                  sm:grid-cols-2
                "
              >
                {/* FACULTY ID */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Faculty ID
                  </label>

                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleFormChange}
                    disabled
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#C9D6E4]
                      bg-[#E7EDF3]
                      px-3.5
                      py-2.5
                      text-sm
                      font-medium
                      text-[#65768A]
                      outline-none
                    "
                  />
                </div>

                {/* NAME */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Name
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    required
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="faculty@accentra.edu"
                    required
                    className={inputClass}
                  />
                </div>

                {/* SPECIALIZATION */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Specialization
                  </label>

                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleFormChange}
                    placeholder="e.g. Financial Accounting"
                    required
                    className={inputClass}
                  />
                </div>

                {/* CONTACT */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Contact Number
                  </label>

                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleFormChange}
                    placeholder="Enter contact number"
                    className={inputClass}
                  />
                </div>

                {/* ADDRESS */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Address
                  </label>

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Enter address"
                    className={inputClass}
                  />
                </div>

                {/* STATUS */}

                <div className="sm:col-span-2">
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-[#526579]
                    "
                  >
                    Account Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={inputClass}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {/* FOOTER */}

              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  border-t
                  border-[#DCE4EC]
                  bg-[#F5F7FA]
                  px-5
                  py-4
                  max-[480px]:flex-col
                  max-[480px]:items-stretch
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#526579]
                    shadow-sm
                    transition-all
                    hover:bg-[#E7EDF3]
                    hover:text-[#243A52]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    rounded-xl
                    bg-[#1B3553]
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-[#142A43]
                    hover:shadow-md
                    active:scale-[0.98]
                  "
                >
                  {modalType === "add"
                    ? "Add Faculty"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ASSIGN SECTIONS MODAL
      ===================================================== */}

      {modalType === "assign" &&
        selectedFaculty && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-[#142A43]/40
              px-4
              py-6
              backdrop-blur-sm
            "
            onClick={closeModal}
          >
            <div
              className="
                max-h-[90vh]
                w-full
                max-w-lg
                overflow-y-auto
                rounded-2xl
                border
                border-[#C9D5E2]
                bg-white
                shadow-[0_20px_60px_rgba(27,53,83,0.20)]
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  bg-gradient-to-r
                  from-[#1B3553]
                  via-[#294B70]
                  to-[#365C7E]
                  px-5
                  py-5
                "
              >
                <div>
                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-white/80
                    "
                  >
                    Faculty Assignment
                  </span>

                  <h2 className="mt-2 text-lg font-bold text-white">
                    Assign Faculty Sections
                  </h2>

                  <p className="mt-0.5 text-xs text-white/65">
                    Select the sections assigned to
                    this faculty member.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-white/70
                    transition-colors
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* FACULTY INFO */}

              <div
                className="
                  mx-5
                  mt-5
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[#C9D6E4]
                  bg-[#F4F7FA]
                  p-4
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#DCE6F0]
                    text-xs
                    font-bold
                    text-[#1B3553]
                  "
                >
                  {getInitials(
                    selectedFaculty.name
                  )}
                </div>

                <div className="min-w-0">
                  <strong
                    className="
                      block
                      truncate
                      text-sm
                      font-semibold
                      text-[#243A52]
                    "
                  >
                    {selectedFaculty.name}
                  </strong>

                  <span
                    className="
                      mt-0.5
                      block
                      text-xs
                      text-[#7A8999]
                    "
                  >
                    {selectedFaculty.id}
                  </span>
                </div>
              </div>

              {/* SECTIONS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  px-5
                  py-5
                  max-[480px]:grid-cols-1
                "
              >
                {[
                  "BSAIS-1A",
                  "BSAIS-1B",
                  "BSAIS-2A",
                  "BSAIS-2B",
                  "BSAIS-3A",
                  "BSAIS-3B",
                ].map((section) => (
                  <label
                    key={section}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#C9D6E4]
                      bg-white
                      px-3.5
                      py-3
                      text-sm
                      font-medium
                      text-[#526579]
                      transition-all
                      hover:border-[#9FB3C8]
                      hover:bg-[#E7EDF3]
                    "
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedSections.includes(
                        section
                      )}
                      onChange={() =>
                        toggleSection(section)
                      }
                      className="
                        h-4
                        w-4
                        accent-[#1B3553]
                      "
                    />

                    <span>{section}</span>
                  </label>
                ))}
              </div>

              {/* FOOTER */}

              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  border-t
                  border-[#DCE4EC]
                  bg-[#F5F7FA]
                  px-5
                  py-4
                  max-[480px]:flex-col
                  max-[480px]:items-stretch
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    rounded-xl
                    border
                    border-[#C9D6E3]
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#526579]
                    shadow-sm
                    transition-all
                    hover:bg-[#E7EDF3]
                    hover:text-[#243A52]
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="
                    rounded-xl
                    bg-[#1B3553]
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-[#142A43]
                    hover:shadow-md
                    active:scale-[0.98]
                  "
                >
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteFaculty && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#142A43]/40
            px-4
            py-6
            backdrop-blur-sm
          "
          onClick={() => setDeleteFaculty(null)}
        >
          <div
            className="
              w-full
              max-w-sm
              overflow-hidden
              rounded-2xl
              border
              border-[#E2BFC3]
              bg-white
              shadow-[0_20px_60px_rgba(27,53,83,0.20)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="bg-[#FBEEF0] px-5 py-5">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#A94A55]
                  text-white
                  shadow-sm
                "
              >
                <Trash2 size={21} />
              </div>

              <h2
                className="
                  mt-4
                  text-base
                  font-bold
                  text-[#243A52]
                "
              >
                Delete Faculty?
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#526579]
                "
              >
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-[#243A52]">
                  {deleteFaculty.name}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                justify-end
                gap-2
                border-t
                border-[#E2BFC3]
                bg-white
                px-5
                py-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setDeleteFaculty(null)
                }
                className="
                  rounded-xl
                  border
                  border-[#C9D6E3]
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#526579]
                  shadow-sm
                  transition-all
                  hover:bg-[#E7EDF3]
                  hover:text-[#243A52]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="
                  rounded-xl
                  bg-[#A94A55]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-[#8E3742]
                  hover:shadow-md
                "
              >
                Delete Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESET CREDENTIALS MODAL
      ===================================================== */}

      {resetFaculty && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#142A43]/40
            px-4
            py-6
            backdrop-blur-sm
          "
          onClick={() => setResetFaculty(null)}
        >
          <div
            className="
              w-full
              max-w-sm
              overflow-hidden
              rounded-2xl
              border
              border-[#D7C7A8]
              bg-white
              shadow-[0_20px_60px_rgba(27,53,83,0.20)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="bg-[#FAF5E9] px-5 py-5">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#8A6A25]
                  text-white
                  shadow-sm
                "
              >
                <KeyRound size={21} />
              </div>

              <h2
                className="
                  mt-4
                  text-base
                  font-bold
                  text-[#243A52]
                "
              >
                Reset Credentials?
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#526579]
                "
              >
                Reset the account credentials for{" "}
                <strong className="font-semibold text-[#243A52]">
                  {resetFaculty.name}
                </strong>
                ?
              </p>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                justify-end
                gap-2
                border-t
                border-[#D7C7A8]
                bg-white
                px-5
                py-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setResetFaculty(null)
                }
                className="
                  rounded-xl
                  border
                  border-[#C9D6E3]
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#526579]
                  shadow-sm
                  transition-all
                  hover:bg-[#E7EDF3]
                  hover:text-[#243A52]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResetCredentials}
                className="
                  rounded-xl
                  bg-[#8A6A25]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-[#70551E]
                  hover:shadow-md
                "
              >
                Reset Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}