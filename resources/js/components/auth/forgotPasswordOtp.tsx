import { useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    LockKeyhole,
    Mail,
} from 'lucide-react';

type ForgotPasswordOtpProps = {
    loginUrl: string;
    sendOtpUrl: string;
    resetPasswordUrl: string;
    accountType: 'administrator' | 'faculty' | 'student';
};

export default function ForgotPasswordOtp({
    loginUrl,
    sendOtpUrl,
    resetPasswordUrl,
    accountType,
}: ForgotPasswordOtpProps) {
    const form = useForm({
        email: '',
        code: '',
        password: '',
        password_confirmation: '',
    });
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [message, setMessage] = useState('');

    const requestCode = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');
        form.post(sendOtpUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setStep('code');
                setMessage(
                    'If an eligible account exists, a reset code has been sent to its email address.',
                );
            },
        });
    };

    const resetPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(resetPasswordUrl, { preserveScroll: true });
    };

    const inputClass =
        'w-full rounded-xl border border-[#D9E1EA] bg-white px-4 py-3 text-sm text-[#142A43] outline-none transition-all placeholder:text-[#8FA3BA] focus:border-[#142A43] focus:ring-4 focus:ring-[#142A43]/10';

    return (
        <main className="flex min-h-screen flex-col bg-[#F4F6F8] text-[#142A43]">
            <header className="flex items-center justify-between border-b border-[#E1E7EE] bg-[#142A43] px-5 py-4 sm:px-10 lg:px-16">
                <a href={loginUrl} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#142A43] shadow-md">
                        <span className="text-lg font-extrabold">A</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold tracking-tight text-white">
                            ACCENTRA
                        </div>
                        <div className="mt-0.5 text-[9px] font-semibold tracking-[0.18em] text-[#8FA3BA] uppercase">
                            Accounting System
                        </div>
                    </div>
                </a>
                <div className="hidden items-center gap-2 text-xs font-medium text-[#71869E] sm:flex">
                    <LockKeyhole size={15} />
                    Secure Account Recovery
                </div>
            </header>

            <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#294B70]/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#6FA58F]/15 blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">
                    <div className="rounded-2xl border border-[#E1E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(20,42,67,0.07)] sm:p-9">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDF3] text-[#142A43]">
                            {step === 'code' ? (
                                <CheckCircle2 size={27} strokeWidth={1.8} />
                            ) : (
                                <Mail size={27} strokeWidth={1.8} />
                            )}
                        </div>

                        {step === 'email' ? (
                            <>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Forgot your password?
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#71869E]">
                                    Enter the registered {accountType} email
                                    address to receive a password reset code.
                                </p>

                                <form onSubmit={requestCode} className="mt-8">
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-[#263B55]"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute top-1/2 left-4 -translate-y-1/2 text-[#8FA3BA]"
                                        />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Enter your registered email"
                                            value={form.data.email}
                                            onChange={(event) =>
                                                form.setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-11`}
                                            aria-invalid={!!form.errors.email}
                                            aria-describedby={
                                                form.errors.email
                                                    ? 'email-error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                    {form.errors.email && (
                                        <p
                                            id="email-error"
                                            className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                                        >
                                            <CircleAlert size={14} />
                                            {form.errors.email}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(20,42,67,0.18)] transition-all hover:bg-[#1F3A5B] disabled:opacity-60"
                                    >
                                        {form.processing
                                            ? 'Sending...'
                                            : 'Send Recovery Code'}
                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Reset your password
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#71869E]">
                                    Enter the six-digit code sent to{' '}
                                    {form.data.email}, then choose a password
                                    with at least 12 characters.
                                </p>
                                {message && (
                                    <p
                                        className="mt-3 text-xs leading-5 text-[#71869E]"
                                        role="status"
                                    >
                                        {message}
                                    </p>
                                )}

                                <form
                                    onSubmit={resetPassword}
                                    className="mt-8 space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="code"
                                            className="mb-2 block text-sm font-semibold text-[#263B55]"
                                        >
                                            Verification code
                                        </label>
                                        <input
                                            id="code"
                                            name="code"
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={form.data.code}
                                            onChange={(event) =>
                                                form.setData(
                                                    'code',
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            className={inputClass}
                                            aria-invalid={!!form.errors.code}
                                            aria-describedby={
                                                form.errors.code
                                                    ? 'code-error'
                                                    : undefined
                                            }
                                        />
                                        {form.errors.code && (
                                            <p
                                                id="code-error"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {form.errors.code}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-2 block text-sm font-semibold text-[#263B55]"
                                        >
                                            New password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            value={form.data.password}
                                            onChange={(event) =>
                                                form.setData(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            aria-invalid={
                                                !!form.errors.password
                                            }
                                            aria-describedby={
                                                form.errors.password
                                                    ? 'password-error'
                                                    : undefined
                                            }
                                        />
                                        {form.errors.password && (
                                            <p
                                                id="password-error"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {form.errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="mb-2 block text-sm font-semibold text-[#263B55]"
                                        >
                                            Confirm new password
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            value={
                                                form.data.password_confirmation
                                            }
                                            onChange={(event) =>
                                                form.setData(
                                                    'password_confirmation',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1F3A5B] disabled:opacity-60"
                                    >
                                        {form.processing
                                            ? 'Resetting...'
                                            : 'Reset Password'}
                                        <ArrowRight size={17} />
                                    </button>
                                </form>
                                <div className="mt-5 flex justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="text-[#294B70] underline"
                                    >
                                        Change email
                                    </button>
                                    <button
                                        type="button"
                                        disabled={form.processing}
                                        onClick={() =>
                                            form.post(sendOtpUrl, {
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-[#294B70] underline disabled:opacity-60"
                                    >
                                        Resend code
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-5 flex items-start gap-3 px-2">
                        <LockKeyhole
                            size={16}
                            className="mt-0.5 shrink-0 text-[#8FA3BA]"
                        />
                        <p className="text-xs leading-5 text-[#8FA3BA]">
                            For security, use the email address associated with
                            your ACCENTRA {accountType} account.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="border-t border-[#E1E7EE] px-5 py-5 text-center text-xs text-[#8FA3BA]">
                © {new Date().getFullYear()} ACCENTRA. All rights reserved.
            </footer>
        </main>
    );
}
