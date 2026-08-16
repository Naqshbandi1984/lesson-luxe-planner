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

/** learnerdriver.academy is verified with Resend (separate Resend account,
 * fresh RESEND_API_KEY in .env.local), so sending is no longer restricted to
 * the Resend account's own address. */
export const EMAIL_FROM = "learnerdriver.academy <enquiries@learnerdriver.academy>";

/** Where booking notifications go — the owner's actual inbox. */
export const ADMIN_NOTIFICATION_EMAIL = "ibs_1@hotmail.co.uk";
