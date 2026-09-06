/**
 * Single source of truth for business facts, pricing, coverage and content.
 * Swap these for Supabase-backed data once the existing project is connected.
 */

export const site = {
  /** Display name shown throughout the site — deliberately distinct from
   * `domain`/`url`/`email` below, which stay as the literal
   * learnerdriver.academy domain regardless of how the business is branded. */
  brand: "Learner Driver Academy",
  legalName: "Learner Driver Academy",
  instructorName: "Ibrar",
  tagline: "Automatic driving lessons in Reading",
  phone: "07825 031594",
  phoneHref: "tel:+447825031594",
  whatsappHref: "https://wa.me/447825031594",
  email: "enquiries@learnerdriver.academy",
  emailHref: "mailto:enquiries@learnerdriver.academy",
  domain: "learnerdriver.academy",
  url: "https://learnerdriver.academy",
  /** Evergreen phrasing for on-page copy — see yearsExperience below for the
   * real number, kept accurate for structured data. */
  yearsExperienceLabel: "over a decade",
  yearsExperience: 13,
  rating: 4.9,
  /** Real figure — kept accurate here for structured data (see JsonLd.tsx's
   * aggregateRating.reviewCount, which schema.org requires to be a real
   * number). On-page copy uses reviewCountLabel instead, below, so it
   * doesn't need editing every time the real count changes. */
  reviewCount: 119,
  /** Evergreen phrasing for visible copy — stays true well past the real
   * count above, so it doesn't need another site-wide edit for a while. */
  reviewCountLabel: "over 100 5-star reviews",
} as const;

/**
 * price = standard/headline figure, charged for card payments. bankTransferPrice
 * = the discounted figure for bank transfer (no card-processing cost to pass
 * on). Framed everywhere as a bank-transfer discount, never a card
 * surcharge — UK surcharge regulations (Consumer Rights (Payment
 * Surcharges) Regulations 2012 / Payment Services Regulations 2017) ban
 * charging extra for card payments specifically, but discounting an
 * alternative method is fine.
 */
export const pricing = {
  lesson: {
    label: "Single lesson",
    duration: "1 hour 30 minutes",
    price: 68.7,
    bankTransferPrice: 67.5,
  },
  package: {
    label: "10-hour package",
    duration: "Six and a bit lessons",
    price: 436,
    bankTransferPrice: 430,
  },
  testDay: [
    { centre: "Reading", price: 100 },
    { centre: "Farnborough", price: 150 },
    { centre: "Greenham", price: 150 },
    { centre: "Basingstoke", price: 150 },
  ],
} as const;

export function gbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export const policies = {
  payment: "Full payment is required upfront to secure any booking.",
  cancellation: "24 hours' notice is required to cancel or change a booked lesson or test.",
} as const;

/** Shown to customers who choose to pay by bank transfer — not secret, safe to display. */
export const bankTransfer = {
  accountName: "Ibrar Akram",
  sortCode: "20-71-03",
  accountNumber: "80553123",
} as const;

/**
 * Opening hours. day = 0 (Sunday) … 6 (Saturday). Each day lists its exact
 * bookable slots explicitly — not a start/end/step-size range — because the
 * real schedule has a lunch gap and a 15-minute buffer between lessons, not
 * uniform back-to-back blocks. An empty `slots` array means closed.
 */
export type DaySlot = { start: string; end: string };

export type OpeningDay = {
  day: number;
  label: string;
  slots: DaySlot[];
};

const WEEKDAY_SLOTS: DaySlot[] = [
  { start: "11:30", end: "13:00" },
  { start: "13:15", end: "14:45" },
  { start: "16:00", end: "17:30" },
  { start: "17:45", end: "19:15" },
];

const WEEKEND_SLOTS: DaySlot[] = [
  { start: "13:00", end: "14:30" },
  { start: "14:45", end: "16:15" },
];

export const openingHours: OpeningDay[] = [
  { day: 1, label: "Monday", slots: WEEKDAY_SLOTS },
  { day: 2, label: "Tuesday", slots: WEEKDAY_SLOTS },
  { day: 3, label: "Wednesday", slots: WEEKDAY_SLOTS },
  { day: 4, label: "Thursday", slots: WEEKDAY_SLOTS },
  { day: 5, label: "Friday", slots: [] },
  { day: 6, label: "Saturday", slots: WEEKEND_SLOTS },
  { day: 0, label: "Sunday", slots: WEEKEND_SLOTS },
];

/** Compact "opens–closes" summary for a day, spanning its first slot's start to its last slot's end. */
export function dayHoursLabel(day: OpeningDay): string {
  if (day.slots.length === 0) return "Closed";
  return `${day.slots[0]!.start}–${day.slots[day.slots.length - 1]!.end}`;
}

/** Customers can book this many days ahead, rolling. */
export const BOOKING_WINDOW_DAYS = 21;

