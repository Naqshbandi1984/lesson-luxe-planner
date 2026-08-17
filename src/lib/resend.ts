import { Resend } from "resend";
import { site } from "./site";

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

/** The learnerdriver.academy domain is verified with Resend (separate Resend
 * account, fresh RESEND_API_KEY in .env.local), so sending is no longer
 * restricted to the Resend account's own address. Display name uses the
 * site's branding (site.brand); the email address itself stays the real
 * domain regardless of how the business is branded. */
export const EMAIL_FROM = `${site.brand} <enquiries@learnerdriver.academy>`;

/** Where booking notifications go — the owner's actual inbox. */
export const ADMIN_NOTIFICATION_EMAIL = "ibs_1@hotmail.co.uk";
