import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatLongDate } from "@/lib/booking";
import { normalizePhone } from "@/lib/phone";
import { lessonTypes, site } from "@/lib/site";

export const Route = createFileRoute("/my-lessons")({
  head: () => ({
    meta: [
      { title: `My lessons | ${site.brand}` },
      {
        name: "description",
        content: "Look up your upcoming automatic driving lessons by phone number.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyLessonsPage,
});

function lessonTypeName(slug: string) {
  return lessonTypes.find((l) => l.slug === slug)?.short ?? slug;
}

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  pending_payment: "Payment pending",
  completed: "Completed",
};

function MyLessonsPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [lookupPhone, setLookupPhone] = useState<string | null>(null);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["upcoming-lessons", lookupPhone],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_upcoming_lessons_for_phone", {
        p_phone: lookupPhone!,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!lookupPhone,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setLookupPhone(normalizePhone(phoneInput));
  }

  return (
    <div className="w-full">
      {/* Navy hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Customer Portal
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            My lessons
          </h1>
          <p className="mt-4 max-w-xl text-lg text-hp-ink-foreground/75">
            Enter your mobile number to see your upcoming lessons — no account needed.
          </p>
        </div>
      </section>

      {/* Ivory body */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="07825 031594"
              aria-label="Mobile number"
              className="min-w-0 flex-1 border border-hp-paper-foreground/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-hp-accent focus:ring-1 focus:ring-hp-accent"
            />
            <button
              type="submit"
              className="bg-hp-accent px-8 py-3 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Look up
            </button>
          </form>

          {isFetching && (
            <p className="mt-8 flex items-center gap-2 text-hp-paper-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Checking…
            </p>
          )}

          {isError && (
            <p className="mt-8 text-destructive">
              Something went wrong looking that up. Call{" "}
              <a href={site.phoneHref} className="font-bold hover:underline">
                {site.phone}
              </a>{" "}
              and we'll check for you.
            </p>
          )}

          {!isFetching && !isError && lookupPhone && data?.length === 0 && (
            <p className="mt-8 text-hp-paper-foreground/70">
              No upcoming lessons found for that number. If that's unexpected, call{" "}
              <a href={site.phoneHref} className="font-bold text-hp-ink hover:underline">
                {site.phone}
              </a>
              .
            </p>
          )}

          {!isFetching && data && data.length > 0 && (
            <ul className="mt-8 space-y-3">
              {data.map((lesson) => (
                <li
                  key={`${lesson.date}T${lesson.start_time}`}
                  className="flex items-start gap-4 border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-6"
                >
                  <CalendarClock
                    className="mt-0.5 h-5 w-5 shrink-0 text-hp-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold text-hp-ink">
                      {formatLongDate(lesson.date)} · {lesson.start_time.slice(0, 5)}–
                      {lesson.end_time.slice(0, 5)}
                    </p>
                    <p className="mt-1 text-sm text-hp-paper-foreground/60">
                      {lessonTypeName(lesson.lesson_type_slug)} ·{" "}
                      {STATUS_LABEL[lesson.status] ?? lesson.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-sm text-hp-paper-foreground/60">
            Need to change something?{" "}
            <a href={site.phoneHref} className="font-bold text-hp-ink hover:underline">
              Call {site.phone}
            </a>{" "}
            or{" "}
            <Link to="/book" className="font-bold text-hp-ink hover:underline">
              book another lesson
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
