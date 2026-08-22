import type { AIInsightResponse, AIInsightStatus } from "@/lib/api";

type AIInsightsCardProps = {
    insights: AIInsightResponse | null;
    loading: boolean;
    error: string | null;
    onGenerate: () => void;
};

const statusLabels: Record<AIInsightStatus, string> = {
    under_budget: "Under budget",
    on_track: "On track",
    over_budget: "Over budget",
};

const statusClassNames: Record<AIInsightStatus, string> = {
    under_budget: "bg-[#E5F2EE] text-[#17324D] ring-[#CFE5DD]",
    on_track: "bg-[#F5F7F6] text-[#1E2A32] ring-[#E2E8E5]",
    over_budget: "bg-[#FFF5E6] text-[#8A5A16] ring-[#F0D6AA]",
};

export function AIInsightsCard({
    insights,
    loading,
    error,
    onGenerate,
}: AIInsightsCardProps) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(23,50,77,0.06)] ring-1 ring-[#E2E8E5] md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#66727A]">
                            AI financial insights
                        </p>
                        <span className="rounded-full bg-[#E5F2EE] px-2.5 py-1 text-xs font-medium text-[#17324D]">
                            AI-generated
                        </span>
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2A32]">
                        Spending guidance
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66727A]">
                        Generate a concise summary from current spending and budget data. Review it before making financial decisions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={loading}
                    aria-busy={loading}
                    className="min-h-11 rounded-xl bg-[#17324D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10263A] focus:outline-none focus:ring-4 focus:ring-[#E5F2EE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Generating..." : insights ? "Regenerate" : "Generate insights"}
                </button>
            </div>

            {loading && (
                <div className="mt-5 rounded-2xl bg-[#F5F7F6] p-5 ring-1 ring-[#E2E8E5]">
                    <div className="h-4 w-28 rounded-full bg-[#E2E8E5]" />
                    <div className="mt-4 h-5 rounded-full bg-white" />
                    <div className="mt-3 h-5 w-3/4 rounded-full bg-white" />
                </div>
            )}

            {error && !loading && (
                <div className="mt-5 rounded-2xl bg-[#FDF2F2] px-4 py-3 text-sm font-medium leading-6 text-[#C65B5B] ring-1 ring-[#F4D1D1]">
                    {error}
                </div>
            )}

            {!insights && !loading && !error && (
                <div className="mt-5 grid gap-3 rounded-2xl bg-[#F5F7F6] p-5 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5] md:grid-cols-3">
                    <div>
                        <p className="font-semibold text-[#1E2A32]">Data used</p>
                        <p className="mt-1">Current expenses, category totals, and monthly budget.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[#1E2A32]">User control</p>
                        <p className="mt-1">Insights generate only when requested.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[#1E2A32]">Review first</p>
                        <p className="mt-1">Treat recommendations as guidance, not financial advice.</p>
                    </div>
                </div>
            )}

            {insights && !loading && (
                <div className="mt-5 rounded-2xl bg-[#F5F7F6] p-5 ring-1 ring-[#E2E8E5]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <p className="max-w-3xl text-lg font-semibold leading-7 text-[#1E2A32]">
                            {insights.summary}
                        </p>
                        <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClassNames[insights.status]}`}
                        >
                            {statusLabels[insights.status]}
                        </span>
                    </div>

                    {insights.recommendations.length > 0 && (
                        <div className="mt-5">
                            <p className="text-sm font-semibold text-[#1E2A32]">
                                Recommendations
                            </p>
                            <ul className="mt-3 grid gap-3 md:grid-cols-2">
                                {insights.recommendations.map((recommendation) => (
                                    <li
                                        key={recommendation}
                                        className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-[#66727A] ring-1 ring-[#E2E8E5]"
                                    >
                                        {recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
