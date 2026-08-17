import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock } from "lucide-react";
import { getCheckoutSession } from "@/lib/checkout";
import { site } from "@/lib/site";

export const Route = createFileRoute("/book/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search["session_id"] === "string" ? search["session_id"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Booking confirmed | ${site.brand}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookSuccessPage,
});

function BookSuccessPage() {
  const { session_id: sessionId } = Route.useSearch();

  const { data, isPending, isError } = useQuery({
    queryKey: ["checkout-session", sessionId],
    queryFn: () => getCheckoutSession({ data: { sessionId: sessionId! } }),
    enabled: !!sessionId,
  });

  if (!sessionId) {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-black leading-[0.98] tracking-tight">
              No booking reference found
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg text-hp-ink-foreground/70">
              If you've just paid, check your email for a receipt, or call{" "}
              <a href={site.phoneHref} className="font-bold text-hp-accent hover:underline">
                {site.phone}
              </a>{" "}
              and we'll confirm it directly.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 text-center">
            <p className="text-xl text-hp-ink-foreground/70">Checking your payment…</p>
          </div>
        </section>
      </div>
    );
  }

  if (isError || data.paymentStatus !== "paid") {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-black leading-[0.98] tracking-tight">
              Payment not confirmed yet
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg text-hp-ink-foreground/70">
              If money has left your account, your booking will still go through shortly — we confirm
              bookings from Stripe directly, not from this page. Call{" "}
              <a href={site.phoneHref} className="font-bold text-hp-accent hover:underline">
                {site.phone}
              </a>{" "}
              if you'd like to double-check.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Navy confirmation header */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center bg-hp-accent/20">
            <Check className="h-8 w-8 text-hp-accent" aria-hidden="true" />
          </div>
          <h1 className="mt-8 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            Payment received
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-xl text-hp-ink-foreground/75">
            Thanks{data.customerName ? `, ${data.customerName}` : ""} — your payment's gone through
            and your lesson is being confirmed now.
          </p>
        </div>
      </section>

      {/* Ivory body */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-xl px-5 py-16 sm:px-8 text-center">
          <p className="flex items-center justify-center gap-2 text-hp-paper-foreground/70">
            <Clock className="h-5 w-5" aria-hidden="true" />
            This usually takes a few seconds. If you don't get a confirmation, call{" "}
            <a href={site.phoneHref} className="font-bold text-hp-ink hover:underline">
              {site.phone}
            </a>{" "}
            and we'll sort it directly.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block bg-hp-accent px-10 py-4 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
