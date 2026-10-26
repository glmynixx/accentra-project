
import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/navbar";
import MobileOverlay from "../components/layout/mobileOverlay";

import { students as initialStudents } from "../assets/data/studentData";

const initialSubjects = [
    {
        id: 1,
        code: "ACC101",
        name: "Fundamentals of Accounting",
        description: "Introduction to basic accounting concepts and principles.",
        status: "Active",
    },
    {
        id: 2,
        code: "ACC102",
        name: "Financial Accounting",
        description: "Recording, classifying, and reporting financial transactions.",
        status: "Active",
    },
    {
        id: 3,
        code: "ACC103",
        name: "Management Accounting",
        description: "Accounting information for planning and decision-making.",
        status: "Active",
    },
    {
        id: 4,
        code: "ACC104",
        name: "Cost Accounting",
        description: "Cost measurement, analysis, and control.",
        status: "Active",
    },
    {
        id: 5,
        code: "ACC105",
        name: "Auditing",
        description: "Examination and evaluation of financial records.",
        status: "Active",
    },
    {
        id: 6,
        code: "ACC106",
        name: "Taxation",
        description: "Tax principles, regulations, and computations.",
        status: "Active",
    },
    {
        id: 7,
        code: "AIS101",
        name: "Accounting Information Systems",
        description: "Accounting processes and information systems.",
        status: "Active",
    },
    {
        id: 8,
        code: "AIS102",
        name: "Accounting Information Systems Applications",
        description: "Practical use of systems in accounting operations.",
        status: "Active",
    },
    {
        id: 9,
        code: "BUS101",
        name: "Business Finance",
        description: "Financial planning and business financial management.",
        status: "Active",
    },
    {
        id: 10,
        code: "BUS102",
        name: "Business Law",
        description: "Legal principles relevant to business operations.",
        status: "Active",
    },
];

const labelClass = "mb-2 block text-xs font-semibold text-white/65";

const fieldClass =
  "h-10 w-full rounded-xl border border-white/15 bg-[#0A1B2A] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#A9E5D2]/40 focus:ring-2 focus:ring-[#A9E5D2]/10";

