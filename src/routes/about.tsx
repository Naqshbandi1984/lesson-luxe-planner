import { createFileRoute, Link } from "@tanstack/react-router";
import { RatingBadge } from "@/components/site/RatingBadge";
import { site } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Your Instructor | learnerdriver.academy" },
      {
        name: "description",
        content:
          "13 years teaching people to drive automatics in Reading. Patient, structured lessons and 4.9 stars from 119 reviews.",
      },
      { property: "og:title", content: "About your driving instructor in Reading" },
      {
        property: "og:description",
        content: "13 years' experience teaching automatic driving lessons across Reading.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">About</h1>
      <div className="mt-5">
        <RatingBadge />
      </div>
      <div className="mt-8 space-y-5 text-lg text-muted-foreground">
        <p>
          learnerdriver.academy is an automatic-only driving school in Reading, run by a single
          instructor with {site.yearsExperience} years of experience. That means the person you
          book with is the person who teaches you — every lesson, start to finish.
        </p>
        <p>
          Lessons are structured rather than improvised: you'll know what you're working on before
          you set off, and where you got to at the end. Plenty of learners come here after a bad
          experience elsewhere, and the approach is deliberately calm.
        </p>
        <p className="rounded-xl border border-border bg-sand p-5 text-base">
          <strong className="text-foreground">Instructor bio and photo — TBD.</strong> Full
          credentials, ADI details and photography to be supplied.
        </p>
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
