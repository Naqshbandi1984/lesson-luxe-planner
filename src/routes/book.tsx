import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { formatLongDate, getBookableDays } from "@/lib/booking";
import { BOOKING_WINDOW_DAYS, gbp, lessonTypes, policies, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Automatic Driving Lesson in Reading | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Choose a lesson type, pick a 1hr30 slot in the next 7 days and review your booking. Automatic lessons across Reading.",
      },
      { property: "og:title", content: "Book an automatic driving lesson in Reading" },
      {
        property: "og:description",
        content: "Pick a 1hr30 slot in the next seven days and reserve your lesson.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

type Product = { id: string; name: string; detail: string; price: number };

const products: Product[] = [
  {
    id: "lesson",
    name: pricing.lesson.label,
    detail: `${pricing.lesson.duration} of automatic tuition`,
    price: pricing.lesson.price,
  },
  {
    id: "package",
    name: pricing.package.label,
    detail: "10 hours to draw down, first lesson booked now",
    price: pricing.package.price,
  },
  ...pricing.testDay.map((t) => ({
    id: `test-${t.centre.toLowerCase()}`,
    name: `Test day — ${t.centre}`,
    detail: "Car hire for your practical test plus warm-up drive",
    price: t.price,
  })),
];

function BookPage() {
  const days = useMemo(() => getBookableDays(), []);
  const [productId, setProductId] = useState(products[0]!.id);
  const [lessonFocus, setLessonFocus] = useState(lessonTypes[0]!.slug);
  const [dayIndex, setDayIndex] = useState(() => days.findIndex((d) => !d.closed));
  const [slot, setSlot] = useState<string | null>(null);

  const product = products.find((p) => p.id === productId)!;
  const day = days[Math.max(dayIndex, 0)]!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Book a lesson</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Bookings open on a rolling {BOOKING_WINDOW_DAYS}-day window. Pick what you need, choose a
        slot, then confirm.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">1. What do you need?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {products.map((p) => {
                const selected = p.id === productId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductId(p.id)}
                    aria-pressed={selected}
                    className={`rounded-xl border p-4 text-left transition-shadow ${
                      selected ? "border-primary bg-primary/5 shadow-card" : "border-border hover:shadow-card"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-display font-bold">{gbp(p.price)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.detail}</p>
                  </button>
                );
              })}
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">What are you working on?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {lessonTypes.map((l) => (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => setLessonFocus(l.slug)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                      lessonFocus === l.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    }`}
                  >
                    {l.short}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">2. Pick a slot</h2>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((d, i) => {
                const selected = i === dayIndex;
                return (
                  <button
                    key={d.date}
                    type="button"
                    disabled={d.closed}
                    onClick={() => {
                      setDayIndex(i);
                      setSlot(null);
                    }}
                    className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-secondary"
                    } ${d.closed ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <span className="block text-xs uppercase">{d.weekday}</span>
                    <span className="block font-display text-lg font-bold">{d.dayNumber}</span>
                    <span className="block text-xs">{d.closed ? "Closed" : d.month}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              {day.closed ? (
                <p className="text-muted-foreground">
                  Closed on {formatLongDate(day.date)} — Fridays are a non-teaching day.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-3">
                  {day.slots.map((s) => {
                    const id = `${s.date}T${s.start}`;
                    const selected = slot === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSlot(id)}
                        className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-secondary"
                        } ${!s.available ? "cursor-not-allowed opacity-40 line-through" : ""}`}
                      >
                        {s.start}–{s.end}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">3. Your details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="name" autoComplete="name" />
              <Field label="Mobile number" id="tel" type="tel" autoComplete="tel" />
              <Field label="Email" id="email" type="email" autoComplete="email" />
              <Field label="Pick-up postcode" id="postcode" autoComplete="postal-code" />
            </div>
            <label htmlFor="notes" className="mt-4 block text-sm font-medium">
              Anything I should know?
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Previous experience, test date already booked, access notes…"
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Your booking</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row term="Booking" desc={product.name} />
              <Row
                term="Focus"
                desc={lessonTypes.find((l) => l.slug === lessonFocus)?.short ?? "—"}
              />
              <Row
                term="Date"
                desc={slot ? formatLongDate(slot.slice(0, 10)) : "No slot selected yet"}
              />
              <Row term="Time" desc={slot ? `${slot.slice(11)} for 1hr 30` : "—"} />
            </dl>
            <p className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-semibold">Total due</span>
              <span className="font-display text-3xl font-bold">{gbp(product.price)}</span>
            </p>

            <button
              type="button"
              disabled={!slot}
              className="mt-5 w-full rounded-lg bg-accent px-5 py-3.5 font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to payment
            </button>

            <p className="mt-3 flex gap-2 rounded-lg bg-sand p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Card payment is not connected yet. This screen is the handoff point for Stripe
              checkout — the booking summary above is what gets passed to it.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {policies.payment}
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {policies.cancellation}
              </li>
            </ul>

            <p className="mt-5 text-xs text-muted-foreground">
              Prefer to talk first?{" "}
              <a href={site.phoneHref} className="font-semibold text-primary hover:underline">
                {site.phone}
              </a>{" "}
              or see the{" "}
              <Link to="/faq" className="font-semibold text-primary hover:underline">
                FAQ
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  autoComplete,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right font-medium">{desc}</dd>
    </div>
  );
}
