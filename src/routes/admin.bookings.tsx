import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { gbp } from "@/lib/site";
import { formatLongDate } from "@/lib/booking";
import { notifyBookingConfirmed } from "@/lib/notifications";
import { useAdminSession } from "@/lib/useAdminSession";
import {
  removeCalendarEventForCancellation,
  syncCalendarForConfirmedBooking,
} from "@/lib/calendarNotifications";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [{ title: "Admin — Lesson schedule" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminBookingsPage,
});

function AdminBookingsPage() {
  const session = useAdminSession();

  if (session === undefined) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <AllBookingsList
      adminEmail={session.user.email ?? "(no email on this account)"}
      onSignOut={() => void supabase.auth.signOut()}
    />
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Couldn't sign in — check your email and password.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending_payment: "bg-accent/20 text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-secondary text-secondary-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  pending_payment: "Pending payment",
  cancelled: "Cancelled",
  completed: "Completed",
};

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card",
  bank_transfer: "Bank transfer",
};

function AllBookingsList({ adminEmail, onSignOut }: { adminEmail: string; onSignOut: () => void }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_all_bookings");
      if (error) throw error;
      return data;
    },
  });

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function handleConfirm(bookingId: string) {
    setConfirmingId(bookingId);
    const { error } = await supabase.rpc("confirm_bank_transfer", { p_booking_id: bookingId });
    if (error) {
      setConfirmingId(null);
      window.alert(`Couldn't confirm this booking: ${error.message}`);
      return;
    }
    // Side effects of a booking that already happened — don't let a slow or
    // failed email/calendar attempt hold up the admin's flow any further.
    void notifyBookingConfirmed({ data: { bookingId } }).catch((err: unknown) => {
      console.error("Confirmation email failed to send:", err);
    });
    void syncCalendarForConfirmedBooking({ data: { bookingId } }).catch((err: unknown) => {
      console.error("Calendar sync failed:", err);
    });
    setConfirmingId(null);
    void queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
  }

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(bookingId: string) {
    if (!window.confirm("Cancel this booking? This can't be undone.")) return;
    setCancellingId(bookingId);
    const { data: calendarEventId, error } = await supabase.rpc("cancel_booking", {
      p_booking_id: bookingId,
    });
    if (error) {
      setCancellingId(null);
      window.alert(`Couldn't cancel this booking: ${error.message}`);
      return;
    }
    void removeCalendarEventForCancellation({ data: { calendarEventId } }).catch((err: unknown) => {
      console.error("Calendar cleanup failed:", err);
    });
    setCancellingId(null);
    void queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Lesson schedule</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{adminEmail}</span>
          </p>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Every booking from today forward, earliest first.
      </p>

      {isPending && <p className="mt-8 text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-8 text-destructive">
          Couldn't load bookings: {error instanceof Error ? error.message : "unknown error"}
        </p>
      )}
      {!isPending && !isError && data?.length === 0 && (
        <p className="mt-8 text-muted-foreground">No upcoming bookings.</p>
      )}

      <div className="mt-8 space-y-4">
        {data?.map((b) => {
          const actionable = b.status === "pending_payment" && b.payment_method === "bank_transfer";
          const cancellable = b.status === "pending_payment" || b.status === "confirmed";
          return (
            <div
              key={b.booking_id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{b.student_name ?? "(no name given)"}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[b.status] ?? "bg-secondary"}`}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                    {b.payment_method && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {PAYMENT_LABEL[b.payment_method] ?? b.payment_method}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.student_phone}
                    {b.student_email ? ` · ${b.student_email}` : ""}
                  </p>
                </div>
                <p className="font-display text-xl font-bold">{gbp(b.price)}</p>
              </div>
              <p className="mt-3 text-sm">
                {formatLongDate(b.date)} · {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)} ·{" "}
                {b.lesson_type_slug}
              </p>
              {b.notes && <p className="mt-1 text-sm text-muted-foreground">{b.notes}</p>}

              {(actionable || cancellable) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {actionable && (
                    <button
                      type="button"
                      onClick={() => void handleConfirm(b.booking_id)}
                      disabled={confirmingId === b.booking_id}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                    >
                      {confirmingId === b.booking_id ? "Confirming…" : "Mark as paid"}
                    </button>
                  )}
                  {cancellable && (
                    <button
                      type="button"
                      onClick={() => void handleCancel(b.booking_id)}
                      disabled={cancellingId === b.booking_id}
                      className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive disabled:opacity-50"
                    >
                      {cancellingId === b.booking_id ? "Cancelling…" : "Cancel booking"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
