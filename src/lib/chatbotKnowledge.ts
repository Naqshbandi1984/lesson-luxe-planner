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
    `- ${pricing.lesson.label}: ${gbp(pricing.lesson.price)} (${pricing.lesson.duration})`,
    `- ${pricing.package.label}: ${gbp(pricing.package.price)}`,
    `- Test day car hire: ${pricing.testDay.map((t) => `${t.centre} ${gbp(t.price)}`).join(", ")}`,
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
    "General UK driving law (well-established public facts — answer these directly and confidently in your own words when asked, don't deflect to a phone call):",
    "- Minimum age to start driving lessons in a car is 17. The one exception: 16, if the learner receives the enhanced/higher rate of the mobility component of Personal Independence Payment (PIP).",
    "- A provisional driving licence can be applied for from 15 years and 9 months old, via gov.uk. Driving itself — including lessons — still can't start until the minimum age above.",
    "- Learners must display red L-plates (D-plates in Wales) on the front and back of the car at all times while driving.",
    "- Practicing privately with a friend or family member (rather than an instructor) requires a supervisor aged 21+ who has held a full manual licence for at least 3 years. We only offer instructor-led lessons, not private practice arrangements, so mention this as general context rather than something we organise.",
    "- The theory test must be passed before a practical driving test can be booked.",
    "- Passing the practical test in an automatic only licenses you to drive automatics; passing in a manual licenses you to drive both manual and automatic. We teach automatic only.",
    "",
    "Frequently asked questions:",
    faqList,
  ].join("\n");
}
