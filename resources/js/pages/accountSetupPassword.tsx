import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';

type AccountSetupPasswordProps = {
    accountType: 'Admin' | 'Faculty' | 'Student';
    updateUrl: string;
};

export default function AccountSetupPassword({
    accountType,
    updateUrl,
}: AccountSetupPasswordProps) {
    const form = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(updateUrl, { preserveScroll: true });
    };

    const inputClass =
        'w-full rounded-xl border border-[#D9E1EA] bg-white px-4 py-3 text-sm text-[#142A43] outline-none transition-all placeholder:text-[#8FA3BA] focus:border-[#142A43] focus:ring-4 focus:ring-[#142A43]/10';

    return (
        <main className="flex min-h-screen flex-col bg-[#F4F6F8] text-[#142A43]">
            <header className="flex items-center border-b border-[#E1E7EE] bg-[#142A43] px-5 py-4 sm:px-10 lg:px-16">
                <a href="/" className="flex items-center gap-3">
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
            </header>

            <section className="flex flex-1 items-center justify-center px-5 py-12">
                <div className="w-full max-w-md rounded-2xl border border-[#E1E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(20,42,67,0.07)] sm:p-9">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDF3] text-[#142A43]">
                        <LockKeyhole size={27} strokeWidth={1.8} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Set your password
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#71869E]">
                        Choose a new password for your{' '}
                        {accountType.toLowerCase()} account. Use at least 12
                        characters.
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-[#263B55]"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                className={inputClass}
                                aria-invalid={!!form.errors.password}
                            />
                            {form.errors.password && (
                                <p className="mt-2 text-xs text-red-600">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-semibold text-[#263B55]"
                            >
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                aria-invalid={
                                    !!form.errors.password_confirmation
                                }
                            />
                            {form.errors.password_confirmation && (
                                <p className="mt-2 text-xs text-red-600">
                                    {form.errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#142A43] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1F3A5B] disabled:opacity-60"
                        >
                            {form.processing ? 'Saving...' : 'Set Password'}
                            <ArrowRight size={17} />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
