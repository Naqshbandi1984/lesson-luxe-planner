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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="w-full">
      {/* Navy hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Legal</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            Privacy
          </h1>
          <p className="mt-4 max-w-xl text-lg text-hp-ink-foreground/75">
            How we handle the details you provide when booking.
          </p>
        </div>
      </section>

      {/* Ivory body */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <div className="space-y-6 text-hp-paper-foreground/80 leading-relaxed">
            <p>
              Details you provide when booking — name, phone number, email and pick-up postcode —
              are used only to arrange and deliver your lessons and to send booking confirmations and
              reminders.
            </p>
            <p>Your details are never sold or shared for marketing purposes.</p>
            <p>
              To ask what is held about you, or to have it deleted, email{" "}
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
                Full privacy notice — TBD, to be reviewed before launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
