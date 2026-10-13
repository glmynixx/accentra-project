
import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import { sections as initialSections, sampleStudents } from "../assets/data/sectionData";

export default function SectionManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Sections");
  const [sections, setSections] = useState(initialSections);

  const [searchValue, setSearchValue] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [yearLevelFilter, setYearLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalType, setModalType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [deleteSection, setDeleteSection] = useState(null);

  // Student assignment states
  const [studentAssignments, setStudentAssignments] = useState({});
  const [studentSearch, setStudentSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    program: "",
    yearLevel: "",
    facultyAssigned: "",
    students: 0,
    status: "Active",
  });

  /* =========================
     HELPERS
  ========================= */

  const getInitials = (name = "") => {
    const cleanName = name.trim();

    if (!cleanName || cleanName === "Unassigned") {
      return "—";
    }

    const parts = cleanName.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const getAssignedStudentIds = (sectionId) =>
    studentAssignments[sectionId] || [];

  const getAssignedStudents = (sectionId) => {
    const assignedIds = getAssignedStudentIds(sectionId);

    return sampleStudents.filter((student) =>
      assignedIds.includes(student.id)
    );
  };

  const getTodayDate = () =>
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const updateSectionStudentCount = (sectionId, studentIds) => {
    const updatedDate = getTodayDate();

    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              students: studentIds.length,
              lastUpdated: updatedDate,
            }
          : section
      )
    );

    setSelectedSection((current) =>
      current?.id === sectionId
        ? {
            ...current,
            students: studentIds.length,
            lastUpdated: updatedDate,
          }
        : current
    );
  };

  const handleRemoveStudent = (studentId) => {
    if (!selectedSection) return;

    const sectionId = selectedSection.id;

    const updatedIds = getAssignedStudentIds(sectionId).filter(
      (id) => id !== studentId
    );

    setStudentAssignments((current) => ({
      ...current,
      [sectionId]: updatedIds,
    }));

    updateSectionStudentCount(sectionId, updatedIds);
  };

  const getFilteredAssignedStudents = () => {
    if (!selectedSection) return [];

    const query = studentSearch.trim().toLowerCase();

    return getAssignedStudents(selectedSection.id).filter(
      (student) =>
        !query ||
        `${student.id} ${student.name} ${student.email} ${student.yearLevel} ${student.status}`
          .toLowerCase()
          .includes(query)
    );
  };

  /* =========================
     FILTER OPTIONS
  ========================= */

  const programs = useMemo(() => {
    return [...new Set(sections.map((section) => section.program))];
  }, [sections]);

  const yearLevels = useMemo(() => {
    return [...new Set(sections.map((section) => section.yearLevel))];
  }, [sections]);

  /* =========================
     FILTERED SECTIONS
  ========================= */

  const filteredSections = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return sections.filter((section) => {
      const matchesSearch =
        !query ||
        [
          section.id,
          section.name,
          section.program,
          section.yearLevel,
          section.facultyAssigned,
          section.students,
          section.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesProgram =
        !programFilter || section.program === programFilter;

      const matchesYearLevel =
        !yearLevelFilter || section.yearLevel === yearLevelFilter;

      const matchesStatus =
        !statusFilter || section.status === statusFilter;

      return (
        matchesSearch &&
        matchesProgram &&
        matchesYearLevel &&
        matchesStatus
      );
    });
  }, [
    sections,
    searchValue,
    programFilter,
    yearLevelFilter,
    statusFilter,
  ]);

  /* =========================
     SUMMARY
  ========================= */

  const totalSections = sections.length;

  const activeSections = sections.filter(
    (section) => section.status === "Active"
  ).length;

  const inactiveSections = sections.filter(
    (section) => section.status === "Inactive"
  ).length;

  const totalStudents = sections.reduce(
    (total, section) => total + Number(section.students || 0),
    0
  );

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSections.length / sectionsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * sectionsPerPage;

  const paginatedSections = filteredSections.slice(
    startIndex,
    startIndex + sectionsPerPage
  );

  /* =========================
     MENU
  ========================= */

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  /* =========================
     MODALS
  ========================= */

  const openAddModal = () => {
    setFormData({
      name: "",
      program: "",
      yearLevel: "",
      facultyAssigned: "",
      students: 0,
      status: "Active",
    });

    setSelectedSection(null);
    setModalType("add");
  };

  const openViewModal = (section) => {
    setSelectedSection(section);
    setStudentSearch("");
    setModalType("view");
  };

  const openEditModal = (section) => {
    setSelectedSection(section);

    setFormData({
      name: section.name,
      program: section.program,
      yearLevel: section.yearLevel,
      facultyAssigned: section.facultyAssigned,
      students: section.students,
      status: section.status,
    });

    setModalType("edit");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSection(null);
    setStudentSearch("");
  };

  /* =========================
     FORM
  ========================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modalType === "add") {
      const newSection = {
        id: `SEC-2026-${String(
          Math.max(
            0,
            ...sections.map((section) => {
              const match = section.id.match(/(\d+)$/);
              return match ? Number(match[1]) : 0;
            })
          ) + 1
        ).padStart(3, "0")}`,
        name: formData.name,
        program: formData.program,
        yearLevel: formData.yearLevel,
        facultyAssigned: formData.facultyAssigned || "Unassigned",
        facultyId: null,
        students: Number(formData.students || 0),
        status: formData.status,
        dateCreated: getTodayDate(),
        lastUpdated: getTodayDate(),
      };

      setSections((current) => [newSection, ...current]);
      setCurrentPage(1);
    }

    if (modalType === "edit" && selectedSection) {
      const assignedCount = getAssignedStudentIds(
        selectedSection.id
      ).length;

      setSections((current) =>
        current.map((section) =>
          section.id === selectedSection.id
            ? {
                ...section,
                name: formData.name,
                program: formData.program,
                yearLevel: formData.yearLevel,
                facultyAssigned:
                  formData.facultyAssigned || "Unassigned",
                students:
                  assignedCount > 0
                    ? assignedCount
                    : Number(formData.students || 0),
                status: formData.status,
                lastUpdated: getTodayDate(),
              }
            : section
        )
      );
    }

    closeModal();
  };

  /* =========================
     STATUS
  ========================= */

  const toggleSectionStatus = (section) => {
    const newStatus =
      section.status === "Active" ? "Inactive" : "Active";

    setSections((current) =>
      current.map((item) =>
        item.id === section.id
          ? {
              ...item,
              status: newStatus,
              lastUpdated: getTodayDate(),
            }
          : item
      )
    );

    setSelectedSection((current) =>
      current?.id === section.id
        ? {
            ...current,
            status: newStatus,
            lastUpdated: getTodayDate(),
          }
        : current
    );
  };

  /* =========================
     DELETE
  ========================= */

  const confirmDelete = () => {
    if (!deleteSection) return;

    const deletedId = deleteSection.id;

    setSections((current) =>
      current.filter((section) => section.id !== deletedId)
    );

    setStudentAssignments((current) => {
      const updated = { ...current };
      delete updated[deletedId];
      return updated;
    });

    if (selectedSection?.id === deletedId) {
      closeModal();
    }

    setDeleteSection(null);

    if (
      paginatedSections.length === 1 &&
      safeCurrentPage > 1
    ) {
      setCurrentPage((page) => Math.max(1, page - 1));
    }
  };

  /* =========================
     FILTER RESET
  ========================= */

  const resetFilters = () => {
    setSearchValue("");
    setProgramFilter("");
    setYearLevelFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchValue ||
    programFilter ||
    yearLevelFilter ||
    statusFilter;

  /* =========================
     SHARED INPUT STYLE
  ========================= */

  const inputClass = `
    w-full rounded-xl border border-[#C9D6E4] bg-[#F4F7FA]
    px-3.5 py-2.5 text-sm font-medium text-[#263A50]
    outline-none transition-all placeholder:text-[#8A98A8]
    hover:border-[#9FB3C8] hover:bg-white
    focus:border-[#1B3553] focus:bg-white
    focus:ring-4 focus:ring-[#1B3553]/10
  `;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#EEF2F6]">
      <Sidebar
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
          ml-[250px] min-h-screen px-[30px] py-[25px]
          transition-all duration-300
          max-[768px]:ml-0 max-[768px]:px-[18px] max-[768px]:py-[18px]
          max-[480px]:px-[14px] max-[480px]:py-[14px]
        "
      >
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          showPageInfo={false}
          showSearch={false}
        />

        {/* PAGE HEADER */}
        <div
          className="
            mb-6 flex items-end justify-between gap-5
            max-[700px]:flex-col max-[700px]:items-start
          "
        >
          <div>
            <p
              className="
                inline-flex items-center rounded-full border
                border-[#AFC1D4] bg-[#DCE6F0] px-2.5 py-1
                text-[10px] font-bold uppercase tracking-[0.12em]
                text-[#1B3553]
              "
            >
              User Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#142A43] max-[480px]:text-xl">
              Section Management
            </h1>

            <p className="mt-1 text-sm text-[#65768A]">
              Manage academic sections and faculty assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="
              inline-flex h-10 items-center gap-2 rounded-xl
              bg-[#1B3553] px-4 text-sm font-semibold text-white
              shadow-[0_4px_12px_rgba(20,42,67,0.18)]
              transition-all duration-200 hover:bg-[#142A43]
              hover:shadow-[0_7px_18px_rgba(20,42,67,0.24)]
              active:scale-[0.98]
              max-[700px]:w-full max-[700px]:justify-center
            "
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Section
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL SECTIONS */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#AFC1D4] bg-gradient-to-br from-[#E2EAF2] via-[#EDF2F7] to-white p-5 shadow-[0_5px_22px_rgba(27,53,83,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]">
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
              <span className="h-4 w-1.5 rounded-sm bg-[#AFC1D4]" />
              <span className="h-7 w-1.5 rounded-sm bg-[#8FA9C1]" />
              <span className="h-5 w-1.5 rounded-sm bg-[#6F8CA8]" />
              <span className="h-9 w-1.5 rounded-sm bg-[#1B3553]" />
            </div>
            <div className="absolute bottom-0 right-0 h-1 w-full bg-[#1B3553]/20" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B3553] text-white shadow-[0_5px_12px_rgba(27,53,83,0.20)] transition-transform duration-200 group-hover:scale-105">
                <Layers size={21} />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-[#50647A]">Total Sections</span>
                <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">{totalSections}</strong>
              </div>
            </div>
          </div>

          {/* ACTIVE SECTIONS */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#B9D5C8] bg-gradient-to-br from-[#E3F0EA] via-[#EFF6F2] to-white p-5 shadow-[0_5px_22px_rgba(27,53,83,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.14)]">
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
              <span className="h-3 w-1.5 rounded-sm bg-[#B9D9C8]" />
              <span className="h-5 w-1.5 rounded-sm bg-[#8FC1A7]" />
              <span className="h-7 w-1.5 rounded-sm bg-[#5E9C7A]" />
              <span className="h-9 w-1.5 rounded-sm bg-[#31795B]" />
            </div>
            <div className="absolute bottom-0 right-0 h-1 w-full bg-[#31805E]/30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#31795B] text-white shadow-[0_5px_12px_rgba(49,121,91,0.18)] transition-transform duration-200 group-hover:scale-105">
                <UserCheck size={21} />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-[#587363]">Active Sections</span>
                <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">{activeSections}</strong>
              </div>
            </div>
          </div>

          {/* INACTIVE SECTIONS */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#C8D0D9] bg-gradient-to-br from-[#E6EAF0] via-[#F0F3F6] to-white p-5 shadow-[0_5px_22px_rgba(27,53,83,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.14)]">
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
              <span className="h-8 w-1.5 rounded-sm bg-[#CBD3DC]" />
              <span className="h-5 w-1.5 rounded-sm bg-[#AAB4BF]" />
              <span className="h-6 w-1.5 rounded-sm bg-[#7C8794]" />
              <span className="h-3 w-1.5 rounded-sm bg-[#5E6C7C]" />
            </div>
            <div className="absolute bottom-0 right-0 h-1 w-full bg-[#64748B]/25" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5E6C7C] text-white shadow-[0_5px_12px_rgba(94,108,124,0.18)] transition-transform duration-200 group-hover:scale-105">
                <UserX size={21} />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-[#5E6D7E]">Inactive Sections</span>
                <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">{inactiveSections}</strong>
              </div>
            </div>
          </div>

          {/* TOTAL STUDENTS */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#AFC2D8] bg-gradient-to-br from-[#DFE8F2] via-[#EAF0F6] to-white p-5 shadow-[0_5px_22px_rgba(27,53,83,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]">
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
              <span className="h-4 w-1.5 rounded-sm bg-[#AFC2D8]" />
              <span className="h-7 w-1.5 rounded-sm bg-[#7898B8]" />
              <span className="h-5 w-1.5 rounded-sm bg-[#52789D]" />
              <span className="h-9 w-1.5 rounded-sm bg-[#294B70]" />
            </div>
            <div className="absolute bottom-0 right-0 h-1 w-full bg-[#294B70]/30" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#294B70] text-white shadow-[0_5px_12px_rgba(41,75,112,0.20)] transition-transform duration-200 group-hover:scale-105">
                <Users size={21} />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-[#50677F]">Total Students</span>
                <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">{totalStudents}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION LIST */}
        <section className="overflow-hidden rounded-2xl border border-[#C9D5E2] bg-white shadow-[0_5px_25px_rgba(27,53,83,0.08)]">
          <div className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-[#D8E1EA] bg-gradient-to-r from-[#DCE6F0] via-[#EDF2F7] to-white px-5 py-4 max-[600px]:items-start">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-1 rounded-full bg-[#1B3553]" />
              <div>
                <h3 className="text-[15px] font-bold tracking-tight text-[#142A43]">Section List</h3>
                <p className="mt-1 text-xs text-[#65768A]">
                  {filteredSections.length} {filteredSections.length === 1 ? "section" : "sections"} found
                </p>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 border-b border-[#DCE4EC] bg-[#F3F6F9] p-5">
            <div className="flex h-10 min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border border-[#C8D5E2] bg-white px-3.5 text-[#58708A] shadow-sm transition-all duration-200 focus-within:border-[#1B3553]/50 focus-within:ring-4 focus-within:ring-[#1B3553]/10">
              <Search className="h-[18px] w-[18px] shrink-0 text-[#506A84]" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search sections..."
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#263A50] outline-none placeholder:text-[#8795A5]"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    setCurrentPage(1);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#1B3553] transition-colors hover:bg-[#E2EAF2]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={programFilter}
              onChange={(event) => {
                setProgramFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 min-w-[180px] rounded-xl border border-[#C8D5E2] bg-white px-3 text-sm font-medium text-[#526579] shadow-sm outline-none transition-all focus:border-[#1B3553]/50 focus:ring-4 focus:ring-[#1B3553]/10 max-[700px]:min-w-[160px]"
            >
              <option value="">All Programs</option>
              {programs.map((program) => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            <select
              value={yearLevelFilter}
              onChange={(event) => {
                setYearLevelFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 min-w-[160px] rounded-xl border border-[#C8D5E2] bg-white px-3 text-sm font-medium text-[#526579] shadow-sm outline-none transition-all focus:border-[#1B3553]/50 focus:ring-4 focus:ring-[#1B3553]/10"
            >
              <option value="">All Year Levels</option>
              {yearLevels.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 min-w-[140px] rounded-xl border border-[#C8D5E2] bg-white px-3 text-sm font-medium text-[#526579] shadow-sm outline-none transition-all focus:border-[#1B3553]/50 focus:ring-4 focus:ring-[#1B3553]/10"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                  {["Section Name", "Program", "Year Level", "Faculty Assigned", "No. of Students", "Status", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#40566E] ${heading === "Actions" ? "text-center" : "text-left"}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedSections.length > 0 ? (
                  paginatedSections.map((section) => {
                    const isActive = section.status === "Active";
                    const isUnassigned =
                      !section.facultyAssigned ||
                      section.facultyAssigned === "Unassigned";

                    return (
                      <tr key={section.id} className="border-b border-[#E2E8EF] transition-colors duration-150 last:border-b-0 hover:bg-[#F1F5F9]">
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 min-w-9 items-center justify-center rounded-full border border-[#AFC2D6] bg-[#DCE6F0] text-[11px] font-bold text-[#1B3553] shadow-sm">
                              <Layers className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="whitespace-nowrap text-sm font-semibold text-[#20364E]">{section.name}</p>
                              <p className="mt-0.5 text-xs text-[#78899B]">{section.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          <span className="block truncate text-sm font-semibold text-[#4D6278]" title={section.program}>{section.program}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-[#526579]">{section.yearLevel}</span>
                        </td>

                        <td className="px-5 py-4">
                          {isUnassigned ? (
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 min-w-9 items-center justify-center rounded-full border border-[#CBD3DC] bg-[#E9EDF1] text-[11px] font-semibold text-[#7C8794]">—</div>
                              <div className="min-w-0">
                                <p className="whitespace-nowrap text-sm font-semibold text-[#647181]">Unassigned</p>
                                <p className="mt-0.5 text-xs text-[#9AA5B1]">No faculty assigned</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 min-w-9 items-center justify-center rounded-full border border-[#AFC2D6] bg-[#DCE6F0] text-[11px] font-bold text-[#1B3553] shadow-sm">
                                {getInitials(section.facultyAssigned)}
                              </div>
                              <div className="min-w-0">
                                <p className="whitespace-nowrap text-sm font-semibold text-[#20364E]">{section.facultyAssigned}</p>
                                <p className="mt-0.5 text-xs text-[#78899B]">Assigned Faculty</p>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-semibold text-[#4D6278]">{section.students}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none ${isActive ? "border-[#B9D9C8] bg-[#E4F1EA] text-[#267653]" : "border-[#CBD3DC] bg-[#E9EDF1] text-[#647181]"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#31805E]" : "bg-[#7C8794]"}`} />
                            {section.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" title="View" aria-label={`View ${section.name}`} onClick={() => openViewModal(section)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#BFCFDF] bg-[#E6EDF4] text-[#1B3553] transition-all duration-200 hover:border-[#91A9C0] hover:bg-[#D5E1EC] hover:text-[#142A43] active:scale-95">
                              <Eye className="h-[16px] w-[16px]" />
                            </button>

                            <button type="button" title="Edit" aria-label={`Edit ${section.name}`} onClick={() => openEditModal(section)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 active:scale-95">
                              <Pencil className="h-[16px] w-[16px]" />
                            </button>

                            <button type="button" title={isActive ? "Deactivate" : "Activate"} aria-label={isActive ? `Deactivate ${section.name}` : `Activate ${section.name}`} onClick={() => toggleSectionStatus(section)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 transition-all duration-200 hover:bg-amber-100 hover:text-amber-700 active:scale-95">
                              {isActive ? <UserX className="h-[16px] w-[16px]" /> : <UserCheck className="h-[16px] w-[16px]" />}
                            </button>

                            <button type="button" title="Delete" aria-label={`Delete ${section.name}`} onClick={() => setDeleteSection(section)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 active:scale-95">
                              <Trash2 className="h-[16px] w-[16px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#BFCFDF] bg-[#E1EAF2] text-[#1B3553]">
                          <Layers className="h-7 w-7" />
                        </div>
                        <strong className="mt-4 text-sm font-semibold text-[#243A52]">No sections found</strong>
                        <span className="mt-1 text-xs text-[#738396]">Try adjusting your search or filters.</span>
                        {hasActiveFilters && (
                          <button type="button" onClick={resetFilters} className="mt-3 text-xs font-semibold text-[#1B3553] underline">
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredSections.length > 0 && (
            <div className="flex items-center justify-between gap-4 border-t border-[#D8E1EA] bg-[#F3F6F9] px-5 py-4 max-[600px]:flex-col max-[600px]:items-start">
              <span className="text-xs font-medium text-[#718195]">
                Showing {startIndex + 1}–{Math.min(startIndex + sectionsPerPage, filteredSections.length)} of {filteredSections.length} sections
              </span>

              <div className="flex items-center gap-1.5">
                <button type="button" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C6D3E0] bg-white text-[#1B3553] transition-all duration-200 hover:bg-[#E1E9F1] disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft className="h-[17px] w-[17px]" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button type="button" key={page} onClick={() => setCurrentPage(page)} className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-all duration-200 ${page === safeCurrentPage ? "border-[#1B3553] bg-[#1B3553] text-white shadow-[0_3px_8px_rgba(27,53,83,0.20)]" : "border-[#C6D3E0] bg-white text-[#526579] hover:bg-[#E1E9F1]"}`}>
                    {page}
                  </button>
                ))}

                <button type="button" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C6D3E0] bg-white text-[#1B3553] transition-all duration-200 hover:bg-[#E1E9F1] disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronRight className="h-[17px] w-[17px]" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* VIEW MODAL */}
      {modalType === "view" && selectedSection && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#0C1C2D]/60 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="my-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]" onClick={(event) => event.stopPropagation()}>
            {/* DARK HEADER */}
            <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-[#142A43] via-[#1B3553] to-[#294B70] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-lg">
                  <Layers className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C8D8E8]">Section Information</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{selectedSection.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">{selectedSection.id}</span>
                    <span className="text-xs text-[#B8C9DA]">Academic Section</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close modal" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 active:scale-95">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* INFORMATION BODY */}
            <div className="bg-[#EEF2F6] px-6 py-6">
              <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
                {/* SECTION INFORMATION */}
                <section className="overflow-hidden rounded-xl border border-[#C9D6E3] bg-white shadow-[0_2px_8px_rgba(27,53,83,0.05)]">
                  <div className="border-b border-[#D8E1EA] bg-gradient-to-r from-[#DCE6F0] to-white px-4 py-4">
                    <h3 className="text-sm font-bold text-[#1B3553]">Section Information</h3>
                    <p className="mt-1 text-xs text-[#738396]">View section information and assignment details.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    {[
                      ["Section Name", selectedSection.name],
                      ["Program", selectedSection.program],
                      ["Year Level", selectedSection.yearLevel],
                      ["Faculty Assigned", selectedSection.facultyAssigned || "Unassigned"],
                      ["No. of Students", selectedSection.students],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">{label}</span>
                        <strong className="mt-1 block break-words text-sm font-semibold text-[#243A52]">{value}</strong>
                      </div>
                    ))}

                    <div className="rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">Status</span>
                      <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${selectedSection.status === "Active" ? "border-[#B9D9C8] bg-[#E4F1EA] text-[#267653]" : "border-[#CBD3DC] bg-[#E9EDF1] text-[#647181]"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedSection.status === "Active" ? "bg-[#31805E]" : "bg-[#7C8794]"}`} />
                        {selectedSection.status}
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">Date Created</span>
                      <strong className="mt-1 block break-words text-sm font-semibold text-[#243A52]">{selectedSection.dateCreated || "—"}</strong>
                    </div>

                    <div className="rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">Last Updated</span>
                      <strong className="mt-1 block break-words text-sm font-semibold text-[#243A52]">{selectedSection.lastUpdated || "—"}</strong>
                    </div>
                  </div>
                </section>

                {/* STUDENT MEMBERS */}
                <section className="overflow-hidden rounded-xl border border-[#C9D6E3] bg-white shadow-[0_2px_8px_rgba(27,53,83,0.05)]">
                  <div className="border-b border-[#D8E1EA] bg-gradient-to-r from-[#DCE6F0] to-white px-4 py-4">
                    <h3 className="text-sm font-bold text-[#1B3553]">Student Members</h3>
                    <p className="mt-1 text-xs text-[#738396]">View students assigned to this section.</p>
                  </div>

                  {/* SEARCH ONLY — ADD STUDENT BUTTON REMOVED */}
                  <div className="border-b border-[#DCE4EC] bg-[#F3F6F9] p-4">
                    <div className="flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-[#C8D5E2] bg-white px-3 text-[#58708A] shadow-sm focus-within:border-[#1B3553]/50 focus-within:ring-4 focus-within:ring-[#1B3553]/10">
                      <Search className="h-[18px] w-[18px] shrink-0 text-[#506A84]" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(event) => setStudentSearch(event.target.value)}
                        placeholder="Search students..."
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#263A50] outline-none placeholder:text-[#8795A5]"
                      />
                    </div>
                  </div>

                  {/* STUDENT TABLE */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#40566E]">Student</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#40566E]">Year Level</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#40566E]">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {getFilteredAssignedStudents().length > 0 ? (
                          getFilteredAssignedStudents().map((student) => (
                            <tr key={student.id} className="border-b border-[#E2E8EF] transition-colors last:border-b-0 hover:bg-[#F1F5F9]">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#AFC2D6] bg-[#DCE6F0] text-xs font-bold text-[#1B3553]">
                                    {getInitials(student.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#20364E]">{student.name}</p>
                                    <p className="text-xs text-[#78899B]">{student.id}</p>
                                    <p className="break-all text-xs text-[#78899B]">{student.email}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-3 text-sm text-[#526579]">{student.yearLevel}</td>

                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${student.status === "Active" ? "border-[#B9D9C8] bg-[#E4F1EA] text-[#267653]" : "border-[#CBD3DC] bg-[#E9EDF1] text-[#647181]"}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${student.status === "Active" ? "bg-[#31805E]" : "bg-[#7C8794]"}`} />
                                    {student.status}
                                  </span>
                                  <button
                                    type="button"
                                    title="Remove student from section"
                                    aria-label={`Remove ${student.name} from section`}
                                    onClick={() => handleRemoveStudent(student.id)}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#BFCFDF] bg-[#E1EAF2] text-[#1B3553]">
                                  <Users className="h-6 w-6" />
                                </div>
                                <strong className="mt-3 text-sm font-semibold text-[#243A52]">
                                  {studentSearch.trim() ? "No matching students" : "No students assigned"}
                                </strong>
                                <p className="mt-1 text-xs text-[#738396]">
                                  {studentSearch.trim() ? "Try another search term." : "No student members are assigned to this section."}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-[#DCE4EC] bg-[#F3F6F9] px-4 py-3">
                    <p className="text-xs text-[#738396]">
                      {getAssignedStudents(selectedSection.id).length}{" "}
                      {getAssignedStudents(selectedSection.id).length === 1 ? "student" : "students"} assigned
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-wrap justify-end gap-2 border-t border-[#D3DDE7] bg-white px-6 py-4">
              <button type="button" onClick={closeModal} className="rounded-xl border border-[#C6D2DF] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] transition-all duration-200 hover:bg-[#E7EDF3] hover:text-[#1B3553] active:scale-95">
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sectionToEdit = selectedSection;
                  closeModal();
                  openEditModal(sectionToEdit);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(20,42,67,0.18)] transition-all duration-200 hover:bg-[#142A43] active:scale-95"
              >
                <Pencil className="h-[17px] w-[17px]" />
                Edit Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#0C1C2D]/60 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]" onClick={(event) => event.stopPropagation()}>
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-[#142A43] via-[#1B3553] to-[#294B70] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C8D8E8]">User Management</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{modalType === "add" ? "Add Section" : "Edit Section"}</h2>
                  <p className="mt-1 text-xs text-[#B8C9DA]">{modalType === "add" ? "Create a new academic section." : "Update section information."}</p>
                </div>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close modal" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 active:scale-95">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit}>
              <div className="bg-[#EEF2F6] px-6 py-6">
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#C5D4E2] bg-gradient-to-r from-[#DCE6F0] to-[#F2F5F8] px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B3553] text-white">
                    <Layers className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B3553]">Section Information</h3>
                    <p className="mt-0.5 text-xs text-[#738396]">Enter the academic section details below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#C5D4E2] bg-white p-5 shadow-[0_4px_15px_rgba(27,53,83,0.07)] sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">Section Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. BSAIS-1A" required className={inputClass} />
                  </div>

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">Program</label>
                    <select name="program" value={formData.program} onChange={handleFormChange} required className={inputClass}>
                      <option value="">Select Program</option>
                      <option value="BS Accounting Information System">BS Accounting Information System</option>
                      <option value="BS Entrepreneurship">BS Entrepreneurship</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">Year Level</label>
                    <select name="yearLevel" value={formData.yearLevel} onChange={handleFormChange} required className={inputClass}>
                      <option value="">Select Year Level</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">Faculty Assigned</label>
                    <input type="text" name="facultyAssigned" value={formData.facultyAssigned} onChange={handleFormChange} placeholder="Enter faculty name" className={inputClass} />
                  </div>

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">No. of Students</label>
                    <input type="number" name="students" value={formData.students} onChange={handleFormChange} min="0" required className={inputClass} />
                    <p className="mt-1 text-[10px] text-[#738396]">The count updates automatically when students are assigned.</p>
                  </div>

                  <div className="rounded-xl border border-[#E0E7EE] bg-[#F7F9FB] p-3">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53677D]">Status</label>
                    <select name="status" value={formData.status} onChange={handleFormChange} className={inputClass}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FORM FOOTER */}
              <div className="flex justify-end gap-2 border-t border-[#D3DDE7] bg-white px-6 py-4">
                <button type="button" onClick={closeModal} className="rounded-xl border border-[#C6D2DF] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] transition-all duration-200 hover:bg-[#E7EDF3] hover:text-[#1B3553] active:scale-95">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(20,42,67,0.18)] transition-all duration-200 hover:bg-[#142A43] active:scale-95">
                  {modalType === "add" ? "Add Section" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteSection && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0C1C2D]/60 p-4 backdrop-blur-sm" onClick={() => setDeleteSection(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#C6D3E0] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]" onClick={(event) => event.stopPropagation()}>
            <div className="bg-gradient-to-br from-red-100 via-red-50 to-white px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-100 text-red-500">
                <Trash2 className="h-[22px] w-[22px]" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#24364B]">Delete Section?</h2>
              <p className="mt-2 text-sm leading-6 text-[#66788C]">
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-[#24364B]">{deleteSection.name}</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#D3DDE7] bg-white px-6 py-4">
              <button type="button" onClick={() => setDeleteSection(null)} className="rounded-xl border border-[#C6D2DF] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] transition-all duration-200 hover:bg-[#E7EDF3] hover:text-[#1B3553] active:scale-95">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600 active:scale-95">
                <Trash2 className="h-[17px] w-[17px]" />
                Delete Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}