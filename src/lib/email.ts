import { getResendClient, EMAIL_FROM, ADMIN_NOTIFICATION_EMAIL } from "./resend";
import { supabase } from "./supabase";
import { formatLongDate } from "./booking";
import { gbp, policies, site } from "./site";

function hhmm(time: string) {
  return time.slice(0, 5);
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: "Card (paid via Stripe)",
  bank_transfer: "Bank transfer",
};

export type NotifyResult = {
  customerSent: boolean;
  adminSent: boolean;
  errors: string[];
};

/**
 * Sends the customer confirmation + admin notification for a CONFIRMED
 * booking. Plain async function, not a createServerFn — called directly
 * in-process from the Stripe webhook (src/server.ts) and wrapped by
 * notifyBookingConfirmed (src/lib/notifications.ts) for the bank-transfer
 * path, which needs a client-callable entry point.
 *
 * Each email is sent independently: one failing must never block the other,
 * and neither can ever affect the booking's confirmed status — email is a
 * side effect of a booking that already happened, not the source of truth.
 */
export async function sendBookingConfirmationEmail(bookingId: string): Promise<NotifyResult> {
  const result: NotifyResult = { customerSent: false, adminSent: false, errors: [] };

  const { data, error } = await supabase.rpc("get_booking_for_notification", {
    p_booking_id: bookingId,
  });
  if (error || !data || data.length === 0) {
    result.errors.push(`Couldn't load booking ${bookingId} for notification: ${error?.message ?? "not found"}`);
    return result;
  }
  const booking = data[0]!;

  let resend: ReturnType<typeof getResendClient>;
  try {
    resend = getResendClient();
  } catch (err) {
    // Never let a missing/misconfigured RESEND_API_KEY throw out of this
    // function — it's a side effect of a booking that already happened, so
    // a caller (e.g. the Stripe webhook) must never mistake this for the
    // booking itself having failed.
    result.errors.push(`Resend not configured: ${err instanceof Error ? err.message : String(err)}`);
    console.error(`sendBookingConfirmationEmail(${bookingId}):`, result.errors.join(" | "));
    return result;
  }
  const dateLabel = formatLongDate(booking.date);
  const timeLabel = `${hhmm(booking.start_time)}–${hhmm(booking.end_time)}`;
  const paymentLabel = PAYMENT_METHOD_LABEL[booking.payment_method ?? ""] ?? "—";

  if (booking.student_email) {
    try {
      const { error: sendError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: booking.student_email,
        subject: `Your lesson is confirmed — ${dateLabel} at ${hhmm(booking.start_time)}`,
        text: [
          `Hi${booking.student_name ? ` ${booking.student_name}` : ""},`,
          "",
          "Your automatic driving lesson is confirmed:",
          "",
          `Lesson: ${booking.lesson_type_name}`,
          `Date: ${dateLabel}`,
          `Time: ${timeLabel}`,
          `Price: ${gbp(booking.price)}`,
          `Payment: ${paymentLabel}`,
          "",
          policies.cancellation,
          "",
          `Questions? Call ${site.phone} or message on WhatsApp.`,
          "",
          site.brand,
        ].join("\n"),
      });
      if (sendError) throw new Error(sendError.message);
      result.customerSent = true;
    } catch (err) {
      result.errors.push(
        `Customer email failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  } else {
    result.errors.push("No customer email on file — skipped customer notification.");
  }

  try {
    const { error: sendError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New confirmed booking — ${booking.student_name ?? "unnamed"}, ${dateLabel} ${hhmm(booking.start_time)}`,
      text: [
        `${booking.lesson_type_name} confirmed.`,
        "",
        `Date: ${dateLabel}`,
        `Time: ${timeLabel}`,
        `Price: ${gbp(booking.price)}`,
        `Payment: ${paymentLabel}`,
        "",
        `Student: ${booking.student_name ?? "(no name given)"}`,
        `Phone: ${booking.student_phone}`,
        `Email: ${booking.student_email ?? "(none given)"}`,
      ].join("\n"),
    });
    if (sendError) throw new Error(sendError.message);
    result.adminSent = true;
  } catch (err) {
    result.errors.push(`Admin email failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (result.errors.length > 0) {
    console.error(`sendBookingConfirmationEmail(${bookingId}):`, result.errors.join(" | "));
  }

  return result;
}
