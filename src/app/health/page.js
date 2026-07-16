import { Suspense } from "react";
import { getHealthUrl } from "../lib/site-config";

async function HealthStatus() {
  const response = await fetch(getHealthUrl(), { cache: "no-store" });

  if (!response.ok) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
        <p className="font-semibold">Health check unavailable.</p>
        <p className="mt-2 text-sm">The deployment endpoint could not be reached. Please verify the app URL and local environment.</p>
      </div>
    );
  }

  const payload = await response.json();

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
        Status: {payload.status}
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-4">
          <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Application
          </dt>
          <dd className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{payload.applicationName}</dd>
        </div>
        <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-4">
          <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Environment
          </dt>
          <dd className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{payload.environment}</dd>
        </div>
      </dl>
      <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 text-sm text-[color:var(--muted)]">
        Last checked at {payload.timestamp}
      </div>
    </div>
  );
}

export default function HealthPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          Health
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Deployment health check.
        </h2>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          The page verifies the TaskFlow API route and adapts to local development or Vercel deployments.
        </p>
      </header>

      <div className="card-surface section-block max-w-3xl">
        <Suspense fallback={<p className="text-sm text-[color:var(--muted)]">Checking deployment health…</p>}>
          <HealthStatus />
        </Suspense>
      </div>
    </section>
  );
}
