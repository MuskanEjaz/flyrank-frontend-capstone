"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "flyrank-ai-chat";
const DEFAULT_PROMPT = "Ask the assistant for a concise product or delivery recommendation.";

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function scrollToBottom(element: HTMLDivElement | null, behavior: ScrollBehavior = "smooth") {
  if (!element) {
    return;
  }

  element.scrollTo({ top: element.scrollHeight, behavior });
}

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(true);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [activeAbortController, setActiveAbortController] = useState<AbortController | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [modeLabel, setModeLabel] = useState("Real Claude streaming");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const nextMessages = !stored
      ? [createMessage("assistant", DEFAULT_PROMPT)]
      : (() => {
          try {
            const parsed = JSON.parse(stored) as ChatMessage[];
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createMessage("assistant", DEFAULT_PROMPT)];
          } catch {
            window.localStorage.removeItem(STORAGE_KEY);
            return [createMessage("assistant", DEFAULT_PROMPT)];
          }
        })();

    const timeoutId = window.setTimeout(() => {
      setMessages(nextMessages);
      setHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [hydrated, messages]);

  useEffect(() => {
    if (isPinned) {
      scrollToBottom(containerRef.current, "smooth");
    }
  }, [messages, isPinned, isStreaming]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const handleScroll = () => {
      const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 48;
      setIsPinned(nearBottom);
      if (!nearBottom) {
        setShowJumpButton(true);
      } else {
        setShowJumpButton(false);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  const assistantCount = useMemo(() => messages.filter((message) => message.role === "assistant").length, [messages]);

  const handleSend = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isStreaming) {
      return;
    }

    const userMessage = createMessage("user", trimmedDraft);
    const assistantMessage = createMessage("assistant", "");

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft("");
    setStatusMessage(null);
    setIsStreaming(true);

    const controller = new AbortController();
    setActiveAbortController(controller);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: controller.signal,
      });

      const responseMode = response.headers.get("x-chat-mode");
      if (responseMode === "demo") {
        setModeLabel("Demo streaming mode");
      } else {
        setModeLabel("Real Claude streaming");
      }

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "The assistant could not respond right now.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) {
            continue;
          }

          const payload = part.replace(/^data:\s*/, "");
          if (!payload) {
            continue;
          }

          try {
            const event = JSON.parse(payload) as { type?: string; text?: string; error?: string };
            if (event.type === "delta" && typeof event.text === "string") {
              setMessages((current) =>
                current.map((message) =>
                  message.id === assistantMessage.id
                    ? { ...message, content: message.content + event.text }
                    : message
                )
              );
            }

            if (event.type === "error" && event.error) {
              throw new Error(event.error);
            }
          } catch {
            if (part.includes("error")) {
              throw new Error("The assistant stream ended unexpectedly.");
            }
          }
        }
      }

      if (buffer) {
        const payload = buffer.replace(/^data:\s*/, "");
        if (payload) {
          const event = JSON.parse(payload) as { type?: string; text?: string; error?: string };
          if (event.type === "delta" && typeof event.text === "string") {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessage.id
                  ? { ...message, content: message.content + event.text }
                  : message
              )
            );
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "The assistant could not respond right now.";
      if (message === "The operation was aborted.") {
        setStatusMessage("Streaming stopped. You can send another message whenever you are ready.");
      } else {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content || "The assistant could not finish the response." }
              : message
          )
        );
        setStatusMessage(message);
      }
    } finally {
      setIsStreaming(false);
      setActiveAbortController(null);
    }
  };

  const handleStop = () => {
    activeAbortController?.abort();
    setIsStreaming(false);
    setActiveAbortController(null);
    setStatusMessage("Streaming stopped. You can continue with another prompt.");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setDraft((current) => `${current}\n`);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setDraft("");
    setStatusMessage("Conversation cleared.");
    setIsStreaming(false);
    activeAbortController?.abort();
    setActiveAbortController(null);
  };

  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">AI chat</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Stream a focused assistant response.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            This experience keeps the conversation in local storage, shows a live stream as tokens arrive, and lets you stop and continue naturally.
          </p>
        </div>
        <button
          type="button"
          className="solid-action rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold transition hover:opacity-90"
          onClick={handleClear}
        >
          Clear chat
        </button>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
        <div ref={containerRef} className="max-h-[28rem] overflow-y-auto rounded-[1.25rem] bg-white p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
              Start a new conversation with a product question or delivery prompt.
            </div>
          ) : null}

          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
                    message.role === "user"
                      ? "bg-[color:var(--primary)] text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-[0.2em] text-[0.7rem] opacity-80">
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{message.content || (message.role === "assistant" ? "Thinking…" : "")}</p>
                </div>
              </div>
            ))}
          </div>

          {isStreaming && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content ? (
            <div className="mt-3 flex justify-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Thinking…
              </div>
            </div>
          ) : null}
        </div>

        {showJumpButton ? (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              className="solid-action rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              onClick={() => {
                setShowJumpButton(false);
                setIsPinned(true);
                scrollToBottom(containerRef.current, "smooth");
              }}
            >
              Jump to latest
            </button>
          </div>
        ) : null}
      </div>

      {statusMessage ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{statusMessage}</p>
      ) : null}

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <label htmlFor="chat-input" className="text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={4}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for a launch plan, roadmap refinement, or feedback loop idea..."
          className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
          disabled={isStreaming}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Press Enter to send, or Shift+Enter for a new line.</p>
          <div className="flex flex-wrap gap-2">
            {isStreaming ? (
              <button
                type="button"
                className="solid-action rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                onClick={handleStop}
              >
                Stop
              </button>
            ) : null}
            <button
              type="button"
              className="solid-action rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              onClick={() => void handleSend()}
              disabled={isStreaming}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{assistantCount} assistant replies</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Stored locally</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{modeLabel}</span>
      </div>
    </section>
  );
}
