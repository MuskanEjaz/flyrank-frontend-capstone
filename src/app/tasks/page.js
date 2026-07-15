import Link from "next/link";

const taskItems = [
  { title: "Align sprint goals", status: "In review", owner: "Ava" },
  { title: "Draft handoff summary", status: "Planned", owner: "Mina" },
  { title: "Review API contract", status: "Ready", owner: "Noah" },
];

export default function TasksPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          Tasks
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Task management workspace.
        </h2>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          This placeholder page is ready for task cards, filters, and drag-and-drop workflows later on.
        </p>
      </header>

      <div className="card-surface section-block">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Current backlog</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">A polished placeholder for your future task experience.</p>
          </div>
          <Link href="/tasks/new" className="inline-flex rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90">
            Create task
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {taskItems.map((task) => (
            <article key={task.title} className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--primary)]">
                {task.status}
              </p>
              <h4 className="mt-3 text-lg font-semibold text-slate-900">{task.title}</h4>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Owner: {task.owner}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
