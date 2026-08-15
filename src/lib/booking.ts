import { BOOKING_WINDOW_DAYS, openingHours } from "./site";
import { supabase } from "./supabase";

export type Slot = {
  /** ISO date, e.g. 2026-08-12 */
  date: string;
  /** 24h start time, e.g. 11:30 */
  start: string;
  /** 24h end time, e.g. 13:00 */
  end: string;
  available: boolean;
};

export type BookableDay = {
  date: string;
  weekday: string;
  dayNumber: string;
  month: string;
  closed: boolean;
  slots: Slot[];
};

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Trims a Postgres `time` value ("11:30:00") down to "HH:MM" for comparison against generated slots. */
function toHHMM(time: string) {
  return time.slice(0, 5);
}

export type AvailabilityException = {
  date: string;
  start_time: string | null;
  end_time: string | null;
};

type TakenSlot = {
  date: string;
  start_time: string;
  end_time: string;
};

function isBlocked(date: string, start: string, end: string, exceptions: AvailabilityException[]) {
  return exceptions.some((ex) => {
    if (ex.date !== date) return false;
    const exStart = ex.start_time ? toHHMM(ex.start_time) : null;
    const exEnd = ex.end_time ? toHHMM(ex.end_time) : null;
    // Null start+end together means closed all day; otherwise standard interval overlap.
    return (exStart === null || exStart < end) && (exEnd === null || exEnd > start);
  });
}

/** The [firstDate, lastDate] (inclusive, YYYY-MM-DD) of the rolling booking window starting from `from`. */
export function bookingWindowRange(from: Date = new Date()): {
  firstDate: string;
  lastDate: string;
} {
  const firstDate = isoDate(from);
  const lastDate = isoDate(
    new Date(from.getFullYear(), from.getMonth(), from.getDate() + BOOKING_WINDOW_DAYS - 1),
  );
  return { firstDate, lastDate };
}

/**
 * Builds the rolling booking window starting from `from` (defaults to
 * today), using real availability/bookings from Supabase, plus any extra
 * busy blocks the caller passes in (e.g. real Google Calendar events) —
 * merged in with exactly the same overlap rules as manual exceptions, so a
 * slot is only ever offered as available when nothing blocks it anywhere.
 */
export async function getBookableDays(
  from: Date = new Date(),
  extraExceptions: AvailabilityException[] = [],
): Promise<BookableDay[]> {
  const { firstDate, lastDate } = bookingWindowRange(from);

  const [{ data: exceptions, error: availabilityError }, { data: taken, error: takenError }] =
    await Promise.all([
      supabase
        .from("availability")
        .select("date, start_time, end_time")
        .gte("date", firstDate)
        .lte("date", lastDate),
      supabase.rpc("get_taken_slots", { p_from: firstDate, p_to: lastDate }),
    ]);

  if (availabilityError) throw availabilityError;
  if (takenError) throw takenError;

  const takenByDay = new Map<string, Set<string>>();
  for (const t of (taken ?? []) as TakenSlot[]) {
    const set = takenByDay.get(t.date) ?? new Set<string>();
    set.add(toHHMM(t.start_time));
    takenByDay.set(t.date, set);
  }

  const allExceptions = [...(exceptions ?? []), ...extraExceptions];
  const days: BookableDay[] = [];

  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const rule = openingHours.find((h) => h.day === d.getDay());
    const date = isoDate(d);
    const slots: Slot[] = [];
    const takenToday = takenByDay.get(date);

    if (rule) {
      for (const { start, end } of rule.slots) {
        const blocked = takenToday?.has(start) || isBlocked(date, start, end, allExceptions);
        slots.push({ date, start, end, available: !blocked });
      }
    }

    days.push({
      date,
      weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
      dayNumber: String(d.getDate()),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
      closed: slots.length === 0,
      slots,
    });
  }

  return days;
}

export function formatLongDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 0, (m ?? 1) - 1, d ?? 1).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
