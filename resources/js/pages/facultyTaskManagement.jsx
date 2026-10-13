import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    CheckCircle2,
    FileText,
    Ban,
    Upload,
    CalendarDays,
    BookOpen,
    Send,
    RotateCcw,
    RefreshCw,
    Paperclip,
    Download,
    Trash,
} from 'lucide-react';

import FacultyLayout from '../components/layout/facultyLayout';

// --- Initial form data --
const emptyForm = {
    title: '',
    topic: '',
    section: '',
    due_date: '',
    points: '100',
    status: 'Draft',
    description: '',
    instructions: '',
    date_created: new Date().toISOString().slice(0, 10),
    attachment: null,
};

const sections = [
    'BSAIS 11CA',
    'BSAIS 21CA',
    'BSAIS 31CA',
    'BSAIS 41CA',
    'BSEN 11CE',
    'BSEN 21CE',
    'BSEN 31CE',
    'BSEN 41CE',
];

const inputClass =
    'w-full rounded-xl border border-[#C9D6E4] bg-white px-3.5 py-2.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10 disabled:cursor-not-allowed disabled:bg-[#E7EDF3]';

const labelClass = 'mb-1.5 block text-xs font-semibold text-[#526579]';

const buttonSecondary =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] shadow-sm transition-all hover:bg-[#E7EDF3] hover:text-[#243A52]';

const buttonPrimary =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#142A43] hover:shadow-md active:scale-[0.98]';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    'pdf',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    'png',
    'jpg',
    'jpeg',
];

