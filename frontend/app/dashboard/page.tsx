"use client";

import { useEffect, useMemo, useState } from "react";
import {
    createExpense,
    deleteExpense,
    getCurrentUser,
    getExpenses,
    updateExpense,
} from "@/lib/api";
import type { User } from "@supabase/supabase-js";

type Expense = {
    id: string;
    user_id: string;
    description: string;
    amount: string;
    category: string;
    expense_date: string;
    created_at: string;
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

function formatMoney(amount: string | number) {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return moneyFormatter.format(0);
    }

    return moneyFormatter.format(value);
}

function formatDate(date: string) {
    const value = new Date(`${date}T00:00:00`);

    if (Number.isNaN(value.getTime())) {
        return date;
    }

    return dateFormatter.format(value);
}

function SummaryCard({
    label,
    value,
    detail,
}: {
    label: string;
    value: string;
    detail: string;
}) {
    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(31,27,22,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(31,27,22,0.09)]">
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                {value}
            </p>
            <p className="mt-2 text-sm text-stone-500">{detail}</p>
        </article>
    );
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

    const summary = useMemo(() => {
        const totalExpenses = expenses.reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0
        );

        const largestExpense = expenses.reduce<Expense | null>((largest, expense) => {
            if (!largest) {
                return expense;
            }

            return Number(expense.amount) > Number(largest.amount) ? expense : largest;
        }, null);

        const mostRecentExpense = expenses.reduce<Expense | null>((latest, expense) => {
            if (!latest) {
                return expense;
            }

            return new Date(expense.expense_date) > new Date(latest.expense_date)
                ? expense
                : latest;
        }, null);

        return {
            totalExpenses,
            count: expenses.length,
            largestExpense,
            mostRecentExpense,
        };
    }, [expenses]);

    function resetForm() {
        setDescription("");
        setAmount("");
        setCategory("");
        setExpenseDate("");
        setEditingExpenseId(null);
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            if (editingExpenseId) {
                await updateExpense(editingExpenseId, {
                    description,
                    amount: Number(amount),
                    category,
                    expense_date: expenseDate,
                });
            } else {
                await createExpense({
                    description,
                    amount: Number(amount),
                    category,
                    expense_date: expenseDate,
                });
            }

            await loadExpenses();

            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (expense: Expense) => {
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setExpenseDate(expense.expense_date);
        setEditingExpenseId(expense.id);
    };
    
    const handleDelete = async (expenseId: string) => {
        try {
            await deleteExpense(expenseId);

            await loadExpenses();
        } catch (error) {
            console.error(error);
        }
    };

    const loadExpenses = async () => {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
    };
    
    useEffect(() => {
        async function loadDashboard() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                await loadExpenses();
                
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

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
                <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-sm font-medium text-stone-600 shadow-sm">
                    Loading dashboard...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
                <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700 shadow-sm">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f4ef] text-stone-950">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
                <aside className="border-b border-stone-200 bg-white/75 px-5 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
                    <div className="flex items-center justify-between lg:block">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
                                    FT
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-950">
                                        Finance Tracker
                                    </p>
                                    <p className="text-xs text-stone-500">Personal dashboard</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-5 flex gap-2 overflow-x-auto lg:mt-10 lg:block lg:space-y-2">
                        {["Dashboard", "Expenses", "Reports", "Settings"].map((item) => (
                            <a
                                key={item}
                                href={item === "Dashboard" ? "/dashboard" : "#"}
                                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                    item === "Dashboard"
                                        ? "bg-stone-950 text-white shadow-sm"
                                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                                }`}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {user && (
                        <div className="mt-6 hidden rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:block">
                            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Signed in
                            </p>
                            <p className="mt-2 truncate text-sm font-medium text-stone-800">
                                {user.email}
                            </p>
                        </div>
                    )}
                </aside>

                <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                    <header className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-stone-500">
                                Overview
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                                Dashboard
                            </h1>
                            {user && (
                                <p className="mt-2 text-sm text-stone-500 md:hidden">
                                    Signed in as {user.email}
                                </p>
                            )}
                        </div>

                        <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm">
                            {expenses.length} tracked expenses
                        </div>
                    </header>

                    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            label="Total Expenses"
                            value={formatMoney(summary.totalExpenses)}
                            detail="All tracked spending"
                        />
                        <SummaryCard
                            label="Number of Expenses"
                            value={String(summary.count)}
                            detail="Saved transactions"
                        />
                        <SummaryCard
                            label="Largest Expense"
                            value={
                                summary.largestExpense
                                    ? formatMoney(summary.largestExpense.amount)
                                    : formatMoney(0)
                            }
                            detail={summary.largestExpense?.description ?? "No expense yet"}
                        />
                        <SummaryCard
                            label="Most Recent Expense"
                            value={
                                summary.mostRecentExpense
                                    ? formatMoney(summary.mostRecentExpense.amount)
                                    : formatMoney(0)
                            }
                            detail={
                                summary.mostRecentExpense
                                    ? formatDate(summary.mostRecentExpense.expense_date)
                                    : "No expense yet"
                            }
                        />
                    </section>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(31,27,22,0.06)]">
                            <div>
                                <p className="text-sm font-medium text-stone-500">
                                    Expense entry
                                </p>
                                <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
                                    {editingExpenseId ? "Edit expense" : "Add expense"}
                                </h2>
                            </div>

                            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                <label className="block">
                                    <span className="text-sm font-medium text-stone-700">
                                        Description
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Coffee, groceries, ride..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-stone-700">
                                        Amount
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-stone-700">
                                        Category
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Food"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-stone-700">
                                        Date
                                    </span>
                                    <input
                                        type="date"
                                        value={expenseDate}
                                        onChange={(e) => setExpenseDate(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                                    />
                                </label>

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="submit"
                                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
                                    >
                                        {editingExpenseId ? "Update Expense" : "Create Expense"}
                                    </button>

                                    {editingExpenseId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-stone-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="rounded-2xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(31,27,22,0.06)]">
                            <div className="flex flex-col gap-2 border-b border-stone-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-500">
                                        Expense management
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
                                        Transactions
                                    </h2>
                                </div>
                                <p className="text-sm text-stone-500">
                                    Sorted by date from the API
                                </p>
                            </div>

                            {expenses.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <p className="text-base font-medium text-stone-800">
                                        No expenses found.
                                    </p>
                                    <p className="mt-2 text-sm text-stone-500">
                                        Add your first expense to start building the dashboard.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-[720px] w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-stone-200 bg-stone-50/80 text-xs uppercase tracking-wide text-stone-500">
                                                <th className="px-5 py-3 font-semibold">Description</th>
                                                <th className="px-5 py-3 font-semibold">Category</th>
                                                <th className="px-5 py-3 font-semibold">Date</th>
                                                <th className="px-5 py-3 text-right font-semibold">Amount</th>
                                                <th className="px-5 py-3 text-right font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {expenses.map((expense) => (
                                                <tr
                                                    key={expense.id}
                                                    className="transition hover:bg-stone-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="font-medium text-stone-950">
                                                            {expense.description}
                                                        </p>
                                                        <p className="mt-1 text-xs text-stone-400">
                                                            ID {expense.id.slice(0, 8)}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
                                                            {expense.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-stone-600">
                                                        {formatDate(expense.expense_date)}
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-sm font-semibold text-stone-950">
                                                        {formatMoney(expense.amount)}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEdit(expense)}
                                                                className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-stone-200"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(expense.id)}
                                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </section>
            </div>
        </main>
    );
}
