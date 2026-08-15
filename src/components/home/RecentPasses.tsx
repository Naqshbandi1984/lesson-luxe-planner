import { Link } from "@tanstack/react-router";
import { recentPasses } from "@/lib/pass-photos";
import { cn } from "@/lib/utils";

export function RecentPasses() {
  return (
    <section className="bg-hp-ink text-hp-ink-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl font-extrabold sm:text-6xl">Recent passes</h2>
            <p className="mt-3 max-w-md text-lg text-hp-ink-foreground/65">
              Real students, real test-day certificates — the proof that matters most.
            </p>
          </div>
          <Link
            to="/pass-gallery"
            className="text-sm font-extrabold uppercase tracking-wide text-hp-accent"
          >
            View full pass gallery →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {recentPasses.slice(0, 5).map((photo) => (
            <div
              key={photo.src}
              className={cn(
                "group overflow-hidden",
                photo.crop?.wrapperClass ?? "aspect-[4/5]",
              )}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                  photo.crop?.imgClass,
                )}
              />
              {photo.name && (
                <p className="bg-hp-ink px-2 py-1.5 text-center text-sm font-bold">
                  {photo.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
