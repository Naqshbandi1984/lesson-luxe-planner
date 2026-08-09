import { Link } from "@tanstack/react-router";
import { areas, lessonTypes, openingHours, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">learnerdriver.academy</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Automatic driving lessons across Reading. {site.yearsExperience} years' instructing
            experience, {site.rating} stars from {site.reviewCount} reviews.
          </p>
          <p className="mt-4 text-sm">
            <a href={site.phoneHref} className="font-semibold hover:underline">
              {site.phone}
            </a>
            <br />
            <a href={site.emailHref} className="text-muted-foreground hover:underline">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Lessons
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {lessonTypes.map((l) => (
              <li key={l.slug}>
                <Link to="/lessons/$slug" params={{ slug: l.slug }} className="hover:underline">
                  {l.short}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:underline">
                Book a lesson
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Areas covered
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link to="/areas/$slug" params={{ slug: a.slug }} className="hover:underline">
                  {a.postcode} — {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Hours
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {openingHours.map((h) => (
              <li key={h.label} className="flex justify-between gap-4">
                <span>{h.label}</span>
                <span>{h.open ? `${h.open}–${h.close}` : "Closed"}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/cancellation-policy" className="hover:underline">
                Cancellation policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} learnerdriver.academy — automatic driving lessons in Reading,
        Berkshire.
      </div>
    </footer>
  );
}
