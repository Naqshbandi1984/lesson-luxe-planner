import { BOOKING_WINDOW_DAYS, LESSON_MINUTES, openingHours } from "./site";

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

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function toTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Deterministic pseudo-availability so the UI shows a realistic mix of taken
 * and free slots without a backend. Replace with Supabase availability once
 * the existing database is connected.
 */
function mockAvailable(date: string, start: string) {
  let hash = 0;
  const key = `${date}${start}`;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 997;
  return hash % 10 > 2;
}

/** Builds the rolling booking window starting from `from` (defaults to today). */
export function getBookableDays(from: Date = new Date()): BookableDay[] {
  const days: BookableDay[] = [];

  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const rule = openingHours.find((h) => h.day === d.getDay());
    const date = isoDate(d);
    const slots: Slot[] = [];

    if (rule?.open && rule.lastBooking) {
      const first = toMinutes(rule.open);
      const last = toMinutes(rule.lastBooking);
      for (let t = first; t <= last; t += LESSON_MINUTES) {
        slots.push({
          date,
          start: toTime(t),
          end: toTime(t + LESSON_MINUTES),
          available: mockAvailable(date, toTime(t)),
        });
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
