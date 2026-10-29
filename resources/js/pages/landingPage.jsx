
import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    BookOpen,
    BrainCircuit,
    Calculator,
    Check,
    FileText,
    GraduationCap,
    Layers3,
    Menu,
    PieChart,
    ShieldCheck,
    Sparkles,
    Wallet,
    X,
    Zap,
    TrendingUp,
} from "lucide-react";

const STUDENT_LOGIN = "/student/login";

const panels = {
    Home: {
        eyebrow: "ACCOUNTING & LEARNING",
        title: "Where accounting meets learning.",
        description:
            "One connected space for accounting tools, learning resources, academic tasks, and AI-assisted support.",
        icon: Layers3,
        tag: "Accounting and learning, connected.",
    },
    Features: {
        eyebrow: "BUILT FOR YOUR WORKFLOW",
        title: "Everything works together.",
        description:
            "Explore accounting management, learning modules, task submissions, and AI-assisted explanations in one workspace.",
        icon: BrainCircuit,
        tag: "Four essential capabilities. One system.",
    },
    Programs: {
        eyebrow: "YOUR ACADEMIC PATH",
        title: "Learn. Build. Grow.",
        description:
            "Explore the academic programs supported by ACCENTRA and discover a connected approach to accounting and learning.",
        icon: GraduationCap,
        tag: "Two programs. One connected learning space.",
    },
    Accounting: {
        eyebrow: "ACCOUNTING WORKSPACE",
        title: "Accounting, made organized.",
        description:
            "Explore essential accounting activities, from organizing accounts and recording transactions to preparing financial statements.",
        icon: Calculator,
        tag: "From journal entries to financial statements.",
    },
    About: {
        eyebrow: "THE ACCENTRA EXPERIENCE",
        title: "Less scattered work. More room to grow.",
        description:
            "Designed to connect accounting activities and academic learning through dedicated experiences for students, faculty, and administrators.",
        icon: ShieldCheck,
        tag: "A workspace designed around your role.",
    },
    FAQ: {
        eyebrow: "GOOD TO KNOW",
        title: "Your questions, answered.",
        description:
            "ACCENTRA brings accounting activities and learning resources together in one information system.",
        icon: BookOpen,
        tag: "Accounting and learning in one place.",
    },
};

const featureList = [
    {
        icon: Wallet,
        title: "Accounting",
        text: "Organized financial records.",
    },
    {
        icon: BookOpen,
        title: "Learning",
        text: "Learning resources in one place.",
    },
    {
        icon: Layers3,
        title: "Tasks",
        text: "Activities and submissions.",
    },
    {
        icon: BrainCircuit,
        title: "AI Support",
        text: "Guided accounting explanations.",
    },
];

const programs = [
    {
        icon: Calculator,
        title: "Bachelor of Science in Accounting Information Systems",
        shortTitle: "BSAIS",
        description:
            "Connect accounting principles, financial information, and information systems.",
    },
    {
        icon: TrendingUp,
        title: "Bachelor of Science in Entrepreneurship",
        shortTitle: "BSEN",
        description:
            "Develop business knowledge, entrepreneurial skills, and practical decision-making.",
    },
];

const accountingTasks = [
    {
        icon: Layers3,
        title: "Chart of Accounts",
        description: "Organize accounts by category.",
    },
    {
        icon: FileText,
        title: "Journal Entries",
        description: "Record business transactions.",
    },
    {
        icon: BookOpen,
        title: "General Ledger",
        description: "Review account movements.",
    },
    {
        icon: Calculator,
        title: "Trial Balance",
        description: "Check debit and credit balances.",
    },
    {
        icon: BarChart3,
        title: "Income Statement",
        description: "Review revenues and expenses.",
    },
    {
        icon: PieChart,
        title: "Balance Sheet",
        description: "View assets, liabilities, and equity.",
    },
];

