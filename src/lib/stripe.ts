import Stripe from "stripe";

// Server-only: this must never be imported from a route component, only from
// inside createServerFn handlers and src/server.ts, so the secret key never
// reaches the client bundle.
let client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (typeof window !== "undefined") {
    throw new Error("getStripeClient() must never be called from client code.");
  }
  if (!client) {
    const secretKey = process.env["STRIPE_SECRET_KEY"];
    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY — check .env.local.");
    }
    client = new Stripe(secretKey);
  }
  return client;
}
