import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RatingBadge } from "@/components/site/RatingBadge";
import { areas, gbp, pricing, site } from "@/lib/site";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = areas.find((a) => a.slug === params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Area not found" }, { name: "robots", content: "noindex" }] };
    }
    const { area } = loaderData;
    const title = `Automatic Driving Lessons in ${area.name} (${area.postcode}) | learnerdriver.academy`;
    const description = `Automatic driving lessons in ${area.name}, ${area.postcode}. ${area.places}. £67.50 per 1hr30 lesson, door-to-door pick up.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AreaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Area not found</h1>
      <Link to="/areas" className="mt-4 inline-block text-primary hover:underline">
        See all areas covered →
      </Link>
    </div>
  ),
});

function AreaPage() {
  const { area } = Route.useLoaderData();
  const others = areas.filter((a) => a.slug !== area.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
        {area.postcode}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
        Automatic driving lessons in {area.name}
      </h1>
      <div className="mt-5">
        <RatingBadge />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>{area.note}</p>
          <p>
            Pick up covers {area.places}. Lessons are {pricing.lesson.duration} long in a modern
            automatic, and you're collected from home, work or college — whichever suits that day.
          </p>
          <p>
            With {site.yearsExperience} years teaching in Reading, lessons around {area.name} are
            built around the junctions and routes that actually come up on test, not a generic
            syllabus.
          </p>
        </div>

        <aside className="rounded-2xl border border-border bg-sand p-6">
          <h2 className="font-display text-lg font-semibold">Lessons in {area.postcode}</h2>
          <p className="mt-3 font-display text-3xl font-bold">{gbp(pricing.lesson.price)}</p>
          <p className="text-sm text-muted-foreground">per 1hr30 lesson</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {pricing.package.label}: {gbp(pricing.package.price)}
          </p>
          <Link
            to="/book"
            className="mt-6 block rounded-lg bg-accent px-5 py-3 text-center font-semibold text-accent-foreground"
          >
            Book a lesson
          </Link>
          <a
            href={site.phoneHref}
            className="mt-3 block rounded-lg border border-input bg-card px-5 py-3 text-center font-semibold"
          >
            Call {site.phone}
          </a>
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Other areas covered</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((a) => (
            <li key={a.slug}>
              <Link
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="inline-block rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
              >
                {a.postcode} — {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
