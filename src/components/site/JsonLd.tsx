import { areas, openingHours, pricing, site } from "@/lib/site";

/** LocalBusiness / DrivingSchool structured data for local search. */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: site.brand,
    description: `Automatic driving lessons in Reading with ${site.yearsExperienceLabel} of instructing experience.`,
    url: site.url,
    telephone: "+447825031594",
    email: site.email,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Reading",
      addressRegion: "Berkshire",
      addressCountry: "GB",
    },
    areaServed: areas.map((a) => ({
      "@type": "PostalCodeRangeSpecification",
      postalCodeBegin: a.postcode,
      postalCodeEnd: a.postcode,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating,
      reviewCount: site.reviewCount,
      bestRating: 5,
    },
    makesOffer: [
      {
        "@type": "Offer",
        name: `${pricing.lesson.label} (${pricing.lesson.duration})`,
        price: pricing.lesson.price,
        priceCurrency: "GBP",
      },
      {
        "@type": "Offer",
        name: pricing.package.label,
        price: pricing.package.price,
        priceCurrency: "GBP",
      },
    ],
    // One spec per bookable slot, not per day — the real schedule has a
    // lunch gap and buffers between lessons, not one continuous block.
    openingHoursSpecification: openingHours.flatMap((h) =>
      h.slots.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${h.label}`,
        opens: s.start,
        closes: s.end,
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
