import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { site } from "@/lib/site";
import heroPhoto from "@/assets/hero-photo.png";

export function Hero() {
  return (
    <section className="relative isolate min-h-[600px] overflow-hidden bg-hp-ink text-hp-ink-foreground sm:min-h-[680px] lg:min-h-[760px]">
      <div className="absolute inset-0">
        <img
          src={heroPhoto}
          alt=""
          aria-hidden="true"
          className="h-full w-full animate-hero-ken-burns object-cover object-[55%_45%]"
        />
        {/*
          Drop a clip into /public/hero-video.mp4 to switch on a moving background — it
          autoplays muted and loops over the Ken Burns photo above. No file yet, so the
          browser shows nothing here and the photo keeps driving.
        */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-hp-ink/70 via-hp-ink/55 to-hp-ink/90" />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-5 py-24 sm:px-8">
        <div className="inline-flex w-fit items-center gap-2 text-sm font-bold">
          <span className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-hp-accent text-hp-accent" />
            ))}
          </span>
          {site.rating} from {site.reviewCount} reviews
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-6xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
          Automatic lessons.
          <br />
          <span className="text-hp-accent">No stalling.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg font-medium text-hp-ink-foreground/75 sm:text-xl">
          Learn with {site.instructorName} — no clutch, no kangaroo starts, no shouting.{" "}
          {site.yearsExperience} years of teaching people in Reading to drive — beginners,
          nervous drivers and anyone coming back to it after a break.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/book"
            className="inline-flex items-center bg-hp-accent px-8 py-4 text-base font-extrabold uppercase tracking-wide text-hp-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Book a lesson
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center border-2 border-hp-ink-foreground/40 px-8 py-4 text-base font-extrabold uppercase tracking-wide hover:bg-hp-ink-foreground/10"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
