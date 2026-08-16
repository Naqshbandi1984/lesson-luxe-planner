import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Info, Landmark, Loader2 } from "lucide-react";
import { formatLongDate } from "@/lib/booking";
import { getCheckedBookableDays } from "@/lib/availabilityServer";
import {
  bankTransfer,
  BOOKING_WINDOW_DAYS,
  gbp,
  lessonTypes,
  policies,
  pricing,
  site,
} from "@/lib/site";
import { createCheckoutSession } from "@/lib/checkout";
import { supabase } from "@/lib/supabase";
import { normalizePhone } from "@/lib/phone";

type BookSearch = {
  cancelled?: true;
  /** Chatbot handoff params — see /book?lessonType=...&date=YYYY-MM-DD&time=HH:MM */
  lessonType?: string;
  date?: string;
  time?: string;
};

export const Route = createFileRoute("/book/")({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    const result: BookSearch = {};
    if (search["cancelled"] === "1") result.cancelled = true;
    if (typeof search["lessonType"] === "string") result.lessonType = search["lessonType"];
    if (typeof search["date"] === "string") result.date = search["date"];
    if (typeof search["time"] === "string") result.time = search["time"];
    return result;
  },
  head: () => ({
    meta: [
      { title: "Book an Automatic Driving Lesson in Reading | learnerdriver.academy" },
      {
        name: "description",
        content: `Choose a lesson type, pick a 1hr30 slot in the next ${BOOKING_WINDOW_DAYS} days and review your booking. Automatic lessons across Reading.`,
      },
      { property: "og:title", content: "Book an automatic driving lesson in Reading" },
      {
        property: "og:description",
        content: `Pick a 1hr30 slot in the next ${BOOKING_WINDOW_DAYS} days and reserve your lesson.`,
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

type Product = { id: string; name: string; detail: string; price: number };

const products: Product[] = [
  {
    id: "lesson",
    name: pricing.lesson.label,
    detail: `${pricing.lesson.duration} of automatic tuition`,
    price: pricing.lesson.price,
  },
  {
    id: "package",
    name: pricing.package.label,
    detail: "10 hours to draw down, first lesson booked now",
    price: pricing.package.price,
  },
  ...pricing.testDay.map((t) => ({
    id: `test-${t.centre.toLowerCase()}`,
    name: `Test day — ${t.centre}`,
    detail: "Car hire for your practical test plus warm-up drive",
    price: t.price,
  })),
];

function buildNotes(postcode: string, notes: string): string | undefined {
  const parts = [];
  if (postcode.trim()) parts.push(`Pickup postcode: ${postcode.trim()}`);
  if (notes.trim()) parts.push(notes.trim());
  return parts.length > 0 ? parts.join(" — ") : undefined;
}

function BookPage() {
  const { cancelled, lessonType, date: prefillDate, time: prefillTime } = Route.useSearch();
  const {
    data: days,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["bookable-days"],
    queryFn: () => getCheckedBookableDays(),
  });
  const [productId, setProductId] = useState(products[0]!.id);
  const [lessonFocus, setLessonFocus] = useState(lessonTypes[0]!.slug);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");

  const [phase, setPhase] = useState<"form" | "payment" | "bank-transfer-confirmation">("form");
  const [formError, setFormError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);
  const [bankTransferError, setBankTransferError] = useState<string | null>(null);
  const [creatingBankTransfer, setCreatingBankTransfer] = useState(false);
  const [bankTransferReference, setBankTransferReference] = useState<string | null>(null);

  const product = products.find((p) => p.id === productId)!;

  useEffect(() => {
    if (!days) return;
    if (lessonType && lessonTypes.some((l) => l.slug === lessonType)) {
      setLessonFocus(lessonType);
    }
    if (prefillDate && prefillTime) {
      const dayIdx = days.findIndex((d) => d.date === prefillDate);
      const matchDay = dayIdx === -1 ? undefined : days[dayIdx];
      const matchSlot = matchDay?.slots.find((s) => s.start === prefillTime && s.available);
      if (matchDay && matchSlot) {
        setDayIndex(dayIdx);
        setSlot(`${prefillDate}T${prefillTime}`);
      }
    }
  }, [days, lessonType, prefillDate, prefillTime]);

  // ── Loading / error states ──────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Online Booking</p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
              Book a lesson
            </h1>
            <p className="mt-6 text-lg text-hp-ink-foreground/70">Loading availability…</p>
          </div>
        </section>
      </div>
    );
  }

  if (isError || !days || days.length === 0) {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Online Booking</p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
              Book a lesson
            </h1>
            <p className="mt-6 max-w-xl text-lg text-hp-ink-foreground/75">
              Availability didn't load. Call{" "}
              <a href={site.phoneHref} className="font-bold text-hp-accent hover:underline">
                {site.phone}
              </a>{" "}
              or message on WhatsApp and we'll sort out a time directly.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ── Bank transfer confirmation screen ───────────────────────────────────────
  if (phase === "bank-transfer-confirmation" && bankTransferReference) {
    return (
      <div className="w-full">
        <section className="bg-hp-ink text-hp-ink-foreground">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-hp-accent/20">
              <Landmark className="h-7 w-7 text-hp-accent" aria-hidden="true" />
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl font-black leading-[0.98] tracking-tight">
              Almost there — pay by bank transfer
            </h1>
            <p className="mt-4 text-lg text-hp-ink-foreground/75 max-w-xl mx-auto">
              Transfer the amount below using the reference shown, and we'll confirm your booking once it lands.
            </p>
          </div>
        </section>
        <section className="bg-hp-paper text-hp-paper-foreground">
          <div className="mx-auto max-w-xl px-5 py-16 sm:px-8">
            <div className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 space-y-4">
              <Row term="Account name" desc={bankTransfer.accountName} />
              <Row term="Sort code" desc={bankTransfer.sortCode} />
              <Row term="Account number" desc={bankTransfer.accountNumber} />
              <Row term="Amount" desc={gbp(product.price)} />
              <div className="border-t border-hp-paper-foreground/10 pt-4">
                <p className="text-sm font-bold uppercase tracking-wide text-hp-paper-foreground/60">
                  Payment reference — use this exactly
                </p>
                <p className="mt-1 break-all font-display text-xl font-black text-hp-ink">
                  {bankTransferReference}
                </p>
              </div>
            </div>
            <p className="mt-6 border-l-4 border-destructive bg-destructive/5 p-4 text-sm font-medium text-destructive">
              This slot isn't guaranteed yet — it stays open to other customers until we've received and confirmed your transfer. Please pay as soon as you can.
            </p>
            <Link
              to="/"
              className="mt-8 inline-block bg-hp-accent px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Back to home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const effectiveDayIndex =
    dayIndex ??
    Math.max(
      days.findIndex((d) => !d.closed),
      0,
    );
  const day = days[Math.min(effectiveDayIndex, days.length - 1)]!;
  const selectedSlot = slot ? day.slots.find((s) => `${s.date}T${s.start}` === slot) : undefined;

  function handleCompleteBooking() {
    if (!slot) {
      setFormError("Pick a slot before continuing.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setFormError("Your name and mobile number are needed to hold the booking.");
      return;
    }
    setFormError(null);
    setPhase("payment");
  }

  async function handlePayByCard() {
    if (!slot || !selectedSlot) return;
    setCreatingSession(true);
    setCheckoutError(null);
    try {
      const { url } = await createCheckoutSession({
        data: {
          phone: normalizePhone(phone),
          name: name.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
          lessonTypeSlug: lessonFocus,
          date: selectedSlot.date,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          ...((): { notes?: string } => {
            const n = buildNotes(postcode, notes);
            return n ? { notes: n } : {};
          })(),
          price: product.price,
          productName: product.name,
          origin: window.location.origin,
        },
      });
      window.location.href = url;
    } catch {
      setCheckoutError("Something went wrong starting checkout. Please try again or call us.");
      setCreatingSession(false);
    }
  }

  async function handlePayByBankTransfer() {
    if (!slot || !selectedSlot) return;
    setCreatingBankTransfer(true);
    setBankTransferError(null);
    const notesValue = buildNotes(postcode, notes);
    try {
      const { data, error } = await supabase.rpc("create_bank_transfer_booking", {
        p_phone: normalizePhone(phone),
        p_name: name.trim(),
        p_lesson_type_slug: lessonFocus,
        p_date: selectedSlot.date,
        p_start_time: selectedSlot.start,
        p_end_time: selectedSlot.end,
        p_price: product.price,
        ...(notesValue ? { p_notes: notesValue } : {}),
        ...(email.trim() ? { p_email: email.trim() } : {}),
      });
      if (error) throw error;
      setBankTransferReference(data);
      setPhase("bank-transfer-confirmation");
    } catch (err) {
      setBankTransferError(
        err instanceof Error ? err.message : "Something went wrong. Please try again or call us.",
      );
    } finally {
      setCreatingBankTransfer(false);
    }
  }

  return (
    <div className="w-full">
      {/* Hero header */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">Online Booking</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-black leading-[0.98] tracking-tight">
            Book a lesson
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-hp-ink-foreground/75">
            Bookings open on a rolling {BOOKING_WINDOW_DAYS}-day window. Pick what you need, choose a slot, then confirm.
          </p>
          {cancelled && (
            <p className="mt-6 max-w-2xl border-l-4 border-hp-accent bg-hp-ink-foreground/5 px-4 py-3 text-sm text-hp-ink-foreground/75">
              Checkout was cancelled — nothing was charged and your slot wasn't held. Pick up where you left off whenever you're ready.
            </p>
          )}
        </div>
      </section>

      {/* Main booking form */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
            {/* Left: form steps */}
            <div
              aria-hidden={phase === "payment"}
              className={phase === "payment" ? "pointer-events-none opacity-40" : undefined}
            >
              <div className="space-y-8">
                {/* Step 1: What do you need */}
                <section className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8">
                  <h2 className="font-display text-xl font-bold text-hp-ink">1. What do you need?</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {products.map((p) => {
                      const selected = p.id === productId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProductId(p.id)}
                          aria-pressed={selected}
                          className={`border p-4 text-left transition-all ${
                            selected
                              ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                              : "border-hp-paper-foreground/20 hover:border-hp-accent"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold">{p.name}</span>
                            <span className="font-display font-black text-hp-accent">{gbp(p.price)}</span>
                          </div>
                          <p className={`mt-1 text-sm ${selected ? "text-hp-ink-foreground/70" : "text-hp-paper-foreground/60"}`}>
                            {p.detail}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-bold uppercase tracking-wide text-hp-paper-foreground/60">
                      What are you working on?
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lessonTypes.map((l) => (
                        <button
                          key={l.slug}
                          type="button"
                          onClick={() => setLessonFocus(l.slug)}
                          className={`border px-4 py-2 text-sm font-bold transition-all ${
                            lessonFocus === l.slug
                              ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                              : "border-hp-paper-foreground/20 hover:border-hp-accent"
                          }`}
                        >
                          {l.short}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </section>

                {/* Step 2: Pick a slot */}
                <section className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8">
                  <h2 className="font-display text-xl font-bold text-hp-ink">2. Pick a slot</h2>
                  <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {days.map((d, i) => {
                      const selected = i === effectiveDayIndex;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          disabled={d.closed}
                          onClick={() => {
                            setDayIndex(i);
                            setSlot(null);
                          }}
                          className={`border px-2 py-3 text-center text-sm font-bold transition-all ${
                            selected
                              ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                              : "border-hp-paper-foreground/20 hover:border-hp-accent"
                          } ${d.closed ? "cursor-not-allowed opacity-40" : ""}`}
                        >
                          <span className="block text-xs uppercase">{d.weekday}</span>
                          <span className="block font-display text-lg font-black">{d.dayNumber}</span>
                          <span className="block text-xs">{d.closed ? "Closed" : d.month}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    {day.closed ? (
                      <p className="text-hp-paper-foreground/70">
                        Closed on {formatLongDate(day.date)} — Fridays are a non-teaching day.
                      </p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-3">
                        {day.slots.map((s) => {
                          const id = `${s.date}T${s.start}`;
                          const selected = slot === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              disabled={!s.available}
                              onClick={() => setSlot(id)}
                              className={`border px-3 py-3 text-sm font-bold transition-all ${
                                selected
                                  ? "border-hp-ink bg-hp-ink text-hp-ink-foreground"
                                  : "border-hp-paper-foreground/20 hover:border-hp-accent"
                              } ${!s.available ? "cursor-not-allowed opacity-40 line-through" : ""}`}
                            >
                              {s.start}–{s.end}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>

                {/* Step 3: Your details */}
                <section className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8">
                  <h2 className="font-display text-xl font-bold text-hp-ink">3. Your details</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" id="name" autoComplete="name" value={name} onChange={setName} />
                    <Field label="Mobile number" id="tel" type="tel" autoComplete="tel" value={phone} onChange={setPhone} />
                    <Field label="Email" id="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
                    <Field label="Pick-up postcode" id="postcode" autoComplete="postal-code" value={postcode} onChange={setPostcode} />
                  </div>
                  <label htmlFor="notes" className="mt-4 block text-sm font-bold text-hp-paper-foreground/70">
                    Anything I should know?
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5 w-full border border-hp-paper-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-hp-accent focus:ring-1 focus:ring-hp-accent"
                    placeholder="Previous experience, test date already booked, access notes…"
                  />
                </section>
              </div>
            </div>

            {/* Right: Booking summary aside */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8">
                <h2 className="font-display text-xl font-bold text-hp-ink">Your booking</h2>
                <dl className="mt-5 space-y-3 text-sm border-b border-hp-paper-foreground/10 pb-5">
                  <Row term="Booking" desc={product.name} />
                  <Row
                    term="Focus"
                    desc={lessonTypes.find((l) => l.slug === lessonFocus)?.short ?? "—"}
                  />
                  <Row
                    term="Date"
                    desc={slot ? formatLongDate(slot.slice(0, 10)) : "No slot selected yet"}
                  />
                  <Row term="Time" desc={slot ? `${slot.slice(11)} for 1hr 30` : "—"} />
                </dl>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="font-bold text-hp-paper-foreground/70">Total due</span>
                  <span className="font-display text-3xl font-black text-hp-ink">{gbp(product.price)}</span>
                </div>

                {phase === "form" ? (
                  <>
                    <button
                      type="button"
                      disabled={!slot}
                      onClick={handleCompleteBooking}
                      className="mt-6 w-full bg-hp-accent py-4 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Complete booking
                    </button>
                    {formError && <p className="mt-2 text-sm text-destructive">{formError}</p>}
                    <p className="mt-4 flex gap-2 bg-hp-paper-foreground/5 p-3 text-xs text-hp-paper-foreground/60">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      Nothing is charged or held yet — the next step is choosing how to pay.
                    </p>
                  </>
                ) : (
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={handlePayByCard}
                      disabled={creatingSession}
                      className="flex w-full items-center justify-center gap-2 bg-hp-accent py-4 text-sm font-extrabold uppercase tracking-wide text-hp-accent-foreground disabled:cursor-not-allowed disabled:opacity-70 transition-transform hover:-translate-y-0.5"
                    >
                      {creatingSession ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Starting checkout…
                        </>
                      ) : (
                        "Pay by card (Stripe) — recommended"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePayByBankTransfer}
                      disabled={creatingBankTransfer}
                      className="flex w-full items-center justify-center gap-2 border-2 border-hp-paper-foreground/20 bg-transparent py-4 text-sm font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-70 hover:border-hp-accent"
                    >
                      {creatingBankTransfer ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Setting up your reference…
                        </>
                      ) : (
                        "Pay by bank transfer"
                      )}
                    </button>
                    <p className="text-xs text-hp-paper-foreground/60">
                      Bank transfer isn't instant — your slot stays open to other customers until we confirm your payment's landed.
                    </p>

                    {checkoutError && <p className="text-sm text-destructive">{checkoutError}</p>}
                    {bankTransferError && <p className="text-sm text-destructive">{bankTransferError}</p>}

                    <button
                      type="button"
                      onClick={() => setPhase("form")}
                      disabled={creatingSession}
                      className="w-full text-center text-sm font-bold text-hp-ink hover:underline disabled:opacity-50"
                    >
                      ← Back to booking details
                    </button>
                  </div>
                )}

                <ul className="mt-6 space-y-2 text-xs text-hp-paper-foreground/60">
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-hp-accent" aria-hidden="true" />
                    {policies.payment}
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-hp-accent" aria-hidden="true" />
                    {policies.cancellation}
                  </li>
                </ul>

                <p className="mt-5 text-xs text-hp-paper-foreground/60">
                  Prefer to talk first?{" "}
                  <a href={site.phoneHref} className="font-bold text-hp-ink hover:underline">
                    {site.phone}
                  </a>{" "}
                  or see the{" "}
                  <Link to="/faq" className="font-bold text-hp-ink hover:underline">
                    FAQ
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-hp-paper-foreground/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-hp-paper-foreground/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-hp-accent focus:ring-1 focus:ring-hp-accent"
      />
    </div>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-hp-paper-foreground/60">{term}</dt>
      <dd className="text-right font-bold text-hp-ink">{desc}</dd>
    </div>
  );
}
