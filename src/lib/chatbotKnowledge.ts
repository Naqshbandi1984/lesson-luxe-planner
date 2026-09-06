import {
  areas,
  bankTransfer,
  BOOKING_WINDOW_DAYS,
  faqs,
  gbp,
  lessonTypes,
  openingHours,
  policies,
  pricing,
  site,
} from "./site";

/**
 * Every fact here is read directly from site.ts, the same source of truth
 * the rest of the site renders from — nothing here is invented, so the
 * chatbot can never state a price, hour, or policy that isn't already live
 * on the site itself.
 */
export function buildKnowledgeBlock(): string {
  const hours = openingHours
    .map(
      (h) =>
        `${h.label}: ${h.slots.length > 0 ? h.slots.map((s) => `${s.start}-${s.end}`).join(", ") : "Closed"}`,
    )
    .join("\n");

  const lessons = lessonTypes.map((l) => `- "${l.name}" (slug: ${l.slug}): ${l.blurb}`).join("\n");

  const areasList = areas.map((a) => `${a.postcode} (${a.name})`).join(", ");

  const faqList = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return [
    `Business: ${site.brand} — ${site.tagline}.`,
    `Phone: ${site.phone}`,
    `WhatsApp: ${site.whatsappHref}`,
    `Email: ${site.email}`,
    `${site.yearsExperienceLabel} of instructing experience. ${site.rating} stars from ${site.reviewCountLabel}.`,
    "",
    "Opening hours (each day's exact bookable lesson slot times — there is a gap between slots, lessons are not back-to-back):",
    hours,
    "",
    "Pricing:",
    `- ${pricing.lesson.label}: ${gbp(pricing.lesson.price)}, or ${gbp(pricing.lesson.bankTransferPrice)} if paying by bank transfer (${pricing.lesson.duration})`,
    `- ${pricing.package.label}: ${gbp(pricing.package.price)}, or ${gbp(pricing.package.bankTransferPrice)} if paying by bank transfer`,
    `- Test day car hire: ${pricing.testDay.map((t) => `${t.centre} ${gbp(t.price)}`).join(", ")}`,
    "Bank transfer is discounted because it avoids card-processing costs — always describe this as a bank transfer discount, never as a card fee or surcharge.",
    "",
    "Lesson types (use the slug when suggesting a booking link):",
    lessons,
    "",
    `Areas covered: ${areasList} — door-to-door pick up.`,
    "",
    `Payment policy: ${policies.payment}`,
    `Cancellation policy: ${policies.cancellation}`,
    "",
    `Bank transfer details — only share these if a customer specifically asks how to pay by bank transfer: account name ${bankTransfer.accountName}, sort code ${bankTransfer.sortCode}, account number ${bankTransfer.accountNumber}.`,
    "",
    `Booking window: bookings open on a rolling ${BOOKING_WINDOW_DAYS}-day window starting today. Nothing further ahead than that can be booked yet.`,
    "",
    "Frequently asked questions:",
    faqList,
  ].join("\n");
}
