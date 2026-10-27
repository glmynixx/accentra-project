import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import { Head, router, usePage } from "@inertiajs/react";
import {
    Settings,
    Pencil,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    ImagePlus,
    X,
    Save,
    Eye,
    LayoutDashboard,
    type LucideIcon,
} from "lucide-react";

import SettingsLayout, {
    settingsCardClass,
    settingsInputClass,
    settingsButtonClass,
} from "../components/layout/settingsLayout";

const SAMPLE_LOGO = "/favicon.svg";

const initialSettings = {
    systemName: "ACCENTRA",
    schoolName: "ACLC COLLEGE OF MALOLOS",
    schoolAddress: "Malolos, Bulacan, Philippines",
    contactNumber: "09952138871",
    emailAddress: "aclcadmin@accentra.edu",
    website: "https://www.accentra.edu.ph",
};

type GeneralSettingsValues = typeof initialSettings;
type GeneralSettingsPageProps = {
    generalSettings: GeneralSettingsValues & {
        logoUrl: string | null;
        updatedAt: string | null;
    };
};

function Field({
    label,
    name,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    name: keyof GeneralSettingsValues;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <label className="block min-w-0">
            <span className="text-sm font-medium text-white/65">
                {label}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={settingsInputClass}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </label>
    );
}

function Detail({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-white">
                    {value || "Not configured"}
                </p>
            </div>
        </div>
    );
}

function PreviewCardHeader({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E5D2]/15 bg-[#477F73]/10 text-[#A9E5D2]">
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-white/45">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function MiniAvatar({ src, size = "h-11 w-11" }: { src: string; size?: string }) {
    return (
        <div
            className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/10 p-1`}
        >
            <img
                src={src || SAMPLE_LOGO}
                alt="ACCENTRA system logo"
                className="h-full w-full rounded-full object-contain"
            />
        </div>
    );
}

function MiniSidebar({
    settings,
    logo,
}: {
    settings: GeneralSettingsValues;
    logo: string;
}) {
    const groups: {
        title: string;
        items: {
            label: string;
            icon: string;
            active?: boolean;
            nested?: boolean;
        }[];
    }[] = [
        {
            title: "MAIN",
            items: [{ label: "Dashboard", icon: "▦", active: true }],
        },
        {
            title: "MANAGEMENT",
            items: [
                { label: "User Management", icon: "♧" },
                { label: "Faculty", icon: "◇", nested: true },
                { label: "Students", icon: "○", nested: true },
                { label: "Sections", icon: "☷", nested: true },
            ],
        },
        {
            title: "SYSTEM",
            items: [
                { label: "General Settings", icon: "⚙" },
                { label: "Academic Settings", icon: "◇" },
                { label: "System Information", icon: "ⓘ" },
            ],
        },
    ];

    return (
        <aside className="flex w-full max-w-[280px] flex-col border-r border-white/[0.10] bg-[#071522]/95">
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-4">
                <MiniAvatar src={logo} />
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold tracking-tight text-white">
                        {settings.systemName || "ACCENTRA"}
                    </p>
                    <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
                        Accounting System
                    </p>
                </div>
            </div>

            <nav className="space-y-5 px-3 py-4">
                {groups.map((group) => (
                    <div key={group.title}>
                        <p className="mb-2 px-2 text-[9px] font-semibold tracking-[0.16em] text-white/30">
                            {group.title}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                                        item.active
                                            ? "bg-[#A9E5D2]/10 text-[#A9E5D2] ring-1 ring-inset ring-[#A9E5D2]/15"
                                            : item.nested
                                              ? "ml-3 text-white/40"
                                              : "text-white/60"
                                    }`}
                                >
                                    <span className="w-4 shrink-0 text-center">
                                        {item.icon}
                                    </span>
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto border-t border-white/[0.08] p-3">
                <div className="rounded-lg px-2.5 py-2 text-xs text-white/50">
                    ↪ Logout
                </div>
            </div>
        </aside>
    );
}

