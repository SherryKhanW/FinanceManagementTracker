"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";

import SpendingByCategoryChart from "@/components/SpendingByCategoryChart";
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
    type BudgetSummary,
    type ExpenseSummary,
} from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

const cardClassName =
    "rounded-2xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(31,27,22,0.06)]";

export default function DashboardPage() {
    const currentDate = new Date();
    const [user, setUser] = useState<User | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
    const [budget, setBudget] = useState<BudgetSummary | null>(null);
    const [budgetAmount, setBudgetAmount] = useState("");
    const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(
        currentDate.getFullYear()
    );

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

    const budgetUsedPercentage = budget
        ? Math.min(Number(budget.percentage_used), 100)
        : 0;

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
            await loadBudget();
            await loadExpenseSummary();
            
            resetForm();
        } catch (error) {
            console.error(error);
        }
    }

    const handleBudgetSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            await setCurrentBudget({
                amount: Number(budgetAmount),
            });

            await loadBudget();
        } catch (error) {
            console.error(error);
        }
    };

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
            await loadBudget();
            await loadExpenseSummary();
            
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
                await loadBudget();
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
        loadExpenseSummary();
    }, [selectedMonth, selectedYear]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-6">
                <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(31,27,22,0.06)]">
                    <div className="h-3 w-24 rounded-full bg-stone-200" />
                    <div className="mt-4 h-8 w-48 rounded-full bg-stone-100" />
                    <div className="mt-6 space-y-3">
                        <div className="h-4 rounded-full bg-stone-100" />
                        <div className="h-4 w-3/4 rounded-full bg-stone-100" />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-6">
                <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700 shadow-sm">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f4ef] text-stone-950">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
                <aside className="border-b border-stone-200 bg-white/80 px-5 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
                    <div className="flex items-center gap-3 rounded-2xl bg-stone-950 p-3 text-white shadow-sm">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
                            FT
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Kesa Paisa?</p>
                            <p className="text-xs text-stone-300">Monthly overview</p>
                        </div>
                    </div>

                    {user && (
                        <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Signed in
                            </p>
                            <p className="mt-2 truncate text-sm font-medium text-stone-800">
                                {user.email}
                            </p>
                        </div>
                    )}

                    {budget && (
                        <div className="mt-5 hidden rounded-2xl border border-stone-200 bg-white p-4 lg:block">
                            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Budget used
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                                {Number(budget.percentage_used).toFixed(0)}%
                            </p>
                            <div className="mt-4 h-2 rounded-full bg-stone-100">
                                <div
                                    className="h-2 rounded-full bg-stone-950"
                                    style={{ width: `${budgetUsedPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </aside>

                <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                    <header className={`${cardClassName} p-6 md:p-7`}>
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-500">
                                    Overview
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                                    Dashboard
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                                    Track spending, manage this month&apos;s budget, and keep
                                    recent expenses organized in one place.
                                </p>
                                {user && (
                                    <p className="mt-3 text-sm text-stone-500 md:hidden">
                                        Signed in as {user.email}
                                    </p>
                                )}
                            </div>

                            <div className="inline-flex w-fit rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-600">
                                {expenses.length} tracked expenses
                            </div>
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

                    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                        <section className={`${cardClassName} p-5`}>
                        <div>
                            <p className="text-sm font-medium text-stone-500">
                                Monthly Budget
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
                                {budget
                                    ? formatMoney(budget.amount)
                                    : "No budget set"}
                            </h2>
                            <p className="mt-2 text-sm text-stone-500">
                                Set a monthly spending target.
                            </p>
                        </div>

                        {budget && (
                            <>
                                <div className="mt-5 h-2 rounded-full bg-stone-100">
                                    <div
                                        className="h-2 rounded-full bg-stone-950 transition-all"
                                        style={{ width: `${budgetUsedPercentage}%` }}
                                    />
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                                    <div className="rounded-xl bg-stone-50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Spent
                                        </p>
                                        <p className="mt-1 font-semibold text-stone-950">
                                            {formatMoney(budget.spent)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-stone-50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Remaining
                                        </p>
                                        <p className="mt-1 font-semibold text-stone-950">
                                            {formatMoney(budget.remaining)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-stone-50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Used
                                        </p>
                                        <p className="mt-1 font-semibold text-stone-950">
                                            {Number(budget.percentage_used).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                            <form
                                onSubmit={handleBudgetSubmit}
                                className="mt-6 flex flex-col gap-3 sm:flex-row xl:flex-col"
                            >
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Monthly budget"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
                                >
                                    {budget ? "Update Budget" : "Set Budget"}
                                </button>
                            </form>
                        </section>

                        <section className={`${cardClassName} p-5`}>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-500">
                                        Spending Analytics
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
                                        Spending by Category
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedMonth}
                                        onChange={(event) =>
                                            setSelectedMonth(Number(event.target.value))
                                        }
                                        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700"
                                    >
                                        <option value={1}>January</option>
                                        <option value={2}>February</option>
                                        <option value={3}>March</option>
                                        <option value={4}>April</option>
                                        <option value={5}>May</option>
                                        <option value={6}>June</option>
                                        <option value={7}>July</option>
                                        <option value={8}>August</option>
                                        <option value={9}>September</option>
                                        <option value={10}>October</option>
                                        <option value={11}>November</option>
                                        <option value={12}>December</option>
                                    </select>

                                    {expenseSummary && (
                                        <p className="text-sm font-medium text-stone-500">
                                            {formatMoney(expenseSummary.total_spent)} total
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                {expenseSummary?.categories?.length > 0 ? (
                                    <SpendingByCategoryChart
                                        categories={expenseSummary.categories}
                                    />
                                ) : (
                                    <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 text-sm text-stone-500">
                                        Add expenses to see category spending.
                                    </div>
                                )}
                            </div>
                        </section>
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
