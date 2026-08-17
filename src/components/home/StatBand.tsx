import { BOOKING_WINDOW_DAYS, site } from "@/lib/site";

const stats = [
  { value: `${site.rating}★`, label: `From ${site.reviewCountLabel}` },
  // "Over a decade" mirrors site.yearsExperienceLabel, capitalized for this headline context.
  { value: "Over a decade", label: "Of teaching in Reading" },
  { value: `${BOOKING_WINDOW_DAYS}`, label: "Days of availability shown at a time" },
] as const;

export function StatBand() {
  return (
    <section className="bg-hp-accent text-hp-accent-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-5 py-14 sm:grid-cols-3 sm:gap-4 sm:px-8 sm:py-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="font-display text-6xl font-black leading-none sm:text-7xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide opacity-80">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
