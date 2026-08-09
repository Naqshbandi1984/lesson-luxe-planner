import { createFileRoute } from "@tanstack/react-router";
import { policies, site } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Booking terms for automatic driving lessons with learnerdriver.academy in Reading.",
      },
      { property: "og:title", content: "Terms" },
      { property: "og:description", content: "Booking terms for lessons in Reading." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Terms</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>{policies.payment}</p>
        <p>{policies.cancellation}</p>
        <p>
          A valid UK provisional or full driving licence must be held and produced before the first
          lesson. Lessons may be cut short without refund if the pupil is unfit to drive.
        </p>
        <p>
          Package hours are non-transferable and are drawn down against booked lessons. Questions
          about these terms: {site.email}.
        </p>
        <p className="rounded-xl border border-border bg-sand p-5">
          Full legal terms — TBD, to be reviewed and confirmed before launch.
        </p>
      </div>
    </div>
  ),
});
