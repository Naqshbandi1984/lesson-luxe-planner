import { createServerFn } from "@tanstack/react-start";
import { getAnthropicClient, CHATBOT_MODEL } from "./anthropic";
import { getBookableDaysWithCalendarCheck } from "./availabilityServer";
import type { BookableDay } from "./booking";
import { buildKnowledgeBlock } from "./chatbotKnowledge";
import { BOOKING_WINDOW_DAYS, lessonTypes, site } from "./site";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type BookingSuggestion = { lessonTypeSlug: string; date: string; time: string };

const MARKER_START = "<<<BOOKING_SUGGESTION>>>";
const MARKER_END = "<<<END_BOOKING_SUGGESTION>>>";

function buildAvailabilityBlock(days: BookableDay[]): string {
  return days
    .map((d) => {
      if (d.closed) return `${d.date} (${d.weekday}): closed`;
      const slots = d.slots
        .map((s) => `${s.start}-${s.end} [${s.available ? "available" : "booked"}]`)
        .join(", ");
      return `${d.date} (${d.weekday}): ${slots}`;
    })
    .join("\n");
}

function buildSystemPrompt(knowledge: string, availability: string): string {
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const todayLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return [
    `You are the booking assistant for ${site.brand}, a real driving school website in Reading, UK. Today's date is ${todayIso} (${todayLabel}).`,
    "",
    "RULES — follow these exactly:",
    "1. Only state facts given to you below. Never invent a price, opening hour, policy, testimonial, or availability that isn't listed here.",
    "",
    "Real facts about the business:",
    knowledge,
    "",
    `Real current availability for the next ${BOOKING_WINDOW_DAYS} days (the only days that can be booked — nothing beyond this list can be booked yet):`,
    availability,
    "",
    '2. Never tell a customer a slot is available unless it is marked "[available]" above. If what they want isn\'t marked available, offer the closest real alternatives from the table above, or suggest calling/WhatsApp.',
    "3. Never ask for, accept, or discuss card numbers or other payment details in this chat, under any circumstances. Payment always happens on the website's own booking page, where the customer chooses card or bank transfer themselves.",
    '4. When you propose one specific available lesson type + date + time, ask the customer to confirm it ONCE — e.g. "Does Saturday 15 August at 13:00 work for you?". The moment they reply with any clear affirmative to that question — "yes", "sounds good", "book it", "go ahead", "that works", or similar — the slot is agreed. Do not ask a second confirmation question afterwards (never say things like "Is that all correct?" or "Shall I go ahead?" once they\'ve already said yes) — one confirmation only, then hand off immediately in that same reply.',
    "5. The moment a slot is agreed (per rule 4), end that same reply with exactly one machine-readable line in this exact format (valid JSON, all on one line, nothing after it, no other text on that line):",
    `${MARKER_START}{"lessonTypeSlug":"SLUG","date":"YYYY-MM-DD","time":"HH:MM"}${MARKER_END}`,
    `Use the exact slug from the lesson types list above (one of: ${lessonTypes.map((l) => l.slug).join(", ")}). Do not emit this line speculatively, as an example, before the customer has confirmed, or more than once per reply.`,
    "6. If a question is outside what's listed above — legal advice, mechanical or technical issues, complaints, anything you're not certain of — say honestly that you don't have that information, and offer WhatsApp or a phone call instead of guessing.",
    "7. Keep replies short, friendly, conversational, UK English. No markdown headers or bullet-point spam — this is a chat widget, not a document.",
  ].join("\n");
}

/** Extracts the booking-suggestion marker (if any) and returns the reply
 * with it stripped out for display, plus the raw parsed suggestion (not yet
 * validated against real availability — see validateSuggestion). */
function extractSuggestion(text: string): { cleanText: string; raw: BookingSuggestion | null } {
  const startIdx = text.indexOf(MARKER_START);
  if (startIdx === -1) return { cleanText: text.trim(), raw: null };

  const endIdx = text.indexOf(MARKER_END, startIdx);
  const jsonStr = text
    .slice(startIdx + MARKER_START.length, endIdx === -1 ? undefined : endIdx)
    .trim();
  const cleanText = text.slice(0, startIdx).trim();

  try {
    const parsed = JSON.parse(jsonStr) as Partial<BookingSuggestion>;
    if (
      typeof parsed.lessonTypeSlug === "string" &&
      typeof parsed.date === "string" &&
      typeof parsed.time === "string"
    ) {
      return {
        cleanText,
        raw: { lessonTypeSlug: parsed.lessonTypeSlug, date: parsed.date, time: parsed.time },
      };
    }
  } catch {
    // Malformed marker — treat as no suggestion rather than surfacing it.
  }
  return { cleanText, raw: null };
}

/** Defense in depth: even though the model is instructed to only suggest
 * available slots, never trust it — cross-check against the same real
 * availability data it was given before ever handing the client a link. */
function validateSuggestion(
  raw: BookingSuggestion | null,
  days: BookableDay[],
): BookingSuggestion | null {
  if (!raw) return null;
  if (!lessonTypes.some((l) => l.slug === raw.lessonTypeSlug)) return null;

  const day = days.find((d) => d.date === raw.date);
  if (!day || day.closed) return null;

  const slot = day.slots.find((s) => s.start === raw.time);
  if (!slot || !slot.available) return null;

  return raw;
}

const AVAILABILITY_CHECK_FAILED_REPLY =
  "Sorry, I'm having trouble checking real availability right now — please call " +
  `${site.phone} or message on WhatsApp and we'll sort out a time directly.`;

export const sendChatMessage = createServerFn({ method: "POST" })
  .validator((input: { messages: ChatMessage[] }) => input)
  .handler(async ({ data }) => {
    let days: BookableDay[];
    try {
      days = await getBookableDaysWithCalendarCheck();
    } catch (err) {
      // Never guess at availability if the real check (Supabase + Google
      // Calendar) fails — a wrong "available" answer risks double-booking.
      console.error("Availability check failed in chatbot:", err);
      return { reply: AVAILABILITY_CHECK_FAILED_REPLY, suggestion: null };
    }
    const knowledge = buildKnowledgeBlock();
    const availability = buildAvailabilityBlock(days);
    const system = buildSystemPrompt(knowledge, availability);

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: CHATBOT_MODEL,
      max_tokens: 600,
      system,
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    const { cleanText, raw } = extractSuggestion(text);
    const suggestion = validateSuggestion(raw, days);

    return { reply: cleanText, suggestion };
  });
