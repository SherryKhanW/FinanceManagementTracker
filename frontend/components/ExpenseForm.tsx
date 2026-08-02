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
    onDescriptionChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onExpenseDateChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancelEdit: () => void;
};

const inputClassName =
    "mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-4 focus:ring-stone-200";

export function ExpenseForm({
    description,
    amount,
    category,
    expenseDate,
    isEditing,
    onDescriptionChange,
    onAmountChange,
    onCategoryChange,
    onExpenseDateChange,
    onSubmit,
    onCancelEdit,
}: ExpenseFormProps) {
    return (
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(31,27,22,0.06)]">
            <div>
                <p className="text-sm font-medium text-stone-500">Expense entry</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">
                    {isEditing ? "Edit expense" : "Add expense"}
                </h2>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <label className="block">
                    <span className="text-sm font-medium text-stone-700">
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
                    <span className="text-sm font-medium text-stone-700">Amount</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(event) => onAmountChange(event.target.value)}
                        className={inputClassName}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-stone-700">Category</span>
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
                    <span className="text-sm font-medium text-stone-700">Date</span>
                    <input
                        type="date"
                        value={expenseDate}
                        onChange={(event) => onExpenseDateChange(event.target.value)}
                        className={inputClassName}
                    />
                </label>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
                    >
                        {isEditing ? "Update Expense" : "Create Expense"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-stone-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
