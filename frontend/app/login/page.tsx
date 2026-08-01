"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] p-6 text-stone-950">
            <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(31,27,22,0.09)]">
                <div className="mb-8">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
                        FT
                    </div>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-950">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-stone-500">
                        Log in to manage your personal expenses.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-stone-700">
                            Email
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-stone-700">
                            Password
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                {errorMessage && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </p>
                )}

                <p className="mt-6 text-center text-sm text-stone-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-stone-950 underline-offset-4 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </section>
        </main>
    );
}
