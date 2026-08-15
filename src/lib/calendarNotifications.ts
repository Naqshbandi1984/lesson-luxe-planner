import { createServerFn } from "@tanstack/react-start";
import {
  removeCalendarEventForCancelledBooking,
  syncCalendarEventForConfirmedBooking,
} from "./calendarSync";

/** Client-callable entry point for src/lib/calendarSync.ts — used after the
 * admin confirms a bank-transfer booking. The card path calls
 * syncCalendarEventForConfirmedBooking directly in-process from the Stripe
 * webhook instead, since it's already running server-side there. */
export const syncCalendarForConfirmedBooking = createServerFn({ method: "POST" })
  .validator((input: { bookingId: string }) => input)
  .handler(async ({ data }) => syncCalendarEventForConfirmedBooking(data.bookingId));

/** Client-callable entry point used after the admin cancels a booking. */
export const removeCalendarEventForCancellation = createServerFn({ method: "POST" })
  .validator((input: { calendarEventId: string | null }) => input)
  .handler(async ({ data }) => removeCalendarEventForCancelledBooking(data.calendarEventId));
