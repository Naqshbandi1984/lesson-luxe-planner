import {
  createLessonCalendarEvent,
  deleteLessonCalendarEvent,
  isGoogleCalendarConfigured,
} from "./googleCalendar";
import { supabase } from "./supabase";

/**
 * Creates (or, on retry, re-creates) the Google Calendar event for a
 * CONFIRMED booking and records the event id back on the row. Plain async
 * function, not a createServerFn — called directly in-process from the
 * Stripe webhook (src/server.ts) and wrapped by syncCalendarForConfirmedBooking
 * (src/lib/calendarNotifications.ts) for the bank-transfer path.
 *
 * Mirrors sendBookingConfirmationEmail: calendar sync is a side effect of a
 * booking that already happened, so a failure here is logged and swallowed,
 * never surfaced as an error and never allowed to affect booking status.
 */
export async function syncCalendarEventForConfirmedBooking(bookingId: string): Promise<void> {
  if (!isGoogleCalendarConfigured()) {
    console.error(
      `Calendar sync skipped for booking ${bookingId}: Google Calendar isn't connected yet.`,
    );
    return;
  }

  try {
    const { data, error } = await supabase.rpc("get_booking_for_notification", {
      p_booking_id: bookingId,
    });
    if (error || !data || data.length === 0) {
      throw new Error(error?.message ?? "booking not found");
    }
    const booking = data[0]!;

    const eventId = await createLessonCalendarEvent({
      lesson_type_name: booking.lesson_type_name,
      date: booking.date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      student_name: booking.student_name,
      student_phone: booking.student_phone,
      price: booking.price,
    });

    const { error: setError } = await supabase.rpc("set_booking_calendar_event_id", {
      p_booking_id: bookingId,
      p_calendar_event_id: eventId,
    });
    if (setError) throw new Error(setError.message);
  } catch (err) {
    console.error(`Calendar sync failed for booking ${bookingId}:`, err);
  }
}

/** Deletes the calendar event for a just-cancelled booking. Takes the event
 * id directly (cancel_booking returns it) rather than looking it up again. */
export async function removeCalendarEventForCancelledBooking(
  calendarEventId: string | null,
): Promise<void> {
  if (!calendarEventId) return;
  if (!isGoogleCalendarConfigured()) {
    console.error("Calendar cleanup skipped: Google Calendar isn't connected yet.");
    return;
  }
  try {
    await deleteLessonCalendarEvent(calendarEventId);
  } catch (err) {
    console.error(`Failed to delete calendar event ${calendarEventId}:`, err);
  }
}
