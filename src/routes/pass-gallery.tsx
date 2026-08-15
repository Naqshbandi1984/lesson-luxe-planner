import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/lib/site";
import { recentPasses } from "@/lib/pass-photos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pass-gallery")({
  head: () => ({
    meta: [
      { title: `Pass Gallery — Real Test-Day Photos | ${site.brand}` },
      {
        name: "description",
        content: `Real students on their driving test day with ${site.instructorName} — the actual pass-day photos, not stock imagery.`,
      },
      { property: "og:title", content: "Pass gallery" },
      {
        property: "og:description",
        content: "Real test-day photos from learners who passed with learnerdriver.academy.",
      },
    ],
  }),
  component: PassGallery,
});

function PassGallery() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Pass gallery</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Real students, real test-day certificates, car and all — no stock photography. Every
        picture here is a genuine pass with {site.instructorName}.
      </p>

      <div className="mt-10 columns-2 gap-4 sm:columns-3 md:columns-4">
        {recentPasses.map((photo) => (
          <div
            key={photo.src}
            className={cn(
              "mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border shadow-card",
              photo.crop?.wrapperClass,
            )}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className={cn(
                "w-full object-cover",
                photo.crop ? cn("h-full", photo.crop.imgClass) : undefined,
              )}
            />
          </div>
        ))}
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
