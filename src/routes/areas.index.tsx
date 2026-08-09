import { createFileRoute, Link } from "@tanstack/react-router";
import { areas } from "@/lib/site";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: "Areas Covered in Reading | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Automatic driving lessons with door-to-door pick up across RG1, RG2, RG4, RG5, RG6, RG7 and RG30 in Reading.",
      },
      { property: "og:title", content: "Driving lesson areas across Reading" },
      {
        property: "og:description",
        content: "Door-to-door automatic lessons across seven Reading postcodes.",
      },
    ],
  }),
  component: AreasIndex,
});

function AreasIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Areas covered</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Lessons run across seven Reading postcodes with door-to-door pick up, so you learn on the
        roads you'll actually drive on.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <Link
            key={a.slug}
            to="/areas/$slug"
            params={{ slug: a.slug }}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lift"
          >
            <p className="font-display text-2xl font-bold text-primary">{a.postcode}</p>
            <h2 className="mt-1 font-display text-lg font-semibold">{a.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{a.places}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
