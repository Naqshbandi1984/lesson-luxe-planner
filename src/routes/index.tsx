import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, MapPin, ShieldCheck } from "lucide-react";
import { RatingBadge } from "@/components/site/RatingBadge";
import { LocalBusinessJsonLd } from "@/components/site/JsonLd";
import { areas, gbp, lessonTypes, policies, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Automatic Driving Lessons Reading | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Automatic driving lessons across Reading, RG1–RG30. 1hr30 lessons at £67.50, 10 hours for £430. 13 years' experience, 4.9 stars from 119 reviews.",
      },
      { property: "og:title", content: "Automatic Driving Lessons in Reading" },
      {
        property: "og:description",
        content:
          "Patient, automatic-only driving instruction across Reading. Book a 1hr30 lesson online.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <LocalBusinessJsonLd />

      <section className="relative overflow-hidden border-b border-border bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <RatingBadge />
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-balance-tight sm:text-5xl lg:text-6xl">
              Automatic driving lessons in Reading, without the stalling.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              No clutch, no kangaroo starts, no shouting. {site.yearsExperience} years of teaching
              people in Reading to drive — beginners, nervous drivers and anyone coming back to it
              after a break.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex items-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-card transition-transform hover:-translate-y-0.5"
              >
                Book a lesson
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center rounded-lg border border-input bg-card px-6 py-3.5 text-base font-semibold hover:bg-secondary"
              >
                Call {site.phone}
              </a>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock, term: "1hr 30 lessons", desc: `${gbp(pricing.lesson.price)} each` },
                {
                  icon: ShieldCheck,
                  term: "10-hour package",
                  desc: `${gbp(pricing.package.price)} total`,
                },
                { icon: MapPin, term: "Door to door", desc: "RG1–RG30 pick up" },
              ].map(({ icon: Icon, term, desc }) => (
                <div key={term} className="rounded-xl border border-border bg-card p-4">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <dt className="mt-2 font-semibold">{term}</dt>
                  <dd className="text-sm text-muted-foreground">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl font-semibold">What a lesson costs</h2>
            <div className="mt-5 space-y-4">
              <PriceRow
                title={pricing.lesson.label}
                sub={pricing.lesson.duration}
                price={gbp(pricing.lesson.price)}
              />
              <PriceRow
                title={pricing.package.label}
                sub="Best value per hour"
                price={gbp(pricing.package.price)}
                highlight
              />
              <PriceRow
                title="Test day — Reading"
                sub="Car hire plus warm-up drive"
                price={gbp(100)}
              />
              <PriceRow
                title="Test day — Farnborough, Greenham, Basingstoke"
                sub="Car hire plus warm-up drive"
                price={gbp(150)}
              />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{policies.payment}</p>
            <Link
              to="/pricing"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              See full pricing and the lesson calculator →
            </Link>
            <div className="mt-6 rounded-xl bg-sand p-4 text-sm">
              <p className="font-semibold">Photo of instructor and car — TBD</p>
              <p className="text-muted-foreground">
                Placeholder while photography is supplied.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Lessons to suit where you're starting</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lessonTypes.map((l) => (
            <Link
              key={l.slug}
              to="/lessons/$slug"
              params={{ slug: l.slug }}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lift"
            >
              <h3 className="font-display text-lg font-semibold">{l.short}</h3>
              <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">{l.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold">Where lessons run</h2>
              <p className="mt-2 text-muted-foreground">
                Door-to-door pick up across seven Reading postcodes.
              </p>
            </div>
            <Link to="/areas" className="text-sm font-semibold text-primary hover:underline">
              All areas →
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="flex items-baseline gap-2 rounded-lg border border-border bg-card px-4 py-3 hover:shadow-card"
                >
                  <span className="font-display font-bold text-primary">{a.postcode}</span>
                  <span className="text-sm text-muted-foreground">{a.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Why learners pick automatic</h2>
            <ul className="mt-6 space-y-3">
              {[
                "One less thing to think about — no clutch and no gear changes",
                "Hill starts stop being a source of dread",
                "More attention on hazards, junctions and road position",
                "Most learners reach test standard in fewer hours",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <RatingBadge />
            <blockquote className="mt-5 font-display text-xl leading-snug">
              “Real customer testimonial — TBD.”
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">
              Testimonials are being collected and will replace this placeholder.
            </p>
            <Link
              to="/reviews"
              className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Read reviews →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-3xl font-bold">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Pick a slot in the next seven days and get started. {policies.cancellation}
          </p>
          <Link
            to="/book"
            className="mt-7 inline-flex items-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground"
          >
            Book a lesson
          </Link>
        </div>
      </section>
    </>
  );
}

function PriceRow({
  title,
  sub,
  price,
  highlight,
}: {
  title: string;
  sub: string;
  price: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${
        highlight ? "border-accent bg-accent/10" : "border-border"
      }`}
    >
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
      <p className="font-display text-xl font-bold">{price}</p>
    </div>
  );
}
