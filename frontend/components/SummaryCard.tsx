type SummaryCardProps = {
    label: string;
    value: string;
    detail: string;
};

export function SummaryCard({ label, value, detail }: SummaryCardProps) {
    return (
        <article className="rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(23,50,77,0.05)] ring-1 ring-[#E2E8E5] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(23,50,77,0.08)]">
            <p className="text-sm font-medium text-[#66727A]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                {value}
            </p>
            <p className="mt-1 text-sm text-[#66727A]">{detail}</p>
        </article>
    );
}
