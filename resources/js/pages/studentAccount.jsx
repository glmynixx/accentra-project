
import { useRef, useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    GraduationCap,
    School,
    BookOpen,
    CalendarDays,
    Clock,
    ShieldCheck,
    LockKeyhole,
    Camera,
    Eye,
    EyeOff,
    Save,
    Pencil,
    CheckCircle2,
    AlertCircle,
    Building2,
    IdCard,
    MapPin,
} from "lucide-react";
import StudentLayout from "../components/layout/studentLayout";

const initialStudentData = {
    studentId: "STD-001",
    fullName: "Kent Arby Alcantara",
    email: "kentarby@accentra.com",
    contactNo: "09972312772",
    program: "BS Accounting Information Systems",
    school: "ACLC College of Malolos",
    section: "BSAIS 11CA",
    role: "Student",
    status: "Active",
    lastLogin: "Not available",
    lastLoginLocation: "Not available",
};

const panelClass =
    "min-w-0 overflow-hidden rounded-2xl border border-white/[0.13] bg-gradient-to-br from-white/[0.105] to-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-[22px] transition-all duration-300 hover:border-[#A9E5D2]/20";

const inputClass =
    "w-full rounded-xl border border-white/[0.10] bg-[#071522]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#A9E5D2]/45 focus:ring-4 focus:ring-[#A9E5D2]/[0.07] disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300";

const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#A9E5D2] px-4 py-2.5 text-sm font-semibold text-[#102B2B] shadow-[0_5px_20px_rgba(169,229,210,0.10)] transition duration-200 hover:bg-[#C1F1E2] disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.045] px-4 py-2.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-[#A9E5D2]/30 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

function SectionCard({
    icon: Icon,
    title,
    description,
    action,
    children,
}) {
    return (
        <section className={panelClass}>
            <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.08] text-[#A9E5D2]">
                        <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-white">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
    icon: Icon,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
    disabled = false,
}) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>
                {label}
                {required && (
                    <span className="ml-1 text-rose-400">*</span>
                )}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-slate-500"
                    />
                )}

                <input
                    type={type}
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${inputClass} ${Icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

function ReadOnlyField({ label, icon: Icon, value }) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>{label}</label>

            <div className="flex min-h-[46px] items-center gap-3 rounded-xl border border-white/[0.07] bg-[#071522]/55 px-3.5 py-3">
                {Icon && (
                    <Icon
                        size={16}
                        className="shrink-0 text-slate-500"
                    />
                )}

                <span className="break-words text-sm text-slate-300">
                    {value || "—"}
                </span>
            </div>
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
    autoComplete,
}) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>{label}</label>

            <div className="relative">
                <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-500"
                />

                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className={`${inputClass} pl-10 pr-12`}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-[#A9E5D2]"
                >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
        </div>
    );
}

