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
      { title: "Booking confirmed | learnerdriver.academy" },
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
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">No booking reference found</h1>
        <p className="mt-4 text-muted-foreground">
          If you've just paid, check your email for a receipt, or call {site.phone} and
          we'll confirm it directly.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="text-lg text-muted-foreground">Checking your payment…</p>
      </div>
    );
  }

  if (isError || data.paymentStatus !== "paid") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">Payment not confirmed yet</h1>
        <p className="mt-4 text-muted-foreground">
          If money has left your account, your booking will still go through shortly —
          we confirm bookings from Stripe directly, not from this page. Call{" "}
          {site.phone} if you'd like to double-check.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15">
        <Check className="h-7 w-7 text-success" aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Payment received</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Thanks{data.customerName ? `, ${data.customerName}` : ""} — your payment's gone
        through and your lesson is being confirmed now.
      </p>
      <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        This usually takes a few seconds. If you don't get a confirmation, call{" "}
        {site.phone} and we'll sort it directly.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
