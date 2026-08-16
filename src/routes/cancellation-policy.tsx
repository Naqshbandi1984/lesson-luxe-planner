import { createFileRoute } from "@tanstack/react-router";
import { policies, site } from "@/lib/site";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy | learnerdriver.academy" },
      {
        name: "description",
        content:
          "24 hours' notice is required to cancel or change a booked automatic driving lesson or test with learnerdriver.academy.",
      },
      { property: "og:title", content: "Cancellation policy" },
      {
        property: "og:description",
        content: "24 hours' notice to cancel or change a booking.",
      },
    ],
  }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <div className="w-full">
      {/* Navy hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Legal</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            Cancellation policy
          </h1>
          <p className="mt-4 max-w-xl text-lg text-hp-ink-foreground/75">
            24 hours' notice required to cancel or change a booking without charge.
          </p>
        </div>
      </section>

      {/* Ivory body */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <div className="space-y-6 text-hp-paper-foreground/80 leading-relaxed">
            <p>{policies.cancellation}</p>
            <p>
              Lessons cancelled or moved with less than 24 hours' notice are charged in full,
              because the slot can rarely be refilled at short notice. The same applies to a booked
              practical test.
            </p>
            <p>{policies.payment}</p>
            <p>
              To cancel or rearrange, call or WhatsApp{" "}
              <a href={site.phoneHref} className="font-bold text-hp-ink hover:underline">
                {site.phone}
              </a>
              , or email{" "}
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
                Final policy wording — TBD, to be confirmed by the instructor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
