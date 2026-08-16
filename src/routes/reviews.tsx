import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { TestimonialMarquee } from "@/components/site/TestimonialMarquee";
import { site, testimonials } from "@/lib/site";
import { reviewPhotos } from "@/lib/pass-photos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — 4.9 Stars from 119 Learners | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Automatic driving lessons in Reading rated 4.9 stars across 119 reviews. Read what learners say.",
      },
      { property: "og:title", content: "4.9 stars from 119 reviews" },
      {
        property: "og:description",
        content: "What learners in Reading say about their automatic driving lessons.",
      },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
            Learner Feedback
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
            Real reviews.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
            {site.rating} stars from {site.reviewCount} reviews across {site.yearsExperience} years
            of teaching in Reading — real students, in their own words.
          </p>
          <div className="mt-6 flex justify-center items-center gap-2 text-sm font-bold">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-hp-accent text-hp-accent" />
              ))}
            </span>
            <span>{site.rating} rating from our learners</span>
          </div>
        </div>
      </section>

      {/* Section 2: Testimonials Marquee & Grid */}
      <section className="bg-hp-paper text-hp-paper-foreground overflow-hidden">
        <div className="py-20">
          <TestimonialMarquee testimonials={testimonials} />
          
          <div className="mx-auto max-w-[1400px] px-5 mt-16 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="border border-hp-paper-foreground/15 bg-hp-paper-foreground/[0.02] p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-hp-accent text-hp-accent" />
                      ))}
                    </div>
                    <p className="mt-6 text-base text-hp-paper-foreground/80 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                  <p className="mt-6 font-bold text-sm uppercase tracking-wide text-hp-ink">
                    — {t.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pass Gallery Evidence */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                Visual Proof
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
                See the evidence
              </h2>
              <p className="mt-3 max-w-xl text-lg text-hp-ink-foreground/65">
                Every review represents a real student who passed their test. Real test-day photos
                showcase actual success on local Reading test routes.
              </p>
            </div>
            <Link
              to="/pass-gallery"
              className="text-sm font-extrabold uppercase tracking-wide text-hp-accent hover:underline shrink-0"
            >
              View full pass gallery →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {reviewPhotos.slice(0, 4).map((photo) => (
              <div
                key={photo.src}
                className={cn(
                  "group overflow-hidden bg-hp-ink-foreground/5",
                  photo.crop?.wrapperClass ?? "aspect-square",
                )}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                    photo.crop?.imgClass,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Ready to start learning?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Book your automatic driving lessons online and choose times that fit your schedule.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/book"
                className="inline-flex items-center bg-hp-ink px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-ink-foreground transition-transform hover:-translate-y-0.5"
              >
                Book a lesson
              </Link>
              <a
                href={site.phoneHref}
                className="text-lg font-extrabold underline underline-offset-4 hover:opacity-90"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
