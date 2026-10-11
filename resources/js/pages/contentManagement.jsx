import { useMemo, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    EyeOff,
    Send,
    X,
    ChevronLeft,
    ChevronRight,
    Files,
    BookOpen,
    FileText,
    CheckCircle2,
    RefreshCw,
    CalendarDays,
    Eye,
    Paperclip,
    Upload,
    Download,
} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

import {
  initialContent as initialContent,
  
} from "../assets/data/facultyData";

const sectionOptions = [
    "BSAIS 11CA",
    "BSAIS 21CA",
    "BSAIS 31CA",
    "BSAIS 41CA",
    "BSEN 11CE",
    "BSEN 21CE",
    "BSEN 31CE",
    "BSEN 41CE",
];

const allowedExtensions =
    /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|png|jpg|jpeg)$/i;


const inputClass =
    "w-full rounded-xl border border-[#C9D6E3] bg-white px-3.5 py-2.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#526579]";

const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] shadow-sm transition-all hover:bg-[#E7EDF3] hover:text-[#243A52]";

const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#142A43] hover:shadow-md active:scale-[0.98]";

// Status badge
function StatusBadge({ status }) {
    const isPublished = status === "Published";

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${
                isPublished
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#D7C7A8] bg-[#FAF5E9] text-[#8A6A25]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? "bg-emerald-500" : "bg-[#8A6A25]"
                }`}
            />
            {status}
        </span>
    );
}

// Summary cards
function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    borderColor,
    accentColor,
    iconBackground,
    bars,
}) {
    return (
        <div
            className={`group relative min-w-0 overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} p-5 shadow-[0_5px_22px_rgba(27,53,83,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]`}
        >
            <div className="absolute right-5 top-5 flex h-9 items-end gap-1 opacity-70">
                {bars.map((bar, index) => (
                    <span key={index} className={`w-1.5 rounded-full ${bar}`} />
                ))}
            </div>

            <div className={`absolute bottom-0 left-0 h-1 w-full ${accentColor}`} />

            <div className="relative flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBackground} text-white shadow-[0_4px_10px_rgba(27,53,83,0.16)] transition-transform duration-200 group-hover:scale-105`}
                >
                    <Icon size={21} />
                </div>

                <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#526579]">
                        {title}
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-[#142A43]">
                        {value}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#738396]">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Modal form for adding or editing learning materials and their details
function ContentModal({ isOpen, onClose, onSave, editingContent }) {
    const [title, setTitle] = useState(editingContent?.title || "");
    const [topic, setTopic] = useState(editingContent?.topic || "");
    const [section, setSection] = useState(editingContent?.section || "");
    const [type, setType] = useState(editingContent?.type || "Lesson");
    const [attachment, setAttachment] = useState(
        editingContent?.attachment || null
    );
    const [fileError, setFileError] = useState("");

    if (!isOpen) return null;

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024;

        if (!allowedExtensions.test(file.name)) {
            setFileError(
                "Unsupported file type. Please select a PDF, Office document, or image."
            );
            event.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            setFileError("File size must not exceed 10 MB.");
            event.target.value = "";
            return;
        }

        setAttachment(file);
        setFileError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim() || !topic.trim() || !section) return;

        onSave({
            title: title.trim(),
            topic: topic.trim(),
            section,
            type,
            attachment,
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#142A43]/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#C9D6E3] bg-white shadow-2xl">
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1B3553] to-[#294B70] px-6 py-5">
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                                {editingContent ? (
                                    <Pencil className="h-5 w-5" />
                                ) : (
                                    <Plus className="h-5 w-5" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    {editingContent ? "Edit Content" : "Add Content"}
                                </h2>
                                <p className="mt-1 text-sm text-white/75">
                                    {editingContent
                                        ? "Update your learning material details."
                                        : "Create learning content for your students."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div>
                        <label className={labelClass}>Content Title</label>
                        <input
                            className={inputClass}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter content title"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Topic</label>
                        <input
                            className={inputClass}
                            value={topic}
                            onChange={(event) => setTopic(event.target.value)}
                            placeholder="e.g. Accounting Basics"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Section</label>
                            <select
                                className={`${inputClass} cursor-pointer`}
                                value={section}
                                onChange={(event) => setSection(event.target.value)}
                                required
                            >
                                <option value="">Select a section</option>
                                {sectionOptions.map((sectionName) => (
                                    <option key={sectionName} value={sectionName}>
                                        {sectionName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Content Type</label>
                            <select
                                className={`${inputClass} cursor-pointer`}
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                                required
                            >
                                <option value>Select Content Type</option>
                                <option value="Lesson">Lesson</option>
                                <option value="Learning Material">
                                    Learning Material
                                </option>
                                <option value="Document">Document</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>File Attachment</label>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9D6E3] bg-[#F7F9FC] px-4 py-6 text-center transition hover:border-[#294B70] hover:bg-[#E7EDF3]/60">
                            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EDF3] text-[#294B70]">
                                <Upload className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-semibold text-[#294B70]">
                                Click to select a file
                            </span>
                            <span className="mt-1 text-xs text-[#738396]">
                                PDF, Office documents, or images · Maximum 10 MB
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                            />
                        </label>

                        {fileError && (
                            <p className="mt-2 text-xs font-medium text-red-600">
                                {fileError}
                            </p>
                        )}

                        {attachment && (
                            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#C9D6E3] bg-white p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7EDF3] text-[#294B70]">
                                    <Paperclip className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[#243A52]">
                                        {attachment.name}
                                    </p>
                                    <p className="text-xs text-[#738396]">
                                        {typeof attachment.size === "number"
                                            ? `${(attachment.size / (1024 * 1024)).toFixed(2)} MB`
                                            : "Attached file"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAttachment(null);
                                        setFileError("");
                                    }}
                                    className="rounded-lg p-2 text-[#738396] transition hover:bg-red-50 hover:text-red-600"
                                    title="Remove attachment"
                                    aria-label="Remove attachment"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#E7EDF3] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className={buttonSecondary}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={buttonPrimary}>
                            {editingContent ? (
                                <Pencil className="h-4 w-4" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            {editingContent ? "Save Changes" : "Create Content"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// Details modal used to preview a selected content item and its attachment metadata
function ContentDetailsModal({ isOpen, content, onClose }) {
  if (!isOpen || !content) return null;

  const downloadAttachment = () => {
    if (!(content.attachment instanceof File)) return;

    const url = URL.createObjectURL(content.attachment);
    const link = document.createElement("a");

    link.href = url;
    link.download = content.attachment.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#142A43]/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#D8E1EA] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1B3553] to-[#294B70] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Content Details
              </h2>
              <p className="mt-0.5 text-xs text-white/70">
                View information about this learning content
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
          {/* Title card */}
          <div className="rounded-xl border border-[#D8E1EA] bg-[#F5F8FB] p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#718198]">
              <BookOpen size={15} />
              Content Title
            </div>

            <h3 className="break-words text-xl font-bold leading-snug text-[#1B3553]">
              {content.title || "Untitled Content"}
            </h3>

            <p className="mt-2 text-xs text-[#8291A3]">
              CNT- {content.id}
            </p>
          </div>    

          {/* Information grid */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-[#243A52]">
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                <p className="mb-1.5 text-xs font-medium text-[#8291A3]">
                  Topic
                </p>
                <p className="break-words text-sm font-semibold text-[#243A52]">
                  {content.topic || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                <p className="mb-1.5 text-xs font-medium text-[#8291A3]">
                  Section
                </p>
                <p className="break-words text-sm font-semibold text-[#243A52]">
                  {content.section || "Not assigned"}
                </p>
              </div>

              <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                <p className="mb-1.5 text-xs font-medium text-[#8291A3]">
                  Content Type
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8EEF5] text-[#294B70]">
                    {content.type === "Lesson" ? (
                      <BookOpen size={16} />
                    ) : content.type === "Document" ? (
                      <FileText size={16} />
                    ) : (
                      <Files size={16} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#243A52]">
                    {content.type || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                <p className="mb-1.5 text-xs font-medium text-[#8291A3]">
                  Date Posted
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#243A52]">
                  <CalendarDays size={16} className="text-[#647C96]" />
                  {content.date || "Not available"}
                </div>
              </div>
            </div>
          </div>

          {/* Publication status */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
            <div>
              <p className="text-sm font-bold text-[#243A52]">
                Publication Status
              </p>
              <p className="mt-1 text-xs text-[#8291A3]">
                Current availability of this content
              </p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                content.status === "Published"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "ring-[#D7C7A8] bg-[#FAF5E9] text-[#8A6A25]"
                  
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  content.status === "Published"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
              {content.status || "Draft"}
            </span>
          </div>

          {/* Attachment */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-[#243A52]">
              File Attachment
            </h3>

            {content.attachment instanceof File ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#D8E1EA] bg-[#F8FAFC] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EEF5] text-[#294B70]">
                  <Paperclip size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#243A52]">
                    {content.attachment.name}
                  </p>
                  <p className="mt-1 text-xs text-[#8291A3]">
                    {formatFileSize(content.attachment.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadAttachment}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-[#C9D6E3] bg-white px-3 py-2 text-xs font-semibold text-[#294B70] transition hover:bg-[#E7EDF3]"
                >
                  <Download size={15} />
                  Download
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#C9D6E3] bg-[#F8FAFC] px-4 py-7 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEF5] text-[#718198]">
                  <Paperclip size={18} />
                </div>
                <p className="text-sm font-semibold text-[#526579]">
                  No attachment available
                </p>
                <p className="mt-1 text-xs text-[#8291A3]">
                  No file has been attached to this content.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E1E7EE] bg-[#F8FAFC] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-[#1B3553] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#142A43] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirmation dialog
function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel,
    onConfirm,
    onClose,
    danger = false,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#142A43]/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-2xl">
                <div className="flex items-start gap-3 border-b border-[#E7EDF3] bg-gradient-to-r from-[#F7F9FC] to-[#EAF1F7] p-5">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            danger
                                ? "bg-red-50 text-red-600"
                                : "bg-[#E7EDF3] text-[#294B70]"
                        }`}
                    >
                        {danger ? (
                            <Trash2 className="h-5 w-5" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-[#1B3553]">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[#738396]">
                            {message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[#738396] transition hover:bg-[#E7EDF3] hover:text-[#243A52]"
                        aria-label="Close confirmation"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={buttonSecondary}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#1B3553] hover:bg-[#142A43]"
                        }`}
                    >
                        {danger ? (
                            <Trash2 className="h-4 w-4" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main dashboard for managing faculty content, filtering items, and publishing updates
export default function ContentManagement() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [content, setContent] = useState(initialContent);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [viewingContent, setViewingContent] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const publishedCount = content.filter(
        (item) => item.status === "Published"
    ).length;

    const draftCount = content.filter(
        (item) => item.status === "Draft"
    ).length;

    const filteredContent = useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        return content.filter((item) => {
            const matchesSearch = [
                item.title,
                item.topic,
                item.section,
                item.type,
                item.date,
                item.status,
                item.attachment?.name || "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);

            const matchesStatus =
                statusFilter === "All" || item.status === statusFilter;

            const matchesType =
                typeFilter === "All" || item.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [content, searchValue, statusFilter, typeFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredContent.length / itemsPerPage)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedContent = filteredContent.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    const openAddModal = () => {
        setEditingContent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingContent(item);
        setIsModalOpen(true);
    };

    const closeContentModal = () => {
        setIsModalOpen(false);
        setEditingContent(null);
    };

    const saveContent = (values) => {
        if (editingContent) {
            setContent((current) =>
                current.map((item) =>
                    item.id === editingContent.id
                        ? { ...item, ...values }
                        : item
                )
            );

            setViewingContent((current) =>
                current?.id === editingContent.id
                    ? { ...current, ...values }
                    : current
            );
        } else {
            setContent((current) => [
                {
                    id: Date.now(),
                    ...values,
                    date: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                    status: "Draft",
                },
                ...current,
            ]);

            setCurrentPage(1);
        }

        closeContentModal();
    };

    const deleteContent = (item) => {
        setConfirmAction({
            title: "Delete Content",
            message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
            confirmLabel: "Delete Content",
            danger: true,
            onConfirm: () => {
                setContent((current) =>
                    current.filter((row) => row.id !== item.id)
                );

                setViewingContent((current) =>
                    current?.id === item.id ? null : current
                );

                setConfirmAction(null);
            },
        });
    };

    const togglePublish = (item) => {
        const isPublished = item.status === "Published";

        setConfirmAction({
            title: isPublished ? "Unpublish Content" : "Publish Content",
            message: isPublished
                ? `Are you sure you want to unpublish "${item.title}"? It will be moved back to Draft status.`
                : `Are you sure you want to publish "${item.title}"?`,
            confirmLabel: isPublished ? "Unpublish" : "Publish",
            danger: false,
            onConfirm: () => {
                const nextStatus = isPublished ? "Draft" : "Published";

                setContent((current) =>
                    current.map((row) =>
                        row.id === item.id
                            ? { ...row, status: nextStatus }
                            : row
                    )
                );

                setViewingContent((current) =>
                    current?.id === item.id
                        ? { ...current, status: nextStatus }
                        : current
                );

                setConfirmAction(null);
            },
        });
    };

    const resetFilters = () => {
        setSearchValue("");
        setStatusFilter("All");
        setTypeFilter("All");
        setCurrentPage(1);
    };

    return (
        <FacultyLayout
            activeMenu="Content Management"
            title="Content Management"
            subtitle="Create and organize your learning materials."
            searchValue={searchValue}
            onSearchChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
            }}
            showPageInfo={false}
            showSearch={false}
        >
            <div className="mx-auto w-full max-w-[1600px]">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#294B70]">
                            Academic Management
                        </span>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                            Content Management
                        </h1>
                        <p className="mt-1 text-sm text-[#738396]">
                            Create, organize, and publish learning materials for your sections.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className={`${buttonPrimary} w-full sm:w-auto`}
                    >
                        <Plus className="h-4 w-4" />
                        Add Content
                    </button>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Content"
                        value={content.length}
                        description="All created content"
                        icon={Files}
                        gradient="from-[#E2EAF2] via-[#EDF2F7] to-white"
                        borderColor="border-[#AFC1D4]"
                        accentColor="bg-[#1B3553]/20"
                        iconBackground="bg-[#1B3553]"
                        bars={[
                            "h-3 bg-[#AFC1D4]",
                            "h-5 bg-[#8FA9C1]",
                            "h-8 bg-[#6F8CA8]",
                            "h-6 bg-[#AFC1D4]",
                        ]}
                    />

                    <SummaryCard
                        title="Published"
                        value={publishedCount}
                        description="Currently published"
                        icon={CheckCircle2}
                        gradient="from-[#E3F0EA] via-[#EFF6F2] to-white"
                        borderColor="border-[#B9D5C8]"
                        accentColor="bg-[#31805E]/30"
                        iconBackground="bg-[#31795B]"
                        bars={[
                            "h-3 bg-[#B9D9C8]",
                            "h-5 bg-[#8FC1A7]",
                            "h-7 bg-[#5E9C7A]",
                            "h-9 bg-[#31795B]",
                        ]}
                    />

                    <SummaryCard
                        title="Drafts"
                        value={draftCount}
                        description="Not yet published"
                        icon={FileText}
                        gradient="from-[#E6EAF0] via-[#F0F3F6] to-white"
                        borderColor="border-[#C8D0D9]"
                        accentColor="bg-[#64748B]/25"
                        iconBackground="bg-[#5E6C7C]"
                        bars={[
                            "h-8 bg-[#CBD3DC]",
                            "h-5 bg-[#AAB4BF]",
                            "h-6 bg-[#7C8794]",
                            "h-3 bg-[#5E6C7C]",
                        ]}
                    />

                    <SummaryCard
                        title="Content Types"
                        value={new Set(content.map((item) => item.type)).size}
                        description="All created content types"
                        icon={BookOpen}
                        gradient="from-[#DFE8F2] via-[#EAF0F6] to-white"
                        borderColor="border-[#AFC2D8]"
                        accentColor="bg-[#294B70]/30"
                        iconBackground="bg-[#294B70]"
                        bars={[
                            "h-4 bg-[#AFC2D8]",
                            "h-7 bg-[#7898B8]",
                            "h-5 bg-[#52789D]",
                            "h-9 bg-[#294B70]",
                        ]}
                    />
                </div>

                <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                    <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#1B3553]">
                                Learning Content
                            </h2>
                            <p className="mt-0.5 text-xs text-[#738396]">
                                Manage lessons and materials for your sections.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-white px-3 py-1.5 text-xs font-semibold text-[#526579]">
                            <Files className="h-4 w-4 text-[#294B70]" />
                            {filteredContent.length}{" "}
                            {filteredContent.length === 1 ? "item" : "items"}
                        </div>
                    </div>

                    <div className="border-b border-[#DCE4EC] bg-[#F7F9FB] px-5 py-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
                            <div className="relative min-w-0">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B9BAD]" />
                                <input
                                    type="text"
                                    className={`${inputClass} pl-9`}
                                    placeholder="Search title, topic, section..."
                                    value={searchValue}
                                    onChange={(event) => {
                                        setSearchValue(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <select
                                className={`${inputClass} cursor-pointer`}
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="All">All Status</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>

                            <select
                                className={`${inputClass} cursor-pointer`}
                                value={typeFilter}
                                onChange={(event) => {
                                    setTypeFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="All">All Types</option>
                                <option value="Lesson">Lesson</option>
                                <option value="Learning Material">Learning Material</option>
                                <option value="Document">Document</option>
                            </select>
                        </div>

                        {(searchValue ||
                            statusFilter !== "All" ||
                            typeFilter !== "All") && (
                            <p className="mt-3 text-xs text-[#738396]">
                                Showing results based on your search and filters.
                            </p>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead>
                                <tr className="border-y border-[#D8E2EC] bg-[#E7EDF3] text-[11px] uppercase tracking-wider text-[#526579]">
                                    <th className="px-6 py-3.5 font-bold">Content Title</th>
                                    <th className="px-4 py-3.5 font-bold">Topic</th>
                                    <th className="px-4 py-3.5 font-bold">Section</th>
                                    <th className="px-4 py-3.5 font-bold">Type</th>
                                    <th className="px-4 py-3.5 font-bold">Date Posted</th>
                                    <th className="px-4 py-3.5 font-bold">Status</th>
                                    <th className="px-6 py-3.5 text-center font-bold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E7EDF3]">
                                {paginatedContent.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors duration-150 hover:bg-[#F7F9FC]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7EDF3] text-[#294B70]">
                                                    {item.type === "Lesson" ? (
                                                        <BookOpen className="h-4 w-4" />
                                                    ) : item.type === "Document" ? (
                                                        <FileText className="h-4 w-4" />
                                                    ) : (
                                                        <Files className="h-4 w-4" />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#243A52]">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#8B9BAD]">
                                                        CNT- {String(item.id).padStart(3, "0")}
                                                    </p>
                                                    {item.attachment && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-[#294B70]">
                                                            <Paperclip className="h-3 w-3" />
                                                            Attachment
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-[#526579]">{item.topic}</td>

                                        <td className="px-4 py-4">
                                            <span className="inline-flex whitespace-nowrap rounded-lg border border-[#D8E2EC] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-[#526579]">
                                                {item.section}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-[#526579]">{item.type}</td>

                                        <td className="whitespace-nowrap px-4 py-4 text-[#526579]">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-[#8B9BAD]" />
                                                {item.date}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>

            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
              {/* View Details */}
              <button
                  type="button"
                  title="View Details"
                  aria-label={`View details for ${item.title}`}
                  onClick={() => setViewingContent(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#BFCFDF]
                                bg-[#E6EDF4]
                                text-[#1B3553]
                                transition-all
                                duration-200
                                hover:border-[#91A9C0]
                                hover:bg-[#D5E1EC]
                                hover:text-[#142A43]"
                >
                    <Eye className="h-4 w-4" />
                </button>

                {/* Edit Content */}
                <button
                    type="button"
                    title="Edit Content"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => openEditModal(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200
                                bg-blue-50
                                text-blue-600
                                transition-all
                                duration-200
                                hover:bg-blue-100
                                hover:text-blue-700"
                    >
                    <Pencil className="h-4 w-4" />
                    </button>

                    {/* Publish / Unpublish */}
                    <button
                        type="button"
                        title={
                            item.status === "Published"
                                ? "Unpublish Content"
                                : "Publish Content"
                        }
                        aria-label={
                            item.status === "Published"
                                ? `Unpublish ${item.title}`
                                : `Publish ${item.title}`
                        }
                        onClick={() => togglePublish(item)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                            item.status === "Published"
                    ? "border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-300 hover:bg-orange-100"
                    : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100"
                    }`}
                >
                    {item.status === "Published" ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>

                {/* Delete Content */}
                <button
                    type="button"
                    title="Delete Content"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => deleteContent(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200
                                bg-red-50
                                text-red-500
                                transition-all
                                duration-200
                                hover:bg-red-100
                                hover:text-red-600"
                      >
                          <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
              </td>
              </tr>
                               )) }

                                {paginatedContent.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EDF3] text-[#738396]">
                                                <Files className="h-6 w-6" />
                                            </div>
                                            <p className="mt-4 font-semibold text-[#243A52]">
                                                No content found
                                            </p>
                                            <p className="mt-1 text-sm text-[#738396]">
                                                No content matches your search or selected filters.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-4 py-2 text-sm font-semibold text-[#294B70] transition hover:bg-[#E7EDF3]"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                                Clear Filters
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                 {/* PAGINATION */}
          {filteredContent.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-[#D8E1EA] bg-[#F3F6F9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium text-[#718195]">
                Showing{" "}
                {(safePage - 1) * itemsPerPage + 1}–
                {Math.min(
                    safePage * itemsPerPage,
                    filteredContent.length
                )}{" "}
                of {filteredContent.length} content items
            </span>
        </div>

        <div className="flex items-center gap-1.5">
            <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C6D3E0] bg-white text-[#1B3553] transition hover:bg-[#E1E9F1] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-[17px] w-[17px]" />
            </button>

            {Array.from(
                { length: totalPages },
                (_, index) => index + 1
            ).map((page) => (
                <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === safePage ? "page" : undefined}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition ${
                        page === safePage
                            ? "border-[#1B3553] bg-[#1B3553] text-white shadow-sm"
                            : "border-[#C6D3E0] bg-white text-[#526579] hover:bg-[#E1E9F1]"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                    setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                    )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C6D3E0] bg-white text-[#1B3553] transition hover:bg-[#E1E9F1] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
            >
                <ChevronRight className="h-[17px] w-[17px]" />
            </button>
        </div>
    </div>
)}

            </section>
        </div>

            <ContentModal
                key={editingContent?.id ?? "new-content"}
                isOpen={isModalOpen}
                onClose={closeContentModal}
                onSave={saveContent}
                editingContent={editingContent}
            />

            <ContentDetailsModal
                isOpen={Boolean(viewingContent)}
                content={viewingContent}
                onClose={() => setViewingContent(null)}
            />

            <ConfirmModal
                isOpen={Boolean(confirmAction)}
                title={confirmAction?.title || ""}
                message={confirmAction?.message || ""}
                confirmLabel={confirmAction?.confirmLabel || "Confirm"}
                danger={confirmAction?.danger || false}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => confirmAction?.onConfirm()}
            />
        </FacultyLayout>
    );
}