function SystemPreview({
    settings,
    logo,
}: {
    settings: GeneralSettingsValues;
    logo: string;
}) {
    return (
        <section
            className={`${settingsCardClass} flex h-full min-w-0 flex-col p-5 sm:p-6`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <PreviewCardHeader
                    icon={LayoutDashboard}
                    title="System Preview"
                    subtitle="A compact preview of the ACCENTRA sidebar."
                />
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[0.07] px-3 py-1.5 text-xs font-medium text-[#A9E5D2]">
                    <Eye size={14} />
                    Preview Only
                </span>
            </div>

            <div className="mt-5 flex flex-1 justify-center overflow-hidden rounded-2xl border border-white/[0.12] bg-[#071522]">
                <MiniSidebar settings={settings} logo={logo} />
            </div>

            <p className="mt-3 text-xs leading-5 text-white/40">
                Preview of the saved system logo, name, and sidebar menu.
            </p>
        </section>
    );
}

export default function GeneralSettings() {
    const { generalSettings } = usePage<GeneralSettingsPageProps>().props;
    const initialValues: GeneralSettingsValues = {
        systemName: generalSettings.systemName,
        schoolName: generalSettings.schoolName,
        schoolAddress: generalSettings.schoolAddress,
        contactNumber: generalSettings.contactNumber,
        emailAddress: generalSettings.emailAddress,
        website: generalSettings.website,
    };
    const [settings, setSettings] = useState(initialValues);
    const [draft, setDraft] = useState(initialValues);

    // The currently selected logo and the saved logo are separate.
    const [savedLogo, setSavedLogo] = useState(
        generalSettings.logoUrl || SAMPLE_LOGO,
    );
    const [logo, setLogo] = useState(generalSettings.logoUrl || SAMPLE_LOGO);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [logoMessage, setLogoMessage] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const openEditor = () => {
        setDraft({ ...settings });
        setEditing(true);
        setMessage("");
        setErrors([]);
    };

    const closeEditor = () => {
        setEditing(false);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setDraft((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setLogoMessage("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setLogoMessage("Please select an image smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        setLogoFile(file);
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                setLogoMessage("Unable to read the selected image.");
                return;
            }

            setLogo(reader.result);
            setLogoMessage(
                "Logo selected. Click Save to apply it."
            );
        };

        reader.onerror = () => {
            setLogoMessage("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const saveLogo = () => {
        if (!logoFile) return;

        router.post(
            "/settings/general",
            { ...settings, logoFile },
            {
                forceFormData: true,
                onSuccess: (page) => {
                    const persistedLogo =
                        (page.props as { branding?: { logoUrl?: string | null } })
                            .branding?.logoUrl || logo;
                    setSavedLogo(persistedLogo);
                    setLogo(persistedLogo);
                    setLogoFile(null);
                    setLogoMessage("System logo saved successfully.");
                },
                onError: (validationErrors) => {
                    setErrors(Object.values(validationErrors));
                },
            },
        );
    };

    const saveSettings = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post(
            "/settings/general",
            { ...draft, logoFile },
            {
                forceFormData: true,
                onSuccess: (page) => {
                    const persistedLogo =
                        (page.props as { branding?: { logoUrl?: string | null } })
                            .branding?.logoUrl || logo;
                    setSettings({ ...draft });
                    setSavedLogo(persistedLogo);
                    setLogo(persistedLogo);
                    setLogoFile(null);
                    setEditing(false);
                    setMessage("General settings saved successfully.");
                },
                onError: (validationErrors) => {
                    setErrors(Object.values(validationErrors));
                },
            },
        );
    };

    return (
        <SettingsLayout
            activeMenu="General Settings"
            pageTitle="General Settings"
            description="Manage ACCENTRA's system and school information."
        >
            <Head title="General Settings" />

            <div className="space-y-6">
                {errors.length > 0 && (
                    <div
                        role="alert"
                        className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
                    >
                        {errors.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}

                {message && !editing && (
                    <div
                        role="status"
                        className="rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/10 px-4 py-3 text-sm text-[#A9E5D2]"
                    >
                        {message}
                    </div>
                )}

                <section
                    className={`${settingsCardClass} min-w-0 p-5 sm:p-6`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <PreviewCardHeader
                            icon={Settings}
                            title="System Details"
                            subtitle="Basic system and school information."
                        />
                        <button
                            type="button"
                            onClick={openEditor}
                            className={settingsButtonClass}
                        >
                            <Pencil size={15} />
                            Edit Details
                        </button>
                    </div>

                    <div className="mt-6 grid min-w-0 grid-cols-1 items-center gap-6 border-b border-white/[0.08] pb-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                        <div className="flex items-center gap-4">
                            <MiniAvatar
                                src={savedLogo}
                                size="h-20 w-20"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-white/45">
                                    System Logo
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                    {settings.systemName || "ACCENTRA"}
                                </p>
                                <p className="mt-1 text-xs text-white/40">
                                    Accounting System
                                </p>
                            </div>
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            <Detail
                                icon={Settings}
                                label="System Name"
                                value={settings.systemName}
                            />
                            <Detail
                                icon={Building2}
                                label="School Name"
                                value={settings.schoolName}
                            />
                            <Detail
                                icon={MapPin}
                                label="School Address"
                                value={settings.schoolAddress}
                            />
                            <Detail
                                icon={Phone}
                                label="Contact Number"
                                value={settings.contactNumber}
                            />
                            <Detail
                                icon={Mail}
                                label="Email Address"
                                value={settings.emailAddress}
                            />
                            <Detail
                                icon={Globe}
                                label="Website"
                                value={settings.website}
                            />
                        </div>
                    </div>
                </section>

                <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                    {/* Logo Preview */}
                    <section
                        className={`${settingsCardClass} flex h-full min-w-0 flex-col p-5 sm:p-6`}
                    >
                        <PreviewCardHeader
                            icon={ImagePlus}
                            title="Logo Preview"
                            subtitle="Upload and save the system logo."
                        />

                        <div className="mt-5 flex flex-1 flex-col">
                            <div className="flex min-h-[210px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.025] p-6">
                                <MiniAvatar
                                    src={logo}
                                    size="h-36 w-36"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#A9E5D2]/20 bg-[#477F73]/15 px-4 py-2.5 text-sm font-medium text-[#A9E5D2] transition hover:bg-[#477F73]/25">
                                    <ImagePlus size={16} />
                                    {logo === SAMPLE_LOGO
                                        ? "Upload Logo"
                                        : "Replace Logo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="sr-only"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={saveLogo}
                                    disabled={logo === savedLogo}
                                    className={`${settingsButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                    <Save size={16} />
                                    Save
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-white/35">
                                Image files only · Maximum size: 5 MB
                            </p>

                            {logoMessage && (
                                <p
                                    role="status"
                                    className="mt-3 text-xs text-[#A9E5D2]"
                                >
                                    {logoMessage}
                                </p>
                            )}
                        </div>
                    </section>

                    {/* System Preview */}
                    <SystemPreview
                        settings={settings}
                        logo={savedLogo}
                    />
                </div>
            </div>

            {/* Edit System Details modal */}
            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#030B12]/80 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={saveSettings}
                        className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/[0.13] bg-[#0B1B29] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.08] p-5 sm:p-6">
                            <div>
                                <h2 className="font-semibold text-white">
                                    Edit System Details
                                </h2>
                                <p className="mt-1 text-xs text-white/45">
                                    Update the system and school information.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeEditor}
                                aria-label="Close"
                                className="rounded-lg p-2 text-white/55 hover:bg-white/[0.08] hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <Field
                                label="System Name"
                                name="systemName"
                                value={draft.systemName}
                                onChange={handleChange}
                            />
                            <Field
                                label="School Name"
                                name="schoolName"
                                value={draft.schoolName}
                                onChange={handleChange}
                            />
                            <div className="sm:col-span-2">
                                <Field
                                    label="School Address"
                                    name="schoolAddress"
                                    value={draft.schoolAddress}
                                    onChange={handleChange}
                                />
                            </div>
                            <Field
                                label="Contact Number"
                                name="contactNumber"
                                value={draft.contactNumber}
                                onChange={handleChange}
                            />
                            <Field
                                label="Email Address"
                                name="emailAddress"
                                value={draft.emailAddress}
                                onChange={handleChange}
                                type="email"
                            />
                            <div className="sm:col-span-2">
                                <Field
                                    label="Website"
                                    name="website"
                                    value={draft.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:justify-end sm:p-6">
                            <button
                                type="button"
                                onClick={closeEditor}
                                className="rounded-xl border border-white/[0.12] px-4 py-2.5 text-sm text-white/65 hover:bg-white/[0.05]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={settingsButtonClass}
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </SettingsLayout>
    );
}
