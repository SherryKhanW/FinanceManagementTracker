type SummaryCardProps = {
    label: string;
    value: string;
    detail: string;
};

export function SummaryCard({ label, value, detail }: SummaryCardProps) {
    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(31,27,22,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(31,27,22,0.09)]">
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                {value}
            </p>
            <p className="mt-2 text-sm text-stone-500">{detail}</p>
        </article>
    );
}
