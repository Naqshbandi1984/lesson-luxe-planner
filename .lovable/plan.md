# Automatic Driving Lessons Reading — Website Plan (Phase 1)

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

1. Learner drivers 17–25 in Reading who specifically want automatic
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
| Booking calendar | Rebuild (improved) | Availability rules, lesson durations, deposits, reschedule/cancel links, buffer time, Google Calendar sync |
| Pricing calculator | Improve | Fewer inputs, instant total, one-click straight into checkout |
| AI chatbot | Rebuild | Answers from your real pricing/FAQ content, WhatsApp and booking handoff |
| WhatsApp button | Keep, refine | Prefilled message with page context, mobile-first placement |
| Instructor admin | Rebuild (improved) | Auth-protected schedule, block off dates, view payments, mark pass results |
| Stripe checkout | New | Deposits, full lessons, blocks, intensives, vouchers |
| Reviews module | New | Testimonials with review schema |
| Postcode area pages | New | Local SEO |
| Email/SMS confirmations + reminders | New | Reduces no-shows |
| Blog | Not in v1 | Add later if useful |

## 6. Content needs

Needed from you: instructor photo(s), car photo, 8–12 written testimonials (name + area + pass date), exact current prices for hourly/blocks/intensives, working hours, phone number, business email, licence/ADI details, pass-rate or pass-count if you want it stated, cancellation policy wording. I'll draft all page copy for your review; nothing invented — ratings, pass rates, and quotes only go live once you supply them.

## 7. Design direction

Confident, local, modern — not stock-clipart driving school. Clean type, strong photography of you and the car, big legible pricing, generous mobile tap targets. Palette leaning calm blue/teal with a warm high-contrast accent for CTAs, avoiding the tired red/L-plate cliché unless you want it. I'll produce 3 rendered design directions to pick from before building. Reference feel: Booksy-style booking clarity, Monzo-style plain-English trust copy, local-service simplicity.

## 8. Technical plan

- TanStack Start (React + Vite) — this project's fixed framework, replacing the plain Vite/React setup
- Lovable Cloud for database, auth, storage, and server logic (Postgres + row-level security)
- Tables: lessons/services, availability rules, bookings, customers, payments, reviews, area pages, chatbot FAQ
- Stripe Checkout for deposits, blocks, intensives, vouchers; webhook confirms booking
- Google Calendar sync for your diary; email confirmations; optional SMS reminders
- WhatsApp via click-to-chat link (no API cost); Business API only if you later want automation
- Migration: content, testimonials, and pricing lifted from the Bolt site; historical bookings imported only if you want them

## 9. SEO & local search

- Primary: automatic driving lessons Reading, automatic driving instructor Reading, automatic driving lessons near me
- Secondary: intensive automatic driving course Reading, automatic driving lessons for nervous drivers Reading, female-friendly/patient instructor variants, plus per-postcode terms for RG1, RG2, RG4, RG5, RG6, RG7, RG30
- One indexable page per postcode with genuinely local content (test centre, common routes, pickup areas) — not duplicated text
- LocalBusiness + DrivingSchool schema, aggregate review schema, FAQ schema
- NAP consistent with Google Business Profile; GBP services/products mirrored on the pricing page; review-request link after each pass
- Fast mobile performance, compressed images, clear internal linking from home to areas and services

## 10. Open questions

1. Exact current prices: hourly, 5h/10h blocks, intensive course tiers?
2. Deposit or full payment at booking, and your cancellation window?
3. Business name to display, phone, email, and Google Business Profile link?
4. Do you want the review count and pass rate stated numerically? If so, exact figures.
5. Diary: Google Calendar sync, or manage availability only in the admin panel?
6. SMS reminders wanted (small per-message cost), or email only?
7. Anything from the Bolt site you want kept exactly as-is?
8. Reference sites you like — send 2-3 links.

## Phase 2 build order (after approval)

1. Design directions + design system, Cloud + Stripe enabled
2. Home, pricing + calculator, booking flow with payments
3. Service pages, area pages, reviews, FAQ, contact
4. Instructor admin, notifications, chatbot
5. SEO, schema, performance pass, content migration

I'll check in at each milestone rather than building silently.
