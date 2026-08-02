"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";

import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseTable } from "@/components/ExpenseTable";
import { SummaryCard } from "@/components/SummaryCard";
import {
    createExpense,
    deleteExpense,
    getCurrentUser,
    getExpenses,
    updateExpense,
} from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

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

    async function loadExpenses() {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    }

    function handleEdit(expense: Expense) {
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setExpenseDate(expense.expense_date);
        setEditingExpenseId(expense.id);
    }

    async function handleDelete(expenseId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteExpense(expenseId);
            await loadExpenses();
        } catch (error) {
            console.error(error);
        }
    }

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
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
                            FT
                        </div>
                        <p className="text-sm font-semibold text-stone-950">
                            Finance Tracker
                        </p>
                    </div>

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
                        <ExpenseForm
                            description={description}
                            amount={amount}
                            category={category}
                            expenseDate={expenseDate}
                            isEditing={Boolean(editingExpenseId)}
                            onDescriptionChange={setDescription}
                            onAmountChange={setAmount}
                            onCategoryChange={setCategory}
                            onExpenseDateChange={setExpenseDate}
                            onSubmit={handleSubmit}
                            onCancelEdit={resetForm}
                        />

                        <ExpenseTable
                            expenses={expenses}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}
