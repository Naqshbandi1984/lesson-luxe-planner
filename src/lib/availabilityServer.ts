import { createServerFn } from "@tanstack/react-start";
import { bookingWindowRange, getBookableDays, type BookableDay } from "./booking";
import { getCalendarBusyBlocks } from "./googleCalendar";

/**
 * Server-only: the real, two-source-checked availability. A slot only shows
 * as available if it's free in BOTH Supabase (confirmed bookings + manual
 * exceptions) AND Google Calendar (the "Driving Lessons" calendar and the
 * connected account's primary calendar) — so a lesson added directly in
 * Google Calendar, or one that pre-dates this site, blocks the slot here
 * too. Google Calendar is the real source of truth, not just a one-way
 * notification target.
 *
 * Deliberately does not catch Google Calendar errors here: if the calendar
 * can't be checked, we must not silently claim a slot is free just because
 * Supabase says so — the error propagates so callers show a "couldn't load,
 * call us" fallback instead of a possibly-wrong answer.
 */
export async function getBookableDaysWithCalendarCheck(
  from: Date = new Date(),
): Promise<BookableDay[]> {
  const { firstDate, lastDate } = bookingWindowRange(from);
  const calendarBusyBlocks = await getCalendarBusyBlocks(firstDate, lastDate);
  return getBookableDays(from, calendarBusyBlocks);
}

/** Client-callable entry point — used by /book's availability query. Always
 * checks from the server's current date rather than trusting the browser's
 * clock. */
export const getCheckedBookableDays = createServerFn({ method: "GET" }).handler(() =>
  getBookableDaysWithCalendarCheck(),
);
