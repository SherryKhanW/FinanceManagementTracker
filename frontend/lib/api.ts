import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
}

export { API_BASE_URL };

export async function getCurrentUser() {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current user.");
    }

    return response.json();
}