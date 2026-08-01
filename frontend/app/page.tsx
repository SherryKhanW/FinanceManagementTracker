type HealthResponse = {
  status: string;
  service: string;
};

async function getHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch("http://127.0.0.1:8000/health", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-6 text-stone-950">
        <section className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(31,27,22,0.09)]">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
            FT
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Finance Management Tracker
          </h1>

          <p className="mt-4 text-base text-stone-500">
            A minimal personal finance workspace for tracking expenses.
          </p>

          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            {health
                ? `Backend Status: ${health.status}`
                : "Backend Offline"}
          </div>
        </section>
      </main>
  );
}
