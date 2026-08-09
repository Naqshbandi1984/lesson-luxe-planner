import { createFileRoute } from "@tanstack/react-router";
import { FaqJsonLd } from "@/components/site/JsonLd";
import { faqs } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Driving Lesson FAQ | learnerdriver.academy" },
      {
        name: "description",
        content:
          "Answers on automatic lessons, prices, paying upfront, the 24-hour cancellation rule, test day fees and booking windows in Reading.",
      },
      { property: "og:title", content: "Automatic driving lesson FAQ" },
      {
        property: "og:description",
        content: "Prices, payment, cancellations, test day and booking questions answered.",
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Frequently asked questions</h1>
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group p-6">
            <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:hidden">
              {f.q}
            </summary>
            <p className="mt-3 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
