import { Link } from "@tanstack/react-router";
import { BOOKING_WINDOW_DAYS, policies, site } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="bg-hp-accent text-hp-accent-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8">
        <h2 className="font-display text-6xl font-black leading-none sm:text-7xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium opacity-80">
          Pick a slot in the next {BOOKING_WINDOW_DAYS} days and get started.{" "}
          {policies.cancellation}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Link
            to="/book"
            className="inline-flex items-center bg-hp-ink px-9 py-4 text-base font-extrabold uppercase tracking-wide text-hp-ink-foreground transition-transform hover:-translate-y-0.5"
          >
            Book a lesson
          </Link>
          <a href={site.phoneHref} className="text-lg font-extrabold underline underline-offset-4">
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
