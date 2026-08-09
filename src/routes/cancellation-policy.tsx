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
      { property: "og:description", content: "24 hours' notice to cancel or change a booking." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Cancellation policy</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>{policies.cancellation}</p>
        <p>
          Lessons cancelled or moved with less than 24 hours' notice are charged in full, because
          the slot can rarely be refilled at short notice. The same applies to a booked practical
          test.
        </p>
        <p>{policies.payment}</p>
        <p>
          To cancel or rearrange, call or WhatsApp {site.phone}, or email {site.email}.
        </p>
        <p className="rounded-xl border border-border bg-sand p-5">
          Final policy wording — TBD, to be confirmed by the instructor.
        </p>
      </div>
    </div>
  ),
});
