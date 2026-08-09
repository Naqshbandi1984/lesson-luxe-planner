/**
 * Single source of truth for business facts, pricing, coverage and content.
 * Swap these for Supabase-backed data once the existing project is connected.
 */

export const site = {
  brand: "learnerdriver.academy",
  legalName: "learnerdriver.academy",
  tagline: "Automatic driving lessons in Reading",
  phone: "07825 031594",
  phoneHref: "tel:+447825031594",
  whatsappHref: "https://wa.me/447825031594",
  email: "enquiries@learnerdriver.academy",
  emailHref: "mailto:enquiries@learnerdriver.academy",
  domain: "learnerdriver.academy",
  url: "https://learnerdriver.academy",
  yearsExperience: 13,
  rating: 4.9,
  reviewCount: 119,
} as const;

export const pricing = {
  lesson: { label: "Single lesson", duration: "1 hour 30 minutes", price: 67.5 },
  package: { label: "10-hour package", duration: "Six and a bit lessons", price: 430 },
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
  cancellation:
    "24 hours' notice is required to cancel or change a booked lesson or test.",
} as const;

/** Opening hours. day = 0 (Sunday) … 6 (Saturday). */
export type OpeningDay = {
  day: number;
  label: string;
  open: string | null;
  close: string | null;
  lastBooking: string | null;
};

export const openingHours: OpeningDay[] = [
  { day: 1, label: "Monday", open: "11:30", close: "19:00", lastBooking: "17:30" },
  { day: 2, label: "Tuesday", open: "11:30", close: "19:00", lastBooking: "17:30" },
  { day: 3, label: "Wednesday", open: "11:30", close: "19:00", lastBooking: "17:30" },
  { day: 4, label: "Thursday", open: "11:30", close: "19:00", lastBooking: "17:30" },
  { day: 5, label: "Friday", open: null, close: null, lastBooking: null },
  { day: 6, label: "Saturday", open: "13:00", close: "16:15", lastBooking: "14:45" },
  { day: 0, label: "Sunday", open: "13:00", close: "16:15", lastBooking: "14:45" },
];

/** Customers can book this many days ahead, rolling. */
export const BOOKING_WINDOW_DAYS = 7;
/** Lesson length in minutes. */
export const LESSON_MINUTES = 90;

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
      "Patient instructor with 13 years' experience",
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
    places: "Whitley, Shinfield, Three Mile Cross, Lower Earley border",
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
    name: "Burghfield and Mortimer",
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
  area: string;
  passedOn: string;
  quote: string;
  placeholder?: boolean;
};

/**
 * TBD — real testimonials to be supplied by the instructor.
 * These are clearly marked placeholders and must be replaced before launch.
 */
export const testimonials: Testimonial[] = [
  {
    name: "TBD",
    area: "TBD",
    passedOn: "TBD",
    quote: "Placeholder review — real customer wording to be supplied.",
    placeholder: true,
  },
  {
    name: "TBD",
    area: "TBD",
    passedOn: "TBD",
    quote: "Placeholder review — real customer wording to be supplied.",
    placeholder: true,
  },
  {
    name: "TBD",
    area: "TBD",
    passedOn: "TBD",
    quote: "Placeholder review — real customer wording to be supplied.",
    placeholder: true,
  },
];

export const faqs = [
  {
    q: "Are all lessons automatic?",
    a: "Yes. This is an automatic-only driving school, so every lesson and every test is taken in an automatic car. If you pass in an automatic, your licence allows you to drive automatic vehicles.",
  },
  {
    q: "How long is a lesson and what does it cost?",
    a: `Every lesson is 1 hour 30 minutes at ${gbp(pricing.lesson.price)}. A 10-hour package is ${gbp(pricing.package.price)}, which works out cheaper per hour.`,
  },
  {
    q: "When do I pay?",
    a: `${policies.payment} You can pay for a single lesson or buy a 10-hour package and draw lessons from it.`,
  },
  {
    q: "What happens if I need to cancel?",
    a: policies.cancellation + " Inside 24 hours the lesson is charged in full, because the slot can rarely be refilled at short notice.",
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
