export const metadata = {
  title: "Empty but Live | Muskan Ejaz",
  description: "A polished, near-blank portfolio milestone page for Muskan Ejaz.",
};

export default function EmptyLivePage() {
  return (
    <section className="flex flex-1 items-center justify-center py-6 sm:py-10 lg:py-14">
      <div className="w-full max-w-2xl rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card)]/90 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Live
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
            Portfolio milestone
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl">
            Muskan Ejaz
          </h1>
          <p className="text-lg font-medium text-[color:var(--muted)]">
            Frontend Developer &amp; BSCS Student
          </p>
          <p className="max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            “Portfolio build space — live and ready.”
          </p>
        </div>
      </div>
    </section>
  );
}
