import { createFileRoute } from "@tanstack/react-router";
import { policies, site } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms | ${site.brand}` },
      {
        name: "description",
        content: `Booking terms for automatic driving lessons with ${site.brand} in Reading.`,
      },
      { property: "og:title", content: "Terms" },
      { property: "og:description", content: "Booking terms for lessons in Reading." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="w-full">
      {/* Navy hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Legal</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            Terms
          </h1>
          <p className="mt-4 max-w-xl text-lg text-hp-ink-foreground/75">
            Booking terms for automatic driving lessons with {site.brand}.
          </p>
        </div>
      </section>

      {/* Ivory body */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <div className="space-y-6 text-hp-paper-foreground/80 leading-relaxed">
            <p>{policies.payment}</p>
            <p>{policies.cancellation}</p>
            <p>
              A valid UK provisional or full driving licence must be held and produced before the
              first lesson. Lessons may be cut short without refund if the pupil is unfit to drive.
            </p>
            <p>
              Package hours are non-transferable and are drawn down against booked lessons. Questions
              about these terms:{" "}
              <a href={`mailto:${site.email}`} className="font-bold text-hp-ink hover:underline">
                {site.email}
              </a>
              .
            </p>
            <div className="border-l-4 border-hp-accent bg-hp-paper-foreground/[0.03] p-6">
              <p className="text-sm font-bold text-hp-paper-foreground/60 uppercase tracking-wide">
                Note
              </p>
              <p className="mt-2 text-sm">
                Full legal terms — TBD, to be reviewed and confirmed before launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
