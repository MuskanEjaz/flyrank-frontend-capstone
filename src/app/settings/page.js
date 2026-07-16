const settingsSections = [
  {
    title: "Notifications",
    description: "Choose how updates should reach your team.",
    value: "Email + in-app",
  },
  {
    title: "Workspace theme",
    description: "Keep the product experience aligned with your brand.",
    value: "Light",
  },
  {
    title: "Defaults",
    description: "Set repeatable preferences for every new project.",
    value: "Daily digest",
  },
];

export default function SettingsPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          Settings
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Personalize your workspace.
        </h2>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          These placeholders reflect the settings surface envisioned for the TaskFlow product experience.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <article key={section.title} className="card-surface section-block">
            <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{section.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{section.description}</p>
            <p className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {section.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