// --- Utility helpers ---
function formatDate(date) {
    if (!date) return '—';

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return '';

    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getAttachmentName(attachment) {
    if (!attachment) return '';

    if (typeof File !== 'undefined' && attachment instanceof File) {
        return attachment.name;
    }

    if (typeof attachment === 'string') {
        return attachment.split('/').pop() || 'Attachment';
    }

    return attachment.name || 'Attachment';
}

function downloadAttachment(attachment) {
    if (!attachment) return;

    let url = '';
    let shouldRevoke = false;

    if (
        (typeof File !== 'undefined' && attachment instanceof File) ||
        (typeof Blob !== 'undefined' && attachment instanceof Blob)
    ) {
        url = URL.createObjectURL(attachment);
        shouldRevoke = true;
    } else if (typeof attachment === 'string') {
        url = attachment;
    } else if (attachment.url) {
        url = attachment.url;
    }

    if (!url) {
        window.alert(
            'This attachment is not available for download. Please upload the file again.',
        );
        return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = getAttachmentName(attachment);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    link.remove();

    if (shouldRevoke) {
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

// --- Status Badge ---
function StatusBadge({ status }) {
    const styles = {
        Active: 'border-[#B9D9C8] bg-[#F0F8F3] text-[#267653]',
        Draft: 'border-[#D7C7A8] bg-[#FAF5E9] text-[#8A6A25]',
        Completed: 'border-[#BFD2E5] bg-[#EEF4F9] text-[#294B70]',
        Cancelled: 'border-[#E2BFC3] bg-[#FBEEF0] text-[#A94A55]',
    };

    const dots = {
        Active: 'bg-[#31805E]',
        Draft: 'bg-[#B18A37]',
        Completed: 'bg-[#426B94]',
        Cancelled: 'bg-[#A94A55]',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                styles[status] || 'border-[#CBD3DC] bg-white text-[#647181]'
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    dots[status] || 'bg-[#7C8794]'
                }`}
            />
            {status}
        </span>
    );
}

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
            className={`group relative min-w-0 overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} p-3 shadow-[0_5px_22px_rgba(27,53,83,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)] sm:p-5`}
        >
            <div className="absolute top-5 right-5 hidden h-9 items-end gap-1 opacity-70 sm:flex">
                {bars.map((bar, index) => (
                    <span key={index} className={`w-1.5 rounded-full ${bar}`} />
                ))}
            </div>

            <div
                className={`absolute bottom-0 left-0 h-1 w-full ${accentColor}`}
            />

            <div className="relative flex min-h-[76px] items-center gap-2 sm:gap-4">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBackground} text-white shadow-[0_4px_10px_rgba(27,53,83,0.16)] transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12`}
                >
                    <Icon size={18} />
                </div>

                <div className="min-w-0">
                    <span className="block text-[11px] leading-tight font-bold text-[#526579] sm:text-xs">
                        {title}
                    </span>
                    <span className="mt-1 block text-xl font-bold tracking-tight text-[#142A43] sm:text-2xl">
                        {value}
                    </span>
                    <span className="mt-1 block text-[10px] leading-tight text-[#738396] sm:text-[11px]">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
}

function TaskActions({ task, onView, onEdit, onConfirm, mobile = false }) {
    const buttonClass = mobile
        ? 'inline-flex min-h-10 min-w-[76px] flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-colors'
        : 'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors';

    return (
        <div
            className={
                mobile ? 'flex flex-wrap gap-2' : 'flex items-center gap-1.5'
            }
        >
            <button
                type="button"
                title="View task"
                aria-label={`View ${task.title}`}
                onClick={onView}
                className={`${buttonClass} border-[#BFCFDF] bg-[#E6EDF4] text-[#1B3553] hover:border-[#91A9C0] hover:bg-[#D5E1EC]`}
            >
                <Eye size={15} />
                {mobile && <span>View</span>}
            </button>

            <button
                type="button"
                title="Edit task"
                aria-label={`Edit ${task.title}`}
                onClick={onEdit}
                className={`${buttonClass} border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700`}
            >
                <Pencil size={15} />
                {mobile && <span>Edit</span>}
            </button>

            {task.status === 'Draft' && (
                <button
                    type="button"
                    title="Publish task"
                    aria-label={`Publish ${task.title}`}
                    onClick={() => onConfirm('publish', task)}
                    className={`${buttonClass} border-[#B9D9C8] bg-white text-[#267653] hover:bg-[#F0F8F3]`}
                >
                    <Upload size={15} />
                    {mobile && <span>Publish</span>}
                </button>
            )}

            {task.status === 'Active' && (
                <button
                    type="button"
                    title="Cancel task"
                    aria-label={`Cancel ${task.title}`}
                    onClick={() => onConfirm('cancel', task)}
                    className={`${buttonClass} border-[#D7C7A8] bg-white text-[#8A6A25] hover:bg-[#FAF5E9]`}
                >
                    <Ban size={15} />
                    {mobile && <span>Cancel</span>}
                </button>
            )}

            <button
                type="button"
                title="Delete task"
                aria-label={`Delete ${task.title}`}
                onClick={() => onConfirm('delete', task)}
                className={`${buttonClass} border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600`}
            >
                <Trash2 size={15} />
                {mobile && <span>Delete</span>}
            </button>
        </div>
    );
}

// --- Task modal dialogs ---
function TaskModal({
    mode,
    task,
    formData,
    setFormData,
    onClose,
    onSubmit,
    onEdit,
}) {
    const fileInputRef = useRef(null);

    const isView = mode === 'view';
    const isAdd = mode === 'add';

    const updateField = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            window.alert(
                'Unsupported file type. Upload a PDF, Word, PowerPoint, Excel, PNG, or JPG file.',
            );

            event.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            window.alert('The file exceeds the 10 MB limit.');

            event.target.value = '';
            return;
        }

        setFormData((previous) => ({
            ...previous,
            attachment: file,
        }));

        // Allows the same file to be selected again
        event.target.value = '';
    };

    const removeAttachment = () => {
        setFormData((previous) => ({
            ...previous,
            attachment: null,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!mode) return null;

    if (isView && task) {
        const details = [
            ['Task Title', task.title],
            ['Topic', task.topic],
            ['Assigned Section', task.section],
            ['Due Date', formatDate(task.due_date)],
            ['Total Points', `${task.points ?? 100} points`],
            ['Date Created', formatDate(task.date_created)],
        ];

        const attachment = task.attachment;

        return (
            <div
                className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0C1C2D]/60 px-3 py-3 backdrop-blur-sm sm:items-center sm:p-4"
                onMouseDown={onClose}
            >
                <div
                    className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <div className="bg-gradient-to-br from-[#142A43] via-[#1B3553] to-[#294B70] px-4 py-4 sm:px-6 sm:py-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white">
                                    <ClipboardList size={27} />
                                </div>

                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold tracking-[0.14em] text-[#C8D8E8] uppercase">
                                        Task Information
                                    </span>

                                    <h2 className="mt-1 text-xl font-bold break-words text-white">
                                        {task.title}
                                    </h2>

                                    <span className="mt-1.5 inline-block rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">
                                        TSK-{String(task.id).padStart(3, '0')}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[60dvh] overflow-y-auto bg-[#EEF2F6] px-4 py-4 sm:max-h-[65vh] sm:px-6 sm:py-6">
                        <h3 className="text-sm font-bold text-[#1B3553]">
                            Task & Academic Details
                        </h3>

                        <p className="mt-0.5 mb-4 text-xs text-[#738396]">
                            Information about this task and its requirements
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {details.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5"
                                >
                                    <span className="block text-[10px] font-bold tracking-[0.08em] text-[#53677D] uppercase">
                                        {label}
                                    </span>

                                    <strong className="mt-1 block text-sm font-semibold break-words text-[#243A52]">
                                        {value || '—'}
                                    </strong>
                                </div>
                            ))}

                            <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                                <span className="block text-[10px] font-bold tracking-[0.08em] text-[#53677D] uppercase">
                                    Task Status
                                </span>

                                <div className="mt-2">
                                    <StatusBadge status={task.status} />
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5">
                                <span className="block text-[10px] font-bold tracking-[0.08em] text-[#53677D] uppercase">
                                    Description
                                </span>

                                <p className="mt-1 text-sm leading-6 break-words text-[#243A52]">
                                    {task.description ||
                                        'No description provided.'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5 sm:col-span-2">
                                <span className="block text-[10px] font-bold tracking-[0.08em] text-[#53677D] uppercase">
                                    Instructions
                                </span>

                                <p className="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-[#243A52]">
                                    {task.instructions ||
                                        'No additional instructions.'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#C9D6E3] bg-white px-4 py-4 sm:col-span-2">
                                <span className="block text-[10px] font-bold tracking-[0.08em] text-[#53677D] uppercase">
                                    File Attachment
                                </span>

                                {attachment ? (
                                    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70]">
                                                <Paperclip size={20} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold break-all text-[#243A52]">
                                                    {getAttachmentName(
                                                        attachment,
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-[#8292A3]">
                                                    {typeof File !==
                                                        'undefined' &&
                                                    attachment instanceof File
                                                        ? formatFileSize(
                                                              attachment.size,
                                                          )
                                                        : 'Attached file'}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                downloadAttachment(attachment)
                                            }
                                            className={buttonSecondary}
                                        >
                                            <Download size={15} />
                                            Download
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-dashed border-[#C9D6E3] bg-[#F7F9FB] px-4 py-6 text-center">
                                        <FileText
                                            size={24}
                                            className="mx-auto text-[#9AA8B7]"
                                        />
                                        <p className="mt-2 text-sm text-[#8292A3]">
                                            No attachment available.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-[#DCE4EC] bg-white px-5 py-4 max-[480px]:flex-col">
                        <button
                            type="button"
                            onClick={() => onEdit(task)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#BFD2E5] bg-[#EEF4F9] px-4 py-2.5 text-sm font-semibold text-[#294B70] hover:bg-[#DCE8F2]"
                        >
                            <Pencil size={16} />
                            Edit Task
                        </button>

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

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#142A43]/40 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
            onMouseDown={onClose}
        >
            <div
                className="max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#C9D5E2] bg-white shadow-[0_20px_60px_rgba(27,53,83,0.20)] sm:max-h-[90vh]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between bg-gradient-to-r from-[#1B3553] via-[#294B70] to-[#365C7E] px-5 py-5">
                    <div>
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white/80 uppercase">
                            Task Management
                        </span>

                        <h2 className="mt-2 text-lg font-bold text-white">
                            {isAdd ? 'Create Task' : 'Edit Task'}
                        </h2>

                        <p className="mt-0.5 text-xs text-white/65">
                            {isAdd
                                ? 'Create a new academic task for a section.'
                                : 'Update the task details and requirements.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="task-title" className={labelClass}>
                                Task Title
                            </label>

                            <input
                                id="task-title"
                                name="title"
                                value={formData.title}
                                onChange={updateField}
                                placeholder="Enter task title"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="task-topic" className={labelClass}>
                                Topic
                            </label>

                            <input
                                id="task-topic"
                                name="topic"
                                value={formData.topic}
                                onChange={updateField}
                                placeholder="e.g. Journal Entries"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="task-section"
                                className={labelClass}
                            >
                                Assigned Section
                            </label>

                            <select
                                id="task-section"
                                name="section"
                                value={formData.section}
                                onChange={updateField}
                                required
                                className={inputClass}
                            >
                                <option value="">Select section</option>

                                {sections.map((section) => (
                                    <option key={section} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="task-due" className={labelClass}>
                                Due Date
                            </label>

                            <input
                                id="task-due"
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={updateField}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="task-points" className={labelClass}>
                                Total Points
                            </label>

                            <input
                                id="task-points"
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={updateField}
                                min="1"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="task-description"
                                className={labelClass}
                            >
                                Description
                            </label>

                            <textarea
                                id="task-description"
                                name="description"
                                value={formData.description}
                                onChange={updateField}
                                placeholder="Describe the task..."
                                rows={3}
                                required
                                className={`${inputClass} resize-y`}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="task-instructions"
                                className={labelClass}
                            >
                                Instructions (Optional)
                            </label>

                            <textarea
                                id="task-instructions"
                                name="instructions"
                                value={formData.instructions}
                                onChange={updateField}
                                placeholder="Add instructions for students..."
                                rows={3}
                                className={`${inputClass} resize-y`}
                            />
                        </div>

                        {/* Updated File Attachment */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="task-attachment"
                                className={labelClass}
                            >
                                File Attachment (Optional)
                            </label>

                            <input
                                ref={fileInputRef}
                                id="task-attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {!formData.attachment ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B8C9DA] bg-[#F7F9FB] px-5 py-8 text-center transition-all hover:border-[#294B70] hover:bg-[#EEF4F9]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70] shadow-sm">
                                        <Upload size={22} />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-[#243A52]">
                                        Click to select a file
                                    </p>

                                    <span className="mt-2 text-[11px] leading-5 text-[#8292A3]">
                                        PDF, Office documents, or images |
                                        Maximum file size: 10 MB.
                                    </span>
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3 rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70]">
                                            <Paperclip size={20} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold break-all text-[#243A52]">
                                                {getAttachmentName(
                                                    formData.attachment,
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-[#8292A3]">
                                                {typeof File !== 'undefined' &&
                                                formData.attachment instanceof
                                                    File
                                                    ? formatFileSize(
                                                          formData.attachment
                                                              .size,
                                                      )
                                                    : 'Existing attachment'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9D6E3] bg-white px-3 py-2 text-xs font-semibold text-[#294B70] transition hover:bg-[#EEF4F9]"
                                        >
                                            <RefreshCw size={14} />
                                            Replace
                                        </button>

                                        <button
                                            type="button"
                                            onClick={removeAttachment}
                                            aria-label="Remove attachment"
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            <Trash size={14} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="task-status" className={labelClass}>
                                Task Status
                            </label>

                            <select
                                id="task-status"
                                name="status"
                                value={formData.status}
                                onChange={updateField}
                                className={inputClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                            </select>

                            <p className="mt-1.5 text-[11px] text-[#7A8999]">
                                Draft tasks are not yet published to students.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-[#DCE4EC] bg-[#F5F7FA] px-5 py-4 max-[480px]:flex-col">
                        <button
                            type="button"
                            onClick={onClose}
                            className={buttonSecondary}
                        >
                            Cancel
                        </button>

                        <button type="submit" className={buttonPrimary}>
                            {isAdd ? (
                                <Plus size={16} />
                            ) : (
                                <CheckCircle2 size={16} />
                            )}

                            {isAdd ? 'Create Task' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- Confirmation modal ---
function ConfirmModal({ type, task, onClose, onConfirm }) {
    if (!type || !task) return null;

    const isDelete = type === 'delete';
    const isPublish = type === 'publish';

    const title = isDelete
        ? 'Delete Task?'
        : isPublish
          ? 'Publish Task?'
          : 'Cancel Task?';

    const accent = isDelete
        ? {
              bg: 'bg-[#FBEEF0]',
              icon: 'bg-[#A94A55]',
              border: 'border-[#E2BFC3]',
              button: 'bg-[#A94A55] hover:bg-[#8E3742]',
          }
        : isPublish
          ? {
                bg: 'bg-[#EEF4F9]',
                icon: 'bg-[#294B70]',
                border: 'border-[#BFD2E5]',
                button: 'bg-[#1B3553] hover:bg-[#142A43]',
            }
          : {
                bg: 'bg-[#FAF5E9]',
                icon: 'bg-[#8A6A25]',
                border: 'border-[#D7C7A8]',
                button: 'bg-[#8A6A25] hover:bg-[#70551E]',
            };

    const actionText = isDelete
        ? 'Delete Task'
        : isPublish
          ? 'Publish Task'
          : 'Cancel Task';

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#142A43]/40 px-4 py-6 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className={`w-full max-w-sm overflow-hidden rounded-2xl border ${accent.border} bg-white shadow-[0_20px_60px_rgba(27,53,83,0.20)]`}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className={`${accent.bg} px-5 py-5`}>
                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.icon} text-white shadow-sm`}
                    >
                        {isDelete ? (
                            <Trash2 size={21} />
                        ) : isPublish ? (
                            <Send size={21} />
                        ) : (
                            <Ban size={21} />
                        )}
                    </div>

                    <h2 className="mt-4 text-base font-bold text-[#243A52]">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#526579]">
                        {isDelete
                            ? 'Are you sure you want to delete'
                            : isPublish
                              ? 'Publish'
                              : 'Are you sure you want to cancel'}{' '}
                        <strong className="font-semibold text-[#243A52]">
                            {task.title}
                        </strong>
                        {isDelete
                            ? '? This action cannot be undone.'
                            : isPublish
                              ? '? Students in the assigned section will be able to see it.'
                              : '? Students will no longer be able to access this task.'}
                    </p>
                </div>

                <div
                    className={`flex justify-end gap-2 border-t ${accent.border} bg-white px-5 py-4`}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className={buttonSecondary}
                    >
                        Keep Task
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md ${accent.button}`}
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main task management page ---
export default function TaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalType, setModalType] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [confirmType, setConfirmType] = useState(null);
    const [confirmTask, setConfirmTask] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const itemsPerPage = 5;

    const getCsrfToken = () =>
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const response = await fetch('/faculty/tasks/data', {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load tasks.');
            }

            const data = await response.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setErrorMessage('Unable to load tasks right now.');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchTasks();
    }, []);

    const counts = useMemo(
        () => ({
            total: tasks.length,
            active: tasks.filter((task) => task.status === 'Active').length,
            drafts: tasks.filter((task) => task.status === 'Draft').length,
            completed: tasks.filter((task) => task.status === 'Completed')
                .length,
        }),
        [tasks],
    );

    const filteredTasks = useMemo(() => {
        const search = searchValue.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                [
                    task.title,
                    task.topic,
                    task.section,
                    task.description,
                    `TSK-${String(task.id).padStart(3, '0')}`,
                    getAttachmentName(task.attachment),
                ].some((value) =>
                    String(value || '')
                        .toLowerCase()
                        .includes(search),
                );

            const matchesStatus =
                statusFilter === 'All Status' || task.status === statusFilter;

            const matchesSection =
                sectionFilter === 'All Sections' ||
                task.section === sectionFilter;

            return matchesSearch && matchesStatus && matchesSection;
        });
    }, [tasks, searchValue, statusFilter, sectionFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredTasks.length / itemsPerPage),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedTasks = filteredTasks.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage,
    );

    const closeModal = () => {
        setModalType(null);
        setSelectedTask(null);
    };

    const openAddModal = () => {
        setSelectedTask(null);

        setFormData({
            ...emptyForm,
            due_date: '',
            date_created: new Date().toISOString().slice(0, 10),
        });

        setModalType('add');
    };

    const openEditModal = (task) => {
        setSelectedTask(task);

        setFormData({
            ...emptyForm,
            ...task,
            points: String(task.points ?? 100),
            attachment: task.attachment ?? null,
        });

        setModalType('edit');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            tasks.some(
                (task) =>
                    task.title.trim().toLowerCase() ===
                        formData.title.trim().toLowerCase() &&
                    task.section === formData.section &&
                    task.id !== selectedTask?.id,
            )
        ) {
            window.alert(
                'A task with this title already exists for this section.',
            );
            return;
        }

        const payload = new FormData();
        payload.append('title', formData.title.trim());
        payload.append('topic', formData.topic.trim());
        payload.append('section', formData.section);
        payload.append('due_date', formData.due_date);
        payload.append('points', String(Number(formData.points) || 100));
        payload.append('status', formData.status || 'Draft');
        payload.append('description', formData.description?.trim() || '');
        payload.append('instructions', formData.instructions?.trim() || '');
        payload.append(
            'date_created',
            formData.date_created || new Date().toISOString().slice(0, 10),
        );

        const newAttachment =
            typeof File !== 'undefined' && formData.attachment instanceof File;

        if (newAttachment) {
            payload.append('attachment', formData.attachment);
        } else if (
            modalType === 'edit' &&
            !formData.attachment &&
            selectedTask?.attachment
        ) {
            payload.append('remove_attachment', '1');
        }

        const isCreating = modalType === 'add';

        if (!isCreating) {
            payload.append('_method', 'PUT');
        }

        try {
            const url = isCreating
                ? '/faculty/tasks'
                : `/faculty/tasks/${selectedTask.id}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: payload,
            });

            if (!response.ok) {
                throw new Error('Failed to save task.');
            }

            await fetchTasks();
            setCurrentPage(1);
            closeModal();
        } catch (error) {
            console.error('Error saving task:', error);
            window.alert('Unable to save task. Please try again.');
        }
    };

    const openConfirm = (type, task) => {
        setConfirmType(type);
        setConfirmTask(task);
    };

    const closeConfirm = () => {
        setConfirmType(null);
        setConfirmTask(null);
    };

    const handleConfirmAction = async () => {
        if (!confirmTask || !confirmType) return;

        try {
            if (confirmType === 'delete') {
                const response = await fetch(
                    `/faculty/tasks/${confirmTask.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to delete task.');
                }
            }

            if (confirmType === 'publish') {
                const response = await fetch(
                    `/faculty/tasks/${confirmTask.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                        body: JSON.stringify({
                            ...confirmTask,
                            status: 'Active',
                        }),
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to publish task.');
                }
            }

            if (confirmType === 'cancel') {
                const response = await fetch(
                    `/faculty/tasks/${confirmTask.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken(),
                        },
                        body: JSON.stringify({
                            ...confirmTask,
                            status: 'Cancelled',
                        }),
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to cancel task.');
                }
            }

            await fetchTasks();
            closeConfirm();
        } catch (error) {
            console.error('Task action failed:', error);
            window.alert('The task action could not be completed.');
        }
    };

    const clearFilters = () => {
        setSearchValue('');
        setStatusFilter('All Status');
        setSectionFilter('All Sections');
        setCurrentPage(1);
    };

    const hasFilters =
        searchValue !== '' ||
        statusFilter !== 'All Status' ||
        sectionFilter !== 'All Sections';

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    return (
        <FacultyLayout
            activeMenu="Task Management"
            showPageInfo={false}
            showSearch={false}
        >
            <div className="mx-auto w-full max-w-[1600px]">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#294B70] uppercase">
                            Academic Management
                        </span>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                            Task Management
                        </h1>

                        <p className="mt-1 text-sm text-[#738396]">
                            Create academic tasks, manage deadlines, and monitor
                            task status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className={`${buttonPrimary} shrink-0`}
                    >
                        <Plus size={17} />
                        Create Task
                    </button>
                </div>

                {/* --- Summary statistics --- */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Tasks"
                        value={counts.total}
                        description="All created tasks"
                        icon={ClipboardList}
                        gradient="from-[#E2EAF2] via-[#EDF2F7] to-white"
                        borderColor="border-[#AFC1D4]"
                        accentColor="bg-[#1B3553]/20"
                        iconBackground="bg-[#1B3553]"
                        bars={[
                            'h-3 bg-[#AFC1D4]',
                            'h-5 bg-[#8FA9C1]',
                            'h-8 bg-[#6F8CA8]',
                            'h-6 bg-[#AFC1D4]',
                        ]}
                    />

                    <SummaryCard
                        title="Active Tasks"
                        value={counts.active}
                        description="Currently published"
                        icon={RefreshCw}
                        gradient="from-[#E3F0EA] via-[#EFF6F2] to-white"
                        borderColor="border-[#B9D5C8]"
                        accentColor="bg-[#31805E]/30"
                        iconBackground="bg-[#31795B]"
                        bars={[
                            'h-3 bg-[#B9D9C8]',
                            'h-5 bg-[#8FC1A7]',
                            'h-7 bg-[#5E9C7A]',
                            'h-9 bg-[#31795B]',
                        ]}
                    />

                    <SummaryCard
                        title="Draft Tasks"
                        value={counts.drafts}
                        description="Not yet published"
                        icon={FileText}
                        gradient="from-[#E6EAF0] via-[#F0F3F6] to-white"
                        borderColor="border-[#C8D0D9]"
                        accentColor="bg-[#64748B]/25"
                        iconBackground="bg-[#5E6C7C]"
                        bars={[
                            'h-8 bg-[#CBD3DC]',
                            'h-5 bg-[#AAB4BF]',
                            'h-6 bg-[#7C8794]',
                            'h-3 bg-[#5E6C7C]',
                        ]}
                    />

                    <SummaryCard
                        title="Completed Tasks"
                        value={counts.completed}
                        description="Marked as completed"
                        icon={CheckCircle2}
                        gradient="from-[#DFE8F2] via-[#EAF0F6] to-white"
                        borderColor="border-[#AFC2D8]"
                        accentColor="bg-[#294B70]/30"
                        iconBackground="bg-[#294B70]"
                        bars={[
                            'h-4 bg-[#AFC2D8]',
                            'h-7 bg-[#7898B8]',
                            'h-5 bg-[#52789D]',
                            'h-9 bg-[#294B70]',
                        ]}
                    />
                </div>

                {/* --- Task list controls and table --- */}
                <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                    <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#1B3553]">
                                Task List
                            </h2>

                            <p className="mt-0.5 text-xs text-[#738396]">
                                View and manage all academic tasks
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-white px-3 py-1.5 text-xs font-semibold text-[#526579]">
                            <ClipboardList size={14} />
                            {filteredTasks.length}{' '}
                            {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                    </div>

                    {errorMessage && (
                        <div
                            role="alert"
                            className="flex flex-col gap-2 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span>{errorMessage}</span>
                            <button
                                type="button"
                                onClick={() => void fetchTasks()}
                                className="w-fit font-semibold underline underline-offset-2"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* --- Filters --- */}
                    <div className="border-b border-[#DCE4EC] bg-[#F7F9FB] px-5 py-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
                            <div className="relative min-w-0">
                                <Search
                                    size={17}
                                    className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8292A3]"
                                />

                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(event) =>
                                        handleSearch(event.target.value)
                                    }
                                    placeholder="Search tasks or attachments..."
                                    className="w-full rounded-xl border border-[#C9D6E4] bg-white py-2.5 pr-4 pl-10 text-sm text-[#243A52] outline-none placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10"
                                />
                            </div>

                            <select
                                value={sectionFilter}
                                onChange={(event) => {
                                    setSectionFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className={inputClass}
                                aria-label="Filter by section"
                            >
                                {['All Sections', ...sections].map(
                                    (section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ),
                                )}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className={inputClass}
                                aria-label="Filter by status"
                            >
                                {[
                                    'All Status',
                                    'Active',
                                    'Draft',
                                    'Completed',
                                    'Cancelled',
                                ].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- Mobile task cards --- */}
                    <div className="space-y-3 p-3 md:hidden">
                        {isLoading && (
                            <div className="px-3 py-10 text-center text-sm text-[#526579]">
                                Loading tasks...
                            </div>
                        )}

                        {!isLoading &&
                            paginatedTasks.map((task) => (
                                <article
                                    key={task.id}
                                    className="min-w-0 rounded-xl border border-[#D5DFE9] bg-white p-4 shadow-sm"
                                >
                                    <div className="flex min-w-0 items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#294B70]">
                                                <BookOpen size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold break-words text-[#243A52]">
                                                    {task.title}
                                                </h3>
                                                <p className="mt-1 text-[11px] text-[#8292A3]">
                                                    TSK-
                                                    {String(task.id).padStart(
                                                        3,
                                                        '0',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={task.status} />
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#E5EBF1] pt-3 text-xs">
                                        <div className="min-w-0">
                                            <dt className="font-semibold text-[#8292A3]">
                                                Topic
                                            </dt>
                                            <dd className="mt-1 break-words text-[#526579]">
                                                {task.topic || '—'}
                                            </dd>
                                        </div>
                                        <div className="min-w-0">
                                            <dt className="font-semibold text-[#8292A3]">
                                                Section
                                            </dt>
                                            <dd className="mt-1 break-words text-[#526579]">
                                                {task.section || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-semibold text-[#8292A3]">
                                                Due date
                                            </dt>
                                            <dd className="mt-1 text-[#526579]">
                                                {formatDate(task.due_date)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-semibold text-[#8292A3]">
                                                Points
                                            </dt>
                                            <dd className="mt-1 text-[#526579]">
                                                {task.points ?? 100}
                                            </dd>
                                        </div>
                                    </dl>

                                    {task.attachment && (
                                        <button
                                            type="button"
                                            title={`Download ${getAttachmentName(task.attachment)}`}
                                            onClick={() =>
                                                downloadAttachment(
                                                    task.attachment,
                                                )
                                            }
                                            className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#C9D6E3] bg-[#F7F9FB] px-3 py-2 text-xs font-semibold text-[#294B70] hover:bg-[#EEF4F9]"
                                        >
                                            <Paperclip
                                                size={14}
                                                className="shrink-0"
                                            />
                                            <span className="truncate">
                                                {getAttachmentName(
                                                    task.attachment,
                                                )}
                                            </span>
                                            <Download
                                                size={13}
                                                className="shrink-0"
                                            />
                                        </button>
                                    )}

                                    <div className="mt-4 border-t border-[#E5EBF1] pt-3">
                                        <TaskActions
                                            task={task}
                                            mobile
                                            onView={() => {
                                                setSelectedTask(task);
                                                setModalType('view');
                                            }}
                                            onEdit={() => openEditModal(task)}
                                            onConfirm={openConfirm}
                                        />
                                    </div>
                                </article>
                            ))}

                        {!isLoading && paginatedTasks.length === 0 && (
                            <div className="rounded-xl border border-dashed border-[#C9D6E3] px-4 py-8 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#8292A3]">
                                    {hasFilters ? (
                                        <Search size={21} />
                                    ) : (
                                        <ClipboardList size={21} />
                                    )}
                                </div>
                                <h3 className="mt-3 text-sm font-bold text-[#243A52]">
                                    {hasFilters
                                        ? 'No matching tasks found'
                                        : 'No tasks available'}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-[#8292A3]">
                                    {hasFilters
                                        ? 'Try changing your search or filters.'
                                        : 'Create a task to start managing academic activities.'}
                                </p>
                                <button
                                    type="button"
                                    onClick={
                                        hasFilters ? clearFilters : openAddModal
                                    }
                                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#294B70]"
                                >
                                    {hasFilters ? (
                                        <RotateCcw size={14} />
                                    ) : (
                                        <Plus size={14} />
                                    )}
                                    {hasFilters
                                        ? 'Clear filters'
                                        : 'Create Task'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- Desktop task table --- */}
                    <div className="hidden w-full overflow-x-auto md:block">
                        <table className="w-full min-w-[1100px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#C9D6E3] bg-[#E7EDF3]">
                                    {[
                                        'Task',
                                        'Topic',
                                        'Section',
                                        'Due Date',
                                        'Points',
                                        'Attachment',
                                        'Status',
                                        'Actions',
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-5 py-3.5 text-[10px] font-bold tracking-[0.09em] whitespace-nowrap text-[#53677D] uppercase"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E5EBF1]">
                                {isLoading && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-16 text-center text-sm text-[#526579]"
                                        >
                                            Loading tasks...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading &&
                                    paginatedTasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="group transition-colors hover:bg-[#F7F9FC]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#294B70]">
                                                        <BookOpen size={18} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="max-w-[260px] truncate text-sm font-semibold text-[#243A52]">
                                                            {task.title}
                                                        </p>

                                                        <p className="mt-1 text-[11px] text-[#8292A3]">
                                                            TSK-
                                                            {String(
                                                                task.id,
                                                            ).padStart(3, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#526579]">
                                                {task.topic || '—'}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-lg border border-[#D5DFE9] bg-[#F5F8FB] px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-[#526579]">
                                                    {task.section}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm whitespace-nowrap text-[#526579]">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-[#8292A3]"
                                                    />
                                                    {formatDate(task.due_date)}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-[#526579]">
                                                {task.points ?? 100}
                                            </td>

                                            <td className="px-5 py-4">
                                                {task.attachment ? (
                                                    <button
                                                        type="button"
                                                        title={`Download ${getAttachmentName(task.attachment)}`}
                                                        onClick={() =>
                                                            downloadAttachment(
                                                                task.attachment,
                                                            )
                                                        }
                                                        className="flex max-w-[190px] items-center gap-2 rounded-lg border border-[#C9D6E3] bg-white px-3 py-2 text-xs font-semibold text-[#294B70] transition hover:bg-[#EEF4F9]"
                                                    >
                                                        <Paperclip
                                                            size={14}
                                                            className="shrink-0"
                                                        />

                                                        <span className="truncate">
                                                            {getAttachmentName(
                                                                task.attachment,
                                                            )}
                                                        </span>

                                                        <Download
                                                            size={13}
                                                            className="shrink-0"
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-[#9AA8B7]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={task.status}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <TaskActions
                                                    task={task}
                                                    onView={() => {
                                                        setSelectedTask(task);
                                                        setModalType('view');
                                                    }}
                                                    onEdit={() =>
                                                        openEditModal(task)
                                                    }
                                                    onConfirm={openConfirm}
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                {!isLoading && paginatedTasks.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9D6E3] bg-[#EEF4F9] text-[#8292A3]">
                                                {hasFilters ? (
                                                    <Search size={23} />
                                                ) : (
                                                    <ClipboardList size={23} />
                                                )}
                                            </div>

                                            <h3 className="mt-4 text-sm font-bold text-[#243A52]">
                                                {hasFilters
                                                    ? 'No matching tasks found'
                                                    : 'No tasks available'}
                                            </h3>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#8292A3]">
                                                {hasFilters
                                                    ? 'Try changing your search or filters to find a task.'
                                                    : 'Create a task to start managing academic activities.'}
                                            </p>

                                            {hasFilters ? (
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#294B70] hover:text-[#1B3553]"
                                                >
                                                    <RotateCcw size={14} />
                                                    Clear filters
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={openAddModal}
                                                    className={`${buttonPrimary} mt-4`}
                                                >
                                                    <Plus size={15} />
                                                    Create Task
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#DCE4EC] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[#738396]">
                            Showing{' '}
                            <strong className="font-semibold text-[#243A52]">
                                {filteredTasks.length === 0
                                    ? 0
                                    : (safePage - 1) * itemsPerPage + 1}
                            </strong>{' '}
                            to{' '}
                            <strong className="font-semibold text-[#243A52]">
                                {Math.min(
                                    safePage * itemsPerPage,
                                    filteredTasks.length,
                                )}
                            </strong>{' '}
                            of{' '}
                            <strong className="font-semibold text-[#243A52]">
                                {filteredTasks.length}
                            </strong>{' '}
                            tasks
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={safePage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1),
                                    )
                                }   
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9D6E3] bg-white text-[#526579] hover:bg-[#EEF4F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold ${
                                        page === safePage
                                            ? 'border-[#1B3553] bg-[#1B3553] text-white shadow-sm'
                                            : 'border-[#C9D6E3] bg-white text-[#526579] hover:bg-[#EEF4F9]'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={safePage >= totalPages}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(totalPages, page + 1),
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9D6E3] bg-white text-[#526579] hover:bg-[#EEF4F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <TaskModal
                mode={modalType}
                task={selectedTask}
                formData={formData}
                setFormData={setFormData}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onEdit={openEditModal}
            />

            <ConfirmModal
                type={confirmType}
                task={confirmTask}
                onClose={closeConfirm}
                onConfirm={handleConfirmAction}
            />
        </FacultyLayout>
    );
}
