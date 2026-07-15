import Link from "next/link";

const stats = [
  { label: "Open tasks", value: "18", detail: "3 due this week" },
  { label: "Completed", value: "42", detail: "Momentum is trending up" },
  { label: "Focus score", value: "87%", detail: "Healthy sprint pace" },
];

const recentTasks = [
  { title: "Finalize roadmap review", due: "Today · 3:00 PM" },
  { title: "Prepare sprint retro notes", due: "Tomorrow · 9:30 AM" },
  { title: "Sync with design handoff", due: "Friday · 1:00 PM" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          Overview
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Your team is moving steadily.
        </h2>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          This dashboard placeholder highlights live-ready metrics, priorities, and delivery signals for the TaskFlow capstone.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="card-surface section-block">
            <p className="text-sm font-medium text-[color:var(--muted)]">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="card-surface section-block">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Recent tasks</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">The latest work queued for delivery.</p>
            </div>
            <Link href="/tasks" className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-medium text-slate-700 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
              View all
            </Link>
          </div>

          <ul className="mt-6 space-y-3">
            {recentTasks.map((task) => (
              <li key={task.title} className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-slate-50 px-4 py-3">
                <span className="font-medium text-slate-800">{task.title}</span>
                <span className="text-sm text-[color:var(--muted)]">{task.due}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card-surface section-block">
          <h3 className="text-xl font-semibold text-slate-900">Next best action</h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            Create the next task to keep the sprint momentum visible for stakeholders and teammates.
          </p>
          <Link href="/tasks/new" className="mt-6 inline-flex rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90">
            Add a task
          </Link>
        </article>
      </div>
    </section>
  );
}
