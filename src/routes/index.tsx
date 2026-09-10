import { createFileRoute } from "@tanstack/react-router";
import { LocalBusinessJsonLd } from "@/components/site/JsonLd";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { StatBand } from "@/components/home/StatBand";
import { PricingSplit } from "@/components/home/PricingSplit";
import { LessonList } from "@/components/home/LessonList";
import { AreaStrip } from "@/components/home/AreaStrip";
import { RecentPasses } from "@/components/home/RecentPasses";
import { WhyAutomatic } from "@/components/home/WhyAutomatic";
import { FinalCta } from "@/components/home/FinalCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Automatic Driving Lessons Reading | ${site.brand}` },
      {
        name: "description",
        content: `Automatic driving lessons across Reading, RG1–RG30, from £67.50 (10hrs from £430) — ${site.yearsExperienceLabel} of experience, ${site.rating} stars from ${site.reviewCountLabel}.`,
      },
      { property: "og:title", content: "Automatic Driving Lessons in Reading" },
      {
        property: "og:description",
        content:
          "Patient, automatic-only driving instruction across Reading. Book a 1hr30 lesson online.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <StatBand />
      <PricingSplit />
      <LessonList />
      <AreaStrip />
      <RecentPasses />
      <WhyAutomatic />
      <FinalCta />
    </>
  );
}
