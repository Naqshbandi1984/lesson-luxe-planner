import { Link } from "@tanstack/react-router";
import { gbp, pricing } from "@/lib/site";

export function PricingSplit() {
  return (
    <section className="bg-hp-paper text-hp-paper-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:gap-0">
        <div className="md:border-r md:border-hp-paper-foreground/10 md:pr-16">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-hp-accent">
            What it costs
          </h2>
          <div className="mt-6">
            <p className="font-display text-6xl font-black leading-none sm:text-7xl">
              {gbp(pricing.lesson.price)}
            </p>
            <p className="mt-2 text-lg font-bold">
              {pricing.lesson.label} · {pricing.lesson.duration}
            </p>
            <p className="mt-1 text-sm font-semibold text-hp-accent">
              or {gbp(pricing.lesson.bankTransferPrice)} by bank transfer
            </p>
          </div>
          <div className="mt-10">
            <p className="font-display text-6xl font-black leading-none sm:text-7xl">
              {gbp(pricing.package.price)}
            </p>
            <p className="mt-2 text-lg font-bold">{pricing.package.label} · best value per hour</p>
            <p className="mt-1 text-sm font-semibold text-hp-accent">
              or {gbp(pricing.package.bankTransferPrice)} by bank transfer
            </p>
          </div>
        </div>

        <div className="md:pl-16">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-hp-accent">
            Test day
          </h2>
          <ul className="mt-6 space-y-5">
            {pricing.testDay.map((t) => (
              <li key={t.centre} className="flex items-baseline justify-between gap-4 text-lg">
                <span className="font-bold">{t.centre}</span>
                <span className="font-display text-2xl font-black">{gbp(t.price)}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/pricing"
            className="mt-8 inline-flex items-center border-b-2 border-hp-accent pb-1 text-sm font-extrabold uppercase tracking-wide"
          >
            Full pricing and the lesson calculator →
          </Link>
        </div>
      </div>
    </section>
  );
}
