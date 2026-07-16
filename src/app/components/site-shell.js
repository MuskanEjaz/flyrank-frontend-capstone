"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/settings", label: "Settings" },
  { href: "/health", label: "Health" },
];

function NavLink({ href, label }) {
  const pathname = usePathname();
  const isActive = href === "/"
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        isActive
          ? "solid-action bg-[color:var(--primary)] shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function SiteShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
              TaskFlow
            </p>
            <h1 className="text-xl font-semibold text-[color:var(--foreground)]">
              Structured delivery, quietly confident
            </h1>
          </div>
          <nav aria-label="Primary" className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[color:var(--card)]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>TaskFlow capstone skeleton for FE-04.</p>
          <p>Built with Next.js App Router and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
