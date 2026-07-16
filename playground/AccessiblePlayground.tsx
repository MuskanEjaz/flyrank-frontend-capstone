"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

type TabItem = {
  id: string;
  label: string;
  title: string;
  content: string;
};

function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors)).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelectors) ?? []).filter((element) => !element.hasAttribute("disabled"));
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={titleId} className="text-xl font-semibold text-slate-900">
              {title}
            </h3>
            {description ? (
              <p id={descriptionId} className="mt-2 text-sm leading-7 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function AccessibleTabs({ items }: { items: TabItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "overview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = items.length - 1;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = event.key === "ArrowRight" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      const nextItem = items[nextIndex];
      setActiveId(nextItem.id);
      tabRefs.current[nextIndex]?.focus();
    }

    if (event.key === "Home") {
      event.preventDefault();
      const firstItem = items[0];
      setActiveId(firstItem.id);
      tabRefs.current[0]?.focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastItem = items[lastIndex];
      setActiveId(lastItem.id);
      tabRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Playground highlights" className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selected ? "solid-action bg-[color:var(--primary)] shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === activeId;
        return (
          <section
            key={item.id}
            id={`panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            hidden={!selected}
            tabIndex={0}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.content}</p>
          </section>
        );
      })}
    </div>
  );
}

function AccessibleDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = useId();
  const panelId = useId();

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 shadow-sm"
      >
        <span>How the manual pattern behaves</span>
        <span className="text-slate-500">{isOpen ? "−" : "+"}</span>
      </button>
      <div id={panelId} hidden={!isOpen} className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
        <p>
          The button exposes its expanded state to assistive technologies and the controlled content is shown or hidden without any custom key handling.
        </p>
      </div>
    </div>
  );
}

export default function AccessiblePlayground() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabItems: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      title: "Purpose of the playground",
      content:
        "This classroom-style page brings together a modal dialog, tabs, and a disclosure component in one accessible surface for FE-05.",
    },
    {
      id: "keyboard",
      label: "Keyboard",
      title: "Keyboard support",
      content:
        "Each interaction uses native semantics and keyboard handling from the W3C ARIA authoring guidance so focus and selection stay predictable.",
    },
    {
      id: "notes",
      label: "Notes",
      title: "Design notes",
      content:
        "The components deliberately avoid libraries so the ARIA structure remains visible and easy to review for educational purposes.",
    },
  ];

  return (
    <section className="space-y-8">
      <header className="space-y-4 rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--primary)]">
          FE-05 playground
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Accessible UI primitives, built by hand.
        </h2>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          This responsive page demonstrates a modal dialog, keyboard-friendly tabs, and a disclosure widget using semantic HTML and ARIA patterns that match the assignment expectations.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="solid-action rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
          >
            Open accessible modal
          </button>
          <a href="/playground" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
            Review the route
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Manual modal dialog</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The dialog uses role=&quot;dialog&quot;, aria-modal, focus management, and an Escape key handler to keep the experience understandable for assistive technology users.
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            <p className="font-semibold text-slate-900">What to try</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Open the modal and confirm focus lands inside it.</li>
              <li>Use Tab and Shift+Tab to move through actions.</li>
              <li>Press Escape to close it and return focus to the trigger.</li>
            </ul>
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Why this playground matters</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Each component is intentionally transparent so the ARIA relationship and keyboard model are easy to inspect. That makes it a strong teaching companion for accessibility review work.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Modal</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Focus trap and restore flow.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Tabs</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Arrow and Home/End movement.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Disclosure</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Native button semantics with controlled content.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Notes</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">See the comparison notes for shadcn gaps.</p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--primary)]">Accessible tabs</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Keyboard activation and semantics</h3>
            </div>
          </div>
          <div className="mt-5">
            <AccessibleTabs items={tabItems} />
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--primary)]">Disclosure widget</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Show and hide content responsibly</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A real button uses aria-expanded and aria-controls, while the content is revealed only when the control is expanded.
          </p>
          <div className="mt-5">
            <AccessibleDisclosure />
          </div>
        </article>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Accessibility review dialog"
        description="This dialog keeps focus inside the panel until it closes, and it returns focus to the button that opened it."
      >
        <p>
          Use the close button or press Escape to dismiss the message. The layout keeps the content scrollable and the focus order predictable.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="solid-action rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold"
          >
            Confirm and close
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
}
