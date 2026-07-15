export default function NewTaskPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          Create task
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Add a new task to the flow.
        </h2>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          This placeholder form is ready for title, project, assignee, and due-date fields.
        </p>
      </header>

      <div className="card-surface section-block max-w-3xl">
        <form className="space-y-5" aria-label="Create task form placeholder">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Task title
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[color:var(--primary)]"
                placeholder="e.g. Finalize launch checklist"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Assignee
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--primary)]"
                placeholder="Alex"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--primary)]"
              placeholder="Describe the purpose and success criteria for this task."
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90">
              Save task
            </button>
            <button type="button" className="rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
