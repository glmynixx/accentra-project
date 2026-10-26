
import { useMemo, useState } from "react";
import {
    Search,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    CheckCircle2,
    Clock,
    FileText,
    CalendarDays,
    BookOpen,
    RotateCcw,
    Paperclip,
    Download,
    UserRound,
    GraduationCap,
    MessageSquare,
    Award,
    FileCheck2,
    AlertCircle,
    Users,
    Save,
    Calculator,
} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

// --------------------------------------------------
// SAMPLE SUBMISSION DATA
// Replace this with data from your backend when ready.
// --------------------------------------------------

const initialSubmissions = [
    {
        id: 1,
        studentName: "Juan Dela Cruz",
        studentId: "2026-00101",
        taskTitle: "Journal Entries Activity",
        section: "BSAIS 11CA",
        dateSubmitted: "2026-10-15",
        status: "Pending Review",
        content:
            "I completed the journal entries based on the transactions provided. The entries include the corresponding debit and credit accounts and their amounts.",
        uploadedFiles: [
            {
                name: "Journal_Entries.pdf",
                size: "245 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "General Journal",
                description: "Recording of business transactions",
                status: "Completed",
            },
            {
                name: "Debit and Credit Analysis",
                description: "Verification of journal entry amounts",
                status: "Completed",
            },
        ],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 2,
        studentName: "Maria Santos",
        studentId: "2026-00102",
        taskTitle: "Chart of Accounts",
        section: "BSAIS 11CA",
        dateSubmitted: "2026-10-14",
        status: "Approved",
        content:
            "The chart of accounts is organized according to asset, liability, equity, revenue, and expense classifications.",
        uploadedFiles: [
            {
                name: "Chart_of_Accounts.xlsx",
                size: "128 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Chart of Accounts",
                description: "Account codes and classifications",
                status: "Completed",
            },
        ],
        score: "95",
        remarks: "Well-organized accounts and correct classifications.",
        evaluationStatus: "Approved",
    },
    {
        id: 3,
        studentName: "Angela Reyes",
        studentId: "2026-00103",
        taskTitle: "Trial Balance Exercise",
        section: "BSAIS 21CA",
        dateSubmitted: "2026-10-16",
        status: "Submitted",
        content:
            "This activity contains the trial balance prepared using the ending balances of the general ledger accounts.",
        uploadedFiles: [
            {
                name: "Trial_Balance.xlsx",
                size: "96 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Trial Balance",
                description: "Summary of ledger account balances",
                status: "Completed",
            },
        ],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 4,
        studentName: "Mark Villanueva",
        studentId: "2026-00104",
        taskTitle: "Income Statement",
        section: "BSAIS 21CA",
        dateSubmitted: "2026-10-12",
        status: "Returned for Revision",
        content:
            "The income statement presents the revenue and expenses recorded during the accounting period.",
        uploadedFiles: [
            {
                name: "Income_Statement.xlsx",
                size: "115 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Income Statement",
                description: "Revenue, expenses, and net income",
                status: "Completed",
            },
        ],
        score: "70",
        remarks:
            "Please review the expense classifications and recalculate the net income.",
        evaluationStatus: "Returned for Revision",
    },
    {
        id: 5,
        studentName: "Sofia Garcia",
        studentId: "2026-00105",
        taskTitle: "Journal Entries Activity",
        section: "BSAIS 11CA",
        dateSubmitted: "2026-10-17",
        status: "Reviewed",
        content:
            "The submitted journal entries include transaction dates, account titles, debit amounts, and credit amounts.",
        uploadedFiles: [
            {
                name: "Journal_Activity.docx",
                size: "82 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "General Journal",
                description: "Transaction entries",
                status: "Completed",
            },
        ],
        score: "88",
        remarks: "Good work. Review the formatting of the journal entries.",
        evaluationStatus: "Reviewed",
    },
    {
        id: 6,
        studentName: "Paolo Mendoza",
        studentId: "2026-00106",
        taskTitle: "Balance Sheet",
        section: "BSAIS 31CA",
        dateSubmitted: "2026-10-18",
        status: "Submitted",
        content:
            "The balance sheet summarizes the business assets, liabilities, and owner's equity.",
        uploadedFiles: [
            {
                name: "Balance_Sheet.xlsx",
                size: "104 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Balance Sheet",
                description: "Assets, liabilities, and equity",
                status: "Completed",
            },
        ],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 7,
        studentName: "Andrea Flores",
        studentId: "2026-00107",
        taskTitle: "Trial Balance Exercise",
        section: "BSAIS 21CA",
        dateSubmitted: "",
        status: "Not Submitted",
        content: "",
        uploadedFiles: [],
        accountingOutputs: [],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 8,
        studentName: "Gabriel Ramos",
        studentId: "2026-00108",
        taskTitle: "Income Statement",
        section: "BSAIS 31CA",
        dateSubmitted: "",
        status: "Overdue",
        content: "",
        uploadedFiles: [],
        accountingOutputs: [],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 9,
        studentName: "Isabella Cruz",
        studentId: "2026-00109",
        taskTitle: "Chart of Accounts",
        section: "BSAIS 41CA",
        dateSubmitted: "2026-10-17",
        status: "Pending Review",
        content:
            "The accounts are grouped by their account type and arranged in the order required for the activity.",
        uploadedFiles: [
            {
                name: "Accounts_List.pdf",
                size: "180 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Chart of Accounts",
                description: "Account listing and classification",
                status: "Completed",
            },
        ],
        score: "",
        remarks: "",
        evaluationStatus: "Pending",
    },
    {
        id: 10,
        studentName: "Daniel Bautista",
        studentId: "2026-00110",
        taskTitle: "Balance Sheet",
        section: "BSAIS 41CA",
        dateSubmitted: "2026-10-13",
        status: "Reviewed",
        content:
            "The balance sheet has been prepared based on the provided account balances.",
        uploadedFiles: [
            {
                name: "Balance_Sheet.pdf",
                size: "210 KB",
                url: "",
            },
        ],
        accountingOutputs: [
            {
                name: "Balance Sheet",
                description: "Financial position report",
                status: "Completed",
            },
        ],
        score: "85",
        remarks: "Correct overall presentation. Check the equity computation.",
        evaluationStatus: "Reviewed",
    },
];

