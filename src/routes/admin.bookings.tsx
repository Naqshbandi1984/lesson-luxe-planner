import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, CalendarX, ChevronDown, ChevronUp, Loader2, LogOut, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { gbp } from "@/lib/site";
import { notifyBookingConfirmed } from "@/lib/notifications";
import { useAdminSession } from "@/lib/useAdminSession";
import {
  removeCalendarEventForCancellation,
  syncCalendarForConfirmedBooking,
} from "@/lib/calendarNotifications";
import type { Database } from "@/lib/database.types";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [{ title: "Admin — Lesson schedule" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminBookingsPage,
});

// ── Formatting helpers ──────────────────────────────────────────────────────
// Every date/time value here (date, start_time, end_time) is already a plain
// Europe/London wall-clock value with no UTC offset attached — the whole
// booking system treats it that way throughout (see src/lib/booking.ts and
// src/lib/googleCalendar.ts's own comments on this). Parsing via `new
// Date(isoString)` would apply the BROWSER's timezone to a bare date, which
// is wrong here - always split and construct a local Date instead.

const WEEKDAY_FMT = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const DAY_MONTH_FMT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function parseLocalDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

function formatDayDateTime(date: string, start: string, end: string): string {
  const d = parseLocalDate(date);
  return `${WEEKDAY_FMT.format(d)} ${DAY_MONTH_FMT.format(d)}, ${start.slice(0, 5)}–${end.slice(0, 5)}`;
}

function formatDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh! * 60 + em! - (sh! * 60 + sm!);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatAddress(
  addressLine1: string | null,
  town: string | null,
  postcode: string | null,
): string {
  const parts = [addressLine1, town, postcode].filter(
    (p): p is string => !!p && p.trim().length > 0,
  );
  return parts.length > 0 ? parts.join(", ") : "No address on file";
}

// Display wording only — the underlying `status` column value never
// becomes "delivered" in the database, only on screen: a past booking
// that wasn't cancelled always shows as "Delivered" regardless of whether
// its real status is confirmed/completed. Cancelled always shows as
// "Previously booked" (also display-only — the stored status is still
// literally 'cancelled').
const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending_payment: "bg-accent/20 text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-secondary text-secondary-foreground",
  delivered: "bg-success/15 text-success",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  pending_payment: "Pending payment",
  cancelled: "Previously booked",
  completed: "Completed",
  delivered: "Delivered",
};

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card",
  bank_transfer: "Bank transfer",
};

/** Resolves the DB status + date to the key used for display (badge colour
 * and label) — see the comment on STATUS_BADGE/STATUS_LABEL above. */
function displayStatusKey(status: string, date: string): string {
  if (status === "cancelled") return "cancelled";
  if (date < todayIso()) return "delivered";
  return status;
}

type BookingRow = Database["public"]["Functions"]["list_bookings_admin"]["Returns"][number];
type StudentRow = Database["public"]["Functions"]["list_students_admin"]["Returns"][number];
type StudentBookingRow =
  Database["public"]["Functions"]["list_bookings_for_student"]["Returns"][number];

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
    <Dashboard
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

type Tab = "upcoming" | "past" | "cancelled" | "students";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Previously booked" },
  { id: "students", label: "Students" },
];

function Dashboard({ adminEmail, onSignOut }: { adminEmail: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
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

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-secondary/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "students" ? <StudentsTab /> : <BookingsTab tab={tab} />}</div>
    </div>
  );
}

