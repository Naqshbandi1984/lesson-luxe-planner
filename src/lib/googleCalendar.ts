import type { OAuth2Client } from "google-auth-library";
import type { calendar_v3 } from "googleapis";

// Server-only: must never be imported from a route component. The refresh
// token grants standing access to the connected Google account's calendars.
//
// `googleapis` is a large Node-only CJS package with no browser build — a
// top-level `import { google } from "googleapis"` gets picked up by Vite's
// dependency pre-bundler for the CLIENT the moment any client-reachable
// module imports this file (even just for a createServerFn wrapper), and
// crashes at runtime ("Class extends value undefined"). Loading it via
// dynamic import() instead means there's no static import edge for Vite's
// client-side dep scanner to find, so it never gets bundled for the browser
// — it's only ever actually evaluated when a handler runs server-side.
const CALENDAR_NAME = "Driving Lessons";
const DEFAULT_REDIRECT_URI = "http://localhost:8080";

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("googleCalendar.ts must never be imported from client code.");
  }
}

let googlePromise: Promise<typeof import("googleapis").google> | null = null;
function loadGoogle() {
  if (!googlePromise) {
    googlePromise = import("googleapis").then((m) => m.google);
  }
  return googlePromise;
}

let oauth2Client: OAuth2Client | null = null;

async function getOAuth2Client(): Promise<OAuth2Client> {
  assertServer();
  if (!oauth2Client) {
    const clientId = process.env["GOOGLE_CLIENT_ID"];
    const clientSecret = process.env["GOOGLE_CLIENT_SECRET"];
    if (!clientId || !clientSecret) {
      throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET — check .env.local.");
    }
    const redirectUri = process.env["GOOGLE_REDIRECT_URI"] ?? DEFAULT_REDIRECT_URI;
    const google = await loadGoogle();
    oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const refreshToken = process.env["GOOGLE_REFRESH_TOKEN"];
    if (refreshToken) {
      oauth2Client.setCredentials({ refresh_token: refreshToken });
    }
  }
  return oauth2Client;
}

async function getCalendarClient(): Promise<calendar_v3.Calendar> {
  const [google, auth] = await Promise.all([loadGoogle(), getOAuth2Client()]);
  return google.calendar({ version: "v3", auth });
}

/** True once the one-time account connection (see completeGoogleOAuthSetup) has happened. */
export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env["GOOGLE_CLIENT_ID"] &&
    process.env["GOOGLE_CLIENT_SECRET"] &&
    process.env["GOOGLE_REFRESH_TOKEN"],
  );
}

/** Consent-screen URL for the one-time connection. Requesting a fresh refresh
 * token every time (prompt=consent) since Google only issues one on first
 * consent per client, and we want the setup step to be re-runnable. */
export async function getGoogleAuthUrl(): Promise<string> {
  const client = await getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
}

/** Exchanges the one-time auth code for a refresh token and persists it to
 * .env.local so the connection survives a dev-server restart, then applies
 * it to the live client so calendar sync works immediately without one. */
