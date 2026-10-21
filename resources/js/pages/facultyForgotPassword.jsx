import { useState } from "react";

import {
  Mail,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  LockKeyhole,
} from "lucide-react";

export default function FacultyForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
    setMessage(
      "Your password reset request has been submitted successfully. Please follow the instructions provided to regain access to your account."
    );
  };

  const inputClass = `
    w-full rounded-xl border bg-white py-3 pl-11 pr-4
    text-sm text-[#142A43] outline-none transition-all
    placeholder:text-[#8FA3BA]
    ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-[#D9E1EA] focus:border-[#142A43] focus:ring-4 focus:ring-[#142A43]/10"
    }
  `;

  return (
    <main className="flex min-h-screen flex-col bg-[#F4F6F8] text-[#142A43]">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#E1E7EE] bg-[#142A43] px-5 py-4 sm:px-10 lg:px-16">
        <a href="/faculty/login" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#142A43] shadow-md">
            <span className="text-lg font-extrabold">A</span>
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-white">
              ACCENTRA
            </div>

            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8FA3BA]">
              Accounting System
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-2 text-xs font-medium text-[#71869E] sm:flex">
          <LockKeyhole size={15} />
          Secure Account Recovery
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#294B70]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#6FA58F]/15 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* CARD */}
          <div className="rounded-2xl border border-[#E1E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(20,42,67,0.07)] sm:p-9">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDF3] text-[#142A43]">
              {submitted ? (
                <CheckCircle2 size={27} strokeWidth={1.8} />
              ) : (
                <Mail size={27} strokeWidth={1.8} />
              )}
            </div>

            {submitted ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-[#142A43]">
                  Request Submitted
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#71869E]">
                  {message}
                </p>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#D9E1EA] bg-[#F4F6F8] p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#6FA58F]"
                  />

                  <p className="break-all text-sm leading-6 text-[#294B70]">
                    Email entered:{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                </div>

                <a
                  href="/faculty/login"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1F3A5B]"
                >
                  Return to Login
                  <ArrowRight size={17} />
                </a>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-[#142A43]">
                  Forgot your password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#71869E]">
                  Please enter your registered faculty email address to
                  initiate a password recovery request. Ensure that the
                  information provided is accurate.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8">
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
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                        setMessage("");
                      }}
                      className={inputClass}
                      aria-invalid={!!error}
                      aria-describedby={error ? "email-error" : undefined}
                    />
                  </div>

                  {error && (
                    <p
                      id="email-error"
                      className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                    >
                      <CircleAlert size={14} />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(20,42,67,0.18)] transition-all duration-200 hover:bg-[#1F3A5B] hover:shadow-[0_8px_22px_rgba(20,42,67,0.25)]"
                  >
                    Send Recovery Email
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </button>
                </form>
              </>
            )}
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-5 flex items-start gap-3 px-2">
            <LockKeyhole
              size={16}
              className="mt-0.5 shrink-0 text-[#8FA3BA]"
            />

            <p className="text-xs leading-5 text-[#8FA3BA]">
              For security, only use the email address associated with your
              ACCENTRA faculty account.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E1E7EE] px-5 py-5 text-center text-xs text-[#8FA3BA]">
        © {new Date().getFullYear()} ACCENTRA. All rights reserved.
      </footer>
    </main>
  );
}

