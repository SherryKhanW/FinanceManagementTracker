import { formatDate, formatMoney } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

type ExpenseTableProps = {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (expenseId: string) => void;
};

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
    return (
        <section className="rounded-2xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(31,27,22,0.06)]">
            <div className="border-b border-stone-200 px-5 py-5">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Transactions
                </h2>
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
                    <table className="w-full min-w-[720px] border-collapse text-left">
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
                                                onClick={() => onEdit(expense)}
                                                className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-stone-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(expense.id)}
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
    );
}
