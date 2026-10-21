
import { useRef, useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    CalendarDays,
    Clock,
    ShieldCheck,
    LockKeyhole,
    Camera,
    Eye,
    EyeOff,
    Save,
    BookOpen,
    Pencil,
    CheckCircle2,
    AlertCircle,
    AtSign,
    Building2,
    ImagePlus,
} from "lucide-react";

import FacultyLayout from "../components/layout/facultyLayout";

const initialFacultyData = {
    facultyId: "FAC-001",
    name: "Cai Soriano",
    email: "cai.soriano@example.com",
    contactNo: "09123456789",
    specialization: "Accounting",
    address: "Malolos, Bulacan",
    username: "cai.soriano",
    role: "Faculty Member",
    status: "Active",
    dateRegistered: "July 27, 2026",
    lastLogin: "October 19, 2026",
    assignedSections: ["BSAIS 11CA", "BSAIS 21CA"],
};

const inputClass =
    "w-full rounded-xl border border-[#C9D6E3] bg-white px-3.5 py-2.5 text-sm text-[#243A52] outline-none transition-all placeholder:text-[#9AA8B7] focus:border-[#294B70] focus:ring-2 focus:ring-[#294B70]/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#526579]";

const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3553] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#142A43] hover:shadow-md active:scale-[0.98]";

