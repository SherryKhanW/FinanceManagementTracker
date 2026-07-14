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
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold">
            Finance Management Tracker
          </h1>

          <p className="mt-4 text-lg">
            {health
                ? `Backend Status: ${health.status}`
                : "Backend Offline"}
          </p>
        </div>
      </main>
  );
}