// ── Upcoming / Past / Cancelled ─────────────────────────────────────────────

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function BookingsTab({ tab }: { tab: "upcoming" | "past" | "cancelled" }) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [limit, setLimit] = useState(100);

  const today = todayIso();
  const effectiveStatus = tab === "cancelled" ? "cancelled" : statusFilter || null;
  const effectiveFrom = dateFrom || (tab === "upcoming" ? today : null);
  const effectiveTo = dateTo || (tab === "past" ? today : null);

  const queryKey = ["admin-bookings", tab, effectiveStatus, effectiveFrom, effectiveTo, limit];

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_bookings_admin", {
        ...(effectiveStatus ? { p_status: effectiveStatus } : {}),
        ...(effectiveFrom ? { p_from: effectiveFrom } : {}),
        ...(effectiveTo ? { p_to: effectiveTo } : {}),
        p_limit: limit,
        p_offset: 0,
      });
      if (error) throw error;
      return data;
    },
  });

  // Upcoming already comes back soonest-first (the RPC always orders
  // ascending by date/start_time) - Past and Cancelled want most-recent-first.
  const rows = (() => {
    if (!data) return [];
    if (tab === "past") return [...data].reverse();
    if (tab === "cancelled") {
      return [...data].sort((a, b) => {
        const aT = a.cancelled_at ? new Date(a.cancelled_at).getTime() : 0;
        const bT = b.cancelled_at ? new Date(b.cancelled_at).getTime() : 0;
        return bT - aT;
      });
    }
    // upcoming/past aren't filtered to a single status by default - exclude
    // cancelled here since it has its own dedicated tab, unless the admin
    // explicitly picked a status filter (in which case respect that).
    return statusFilter ? data : data.filter((b) => b.status !== "cancelled");
  })();

  const totalCount = data?.[0]?.total_count ?? 0;

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        {tab !== "cancelled" && (
          <div>
            <label
              htmlFor="status-filter"
              className="block text-xs font-semibold text-muted-foreground"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_payment">Pending payment</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="date-from" className="block text-xs font-semibold text-muted-foreground">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="mt-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="date-to" className="block text-xs font-semibold text-muted-foreground">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="mt-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Clear dates
          </button>
        )}
      </div>

      {isPending && <p className="mt-8 text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-8 text-destructive">
          Couldn't load bookings: {error instanceof Error ? error.message : "unknown error"}
        </p>
      )}
      {!isPending && !isError && rows.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          {tab === "upcoming" && "No upcoming bookings."}
          {tab === "past" && "No past bookings in this range."}
          {tab === "cancelled" && "Nothing under Previously booked."}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {rows.map((b) => (
          <BookingCard key={b.booking_id} booking={b} onChanged={invalidate} />
        ))}
      </div>

      {data && totalCount > limit && rows.length >= limit && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + 100)}
          className="mt-6 w-full rounded-lg border border-border bg-card py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Load more ({rows.length} of {totalCount})
        </button>
      )}
    </div>
  );
}

