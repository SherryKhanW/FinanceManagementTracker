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
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" vertical={false} />

                    <XAxis
                        dataKey="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#78716c", fontSize: 12 }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#78716c", fontSize: 12 }}
                    />

                    <Tooltip
                        cursor={{ fill: "#f5f5f4" }}
                        contentStyle={{
                            border: "1px solid #e7e5e4",
                            borderRadius: "12px",
                            boxShadow: "0 18px 50px rgba(31, 27, 22, 0.10)",
                        }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
                    />

                    <Bar
                        dataKey="amount"
                        fill="#1c1917"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
