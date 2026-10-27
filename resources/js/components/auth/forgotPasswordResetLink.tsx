import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import SystemLogo from '../common/systemLogo';

type ForgotPasswordResetLinkProps = {
    loginUrl: string;
    sendResetLinkUrl: string;
    accountType: 'administrator' | 'faculty' | 'student';
};

export default function ForgotPasswordResetLink({
    loginUrl,
    sendResetLinkUrl,
    accountType,
}: ForgotPasswordResetLinkProps) {
    const form = useForm({ email: '' });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(sendResetLinkUrl, { preserveScroll: true });
    };

    const inputClass =
        'w-full rounded-xl border border-[#D9E1EA] bg-white px-4 py-3 text-sm text-[#142A43] outline-none transition-all placeholder:text-[#8FA3BA] focus:border-[#142A43] focus:ring-4 focus:ring-[#142A43]/10';

    return (
        <main className="flex min-h-screen flex-col bg-[#F4F6F8] text-[#142A43]">
            <header className="flex items-center justify-between border-b border-[#E1E7EE] bg-[#142A43] px-5 py-4 sm:px-10 lg:px-16">
                <a href={loginUrl} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#142A43] shadow-md">
                        <SystemLogo />
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

            <section className="flex flex-1 items-center justify-center px-5 py-12">
                <div className="w-full max-w-md rounded-2xl border border-[#E1E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(20,42,67,0.07)] sm:p-9">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDF3] text-[#142A43]">
                        <Mail size={27} strokeWidth={1.8} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Forgot your password?
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#71869E]">
                        Enter the registered {accountType} email address. We’ll
                        send you a secure link where you can create a new
                        password.
                    </p>

                    {form.wasSuccessful && (
                        <p
                            className="mt-5 rounded-xl bg-[#E8F3ED] px-4 py-3 text-sm leading-6 text-[#286044]"
                            role="status"
                        >
                            If an eligible account exists, a password reset
                            link has been sent to its email address. The link
                            expires in 60 minutes.
                        </p>
                    )}

                    <form onSubmit={submit} className="mt-8">
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
                                    form.setData('email', event.target.value)
                                }
                                className={`${inputClass} pl-11`}
                                aria-invalid={!!form.errors.email}
                                aria-describedby={
                                    form.errors.email ? 'email-error' : undefined
                                }
                            />
                        </div>
                        {form.errors.email && (
                            <p
                                id="email-error"
                                className="mt-2 text-xs text-red-600"
                            >
                                {form.errors.email}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(20,42,67,0.18)] transition-all hover:bg-[#1F3A5B] disabled:opacity-60"
                        >
                            {form.processing ? 'Sending...' : 'Send Reset Link'}
                            <ArrowRight
                                size={17}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
