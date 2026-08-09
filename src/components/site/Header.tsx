import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { to: "/lessons/$slug", params: { slug: "automatic" }, label: "Lessons" },
  { to: "/pricing", label: "Pricing" },
  { to: "/areas", label: "Areas" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            A
          </span>
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            learnerdriver<span className="text-muted-foreground">.academy</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
          <Link
            to="/book"
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card transition-transform hover:-translate-y-px"
          >
            Book a lesson
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="mt-1 block rounded-md px-3 py-3 text-base font-semibold text-primary"
          >
            Call {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
