import { Check } from "lucide-react";

const points = [
  "One less thing to think about — no clutch and no gear changes",
  "Hill starts stop being a source of dread",
  "More attention on hazards, junctions and road position",
  "Most learners reach test standard in fewer hours",
] as const;

export function WhyAutomatic() {
  return (
    <section className="bg-hp-paper text-hp-paper-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-20 sm:px-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-5xl font-extrabold sm:text-6xl">
            Why learners pick automatic
          </h2>
          <ul className="mt-8 space-y-5">
            {points.map((point) => (
              <li key={point} className="flex gap-4 text-lg font-medium">
                <Check className="mt-1 h-6 w-6 shrink-0 text-hp-accent" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center border-l-4 border-hp-accent pl-8">
          {/* "Over a decade" mirrors site.yearsExperienceLabel, capitalized for this headline context. */}
          <p className="font-display text-6xl font-black leading-none sm:text-7xl">
            Over a decade
          </p>
          <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-hp-paper-foreground/60">
            Teaching automatics in Reading
          </p>
          <p className="mt-6 text-base text-hp-paper-foreground/70">
            One instructor, start to finish — the person you book with is the person who
            teaches every lesson.
          </p>
        </div>
      </div>
    </section>
  );
}