export type LessonType = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  bullets: string[];
};

export const lessonTypes: LessonType[] = [
  {
    slug: "automatic",
    name: "Automatic driving lessons",
    short: "Automatic lessons",
    blurb:
      "Standard 1 hour 30 minute lessons in a modern automatic, from absolute beginner to test-ready. No clutch, no stalling, no hill-start panic — you spend the whole lesson learning to read the road instead of fighting the gearbox.",
    bullets: [
      "Door-to-door pick up across Reading",
      "Structured plan so you always know what's next",
      "Progress reviewed at the end of every lesson",
      "Mock tests on real Reading test routes",
    ],
  },
  {
    slug: "intensive",
    name: "Intensive automatic courses",
    short: "Intensive courses",
    blurb:
      "Learning condensed into a short run of lessons over days or weeks rather than months. Suited to people with a deadline — a new job, a move, or a test date already booked.",
    bullets: [
      "Built from 10-hour packages to suit your dates",
      "Availability confirmed with you before you pay",
      "Test-day support at Reading and nearby centres",
      "Honest advice if an intensive isn't right for you",
    ],
  },
  {
    slug: "nervous-drivers",
    name: "Lessons for nervous drivers",
    short: "Nervous drivers",
    blurb:
      "Quiet roads, no shouting, no surprises. Plenty of people arrive after a bad experience elsewhere or a long gap since their last lesson. Automatic removes half the things there are to worry about.",
    bullets: [
      "Start on quiet residential roads at your pace",
      "Clear explanation before anything new is attempted",
      "Sessions can slow down or stop whenever you need",
      `Patient instructor with ${site.yearsExperienceLabel} of experience`,
    ],
  },
  {
    slug: "refresher",
    name: "Refresher and Pass Plus",
    short: "Refresher lessons",
    blurb:
      "Already hold a licence but haven't driven for a while, or converting from an overseas licence? A short block of refresher lessons rebuilds confidence on motorways, dual carriageways and busy town driving.",
    bullets: [
      "Confidence-building after a break from driving",
      "Motorway and dual carriageway sessions",
      "Overseas licence conversion practice",
      "Book as single lessons or a 10-hour block",
    ],
  },
];

export type Area = {
  slug: string;
  postcode: string;
  name: string;
  places: string;
  note: string;
};

export const areas: Area[] = [
  {
    slug: "rg1",
    postcode: "RG1",
    name: "Reading town centre",
    places: "Central Reading, Newtown, Katesgrove, Whitley Wood edge",
    note: "Dense one-way systems, bus lanes and busy pedestrian crossings — the part of Reading that catches most learners out, and the part you'll be tested on.",
  },
  {
    slug: "rg2",
    postcode: "RG2",
    name: "Whitley and Shinfield",
    places: "Whitley, Shinfield, Arborfield, Lower Earley border",
    note: "Close to the A33 corridor, so lessons here mix quiet estate roads with dual carriageway joins and roundabout practice.",
  },
  {
    slug: "rg4",
    postcode: "RG4",
    name: "Caversham and Emmer Green",
    places: "Caversham, Emmer Green, Caversham Heights, Sonning Common",
    note: "Hills, narrow lanes and the Caversham bridges. An automatic makes hill starts on these roads a non-event.",
  },
  {
    slug: "rg5",
    postcode: "RG5",
    name: "Woodley",
    places: "Woodley, Bulmershe, Sonning",
    note: "Wide residential roads that are ideal for early lessons, with quick access to busier routes when you're ready.",
  },
  {
    slug: "rg6",
    postcode: "RG6",
    name: "Earley and Lower Earley",
    places: "Earley, Lower Earley, Whiteknights, University area",
    note: "Popular with university students learning between terms. Lots of mini-roundabouts and parked-car navigation.",
  },
  {
    slug: "rg7",
    postcode: "RG7",
    name: "Three Mile Cross",
    places: "Burghfield Common, Mortimer, Theale edge, Beenham",
    note: "Country lanes and national speed limit roads — good for building confidence at higher speeds before test day.",
  },
  {
    slug: "rg30",
    postcode: "RG30",
    name: "Tilehurst and Southcote",
    places: "Tilehurst, Southcote, Calcot, Norcot",
    note: "Steep residential hills and busy junctions onto the Oxford Road. Regular ground for Reading test routes.",
  },
];

export type Testimonial = {
  name: string;
  quote: string;
  /** Not supplied with these reviews — area/pass-date are only shown when known, never fabricated. */
  area?: string;
  passedOn?: string;
};

