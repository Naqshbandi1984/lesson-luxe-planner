import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { areas, gbp, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = areas.find((a) => a.slug === params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Area not found" }, { name: "robots", content: "noindex" }] };
    }
    const { area } = loaderData;
    const title = `Automatic Driving Lessons in ${area.name} (${area.postcode}) | ${site.brand}`;
    const description = `Automatic driving lessons in ${area.name}, ${area.postcode}. ${area.places}. Door-to-door pick up, from £67.50/lesson.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AreaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1400px] px-5 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Area not found</h1>
      <Link to="/areas" className="mt-4 inline-block text-hp-accent hover:underline">
        See all areas covered →
      </Link>
    </div>
  ),
});

function AreaPage() {
  const { area } = Route.useLoaderData();
  const others = areas.filter((a) => a.slug !== area.slug);

  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Coverage / {area.postcode}
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Lessons in {area.name}.
          </h1>
          
          <div className="mt-5 flex items-center gap-2 text-sm font-bold">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-hp-accent text-hp-accent" />
              ))}
            </span>
            <span>
              {site.rating} rating in Reading
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Details & Pricing Aside */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-start">
            <div className="space-y-6 text-lg text-hp-paper-foreground/85 leading-relaxed">
              <h2 className="font-display text-3xl font-extrabold text-hp-ink tracking-tight">
                Learn on your local test routes.
              </h2>
              <p className="font-bold text-hp-ink">{area.note}</p>
              <p>{area.localBlurb}</p>
              <p>
                Pick up covers {area.places}. Lessons are {pricing.lesson.duration} long in a modern
                automatic, and you are collected from home, work, or college — whichever suits your day best.
              </p>
              <p>
                With {site.yearsExperienceLabel} of teaching in Reading, lessons around {area.name} are
                built around the specific junctions, one-way systems, and roundabouts that actually come up on
                the practical test, rather than a generic syllabus.
              </p>
            </div>

            <aside className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.03] p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-hp-accent">
                Lessons in {area.postcode}
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

      {/* Section 3: Other Areas */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">Other areas covered</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((a) => (
              <Link
                key={a.slug}
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="border border-hp-ink-foreground/20 bg-hp-ink-foreground/5 hover:border-hp-accent px-5 py-3 font-bold transition-all text-sm uppercase tracking-wide"
              >
                {a.postcode} — {a.name}
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
              Ready to start in {area.name}?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Book your automatic lesson today or call {site.phone} to discuss your schedule.
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
