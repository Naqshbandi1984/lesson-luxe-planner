import { createFileRoute, Link } from "@tanstack/react-router";
import { RatingBadge } from "@/components/site/RatingBadge";
import { site } from "@/lib/site";
import { aboutPhotos } from "@/lib/pass-photos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${site.instructorName} | learnerdriver.academy` },
      {
        name: "description",
        content: `${site.instructorName} has spent 13 years teaching people to drive automatics in Reading. Patient, structured lessons and 4.9 stars from 119 reviews.`,
      },
      {
        property: "og:title",
        content: `Meet ${site.instructorName}, your driving instructor in Reading`,
      },
      {
        property: "og:description",
        content: `${site.instructorName} has 13 years' experience teaching automatic driving lessons across Reading.`,
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">About {site.instructorName}</h1>
      <div className="mt-5">
        <RatingBadge />
      </div>
      <div className="mt-8 max-w-3xl space-y-5 text-lg text-muted-foreground">
        <p>
          Learn with {site.instructorName} — learnerdriver.academy is an automatic-only driving
          school in Reading, and {site.instructorName} has {site.yearsExperience} years of
          experience teaching it. That means the person you book with is the person who teaches you
          — every lesson, start to finish.
        </p>
        <p>
          Lessons are structured rather than improvised: you'll know what you're working on before
          you set off, and where you got to at the end. Plenty of learners come here after a bad
          experience elsewhere, and {site.instructorName}'s approach is deliberately calm.
        </p>
        <p className="rounded-xl border border-border bg-sand p-5 text-base">
          <strong className="text-foreground">
            {site.instructorName}'s photo and full credentials — TBD.
          </strong>{" "}
          ADI details and photography to be supplied.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold">Recent passes</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          No polished headshot yet — but here's the actual evidence: real students on their test
          day, car and all.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {aboutPhotos.slice(0, 3).map((photo) => (
            <div
              key={photo.src}
              className={cn(
                "overflow-hidden rounded-xl border border-border shadow-card",
                photo.crop?.wrapperClass ?? "aspect-square",
              )}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={cn(
                  "h-full w-full object-cover",
                  photo.crop?.imgClass,
                )}
              />
            </div>
          ))}
        </div>
        <Link
          to="/pass-gallery"
          className="mt-4 inline-block text-sm font-bold uppercase tracking-wide text-primary hover:underline"
        >
          View the full pass gallery →
        </Link>
      </div>

      <Link
        to="/book"
        className="mt-10 inline-block rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground"
      >
        Book a lesson
      </Link>
    </div>
  );
}
