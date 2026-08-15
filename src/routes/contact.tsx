import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { areas, openingHours, site } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Call 07825 031594, message on WhatsApp or email enquiries@learnerdriver.academy for automatic driving lessons in Reading.",
      },
      { property: "og:title", content: "Contact learnerdriver.academy" },
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
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Contact</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Quickest answer is usually WhatsApp. Happy to talk things through before you book anything.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <a
          href={site.phoneHref}
          className="rounded-2xl border border-border bg-card p-6 hover:shadow-card"
        >
          <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-lg font-semibold">Call</h2>
          <p className="mt-1 text-muted-foreground">{site.phone}</p>
        </a>
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-border bg-card p-6 hover:shadow-card"
        >
          <MessageCircle className="h-5 w-5 text-success" aria-hidden="true" />
          <h2 className="mt-3 font-display text-lg font-semibold">WhatsApp</h2>
          <p className="mt-1 text-muted-foreground">Message any time</p>
        </a>
        <a
          href={site.emailHref}
          className="rounded-2xl border border-border bg-card p-6 hover:shadow-card"
        >
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-lg font-semibold">Email</h2>
          <p className="mt-1 break-words text-muted-foreground">{site.email}</p>
        </a>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-bold">Hours</h2>
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {openingHours.map((h) => (
              <li key={h.label} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium">{h.label}</span>
                <span className="text-sm text-muted-foreground">
                  {h.slots.length > 0
                    ? h.slots.map((s) => `${s.start}–${s.end}`).join(", ")
                    : "Closed"}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">Areas covered</h2>
          <p className="mt-3 text-muted-foreground">
            {areas.map((a) => a.postcode).join(", ")} — door-to-door pick up across Reading.
          </p>
          <Link
            to="/book"
            className="mt-6 inline-block rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground"
          >
            Book a lesson
          </Link>
        </section>
      </div>
    </div>
  );
}