const sections = [
    "BSAIS 11CA",
    "BSAIS 21CA",
    "BSAIS 31CA",
    "BSAIS 41CA",
    "BSEN 11CE",
    "BSEN 21CE",
    "BSEN 31CE",
    "BSEN 41CE",
];

const submissionStatuses = [
    "Not Submitted",
    "Submitted",
    "Pending Review",
    "Reviewed",
    "Approved",
    "Returned for Revision",
    "Overdue",
];

const evaluationStatuses = [
    "Pending",
    "Reviewed",
    "Approved",
    "Returned for Revision",
];

const inputClass =
    "w-full rounded-xl border border-[#C9D6E4] bg-white px-3.5 py-2.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10 disabled:cursor-not-allowed disabled:bg-[#E7EDF3]";

const labelClass =
    "mb-1.5 block text-xs font-semibold text-[#526579]";

const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] shadow-sm transition-all hover:bg-[#E7EDF3] hover:text-[#243A52]";

const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#142A43] hover:shadow-md active:scale-[0.98]";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function getSubmissionId(id) {
    return `SUB-${String(id).padStart(3, "0")}`;
}

function downloadFile(file) {
    if (!file?.url) {
        window.alert(
            "This is sample file information. A real download will be available once the uploaded file is connected to the backend.",
        );
        return;
    }

    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || "submission-file";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// --------------------------------------------------
// STATUS BADGE
// --------------------------------------------------

function StatusBadge({ status }) {
    const styles = {
        "Not Submitted":
            "border-[#D7C7A8] bg-[#FAF5E9] text-[#8A6A25]",
        Submitted:
            "border-[#BFD2E5] bg-[#EEF4F9] text-[#294B70]",
        "Pending Review":
            "border-[#D7C7A8] bg-[#FAF5E9] text-[#8A6A25]",
        Reviewed:
            "border-[#BFD2E5] bg-[#EEF4F9] text-[#294B70]",
        Approved:
            "border-[#B9D9C8] bg-[#F0F8F3] text-[#267653]",
        "Returned for Revision":
            "border-[#E2BFC3] bg-[#FBEEF0] text-[#A94A55]",
        Overdue:
            "border-[#E2BFC3] bg-[#FBEEF0] text-[#A94A55]",
    };

    const dots = {
        "Not Submitted": "bg-[#B18A37]",
        Submitted: "bg-[#426B94]",
        "Pending Review": "bg-[#B18A37]",
        Reviewed: "bg-[#426B94]",
        Approved: "bg-[#31805E]",
        "Returned for Revision": "bg-[#A94A55]",
        Overdue: "bg-[#A94A55]",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                styles[status] ||
                "border-[#CBD3DC] bg-white text-[#647181]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    dots[status] || "bg-[#7C8794]"
                }`}
            />
            {status}
        </span>
    );
}

// --------------------------------------------------
// SUMMARY CARD
// Styled to match Faculty Task Management
// --------------------------------------------------

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
                    <span
                        key={index}
                        className={`w-1.5 rounded-full ${bar}`}
                    />
                ))}
            </div>

            <div
                className={`absolute bottom-0 left-0 h-1 w-full ${accentColor}`}
            />

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


// --------------------------------------------------
// SUBMISSION DETAILS AND EVALUATION MODAL
// --------------------------------------------------

function SubmissionDetailsModal({
    submission,
    onClose,
    onSaveEvaluation,
}) {
    const [score, setScore] = useState(submission?.score ?? "");
    const [remarks, setRemarks] = useState(submission?.remarks ?? "");
    const [evaluationStatus, setEvaluationStatus] = useState(
        submission?.evaluationStatus ?? "Pending",
    );

    if (!submission) return null;

    const canEvaluate = ![
        "Not Submitted",
        "Overdue",
    ].includes(submission.status);

    const details = [
        ["Student Name", submission.studentName],
        ["Student ID", submission.studentId],
        ["Section", submission.section],
        ["Task Title", submission.taskTitle],
        ["Date Submitted", formatDate(submission.dateSubmitted)],
        ["Submission ID", getSubmissionId(submission.id)],
    ];

    const handleSave = (event) => {
        event.preventDefault();

        if (score !== "" && (Number(score) < 0 || Number(score) > 100)) {
            window.alert("The score must be between 0 and 100.");
            return;
        }

        onSaveEvaluation(submission.id, {
            score,
            remarks: remarks.trim(),
            evaluationStatus,
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0C1C2D]/60 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#B8C9DA] bg-white shadow-[0_25px_70px_rgba(10,30,50,0.30)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* Modal header */}
                <div className="bg-gradient-to-br from-[#142A43] via-[#1B3553] to-[#294B70] px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white">
                                <FileCheck2 size={25} />
                            </div>

                            <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C8D8E8]">
                                    Submission Information
                                </span>

                                <h2 className="mt-1 break-words text-xl font-bold text-white">
                                    {submission.taskTitle}
                                </h2>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#D8E4EF]">
                                        {getSubmissionId(submission.id)}
                                    </span>

                                    <StatusBadge status={submission.status} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label="Close"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Modal body */}
                <div className="max-h-[70vh] overflow-y-auto bg-[#EEF2F6] px-5 py-6 sm:px-6">
                    {/* Student and task details */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1B3553]">
                            Student & Academic Details
                        </h3>

                        <p className="mb-4 mt-0.5 text-xs text-[#738396]">
                            Student information and assigned academic activity
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {details.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="min-w-0 rounded-xl border border-[#C9D6E3] bg-white px-4 py-3.5"
                                >
                                    <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#53677D]">
                                        {label}
                                    </span>

                                    <strong className="mt-1 block break-words text-sm font-semibold text-[#243A52]">
                                        {value || "—"}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Student content */}
                    <div className="mb-6 rounded-xl border border-[#C9D6E3] bg-white p-4">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={17}
                                className="text-[#294B70]"
                            />

                            <h3 className="text-sm font-bold text-[#1B3553]">
                                Submission Content
                            </h3>
                        </div>

                        {submission.content ? (
                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#526579]">
                                {submission.content}
                            </p>
                        ) : (
                            <div className="mt-3 rounded-xl border border-dashed border-[#C9D6E3] bg-[#F7F9FB] px-4 py-7 text-center">
                                <AlertCircle
                                    size={23}
                                    className="mx-auto text-[#9AA8B7]"
                                />

                                <p className="mt-2 text-sm font-semibold text-[#526579]">
                                    No submission content available
                                </p>

                                <p className="mt-1 text-xs text-[#8292A3]">
                                    The student has not submitted content for
                                    this task.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Uploaded files */}
                    <div className="mb-6 rounded-xl border border-[#C9D6E3] bg-white p-4">
                        <div className="flex items-center gap-2">
                            <Paperclip
                                size={17}
                                className="text-[#294B70]"
                            />

                            <h3 className="text-sm font-bold text-[#1B3553]">
                                Uploaded Files
                            </h3>

                            <span className="rounded-full border border-[#C9D6E3] bg-[#F5F8FB] px-2 py-0.5 text-[10px] font-bold text-[#526579]">
                                {submission.uploadedFiles?.length ?? 0}
                            </span>
                        </div>

                        {submission.uploadedFiles?.length > 0 ? (
                            <div className="mt-3 space-y-2">
                                {submission.uploadedFiles.map(
                                    (file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex flex-col gap-3 rounded-xl border border-[#C9D6E3] bg-[#F7F9FB] p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70]">
                                                    <FileText size={19} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="break-all text-sm font-semibold text-[#243A52]">
                                                        {file.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#8292A3]">
                                                        {file.size ||
                                                            "File attachment"}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    downloadFile(file)
                                                }
                                                className={buttonSecondary}
                                            >
                                                <Download size={15} />
                                                Download
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-3 rounded-xl border border-dashed border-[#C9D6E3] bg-[#F7F9FB] px-4 py-6 text-center text-sm text-[#8292A3]">
                                No uploaded files.
                            </p>
                        )}
                    </div>

                    {/* Accounting outputs */}
                    <div className="mb-6 rounded-xl border border-[#C9D6E3] bg-white p-4">
                        <div className="flex items-center gap-2">
                            <Calculator
                                size={17}
                                className="text-[#294B70]"
                            />

                            <h3 className="text-sm font-bold text-[#1B3553]">
                                Accounting Outputs
                            </h3>
                        </div>

                        {submission.accountingOutputs?.length > 0 ? (
                            <div className="mt-3 space-y-2">
                                {submission.accountingOutputs.map(
                                    (output, index) => (
                                        <div
                                            key={`${output.name}-${index}`}
                                            className="flex flex-col gap-2 rounded-xl border border-[#DCE4EC] bg-[#F7F9FB] p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9D6E3] bg-white text-[#294B70]">
                                                    <BookOpen size={17} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-[#243A52]">
                                                        {output.name}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-[#8292A3]">
                                                        {output.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#B9D9C8] bg-[#F0F8F3] px-2.5 py-1 text-[10px] font-bold text-[#267653]">
                                                <CheckCircle2 size={12} />
                                                {output.status}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-3 rounded-xl border border-dashed border-[#C9D6E3] bg-[#F7F9FB] px-4 py-6 text-center text-sm text-[#8292A3]">
                                No accounting outputs available.
                            </p>
                        )}
                    </div>

                    {/* Faculty evaluation */}
                    <form
                        id="faculty-evaluation-form"
                        onSubmit={handleSave}
                        className="overflow-hidden rounded-xl border border-[#B8C9DA] bg-white"
                    >
                        <div className="flex items-center gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-4 py-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#BFD2E5] bg-[#E2EAF2] text-[#294B70]">
                                <Award size={20} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-[#1B3553]">
                                    Faculty Evaluation
                                </h3>

                                <p className="mt-0.5 text-xs text-[#738396]">
                                    Record the student's score and feedback
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="evaluation-score"
                                    className={labelClass}
                                >
                                    Score
                                </label>

                                <div className="relative">
                                    <input
                                        id="evaluation-score"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={score}
                                        onChange={(event) =>
                                            setScore(event.target.value)
                                        }
                                        placeholder="Enter score"
                                        disabled={!canEvaluate}
                                        className={`${inputClass} pr-16`}
                                    />

                                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8292A3]">
                                        / 100
                                    </span>
                                </div>

                                <p className="mt-1.5 text-[11px] text-[#8292A3]">
                                    Enter a score from 0 to 100.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="evaluation-status"
                                    className={labelClass}
                                >
                                    Evaluation Status
                                </label>

                                <select
                                    id="evaluation-status"
                                    value={evaluationStatus}
                                    onChange={(event) =>
                                        setEvaluationStatus(event.target.value)
                                    }
                                    disabled={!canEvaluate}
                                    className={inputClass}
                                >
                                    {evaluationStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="evaluation-remarks"
                                    className={labelClass}
                                >
                                    Remarks
                                </label>

                                <textarea
                                    id="evaluation-remarks"
                                    value={remarks}
                                    onChange={(event) =>
                                        setRemarks(event.target.value)
                                    }
                                    rows={4}
                                    placeholder="Write feedback, corrections, or recommendations for the student..."
                                    disabled={!canEvaluate}
                                    className={`${inputClass} resize-y`}
                                />
                            </div>

                            {!canEvaluate && (
                                <div className="sm:col-span-2 flex items-start gap-2 rounded-xl border border-[#D7C7A8] bg-[#FAF5E9] p-3 text-xs leading-5 text-[#8A6A25]">
                                    <AlertCircle
                                        size={16}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <p>
                                        Evaluation is unavailable because this
                                        record has no submitted work. The
                                        student must submit the task before it
                                        can be evaluated.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Modal footer */}
                <div className="flex flex-col-reverse gap-2 border-t border-[#DCE4EC] bg-white px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={buttonSecondary}
                    >
                        Close
                    </button>

                    {canEvaluate && (
                        <button
                            type="submit"
                            form="faculty-evaluation-form"
                            className={buttonPrimary}
                        >
                            <Save size={16} />
                            Save Evaluation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// MAIN FACULTY SUBMISSIONS PAGE
// --------------------------------------------------

export default function FacultySubmissions() {
    const [submissions, setSubmissions] = useState(initialSubmissions);

    const [searchValue, setSearchValue] = useState("");
    const [sectionFilter, setSectionFilter] = useState("All Sections");
    const [taskFilter, setTaskFilter] = useState("All Tasks");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [studentFilter, setStudentFilter] = useState("All Students");
    const [dateFilter, setDateFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const itemsPerPage = 5;

    const taskOptions = useMemo(
        () => [...new Set(submissions.map((item) => item.taskTitle))].sort(),
        [submissions],
    );

    const studentOptions = useMemo(
        () =>
            [...new Set(submissions.map((item) => item.studentName))].sort(),
        [submissions],
    );

    // Summary counts
    const counts = useMemo(
        () => ({
            total: submissions.length,
            pending: submissions.filter((item) =>
                ["Submitted", "Pending Review"].includes(item.status),
            ).length,
            reviewed: submissions.filter((item) =>
                ["Reviewed", "Approved"].includes(item.status),
            ).length,
            overdue: submissions.filter((item) => item.status === "Overdue")
                .length,
        }),
        [submissions],
    );

    // Search and filters
    const filteredSubmissions = useMemo(() => {
        const search = searchValue.trim().toLowerCase();

        return submissions.filter((item) => {
            const matchesSearch =
                !search ||
                [
                    item.studentName,
                    item.studentId,
                    item.taskTitle,
                    item.section,
                    getSubmissionId(item.id),
                ].some((value) =>
                    String(value || "").toLowerCase().includes(search),
                );

            const matchesSection =
                sectionFilter === "All Sections" ||
                item.section === sectionFilter;

            const matchesTask =
                taskFilter === "All Tasks" ||
                item.taskTitle === taskFilter;

            const matchesStatus =
                statusFilter === "All Status" ||
                item.status === statusFilter;

            const matchesStudent =
                studentFilter === "All Students" ||
                item.studentName === studentFilter;

            const matchesDate =
                !dateFilter || item.dateSubmitted === dateFilter;

            return (
                matchesSearch &&
                matchesSection &&
                matchesTask &&
                matchesStatus &&
                matchesStudent &&
                matchesDate
            );
        });
    }, [
        submissions,
        searchValue,
        sectionFilter,
        taskFilter,
        statusFilter,
        studentFilter,
        dateFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredSubmissions.length / itemsPerPage),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedSubmissions = filteredSubmissions.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage,
    );

    const hasFilters =
        searchValue !== "" ||
        sectionFilter !== "All Sections" ||
        taskFilter !== "All Tasks" ||
        statusFilter !== "All Status" ||
        studentFilter !== "All Students" ||
        dateFilter !== "";

    const clearFilters = () => {
        setSearchValue("");
        setSectionFilter("All Sections");
        setTaskFilter("All Tasks");
        setStatusFilter("All Status");
        setStudentFilter("All Students");
        setDateFilter("");
        setCurrentPage(1);
    };

    const handleEvaluationSave = (submissionId, evaluation) => {
        const updatedSubmission = {
            ...submissions.find((item) => item.id === submissionId),
            ...evaluation,
        };

        let nextStatus = updatedSubmission.status;

        if (evaluation.evaluationStatus === "Approved") {
            nextStatus = "Approved";
        } else if (
            evaluation.evaluationStatus === "Returned for Revision"
        ) {
            nextStatus = "Returned for Revision";
        } else if (evaluation.evaluationStatus === "Reviewed") {
            nextStatus = "Reviewed";
        } else if (evaluation.evaluationStatus === "Pending") {
            nextStatus = "Pending Review";
        }

        setSubmissions((previous) =>
            previous.map((item) =>
                item.id === submissionId
                    ? {
                          ...item,
                          ...evaluation,
                          status: nextStatus,
                      }
                    : item,
            ),
        );

        setSelectedSubmission(null);
    };

    return (
        <FacultyLayout
            activeMenu="Submissions"
            showPageInfo={false}
            showSearch={false}
        >
            <div className="mx-auto w-full max-w-[1600px]">
                {/* Page header */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#294B70]">
                            Academic Management
                        </span>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                            Submissions
                        </h1>

                        <p className="mt-1 text-sm text-[#738396]">
                            Review student submissions, evaluate accounting
                            outputs, and provide feedback.
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Submissions"
                        value={counts.total}
                        description="All submission records"
                        icon={ClipboardList}
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
                        title="Pending Review"
                        value={counts.pending}
                        description="Awaiting faculty review"
                        icon={Clock}
                        gradient="from-[#FAF0D9] via-[#FCF7EB] to-white"
                        borderColor="border-[#D7C7A8]"
                        accentColor="bg-[#B18A37]/30"
                        iconBackground="bg-[#8A6A25]"
                        bars={[
                            "h-3 bg-[#E5D5AD]",
                            "h-5 bg-[#D3BB7F]",
                            "h-7 bg-[#B18A37]",
                            "h-9 bg-[#8A6A25]",
                        ]}
                    />

                    <SummaryCard
                        title="Reviewed"
                        value={counts.reviewed}
                        description="Reviewed or approved"
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
                        title="Overdue"
                        value={counts.overdue}
                        description="Late submission deadline"
                        icon={AlertCircle}
                        gradient="from-[#F6E5E7] via-[#FBF0F1] to-white"
                        borderColor="border-[#E2BFC3]"
                        accentColor="bg-[#A94A55]/25"
                        iconBackground="bg-[#A94A55]"
                        bars={[
                            "h-4 bg-[#E2BFC3]",
                            "h-7 bg-[#D59CA3]",
                            "h-5 bg-[#C46F79]",
                            "h-9 bg-[#A94A55]",
                        ]}
                    />
                </div>

                {/* Submission list */}
                <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                    {/* Section heading */}
                    <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#1B3553]">
                                Submission List
                            </h2>

                            <p className="mt-0.5 text-xs text-[#738396]">
                                View submissions and manage faculty
                                evaluations
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-white px-3 py-1.5 text-xs font-semibold text-[#526579]">
                            <ClipboardList size={14} />
                            {filteredSubmissions.length}{" "}
                            {filteredSubmissions.length === 1
                                ? "record"
                                : "records"}
                        </span>
                    </div>

                    {/* Search and filters */}
                    <div className="border-b border-[#DCE4EC] bg-[#F7F9FB] px-5 py-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {/* Search */}
                            <div className="relative min-w-0 xl:col-span-3">
                                <Search
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
                                />

                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(event) => {
                                        setSearchValue(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search student name, student ID, task, or section..."
                                    className="w-full rounded-xl border border-[#C9D6E4] bg-white py-2.5 pl-10 pr-4 text-sm text-[#243A52] outline-none placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10"
                                />
                            </div>

                            {/* Section filter */}
                            <div>
                                <label
                                    htmlFor="filter-section"
                                    className={labelClass}
                                >
                                    Section
                                </label>

                                <select
                                    id="filter-section"
                                    value={sectionFilter}
                                    onChange={(event) => {
                                        setSectionFilter(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={inputClass}
                                >
                                    <option value="All Sections">
                                        All Sections
                                    </option>

                                    {sections.map((section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Task filter */}
                            <div>
                                <label
                                    htmlFor="filter-task"
                                    className={labelClass}
                                >
                                    Task
                                </label>

                                <select
                                    id="filter-task"
                                    value={taskFilter}
                                    onChange={(event) => {
                                        setTaskFilter(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={inputClass}
                                >
                                    <option value="All Tasks">All Tasks</option>

                                    {taskOptions.map((task) => (
                                        <option key={task} value={task}>
                                            {task}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status filter */}
                            <div>
                                <label
                                    htmlFor="filter-status"
                                    className={labelClass}
                                >
                                    Status
                                </label>

                                <select
                                    id="filter-status"
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setStatusFilter(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={inputClass}
                                >
                                    <option value="All Status">
                                        All Status
                                    </option>

                                    {submissionStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Student filter */}
                            <div>
                                <label
                                    htmlFor="filter-student"
                                    className={labelClass}
                                >
                                    Student
                                </label>

                                <select
                                    id="filter-student"
                                    value={studentFilter}
                                    onChange={(event) => {
                                        setStudentFilter(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={inputClass}
                                >
                                    <option value="All Students">
                                        All Students
                                    </option>

                                    {studentOptions.map((student) => (
                                        <option key={student} value={student}>
                                            {student}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date submitted filter */}
                            <div>
                                <label
                                    htmlFor="filter-date"
                                    className={labelClass}
                                >
                                    Date Submitted
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={16}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
                                    />

                                    <input
                                        id="filter-date"
                                        type="date"
                                        value={dateFilter}
                                        onChange={(event) => {
                                            setDateFilter(event.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            {/* Clear filters */}
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    disabled={!hasFilters}
                                    className={`${buttonSecondary} w-full disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    <RotateCcw size={15} />
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submission table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1050px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#C9D6E3] bg-[#E7EDF3]">
                                    {[
                                        "Student Name",
                                        "Task Title",
                                        "Section",
                                        "Date Submitted",
                                        "Status",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#53677D]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E5EBF1]">
                                {paginatedSubmissions.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className="group transition-colors hover:bg-[#F7F9FC]"
                                    >
                                        {/* Student */}
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-[#EEF4F9] text-xs font-bold text-[#294B70]">
                                                    {getInitials(
                                                        submission.studentName,
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="max-w-[220px] truncate text-sm font-semibold text-[#243A52]">
                                                        {submission.studentName}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-[#8292A3]">
                                                        {submission.studentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Task */}
                                        <td className="px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9D6E3] bg-[#EEF4F9] text-[#294B70]">
                                                    <BookOpen size={16} />
                                                </div>

                                                <span className="max-w-[230px] text-sm font-semibold text-[#243A52]">
                                                    {submission.taskTitle}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Section */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex whitespace-nowrap rounded-lg border border-[#D5DFE9] bg-[#F5F8FB] px-2.5 py-1.5 text-xs font-semibold text-[#526579]">
                                                {submission.section}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap text-sm text-[#526579]">
                                                <CalendarDays
                                                    size={15}
                                                    className="shrink-0 text-[#8292A3]"
                                                />

                                                {formatDate(
                                                    submission.dateSubmitted,
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                status={submission.status}
                                            />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                title="View submission details"
                                                aria-label={`View submission from ${submission.studentName}`}
                                                onClick={() =>
                                                    setSelectedSubmission(
                                                        submission,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#BFCFDF] bg-[#E6EDF4] text-[#1B3553] transition-all duration-200 hover:border-[#91A9C0] hover:bg-[#D5E1EC] hover:text-[#142A43]"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Empty state */}
                                {paginatedSubmissions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
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
                                                    ? "No matching submissions found"
                                                    : "No submissions available"}
                                            </h3>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#8292A3]">
                                                {hasFilters
                                                    ? "Try changing your search or filters to find a submission."
                                                    : "Student submission records will appear here."}
                                            </p>

                                            {hasFilters && (
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#294B70] hover:text-[#1B3553]"
                                                >
                                                    <RotateCcw size={14} />
                                                    Clear filters
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-[#DCE4EC] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[#738396]">
                            Showing{" "}
                            <strong className="font-semibold text-[#243A52]">
                                {filteredSubmissions.length === 0
                                    ? 0
                                    : (safePage - 1) * itemsPerPage + 1}
                            </strong>{" "}
                            to{" "}
                            <strong className="font-semibold text-[#243A52]">
                                {Math.min(
                                    safePage * itemsPerPage,
                                    filteredSubmissions.length,
                                )}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-[#243A52]">
                                {filteredSubmissions.length}
                            </strong>{" "}
                            submissions
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
                                            ? "border-[#1B3553] bg-[#1B3553] text-white shadow-sm"
                                            : "border-[#C9D6E3] bg-white text-[#526579] hover:bg-[#EEF4F9]"
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

            {/* Submission details and evaluation modal */}
            {selectedSubmission && (
                <SubmissionDetailsModal
                    key={selectedSubmission.id}
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onSaveEvaluation={handleEvaluationSave}
                />
            )}
        </FacultyLayout>
    );
}
