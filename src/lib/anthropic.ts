import Anthropic from "@anthropic-ai/sdk";

// Server-only: this must never be imported from a route component, only from
// inside createServerFn handlers, so the secret key never reaches the client
// bundle. Mirrors src/lib/stripe.ts.
let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (typeof window !== "undefined") {
    throw new Error("getAnthropicClient() must never be called from client code.");
  }
  if (!client) {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("Missing ANTHROPIC_API_KEY — check .env.local.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/** Fast, cheap model — plenty capable for FAQ-answering and structured
 * booking-intent parsing against a small, well-defined set of real facts. */
export const CHATBOT_MODEL = "claude-haiku-4-5-20251001";
