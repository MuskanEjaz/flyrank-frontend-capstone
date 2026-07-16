import AiChat from "../../components/ai-chat";

export const metadata = {
  title: "AI Chat | TaskFlow",
  description: "A streaming AI chat experience for FE-06.",
};

export default function AiChatPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">AI chat</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Stream an assistant response without losing context.
        </h2>
        <p className="max-w-3xl text-lg text-[color:var(--muted)]">
          This FE-06 experience uses a server route and a typed client component to keep the chat polished, responsive, and accessible.
        </p>
      </header>

      <AiChat />
    </section>
  );
}
