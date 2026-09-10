import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { gbp, lessonTypes, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/lessons/$slug")({
  loader: ({ params }) => {
    const lesson = lessonTypes.find((l) => l.slug === params.slug);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Lesson not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.lesson.name} in Reading | ${site.brand}`;
    const description = loaderData.lesson.metaDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LessonPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1400px] px-5 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Lesson type not found</h1>
      <Link to="/pricing" className="mt-4 inline-block text-hp-accent hover:underline">
        See all lessons and pricing →
      </Link>
    </div>
  ),
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const others = lessonTypes.filter((l) => l.slug !== lesson.slug);

  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Courses & Tuition
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            {lesson.name}.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            {lesson.blurb}
          </p>
        </div>
      </section>

      {/* Section 2: Syllabus & Rates Aside */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-start">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-hp-ink tracking-tight">
                What is included in this course
              </h2>
              <ul className="mt-8 space-y-4">
                {lesson.bullets.map((b: string) => (
                  <li
                    key={b}
                    className="flex gap-4 border border-hp-paper-foreground/10 bg-hp-paper-foreground/[0.01] p-5"
                  >
                    <Check className="mt-1 h-6 w-6 shrink-0 text-hp-accent" aria-hidden="true" />
                    <span className="text-base sm:text-lg text-hp-paper-foreground/80 font-bold leading-relaxed">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.03] p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-hp-accent">
                Tuition Rates
              </h3>
              <p className="mt-4 font-display text-4xl font-black text-hp-ink">
                {gbp(pricing.lesson.price)}
              </p>
              <p className="text-sm text-hp-paper-foreground/60">per {pricing.lesson.duration} lesson</p>
              <p className="mt-1 text-sm font-semibold text-hp-accent">
                or {gbp(pricing.lesson.bankTransferPrice)} by bank transfer
              </p>

              <p className="mt-4 text-sm text-hp-paper-foreground/75 font-semibold">
                {pricing.package.label}: {gbp(pricing.package.price)} (or{" "}
                {gbp(pricing.package.bankTransferPrice)} by bank transfer)
              </p>

              <Link
                to="/book"
                className="mt-6 block w-full bg-hp-accent py-4 text-center text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Book a lesson online
              </Link>
              <a
                href={site.phoneHref}
                className="mt-3 block w-full border border-hp-paper-foreground/20 bg-transparent py-4 text-center text-sm font-bold uppercase tracking-wide text-hp-paper-foreground hover:bg-hp-paper-foreground/5"
              >
                Call {site.phone}
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* Section 3: Other Lesson Types */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">Other lesson types</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((l) => (
              <Link
                key={l.slug}
                to="/lessons/$slug"
                params={{ slug: l.slug }}
                className="group border border-hp-ink-foreground/10 bg-hp-ink-foreground/[0.02] p-8 flex flex-col justify-between hover:border-hp-accent hover:bg-hp-ink-foreground/[0.04] transition-all duration-300"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-hp-accent leading-snug">
                    {l.short}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-base text-hp-ink-foreground/60 leading-relaxed font-semibold">
                    {l.blurb}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                  <span>Learn more</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Ready to begin?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Book your automatic driving lessons online or contact us to discuss intensive details.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/book"
                className="inline-flex items-center bg-hp-ink px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-ink-foreground transition-transform hover:-translate-y-0.5"
              >
                Book a lesson
              </Link>
              <a
                href={site.phoneHref}
                className="text-lg font-extrabold underline underline-offset-4 hover:opacity-90"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