const carouselItems = [
    {
        icon: Wallet,
        title: "Accounting management",
        text: "Keep financial records organized and connected.",
    },
    {
        icon: GraduationCap,
        title: "Learning experience",
        text: "Access learning materials and academic activities.",
    },
    {
        icon: BrainCircuit,
        title: "AI-assisted learning",
        text: "Explore explanations that help clarify accounting concepts.",
    },
];

function FeatureCards() {
    return (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
            {featureList.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="ac-card ac-glass rounded-xl p-3 sm:p-4"
                    >
                        <Icon size={19} className="text-[#A9E5D2]" />
                        <p className="mt-2 text-xs font-semibold sm:text-sm">
                            {item.title}
                        </p>
                        <p className="mt-1 text-[10px] leading-4 text-white/45 sm:text-xs">
                            {item.text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function ProgramCards() {
    return (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {programs.map((program) => {
                const Icon = program.icon;

                return (
                    <div
                        key={program.shortTitle}
                        className="ac-card ac-glass rounded-2xl p-3 sm:p-4"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A9E5D2]/10 text-[#A9E5D2]">
                            <Icon size={19} />
                        </div>

                        <p className="mt-3 text-[10px] font-semibold text-[#A9E5D2] sm:text-xs">
                            {program.shortTitle}
                        </p>

                        <h3 className="mt-1 text-xs font-semibold leading-5 sm:text-sm">
                            {program.title}
                        </h3>

                        <p className="mt-2 text-[10px] leading-4 text-white/50 sm:text-xs sm:leading-5">
                            {program.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function AccountingCards() {
    return (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {accountingTasks.map((task) => {
                const Icon = task.icon;

                return (
                    <div
                        key={task.title}
                        className="ac-card ac-glass rounded-xl p-3"
                    >
                        <Icon size={18} className="text-[#A9E5D2]" />

                        <p className="mt-2 text-[10px] font-semibold leading-4 sm:text-xs">
                            {task.title}
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-white/45 sm:text-[10px]">
                            {task.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function AboutRoles() {
    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {["Administrator", "Faculty", "Student"].map((role) => (
                <span
                    key={role}
                    className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-white/70"
                >
                    <Check
                        size={13}
                        className="mr-1 inline text-[#A9E5D2]"
                    />
                    {role}
                </span>
            ))}
        </div>
    );
}

function FAQCards() {
    const questions = [
        {
            question: "Who can use ACCENTRA?",
            answer: "Students, faculty, and administrators.",
        },
        {
            question: "What accounting tools are included?",
            answer: "Chart of Accounts, Journal Entries, General Ledger, and financial statements.",
        },
        {
            question: "What programs are featured?",
            answer: "BS in Accounting Information Systems and BS in Entrepreneurship.",
        },
    ];

    return (
        <div className="mt-5 space-y-2">
            {questions.map((item) => (
                <div
                    key={item.question}
                    className="ac-glass rounded-xl p-3 sm:p-4"
                >
                    <p className="text-xs font-semibold sm:text-sm">
                        {item.question}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-white/50 sm:text-xs">
                        {item.answer}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function LandingPage() {
    const [activePanel, setActivePanel] = useState("Home");
    const [slide, setSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [paused, setPaused] = useState(false);

    const panel = panels[activePanel];
    const CurrentPanelIcon = panel.icon;
    const current = carouselItems[slide];
    const CurrentIcon = current.icon;
    const navItems = Object.keys(panels);

    useEffect(() => {
        if (paused) return;

        const timer = window.setInterval(() => {
            setSlide((value) => (value + 1) % carouselItems.length);
        }, 4000);

        return () => window.clearInterval(timer);
    }, [paused]);

    const choosePanel = (name) => {
        setActivePanel(name);
        setMenuOpen(false);
    };

    return (
        <>
            <Head title="ACCENTRA">
                <meta
                    name="description"
                    content="Discover ACCENTRA, a connected accounting and learning information system."
                />
            </Head>

            <main className="ac-page relative h-[100dvh] min-h-0 overflow-hidden bg-[#071522] font-sans text-white">
                <style>{`
                    @keyframes floatCard {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-9px); }
                    }

                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(12px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes glow {
                        0%, 100% { opacity: .3; }
                        50% { opacity: .7; }
                    }

                    @keyframes shine {
                        from { transform: translateX(-150%); }
                        to { transform: translateX(250%); }
                    }

                    @keyframes orbit {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .ac-glass {
                        background: linear-gradient(
                            135deg,
                            rgba(255,255,255,.105),
                            rgba(255,255,255,.025)
                        );
                        border: 1px solid rgba(255,255,255,.13);
                        box-shadow:
                            inset 0 1px 0 rgba(255,255,255,.06),
                            0 18px 55px rgba(0,0,0,.18);
                        backdrop-filter: blur(22px);
                        -webkit-backdrop-filter: blur(22px);
                    }

                    .ac-grid {
                        background-image:
                            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
                        background-size: 52px 52px;
                    }

                    .ac-float { animation: floatCard 5s ease-in-out infinite; }
                    .ac-glow { animation: glow 6s ease-in-out infinite; }
                    .ac-enter { animation: fadeUp .35s ease both; }

                    .ac-nav {
                        position: relative;
                        transition: color .25s ease;
                    }

                    .ac-nav::after {
                        content: "";
                        position: absolute;
                        height: 2px;
                        bottom: -7px;
                        left: 50%;
                        width: 0;
                        background: #A9E5D2;
                        transition: all .25s ease;
                        transform: translateX(-50%);
                    }

                    .ac-nav:hover::after,
                    .ac-nav.active::after { width: 70%; }

                    .ac-card {
                        transition:
                            transform .3s ease,
                            border-color .3s ease,
                            background .3s ease;
                    }

                    .ac-card:hover {
                        transform: translateY(-4px);
                        border-color: rgba(169,229,210,.4);
                        background-color: rgba(255,255,255,.075);
                    }

                    .ac-shine {
                        position: relative;
                        overflow: hidden;
                    }

                    .ac-shine::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 30%;
                        left: 0;
                        background: linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,.2),
                            transparent
                        );
                        transform: translateX(-150%);
                        pointer-events: none;
                    }

                    .ac-shine:hover::after { animation: shine .7s ease; }

                    .ac-orbit {
                        animation: orbit 30s linear infinite;
                    }

                    @media (max-height: 760px) {
                        .ac-main { padding-top: 12px !important; padding-bottom: 12px !important; }
                        .ac-heading { font-size: clamp(2rem, 4.1vw, 3.8rem) !important; }
                        .ac-description { margin-top: 12px !important; }
                        .ac-actions { margin-top: 18px !important; }
                        .ac-showcase-card { padding: 16px !important; }
                        .ac-showcase-extra { display: none !important; }
                        .ac-footer { padding-top: 8px !important; }
                    }

                    @media (max-width: 767px) {
                        .ac-page {
                            height: 100dvh;
                            min-height: 0;
                            overflow: hidden;
                        }

                        .ac-shell {
                            padding: 10px 12px !important;
                        }

                        .ac-main {
                            grid-template-columns: minmax(0, 1fr) !important;
                            gap: 10px !important;
                            padding-top: 12px !important;
                            padding-bottom: 8px !important;
                        }

                        .ac-heading {
                            font-size: clamp(1.8rem, 7vw, 2.7rem) !important;
                        }

                        .ac-description {
                            margin-top: 10px !important;
                            font-size: 12px !important;
                            line-height: 1.6 !important;
                        }

                        .ac-mobile-showcase {
                            display: none !important;
                        }

                        .ac-mobile-content {
                            overflow: hidden;
                        }

                        .ac-footer {
                            padding-top: 8px !important;
                        }
                    }

                    @media (max-width: 767px) and (max-height: 700px) {
                        .ac-main {
                            padding-top: 8px !important;
                            padding-bottom: 5px !important;
                        }

                        .ac-eyebrow {
                            margin-bottom: 10px !important;
                        }

                        .ac-heading {
                            font-size: clamp(1.65rem, 6vw, 2.2rem) !important;
                        }

                        .ac-panel-content {
                            margin-top: 10px !important;
                        }

                        .ac-footer-tagline {
                            display: none !important;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *, *::before, *::after {
                            animation-duration: .01ms !important;
                            animation-iteration-count: 1 !important;
                            scroll-behavior: auto !important;
                            transition-duration: .01ms !important;
                        }
                    }
                `}</style>

                {/* Animated background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="ac-grid absolute inset-0 opacity-80" />

                    <div className="ac-glow absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#477F73]/25 blur-[130px]" />

                    <div className="ac-glow absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[150px]" />

                    <div className="ac-orbit absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

                    <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

                    <div className="ac-glow absolute left-[40%] top-[35%] h-48 w-48 rounded-full bg-[#A9E5D2]/[.06] blur-[90px]" />
                </div>

                <div className="ac-shell relative mx-auto flex h-full max-w-[1600px] flex-col px-4 py-3 sm:px-7 sm:py-5 lg:px-12">
                    {/* Navbar */}
                    <header className="ac-glass relative z-30 flex shrink-0 items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
                        <button
                            onClick={() => choosePanel("Home")}
                            className="flex items-center gap-3 text-left"
                            aria-label="ACCENTRA home"
                        >
                           <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 transition duration-300 hover:scale-110">
                            <img
                                src="/images/accentra-logoo.png"
                                alt="ACCENTRA Logo"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>

                            <div>
                                <p className="text-lg font-semibold tracking-[.16em] sm:text-xl">
                                    ACCENTRA
                                </p>
                                <p className="hidden text-[9px] uppercase tracking-[.16em] text-white/45 sm:block">
                                    Accounting Information System
                                </p>
                            </div>
                        </button>

                        <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
                            {navItems.map((name) => (
                                <button
                                    key={name}
                                    onClick={() => choosePanel(name)}
                                    className={`ac-nav whitespace-nowrap text-xs lg:text-sm ${
                                        activePanel === name
                                            ? "active text-[#A9E5D2]"
                                            : "text-white/60 hover:text-white"
                                    }`}
                                >
                                    {name === "Accounting" ? "Accounting Tasks" : name}
                                </button>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            <a
                                href={STUDENT_LOGIN}
                                className="rounded-xl px-3 py-2 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
                            >
                                Sign in
                            </a>

                            <a
                                href={STUDENT_LOGIN}
                                className="ac-shine inline-flex items-center gap-2 rounded-xl border border-[#B7E8D9]/30 bg-gradient-to-r from-[#477F73] to-[#528F80] px-4 py-2.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/30"
                            >
                                Get started
                                <ArrowUpRight size={15} />
                            </a>
                        </div>

                        <button
                            onClick={() => setMenuOpen((value) => !value)}
                            aria-label="Toggle navigation"
                            aria-expanded={menuOpen}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] md:hidden"
                        >
                            {menuOpen ? <X size={19} /> : <Menu size={19} />}
                        </button>

                        {menuOpen && (
                            <div className="ac-glass absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl p-3 md:hidden">
                                {navItems.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => choosePanel(name)}
                                        className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/10 ${
                                            activePanel === name
                                                ? "text-[#A9E5D2]"
                                                : "text-white/75"
                                        }`}
                                    >
                                        {name === "Accounting" ? "Accounting Tasks" : name}
                                    </button>
                                ))}

                                <div className="my-2 h-px bg-white/10" />

                                <a
                                    href={STUDENT_LOGIN}
                                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#A9E5D2] hover:bg-white/10"
                                >
                                    Student Login
                                    <ArrowUpRight size={14} className="ml-2 inline" />
                                </a>
                            </div>
                        )}
                    </header>

                    {/* Main screen */}
                    <section className="ac-main ac-mobile-content relative z-10 grid min-h-0 flex-1 grid-cols-1 items-center gap-5 py-5 md:grid-cols-[1fr_.9fr] md:gap-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-12 lg:py-8">
                        {/* Left content */}
                        <div
                            key={activePanel}
                            className="ac-enter flex min-w-0 flex-col justify-center"
                        >
                            <div className="ac-eyebrow mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#A9E5D2]/20 bg-[#A9E5D2]/[.07] px-3 py-2 text-[10px] font-medium text-[#C6F0E2] sm:text-xs">
                                <CurrentPanelIcon size={14} />
                                <span>{panel.eyebrow}</span>
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A9E5D2]" />
                            </div>

                            <h1 className="ac-heading max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl lg:text-6xl xl:text-7xl">
                                {activePanel === "Home" ? (
                                    <>
                                        Where accounting
                                        <span className="mt-1 block bg-gradient-to-r from-[#A9E5D2] via-[#82CDB8] to-[#75AFC1] bg-clip-text pb-2 text-transparent">
                                            meets learning.
                                        </span>
                                    </>
                                ) : (
                                    panel.title
                                )}
                            </h1>

                            <p className="ac-description mt-4 max-w-xl text-sm leading-7 text-white/60 sm:mt-5 sm:text-base lg:text-[17px]">
                                {panel.description}
                            </p>

                            <div className="ac-panel-content">
                                {activePanel === "Features" ? (
                                    <FeatureCards />
                                ) : activePanel === "Programs" ? (
                                    <ProgramCards />
                                ) : activePanel === "Accounting" ? (
                                    <AccountingCards />
                                ) : activePanel === "FAQ" ? (
                                    <FAQCards />
                                ) : activePanel === "About" ? (
                                    <AboutRoles />
                                ) : (
                                    <div className="ac-actions mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                                        <a
                                            href={STUDENT_LOGIN}
                                            className="ac-shine group inline-flex items-center justify-center gap-3 rounded-xl border border-[#B7E8D9]/35 bg-gradient-to-r from-[#477F73] to-[#528F80] px-5 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30 sm:px-6"
                                        >
                                            Student Login
                                            <ArrowRight
                                                size={16}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </a>

                                        <button
                                            onClick={() => choosePanel("Features")}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.035] px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:-translate-y-1 hover:bg-white/[.08] hover:text-white sm:px-6"
                                        >
                                            Explore features
                                            <ArrowDownRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {activePanel !== "Home" && (
                                <p className="mt-4 hidden items-center gap-2 text-[10px] text-white/35 sm:flex">
                                    <Sparkles size={13} className="text-[#A9E5D2]" />
                                    {panel.tag}
                                </p>
                            )}
                        </div>

                        {/* Right animated showcase */}
                        <div
                            className="ac-mobile-showcase relative mx-auto w-full max-w-[540px] md:ml-auto"
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                        >
                            <div className="ac-glow absolute inset-8 rounded-full bg-[#477F73]/20 blur-[80px]" />

                            <div className="absolute inset-5 rotate-3 rounded-[30px] border border-[#A9E5D2]/10 transition-transform duration-500 hover:rotate-0" />

                            <div className="ac-glass ac-showcase-card relative overflow-hidden rounded-[26px] p-4 sm:rounded-[30px] sm:p-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A9E5D2]/10 text-[#A9E5D2]">
                                            <Layers3 size={19} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold sm:text-sm">
                                                Your workspace
                                            </p>
                                            <p className="mt-1 text-[10px] text-white/40">
                                                ACCENTRA overview
                                            </p>
                                        </div>
                                    </div>

                                    <span className="flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.07] px-2.5 py-1.5 text-[9px] text-emerald-200 sm:text-[10px]">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                                        Connected
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {featureList.slice(0, 2).map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.title}
                                                className="ac-card group rounded-2xl border border-white/10 bg-white/[.035] p-3 sm:p-4"
                                            >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A9E5D2]/10 text-[#A9E5D2] transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                                    <Icon size={19} />
                                                </div>

                                                <p className="mt-3 text-[10px] text-white/45 sm:text-xs">
                                                    {item.title}
                                                </p>

                                                <p className="mt-1 text-xs font-semibold sm:text-sm">
                                                    {index === 0
                                                        ? "Financial records"
                                                        : "Course resources"}
                                                </p>

                                                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r from-[#477F73] to-[#A9E5D2] transition-all duration-700 group-hover:w-full ${
                                                            index === 0
                                                                ? "w-[78%]"
                                                                : "w-[65%]"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Interactive carousel */}
                                <div className="relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#071522]/40 p-4 sm:mt-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[9px] font-semibold tracking-[.16em] text-[#A9E5D2] sm:text-[10px]">
                                            DISCOVER ACCENTRA
                                        </span>

                                        <span className="text-[10px] text-white/35">
                                            {String(slide + 1).padStart(2, "0")} / 03
                                        </span>
                                    </div>

                                    <div
                                        key={slide}
                                        className="ac-enter flex min-h-[105px] items-center gap-4 py-3 sm:min-h-[125px]"
                                    >
                                        <div className="ac-float flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#A9E5D2]/20 bg-[#477F73]/20 text-[#A9E5D2] sm:h-[68px] sm:w-[68px]">
                                            <CurrentIcon size={27} strokeWidth={1.5} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold sm:text-base">
                                                {current.title}
                                            </h3>
                                            <p className="mt-2 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
                                                {current.text}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/[.08] pt-3">
                                        <div className="flex gap-1.5">
                                            {carouselItems.map((item, index) => (
                                                <button
                                                    key={item.title}
                                                    onClick={() => setSlide(index)}
                                                    aria-label={`Show ${item.title}`}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        slide === index
                                                            ? "w-7 bg-[#A9E5D2]"
                                                            : "w-2 bg-white/25 hover:bg-white/50"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setSlide(
                                                        (slide + carouselItems.length - 1) %
                                                            carouselItems.length
                                                    )
                                                }
                                                aria-label="Previous feature"
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-[#A9E5D2]/40 hover:bg-[#A9E5D2]/10"
                                            >
                                                <ArrowLeft size={14} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setSlide(
                                                        (slide + 1) % carouselItems.length
                                                    )
                                                }
                                                aria-label="Next feature"
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-[#A9E5D2]/40 hover:bg-[#A9E5D2]/10"
                                            >
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="ac-showcase-extra mt-3 flex items-center gap-3 rounded-2xl border border-[#A9E5D2]/15 bg-[#477F73]/10 p-3 sm:mt-4 sm:p-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#A9E5D2]/10 text-[#A9E5D2]">
                                        <Sparkles size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold">
                                            A smarter learning experience
                                        </p>
                                        <p className="mt-1 text-[10px] leading-4 text-white/45">
                                            Tools, resources, and learning support.
                                        </p>
                                    </div>

                                    <Zap
                                        size={16}
                                        className="shrink-0 text-[#A9E5D2]/70"
                                    />
                                </div>
                            </div>

                            <div className="ac-glass ac-float absolute -left-3 top-[20%] hidden items-center gap-2 rounded-xl p-3 shadow-xl sm:flex lg:-left-8">
                                <Check size={17} className="text-[#A9E5D2]" />
                                <span className="text-[10px] font-medium">
                                    Stay organized
                                </span>
                            </div>

                            <div className="ac-glass absolute -right-2 bottom-[13%] hidden items-center gap-2 rounded-xl p-3 shadow-xl sm:flex lg:-right-6">
                                <BrainCircuit size={17} className="text-sky-200" />
                                <span className="text-[10px] font-medium">
                                    Learn with support
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Minimal footer — no separate portal buttons */}
                    <footer className="ac-footer relative z-10 shrink-0 border-t border-white/10 pt-3 sm:pt-4">
                        <div className="flex items-center justify-between gap-3 pb-1">
                            <div className="flex min-w-0 items-center gap-2 text-[9px] text-white/35 sm:text-xs">
                                <span className="shrink-0 font-semibold tracking-[.15em] text-white/70">
                                    ACCENTRA
                                </span>
                                <span className="text-white/20">/</span>
                                <span className="ac-footer-tagline truncate">
                                    Accounting and learning, connected.
                                </span>
                            </div>

                        </div>
                    </footer>
                </div>
            </main>
        </>
    );
}