const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526579] shadow-sm transition-all hover:bg-[#E7EDF3] hover:text-[#243A52]";

function SectionCard({ title, description, icon: Icon, children, action }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
            <div className="flex flex-col gap-3 border-b border-[#C9D6E3] bg-gradient-to-r from-[#F8FAFC] to-[#EEF3F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70] shadow-sm">
                        <Icon size={19} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-[#1B3553]">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-0.5 text-xs text-[#738396]">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {action}
            </div>

            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

function EditableField({
    label,
    value,
    onChange,
    icon: Icon,
    type = "text",
    placeholder,
    required = false,
}) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>
                {label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
                    />
                )}

                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    required={required}
                    className={`${inputClass} ${Icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

function ReadOnlyField({ label, value, icon: Icon, badge = false }) {
    return (
        <div className="min-w-0">
            <p className={labelClass}>{label}</p>

            <div className="flex min-h-[43px] items-center gap-3 rounded-xl border border-[#D8E1EA] bg-[#F3F6F9] px-3.5 py-2.5">
                {Icon && (
                    <Icon size={16} className="shrink-0 text-[#71859A]" />
                )}

                {badge ? (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {value}
                    </span>
                ) : (
                    <p className="break-words text-sm font-medium text-[#526579]">
                        {value || "Not provided"}
                    </p>
                )}
            </div>
        </div>
    );
}

function PasswordField({ label, value, onChange, autoComplete }) {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <label className={labelClass}>{label}</label>

            <div className="relative">
                <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
                />

                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete}
                    required
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`${inputClass} pl-10 pr-11`}
                />

                <button
                    type="button"
                    onClick={() => setVisible((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8292A3] transition hover:text-[#294B70]"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
        </div>
    );
}

export default function MyAccount() {
    const [faculty, setFaculty] = useState(initialFacultyData);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordMessageType, setPasswordMessageType] = useState("error");

    const fileInputRef = useRef(null);

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const updateFacultyField = (field, value) => {
        setFaculty((previous) => ({
            ...previous,
            [field]: value,
        }));

        setProfileMessage("");
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setProfileMessage("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setProfileMessage("Please choose an image smaller than 5 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setAvatarPreview(reader.result);
            setProfileMessage("");
        };

        reader.onerror = () => {
            setProfileMessage("Unable to read this image. Please try again.");
        };

        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();

        setProfileMessage(
            "Your changes are displayed in this session. Connect this form to your Laravel update endpoint to save them permanently."
        );
    };

    const updatePasswordField = (field, value) => {
        setPasswords((previous) => ({
            ...previous,
            [field]: value,
        }));

        setPasswordMessage("");
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            setPasswordMessage("Please complete all password fields.");
            setPasswordMessageType("error");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setPasswordMessage(
                "Your new password must contain at least 8 characters."
            );
            setPasswordMessageType("error");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMessage(
                "The new password and confirmation do not match."
            );
            setPasswordMessageType("error");
            return;
        }

        setPasswordMessage(
            "Password validation passed. Connect this form to your Laravel password update endpoint to change your actual password."
        );
        setPasswordMessageType("info");
    };

    const getInitials = (name) =>
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");

    return (
        <FacultyLayout
            activeMenu="My Account"
            showPageInfo={false}
            showSearch={false}
        >
            <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8">
                {/* Page Heading */}
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#294B70]">
                        <UserRound size={13} />
                        Faculty Profile
                    </div>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#1B3553] sm:text-3xl">
                                My Account
                            </h1>
                            <p className="mt-1 text-sm text-[#738396]">
                                Manage your personal details, account
                                information, and security settings.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#C9D6E3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#526579] shadow-sm">
                            <ShieldCheck size={16} className="text-[#294B70]" />
                            Secure Faculty Account
                        </div>
                    </div>
                </div>

                {/* Profile Overview and ACCENTRA Cover */}
                <section className="overflow-hidden rounded-2xl border border-[#C9D6E3] bg-white shadow-[0_5px_20px_rgba(27,53,83,0.06)]">
                  {/* Profile Cover - Centered ACCENTRA Branding */}
<div className="flex h-36 items-center justify-center bg-gradient-to-r from-[#142A43] via-[#1B3553] to-[#36534E] px-5 text-center sm:h-44">
    <div>
        <h2 className="text-3xl font-extrabold tracking-[0.12em] text-white sm:text-4xl">
            Accentra
        </h2>

        <p className="mt-2 text-sm font-medium tracking-wide text-white/80 sm:text-base">
            Accounting System
        </p>
    </div>
</div>

                    <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="-mt-14 flex min-w-0 flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                                {/* Circular Avatar */}
                                <div className="relative h-28 w-28 shrink-0 self-start sm:h-32 sm:w-32">
                                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#E2EAF2] text-3xl font-bold text-[#294B70] shadow-[0_4px_16px_rgba(27,53,83,0.15)] sm:text-4xl">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Faculty profile"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(faculty.name)
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#1B3553] text-white shadow-md transition hover:bg-[#294B70]"
                                        title="Change profile photo"
                                        aria-label="Change profile photo"
                                    >
                                        <Camera size={15} />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="min-w-0 pb-1">
                                    <h2 className="break-words text-xl font-bold tracking-tight text-[#1B3553] sm:text-2xl">
                                        {faculty.name || "Faculty Name"}
                                    </h2>

                                    <p className="mt-1 break-all text-sm text-[#738396]">
                                        {faculty.email}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9D6E3] bg-[#EEF2F6] px-3 py-1 text-xs font-semibold text-[#294B70]">
                                            <ShieldCheck size={13} />
                                            {faculty.facultyId}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {faculty.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("personal-information")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        })
                                }
                                className={`${buttonSecondary} w-full sm:w-auto`}
                            >
                                <Pencil size={15} />
                                Edit Profile
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E5EBF1] pt-5 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-xl border border-[#DCE5ED] bg-[#F8FAFC] p-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E2EAF2] text-[#294B70]">
                                    <GraduationCap size={19} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8292A3]">
                                        Specialization
                                    </p>
                                    <p className="mt-1 truncate text-sm font-bold text-[#1B3553]">
                                        {faculty.specialization || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-[#DCE5ED] bg-[#F8FAFC] p-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E2EAF2] text-[#294B70]">
                                    <BookOpen size={19} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8292A3]">
                                        Assigned Sections
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-[#1B3553]">
                                        {faculty.assignedSections.length} Sections
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-[#DCE5ED] bg-[#F8FAFC] p-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E2EAF2] text-[#294B70]">
                                    <CalendarDays size={19} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8292A3]">
                                        Member Since
                                    </p>
                                    <p className="mt-1 truncate text-sm font-bold text-[#1B3553]">
                                        {faculty.dateRegistered}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 flex items-center gap-2 text-xs text-[#8292A3]">
                            <ImagePlus size={14} />
                            Click the camera icon to select a profile photo.
                            Maximum file size: 5 MB.
                        </p>
                    </div>
                </section>

                {/* Personal Information */}
                <div id="personal-information" className="scroll-mt-6">
                    <SectionCard
                        title="Personal Information"
                        description="Update your personal and contact details."
                        icon={UserRound}
                        action={
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#BFD2E5] bg-[#E2EAF2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#294B70]">
                                <Pencil size={11} />
                                Editable
                            </span>
                        }
                    >
                        <form onSubmit={handleProfileSubmit}>
                            <div className="mb-5 rounded-xl border border-[#D8E4EF] bg-[#F5F8FB] p-3.5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#294B70] shadow-sm">
                                        <ShieldCheck size={17} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#294B70]">
                                            Faculty ID is protected
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-[#738396]">
                                            Your Faculty ID cannot be edited.
                                            Contact your administrator if it
                                            needs to be corrected.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className={labelClass}>
                                        Faculty ID
                                    </label>
                                    <div className="relative">
                                        <ShieldCheck
                                            size={16}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8292A3]"
                                        />
                                        <input
                                            type="text"
                                            value={faculty.facultyId}
                                            readOnly
                                            disabled
                                            className={`${inputClass} cursor-not-allowed border-[#D8E1EA] bg-[#F3F6F9] pl-10 text-[#738396]`}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-[#8292A3]">
                                        Read-only field
                                    </p>
                                </div>

                                <EditableField
                                    label="Full Name"
                                    value={faculty.name}
                                    onChange={(value) =>
                                        updateFacultyField("name", value)
                                    }
                                    icon={UserRound}
                                    placeholder="Enter your full name"
                                    required
                                />

                                <EditableField
                                    label="Email Address"
                                    value={faculty.email}
                                    onChange={(value) =>
                                        updateFacultyField("email", value)
                                    }
                                    icon={Mail}
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                />

                                <EditableField
                                    label="Contact Number"
                                    value={faculty.contactNo}
                                    onChange={(value) =>
                                        updateFacultyField("contactNo", value)
                                    }
                                    icon={Phone}
                                    type="tel"
                                    placeholder="Enter contact number"
                                    required
                                />

                                <EditableField
                                    label="Specialization"
                                    value={faculty.specialization}
                                    onChange={(value) =>
                                        updateFacultyField(
                                            "specialization",
                                            value
                                        )
                                    }
                                    icon={GraduationCap}
                                    placeholder="Enter specialization"
                                    required
                                />

                                <EditableField
                                    label="Address"
                                    value={faculty.address}
                                    onChange={(value) =>
                                        updateFacultyField("address", value)
                                    }
                                    icon={MapPin}
                                    placeholder="Enter your address"
                                    required
                                />
                            </div>

                            {profileMessage && (
                                <div
                                    role="status"
                                    className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                                >
                                    <AlertCircle
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <p>{profileMessage}</p>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E5EBF1] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-[#8292A3]">
                                    Fields marked with * are required.
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFaculty((previous) => ({
                                                ...previous,
                                                name: initialFacultyData.name,
                                                email: initialFacultyData.email,
                                                contactNo: initialFacultyData.contactNo,
                                                specialization: initialFacultyData.specialization,
                                                address: initialFacultyData.address,
                                            }));
                                            setProfileMessage("");
                                        }}
                                        className={buttonSecondary}
                                    >
                                        Reset Details
                                    </button>

                                    <button
                                        type="submit"
                                        className={buttonPrimary}
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </SectionCard>
                </div>

                {/* Account Information */}
                <SectionCard
                    title="Account Information"
                    description="Review your account credentials and faculty assignments."
                    icon={ShieldCheck}
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                        <ReadOnlyField
                            label="Username"
                            value={faculty.username}
                            icon={AtSign}
                        />

                        <ReadOnlyField
                            label="Account Role"
                            value={faculty.role}
                            icon={ShieldCheck}
                        />

                        <ReadOnlyField
                            label="Account Status"
                            value={faculty.status}
                            icon={CheckCircle2}
                            badge
                        />

                        <ReadOnlyField
                            label="Date Registered"
                            value={faculty.dateRegistered}
                            icon={CalendarDays}
                        />

                        <ReadOnlyField
                            label="Last Login"
                            value={faculty.lastLogin}
                            icon={Clock}
                        />

                        <ReadOnlyField
                            label="Account Type"
                            value="Faculty Account"
                            icon={Building2}
                        />
                    </div>

                    <div className="mt-6 border-t border-[#E5EBF1] pt-5">
                        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-sm font-bold text-[#1B3553]">
                                Assigned Sections
                            </h3>
                            <span className="text-xs text-[#8292A3]">
                                {faculty.assignedSections.length} assigned
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {faculty.assignedSections.map((section) => (
                                <div
                                    key={section}
                                    className="flex items-center gap-3 rounded-xl border border-[#C9D6E3] bg-[#F8FAFC] p-4 transition hover:border-[#AFC2D6] hover:bg-[#F1F5F9]"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D6E3] bg-white text-[#294B70]">
                                        <BookOpen size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-[#1B3553]">
                                            {section}
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#738396]">
                                            Assigned section
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-[#8292A3]">
                        Account credentials and section assignments are
                        displayed in view-only mode.
                    </p>
                </SectionCard>

                {/* Change Password */}
                <SectionCard
                    title="Change Password"
                    description="Keep your account secure by using a strong password."
                    icon={LockKeyhole}
                >
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#D8E4EF] bg-[#F5F8FB] p-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#294B70] shadow-sm">
                                <LockKeyhole size={17} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#294B70]">
                                    Password security
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-[#738396]">
                                    Choose a password with at least 8
                                    characters. Do not share your password with
                                    anyone.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <PasswordField
                                label="Current Password"
                                value={passwords.oldPassword}
                                onChange={(value) =>
                                    updatePasswordField("oldPassword", value)
                                }
                                autoComplete="current-password"
                            />

                            <PasswordField
                                label="New Password"
                                value={passwords.newPassword}
                                onChange={(value) =>
                                    updatePasswordField("newPassword", value)
                                }
                                autoComplete="new-password"
                            />

                            <PasswordField
                                label="Confirm New Password"
                                value={passwords.confirmPassword}
                                onChange={(value) =>
                                    updatePasswordField("confirmPassword", value)
                                }
                                autoComplete="new-password"
                            />
                        </div>

                        <p className="mt-3 text-xs text-[#8292A3]">
                            Your new password must contain at least 8
                            characters and match the confirmation field.
                        </p>

                        {passwordMessage && (
                            <div
                                role="status"
                                className={`mt-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                                    passwordMessageType === "error"
                                        ? "border-rose-200 bg-rose-50 text-rose-700"
                                        : "border-[#BFD2E5] bg-[#EEF4F9] text-[#294B70]"
                                }`}
                            >
                                {passwordMessageType === "error" ? (
                                    <AlertCircle
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                    />
                                ) : (
                                    <ShieldCheck
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                    />
                                )}
                                <p>{passwordMessage}</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end border-t border-[#E5EBF1] pt-5">
                            <button type="submit" className={buttonPrimary}>
                                <Save size={16} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </SectionCard>

                {/* Account Notice */}
                <div className="flex items-start gap-2 rounded-xl border border-[#DCE5ED] bg-[#F8FAFC] px-4 py-3 text-xs leading-relaxed text-[#738396]">
                    <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-[#294B70]"
                    />
                    <p>
                        <span className="font-semibold text-[#526579]">
                            Account privacy:
                        </span>{" "}
                        This page currently uses sample faculty information.
                        Profile changes and photo previews are held in the
                        current page session; password validation does not
                        change the actual password until the Laravel backend
                        endpoint is connected.
                    </p>
                </div>
            </div>
        </FacultyLayout>
    );
}
