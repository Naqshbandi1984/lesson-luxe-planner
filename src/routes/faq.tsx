import { createFileRoute, Link } from "@tanstack/react-router";
import { FaqJsonLd } from "@/components/site/JsonLd";
import { faqs, site } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Driving Lesson FAQ | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Answers on automatic lessons, prices, paying upfront, the 24-hour cancellation rule, test day fees and booking windows in Reading.",
      },
      { property: "og:title", content: "Automatic driving lesson FAQ" },
      {
        property: "og:description",
        content: "Prices, payment, cancellations, test day and booking questions answered.",
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="w-full">
      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />

      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Help & Support
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Frequently asked questions.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            Answers on automatic lessons, pricing, payments, the 24-hour cancellation policy, and
            practical driving test day slots.
          </p>
        </div>
      </section>

      {/* Section 2: Accordion List */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl border-y border-hp-paper-foreground/10 divide-y divide-hp-paper-foreground/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between list-none font-display text-lg sm:text-xl font-bold tracking-tight text-hp-ink hover:text-hp-accent transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center border border-hp-paper-foreground/20 group-open:rotate-45 transition-transform duration-200 text-lg font-light leading-none">
                    +
                  </span>
                </summary>
                <div className="mt-4 max-w-3xl text-base sm:text-lg text-hp-paper-foreground/75 leading-relaxed">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Don't see your question?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              We are happy to answer any questions or check availability before you book.
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
