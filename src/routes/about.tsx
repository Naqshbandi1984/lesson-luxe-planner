import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Check } from "lucide-react";
import { site } from "@/lib/site";
import { aboutPhotos } from "@/lib/pass-photos";
import { cn } from "@/lib/utils";
import carPhoto from "@/assets/hero-car-lessons-reading.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${site.instructorName} | learnerdriver.academy` },
      {
        name: "description",
        content: `${site.instructorName} has spent 13 years teaching people to drive automatics in Reading. Patient, structured lessons and ${site.rating} stars from ${site.reviewCountLabel}.`,
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
    <div className="w-full">
      {/* Section 1: Hero Section */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                Your Instructor
              </p>
              <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight">
                Meet Ibrar.
              </h1>
              
              <div className="mt-5 flex items-center gap-2 text-sm font-bold">
                <span className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-hp-accent text-hp-accent" />
                  ))}
                </span>
                <span>
                  {site.rating} from {site.reviewCountLabel}
                </span>
              </div>

              <p className="mt-8 text-lg font-medium text-hp-ink-foreground/75 sm:text-xl leading-relaxed">
                Learn with {site.instructorName} — learnerdriver.academy is an automatic-only driving
                school in Reading. Ibrar has {site.yearsExperience} years of experience teaching pupils
                how to master automatic vehicles safely and confidently.
              </p>
              <p className="mt-4 text-base text-hp-ink-foreground/60 leading-relaxed">
                That means the person you book with is the person who teaches you — every single lesson,
                start to finish. No third-party instructors, no franchise subcontracting. Just calm,
                focused instruction tailored to you.
              </p>

              <div className="mt-8 border-l-2 border-hp-accent bg-hp-ink-foreground/[0.04] p-5 text-sm">
                <p className="font-bold text-hp-ink-foreground">DVSA Qualifications & Vehicle Info</p>
                <p className="mt-1.5 text-hp-ink-foreground/70">
                  Ibrar is a fully qualified DVSA Approved Driving Instructor (ADI). All lessons are conducted
                  in a modern, dual-controlled automatic vehicle, providing complete safety and reassurance for
                  beginners and nervous drivers alike.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-hp-ink-foreground/5">
                <img
                  src={carPhoto}
                  alt="Ibrar's dual-controlled automatic tuition car on a street in Reading"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Teaching Philosophy */}
      <section className="bg-hp-paper text-hp-paper-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                Our Philosophy
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold leading-none tracking-tight">
                Structured lessons.
                <br />
                Calmer driving.
              </h2>
              <p className="mt-6 text-lg text-hp-paper-foreground/75 leading-relaxed">
                Plenty of learners come here after a stressful experience elsewhere. Our approach is quiet,
                clear, and structured around your progress.
              </p>
            </div>

            <div>
              <ul className="space-y-8">
                {[
                  {
                    title: "Structured, Not Improvised",
                    desc: "You'll know exactly what you're working on before you set off, and review exactly where you got to at the end. No aimless driving.",
                  },
                  {
                    title: "Designed for Nervous Drivers",
                    desc: "Quiet residential roads, clear explanations, and zero pressure. We start at your pace and build confidence step by step.",
                  },
                  {
                    title: "Consistent 1-on-1 Focus",
                    desc: "No swapping cars or instructors. You get the same dual-controlled vehicle and the same experienced instructor for every hour you book.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 text-base">
                    <Check className="mt-1 h-6 w-6 shrink-0 text-hp-accent" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                      <p className="mt-2 text-hp-paper-foreground/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Recent Passes */}
      <section className="bg-hp-ink text-hp-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-hp-accent">
                Proof of Success
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
                Recent passes
              </h2>
              <p className="mt-3 max-w-xl text-lg text-hp-ink-foreground/65">
                Real students, real test-day certificates. Proof of success on actual Reading test routes.
              </p>
            </div>
            <Link
              to="/pass-gallery"
              className="text-sm font-extrabold uppercase tracking-wide text-hp-accent hover:underline shrink-0"
            >
              View the full pass gallery →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aboutPhotos.slice(0, 3).map((photo) => (
              <div
                key={photo.src}
                className={cn(
                  "group overflow-hidden bg-hp-ink-foreground/5",
                  photo.crop?.wrapperClass ?? "aspect-square",
                )}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                    photo.crop?.imgClass,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Final Call to Action */}
      <section className="bg-hp-accent text-hp-accent-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80 leading-relaxed">
              Secure your slot online to start learning automatic driving in Reading. All bookings are
              covered by our 24-hour cancellation guarantee.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/book"
                className="inline-flex items-center bg-hp-ink px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-ink-foreground transition-transform hover:-translate-y-0.5"
              >
                Book a lesson
              </Link>
              <a
                href={site.phoneHref}
                className="text-lg font-extrabold underline underline-offset-4 hover:opacity-90"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
