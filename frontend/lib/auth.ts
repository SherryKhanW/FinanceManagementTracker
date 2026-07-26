import { createClient } from "@/lib/supabase/client";

export async function getAccessToken(): Promise<string | null> {
    const supabase = createClient();

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) {
        console.error("Could not retrieve session:", error.message);
        return null;
    }

    return session?.access_token ?? null;
}