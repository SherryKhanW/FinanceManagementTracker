import type { FormEvent } from "react";

export const EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Health",
    "Other",
] as const;

type ExpenseFormProps = {
    description: string;
    amount: string;
    category: string;
    expenseDate: string;
    isEditing: boolean;
    error: string | null;
    onDescriptionChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onExpenseDateChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancelEdit: () => void;
};

const inputClassName =
    "mt-2 min-h-11 w-full rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] px-4 py-3 text-sm text-[#1E2A32] outline-none transition placeholder:text-[#66727A]/70 hover:border-[#3E8C7A] focus:border-[#3E8C7A] focus:bg-white focus:ring-4 focus:ring-[#E5F2EE]";

export function ExpenseForm({
    description,
    amount,
    category,
    expenseDate,
    isEditing,
    error,
    onDescriptionChange,
    onAmountChange,
    onCategoryChange,
    onExpenseDateChange,
    onSubmit,
    onCancelEdit,
}: ExpenseFormProps) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5]">
            <div>
                <p className="text-sm font-medium text-[#66727A]">Expense entry</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                    {isEditing ? "Edit expense" : "Add expense"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66727A]">
                    Keep transaction details concise and consistent for easier review.
                </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <label className="block">
                    <span className="text-sm font-medium text-[#1E2A32]">
                        Description
                    </span>
                    <input
                        type="text"
                        placeholder="Coffee, groceries, ride..."
                        value={description}
                        onChange={(event) => onDescriptionChange(event.target.value)}
                        className={inputClassName}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-[#1E2A32]">Amount</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(event) => onAmountChange(event.target.value)}
                        className={inputClassName}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-[#1E2A32]">Category</span>
                    <select
                        value={category}
                        onChange={(event) => onCategoryChange(event.target.value)}
                        className={inputClassName}
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        {EXPENSE_CATEGORIES.map((expenseCategory) => (
                            <option key={expenseCategory} value={expenseCategory}>
                                {expenseCategory}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-[#1E2A32]">Date</span>
                    <input
                        type="date"
                        value={expenseDate}
                        onChange={(event) => onExpenseDateChange(event.target.value)}
                        className={inputClassName}
                    />
                </label>

                {error && (
                    <div
                        role="alert"
                        className="rounded-2xl bg-[#FDF2F2] px-4 py-3 text-sm font-medium leading-6 text-[#C65B5B] ring-1 ring-[#F4D1D1]"
                    >
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                        type="submit"
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#17324D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10263A] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                    >
                        {isEditing ? "Update expense" : "Create expense"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F5F7F6] px-5 py-3 text-sm font-semibold text-[#17324D] ring-1 ring-[#E2E8E5] transition hover:bg-[#E5F2EE] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE]"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
