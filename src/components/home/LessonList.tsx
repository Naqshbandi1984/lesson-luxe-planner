import { Link } from "@tanstack/react-router";
import { lessonTypes } from "@/lib/site";

export function LessonList() {
  return (
    <section className="bg-hp-ink text-hp-ink-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <h2 className="font-display text-5xl font-extrabold sm:text-6xl">
          Lessons to suit where you're starting
        </h2>

        <div className="mt-10 divide-y divide-hp-ink-foreground/10 border-y border-hp-ink-foreground/10">
          {lessonTypes.map((l, i) => (
            <Link
              key={l.slug}
              to="/lessons/$slug"
              params={{ slug: l.slug }}
              className="group flex flex-col gap-3 py-8 transition-colors hover:bg-hp-ink-foreground/[0.03] sm:flex-row sm:items-center sm:gap-10"
            >
              <span className="font-display text-2xl font-black text-hp-ink-foreground/30 sm:w-16">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-3xl font-extrabold sm:w-72">{l.short}</span>
              <span className="text-base text-hp-ink-foreground/65 sm:flex-1">{l.blurb}</span>
              <span className="font-extrabold uppercase tracking-wide text-hp-accent opacity-0 transition-opacity group-hover:opacity-100 sm:ml-auto">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