export async function completeGoogleOAuthSetup(code: string): Promise<void> {
  assertServer();
  const client = await getOAuth2Client();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google didn't return a refresh token. Revoke prior access at " +
        "https://myaccount.google.com/permissions and try the connect link again.",
    );
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const envPath = path.join(process.cwd(), ".env.local");
  const contents = await fs.readFile(envPath, "utf8");
  const line = `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
  const updated = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(contents)
    ? contents.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line)
    : `${contents.trimEnd()}\n${line}\n`;
  await fs.writeFile(envPath, updated, "utf8");

  process.env["GOOGLE_REFRESH_TOKEN"] = tokens.refresh_token;
  client.setCredentials({ refresh_token: tokens.refresh_token });
}

let calendarIdPromise: Promise<string> | null = null;

async function findOrCreateCalendarId(): Promise<string> {
  const calendar = await getCalendarClient();
  const list = await calendar.calendarList.list();
  const existing = list.data.items?.find((c) => c.summary === CALENDAR_NAME);
  if (existing?.id) return existing.id;

  const created = await calendar.calendars.insert({
    requestBody: { summary: CALENDAR_NAME, timeZone: "Europe/London" },
  });
  if (!created.data.id) {
    throw new Error("Google Calendar didn't return an id for the new calendar.");
  }
  return created.data.id;
}

/** Memoized so concurrent bookings don't race to create duplicate calendars;
 * cleared on failure so a later call can retry. */
function getCalendarId(): Promise<string> {
  if (!calendarIdPromise) {
    calendarIdPromise = findOrCreateCalendarId().catch((err: unknown) => {
      calendarIdPromise = null;
      throw err;
    });
  }
  return calendarIdPromise;
}

function hhmm(time: string) {
  return time.slice(0, 5);
}

export type BookingForCalendar = {
  lesson_type_name: string;
  date: string;
  start_time: string;
  end_time: string;
  student_name: string | null;
  student_phone: string;
  price: number;
};

function toEventBody(booking: BookingForCalendar) {
  return {
    summary: `${booking.lesson_type_name} — ${booking.student_name ?? booking.student_phone}`,
    description: [
      `Student: ${booking.student_name ?? "(no name given)"}`,
      `Phone: ${booking.student_phone}`,
      `Price: £${booking.price}`,
    ].join("\n"),
    start: {
      dateTime: `${booking.date}T${hhmm(booking.start_time)}:00`,
      timeZone: "Europe/London",
    },
    end: { dateTime: `${booking.date}T${hhmm(booking.end_time)}:00`, timeZone: "Europe/London" },
  };
}

export async function createLessonCalendarEvent(booking: BookingForCalendar): Promise<string> {
  const [calendar, calendarId] = await Promise.all([getCalendarClient(), getCalendarId()]);
  const res = await calendar.events.insert({ calendarId, requestBody: toEventBody(booking) });
  if (!res.data.id) throw new Error("Google Calendar didn't return an event id.");
  return res.data.id;
}

export async function deleteLessonCalendarEvent(eventId: string): Promise<void> {
  const [calendar, calendarId] = await Promise.all([getCalendarClient(), getCalendarId()]);
  try {
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    const status =
      (err as { code?: number; status?: number }).code ?? (err as { status?: number }).status;
    // Already gone — cancellation must be idempotent, not an error.
    if (status !== 404 && status !== 410) throw err;
  }
}

export type CalendarBusyBlock = {
  date: string;
  start_time: string | null;
  end_time: string | null;
};

/** Converts an event dateTime (which may carry any UTC offset, depending on
 * how/where it was created) into the actual Europe/London wall-clock date
 * and HH:MM — never trust the raw offset string, always resolve to the
 * timezone lessons are actually scheduled in. */
function toLondonDateAndTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { date, time };
}

async function listBusyBlocksForCalendar(
  calendarId: string,
  fromDate: string,
  toDate: string,
): Promise<CalendarBusyBlock[]> {
  const calendar = await getCalendarClient();

  // Query a day of padding either side, then filter precisely by the real
  // London-local date below — avoids edge cases at UTC day boundaries.
  const timeMin = new Date(`${fromDate}T00:00:00Z`);
  timeMin.setUTCDate(timeMin.getUTCDate() - 1);
  const timeMax = new Date(`${toDate}T00:00:00Z`);
  timeMax.setUTCDate(timeMax.getUTCDate() + 2);

  const res = await calendar.events.list({
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const blocks: CalendarBusyBlock[] = [];
  for (const event of res.data.items ?? []) {
    if (event.status === "cancelled") continue;

    if (event.start?.date && !event.start.dateTime) {
      // All-day event (e.g. a day off blocked out) — blocks the entire day.
      if (event.start.date >= fromDate && event.start.date <= toDate) {
        blocks.push({ date: event.start.date, start_time: null, end_time: null });
      }
      continue;
    }

    if (!event.start?.dateTime || !event.end?.dateTime) continue;
    const start = toLondonDateAndTime(event.start.dateTime);
    const end = toLondonDateAndTime(event.end.dateTime);
    if (start.date < fromDate || start.date > toDate) continue;
    blocks.push({ date: start.date, start_time: start.time, end_time: end.time });
  }
  return blocks;
}

/**
 * Real busy blocks across BOTH the dedicated "Driving Lessons" calendar and
 * the connected account's primary calendar, for [fromDate, toDate] inclusive
 * (YYYY-MM-DD). Deliberately not scoped to just the booking calendar — a
 * personal/work commitment on the primary calendar must also block a lesson
 * slot, so the instructor can never be double-booked into teaching while
 * busy elsewhere, per an explicit choice over keeping the two fully separate.
 */
export async function getCalendarBusyBlocks(
  fromDate: string,
  toDate: string,
): Promise<CalendarBusyBlock[]> {
  const calendarId = await getCalendarId();
  const [drivingLessons, primary] = await Promise.all([
    listBusyBlocksForCalendar(calendarId, fromDate, toDate),
    listBusyBlocksForCalendar("primary", fromDate, toDate),
  ]);
  return [...drivingLessons, ...primary];
}