function StudentAccount() {
    const [student, setStudent] = useState(initialStudentData);
    const [originalStudent, setOriginalStudent] = useState(initialStudentData);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileMessageType, setProfileMessageType] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordMessageType, setPasswordMessageType] = useState("");

    const fileInputRef = useRef(null);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const getInitials = (name) =>
        (name || "Student")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

    const updateStudentField = (field, value) => {
        setStudent((prev) => ({
            ...prev,
            [field]: value,
        }));

        setProfileMessage("");
        setProfileMessageType("");
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setProfileMessageType("error");
            setProfileMessage("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setProfileMessageType("error");
            setProfileMessage("Image size must not exceed 5MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatarPreview(reader.result);
            setProfileMessage("");
            setProfileMessageType("");
        };

        reader.readAsDataURL(file);
    };

    const startEditing = () => {
        setOriginalStudent({ ...student });
        setIsEditing(true);
        setProfileMessage("");
        setProfileMessageType("");
    };

    const handleProfileReset = () => {
        setStudent({ ...originalStudent });
        setIsEditing(false);
        setProfileMessage("");
        setProfileMessageType("");
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();

        if (!student.fullName.trim() || !student.email.trim()) {
            setProfileMessageType("error");
            setProfileMessage("Full Name and Email Address are required.");
            return;
        }

      
        setProfileMessageType("info");
        setProfileMessage(
            "Your profile has been updated successfully."
        );
    };

    const updatePasswordField = (field, value) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));

        setPasswordMessage("");
        setPasswordMessageType("");
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            setPasswordMessageType("error");
            setPasswordMessage("Please complete all password fields.");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setPasswordMessageType("error");
            setPasswordMessage(
                "Your new password must be at least 8 characters long."
            );
            return;
        }

        if (passwords.newPassword === passwords.currentPassword) {
            setPasswordMessageType("error");
            setPasswordMessage(
                "Your new password must be different from your current password."
            );
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMessageType("error");
            setPasswordMessage("Your new passwords do not match.");
            return;
        }

    
        setPasswordMessageType("info");
        setPasswordMessage(
            "Your password has been changed successfully. Please use your new password the next time you log in."
        );
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const scrollToInformation = () => {
        document
            .getElementById("account-information")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };

    const messageClass =
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm";

    const messageStyle = {
        success:
            "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
        error: "border-rose-400/20 bg-rose-400/[0.07] text-rose-300",
        info: "border-sky-400/20 bg-sky-400/[0.07] text-sky-200",
    };

    const MessageIcon =
        profileMessageType === "success"
            ? CheckCircle2
            : profileMessageType === "error"
              ? AlertCircle
              : AlertCircle;

    const PasswordMessageIcon =
        passwordMessageType === "success"
            ? CheckCircle2
            : AlertCircle;

    return (
        <StudentLayout
            showPageInfo={false}
            showSearch={false}
            activeMenu="My Account"
        >
            <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-8 text-white">
                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A9E5D2]">
                            Student Workspace
                        </span>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            My Account
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                            Manage your student profile, review your account
                            information, and maintain your account security.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2.5 text-xs font-medium text-emerald-300">
                        <ShieldCheck size={16} />
                        Secure Student Account
                    </div>
                </div>

                {/* Profile card */}
                <section className={panelClass}>
                    <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#1B4B4A]/55 via-[#163345]/65 to-[#101D30]/80 px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
                        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-[#A9E5D2]/[0.08] blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-teal-500/[0.08] blur-3xl" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="relative w-fit shrink-0">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#A9E5D2]/35 bg-[#071522] text-2xl font-bold text-[#A9E5D2] shadow-[0_12px_35px_rgba(0,0,0,0.30)] sm:h-28 sm:w-28 sm:text-3xl">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Student profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getInitials(student.fullName)
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        aria-label="Change profile picture"
                                        className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border border-[#A9E5D2]/30 bg-[#A9E5D2] text-[#102B2B] shadow-lg transition hover:scale-105 hover:bg-[#C1F1E2]"
                                    >
                                        <Camera size={17} />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A9E5D2]/80">
                                        Student Profile
                                    </p>

                                    <h2 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        {student.fullName}
                                    </h2>

                                    <p className="mt-2 flex min-w-0 items-center gap-2 break-all text-sm text-slate-300">
                                        <Mail
                                            size={15}
                                            className="shrink-0 text-[#A9E5D2]"
                                        />
                                        {student.email || "No email provided"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="rounded-lg border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-200">
                                            {student.studentId}
                                        </span>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                                student.status === "Active"
                                                    ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                                                    : "border-rose-400/20 bg-rose-400/[0.08] text-rose-300"
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    student.status === "Active"
                                                        ? "bg-emerald-400"
                                                        : "bg-rose-400"
                                                }`}
                                            />
                                            {student.status}
                                        </span>

                                        <span className="rounded-lg border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.06] px-2.5 py-1 text-xs font-medium text-[#A9E5D2]">
                                            {student.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                        <div className="flex items-center gap-3 p-5 sm:px-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#A9E5D2]/[0.07] text-[#A9E5D2]">
                                <GraduationCap size={19} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                    Program
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                    {student.program || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-5 sm:px-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.07] text-sky-300">
                                <School size={19} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                    School
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                    {student.school || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-5 sm:px-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.07] text-violet-300">
                                <BookOpen size={19} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                    Section
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                    {student.section || "Not assigned"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-5 sm:px-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
                                <ShieldCheck size={19} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                    Account Status
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    {student.status}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account information */}
                <div id="account-information" className="scroll-mt-6">
                    <SectionCard
                        icon={UserRound}
                        title="Account Information"
                        description="Review and manage your personal and academic details."
                        action={
                            !isEditing ? (
                                <button
                                    type="button"
                                    onClick={startEditing}
                                    className={buttonSecondary}
                                >
                                    <Pencil size={15} />
                                    Edit Profile
                                </button>
                            ) : (
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-2.5 py-1.5 text-xs font-semibold text-[#A9E5D2]">
                                    <Pencil size={13} />
                                    Editing
                                </span>
                            )
                        }
                    >
                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <EditableField
                                    label="Full Name"
                                    icon={UserRound}
                                    value={student.fullName}
                                    onChange={(e) =>
                                        updateStudentField(
                                            "fullName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your full name"
                                    required
                                    disabled={!isEditing}
                                />

                                <EditableField
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    value={student.email}
                                    onChange={(e) =>
                                        updateStudentField(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email address"
                                    required
                                    disabled={!isEditing}
                                />

                                <EditableField
                                    label="Contact Number"
                                    icon={Phone}
                                    value={student.contactNo}
                                    onChange={(e) =>
                                        updateStudentField(
                                            "contactNo",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your contact number"
                                    disabled={!isEditing}
                                />

                                <ReadOnlyField
                                    label="Student ID"
                                    icon={IdCard}
                                    value={student.studentId}
                                />

                                <ReadOnlyField
                                    label="Program"
                                    icon={GraduationCap}
                                    value={student.program}
                                />

                                <ReadOnlyField
                                    label="School"
                                    icon={School}
                                    value={student.school}
                                />

                                <ReadOnlyField
                                    label="Section"
                                    icon={BookOpen}
                                    value={student.section}
                                />

                                <ReadOnlyField
                                    label="Account Role"
                                    icon={ShieldCheck}
                                    value={student.role}
                                />
                            </div>

                            {profileMessage && (
                                <div
                                    role="status"
                                    className={`${messageClass} ${
                                        messageStyle[profileMessageType] ||
                                        messageStyle.info
                                    }`}
                                >
                                    <MessageIcon
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <span>{profileMessage}</span>
                                </div>
                            )}

                            {isEditing && (
                                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={handleProfileReset}
                                        className={buttonSecondary}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className={buttonPrimary}
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </SectionCard>
                </div>

                {/* Change password */}
                <SectionCard
                    icon={LockKeyhole}
                    title="Change Password"
                    description="Use a strong password to help protect your account."
                    action={
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                            <ShieldCheck size={12} />
                            Security
                        </span>
                    }
                >
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <PasswordField
                                label="Current Password"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    updatePasswordField(
                                        "currentPassword",
                                        e.target.value
                                    )
                                }
                                show={showPasswords.currentPassword}
                                onToggle={() =>
                                    togglePasswordVisibility("currentPassword")
                                }
                                placeholder="Enter current password"
                                autoComplete="current-password"
                            />

                            <div className="hidden md:block" />

                            <PasswordField
                                label="New Password"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    updatePasswordField(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                                show={showPasswords.newPassword}
                                onToggle={() =>
                                    togglePasswordVisibility("newPassword")
                                }
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />

                            <PasswordField
                                label="Confirm New Password"
                                value={passwords.confirmPassword}
                                onChange={(e) =>
                                    updatePasswordField(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                                show={showPasswords.confirmPassword}
                                onToggle={() =>
                                    togglePasswordVisibility("confirmPassword")
                                }
                                placeholder="Re-enter new password"
                                autoComplete="new-password"
                            />
                        </div>

                                
                        {passwordMessage && (
                            <div
                                role="status"
                                className={`${messageClass} ${
                                    messageStyle[passwordMessageType] ||
                                    messageStyle.info
                                }`}
                            >
                                <PasswordMessageIcon
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{passwordMessage}</span>
                            </div>
                        )}

                        <div className="flex justify-end border-t border-white/[0.08] pt-5">
                            <button
                                type="submit"
                                className={buttonPrimary}
                            >
                                <LockKeyhole size={16} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </SectionCard>

                {/* Account security */}
                <SectionCard
                    icon={ShieldCheck}
                    title="Account Security"
                    description="Review your account status and available sign-in information."
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <ReadOnlyField
                            label="Account Status"
                            icon={CheckCircle2}
                            value={student.status}
                        />

                        <ReadOnlyField
                            label="Last Login"
                            icon={Clock}
                            value={student.lastLogin}
                        />

                        <ReadOnlyField
                            label="Login Location"
                            icon={MapPin}
                            value={student.lastLoginLocation}
                        />

                        <ReadOnlyField
                            label="Account Type"
                            icon={Building2}
                            value="Student Account"
                        />
                    </div>

                </SectionCard>
            </div>
        </StudentLayout>
    );
}

export default StudentAccount;
