"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(error);
            }
        }

        loadUser();
    }, []);

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {user ? (
                <pre className="mt-6 rounded bg-gray-100 p-4 text-black">
          {JSON.stringify(user, null, 2)}
        </pre>
            ) : (
                <p className="mt-6">Loading...</p>
            )}
        </main>
    );
}