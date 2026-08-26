import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { areas, openingHours, site } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact | ${site.brand}` },
      {
        name: "description",
        content:
          "Call 07825 031594, message on WhatsApp or email enquiries@learnerdriver.academy for automatic driving lessons in Reading.",
      },
      { property: "og:title", content: `Contact ${site.brand}` },
      {
        property: "og:description",
        content: "Call, WhatsApp or email about automatic driving lessons in Reading.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Get in touch
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Contact us.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            Quickest answer is usually WhatsApp. Happy to talk things through before you book anything.
          </p>
        </div>
      </section>

      {/* Section 2: Contact Options Grid */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <a
              href={site.phoneHref}
              className="group min-w-0 border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 hover:border-hp-accent hover:bg-hp-paper-foreground/[0.04] transition-all duration-300"
            >
              <Phone className="h-6 w-6 text-hp-accent" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-bold text-hp-ink">Call</h2>
              <p className="mt-2 text-base text-hp-paper-foreground/75 font-semibold">
                {site.phone}
              </p>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-hp-accent group-hover:underline">
                Call Ibrar directly →
              </span>
            </a>

            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group min-w-0 border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 hover:border-hp-accent hover:bg-hp-paper-foreground/[0.04] transition-all duration-300"
            >
              <MessageCircle className="h-6 w-6 text-hp-accent" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-bold text-hp-ink">WhatsApp</h2>
              <p className="mt-2 text-base text-hp-paper-foreground/75 font-semibold">
                Message any time
              </p>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-hp-accent group-hover:underline">
                Send a message →
              </span>
            </a>

            <a
              href={site.emailHref}
              className="group min-w-0 border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 hover:border-hp-accent hover:bg-hp-paper-foreground/[0.04] transition-all duration-300"
            >
              <Mail className="h-6 w-6 text-hp-accent" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-bold text-hp-ink">Email</h2>
              <p className="mt-2 text-base text-hp-paper-foreground/75 font-semibold break-words">
                {site.email}
              </p>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-hp-accent group-hover:underline">
                Send an email →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Hours & Coverage */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">Hours</h2>
              <ul className="mt-6 border border-hp-ink-foreground/10 divide-y divide-hp-ink-foreground/10 bg-hp-ink-foreground/[0.01]">
                {openingHours.map((h) => (
                  <li
                    key={h.label}
                    className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between text-base"
                  >
                    <span className="font-bold text-hp-ink-foreground">{h.label}</span>
                    <span className="text-sm font-semibold text-hp-ink-foreground/70">
                      {h.slots.length > 0
                        ? h.slots.map((s) => `${s.start}–${s.end}`).join(", ")
                        : "Closed"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold tracking-tight">Areas covered</h2>
              <p className="text-lg text-hp-ink-foreground/75 leading-relaxed">
                We cover the following Reading postcodes with door-to-door pick up:
              </p>
              <p className="text-xl font-black text-hp-accent tracking-wider leading-relaxed">
                {areas.map((a) => a.postcode).join(", ")}
              </p>
              <p className="text-base text-hp-ink-foreground/60 leading-relaxed">
                Pick up can be arranged from home, work, college or school across all listed postcode locations.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center bg-hp-accent px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Book a lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Ready to book?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Check calendar slots and secure your booking online in a few clicks.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/book"
                className="inline-flex items-center bg-hp-ink px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-ink-foreground transition-transform hover:-translate-y-0.5"
              >
                Book online
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
