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
  GraduationCap,
  Layers,
} from "lucide-react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import { students as initialStudents } from "../assets/data/studentData";

export default function StudentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Students");

  const [students, setStudents] = useState(initialStudents);
  const [searchValue, setSearchValue] = useState("");

  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [yearFilter, setYearFilter] = useState("All Year Levels");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [modalType, setModalType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [deleteStudent, setDeleteStudent] = useState(null);
  const [resetStudent, setResetStudent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    section: "",
    course: "BS Accounting Information System",
    yearLevel: "",
    contactNumber: "",
    address: "",
  });

  /* ========================================================= */
  /* FILTER OPTIONS */
  /* ========================================================= */

  const sections = useMemo(
    () => [...new Set(students.map((student) => student.section))],
    [students]
  );

  const yearLevels = useMemo(
    () => [...new Set(students.map((student) => student.yearLevel))],
    [students]
  );

  /* ========================================================= */
  /* FILTERED STUDENTS */
  /* ========================================================= */

  const filteredStudents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.id,
          student.name,
          student.email,
          student.section,
          student.course,
          student.yearLevel,
          student.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesSection =
        sectionFilter === "All Sections" ||
        student.section === sectionFilter;

      const matchesYear =
        yearFilter === "All Year Levels" ||
        student.yearLevel === yearFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        student.status === statusFilter;

      return matchesSearch && matchesSection && matchesYear && matchesStatus;
    });
  }, [
    students,
    searchValue,
    sectionFilter,
    yearFilter,
    statusFilter,
  ]);

  /* ========================================================= */
  /* PAGINATION */
  /* ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * studentsPerPage;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  /* ========================================================= */
  /* HELPERS */
  /* ========================================================= */

  const resetFilters = () => {
    setSearchValue("");
    setSectionFilter("All Sections");
    setYearFilter("All Year Levels");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  /* ========================================================= */
  /* MODALS */
  /* ========================================================= */

  const openAddModal = () => {
    setFormData({
      id: `STD-${String(students.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      section: "",
      course: "BS Accounting Information System",
      yearLevel: "",
      contactNumber: "",
      address: "",
    });

    setSelectedStudent(null);
    setModalType("add");
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);

    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      section: student.section,
      course: student.course,
      yearLevel: student.yearLevel,
      contactNumber: student.contactNumber,
      address: student.address,
    });

    setModalType("edit");
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setModalType("view");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedStudent(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ========================================================= */
  /* ADD & EDIT STUDENT */
  /* ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modalType === "add") {
      const newStudent = {
        ...formData,
        status: "Active",
        dateAdded: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };

      setStudents((previous) => [newStudent, ...previous]);
      setCurrentPage(1);
    }

    if (modalType === "edit") {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                ...formData,
              }
            : student
        )
      );

      setSelectedStudent((current) =>
        current
          ? {
              ...current,
              ...formData,
            }
          : current
      );
    }

    closeModal();
  };

  /* ========================================================= */
  /* ACCOUNT STATUS */
  /* ========================================================= */

  const toggleAccountStatus = (student) => {
    const newStatus =
      student.status === "Active" ? "Inactive" : "Active";

    setStudents((previous) =>
      previous.map((item) =>
        item.id === student.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setSelectedStudent((current) =>
      current?.id === student.id
        ? {
            ...current,
            status: newStatus,
          }
        : current
    );
  };

  /* ========================================================= */
  /* DELETE */
  /* ========================================================= */

  const confirmDelete = () => {
    if (!deleteStudent) return;

    setStudents((previous) =>
      previous.filter((student) => student.id !== deleteStudent.id)
    );

    setDeleteStudent(null);

    if (paginatedStudents.length === 1 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  /* ========================================================= */
  /* RESET CREDENTIALS */
  /* ========================================================= */

  const handleResetCredentials = () => {
    setResetStudent(null);
  };

  const hasActiveFilters =
    searchValue ||
    sectionFilter !== "All Sections" ||
    yearFilter !== "All Year Levels" ||
    statusFilter !== "All Status";

  /* ========================================================= */
  /* FORM FIELD STYLE */
  /* ========================================================= */

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
    <div className="min-h-screen bg-[#EEF2F6]">
      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}

      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        open={sidebarOpen}
      />

      <MobileOverlay
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}

      <main
        className="
          ml-[250px]
          min-h-screen
          px-[30px]
          py-[25px]
          transition-all
          duration-300
          max-[768px]:ml-0
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

        <div className="space-y-5">
          {/* ===================================================== */}
          {/* PAGE HEADER */}
          {/* ===================================================== */}

          <div
            className="
              flex
              items-end
              justify-between
              gap-5
              max-[700px]:flex-col
              max-[700px]:items-start
            "
          >
            <div>
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-[#AFC1D4]
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
                  text-[#142A43]
                  max-[480px]:text-xl
                "
              >
                Student Management
              </h1>

              <p className="mt-1 text-sm text-[#65768A]">
                Manage student accounts and student information.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-xl
                bg-[#1B3553]
                px-4
                text-sm
                font-semibold
                text-white
                shadow-[0_4px_12px_rgba(20,42,67,0.18)]
                transition-all
                duration-200
                hover:bg-[#142A43]
                hover:shadow-[0_7px_18px_rgba(20,42,67,0.24)]
                active:scale-[0.98]
                max-[700px]:w-full
                max-[700px]:justify-center
              "
            >
              <Plus size={18} />
              Add Student
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
  {/* TOTAL STUDENTS */}
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

    <div className="absolute bottom-0 right-0 h-1 w-full bg-[#1B3553]/20" />

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
          Total Students
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {students.length}
        </strong>
      </div>
    </div>
  </div>


  {/* ACTIVE */}
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

    <div className="absolute bottom-0 right-0 h-1 w-full bg-[#31805E]/30" />

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
        <UserCheck size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#587363]">
          Active Accounts
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {
            students.filter(
              (student) => student.status === "Active"
            ).length
          }
        </strong>
      </div>
    </div>
  </div>


  {/* INACTIVE */}
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

    <div className="absolute bottom-0 right-0 h-1 w-full bg-[#64748B]/25" />

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
        <UserX size={21} />
      </div>

      <div className="min-w-0">
        <span className="block text-xs font-bold text-[#5E6D7E]">
          Inactive Accounts
        </span>

        <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
          {
            students.filter(
              (student) => student.status === "Inactive"
            ).length
          }
        </strong>
      </div>
    </div>
  </div>
  
            {/* SECTIONS */}
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
    shadow-[0_5px_22px_rgba(27,53,83,0.08)]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_12px_30px_rgba(27,53,83,0.14)]
  "
>
  {/* Statistical decoration */}
  <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
    <span className="h-4 w-1.5 rounded-sm bg-[#AFC2D8]" />
    <span className="h-7 w-1.5 rounded-sm bg-[#7898B8]" />
    <span className="h-5 w-1.5 rounded-sm bg-[#52789D]" />
    <span className="h-9 w-1.5 rounded-sm bg-[#294B70]" />
  </div>

  {/* Bottom accent */}
  <div className="absolute bottom-0 right-0 h-1 w-full bg-[#294B70]/30" />

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
      <Layers size={21} />
    </div>

    <div className="min-w-0">
      <span className="block text-xs font-bold text-[#50677F]">
        Sections
      </span>

      <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
        {[...new Set(students.map((student) => student.section))].length}
      </strong>
    </div>
  </div>
</div>
</div>

          {/* ===================================================== */}
          {/* STUDENT LIST CARD */}
          {/* ===================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#C9D5E2]
              bg-white
              shadow-[0_5px_25px_rgba(27,53,83,0.08)]
            "
          >
            {/* LIST HEADER */}

            <div
              className="
                relative
                flex
                items-center
                justify-between
                gap-4
                overflow-hidden
                border-b
                border-[#D8E1EA]
                bg-gradient-to-r
                from-[#DCE6F0]
                via-[#EDF2F7]
                to-white
                px-5
                py-4
                max-[600px]:items-start
              "
            >
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-[#1B3553]" />

                  <h2 className="text-[15px] font-bold tracking-tight text-[#142A43]">
                    Student List
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#65768A]">
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* FILTERS */}

            <div
              className="
                flex
                flex-wrap
                gap-3
                border-b
                border-[#DCE4EC]
                bg-[#F3F6F9]
                p-5
              "
            >
              {/* SEARCH */}

              <div
                className="
                  flex
                  h-10
                  min-w-[220px]
                  flex-1
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#C8D5E2]
                  bg-white
                  px-3.5
                  text-[#58708A]
                  shadow-sm
                  transition-all
                  duration-200
                  focus-within:border-[#1B3553]/50
                  focus-within:ring-4
                  focus-within:ring-[#1B3553]/10
                "
              >
                <Search size={18} className="shrink-0 text-[#506A84]" />

                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="
                    min-w-0
                    flex-1
                    border-0
                    bg-transparent
                    text-sm
                    font-medium
                    text-[#263A50]
                    outline-none
                    placeholder:text-[#8795A5]
                  "
                />

                {searchValue && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchValue("");
                      setCurrentPage(1);
                    }}
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      text-[#7A8999]
                      transition-colors
                      hover:bg-[#E2EAF2]
                      hover:text-[#1B3553]
                    "
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* SECTION */}

              <select
                value={sectionFilter}
                onChange={(event) => {
                  setSectionFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="
                  h-10
                  min-w-[160px]
                  rounded-xl
                  border
                  border-[#C8D5E2]
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-[#526579]
                  shadow-sm
                  outline-none
                  transition-all
                  focus:border-[#1B3553]/50
                  focus:ring-4
                  focus:ring-[#1B3553]/10
                "
              >
                <option>All Sections</option>

                {sections.map((section) => (
                  <option key={section}>{section}</option>
                ))}
              </select>

              {/* YEAR */}

              <select
                value={yearFilter}
                onChange={(event) => {
                  setYearFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="
                  h-10
                  min-w-[160px]
                  rounded-xl
                  border
                  border-[#C8D5E2]
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-[#526579]
                  shadow-sm
                  outline-none
                  transition-all
                  focus:border-[#1B3553]/50
                  focus:ring-4
                  focus:ring-[#1B3553]/10
                "
              >
                <option>All Year Levels</option>

                {yearLevels.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="
                  h-10
                  min-w-[140px]
                  rounded-xl
                  border
                  border-[#C8D5E2]
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-[#526579]
                  shadow-sm
                  outline-none
                  transition-all
                  focus:border-[#1B3553]/50
                  focus:ring-4
                  focus:ring-[#1B3553]/10
                "
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

            {/* =================================================== */}
            {/* TABLE */}
            {/* =================================================== */}

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Student ID
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Name
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Section
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Year Level
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
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="
                          border-b
                          border-[#E2E8EF]
                          transition-colors
                          duration-150
                          last:border-b-0
                          hover:bg-[#F1F5F9]
                        "
                      >
                        {/* ID */}

                        <td className="px-5 py-4">
                          <span className="text-xs font-bold text-[#1B3553]">
                            {student.id}
                          </span>
                        </td>

                        {/* NAME */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-[#AFC2D6]
                                bg-[#DCE6F0]
                                text-[11px]
                                font-bold
                                text-[#1B3553]
                                shadow-sm
                                transition-transform
                                duration-200
                                hover:scale-105
                              "
                            >
                              {getInitials(student.name)}
                            </div>

                            <div className="flex min-w-0 flex-col">
                              <strong className="whitespace-nowrap text-sm font-semibold text-[#20364E]">
                                {student.name}
                              </strong>

                              <small className="mt-0.5 whitespace-nowrap text-xs text-[#78899B]">
                                {student.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* SECTION */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-[#4D6278]">
                            {student.section}
                          </span>
                        </td>

                        {/* YEAR */}

                        <td className="px-5 py-4 text-sm font-medium text-[#526579]">
                          {student.yearLevel}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              leading-none
                              ${
                                student.status === "Active"
                                  ? "border-[#B9D9C8] bg-[#E4F1EA] text-[#267653]"
                                  : "border-[#CBD3DC] bg-[#E9EDF1] text-[#647181]"
                              }
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  student.status === "Active"
                                    ? "bg-[#31805E]"
                                    : "bg-[#7C8794]"
                                }
                              `}
                            />

                            {student.status}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#68788B]">
                          {student.dateAdded}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              title="View Student"
                              aria-label="View Student"
                              onClick={() => openViewModal(student)}
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#BFCFDF]
                                bg-[#E6EDF4]
                                text-[#1B3553]
                                transition-all
                                duration-200
                                hover:border-[#91A9C0]
                                hover:bg-[#D5E1EC]
                                hover:text-[#142A43]
                                active:scale-95
                              "
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Edit Student"
                              aria-label="Edit Student"
                              onClick={() => openEditModal(student)}
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-blue-200
                                bg-blue-50
                                text-blue-600
                                transition-all
                                duration-200
                                hover:bg-blue-100
                                hover:text-blue-700
                                active:scale-95
                              "
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              title={
                                student.status === "Active"
                                  ? "Deactivate Account"
                                  : "Activate Account"
                              }
                              aria-label={
                                student.status === "Active"
                                  ? "Deactivate Account"
                                  : "Activate Account"
                              }
                              onClick={() =>
                                toggleAccountStatus(student)
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-amber-200
                                bg-amber-50
                                text-amber-600
                                transition-all
                                duration-200
                                hover:bg-amber-100
                                hover:text-amber-700
                                active:scale-95
                              "
                            >
                              {student.status === "Active" ? (
                                <UserX size={17} />
                              ) : (
                                <UserCheck size={17} />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Delete Student"
                              aria-label="Delete Student"
                              onClick={() => setDeleteStudent(student)}
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                text-red-500
                                transition-all
                                duration-200
                                hover:bg-red-100
                                hover:text-red-600
                                active:scale-95
                              "
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div
                            className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              border
                              border-[#BFCFDF]
                              bg-[#E1EAF2]
                              text-[#1B3553]
                            "
                          >
                            <Users size={28} />
                          </div>

                          <strong className="mt-4 text-sm font-semibold text-[#34475B]">
                            No students found
                          </strong>

                          <span className="mt-1 text-xs text-[#8794A3]">
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

            {filteredStudents.length > 0 && (
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
                    startIndex + studentsPerPage,
                    filteredStudents.length
                  )}{" "}
                  of {filteredStudents.length}
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
      {/* VIEW STUDENT MODAL */}
      {/* ========================================================= */}

      {modalType === "view" && selectedStudent && (
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
                    {getInitials(selectedStudent.name)}
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
                      Student Information
                    </span>

                    <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                      {selectedStudent.name}
                    </h2>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">
                        {selectedStudent.id}
                      </span>

                      <span className="text-xs text-[#B8C9DA]">
                        Student Account
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
                  Student account information
                </p>
              </div>

              {/* 2-COLUMN DETAILS — NO EMPTY RIGHT SIDE */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* STUDENT ID */}

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
                    Student ID
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedStudent.id || "—"}
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
                    {selectedStudent.name || "—"}
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
                    {selectedStudent.email || "—"}
                  </strong>
                </div>

                {/* SECTION */}

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
                    Section
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedStudent.section || "—"}
                  </strong>
                </div>

                {/* COURSE */}

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
                    Course
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedStudent.course || "—"}
                  </strong>
                </div>

                {/* YEAR LEVEL */}

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
                    Year Level
                  </span>

                  <strong className="mt-1 block break-words pl-1 text-sm font-semibold text-[#243A52]">
                    {selectedStudent.yearLevel || "—"}
                  </strong>
                </div>

                {/* CONTACT NUMBER */}

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
                    {selectedStudent.contactNumber || "—"}
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
                    {selectedStudent.address || "—"}
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
                    {selectedStudent.dateAdded || "—"}
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
                        selectedStudent.status === "Active"
                          ? "border-[#B9D9C8] text-[#267653]"
                          : "border-[#CBD3DC] text-[#647181]"
                      }
                    `}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedStudent.status === "Active"
                          ? "bg-[#31805E]"
                          : "bg-[#7C8794]"
                      }`}
                    />

                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                flex-wrap
                justify-end
                gap-2
                border-t
                border-[#D3DDE7]
                bg-white
                px-6
                py-4
              "
            >
              <button
                type="button"
                onClick={() => setResetStudent(selectedStudent)}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#C5D3E0]
                  bg-[#EDF2F6]
                  px-3.5
                  text-xs
                  font-semibold
                  text-[#526579]
                  transition-all
                  hover:border-[#9FB4C9]
                  hover:bg-[#DDE7F0]
                  hover:text-[#1B3553]
                "
              >
                <KeyRound size={16} />
                Reset Credentials
              </button>

              <button
                type="button"
                onClick={() => toggleAccountStatus(selectedStudent)}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  px-3.5
                  text-xs
                  font-semibold
                  text-amber-600
                  transition-all
                  hover:bg-amber-100
                  hover:text-amber-700
                "
              >
                {selectedStudent.status === "Active" ? (
                  <>
                    <UserX size={16} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Activate
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => openEditModal(selectedStudent)}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#1B3553]
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_4px_10px_rgba(27,53,83,0.18)]
                  transition-all
                  hover:bg-[#142A43]
                  hover:shadow-md
                "
              >
                <Pencil size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ========================================================= */}

      {(modalType === "add" || modalType === "edit") && (
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
            {/* FORM HEADER */}

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
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/20
                      bg-white/10
                      text-white
                    "
                  >
                    <GraduationCap size={21} />
                  </div>

                  <div>
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-[#C8D8E8]
                      "
                    >
                      User Management
                    </span>

                    <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                      {modalType === "add"
                        ? "Add Student"
                        : "Edit Student"}
                    </h2>

                    <p className="mt-1 text-xs text-[#C2D0DE]">
                      {modalType === "add"
                        ? "Create a new student account."
                        : "Update student information."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeModal}
                  className="
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

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              <div className="bg-[#EEF2F6] px-6 py-6">
                {/* SECTION TITLE */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#C5D4E2]
                    bg-gradient-to-r
                    from-[#DCE6F0]
                    to-[#F2F5F8]
                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#1B3553]
                      text-white
                      shadow-sm
                    "
                  >
                    <GraduationCap size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1B3553]">
                      Student Details
                    </h3>

                    <p className="text-xs text-[#718195]">
                      Enter the student's basic information below.
                    </p>
                  </div>
                </div>

                {/* FORM CARD */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    rounded-2xl
                    border
                    border-[#C5D4E2]
                    bg-white
                    p-5
                    shadow-[0_4px_15px_rgba(27,53,83,0.07)]
                    sm:grid-cols-2
                  "
                >
                  {/* STUDENT ID */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Student ID
                    </label>

                    <input
                      name="id"
                      value={formData.id}
                      onChange={handleFormChange}
                      placeholder="e.g. STD-009"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* FULL NAME */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Full Name
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

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="student@accentra.edu"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* SECTION */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Section
                    </label>

                    <input
                      name="section"
                      value={formData.section}
                      onChange={handleFormChange}
                      placeholder="e.g. BSAIS-1A"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* COURSE */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Course
                    </label>

                    <input
                      name="course"
                      value={formData.course}
                      onChange={handleFormChange}
                      placeholder="BS Accounting Information System"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* YEAR LEVEL */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Year Level
                    </label>

                    <select
                      name="yearLevel"
                      value={formData.yearLevel}
                      onChange={handleFormChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select year level</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>

                  {/* CONTACT */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Contact Number
                    </label>

                    <input
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleFormChange}
                      placeholder="09XXXXXXXXX"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      placeholder="Enter complete address"
                      rows="3"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* FORM FOOTER */}

              <div
                className="
                  flex
                  justify-end
                  gap-2
                  border-t
                  border-[#D3DDE7]
                  bg-white
                  px-6
                  py-4
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    h-10
                    rounded-xl
                    border
                    border-[#C6D3E0]
                    bg-white
                    px-4
                    text-xs
                    font-semibold
                    text-[#526579]
                    transition-all
                    hover:bg-[#E8EDF2]
                    hover:text-[#1B3553]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#1B3553]
                    px-4
                    text-xs
                    font-semibold
                    text-white
                    shadow-[0_4px_10px_rgba(27,53,83,0.18)]
                    transition-all
                    hover:bg-[#142A43]
                    hover:shadow-md
                  "
                >
                  {modalType === "add"
                    ? "Add Student"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ========================================================= */}

      {deleteStudent && (
        <div
          className="
            fixed
            inset-0
            z-[80]
            flex
            items-center
            justify-center
            bg-[#0C1C2D]/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={() => setDeleteStudent(null)}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border
              border-[#C6D3E0]
              bg-white
              shadow-[0_25px_70px_rgba(10,30,50,0.30)]
            "
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-red-100 via-red-50 to-white px-6 py-6">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-200
                  bg-red-100
                  text-red-500
                "
              >
                <Trash2 size={23} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-[#24364B]">
                Delete Student?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#66788C]">
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-[#24364B]">
                  {deleteStudent.name}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#D5DFE8] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteStudent(null)}
                className="
                  h-10
                  rounded-xl
                  border
                  border-[#C6D3E0]
                  bg-white
                  px-4
                  text-xs
                  font-semibold
                  text-[#526579]
                  transition-all
                  hover:bg-[#E8EDF2]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="
                  h-10
                  rounded-xl
                  bg-red-500
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-red-600
                  hover:shadow-md
                "
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RESET CREDENTIALS */}
      {/* ========================================================= */}

      {resetStudent && (
        <div
          className="
            fixed
            inset-0
            z-[80]
            flex
            items-center
            justify-center
            bg-[#0C1C2D]/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={() => setResetStudent(null)}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border
              border-[#B8C9DA]
              bg-white
              shadow-[0_25px_70px_rgba(10,30,50,0.30)]
            "
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#DCE6F0] via-[#EAF0F5] to-white px-6 py-6">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#1B3553]
                  text-white
                  shadow-[0_5px_12px_rgba(27,53,83,0.18)]
                "
              >
                <KeyRound size={23} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-[#24364B]">
                Reset Credentials?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#66788C]">
                Reset the account credentials for{" "}
                <strong className="font-semibold text-[#24364B]">
                  {resetStudent.name}
                </strong>
                ?
              </p>

              <div className="mt-3 rounded-xl border border-[#C5D4E2] bg-[#E8EEF4] px-3.5 py-3">
                <p className="text-xs leading-5 text-[#596B7E]">
                  A new temporary credential can be generated when
                  this feature is connected to the backend.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#D5DFE8] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setResetStudent(null)}
                className="
                  h-10
                  rounded-xl
                  border
                  border-[#C6D3E0]
                  bg-white
                  px-4
                  text-xs
                  font-semibold
                  text-[#526579]
                  transition-all
                  hover:bg-[#E8EDF2]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResetCredentials}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#1B3553]
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_4px_10px_rgba(27,53,83,0.18)]
                  transition-all
                  hover:bg-[#142A43]
                  hover:shadow-md
                "
              >
                <KeyRound size={16} />
                Reset Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
