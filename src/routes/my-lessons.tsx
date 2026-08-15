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
      { title: "My lessons | learnerdriver.academy" },
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
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">My lessons</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Enter your mobile number to see your upcoming lessons — no account needed.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-wrap gap-3">
        <input
          type="tel"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="07825 031594"
          aria-label="Mobile number"
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Look up
        </button>
      </form>

      {isFetching && (
        <p className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Checking…
        </p>
      )}

      {isError && (
        <p className="mt-8 text-destructive">
          Something went wrong looking that up. Call {site.phone} and we'll check for you.
        </p>
      )}

      {!isFetching && !isError && lookupPhone && data?.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No upcoming lessons found for that number. If that's unexpected, call {site.phone}.
        </p>
      )}

      {!isFetching && data && data.length > 0 && (
        <ul className="mt-8 space-y-3">
          {data.map((lesson) => (
            <li
              key={`${lesson.date}T${lesson.start_time}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold">
                  {formatLongDate(lesson.date)} · {lesson.start_time.slice(0, 5)}–
                  {lesson.end_time.slice(0, 5)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lessonTypeName(lesson.lesson_type_slug)} ·{" "}
                  {STATUS_LABEL[lesson.status] ?? lesson.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        Need to change something?{" "}
        <a href={site.phoneHref} className="font-semibold text-primary hover:underline">
          Call {site.phone}
        </a>{" "}
        or{" "}
        <Link to="/book" className="font-semibold text-primary hover:underline">
          book another lesson
        </Link>
        .
      </p>
    </div>
  );
}
