import "./lib/error-capture";

import type Stripe from "stripe";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getStripeClient } from "./lib/stripe";
import { supabase } from "./lib/supabase";
import { sendBookingConfirmationEmail } from "./lib/email";
import { syncCalendarEventForConfirmedBooking } from "./lib/calendarSync";
import { completeGoogleOAuthSetup } from "./lib/googleCalendar";
import { areas, lessonTypes, site } from "./lib/site";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * The authoritative booking-confirmation step. Stripe posts here directly
 * (server-to-server) once payment actually succeeds — this is deliberately
 * NOT triggered by the client-side redirect to /book/success, since a user
 * closing the tab right after paying must not prevent the booking from
 * being created. Needs the raw request body for signature verification,
 * which is why this lives here rather than as a createServerFn.
 */
async function handleStripeWebhook(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
  if (!signature || !webhookSecret) {
    console.error("Stripe webhook: missing signature header or STRIPE_WEBHOOK_SECRET.");
    return new Response("Webhook not configured.", { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new Response("Invalid signature.", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata ?? {};

    let bookingId: string | null = null;
    try {
      const { data, error } = await supabase.rpc("book_lesson", {
        p_phone: m["phone"] ?? "",
        p_name: m["name"] ?? "",
        p_lesson_type_slug: m["lesson_type_slug"] ?? "",
        p_date: m["date"] ?? "",
        p_start_time: m["start_time"] ?? "",
        p_end_time: m["end_time"] ?? "",
        p_price: Number(m["price"] ?? 0),
        ...(m["notes"] ? { p_notes: m["notes"] } : {}),
        ...(m["email"] ? { p_email: m["email"] } : {}),
      });
      if (error) throw error;
      bookingId = data ?? null;
    } catch (err) {
      // The slot was taken (by a confirmed card or bank-transfer booking)
      // between checkout starting and payment completing. Refund rather
      // than silently keep the customer's money or double-book the slot.
      console.error("book_lesson failed after payment succeeded, refunding:", err);
      if (typeof session.payment_intent === "string") {
        await stripe.refunds.create({ payment_intent: session.payment_intent });
      }
    }

    // Side effects of a booking that ALREADY EXISTS in Supabase — the
    // booking is confirmed and paid for at this point, so nothing here may
    // ever trigger a refund or otherwise undo it, no matter what fails.
    // sendBookingConfirmationEmail is wrapped explicitly: a misconfigured
    // RESEND_API_KEY throws before the function gets a chance to convert
    // that into a logged NotifyResult error. syncCalendarEventForConfirmedBooking
    // already catches its own errors internally, so it's safe to call bare.
    if (bookingId) {
      try {
        await sendBookingConfirmationEmail(bookingId);
      } catch (err) {
        console.error(`Booking ${bookingId} is confirmed, but the confirmation email failed:`, err);
      }
      await syncCalendarEventForConfirmedBooking(bookingId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Indexable pages only — every route the app marks `robots: noindex`
 * (booking flow, my-lessons lookup, admin) is deliberately left out, along
 * with the not-found fallbacks for the two dynamic route families below.
 */
const STATIC_SITEMAP_PAGES: { path: string; priority: string }[] = [
  { path: "/", priority: "1.0" },
  { path: "/pricing", priority: "0.9" },
  { path: "/about", priority: "0.8" },
  { path: "/faq", priority: "0.8" },
  { path: "/areas", priority: "0.8" },
  { path: "/reviews", priority: "0.7" },
  { path: "/contact", priority: "0.6" },
  { path: "/pass-gallery", priority: "0.5" },
  { path: "/cancellation-policy", priority: "0.4" },
  { path: "/privacy", priority: "0.3" },
  { path: "/terms", priority: "0.3" },
];

/**
 * Built from the same site.ts data the pages themselves render from, so a
 * new area or lesson type appears here automatically — nothing to remember
 * to regenerate by hand.
 */
function buildSitemapXml(): string {
  const urls = [
    ...STATIC_SITEMAP_PAGES,
    ...areas.map((a) => ({ path: `/areas/${a.slug}`, priority: "0.7" })),
    ...lessonTypes.map((l) => ({ path: `/lessons/${l.slug}`, priority: "0.7" })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${site.url}${u.path}</loc>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/**
 * One-time Google Calendar connection callback. The redirect URI registered
 * in Google Cloud Console is exactly http://localhost:8080 (no path), so
 * this has to intercept the root route rather than a dedicated /api path —
 * matched narrowly on the `code`+`scope` query params Google always appends,
 * to avoid colliding with ordinary homepage traffic.
 */
async function handleGoogleOAuthCallback(url: URL): Promise<Response> {
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code.", { status: 400 });

  try {
    await completeGoogleOAuthSetup(code);
    return new Response(
      '<html><body style="font-family: sans-serif; padding: 2rem;">' +
        "<h1>Google Calendar connected</h1>" +
        "<p>The refresh token has been saved to .env.local. You can close this tab.</p>" +
        "</body></html>",
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      `<html><body style="font-family: sans-serif; padding: 2rem;"><h1>Connection failed</h1><pre>${message}</pre></body></html>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.pathname === "/api/stripe/webhook" && request.method === "POST") {
      return handleStripeWebhook(request);
    }
    if (url.pathname === "/sitemap.xml" && request.method === "GET") {
      return new Response(buildSitemapXml(), {
        status: 200,
        headers: { "content-type": "application/xml; charset=utf-8" },
      });
    }
    if (url.pathname === "/" && url.searchParams.has("code") && url.searchParams.has("scope")) {
      return handleGoogleOAuthCallback(url);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