function ModalShell({ children, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center overflow-y-auto bg-[#020912]/75 px-4 py-6 backdrop-blur-md"
      onMouseDown={onClose}
    >
      <div
        className={`my-auto w-full ${
          wide ? "max-w-3xl" : "max-w-lg"
        } overflow-hidden rounded-2xl border border-white/[0.13] bg-[#0E1A2A] shadow-[0_18px_55px_rgba(0,0,0,0.35)]`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function StudentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Students");
  const [availableSubjects, setAvailableSubjects] = useState(initialSubjects);

  const [students, setStudents] = useState(() =>
    initialStudents.map((student) => ({
      ...student,
      subjects: Array.isArray(student.subjects)
        ? student.subjects
        : student.subject
          ? [student.subject]
          : [],
    }))
  );

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
    subjects: [],
    yearLevel: "",
    contactNumber: "",
    address: "",
  });

  /* FILTER OPTIONS */

  const sections = useMemo(
    () => [
      ...new Set(
        students.map((student) => student.section).filter(Boolean)
      ),
    ],
    [students]
  );

  const yearLevels = useMemo(
    () => [
      ...new Set(
        students.map((student) => student.yearLevel).filter(Boolean)
      ),
    ],
    [students]
  );

  const activeSubjects = useMemo(
    () => initialSubjects.filter((subject) => subject.status === "Active"),
    []
  );

  /* FILTERED STUDENTS */

  const filteredStudents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return students.filter((student) => {
      const studentSubjects = Array.isArray(student.subjects)
        ? student.subjects
        : student.subject
          ? [student.subject]
          : [];

      const searchableValues = [
        student.id,
        student.name,
        student.email,
        student.section,
        student.course,
        student.yearLevel,
        student.status,
        ...studentSubjects,
        ...studentSubjects.map((subjectName) => {
          const subject = initialSubjects.find(
            (item) =>
              item.name.toLowerCase() === subjectName.toLowerCase() ||
              item.code.toLowerCase() === subjectName.toLowerCase()
          );

          return subject ? subject.code : "";
        }),
      ];

      const matchesSearch =
        !query ||
        searchableValues
          .filter(Boolean)
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

      return (
        matchesSearch &&
        matchesSection &&
        matchesYear &&
        matchesStatus
      );
    });
  }, [
    students,
    searchValue,
    sectionFilter,
    yearFilter,
    statusFilter,
  ]);

  /* PAGINATION */

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

  /* HELPERS */

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
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getStudentSubjects = (student) => {
    if (Array.isArray(student?.subjects)) {
      return student.subjects;
    }

    return student?.subject ? [student.subject] : [];
  };

  /* MODALS */

  const openAddModal = () => {
    const existingNumbers = students
      .map((student) => {
        const match = String(student.id ?? "").match(/^STD-(\d+)$/);
        return match ? Number(match[1]) : 0;
      });

    const nextNumber = Math.max(0, ...existingNumbers) + 1;

    setFormData({
      id: `STD-${String(nextNumber).padStart(3, "0")}`,
      name: "",
      email: "",
      section: "",
      course: "BS Accounting Information System",
      subjects: [],
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
      id: student.id ?? "",
      name: student.name ?? "",
      email: student.email ?? "",
      section: student.section ?? "",
      course: student.course ?? "BS Accounting Information System",
      subjects: getStudentSubjects(student),
      yearLevel: student.yearLevel ?? "",
      contactNumber: student.contactNumber ?? "",
      address: student.address ?? "",
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

  const toggleSubject = (subjectName) => {
    setFormData((previous) => {
      const currentSubjects = previous.subjects ?? [];
      const isSelected = currentSubjects.includes(subjectName);

      return {
        ...previous,
        subjects: isSelected
          ? currentSubjects.filter((name) => name !== subjectName)
          : [...currentSubjects, subjectName],
      };
    });
  };

  /* ADD & EDIT STUDENT */

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedFormData = {
      ...formData,
      subjects: formData.subjects ?? [],
    };

    if (modalType === "add") {
      const newStudent = {
        ...normalizedFormData,
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

    if (modalType === "edit" && selectedStudent) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                ...normalizedFormData,
              }
            : student
        )
      );
    }

    closeModal();
  };

  /* ACCOUNT STATUS */

  const toggleAccountStatus = (student) => {
    const newStatus =
      student.status === "Active" ? "Inactive" : "Active";

    const updatedStudent = {
      ...student,
      status: newStatus,
    };

    setStudents((previous) =>
      previous.map((item) =>
        item.id === student.id ? updatedStudent : item
      )
    );

    setSelectedStudent((current) =>
      current?.id === student.id ? updatedStudent : current
    );
  };

  /* DELETE */

  const confirmDelete = () => {
    if (!deleteStudent) return;

    setStudents((previous) =>
      previous.filter((student) => student.id !== deleteStudent.id)
    );

    if (selectedStudent?.id === deleteStudent.id) {
      setSelectedStudent(null);
      setModalType(null);
    }

    setDeleteStudent(null);

    if (paginatedStudents.length === 1 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  /* RESET CREDENTIALS */

  const handleResetCredentials = () => {
    setResetStudent(null);
  };

  const hasActiveFilters =
    searchValue ||
    sectionFilter !== "All Sections" ||
    yearFilter !== "All Year Levels" ||
    statusFilter !== "All Status";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#071522] font-sans text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute -left-36 top-16 h-[420px] w-[420px] rounded-full bg-[#477F73]/25 blur-[120px]" />
        <div className="absolute right-[-100px] top-[-60px] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute bottom-[-100px] left-[35%] h-[320px] w-[480px] rounded-full bg-[#477F73]/10 blur-[110px]" />
      </div>

      {/* SIDEBAR */}

      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        open={sidebarOpen}
      />

      <MobileOverlay
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}

      <main className="relative z-10 ml-[260px] min-h-screen w-[calc(100%-260px)] min-w-0 px-[30px] py-[25px] transition-all duration-300 max-[1100px]:px-6 max-[768px]:ml-0 max-[768px]:w-full max-[768px]:px-[18px] max-[768px]:py-[18px] max-[480px]:px-[14px] max-[480px]:py-[14px]">
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          showPageInfo={false}
          showSearch={false}
        />

        <div className="mt-6 min-w-0 space-y-5">
          {/* PAGE HEADER */}

          <div className="flex items-center justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#A9E5D2]/20 bg-[#477F73]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9E5D2]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A9E5D2]" />
                Administration
              </span>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Student Management
              </h1>

              <p className="mt-1 text-sm text-white/55">
                Manage student accounts, academic details, and enrollment information.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#477F73] px-4 text-sm font-semibold text-white transition hover:bg-[#36534E] max-[640px]:w-full max-[640px]:justify-center"
            >
              <Plus size={17} />
              Add Student
            </button>
          </div>

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Students",
                value: students.length,
                icon: Users,
                accent: "navy",
                note: "Student accounts",
              },
              {
                label: "Active Accounts",
                value: students.filter((student) => student.status === "Active").length,
                icon: UserCheck,
                accent: "mint",
                note: "Currently active",
              },
              {
                label: "Inactive Accounts",
                value: students.filter((student) => student.status === "Inactive").length,
                icon: UserX,
                accent: "slate",
                note: "Currently inactive",
              },
              {
                label: "Sections",
                value: sections.length,
                icon: Layers,
                accent: "blue",
                note: "Available sections",
              },
            ].map(({ label, value, icon: Icon, accent, note }) => {
              const tones = {
                navy: "bg-[#294B70]/25 text-[#C4D9F0] border-[#7292B4]/20",
                mint: "bg-[#477F73]/25 text-[#A9E5D2] border-[#A9E5D2]/20",
                slate: "bg-slate-400/10 text-slate-300 border-slate-300/15",
                blue: "bg-sky-400/10 text-sky-200 border-sky-200/15",
              };

              return (
                <div
                  key={label}
                  className="group relative rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] transition duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/[0.025] blur-2xl transition group-hover:bg-white/[0.06]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-white/55">
                        {label}
                      </span>
                      <strong className="mt-2 block text-3xl font-bold tracking-tight text-white">
                        {value}
                      </strong>
                      <span className="mt-1.5 block text-[11px] text-white/35">
                        {note}
                      </span>
                    </div>

                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tones[accent]}`}>
                      <Icon size={21} />
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 h-px w-full ${
                      accent === "mint" ? "bg-[#A9E5D2]/40" : "bg-white/10"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* STUDENT LIST CARD */}

          <section className="overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px]">
            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#A9E5D2]" />
                    <h2 className="text-[15px] font-bold tracking-tight text-white">
                      Student List
                    </h2>
                  </div>
                  <p className="mt-1 pl-3 text-xs text-white/45">
                    View and manage student accounts.
                  </p>
                </div>

                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-white/55">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1 ? "record" : "records"}
                </span>
              </div>
            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap gap-3 border-b border-white/[0.09] p-5">
              <div className="flex h-10 min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border border-white/[0.14] bg-[#071522]/70 px-3.5 text-white/50 transition-all duration-200 focus-within:border-[#36534E]/30 focus-within:bg-[#102337] focus-within:ring-4 focus-within:ring-[#36534E]/5">
                <Search size={18} className="shrink-0" />

                <input
                  type="text"
                  placeholder="Search students or subjects..."
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
                />

                {searchValue && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchValue("");
                      setCurrentPage(1);
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/[0.10] hover:text-white/85"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={sectionFilter}
                onChange={(event) => {
                  setSectionFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 min-w-[160px] rounded-xl border border-white/[0.14] bg-[#0A1B2A] px-3 text-sm text-white/75 outline-none transition-all focus:border-[#A9E5D2]/40 focus:bg-[#102337] focus:ring-4 focus:ring-[#A9E5D2]/10"
              >
                <option>All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>

              <select
                value={yearFilter}
                onChange={(event) => {
                  setYearFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 min-w-[160px] rounded-xl border border-white/[0.14] bg-[#0A1B2A] px-3 text-sm text-white/75 outline-none transition-all focus:border-[#A9E5D2]/40 focus:bg-[#102337] focus:ring-4 focus:ring-[#A9E5D2]/10"
              >
                <option>All Year Levels</option>
                {yearLevels.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 min-w-[140px] rounded-xl border border-white/[0.14] bg-[#0A1B2A] px-3 text-sm text-white/75 outline-none transition-all focus:border-[#A9E5D2]/40 focus:bg-[#102337] focus:ring-4 focus:ring-[#A9E5D2]/10"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* TABLE */}

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.035]">
                    {[
                      "Student ID",
                      "Name",
                      "Section",
                      "Year Level",
                      "Status",
                      "Date Added",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white/40 ${
                          heading === "Actions" ? "text-center" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-white/[0.035]"
                      >
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold text-white/65">
                            {student.id}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 min-w-9 items-center justify-center rounded-full border border-[#A9E5D2]/20 bg-[#477F73]/20 text-[11px] font-bold text-[#A9E5D2] transition-transform duration-200 hover:scale-105">
                              {getInitials(student.name)}
                            </div>

                            <div className="flex min-w-0 flex-col">
                              <strong className="whitespace-nowrap text-sm font-semibold text-white">
                                {student.name}
                              </strong>
                              <small className="mt-0.5 whitespace-nowrap text-xs text-white/50">
                                {student.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-white/75">
                          {student.section}
                        </td>

                        <td className="px-5 py-4 text-sm text-white/75">
                          {student.yearLevel}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none ${
                              student.status === "Active"
                                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
                                : "border-white/[0.14] bg-white/[0.06] text-white/65"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                student.status === "Active"
                                  ? "bg-emerald-400"
                                  : "bg-gray-400"
                              }`}
                            />
                            {student.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-white/65">
                          {student.dateAdded || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              title="View Student"
                              aria-label="View Student"
                              onClick={() => openViewModal(student)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-[#75A99A]/30 hover:bg-[#477F73]/20 hover:text-[#B5D5CB] active:scale-95"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Edit Student"
                              aria-label="Edit Student"
                              onClick={() => openEditModal(student)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/15 bg-sky-400/[0.06] text-sky-300 transition hover:bg-sky-400/15 active:scale-95"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              title={student.status === "Active" ? "Deactivate Account" : "Activate Account"}
                              aria-label={student.status === "Active" ? "Deactivate Account" : "Activate Account"}
                              onClick={() => toggleAccountStatus(student)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/15 bg-amber-400/[0.06] text-amber-300 transition hover:bg-amber-400/15 active:scale-95"
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
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/15 bg-rose-400/[0.06] text-rose-300 transition hover:bg-rose-400/15 active:scale-95"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-white/50">
                            <Users size={28} />
                          </div>
                          <strong className="mt-4 text-sm font-semibold text-white/85">
                            No students found
                          </strong>
                          <span className="mt-1 text-xs text-white/50">
                            Try changing your search or filters.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            {filteredStudents.length > 0 && (
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.09] px-5 py-4 max-[600px]:flex-col max-[600px]:items-start">
                <span className="text-xs text-white/50">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + studentsPerPage, filteredStudents.length)}{" "}
                  of {filteredStudents.length}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.14] bg-[#102337] text-white/65 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      type="button"
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all duration-200 ${
                        safeCurrentPage === page
                          ? "bg-[#477F73] text-white shadow-sm"
                          : "border border-white/[0.14] bg-[#102337] text-white/65 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.14] bg-[#102337] text-white/65 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      
{/* VIEW STUDENT MODAL */}
{modalType === "view" && selectedStudent && (
    <ModalShell onClose={closeModal} wide>
        <div className="flex items-center justify-between border-b border-white/10 bg-[#102337] px-6 py-5">
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#B5D5CB]">
                    <Users size={25} />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9E5D2]">
                        Student Information
                    </p>

                    <h2 className="mt-1 break-words text-xl font-bold text-white">
                        {selectedStudent.name || "Unnamed Student"}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-slate-300">
                            {selectedStudent.id || "No ID"}
                        </span>

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                selectedStudent.status === "Active"
                                    ? "border-[#A9E5D2]/20 bg-[#477F73]/15 text-[#A9E5D2]"
                                    : "border-white/10 bg-white/[0.05] text-white/60"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    selectedStudent.status === "Active"
                                        ? "bg-[#A9E5D2]"
                                        : "bg-white/40"
                                }`}
                            />
                            {selectedStudent.status || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
                <X size={19} />
            </button>
        </div>

        <div className="bg-[#0E1A2A] p-5">
            <section className="overflow-hidden rounded-xl border border-white/10 bg-[#071522]/70">
                <div className="border-b border-white/[0.07] px-4 py-4">
                    <h3 className="text-sm font-bold text-white">
                        Student Details
                    </h3>
                    <p className="mt-1 text-xs text-white/35">
                        Personal and academic information.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    {[
                        ["Student ID", selectedStudent.id || "—"],
                        ["Full Name", selectedStudent.name || "—"],
                        ["Email Address", selectedStudent.email || "—"],
                        ["Course", selectedStudent.course || "—"],
                        ["Section", selectedStudent.section || "—"],
                        ["Year Level", selectedStudent.yearLevel || "—"],
                        ["Contact Number", selectedStudent.contactNumber || "—"],
                        ["Account Status", selectedStudent.status || "Unknown"],
                        ["Date Added", selectedStudent.dateAdded || "—"],
                        ["Address", selectedStudent.address || "—"],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3"
                        >
                            <span className={labelClass}>{label}</span>
                            <strong className="mt-1 block break-words text-sm font-semibold text-slate-100">
                                {value}
                            </strong>
                        </div>
                    ))}

                    {/* ASSIGNED SUBJECTS */}
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3 sm:col-span-2">
                        <span className={labelClass}>
                            Assigned Subjects
                        </span>

                        {getStudentSubjects(selectedStudent).length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {getStudentSubjects(selectedStudent).map(
                                    (subjectName) => {
                                        const subject = initialSubjects.find(
                                            (item) =>
                                                item.name === subjectName
                                        );

                                        return (
                                            <span
                                                key={subjectName}
                                                className="inline-flex items-center gap-2 rounded-lg border border-[#A9E5D2]/15 bg-[#477F73]/10 px-3 py-2 text-xs font-medium text-[#B5D5CB]"
                                            >
                                                {subject && (
                                                    <span className="font-bold text-[#A9E5D2]">
                                                        {subject.code}
                                                    </span>
                                                )}
                                                {subjectName}
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-white/45">
                                No subjects assigned.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 bg-[#071522]/70 px-6 py-4 max-[480px]:flex-col">
            <button
                type="button"
                onClick={() => openEditModal(selectedStudent)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
                <Pencil size={17} />
                Edit Student
            </button>

            <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#A9E5D2]/20 bg-[#477F73] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#568F81]"
            >
                Close
            </button>
        </div>
    </ModalShell>
)}


      
{/* ADD / EDIT FACULTY MODAL */}
{(modalType === "add" || modalType === "edit") && (
    <ModalShell onClose={closeModal} wide>
        <div>
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#102337] px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#B5D5CB]">
                        <Users size={23} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9E5D2]">
                            User Management
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-white">
                            {modalType === "add"
                                ? "Add Faculty"
                                : "Edit Faculty"}
                        </h2>

                        <p className="mt-1 text-xs text-white/55">
                            {modalType === "add"
                                ? "Create a new faculty account."
                                : "Update faculty information."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                    <X size={19} />
                </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit}>
                <div className="max-h-[70vh] overflow-y-auto bg-[#0E1A2A] px-6 py-6">
                    {/* FACULTY INFORMATION HEADER */}
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#75A99A]/15 bg-[#477F73]/10 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#477F73] text-white">
                            <Users size={18} />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-white">
                                Faculty Information
                            </h3>

                            <p className="mt-0.5 text-xs text-white/35">
                                Enter the faculty account details below.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[#071522]/70 p-5 shadow-xl sm:grid-cols-2">
                        {/* FACULTY ID */}
                        <div>
                            <label
                                htmlFor="faculty-id"
                                className={labelClass}
                            >
                                Faculty ID
                            </label>

                            <input
                                id="faculty-id"
                                name="id"
                                value={formData.id}
                                onChange={handleFormChange}
                                placeholder="e.g. FAC-009"
                                required
                                className={fieldClass}
                            />
                        </div>

                        {/* FULL NAME */}
                        <div>
                            <label
                                htmlFor="faculty-name"
                                className={labelClass}
                            >
                                Full Name
                            </label>

                            <input
                                id="faculty-name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Enter full name"
                                required
                                className={fieldClass}
                            />
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div>
                            <label
                                htmlFor="faculty-email"
                                className={labelClass}
                            >
                                Email Address
                            </label>

                            <input
                                id="faculty-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="faculty@accentra.edu"
                                required
                                className={fieldClass}
                            />
                        </div>

                        {/* CONTACT NUMBER */}
                        <div>
                            <label
                                htmlFor="faculty-contact"
                                className={labelClass}
                            >
                                Contact Number
                            </label>

                            <input
                                id="faculty-contact"
                                name="contactNumber"
                                value={formData.contactNumber || ""}
                                onChange={handleFormChange}
                                placeholder="09XXXXXXXXX"
                                required
                                className={fieldClass}
                            />
                        </div>

                        {/* SPECIALIZATION */}
                        <div>
                            <label
                                htmlFor="faculty-specialization"
                                className={labelClass}
                            >
                                Specialization
                            </label>

                            <input
                                id="faculty-specialization"
                                name="specialization"
                                value={formData.specialization || ""}
                                onChange={handleFormChange}
                                placeholder="Enter specialization"
                                className={fieldClass}
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <label
                                htmlFor="faculty-status"
                                className={labelClass}
                            >
                                Status
                            </label>

                            <select
                                id="faculty-status"
                                name="status"
                                value={formData.status || "Active"}
                                onChange={handleFormChange}
                                required
                                className={fieldClass}
                            >
                                <option
                                    value="Active"
                                    className="bg-[#0A1B2A]"
                                >
                                    Active
                                </option>

                                <option
                                    value="Inactive"
                                    className="bg-[#0A1B2A]"
                                >
                                    Inactive
                                </option>
                            </select>
                        </div>

                        {/* ADDRESS */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="faculty-address"
                                className={labelClass}
                            >
                                Address
                            </label>

                            <input
                                id="faculty-address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleFormChange}
                                placeholder="Enter complete address"
                                className={fieldClass}
                            />
                        </div>

                        {/* ASSIGNED SUBJECTS */}
                        <div className="sm:col-span-2">
                            <div className="mb-3">
                                <label className={labelClass}>
                                    Assigned Subjects
                                </label>

                                <p className="mt-1 text-xs text-white/40">
                                    Select all subjects assigned to this
                                    faculty member.
                                </p>
                            </div>

                            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#0A1B2A] p-3">
                                {activeSubjects.map((subject) => {
                                    const selectedSubjects =
                                        Array.isArray(formData.subjects)
                                            ? formData.subjects
                                            : [];

                                    const checked =
                                        selectedSubjects.includes(
                                            subject.name
                                        );

                                    return (
                                        <label
                                            key={subject.id}
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                                                checked
                                                    ? "border-[#A9E5D2]/30 bg-[#477F73]/15"
                                                    : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.06]"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleSubject(
                                                        subject.name
                                                    )
                                                }
                                                className="mt-1 h-4 w-4 shrink-0 accent-[#477F73]"
                                            />

                                            <span className="min-w-0">
                                                <span className="block text-sm font-semibold text-white/90">
                                                    {subject.name}
                                                </span>

                                                <span className="mt-1 block text-xs text-white/45">
                                                    {subject.code} ·{" "}
                                                    {subject.description}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            <p className="mt-2 text-xs text-[#A9E5D2]">
                                {(Array.isArray(formData.subjects)
                                    ? formData.subjects
                                    : []
                                ).length}{" "}
                                subject(s) selected
                            </p>
                        </div>
                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="flex justify-end gap-2 border-t border-white/10 bg-[#071522]/70 px-6 py-4 max-[480px]:flex-col">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl border border-[#A9E5D2]/20 bg-[#477F73] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#568F81]"
                    >
                        {modalType === "add"
                            ? "Add Faculty"
                            : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    </ModalShell>
)}


      {/* DELETE CONFIRMATION */}

      {deleteStudent && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020912]/75 px-4 py-6 backdrop-blur-md"
          onMouseDown={() => setDeleteStudent(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-[22px]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-400">
              <Trash2 size={23} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-white">
              Delete Student?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-white/85">
                {deleteStudent.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteStudent(null)}
                className="h-10 rounded-xl border border-white/[0.14] bg-[#102337] px-4 text-xs font-semibold text-white/75 transition-all hover:bg-white/[0.08]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="h-10 rounded-xl bg-red-500 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
