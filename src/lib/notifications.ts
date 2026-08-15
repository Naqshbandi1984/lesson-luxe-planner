import { createServerFn } from "@tanstack/react-start";
import { sendBookingConfirmationEmail } from "./email";

/** Client-callable entry point for src/lib/email.ts — used after the admin
 * confirms a bank-transfer booking. The card path calls
 * sendBookingConfirmationEmail directly in-process from the Stripe webhook
 * instead, since it's already running server-side there. */
export const notifyBookingConfirmed = createServerFn({ method: "POST" })
  .validator((input: { bookingId: string }) => input)
  .handler(async ({ data }) => sendBookingConfirmationEmail(data.bookingId));
