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
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form
                onSubmit={handleSignup}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-md"
            >
                <h1 className="text-3xl font-bold text-gray-900">Create account</h1>

                <p className="mt-2 text-gray-600">
                    Start tracking your expenses.
                </p>

                <label className="mt-6 block text-sm font-medium text-gray-700">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black"
                />

                <label className="mt-4 block text-sm font-medium text-gray-700">
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-60"
                >
                    {isLoading ? "Creating account..." : "Sign up"}
                </button>

                {message && (
                    <p className="mt-4 text-sm text-gray-700">{message}</p>
                )}

                <p className="mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-black underline">
                        Log in
                    </Link>
                </p>
            </form>
        </main>
    );
}