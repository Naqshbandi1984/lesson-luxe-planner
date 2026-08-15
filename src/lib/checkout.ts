import { createServerFn } from "@tanstack/react-start";
import { getStripeClient } from "./stripe";

export type CheckoutInput = {
  phone: string;
  name: string;
  email?: string;
  lessonTypeSlug: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  price: number;
  productName: string;
  origin: string;
};

/**
 * Creates a Stripe Checkout Session with the entire booking payload stored
 * as session metadata. Nothing is written to Supabase here — the webhook
 * (src/server.ts) is what calls book_lesson() once payment actually
 * succeeds, so an abandoned or failed checkout leaves no trace anywhere.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((input: CheckoutInput) => input)
  .handler(async ({ data }) => {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      ...(data.email ? { customer_email: data.email } : {}),
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: data.productName },
            unit_amount: Math.round(data.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        phone: data.phone,
        name: data.name,
        email: data.email ?? "",
        lesson_type_slug: data.lessonTypeSlug,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        notes: data.notes ?? "",
        price: String(data.price),
      },
      success_url: `${data.origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/book?cancelled=1`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return { url: session.url };
  });

export type CheckoutSessionStatus = {
  paymentStatus: string;
  customerName: string | null;
};

/**
 * Read-only lookup for the success page. Never writes to Supabase — the
 * webhook is the only thing that confirms a booking.
 */
export const getCheckoutSession = createServerFn({ method: "GET" })
  .validator((input: { sessionId: string }) => input)
  .handler(async ({ data }): Promise<CheckoutSessionStatus> => {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    return {
      paymentStatus: session.payment_status,
      customerName: typeof session.metadata?.["name"] === "string" ? session.metadata["name"] : null,
    };
  });
