"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Account created. Check your email to confirm your account.");
        }

        setIsLoading(false);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] p-6 text-stone-950">
            <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(31,27,22,0.09)]">
                <div className="mb-8">
                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-950">
                        Kaisa Paisa?
                    </h1>
                    <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-950">
                        Create account
                    </h1>
                    <p className="mt-2 text-sm text-stone-500">
                        Start tracking your expenses!
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
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
                            minLength={6}
                            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                        {message}
                    </p>
                )}

                <p className="mt-6 text-center text-sm text-stone-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-stone-950 underline-offset-4 hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    );
}