/** Real 5-star reviews, quoted verbatim as supplied — typos and all, since editing a genuine review's wording would misrepresent it. */
export const testimonials: Testimonial[] = [
  {
    name: "Gabrielle Taylor",
    quote:
      "Best driving instructor i had one before him who was no good what so ever. Im so glad to have found ibrar he got me to smash my driving test first time with only 7 lessons. What a great guy! He pushes you and gets you where you need to be to pass. Definitely advice giving him a call if you need someone efficient.",
  },
  {
    name: "Anushka Gupta",
    quote:
      "I've had a positive and smooth experience learning how to drive with Ibrar. He stays calm during lessons and provides constructive feedback, making sure to recount where I did well and where I made mistakes. I'm happy to have passed first time thanks to his guidance. It was also easy to arrange lessons every week, and he was always available so I didn't have any periods where I dropped practice. Would recommend!",
  },
  {
    name: "Amelie Lily Wilson",
    quote:
      "I would highly recommend Ibrar. He's a great teacher and very knowledgeable. I'm an anxious driver and he made me feel comfortable and safe behind the wheel, and I passed first time.",
  },
  {
    name: "Odimgbe Linda",
    quote:
      "My husband referred me to Mr Ibrar after he successfully passed his test and based on that experience, I decided to book my lessons with him too. From day one, he was incredibly patient, calm, and professional. I started with absolutely no driving experience, and he built my confidence step by step. He never judged my mistakes; instead, he always encouraged me and explained things clearly until I understood. In a short period of time, I went from being a complete beginner to becoming a licensed driver on the first try.",
  },
  {
    name: "Aditi Dusi",
    quote:
      "I just passed my driving test today, all thanks to Ibrar. He's a really good instructor, very calm, patient, and reassuring. He explains things clearly and helped me feel confident on the road. I couldn't have done it without his support.",
  },
  {
    name: "Gabriella Sara",
    quote:
      "Passed my driving test today with no minors. Lessons were always clear and helpful, and he explained things in a way that actually made sense. Really easy to learn with and I'd definitely recommend him to anyone looking for an instructor.",
  },
  {
    name: "Alonso Yong",
    quote:
      "I passed the exam in the first attempt. All thanks to excellent lessons. A fantastic instructor. He has a lot of patience and also good understanding of the exam and also driving in real life. He also has good communication and accommodated to any issue I had to schedule the sessions.",
  },
  {
    name: "Noah",
    quote:
      "Passed first time with the help of Ibrar. He's a fantastic instructor and will prepare you well for the test. I have full confidence in recommending him to others.",
  },
  {
    name: "Chukwudozie Tochukwu",
    quote:
      "Thank you so much IBRAR, i wouldn't have achieved this without you. You literally changed my perspective to the way I see driving and boosted my confidence.",
  },
  {
    name: "Cherelle Nelson",
    quote:
      "Passed first time today!! Ibrar is the most calmest, honest driving instructor who becomes a friend from his happy and caring personality. Every lesson was efficient and he made sure I was learning new things every time and improving immensely in a short period of time. This journey has been made a pleasant and enjoyable experience due to Ibrar.",
  },
];

export const faqs = [
  {
    q: "Are all lessons automatic?",
    a: "Yes. This is an automatic-only driving school, so every lesson and every test is taken in an automatic car. If you pass in an automatic, your licence allows you to drive automatic vehicles.",
  },
  {
    q: "How long is a lesson and what does it cost?",
    a: `Every lesson is 1 hour 30 minutes at ${gbp(pricing.lesson.price)} (${gbp(pricing.lesson.bankTransferPrice)} if you pay by bank transfer). A 10-hour package is ${gbp(pricing.package.price)} (${gbp(pricing.package.bankTransferPrice)} by bank transfer), which works out cheaper per hour.`,
  },
  {
    q: "When do I pay?",
    a: `${policies.payment} You can pay for a single lesson or buy a 10-hour package and draw lessons from it.`,
  },
  {
    q: "What happens if I need to cancel?",
    a:
      policies.cancellation +
      " Inside 24 hours the lesson is charged in full, because the slot can rarely be refilled at short notice.",
  },
  {
    q: "How far ahead can I book?",
    a: `Bookings open on a rolling ${BOOKING_WINDOW_DAYS}-day window, so you can book any available slot in the next ${BOOKING_WINDOW_DAYS} days. New slots become bookable each day.`,
  },
  {
    q: "What is the test day fee for?",
    a: `Test day covers use of the car for your practical test plus a warm-up drive beforehand. It is ${gbp(100)} at Reading test centre and ${gbp(150)} at Farnborough, Greenham or Basingstoke.`,
  },
  {
    q: "Do I need to pass the theory test first?",
    a: "Yes — you need to pass the theory test before you can book a practical test, but you can start lessons straight away with a provisional licence.",
  },
  {
    q: "Which areas are covered?",
    a: `Lessons run across ${areas.map((a) => a.postcode).join(", ")} with door-to-door pick up.`,
  },
];

export const testCentres = pricing.testDay.map((t) => t.centre);
