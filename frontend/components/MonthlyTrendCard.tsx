"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { MonthlySpendingTrendMonth } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";

type MonthlyTrendCardProps = {
    trendData: MonthlySpendingTrendMonth[];
    loading: boolean;
    error: string | null;
};

function formatMonthLabel(month: number, year: number) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
    }).format(new Date(year, month - 1, 1));
}

export function MonthlyTrendCard({
    trendData,
    loading,
    error,
}: MonthlyTrendCardProps) {
    const chartData = trendData.map((point) => ({
        label: formatMonthLabel(point.month, point.year),
        amount: Number(point.total_spent),
    }));

    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#66727A]">
                        Monthly trend
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                        Spending over time
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#66727A]">
                        Last 6 months of tracked spending.
                    </p>
                </div>
                <span className="w-fit rounded-full bg-[#E5F2EE] px-3 py-1 text-xs font-semibold text-[#17324D]">
                    Last 6 months
                </span>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#F5F7F6] px-6 text-center ring-1 ring-dashed ring-[#E2E8E5]">
                        <div className="w-full max-w-md">
                            <div className="mx-auto h-3 w-28 rounded-full bg-[#E2E8E5]" />
                            <div className="mt-4 h-4 rounded-full bg-white" />
                            <div className="mx-auto mt-3 h-4 w-2/3 rounded-full bg-white" />
                            <p className="mt-5 text-sm font-medium text-[#66727A]">
                                Loading monthly trend...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#FDF2F2] px-6 text-center ring-1 ring-dashed ring-[#F4D1D1]">
                        <div>
                            <p className="text-sm font-semibold text-[#C65B5B]">
                                Monthly trend unavailable
                            </p>
                            <p className="mt-2 max-w-md text-sm leading-6 text-[#66727A]">
                                {error}
                            </p>
                        </div>
                    </div>
                ) : chartData.length > 0 ? (
                    <div
                        className="h-72 w-full"
                        aria-label="Line chart showing monthly spending trend"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    stroke="#E2E8E5"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#66727A", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#66727A", fontSize: 12 }}
                                    tickFormatter={(value) => formatMoney(Number(value))}
                                />
                                <Tooltip
                                    cursor={{ stroke: "#3E8C7A", strokeWidth: 1 }}
                                    contentStyle={{
                                        border: "1px solid #E2E8E5",
                                        borderRadius: "14px",
                                        boxShadow: "0 14px 40px rgba(23, 50, 77, 0.10)",
                                    }}
                                    formatter={(value) => [
                                        formatMoney(Number(value)),
                                        "Total spent",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3E8C7A"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#F5F7F6] px-6 text-center ring-1 ring-dashed ring-[#E2E8E5]">
                        <div>
                            <p className="text-sm font-semibold text-[#1E2A32]">
                                No monthly trend data yet
                            </p>
                            <p className="mt-2 max-w-md text-sm leading-6 text-[#66727A]">
                                Add expenses to start seeing spending across recent months.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
