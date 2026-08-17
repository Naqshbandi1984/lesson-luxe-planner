import { createFileRoute, Link } from "@tanstack/react-router";
import { areas, site } from "@/lib/site";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: `Areas Covered in Reading | ${site.brand}` },
      {
        name: "description",
        content:
          "Automatic driving lessons with door-to-door pick up across RG1, RG2, RG4, RG5, RG6, RG7 and RG30 in Reading.",
      },
      { property: "og:title", content: "Driving lesson areas across Reading" },
      {
        property: "og:description",
        content: "Door-to-door automatic lessons across seven Reading postcodes.",
      },
    ],
  }),
  component: AreasIndex,
});

function AreasIndex() {
  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Coverage Area
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Areas covered in Reading.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            Lessons run across seven Reading postcodes with door-to-door pick up. You will learn to
            drive on the exact roads, junctions, and roundabouts where you will be tested.
          </p>
        </div>
      </section>

      {/* Section 2: Postcode Grid */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="group border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 flex flex-col justify-between hover:border-hp-accent hover:bg-hp-paper-foreground/[0.04] transition-all duration-300"
              >
                <div>
                  <p className="font-display text-4xl font-black text-hp-accent tracking-tight">
                    {a.postcode}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold text-hp-ink leading-snug">
                    {a.name}
                  </h2>
                  <p className="mt-4 text-base text-hp-paper-foreground/70 leading-relaxed">
                    {a.places}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                  <span>View local routes</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Live in our coverage area?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Book your slot online to start learning automatic driving in Reading.
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
