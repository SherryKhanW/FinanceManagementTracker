import SpendingByCategoryChart from "@/components/SpendingByCategoryChart";
import { MonthlyTrendCard } from "@/components/MonthlyTrendCard";
import type { ExpenseSummary, MonthlySpendingTrendMonth } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";

type AnalyticsCardProps = {
    expenseSummary: ExpenseSummary | null;
    monthlyTrend: MonthlySpendingTrendMonth[];
    monthlyTrendLoading: boolean;
    monthlyTrendError: string | null;
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
};

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function AnalyticsCard({
    expenseSummary,
    monthlyTrend,
    monthlyTrendLoading,
    monthlyTrendError,
    selectedMonth,
    selectedYear,
    onMonthChange,
}: AnalyticsCardProps) {
    const hasCategories = Boolean(expenseSummary?.categories.length);

    return (
        <div className="space-y-5">
            <MonthlyTrendCard
                trendData={monthlyTrend}
                loading={monthlyTrendLoading}
                error={monthlyTrendError}
            />

            <section className="rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#66727A]">
                            Category spending
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                            Selected month
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#66727A]">
                            Compare category totals for the selected month.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <label className="block">
                            <span className="text-sm font-medium text-[#1E2A32]">
                                Month
                            </span>
                            <select
                                value={selectedMonth}
                                onChange={(event) => onMonthChange(Number(event.target.value))}
                                className="mt-2 min-h-11 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] px-4 py-3 text-sm font-medium text-[#1E2A32] outline-none transition hover:border-[#3E8C7A] focus:border-[#3E8C7A] focus:bg-white focus:ring-4 focus:ring-[#E5F2EE]"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="rounded-2xl bg-[#F5F7F6] px-4 py-3 ring-1 ring-[#E2E8E5]">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#66727A]">
                                {selectedYear} total
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#1E2A32]">
                                {expenseSummary
                                    ? formatMoney(expenseSummary.total_spent)
                                    : formatMoney(0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {hasCategories && expenseSummary ? (
                        <SpendingByCategoryChart categories={expenseSummary.categories} />
                    ) : (
                        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#F5F7F6] px-6 text-center ring-1 ring-dashed ring-[#E2E8E5]">
                            <div>
                                <p className="text-sm font-semibold text-[#1E2A32]">
                                    No category spending yet
                                </p>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-[#66727A]">
                                    Add expenses for this month to see where money is going.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
