"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";

import { AIInsightsCard } from "@/components/AIInsightsCard";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { BudgetCard } from "@/components/BudgetCard";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseTable } from "@/components/ExpenseTable";
import { SummaryCard } from "@/components/SummaryCard";
import {
    createExpense,
    deleteExpense,
    getCurrentUser,
    getExpenses,
    updateExpense,
    getCurrentBudget,
    setCurrentBudget,
    getExpenseSummary,
    getAIInsights,
    getMonthlySpendingTrend,
    type AIInsightResponse,
    type BudgetSummary,
    type ExpenseSummary,
    type MonthlySpendingTrendMonth,
} from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

const cardClassName =
    "rounded-2xl bg-white shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]";

type DashboardTab = "overview" | "expenses" | "budget" | "analytics" | "insights";

type ValidatedExpenseInput = {
    description: string;
    amount: number;
    category: string;
    expense_date: string;
};

const dashboardTabs: Array<{
    id: DashboardTab;
    label: string;
    description: string;
}> = [
    {
        id: "overview",
        label: "Overview",
        description: "Monthly snapshot",
    },
    {
        id: "expenses",
        label: "Expenses",
        description: "Add and manage",
    },
    {
        id: "budget",
        label: "Budget",
        description: "Target and usage",
    },
    {
        id: "analytics",
        label: "Analytics",
        description: "Trends and categories",
    },
    {
        id: "insights",
        label: "AI insights",
        description: "Monthly guidance",
    },
];

const pageCopy: Record<DashboardTab, { title: string; subtitle: string; eyebrow: string }> = {
    overview: {
        eyebrow: "Overview",
        title: "Dashboard",
        subtitle:
            "A focused view of this month’s spending, budget progress, recent expenses, and AI guidance.",
    },
    expenses: {
        eyebrow: "Transactions",
        title: "Expenses",
        subtitle: "Add, edit, and review the expenses that power your dashboard.",
    },
    budget: {
        eyebrow: "Planning",
        title: "Monthly Budget",
        subtitle: "Track spending against your current monthly target.",
    },
    analytics: {
        eyebrow: "Analysis",
        title: "Analytics",
        subtitle: "Review category spending and prepare for monthly trend analysis.",
    },
    insights: {
        eyebrow: "AI guidance",
        title: "AI Financial Insights",
        subtitle: "Generate concise guidance based on your current spending and budget.",
    },
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error.message : fallbackMessage;
}

function validateExpenseInput(
    description: string,
    amount: string,
    category: string,
    expenseDate: string
): { data: ValidatedExpenseInput; error: null } | { data: null; error: string } {
    const trimmedDescription = description.trim();
    const parsedAmount = Number(amount);

    if (!trimmedDescription) {
        return { data: null, error: "Please enter a description." };
    }

    if (!amount.trim() || Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return { data: null, error: "Please enter an amount greater than 0." };
    }

    if (!category) {
        return { data: null, error: "Please select a category." };
    }

    if (!expenseDate) {
        return { data: null, error: "Please select a date." };
    }

    return {
        data: {
            description: trimmedDescription,
            amount: parsedAmount,
            category,
            expense_date: expenseDate,
        },
        error: null,
    };
}

function validatePositiveAmount(
    value: string,
    emptyMessage: string,
    invalidMessage: string
): { amount: number; error: null } | { amount: null; error: string } {
    const parsedAmount = Number(value);

    if (!value.trim()) {
        return { amount: null, error: emptyMessage };
    }

    if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return { amount: null, error: invalidMessage };
    }

    return { amount: parsedAmount, error: null };
}

