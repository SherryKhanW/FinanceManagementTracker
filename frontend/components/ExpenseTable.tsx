import { formatDate, formatMoney } from "@/lib/formatters";
import type { Expense } from "@/types/expense";

type ExpenseTableProps = {
    expenses: Expense[];
    error: string | null;
    onEdit: (expense: Expense) => void;
    onDelete: (expenseId: string) => void;
};

export function ExpenseTable({
    expenses,
    error,
    onEdit,
    onDelete,
}: ExpenseTableProps) {
    return (
        <section className="rounded-3xl bg-white shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
            <div className="px-5 py-5">
                <p className="text-sm font-medium text-[#66727A]">Expense list</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                    Transactions
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66727A]">
                    Review, edit, or remove expenses from the current list.
                </p>
                {error && (
                    <div
                        role="alert"
                        className="mt-4 rounded-2xl bg-[#FDF2F2] px-4 py-3 text-sm font-medium leading-6 text-[#C65B5B] ring-1 ring-[#F4D1D1]"
                    >
                        {error}
                    </div>
                )}
            </div>

            {expenses.length === 0 ? (
                <div className="mx-5 mb-5 rounded-2xl bg-[#F5F7F6] px-5 py-10 text-center ring-1 ring-dashed ring-[#E2E8E5]">
                    <p className="text-base font-medium text-[#1E2A32]">
                        No expenses yet
                    </p>
                    <p className="mt-2 text-sm text-[#66727A]">
                        Add your first expense to start building the dashboard.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                        <thead>
                            <tr className="border-y border-[#E2E8E5] bg-[#F5F7F6] text-xs uppercase tracking-wide text-[#66727A]">
                                <th className="px-5 py-3 font-semibold">Description</th>
                                <th className="px-5 py-3 font-semibold">Category</th>
                                <th className="px-5 py-3 font-semibold">Date</th>
                                <th className="px-5 py-3 text-right font-semibold">Amount</th>
                                <th className="px-5 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8E5]">
                            {expenses.map((expense) => (
                                <tr
                                    key={expense.id}
                                    className="transition hover:bg-[#F5F7F6]"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-[#1E2A32]">
                                            {expense.description}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex rounded-full bg-[#E5F2EE] px-3 py-1 text-xs font-medium text-[#17324D] ring-1 ring-[#D4E8E1]">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#66727A]">
                                        {formatDate(expense.expense_date)}
                                    </td>
                                    <td className="px-5 py-4 text-right text-sm font-semibold text-[#1E2A32]">
                                        {formatMoney(expense.amount)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(expense)}
                                                className="min-h-9 rounded-xl bg-[#F5F7F6] px-3 py-2 text-xs font-semibold text-[#17324D] ring-1 ring-[#E2E8E5] transition hover:bg-[#E5F2EE] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(expense.id)}
                                                className="min-h-9 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#C65B5B] ring-1 ring-[#E2E8E5] transition hover:bg-[#FDF2F2] hover:ring-[#C65B5B]/30 focus:outline-none focus:ring-4 focus:ring-[#F8DADA]"
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
