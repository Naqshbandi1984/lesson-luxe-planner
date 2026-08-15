import { Link } from "@tanstack/react-router";
import { areas } from "@/lib/site";

export function AreaStrip() {
  const [flagship, ...rest] = areas;

  return (
    <section className="bg-hp-paper text-hp-paper-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-5xl font-extrabold sm:text-6xl">Where lessons run</h2>
          <Link
            to="/areas"
            className="text-sm font-extrabold uppercase tracking-wide text-hp-accent"
          >
            All areas →
          </Link>
        </div>

        {flagship && (
          <Link
            to="/areas/$slug"
            params={{ slug: flagship.slug }}
            className="mt-10 block border-b-4 border-hp-accent pb-6"
          >
            <span className="font-display text-4xl font-black sm:text-5xl">
              {flagship.postcode}
            </span>
            <span className="ml-3 text-xl font-bold text-hp-paper-foreground/70">
              {flagship.name}
            </span>
          </Link>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-baseline gap-2 rounded-full border-2 border-hp-paper-foreground/15 px-5 py-2.5 text-sm font-bold hover:border-hp-accent"
            >
              <span>{a.postcode}</span>
              <span className="text-hp-paper-foreground/60">{a.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
