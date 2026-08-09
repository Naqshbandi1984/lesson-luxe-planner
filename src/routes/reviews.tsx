import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { RatingBadge } from "@/components/site/RatingBadge";
import { site, testimonials } from "@/lib/site";

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
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Reviews</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        {site.rating} stars from {site.reviewCount} reviews across {site.yearsExperience} years of
        teaching in Reading.
      </p>
      <div className="mt-5">
        <RatingBadge />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="mt-4 font-display text-lg leading-snug">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              {t.name} · {t.area} · passed {t.passedOn}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-border bg-sand p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Testimonials — TBD.</strong> Real learner reviews are
        being collected and will replace these placeholders before launch. The 4.9 rating and 119
        review count are genuine figures.
      </p>

      <Link
        to="/book"
        className="mt-8 inline-block rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground"
      >
        Book a lesson
      </Link>
    </div>
  );
}
