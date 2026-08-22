import { getAccessToken } from "./auth";
import type { Expense } from "@/types/expense";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
}

export { API_BASE_URL };

type FastApiValidationError = {
    msg?: unknown;
};

async function parseApiError(
    response: Response,
    fallbackMessage: string
): Promise<Error> {
    if (response.status >= 500) {
        return new Error(fallbackMessage);
    }

    try {
        const data: unknown = await response.json();

        if (
            data &&
            typeof data === "object" &&
            "detail" in data
        ) {
            const detail = (data as { detail: unknown }).detail;

            if (typeof detail === "string" && detail.trim()) {
                return new Error(detail);
            }

            if (Array.isArray(detail)) {
                const messages = detail
                    .map((item: FastApiValidationError) =>
                        typeof item?.msg === "string" ? item.msg : null
                    )
                    .filter(Boolean);

                if (messages.length > 0) {
                    return new Error(messages.join(" "));
                }
            }
        }
    } catch {
        // Fall through to the safe generic message below.
    }

    return new Error(fallbackMessage);
}


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

export type CategorySpending = {
    category: string;
    amount: string;
    percentage: string;
};

export type ExpenseSummary = {
    total_spent: string;
    categories: CategorySpending[];
};

export type MonthlySpendingTrendMonth = {
    month: number;
    year: number;
    total_spent: string;
};

export type MonthlySpendingTrendResponse = {
    months: MonthlySpendingTrendMonth[];
};

export type BudgetSummary = {
    amount: string;
    spent: string;
    remaining: string;
    percentage_used: string;
};

export type SetBudgetRequest = {
    amount: number;
};

export type AIInsightStatus = "under_budget" | "on_track" | "over_budget";

export type AIInsightResponse = {
    status: AIInsightStatus;
    summary: string;
    recommendations: string[];
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
        throw await parseApiError(response, "Failed to fetch current user.");
    }

    return response.json();
}

export async function getExpenses(): Promise<Expense[]> {
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
        throw await parseApiError(response, "Failed to fetch expenses.");
    }
    
    return response.json();
}

export async function createExpense(
    expense: CreateExpenseRequest
): Promise<Expense> {
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
        throw await parseApiError(response, "Failed to create expense.");
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
        throw await parseApiError(response, "Failed to delete expense.");
    }
}

export async function updateExpense(
    expenseId: string,
    expense: UpdateExpenseRequest
): Promise<Expense> {
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
        throw await parseApiError(response, "Failed to update expense.");
    }

    return response.json();
}

export async function getCurrentBudget(): Promise<BudgetSummary | null> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/budgets/current`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw await parseApiError(response, "Failed to fetch current budget.");
    }

    return response.json();
}

export async function setCurrentBudget(
    budget: SetBudgetRequest
) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/budgets/current`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
    });

    if (!response.ok) {
        throw await parseApiError(response, "Failed to save budget.");
    }

    return response.json();
}

export async function getExpenseSummary(
    month?: number,
    year?: number,
): Promise<ExpenseSummary> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const params = new URLSearchParams();

    if (month) {
        params.append("month", month.toString());
    }

    if (year) {
        params.append("year", year.toString());
    }

    const query = params.toString();

    const response = await fetch(
        `${API_BASE_URL}/expenses/summary${query ? `?${query}` : ""}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw await parseApiError(response, "Failed to fetch expense summary.");
    }

    return response.json();
}

export async function getMonthlySpendingTrend(
    months = 6
): Promise<MonthlySpendingTrendResponse> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(
        `${API_BASE_URL}/expenses/monthly-trend?months=${months}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw await parseApiError(response, "Failed to fetch monthly spending trend.");
    }

    return response.json();
}

export async function getAIInsights(): Promise<AIInsightResponse> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/insights/current/ai`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw await parseApiError(response, "Failed to generate AI financial insights.");
    }

    return response.json();
}
