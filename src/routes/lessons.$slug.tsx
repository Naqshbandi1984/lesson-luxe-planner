import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { gbp, lessonTypes, pricing } from "@/lib/site";

export const Route = createFileRoute("/lessons/$slug")({
  loader: ({ params }) => {
    const lesson = lessonTypes.find((l) => l.slug === params.slug);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Lesson not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.lesson.name} in Reading | learnerdriver.academy`;
    const description = loaderData.lesson.blurb.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LessonPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Lesson type not found</h1>
      <Link to="/pricing" className="mt-4 inline-block text-primary hover:underline">
        See all lessons and pricing →
      </Link>
    </div>
  ),
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const others = lessonTypes.filter((l) => l.slug !== lesson.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{lesson.name}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{lesson.blurb}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <ul className="space-y-3">
          {lesson.bullets.map((b: string) => (
            <li key={b} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <aside className="rounded-2xl border border-border bg-sand p-6">
          <h2 className="font-display text-lg font-semibold">Cost</h2>
          <p className="mt-3 font-display text-3xl font-bold">{gbp(pricing.lesson.price)}</p>
          <p className="text-sm text-muted-foreground">per {pricing.lesson.duration} lesson</p>
          <p className="mt-4 font-display text-2xl font-bold">{gbp(pricing.package.price)}</p>
          <p className="text-sm text-muted-foreground">{pricing.package.label}</p>
          <Link
            to="/book"
            className="mt-6 block rounded-lg bg-accent px-5 py-3 text-center font-semibold text-accent-foreground"
          >
            Book a lesson
          </Link>
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Other lesson types</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((l) => (
            <Link
              key={l.slug}
              to="/lessons/$slug"
              params={{ slug: l.slug }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-card"
            >
              <h3 className="font-display font-semibold">{l.short}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{l.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
