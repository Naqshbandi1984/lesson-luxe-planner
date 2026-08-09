import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy | learnerdriver.academy" },
      {
        name: "description",
        content:
          "How learnerdriver.academy handles the personal details you provide when booking driving lessons in Reading.",
      },
      { property: "og:title", content: "Privacy" },
      { property: "og:description", content: "How your booking details are handled." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Privacy</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Details you provide when booking — name, phone number, email and pick-up postcode — are
          used only to arrange and deliver your lessons and to send booking confirmations and
          reminders.
        </p>
        <p>Your details are never sold or shared for marketing purposes.</p>
        <p>
          To ask what is held about you, or to have it deleted, email {site.email}.
        </p>
        <p className="rounded-xl border border-border bg-sand p-5">
          Full privacy notice — TBD, to be reviewed before launch.
        </p>
      </div>
    </div>
  ),
});
