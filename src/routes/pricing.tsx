import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gbp, policies, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Driving Lesson Prices in Reading | learnerdriver.academy" },
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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Pricing</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        One clear rate for every lesson, and a package that brings the hourly cost down. Everything
        is paid upfront, so there's nothing to settle at the roadside.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <h2 className="font-display text-xl font-semibold">{pricing.lesson.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{pricing.lesson.duration}</p>
          <p className="mt-5 font-display text-5xl font-bold">{gbp(pricing.lesson.price)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {gbp(pricing.lesson.price / 1.5)} per hour
          </p>
        </div>
        <div className="rounded-2xl border-2 border-accent bg-accent/10 p-8 shadow-card">
          <h2 className="font-display text-xl font-semibold">{pricing.package.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Roughly six and a half lessons, drawn down as you go
          </p>
          <p className="mt-5 font-display text-5xl font-bold">{gbp(pricing.package.price)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{gbp(43)} per hour</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Test day</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Covers use of the car for your practical test plus a warm-up drive beforehand.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.testDay.map((t) => (
            <div key={t.centre} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">{t.centre}</p>
              <p className="mt-2 font-display text-2xl font-bold">{gbp(t.price)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-sand p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Work out your cost</h2>
        <p className="mt-2 text-muted-foreground">
          Rough guide only — most learners need somewhere between 20 and 40 hours in total.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <label htmlFor="hours" className="block font-semibold">
              Hours of tuition: <span className="text-primary">{hours}</span>
            </label>
            <input
              id="hours"
              type="range"
              min={1.5}
              max={45}
              step={1.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--primary)]"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>1.5 hrs</span>
              <span>45 hrs</span>
            </div>

            <fieldset className="mt-8">
              <legend className="font-semibold">Add test day</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCentre("")}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    centre === "" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                  }`}
                >
                  Not yet
                </button>
                {pricing.testDay.map((t) => (
                  <button
                    key={t.centre}
                    type="button"
                    onClick={() => setCentre(t.centre)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                      centre === t.centre
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    }`}
                  >
                    {t.centre} {gbp(t.price)}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Estimated total</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {packages > 0 && (
                <li className="flex justify-between">
                  <span>
                    {packages} × 10-hour package
                  </span>
                  <span>{gbp(packagesTotal)}</span>
                </li>
              )}
              {remainderLessons > 0 && (
                <li className="flex justify-between">
                  <span>
                    {remainderLessons} × 1hr30 lesson
                  </span>
                  <span>{gbp(lessonsTotal)}</span>
                </li>
              )}
              {testFee > 0 && (
                <li className="flex justify-between">
                  <span>Test day — {centre}</span>
                  <span>{gbp(testFee)}</span>
                </li>
              )}
            </ul>
            <p className="mt-5 border-t border-border pt-4 font-display text-3xl font-bold">
              {gbp(total)}
            </p>
            <Link
              to="/book"
              className="mt-5 block rounded-lg bg-accent px-5 py-3 text-center font-semibold text-accent-foreground"
            >
              Start booking
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Paying</h2>
          <p className="mt-2 text-muted-foreground">{policies.payment}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Changes and cancellations</h2>
          <p className="mt-2 text-muted-foreground">{policies.cancellation}</p>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        Questions about pricing? Call{" "}
        <a href={site.phoneHref} className="font-semibold text-primary hover:underline">
          {site.phone}
        </a>{" "}
        or message on WhatsApp.
      </p>
    </div>
  );
}
