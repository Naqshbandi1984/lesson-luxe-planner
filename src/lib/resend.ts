import { Resend } from "resend";

// Server-only: only ever import this from createServerFn handlers and
// src/server.ts, so the API key never reaches the client bundle.
let client: Resend | null = null;

export function getResendClient(): Resend {
  if (typeof window !== "undefined") {
    throw new Error("getResendClient() must never be called from client code.");
  }
  if (!client) {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY — check .env.local.");
    }
    client = new Resend(apiKey);
  }
  return client;
}

/**
 * Resend's default sending identity — the only option until
 * learnerdriver.academy is verified as a domain. Under this default domain,
 * Resend will only actually deliver to the email address your Resend
 * account itself is registered under; arbitrary customer addresses will
 * fail to send until domain verification is done. Switch this to a
 * learnerdriver.academy address once that's live.
 */
export const EMAIL_FROM = "learnerdriver.academy <onboarding@resend.dev>";

/**
 * Where booking notifications go — should be ibs_1@hotmail.co.uk, but Resend's
 * default (unverified-domain) sending identity above will only actually
 * deliver to the email address the Resend account itself is registered
 * under, which is akram8430@googlemail.com. Sending to the Hotmail address
 * under this identity silently 403s (confirmed via a real end-to-end booking
 * test), so admin notifications were never actually landing. Switch this
 * back to ibs_1@hotmail.co.uk once learnerdriver.academy is verified as a
 * domain with Resend and EMAIL_FROM above is updated to use it.
 */
export const ADMIN_NOTIFICATION_EMAIL = "akram8430@googlemail.com";
