import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { areas, dayHoursLabel, lessonTypes, openingHours, site } from "@/lib/site";
import { useAdminSession } from "@/lib/useAdminSession";

export function Footer() {
  const session = useAdminSession();

  return (
    <footer className="bg-hp-ink text-hp-ink-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-4 md:py-20">
        <div>
          <p className="font-display text-2xl font-extrabold">
            learnerdriver<span className="text-hp-accent">.academy</span>
          </p>
          <p className="mt-4 max-w-xs text-sm text-hp-ink-foreground/60">
            Automatic driving lessons across Reading. {site.yearsExperience} years' instructing
            experience, {site.rating} stars from {site.reviewCountLabel}.
          </p>
          <p className="mt-6 text-sm">
            <a
              href={site.phoneHref}
              className="font-bold text-hp-ink-foreground hover:text-hp-accent"
            >
              {site.phone}
            </a>
            <br />
            <a href={site.emailHref} className="text-hp-ink-foreground/60 hover:text-hp-accent">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-hp-accent">
            Lessons
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {lessonTypes.map((l) => (
              <li key={l.slug}>
                <Link
                  to="/lessons/$slug"
                  params={{ slug: l.slug }}
                  className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
                >
                  {l.short}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/pricing"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/book" className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground">
                Book a lesson
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                to="/pass-gallery"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                Pass gallery
              </Link>
            </li>
            <li>
              <Link
                to="/my-lessons"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                My lessons
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-hp-accent">
            Areas covered
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
                >
                  {a.postcode} — {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-hp-accent">Hours</h2>
          <ul className="mt-4 space-y-1.5 text-sm text-hp-ink-foreground/60">
            {openingHours.map((h) => (
              <li key={h.label} className="flex justify-between gap-4">
                <span>{h.label}</span>
                <span>{dayHoursLabel(h)}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-5 space-y-2 text-sm">
            <li>
              <Link
                to="/cancellation-policy"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                Cancellation policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-hp-ink-foreground/75 hover:text-hp-ink-foreground"
              >
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-hp-ink-foreground/10 px-5 py-6 text-center text-xs text-hp-ink-foreground/50 sm:px-8">
        © {new Date().getFullYear()} learnerdriver.academy — automatic driving lessons in Reading,
        Berkshire.
        {session && (
          <Link
            to="/admin/bookings"
            className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-hp-ink-foreground/40 hover:text-hp-accent sm:right-8"
            aria-label="Admin"
            title="Admin"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </footer>
  );
}
