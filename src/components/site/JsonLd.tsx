import { areas, openingHours, pricing, site } from "@/lib/site";

/** LocalBusiness structured data for local search. */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    // NOT "DrivingSchool" — despite the obvious-looking name, no such type
    // exists (schema.org/DrivingSchool is a 404). Google couldn't resolve it
    // to a type that's allowed to carry aggregateRating, which is what
    // Search Console reported as "Invalid object type for field
    // '<parent_node>'". LocalBusiness is on Google's list of valid parents.
    "@type": ["LocalBusiness", "EducationalOrganization"],
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
    // Must be Place/AdministrativeArea/GeoShape/Text — those are the only
    // types schema.org allows here. PostalCodeRangeSpecification is not one
    // of them (it belongs to DefinedRegion.postalCodeRange), and Google
    // rejected it outright with "Invalid object type for field".
    areaServed: areas.map((a) => ({
      "@type": "Place",
      name: a.name,
      address: {
        "@type": "PostalAddress",
        postalCode: a.postcode,
        addressLocality: "Reading",
        addressRegion: "Berkshire",
        addressCountry: "GB",
      },
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
