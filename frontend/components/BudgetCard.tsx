import type { FormEvent } from "react";

import { ButtonSpinner } from "@/components/ButtonSpinner";
import type { BudgetSummary } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";

type BudgetCardProps = {
    budget: BudgetSummary | null;
    budgetAmount: string;
    budgetUsedPercentage: number;
    isSubmitting: boolean;
    error: string | null;
    onBudgetAmountChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BudgetCard({
    budget,
    budgetAmount,
    budgetUsedPercentage,
    isSubmitting,
    error,
    onBudgetAmountChange,
    onSubmit,
}: BudgetCardProps) {
    const isHighUsage = budget ? Number(budget.percentage_used) >= 85 : false;

    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <p className="text-sm font-medium text-[#66727A]">Monthly budget</p>
                    <h2 className="mt-1 text-4xl font-semibold tracking-tight text-[#1E2A32]">
                        {budget ? formatMoney(budget.amount) : "No budget set"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#66727A]">
                        Set a monthly spending target and track progress as expenses change.
                    </p>

                    {budget ? (
                        <>
                            <div
                                className="mt-6 h-3 rounded-full bg-[#F5F7F6]"
                                aria-label={`Budget used: ${Number(budget.percentage_used).toFixed(1)}%`}
                            >
                                <div
                                    className={`h-3 rounded-full transition-all ${
                                        isHighUsage ? "bg-[#D59A42]" : "bg-[#3E8C7A]"
                                    }`}
                                    style={{ width: `${budgetUsedPercentage}%` }}
                                />
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <BudgetMetric label="Spent" value={formatMoney(budget.spent)} />
                                <BudgetMetric
                                    label="Remaining"
                                    value={formatMoney(budget.remaining)}
                                />
                                <BudgetMetric
                                    label="Used"
                                    value={`${Number(budget.percentage_used).toFixed(1)}%`}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="mt-6 rounded-2xl bg-[#F5F7F6] p-4 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5]">
                            Add a budget to compare current spending against a clear monthly target.
                        </div>
                    )}
                </div>

                <form
                    onSubmit={onSubmit}
                    className="rounded-2xl bg-[#F5F7F6] p-4 ring-1 ring-[#E2E8E5]"
                >
                    <label className="block">
                        <span className="text-sm font-medium text-[#1E2A32]">
                            Budget amount
                        </span>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={budgetAmount}
                            onChange={(event) => onBudgetAmountChange(event.target.value)}
                            className="mt-2 min-h-11 w-full rounded-xl border border-[#E2E8E5] bg-white px-4 py-3 text-sm text-[#1E2A32] outline-none transition placeholder:text-[#66727A]/70 hover:border-[#3E8C7A] focus:border-[#3E8C7A] focus:bg-white focus:ring-4 focus:ring-[#E5F2EE]"
                            required
                        />
                    </label>

                    {error && (
                        <div
                            role="alert"
                            className="mt-3 rounded-2xl bg-[#FDF2F2] px-4 py-3 text-sm font-medium leading-6 text-[#C65B5B] ring-1 ring-[#F4D1D1]"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#17324D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10263A] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting && <ButtonSpinner />}
                        {isSubmitting ? "Saving..." : budget ? "Update budget" : "Set budget"}
                    </button>
                </form>
            </div>
        </section>
    );
}

function BudgetMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-[#F5F7F6] p-4 ring-1 ring-[#E2E8E5]">
            <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                {label}
            </p>
            <p className="mt-1 text-base font-semibold text-[#1E2A32]">{value}</p>
        </div>
    );
}
