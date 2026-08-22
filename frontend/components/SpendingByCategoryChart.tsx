"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { CategorySpending } from "@/lib/api";

type SpendingByCategoryChartProps = {
    categories: CategorySpending[];
};

export default function SpendingByCategoryChart({
                                                    categories,
                                                }: SpendingByCategoryChartProps) {
    const chartData = categories.map((category) => ({
        category: category.category,
        amount: Number(category.amount),
    }));

    return (
        <div
            className="h-80 w-full"
            aria-label="Bar chart showing spending by category"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8E5" strokeDasharray="3 3" vertical={false} />

                    <XAxis
                        dataKey="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#66727A", fontSize: 12 }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#66727A", fontSize: 12 }}
                    />

                    <Tooltip
                        cursor={{ fill: "#F5F7F6" }}
                        contentStyle={{
                            border: "1px solid #E2E8E5",
                            borderRadius: "12px",
                            boxShadow: "0 14px 40px rgba(23, 50, 77, 0.10)",
                        }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
                    />

                    <Bar
                        dataKey="amount"
                        fill="#3E8C7A"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
