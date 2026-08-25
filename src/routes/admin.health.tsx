import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useAdminSession } from "@/lib/useAdminSession";
import { checkConnections, type ConnectionHealth } from "@/lib/healthCheck";
import type { ConnectionCheckResult } from "@/lib/googleCalendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/health")({
  head: () => ({
    meta: [{ title: "Admin — Connection health" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminHealthPage,
});

function AdminHealthPage() {
  const session = useAdminSession();

  if (session === undefined) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Admin sign in required</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in from the lesson schedule page first, then come back here.
        </p>
        <Link
          to="/admin/bookings"
          className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground"
        >
          Go to admin sign in
        </Link>
      </div>
    );
  }

  return <HealthPanel accessToken={session.access_token} />;
}

function HealthPanel({ accessToken }: { accessToken: string }) {
  const { data, isPending, isFetching, isError, refetch } = useQuery<ConnectionHealth>({
    queryKey: ["connection-health"],
    queryFn: () => checkConnections({ data: { accessToken } }),
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Connection health</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Checks Google Calendar and Supabase right now — the two things{" "}
            <Link to="/book" className="underline hover:text-foreground">
              /book
            </Link>{" "}
            depends on to show real availability.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} aria-hidden="true" />
          {isFetching ? "Checking…" : "Check again"}
        </button>
      </div>

      {isPending && (
        <p className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Checking…
        </p>
      )}

      {isError && !isPending && (
        <p className="mt-8 text-destructive">
          Couldn't run the check — this can mean Supabase itself is unreachable, or your admin
          session has expired. Try refreshing the page, or sign out and back in from the lesson
          schedule page.
        </p>
      )}

      {data && (
        <div className="mt-8 space-y-4">
          <StatusCard label="Google Calendar" result={data.googleCalendar} />
          <StatusCard label="Supabase" result={data.supabase} />
          <p className="text-xs text-muted-foreground">
            Last checked {new Date(data.checkedAt).toLocaleString("en-GB")}.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, result }: { label: string; result: ConnectionCheckResult }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-5 shadow-card",
        result.ok ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5",
      )}
    >
      {result.ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
      )}
      <div>
        <p className="font-semibold">
          {label} — {result.ok ? "Connected" : "Not connected"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.ok ? result.detail : result.message}
        </p>
      </div>
    </div>
  );
}
