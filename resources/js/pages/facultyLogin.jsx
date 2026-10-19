import { Link, router } from "@inertiajs/react";
import { useState } from "react";

import {
Mail,
LockKeyhole,
Eye,
EyeOff,
ArrowRight,
CircleAlert,
} from "lucide-react";

export default function FacultyLogin() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [errors, setErrors] = useState({});
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const inputClass = (hasError) => `     w-full rounded-xl border bg-white px-4 py-3
    text-sm text-[#142A43] outline-none transition-all
    placeholder:text-[#8FA3BA]
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-[#D9E1EA] focus:border-[#142A43] focus:ring-4 focus:ring-[#142A43]/10"
    }
  `;


const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
        newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
        newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) {
        return;
    }

    router.post(
        "/faculty/login",
        {
            email: email.trim(),
            password,
            remember: rememberMe,
        },
        {
            preserveScroll: true,

            onStart: () => {
                setLoading(true);
            },

            onError: (serverErrors) => {
                setErrors(serverErrors);
            },

            onFinish: () => {
                setLoading(false);
            },
        }
    );
};


return ( <div className="min-h-screen bg-[#F4F6F8] text-[#142A43]"> <div className="grid min-h-screen lg:grid-cols-2">

    {/* LEFT BRAND PANEL */}
    <section
      className="relative hidden overflow-hidden bg-[#142A43] bg-cover bg-center px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      {/* OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[#142A43]/80" />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#36534E]/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#294B70]/40 blur-3xl" />
      </div>

      {/* LOGO */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#142A43] shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
          <span className="text-lg font-extrabold">A</span>
        </div>

        <div>
          <div className="text-[21px] font-bold tracking-tight text-white">
            ACCENTRA
          </div>
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8FA3BA]">
            Accounting System
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div className="relative z-10 max-w-lg">
        <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-[#A5B5BF]">
          FACULTY PORTAL
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
          Manage learning.
          <br />
          <span className="text-[#A5B5BF]">
            Simplify accounting.
          </span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-7 text-[#B8C6D6]">
          Welcome to the ACCENTRA faculty portal. Access your dashboard
          to manage classes, deliver lessons, create assessments, and
          monitor student progress.
        </p>

        <div className="mt-10 flex items-center gap-2">
          <div className="h-1.5 w-12 rounded-full bg-[#9E2B25]" />
          <div className="h-1.5 w-7 rounded-full bg-white/20" />
          <div className="h-1.5 w-7 rounded-full bg-white/20" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 border-t border-white/10 pt-6">
      </div>
    </section>

    {/* RIGHT LOGIN PANEL */}
    <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">

      {/* MOBILE LOGO */}
      <div className="mb-10 flex items-center gap-3 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#142A43] text-white shadow-md">
          <span className="text-lg font-extrabold">A</span>
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-[#142A43]">
            ACCENTRA
          </div>
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8FA3BA]">
            Accounting System
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">

        {/* FORM HEADING */}
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EDF3] text-[#142A43]">
            <LockKeyhole size={23} strokeWidth={1.8} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#142A43]">
            Welcome back
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#71869E]">
            Log in to your account to access the faculty dashboard.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} noValidate>

          {/* EMAIL */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#263B55]"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA3BA]"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    email: "",
                  }));
                  setMessage("");
                }}
                className={`${inputClass(!!errors.email)} pl-11`}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "email-error" : undefined
                }
              />
            </div>

            {errors.email && (
              <p
                id="email-error"
                className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
              >
                <CircleAlert size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#263B55]"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA3BA]"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: "",
                  }));
                  setMessage("");
                }}
                className={`${inputClass(!!errors.password)} pl-11 pr-12`}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8FA3BA] transition-colors hover:text-[#142A43]"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
              >
                <CircleAlert size={14} />
                {errors.password}
              </p>
            )}
          </div>

          {/* REMEMBER ME / FORGOT PASSWORD */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#607895]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 rounded border-[#C7D2E0] accent-[#142A43]"
              />
              Remember me
            </label>

            <Link
            href="/faculty/forgot-password"
            className="text-sm font-semibold text-[#294B70] transition-colors hover:text-[#142A43]"
            >
            Forgot password?
            </Link>

          </div>

          {/* MESSAGE */}
          {message && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-[#D9E1EA] bg-[#E8EDF3] px-4 py-3 text-sm leading-6 text-[#294B70]"
            >
              {message}
            </div>
          )}

          {/* LOG IN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(20,42,67,0.18)] transition-all duration-200 hover:bg-[#1F3A5B] hover:shadow-[0_8px_22px_rgba(20,42,67,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Log in
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </form>

        {/* SECURITY NOTE */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#E1E7EE] bg-white p-4">
          <LockKeyhole
            size={17}
            className="mt-0.5 shrink-0 text-[#6FA58F]"
          />

          <p className="text-xs leading-5 text-[#71869E]">
            This portal is exclusively for authorized ACCENTRA
            faculty members.
          </p>
        </div>
      </div>
    </section>
  </div>
</div>

);
}