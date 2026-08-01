import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
}

export { API_BASE_URL };


export type CreateExpenseRequest = {
    description: string;
    amount: number;
    category: string;
    expense_date: string;
};

export type UpdateExpenseRequest = {
    description: string;
    amount: number;
    category: string;
    expense_date: string;
};

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

export async function getExpenses() {
    const token = await getAccessToken();
    
    if (!token) {
        throw new Error("User is not authenticated.");
    }
    
    const response = await fetch(`${API_BASE_URL}/expenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch expenses.");
    }
    
    return response.json();
}

export async function createExpense(expense: CreateExpenseRequest) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    });

    if (!response.ok) {
        throw new Error("Failed to create expense.");
    }

    return response.json();
}

export async function deleteExpense(expenseId: string) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete expense.");
    }
}

export async function updateExpense(
    expenseId: string,
    expense: UpdateExpenseRequest
) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    });

    if (!response.ok) {
        throw new Error("Failed to update expense.");
    }

    return response.json();
}