function BookingCard({ booking: b, onChanged }: { booking: BookingRow; onChanged: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const actionable = b.status === "pending_payment" && b.payment_method === "bank_transfer";
  const cancellable = b.status === "pending_payment" || b.status === "confirmed";

  async function handleConfirm() {
    setConfirming(true);
    const { error } = await supabase.rpc("confirm_bank_transfer", { p_booking_id: b.booking_id });
    if (error) {
      setConfirming(false);
      window.alert(`Couldn't confirm this booking: ${error.message}`);
      return;
    }
    void notifyBookingConfirmed({ data: { bookingId: b.booking_id } }).catch((err: unknown) => {
      console.error("Confirmation email failed to send:", err);
    });
    void syncCalendarForConfirmedBooking({ data: { bookingId: b.booking_id } }).catch(
      (err: unknown) => {
        console.error("Calendar sync failed:", err);
      },
    );
    setConfirming(false);
    onChanged();
  }

  async function handleCancel() {
    if (!window.confirm("This booking will stay in your records under Previously booked.")) return;
    setCancelling(true);
    const { data: calendarEventId, error } = await supabase.rpc("cancel_booking", {
      p_booking_id: b.booking_id,
    });
    if (error) {
      setCancelling(false);
      window.alert(`Couldn't cancel this booking: ${error.message}`);
      return;
    }
    void removeCalendarEventForCancellation({ data: { calendarEventId } }).catch((err: unknown) => {
      console.error("Calendar cleanup failed:", err);
    });
    setCancelling(false);
    onChanged();
  }

  const statusKey = displayStatusKey(b.status, b.date);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{b.student_name ?? "(no name given)"}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[statusKey] ?? "bg-secondary"}`}
            >
              {STATUS_LABEL[statusKey] ?? b.status}
            </span>
            {b.payment_method && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                {PAYMENT_LABEL[b.payment_method] ?? b.payment_method}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                b.calendar_event_id
                  ? "bg-success/15 text-success"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {b.calendar_event_id ? (
                <Calendar className="h-3 w-3" aria-hidden="true" />
              ) : (
                <CalendarX className="h-3 w-3" aria-hidden="true" />
              )}
              {b.calendar_event_id ? "Synced" : "Not synced"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {b.student_phone}
            {b.student_email ? ` · ${b.student_email}` : ""}
          </p>
        </div>
        <p className="font-display text-xl font-bold">{gbp(b.price)}</p>
      </div>

      <p className="mt-3 text-sm">
        {formatDayDateTime(b.date, b.start_time, b.end_time)} ·{" "}
        {formatDuration(b.start_time, b.end_time)} · {b.lesson_type_slug}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatAddress(b.address_line1, b.town, b.postcode)}
      </p>
      {b.notes && <p className="mt-1 text-sm text-muted-foreground">{b.notes}</p>}
      {b.cancelled_at && (
        <p className="mt-1 text-xs text-muted-foreground">
          Cancelled {formatDayDateTime(b.cancelled_at.slice(0, 10), "00:00", "00:00").split(",")[0]}
        </p>
      )}

      {(actionable || cancellable) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actionable && (
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={confirming}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
            >
              {confirming ? "Confirming…" : "Mark as paid"}
            </button>
          )}
          {cancellable && (
            <button
              type="button"
              onClick={() => void handleCancel()}
              disabled={cancelling}
              className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive disabled:opacity-50"
            >
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Students ─────────────────────────────────────────────────────────────────

function StudentsTab() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin-students", search],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_students_admin", {
        ...(search ? { p_search: search } : {}),
      });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email…"
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isPending && <p className="mt-8 text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-8 text-destructive">
          Couldn't load students: {error instanceof Error ? error.message : "unknown error"}
        </p>
      )}
      {!isPending && !isError && data?.length === 0 && (
        <p className="mt-8 text-muted-foreground">No students match that search.</p>
      )}

      <div className="mt-6 space-y-3">
        {data?.map((s) => (
          <StudentCard
            key={s.student_id}
            student={s}
            expanded={expandedId === s.student_id}
            onToggle={() => setExpandedId(expandedId === s.student_id ? null : s.student_id)}
          />
        ))}
      </div>
    </div>
  );
}

function StudentCard({
  student: s,
  expanded,
  onToggle,
}: {
  student: StudentRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-wrap items-start justify-between gap-3 text-left"
      >
        <div>
          <p className="font-semibold">{s.name ?? "(no name given)"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {s.phone}
            {s.email ? ` · ${s.email}` : ""}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatAddress(s.address_line1, s.town, s.postcode)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div className="text-sm">
            <p className="font-semibold">
              {s.total_lessons} lesson{s.total_lessons === 1 ? "" : "s"}
            </p>
            <p className="text-muted-foreground">
              {s.next_lesson_date
                ? `Next: ${s.next_lesson_date}`
                : s.last_lesson_date
                  ? `Last: ${s.last_lesson_date}`
                  : "No lessons yet"}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>

      {expanded && <StudentHistory studentId={s.student_id} />}
    </div>
  );
}

function StudentHistory({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin-student-history", studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_bookings_for_student", {
        p_student_id: studentId,
      });
      if (error) throw error;
      return data;
    },
  });

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["admin-student-history", studentId] });
    void queryClient.invalidateQueries({ queryKey: ["admin-students"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      {isPending && <p className="text-sm text-muted-foreground">Loading history…</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load history: {error instanceof Error ? error.message : "unknown error"}
        </p>
      )}
      {!isPending && !isError && data?.length === 0 && (
        <p className="text-sm text-muted-foreground">No bookings yet.</p>
      )}
      {data?.map((b) => (
        <StudentHistoryRow key={b.booking_id} booking={b} onChanged={invalidate} />
      ))}
    </div>
  );
}

function StudentHistoryRow({
  booking: b,
  onChanged,
}: {
  booking: StudentBookingRow;
  onChanged: () => void;
}) {
  const [cancelling, setCancelling] = useState(false);
  const cancellable = b.status === "pending_payment" || b.status === "confirmed";

  async function handleCancel() {
    if (!window.confirm("This booking will stay in your records under Previously booked.")) return;
    setCancelling(true);
    const { data: calendarEventId, error } = await supabase.rpc("cancel_booking", {
      p_booking_id: b.booking_id,
    });
    if (error) {
      setCancelling(false);
      window.alert(`Couldn't cancel this booking: ${error.message}`);
      return;
    }
    void removeCalendarEventForCancellation({ data: { calendarEventId } }).catch((err: unknown) => {
      console.error("Calendar cleanup failed:", err);
    });
    setCancelling(false);
    onChanged();
  }

  const statusKey = displayStatusKey(b.status, b.date);

  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[statusKey] ?? "bg-secondary"}`}
        >
          {STATUS_LABEL[statusKey] ?? b.status}
        </span>
        <span className="text-sm font-semibold">{gbp(b.price)}</span>
      </div>
      <p className="mt-2 text-sm">
        {formatDayDateTime(b.date, b.start_time, b.end_time)} ·{" "}
        {formatDuration(b.start_time, b.end_time)} · {b.lesson_type_slug}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatAddress(b.address_line1, b.town, b.postcode)}
      </p>
      {b.notes && <p className="mt-1 text-xs text-muted-foreground">{b.notes}</p>}
      {cancellable && (
        <button
          type="button"
          onClick={() => void handleCancel()}
          disabled={cancelling}
          className="mt-2 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive disabled:opacity-50"
        >
          {cancelling ? "Cancelling…" : "Cancel booking"}
        </button>
      )}
    </div>
  );
}
