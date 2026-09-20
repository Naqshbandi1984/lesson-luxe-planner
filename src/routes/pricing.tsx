import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gbp, policies, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Driving Lesson Prices in Reading | ${site.brand}` },
      {
        name: "description",
        content:
          "Automatic driving lesson prices in Reading: £67.50 per 1hr30 lesson, £430 for 10 hours, test day from £100. No hidden fees.",
      },
      { property: "og:title", content: "Driving lesson prices in Reading" },
      {
        property: "og:description",
        content: "£67.50 per 1hr30 automatic lesson, £430 for a 10-hour package.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const [hours, setHours] = useState(10);
  const [centre, setCentre] = useState<string>("");

  const packages = Math.floor(hours / 10);
  const remainderHours = hours - packages * 10;
  const remainderLessons = Math.ceil(remainderHours / 1.5);
  const lessonsTotal = remainderLessons * pricing.lesson.price;
  const packagesTotal = packages * pricing.package.price;
  const testFee = pricing.testDay.find((t) => t.centre === centre)?.price ?? 0;
  const total = packagesTotal + lessonsTotal + testFee;

  return (
    <div className="w-full">
      {/* Section 1: Hero & Base Rates */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Rates & Packages
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Transparent pricing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            One clear rate for every lesson, and a package that brings the hourly cost down.
            Everything is paid upfront, so there's nothing to settle at the roadside.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-hp-ink-foreground/10 bg-hp-ink-foreground/[0.03] p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-hp-accent">
                {pricing.lesson.label}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold">{pricing.lesson.duration}</h2>
              <p className="mt-6 font-display text-5xl font-black leading-none sm:text-6xl text-hp-accent">
                {gbp(pricing.lesson.price)}
              </p>
              <p className="mt-3 text-sm text-hp-ink-foreground/60">
                Works out as {gbp(pricing.lesson.price / 1.5)} per hour
              </p>
            </div>

            <div className="border-2 border-hp-accent bg-hp-accent/5 p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-hp-accent">
                  {pricing.package.label}
                </p>
                <span className="bg-hp-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-hp-accent-foreground">
                  Best Value
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold">Six and a bit lessons</h2>
              <p className="mt-6 font-display text-5xl font-black leading-none sm:text-6xl text-hp-accent">
                {gbp(pricing.package.price)}
              </p>
              <p className="mt-3 text-sm text-hp-ink-foreground/60">
                Works out as {gbp(pricing.package.price / 10)} per hour
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Cost Calculator & Test Day */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Interactive Calculator
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold leading-none tracking-tight">
            Work out your cost
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-hp-paper-foreground/70">
            Rough guide only — most learners need somewhere between 20 and 40 hours in total.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-start">
            <div className="space-y-10">
              <div>
                <label htmlFor="hours" className="block text-lg font-bold">
                  Hours of tuition: <span className="text-hp-accent text-xl">{hours} hrs</span>
                </label>
                <input
                  id="hours"
                  type="range"
                  min={1.5}
                  max={45}
                  step={1.5}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="mt-6 w-full accent-hp-accent cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs font-bold text-hp-paper-foreground/50">
                  <span>1.5 hrs</span>
                  <span>45 hrs</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-hp-paper-foreground/60">
                  Add test day centre
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCentre("")}
                    className={`border px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                      centre === ""
                        ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                        : "border-hp-paper-foreground/20 bg-transparent hover:border-hp-accent"
                    }`}
                  >
                    No test day
                  </button>
                  {pricing.testDay.map((t) => (
                    <button
                      key={t.centre}
                      type="button"
                      onClick={() => setCentre(t.centre)}
                      className={`border px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                        centre === t.centre
                          ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                          : "border-hp-paper-foreground/20 bg-transparent hover:border-hp-accent"
                      }`}
                    >
                      {t.centre} ({gbp(t.price)})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.03] p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-hp-accent">
                Estimated Total
              </h3>
              <ul className="mt-6 space-y-4 border-b border-hp-paper-foreground/10 pb-6 text-base font-medium text-hp-paper-foreground/75">
                {packages > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>{packages} × 10-hour package</span>
                    <span className="font-bold text-hp-paper-foreground">{gbp(packagesTotal)}</span>
                  </li>
                )}
                {remainderLessons > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>{remainderLessons} × 1hr30 lesson</span>
                    <span className="font-bold text-hp-paper-foreground">{gbp(lessonsTotal)}</span>
                  </li>
                )}
                {testFee > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>Test day — {centre}</span>
                    <span className="font-bold text-hp-paper-foreground">{gbp(testFee)}</span>
                  </li>
                )}
              </ul>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display text-4xl font-black text-hp-ink">{gbp(total)}</span>
              </div>
              <Link
                to="/book"
                className="mt-8 block w-full bg-hp-accent py-4 text-center text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Start booking online
              </Link>
            </div>
          </div>

          <div className="mt-20 border-t border-hp-paper-foreground/10 pt-16">
            <h3 className="font-display text-2xl font-bold tracking-tight">Test day fees</h3>
            <p className="mt-2 text-base text-hp-paper-foreground/70">
              Covers use of the car for your practical test plus a warm-up drive beforehand.
            </p>
            <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
              {pricing.testDay.map((t) => (
                <div
                  key={t.centre}
                  className="border border-hp-paper-foreground/10 bg-hp-paper-foreground/[0.01] p-6"
                >
                  <p className="text-sm font-bold uppercase tracking-wide text-hp-paper-foreground/60">
                    {t.centre}
                  </p>
                  <p className="mt-3 font-display text-3xl font-black text-hp-ink">{gbp(t.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Policies */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border border-hp-ink-foreground/10 bg-hp-ink-foreground/[0.02] p-8">
              <h2 className="font-display text-2xl font-bold">Paying</h2>
              <p className="mt-4 text-base text-hp-ink-foreground/70 leading-relaxed">
                {policies.payment}
              </p>
            </div>
            <div className="border border-hp-ink-foreground/10 bg-hp-ink-foreground/[0.02] p-8">
              <h2 className="font-display text-2xl font-bold">Changes & Cancellations</h2>
              <p className="mt-4 text-base text-hp-ink-foreground/70 leading-relaxed">
                {policies.cancellation} Inside 24 hours the lesson is charged in full, because the
                slot can rarely be refilled at short notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Questions about pricing?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              We are happy to talk things through before you commit to a booking.
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
