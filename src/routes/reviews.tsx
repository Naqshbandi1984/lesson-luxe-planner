import { createFileRoute, Link } from "@tanstack/react-router";
import { RatingBadge } from "@/components/site/RatingBadge";
import { TestimonialMarquee } from "@/components/site/TestimonialMarquee";
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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Reviews</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {site.rating} stars from {site.reviewCount} reviews across {site.yearsExperience} years
          of teaching in Reading — real students, in their own words.
        </p>
        <div className="mt-5 flex justify-center">
          <RatingBadge />
        </div>
      </div>

      <div className="mt-12">
        <TestimonialMarquee testimonials={testimonials} />
      </div>

      <div className="mt-14 rounded-2xl border border-border bg-sand p-8 text-center">
        <p className="font-display text-lg font-semibold">See it for yourself</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Every review above is genuine. Real test-day photos from the same students live in the
          full pass gallery.
        </p>
        <Link
          to="/pass-gallery"
          className="mt-4 inline-block text-sm font-bold uppercase tracking-wide text-primary hover:underline"
        >
          View the pass gallery →
        </Link>
      </div>

      <Link
        to="/book"
        className="mt-8 inline-block rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground"
      >
        Book a lesson
      </Link>
    </div>
  );
}
