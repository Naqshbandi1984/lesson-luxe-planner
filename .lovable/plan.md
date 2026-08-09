# learnerdriver.academy — Website Plan (Phase 1)

Note on starting point: this Lovable project is currently an empty template. Nothing from the Bolt.new repo exists here yet, so the build is a clean rebuild of every feature, with data/content migrated from the old site afterwards.

## 1. Goals & success metrics

Primary: booked lessons and qualified enquiries from RG1, RG2, RG4, RG5, RG6, RG7, RG30.

| Metric | Target signal |
| --- | --- |
| Online bookings completed | Paid first lesson or block booked in-site |
| Enquiries | WhatsApp taps, calls, form submits |
| Package value | % of bookings that are 10h blocks or intensives |
| Local visibility | Rankings for "automatic driving lessons Reading" + postcode pages |
| Trust | 5-star review count surfaced on every key page |

Every page carries one primary CTA (Book) and one low-friction CTA (WhatsApp).

## 2. Target audience (priority order)

1. Learner drivers of any age in Reading who specifically want automatic
2. Parents booking/paying for a teen — need price clarity, safety, credibility
3. Nervous / anxious and mature learners — automatic is the draw; tone matters most
4. Intensive / semi-intensive course seekers — need dates, cost, test availability
5. Refresher, licence-conversion, and Pass Plus drivers

## 3. Sitemap

| Page | Purpose |
| --- | --- |
| `/` Home | Hero, trust proof, pricing snapshot, booking CTA |
| `/pricing` | Hourly rates, blocks, intensives, calculator |
| `/book` | Calendar + Stripe checkout |
| `/lessons/automatic` | Core service page for automatic lessons |
| `/lessons/intensive` | Intensive/semi-intensive courses |
| `/lessons/nervous-drivers` | Anxious & mature learners |
| `/lessons/refresher` | Refresher, Pass Plus, licence conversion |
| `/areas` | Hub linking all covered postcodes |
| `/areas/[rg1…rg30]` | 7 local landing pages, one per postcode |
| `/about` | 13 years' experience, instructor bio, credentials |
| `/reviews` | Testimonials + pass stories, review schema |
| `/faq` | Objections: test booking, theory, licence, cancellations |
| `/contact` | Phone, WhatsApp, form, hours |
| `/gift-vouchers` | Sellable voucher (Stripe) |
| `/admin` | Instructor view: schedule, bookings, payments |
| `/terms`, `/privacy`, `/cancellation-policy` | Legal + refund clarity |

## 4. Core user journeys

```text
Ad / Google search
   -> Home or /areas/rg6
   -> Price + reviews visible above fold
   -> "Book your first lesson"
   -> Pick lesson type -> pick slot -> details -> Stripe pay
   -> Confirmation page + email/SMS + calendar invite
```

```text
Undecided visitor
   -> Any page, sticky WhatsApp + chat launcher
   -> Chatbot answers price/area/availability, or hands off to WhatsApp
   -> Chatbot can deep-link into /book with lesson type pre-selected
```

Parent path: Pricing -> gift voucher or block purchase -> pays without needing the learner present.

## 5. Feature decisions

| Feature | Decision | Notes |
| --- | --- | --- |
| Booking calendar | Rebuild (improved) | 1hr30 slots, availability rules, reschedule/cancel with 24h rule, buffer time, Google Calendar sync |
| Pricing calculator | Improve | Lesson count vs 10-hour package, test-day fee by centre, one click into checkout |
| Stripe payments | Deferred to you | Booking flow UI built end-to-end (lesson selection, slot picking, checkout screen) with a clean handoff point; no live payment processing in this build |
| AI chatbot | Rebuild | Answers from your real pricing/FAQ content, WhatsApp and booking handoff |
| WhatsApp button | Keep, refine | Prefilled message with page context, mobile-first placement |
| Instructor admin | Rebuild (improved) | Auth-protected schedule, block-out dates, payments, pass results |
| Reviews module | New | 4.9★ / 119 reviews plus testimonials with review schema |
| Postcode area pages | New | Local SEO for RG1–RG30 |
| Email confirmations + reminders | New | Reduces no-shows; no SMS |
| Blog | Not in v1 | Add later if useful |


## 6. Confirmed business facts

- Brand name used throughout: learnerdriver.academy
- Phone 07825 031594 · enquiries@learnerdriver.academy
- Lesson: £67.50 per 1hr30 lesson
- 10-hour package: £430
- Test day fee: £100 (Reading test centre) · £150 (Farnborough, Greenham, Basingstoke)
- Full payment upfront to secure any booking; 24 hours' notice for cancellations or test changes
- 119 reviews, 4.9 stars — displayed on home, pricing, booking and area pages
- Availability: Mon–Thu 11:30–19:00 (last booking 17:30) · Friday closed · Sat–Sun 13:00–16:15 (last booking 14:45)
- Rolling 7-day booking window — customers can book up to 7 days ahead only

Testimonials and photos follow separately; the build uses clearly marked "TBD" placeholders so nothing is blocked. "Automatic driving lessons Reading" is still used as descriptive/SEO wording, but the brand shown is learnerdriver.academy.

## 7. Content needs

Home hero copy, service page copy for each lesson type, 7 genuinely distinct postcode pages, FAQ set (test booking, theory, licence, cancellations, what's included), pricing table with the figures above, instructor bio built on 13 years' experience, and legal pages. Photography is the main gap.

## 8. Design direction

Confident, local, modern — not stock-clipart driving school. Clean type, strong photography of you and the car, big legible pricing (£67.50 / £430 shown plainly), generous mobile tap targets, 4.9★ from 119 reviews as a persistent trust bar. Calm blue/teal base with a warm high-contrast CTA accent; avoiding the tired red L-plate cliché. I'll produce 3 rendered design directions for you to pick from before building anything.

## 9. Technical plan

- TanStack Start (React + Vite) — this project's fixed framework
- Database and auth: your existing Supabase project, connected directly to this project rather than provisioning a new backend, so all data stays in one place for later migration
- Tables: services/prices, availability rules, bookings, customers, payments, reviews, area content, FAQ
- Payments: Stripe, reusing the payment flow and logic from the Bolt site — full payment upfront at booking, no deposits. Send me the existing Stripe/checkout code (or repo access) and I'll port it rather than rebuild
- Booking rules: 1hr30 slots, 10-hour package credits, test-day products at £100/£150 by centre, 24-hour cancellation window enforced in the reschedule/cancel flow
- Google Calendar two-way sync for your diary
- Email confirmations and reminders only — no SMS
- WhatsApp click-to-chat with page-context prefilled message
- AI chatbot answering from your real pricing/FAQ content, with booking and WhatsApp handoff
- Instructor admin behind Supabase auth: schedule, block-out dates, bookings, payments, pass results

## 10. Remaining open items

1. Access to the Bolt repo (or the Stripe checkout + webhook files pasted in) so the payment flow can be ported rather than rewritten.
2. Your Supabase project URL and publishable key, so I can connect the existing database — plus a quick look at the current table structure.
3. Weekly availability pattern and how far ahead bookings can be made.
4. Testimonials and photos.


## Phase 2 build order (after approval)

1. Design directions + design system, Cloud + Stripe enabled
2. Home, pricing + calculator, booking flow with payments
3. Service pages, area pages, reviews, FAQ, contact
4. Instructor admin, notifications, chatbot
5. SEO, schema, performance pass, content migration

I'll check in at each milestone rather than building silently.
