import Link from "next/link";

const highlights = [
  { title: "Plan work clearly", description: "Break delivery into focused milestones that stay visible to the whole team." },
  { title: "Ship with balance", description: "Keep sprint progress healthy while maintaining sustainable collaboration." },
  { title: "Stay aligned", description: "Use shared status views to keep product, design, and engineering in sync." },
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
            TaskFlow Capstone
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            A polished task management experience for modern delivery teams.
          </h2>
          <p className="max-w-2xl text-lg text-[color:var(--muted)]">
            This App Router skeleton showcases a professional landing page, dashboard, task workspace, settings, and deployment health views for the FE-04 capstone.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90">
              Open dashboard
            </Link>
            <Link href="/tasks/new" className="rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
              Create task
            </Link>
          </div>
        </div>

        <div className="card-surface section-block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--primary)]">
            Why teams use TaskFlow
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-[color:var(--muted)]">
            <li>• Clear task ownership with a clean project view.</li>
            <li>• Consistent visual language across dashboard and settings.</li>
            <li>• Deployment health feedback for local and Vercel environments.</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="card-surface section-block">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
