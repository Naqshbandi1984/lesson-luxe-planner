import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/lessons/$slug", params: { slug: "automatic" }, label: "Lessons" },
  { to: "/pricing", label: "Pricing" },
  { to: "/areas", label: "Areas" },
  { to: "/reviews", label: "Reviews" },
  { to: "/pass-gallery", label: "Pass Gallery" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-hp-ink text-hp-ink-foreground">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-6 px-5 sm:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-xl font-extrabold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-hp-accent text-sm font-black text-hp-accent-foreground">
            A
          </span>
          Learner Driver <span className="text-hp-accent">Academy</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...((item as any).exact ? { activeOptions: { exact: true } } : {})}
              className="border-b-2 border-transparent pb-1 text-sm font-bold uppercase tracking-wide text-hp-ink-foreground/60 transition-colors hover:text-hp-ink-foreground"
              activeProps={{ className: "!border-hp-accent !text-hp-accent" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 text-sm font-bold text-hp-ink-foreground/80 hover:text-hp-ink-foreground md:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
          <Link
            to="/book"
            className="inline-flex items-center bg-hp-accent px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-opacity hover:opacity-90"
          >
            Book a lesson
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center text-hp-ink-foreground lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-hp-ink-foreground/10 bg-hp-ink px-5 py-4 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...((item as any).exact ? { activeOptions: { exact: true } } : {})}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg font-bold uppercase tracking-wide text-hp-ink-foreground"
              activeProps={{
                className: "!text-hp-accent underline decoration-2 underline-offset-4",
              }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="mt-2 block py-3 text-lg font-bold uppercase tracking-wide text-hp-accent"
          >
            Call {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