export default function DashboardPage() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [expenseFormError, setExpenseFormError] = useState<string | null>(null);
    const [expenseDeleteError, setExpenseDeleteError] = useState<string | null>(null);
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
    const [budget, setBudget] = useState<BudgetSummary | null>(null);
    const [budgetAmount, setBudgetAmount] = useState("");
    const [budgetError, setBudgetError] = useState<string | null>(null);
    const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
    const [monthlyTrend, setMonthlyTrend] = useState<MonthlySpendingTrendMonth[]>([]);
    const [monthlyTrendLoading, setMonthlyTrendLoading] = useState(false);
    const [monthlyTrendError, setMonthlyTrendError] = useState<string | null>(null);
    const [aiInsights, setAiInsights] = useState<AIInsightResponse | null>(null);
    const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
    const [aiInsightsError, setAiInsightsError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(
        currentMonth + 1
    );
    const selectedYear = currentYear;

    const currentMonthExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.expense_date);

            return (
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
            );
        });
    }, [expenses, currentMonth, currentYear]);

    const recentExpenses = useMemo(() => {
        return [...expenses]
            .sort(
                (first, second) =>
                    new Date(second.expense_date).getTime() -
                    new Date(first.expense_date).getTime()
            )
            .slice(0, 5);
    }, [expenses]);

    const topCategories = useMemo(() => {
        return expenseSummary?.categories.slice(0, 4) ?? [];
    }, [expenseSummary]);

    const summary = useMemo(() => {
        const totalExpenses = currentMonthExpenses.reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0
        );

        return {
            totalExpenses,
            count: currentMonthExpenses.length,
        };
    }, [currentMonthExpenses]);

    const headerCopy = pageCopy[activeTab];

    const budgetUsedPercentage = budget
        ? Math.min(Number(budget.percentage_used), 100)
        : 0;

    function resetForm() {
        setDescription("");
        setAmount("");
        setCategory("");
        setExpenseDate("");
        setEditingExpenseId(null);
        setExpenseFormError(null);
    }

    async function loadExpenses() {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
    }

    const loadBudget = async () => {
        const budgetData = await getCurrentBudget();
        setBudget(budgetData);

        if (budgetData) {
            setBudgetAmount(budgetData.amount);
        }
    };

    const loadExpenseSummary = async () => {
        const summaryData = await getExpenseSummary(
            selectedMonth,
            selectedYear
        );
        
        setExpenseSummary(summaryData);
    };

    const loadMonthlySpendingTrend = async () => {
        setMonthlyTrendLoading(true);
        setMonthlyTrendError(null);

        try {
            const trendData = await getMonthlySpendingTrend(6);
            setMonthlyTrend(trendData.months);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setMonthlyTrendError(error.message);
            } else {
                setMonthlyTrendError("Failed to fetch monthly spending trend.");
            }
        } finally {
            setMonthlyTrendLoading(false);
        }
    };

    const refreshDashboardDataAfterMutation = async () => {
        const results = await Promise.allSettled([
            loadExpenses(),
            loadBudget(),
            loadExpenseSummary(),
            loadMonthlySpendingTrend(),
        ]);

        const failedRefreshes = results.filter(
            (result) => result.status === "rejected"
        );

        if (failedRefreshes.length > 0) {
            console.error("Some dashboard data failed to refresh.", failedRefreshes);
        }
    };

    async function handleGenerateInsights() {
        setAiInsightsLoading(true);
        setAiInsightsError(null);

        try {
            const insights = await getAIInsights();
            setAiInsights(insights);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setAiInsightsError(error.message);
            } else {
                setAiInsightsError("Failed to generate AI financial insights.");
            }
        } finally {
            setAiInsightsLoading(false);
        }
    }
    
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setExpenseFormError(null);
        setExpenseDeleteError(null);

        const validation = validateExpenseInput(
            description,
            amount,
            category,
            expenseDate
        );

        if (!validation.data) {
            setExpenseFormError(validation.error);
            return;
        }

        try {
            if (editingExpenseId) {
                await updateExpense(editingExpenseId, validation.data);
            } else {
                await createExpense(validation.data);
            }

            resetForm();
            await refreshDashboardDataAfterMutation();
            
        } catch (error) {
            console.error(error);
            setExpenseFormError(
                getErrorMessage(error, "Unable to save expense. Please try again.")
            );
        }
    }

    const handleBudgetSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setBudgetError(null);

        const validation = validatePositiveAmount(
            budgetAmount,
            "Please enter a budget amount.",
            "Please enter a budget greater than 0."
        );

        if (validation.amount === null) {
            setBudgetError(validation.error);
            return;
        }

        try {
            await setCurrentBudget({
                amount: validation.amount,
            });

            await loadBudget();
        } catch (error) {
            console.error(error);
            setBudgetError(
                getErrorMessage(error, "Unable to save budget. Please try again.")
            );
        }
    };

    function handleEdit(expense: Expense) {
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setExpenseDate(expense.expense_date);
        setEditingExpenseId(expense.id);
        setExpenseFormError(null);
        setExpenseDeleteError(null);
        setActiveTab("expenses");
    }

    async function handleDelete(expenseId: string) {
        setExpenseDeleteError(null);
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteExpense(expenseId);
            
            resetForm();
            await refreshDashboardDataAfterMutation();
            
        } catch (error) {
            console.error(error);
            setExpenseDeleteError(
                getErrorMessage(error, "Unable to delete expense. Please try again.")
            );
        }
    }

    useEffect(() => {
        async function loadDashboard() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                await Promise.all([
                    loadExpenses(),
                    loadBudget(),
                    loadMonthlySpendingTrend(),
                ]);
            } catch (error) {
                console.error(error);

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Something went wrong.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    useEffect(() => {
        async function refreshExpenseSummary() {
            try {
                const summaryData = await getExpenseSummary(
                    selectedMonth,
                    selectedYear
                );

                setExpenseSummary(summaryData);
            } catch (error) {
                console.error(error);
                setExpenseSummary(null);
            }
        }

        refreshExpenseSummary();
    }, [selectedMonth, selectedYear]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F5F7F6] px-6">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
                    <div className="h-3 w-24 rounded-full bg-[#E2E8E5]" />
                    <div className="mt-4 h-8 w-48 rounded-full bg-[#F5F7F6]" />
                    <div className="mt-6 space-y-3">
                        <div className="h-4 rounded-full bg-[#F5F7F6]" />
                        <div className="h-4 w-3/4 rounded-full bg-[#F5F7F6]" />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F5F7F6] px-6">
                <div className="max-w-md rounded-2xl bg-[#FDF2F2] px-6 py-5 text-sm font-medium leading-6 text-[#C65B5B] shadow-sm ring-1 ring-[#F4D1D1]">
                    Unable to load dashboard. {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F7F6] text-[#1E2A32]">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
                <aside className="border-b border-[#E2E8E5] bg-white/80 px-5 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
                    <div className="flex items-center gap-3">
                        <div
                            className="kp-logo group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#17324D] text-sm font-bold tracking-tight text-white shadow-[0_12px_28px_rgba(23,50,77,0.18)] ring-1 ring-[#17324D]/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(23,50,77,0.24)]"
                            aria-label="Kesa Paisa logo"
                        >
                            <span className="kp-logo-shine" aria-hidden="true" />
                            <span className="relative z-10">KP</span>
                            <span
                                className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-[#3E8C7A] ring-2 ring-white"
                                aria-hidden="true"
                            />
                        </div>
                        <div>
                            <p className="text-base font-semibold tracking-tight text-[#17324D]">
                                Kesa Paisa?
                            </p>
                            <p className="text-xs text-[#66727A]">
                                Akhir kidhr gya paisa?
                            </p>
                        </div>
                    </div>

                    {user && (
                        <div className="mt-5 rounded-2xl bg-[#F5F7F6] p-3 ring-1 ring-[#E2E8E5]">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                Signed in
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-[#1E2A32]">
                                {user.email}
                            </p>
                        </div>
                    )}

                    {budget && (
                        <div className="mt-4 hidden rounded-2xl bg-[#F5F7F6] p-3 ring-1 ring-[#E2E8E5] lg:block">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                Budget used
                            </p>
                            <p className="mt-1 text-xl font-semibold tracking-tight text-[#17324D]">
                                {Number(budget.percentage_used).toFixed(0)}%
                            </p>
                            <div className="mt-3 h-2 rounded-full bg-white">
                                <div
                                    className="h-2 rounded-full bg-[#3E8C7A]"
                                    style={{ width: `${budgetUsedPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <nav className="mt-6 hidden space-y-1.5 lg:block" aria-label="Dashboard sections">
                        {dashboardTabs.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative w-full rounded-xl px-3.5 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-[#E5F2EE] ${
                                        isActive
                                            ? "bg-[#E5F2EE] text-[#17324D]"
                                            : "text-[#66727A] hover:bg-[#F5F7F6] hover:text-[#17324D]"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-3 h-7 w-1 rounded-r-full bg-[#3E8C7A]" />
                                    )}
                                    <span className="block text-sm font-semibold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`mt-0.5 block text-xs ${
                                            isActive ? "text-[#3E8C7A]" : "text-[#66727A]/75"
                                        }`}
                                    >
                                        {tab.description}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                <section className="flex-1 px-4 py-5 sm:px-8 lg:px-10 lg:py-8">
                    <header className="px-1">
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#66727A]">
                                    {headerCopy.eyebrow}
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1E2A32] sm:text-4xl">
                                    {headerCopy.title}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66727A]">
                                    {headerCopy.subtitle}
                                </p>
                                {user && (
                                    <p className="mt-3 text-sm text-[#66727A] md:hidden">
                                        Signed in as {user.email}
                                    </p>
                                )}
                            </div>

                            {(activeTab === "overview" || activeTab === "expenses") && (
                                <div className="inline-flex min-h-10 w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#66727A] ring-1 ring-[#E2E8E5]">
                                    {expenses.length} tracked expenses
                                </div>
                            )}
                        </div>
                    </header>

                    <div
                        className="mt-6 overflow-x-auto rounded-2xl bg-white p-2 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5] lg:hidden"
                        role="tablist"
                        aria-label="Dashboard sections"
                    >
                        <div className="flex min-w-max gap-2">
                            {dashboardTabs.map((tab) => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#E5F2EE] ${
                                            isActive
                                                ? "bg-[#E5F2EE] text-[#17324D]"
                                                : "text-[#66727A] hover:bg-[#F5F7F6] hover:text-[#17324D]"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <section className="mt-6" role="tabpanel">
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <SummaryCard
                                        label="Total spending this month"
                                        value={formatMoney(summary.totalExpenses)}
                                        detail="Current month"
                                    />
                                    <SummaryCard
                                        label="Number of expenses"
                                        value={String(summary.count)}
                                        detail="This month"
                                    />
                                    <SummaryCard
                                        label="Remaining monthly budget"
                                        value={
                                            budget
                                                ? formatMoney(budget.remaining)
                                                : formatMoney(0)
                                        }
                                        detail={budget ? "After tracked spending" : "No budget set"}
                                    />
                                    <SummaryCard
                                        label="Budget usage"
                                        value={
                                            budget
                                                ? `${Number(budget.percentage_used).toFixed(1)}%`
                                                : "0.0%"
                                        }
                                        detail={budget ? "Used this month" : "Set a target to track usage"}
                                    />
                                </section>

                                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                                    <div className={`${cardClassName} p-5`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-[#66727A]">
                                                    Monthly budget progress
                                                </p>
                                                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                                                    {budget ? formatMoney(budget.amount) : "No budget set"}
                                                </h2>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("budget")}
                                                className="min-h-10 rounded-xl px-3 py-2 text-sm font-semibold text-[#17324D] transition hover:bg-[#E5F2EE] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                                            >
                                                Manage
                                            </button>
                                        </div>

                                        {budget ? (
                                            <>
                                                <div className="mt-5 h-3 rounded-full bg-[#F5F7F6]">
                                                    <div
                                                        className={`h-3 rounded-full ${
                                                            Number(budget.percentage_used) >= 85
                                                                ? "bg-[#D59A42]"
                                                                : "bg-[#3E8C7A]"
                                                        }`}
                                                        style={{ width: `${budgetUsedPercentage}%` }}
                                                    />
                                                </div>
                                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                                            Spent
                                                        </p>
                                                        <p className="mt-1 font-semibold text-[#1E2A32]">
                                                            {formatMoney(budget.spent)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                                            Remaining
                                                        </p>
                                                        <p className="mt-1 font-semibold text-[#1E2A32]">
                                                            {formatMoney(budget.remaining)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                                            Used
                                                        </p>
                                                        <p className="mt-1 font-semibold text-[#1E2A32]">
                                                            {Number(budget.percentage_used).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="mt-5 rounded-2xl bg-[#F5F7F6] p-4 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5]">
                                                Add a monthly budget to make this overview more useful.
                                            </p>
                                        )}
                                    </div>

                                    <div className={`${cardClassName} p-5`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-[#66727A]">
                                                    Spending by category
                                                </p>
                                                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                                                    {formatMoney(expenseSummary?.total_spent ?? 0)}
                                                </h2>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("analytics")}
                                                className="min-h-10 rounded-xl px-3 py-2 text-sm font-semibold text-[#17324D] transition hover:bg-[#E5F2EE] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                                            >
                                                View
                                            </button>
                                        </div>

                                        {topCategories.length > 0 ? (
                                            <div className="mt-5 space-y-3">
                                                {topCategories.map((category) => (
                                                    <div key={category.category}>
                                                        <div className="flex items-center justify-between gap-3 text-sm">
                                                            <span className="font-medium text-[#1E2A32]">
                                                                {category.category}
                                                            </span>
                                                            <span className="text-[#66727A]">
                                                                {formatMoney(category.amount)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-2 rounded-full bg-[#F5F7F6]">
                                                            <div
                                                                className="h-2 rounded-full bg-[#3E8C7A]"
                                                                style={{
                                                                    width: `${Math.min(Number(category.percentage), 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-5 rounded-2xl bg-[#F5F7F6] p-4 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5]">
                                                Add expenses to see category distribution for this month.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                                    <div className={`${cardClassName} p-5`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-[#66727A]">
                                                    Recent transactions
                                                </p>
                                                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1E2A32]">
                                                    Latest activity
                                                </h2>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("expenses")}
                                                className="min-h-10 rounded-xl px-3 py-2 text-sm font-semibold text-[#17324D] transition hover:bg-[#E5F2EE] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                                            >
                                                Add expense
                                            </button>
                                        </div>

                                        {recentExpenses.length > 0 ? (
                                            <div className="mt-4 divide-y divide-[#E2E8E5]">
                                                {recentExpenses.map((expense) => (
                                                    <div
                                                        key={expense.id}
                                                        className="flex items-center justify-between gap-4 py-3"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#1E2A32]">
                                                                {expense.description}
                                                            </p>
                                                            <p className="mt-1 text-xs text-[#66727A]">
                                                                {expense.category} · {formatDate(expense.expense_date)}
                                                            </p>
                                                        </div>
                                                        <p className="shrink-0 text-sm font-semibold text-[#1E2A32]">
                                                            {formatMoney(expense.amount)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-4 rounded-2xl bg-[#F5F7F6] p-4 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5]">
                                                No expenses yet. Add one to start building your monthly picture.
                                            </p>
                                        )}
                                    </div>

                                    <div className={`${cardClassName} bg-[#FDFEFE] p-5`}>
                                        <p className="text-sm font-medium text-[#66727A]">
                                            AI insight preview
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1E2A32]">
                                            {aiInsights ? "Guidance is ready" : "Generate monthly guidance"}
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-[#66727A]">
                                            {aiInsights
                                                ? aiInsights.summary
                                                : "Use current expenses, category totals, and budget data to create one concise monthly summary."}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("insights")}
                                            className="mt-4 min-h-11 rounded-xl bg-[#17324D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10263A] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                                        >
                                            Open AI insights
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "expenses" && (
                            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                                <ExpenseForm
                                    description={description}
                                    amount={amount}
                                    category={category}
                                    expenseDate={expenseDate}
                                    isEditing={Boolean(editingExpenseId)}
                                    error={expenseFormError}
                                    onDescriptionChange={setDescription}
                                    onAmountChange={setAmount}
                                    onCategoryChange={setCategory}
                                    onExpenseDateChange={setExpenseDate}
                                    onSubmit={handleSubmit}
                                    onCancelEdit={resetForm}
                                />

                                <ExpenseTable
                                    expenses={expenses}
                                    error={expenseDeleteError}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}

                        {activeTab === "budget" && (
                            <BudgetCard
                                budget={budget}
                                budgetAmount={budgetAmount}
                                budgetUsedPercentage={budgetUsedPercentage}
                                error={budgetError}
                                onBudgetAmountChange={setBudgetAmount}
                                onSubmit={handleBudgetSubmit}
                            />
                        )}

                        {activeTab === "analytics" && (
                            <AnalyticsCard
                                expenseSummary={expenseSummary}
                                monthlyTrend={monthlyTrend}
                                monthlyTrendLoading={monthlyTrendLoading}
                                monthlyTrendError={monthlyTrendError}
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                onMonthChange={setSelectedMonth}
                            />
                        )}

                        {activeTab === "insights" && (
                            <AIInsightsCard
                                insights={aiInsights}
                                loading={aiInsightsLoading}
                                error={aiInsightsError}
                                onGenerate={handleGenerateInsights}
                            />
                        )}
                    </section>
                </section>
            </div>
        </main>
    );
}
