import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { sendChatMessage, type BookingSuggestion } from "@/lib/chatbot";
import { lessonTypes, site } from "@/lib/site";
import { formatLongDate } from "@/lib/booking";

type DisplayMessage = {
  role: "user" | "assistant";
  content: string;
  suggestion?: BookingSuggestion | null;
};

const GREETING: DisplayMessage = {
  role: "assistant",
  content:
    "Hi! I can answer questions about lessons, pricing, areas we cover, or help you find a time to book. What can I help with?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: DisplayMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const result = await sendChatMessage({
        data: { messages: nextMessages.map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply, suggestion: result.suggestion },
      ]);
    } catch {
      setError("Something went wrong sending that. Try again, or message us on WhatsApp below.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-44 right-5 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift sm:right-5">
          <div className="flex items-center justify-between bg-hp-ink px-4 py-3 text-hp-ink-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-hp-accent" aria-hidden="true" />
              <p className="text-sm font-bold">Ask learnerdriver.academy</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-hp-ink-foreground/70 hover:bg-hp-ink-foreground/10 hover:text-hp-ink-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.suggestion && <BookingSuggestionCard suggestion={m.suggestion} />}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-3.5 py-2.5">
                  <Loader2
                    className="h-4 w-4 animate-spin text-secondary-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="border-t border-border px-4 py-2.5 text-center text-xs text-muted-foreground">
            Prefer to talk?{" "}
            <a href={site.phoneHref} className="font-semibold text-primary hover:underline">
              Call {site.phone}
            </a>{" "}
            or{" "}
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about lessons, pricing, booking…"
              disabled={sending}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-24 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-hp-ink px-4 py-3 text-sm font-semibold text-hp-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5"
      >
        {open ? (
          <X className="h-5 w-5 text-hp-accent" aria-hidden="true" />
        ) : (
          <Sparkles className="h-5 w-5 text-hp-accent" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{open ? "Close" : "Chat"}</span>
      </button>
    </>
  );
}

function BookingSuggestionCard({ suggestion }: { suggestion: BookingSuggestion }) {
  const lesson = lessonTypes.find((l) => l.slug === suggestion.lessonTypeSlug);
  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-3 text-foreground">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {lesson?.short ?? "Lesson"}
      </p>
      <p className="mt-0.5 text-sm font-semibold">
        {formatLongDate(suggestion.date)} at {suggestion.time}
      </p>
      <Link
        to="/book"
        search={{
          lessonType: suggestion.lessonTypeSlug,
          date: suggestion.date,
          time: suggestion.time,
        }}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-bold text-accent-foreground"
      >
        Continue to booking →
      </Link>
    </div>
  );
}
