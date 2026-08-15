/**
 * Real pass-day photos supplied by the instructor: students holding their
 * practical test certificates beside the lesson car. Curated subsets are
 * used across the site as genuine social proof in place of stock imagery.
 *
 * Most of the supplied files are screenshots of a phone photo viewer with
 * black letterboxing baked in on one or both sides. Measured pixel-exact
 * per photo (see scripts/analyze-bars.mjs), each crop below sizes the
 * container to just the real photo content and shifts object-position to
 * cut away the bar rather than the subject. pass-day-01, 04, 11, 12 and 14
 * are excluded — their bars are too large (>30% of the frame) to crop
 * around without cutting into the subject, and pass-day-04 additionally
 * shows a different driving school's branding in the car window.
 */
import p02 from "@/assets/pass-day-02.png";
import p03 from "@/assets/pass-day-03.png";
import p05 from "@/assets/pass-day-05.png";
import p06 from "@/assets/pass-day-06.png";
import p07 from "@/assets/pass-day-07.png";
import p08 from "@/assets/pass-day-08.png";
import p09 from "@/assets/pass-day-09.png";
import p10 from "@/assets/pass-day-10.png";
import p13 from "@/assets/pass-day-13.png";
import p15 from "@/assets/pass-day-15.png";

export type PassPhoto = {
  src: string;
  alt: string;
  /** First name, only when actually known — no names were supplied with these photos, so all are unset for now. */
  name?: string;
  /** Crops out a letterboxed bar: aspect-ratio for the wrapper, object-position for the img. */
  crop?: { wrapperClass: string; imgClass: string };
};

/** Featured on the homepage, in place of the fabricated testimonial quote. */
export const homeFeaturePhoto: PassPhoto = {
  src: p05,
  alt: "Student holding a driving test pass certificate beside the lesson car",
  crop: { wrapperClass: "aspect-[763/740]", imgClass: "object-[24%_50%]" },
};

/** Gallery on the About page. */
export const aboutPhotos: PassPhoto[] = [
  {
    src: p02,
    alt: "Student holding a pass certificate beside the lesson car",
    crop: { wrapperClass: "aspect-[763/758]", imgClass: "object-[13%_50%]" },
  },
  {
    src: p07,
    alt: "Student holding a pass certificate on a sunny test day",
    crop: { wrapperClass: "aspect-[572/752]", imgClass: "object-[32%_50%]" },
  },
  { src: p09, alt: "Student holding a pass certificate beside the lesson car" },
  {
    src: p13,
    alt: "Student holding a pass certificate beside the lesson car in autumn",
    crop: { wrapperClass: "aspect-[427/572]", imgClass: "object-[20%_50%]" },
  },
  {
    src: p15,
    alt: "Student holding a pass certificate beside the lesson car",
    crop: { wrapperClass: "aspect-[398/652]", imgClass: "object-[96%_50%]" },
  },
];

/** Gallery on the Reviews page, alongside the honest note about written reviews. */
export const reviewPhotos: PassPhoto[] = [
  {
    src: p03,
    alt: "Student holding a pass certificate beside the lesson car",
    crop: { wrapperClass: "aspect-[764/760]", imgClass: "object-[14%_50%]" },
  },
  {
    src: p06,
    alt: "Student holding a pass certificate beside the lesson car",
    crop: { wrapperClass: "aspect-[763/726]", imgClass: "object-[5%_50%]" },
  },
  { src: p08, alt: "Student holding a pass certificate beside the lesson car" },
  {
    src: p10,
    alt: "Student holding a pass certificate on a bright morning",
    crop: { wrapperClass: "aspect-[400/490]", imgClass: "object-[9%_50%]" },
  },
];

/** Bold "Recent passes" grid on the homepage — the full curated set, largest first. */
export const recentPasses: PassPhoto[] = [homeFeaturePhoto, ...aboutPhotos, ...reviewPhotos];
