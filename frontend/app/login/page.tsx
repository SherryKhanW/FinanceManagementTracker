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
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-md"
            >
                <h1 className="text-3xl font-bold text-gray-900">Log in</h1>

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
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-60"
                >
                    {isLoading ? "Logging in..." : "Log in"}
                </button>

                {errorMessage && (
                    <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
                )}

                <p className="mt-6 text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-medium text-black underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </main>
    );
}