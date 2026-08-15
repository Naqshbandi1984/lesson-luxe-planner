import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/site";

function Stars() {
  return (
    <div className="flex" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, s) => (
        <Star key={s} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[320px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-card sm:w-[380px]">
      <Stars />
      <blockquote className="mt-4 line-clamp-6 font-display text-base leading-snug">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">
        {t.name}
        {t.area ? ` · ${t.area}` : ""}
        {t.passedOn ? ` · passed ${t.passedOn}` : ""}
      </figcaption>
    </figure>
  );
}

/**
 * Auto-scrolling row of real reviews. The track is the review list rendered
 * twice, translated exactly -50% on a loop, so it scrolls seamlessly forever.
 * Pauses on hover/focus so a review can actually be read. Reduced-motion
 * users get a plain wrapped grid instead (motion-reduce:/motion-safe:), so
 * every review stays reachable either way.
 */
export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <>
      <div className="motion-safe:relative motion-safe:overflow-hidden motion-safe:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:hidden">
        <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
          <div className="flex shrink-0 gap-5" aria-hidden="true">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden motion-reduce:grid motion-reduce:gap-5 motion-reduce:sm:grid-cols-2 motion-reduce:lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </>
  );
}
