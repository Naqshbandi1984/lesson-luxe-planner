# learnerdriver.academy — Design System

A brief for design tools. All values below are read directly from `src/styles.css` and the
component source (`src/components/home/*`, `src/components/site/*`) — nothing here is
approximated. Colors are defined in the codebase as OKLCH; hex/RGB equivalents below were
computed with the standard OKLab→sRGB matrices so they can be pasted directly into tools that
don't parse OKLCH.

Brand personality: warm, calm, independent UK driving school — not franchise-corporate.
Bold display typography and full-bleed real photography, not stock imagery or generic icons.

---

## 1. Color system

There are **two palettes** in the codebase. Know which one you're looking at.

### 1a. Homepage palette (`hp-*` tokens) — used on `/` and the global Header/Footer

This is the palette that actually defines the current visual identity: near-black + vivid
emerald + warm off-white. Three colors, no more.

| Token | OKLCH (source of truth) | Hex | RGB | Used for |
|---|---|---|---|---|
| `--hp-ink` | `oklch(0.15 0.015 155)` | **`#060D08`** | `rgb(6, 13, 8)` | Header, Footer, Hero background, and every other "dark band" section background |
| `--hp-accent` | `oklch(0.62 0.17 150)` | **`#03A14A`** | `rgb(3, 161, 74)` | Vivid emerald green — CTA buttons, the "Book a lesson" nav button, StatBand/FinalCta backgrounds, active nav underline, bullet checks, price highlights |
| `--hp-paper` | `oklch(0.975 0.006 95)` | **`#F8F7F2`** | `rgb(248, 247, 242)` | Warm off-white — the "light band" section background |

Foreground pairs are just the opposite end of the same three colors (not separate hues):
- `--hp-ink-foreground` = `--hp-paper` (`#F8F7F2`) — text on dark backgrounds
- `--hp-paper-foreground` = `--hp-ink` (`#060D08`) — text on light backgrounds
- `--hp-accent-foreground` = `--hp-ink` (`#060D08`) — text on the emerald backgrounds/buttons

Opacity variants used throughout for secondary text/borders on dark sections:
`text-hp-ink-foreground/60`, `/65`, `/75` and `border-hp-ink-foreground/10` (i.e. white-ish at
60–75% opacity for secondary text, 10% for hairline dividers on black).

### 1b. Secondary/legacy palette — used on inner pages (About, Reviews, Pricing, FAQ, Contact, Book, Areas)

A softer cream/teal/amber system, defined separately so restyling the homepage never touched
these pages. Still live and in active use — not deprecated.

| Token | Hex | RGB | Used for |
|---|---|---|---|
| `--background` | `#FBF6EC` | `251, 246, 236` | Page background on inner routes |
| `--foreground` | `#0F2929` | `15, 41, 41` | Body text on inner routes |
| `--card` | `#FFFDF9` | `255, 253, 249` | Card surfaces |
| `--primary` | `#10514E` | `16, 81, 78` | Deep teal — primary actions/links on inner pages |
| `--primary-foreground` | `#FCF8F0` | `252, 248, 240` | Text on primary-colored surfaces |
| `--accent` | `#F1AD53` | `241, 173, 83` | Amber — "Book a lesson" buttons, star ratings, price emphasis |
| `--accent-foreground` | `#351E08` | `53, 30, 8` | Text on amber |
| `--secondary` / `--muted` | `#EFE9DC` / `#EFEADF` | `239, 233, 220` / `239, 234, 223` | Subtle fills |
| `--muted-foreground` | `#596E6D` | `89, 110, 109` | Secondary/caption text |
| `--border` / `--input` | `#DFDACE` | `223, 218, 206` | Hairline borders, form borders |
| `--ink` | `#0F2929` | `15, 41, 41` | (Alias of `--foreground`, used for dark-toned UI like `RatingBadge`'s dark variant) |
| `--sand` | `#F4ECDD` | `244, 236, 221` | Warm callout-box background (e.g. Reviews page's pass-gallery callout) |
| `--success` | `#2A8558` | `42, 133, 88` | Success states |
| `--destructive` | `#C9302D` | `201, 48, 45` | Error/destructive states |

Star ratings and "amber" branding moments consistently use `--accent` (`#F1AD53`), not the
homepage's emerald — the two palettes are never mixed within one page.

### 1c. Dark mode

A `.dark` class block exists in `styles.css` (standard shadcn scaffolding) but **nothing in the
app ever applies it** — there is no theme toggle. Treat the site as light-mode-only; ignore the
dark-mode values unless you're specifically asked to design a dark mode.

---

## 2. Typography

Loaded via Google Fonts in `src/routes/__root.tsx`:
```
Bricolage+Grotesque:opsz,wght@12..96,400..800
Public+Sans:ital,wght@0,300..700;1,400
```

| Role | Font | Weights available | Applied to |
|---|---|---|---|
| Display / headings | **Bricolage Grotesque** (variable, optical size 12–96) | 400–800 | All `h1`–`h4` automatically (global base-layer rule), plus anything with the `font-display` utility |
| Body | **Public Sans** | 300–700, italic 400 | Everything else (`body` default) |

Both fall back to `ui-sans-serif, system-ui, sans-serif`.

**Global heading rule:** every `h1`–`h4` gets `letter-spacing: -0.02em` automatically — headings
are always set slightly tighter than body text.

**Type scale actually used on the homepage** (Tailwind defaults — px equivalents at default
16px root):

| Class | Size | Where |
|---|---|---|
| `text-8xl` | 96px | Hero H1 (desktop, `lg:`) |
| `text-7xl` | 72px | Hero H1 (`sm:`), FinalCta H2, StatBand/PricingSplit big numbers (`sm:`), WhyAutomatic year count |
| `text-6xl` | 60px | Hero H1 (mobile), LessonList/AreaStrip/WhyAutomatic H2 (`sm:`), StatBand/PricingSplit numbers, FinalCta H2 (mobile) |
| `text-5xl` | 48px | LessonList/AreaStrip/WhyAutomatic H2 (mobile), AreaStrip flagship postcode (`sm:`) |
| `text-4xl` | 36px | AreaStrip flagship postcode (mobile) |
| `text-3xl` | 30px | LessonList item name |
| `text-2xl` | 24px | PricingSplit eyebrow headings, LessonList index numeral |
| `text-xl` | 20px | AreaStrip flagship area name, FinalCta phone link |
| `text-lg` | 18px | Hero subhead, body copy in PricingSplit/AreaStrip/WhyAutomatic |
| `text-sm` | 14px | Eyebrow labels, nav links, uppercase micro-copy |

Weight vocabulary: `font-black` (900) for the biggest hero numbers/headlines,
`font-extrabold` (800) for section H2s and CTA buttons, `font-bold` (700) for body emphasis and
nav. Regular body text uses default Public Sans weight (400).

Recurring text treatment: **uppercase + `tracking-wide` + `font-extrabold`/`font-bold`** for all
labels, eyebrows, nav items and button text (e.g. `text-sm font-bold uppercase tracking-wide`).
Headline leading is pulled tight: `leading-none` or `leading-[0.98]` on the biggest numerals/H1s,
with `tracking-tight` layered on top of the global `-0.02em`.

---

## 3. Spacing & layout

- **Container:** `max-w-[1400px]`, horizontally centered (`mx-auto`), on every homepage section
  and the Header/Footer.
- **Horizontal padding:** `px-5` (20px) on mobile → `sm:px-8` (32px) at ≥640px. Consistent across
  every section — never varies.
- **Section vertical rhythm:** sections use `py-14`–`py-24` (56px–96px), with **`py-20` (80px)
  as the dominant value** for the majority of homepage sections. `StatBand` is tighter
  (`py-14`/`sm:py-16`), `Hero` and `FinalCta` are the most generous (`py-24`).
- **Header height:** fixed `h-20` (80px), sticky (`sticky top-0`).
- **Grid gaps:** commonly `gap-4`, `gap-5`, `gap-8`, `gap-10`, `gap-12`, `gap-16` depending on
  content density — larger gaps (12–16, i.e. 48–64px) between major content blocks, smaller
  (4–5, 16–20px) between related items in a list.
- **Inner-page content width:** narrower than the homepage — `max-w-4xl`/`max-w-5xl`/`max-w-6xl`
  depending on page, vs. the homepage's `max-w-[1400px]`.

---

## 4. Shape & elevation

Two distinct shape languages coexist, matching the two color palettes:

- **Homepage: sharp, no radius.** Every button, section, and photo tile on `/` is a hard-edged
  rectangle — zero `rounded-*` classes anywhere in `src/components/home/*`. This is deliberate:
  full-bleed slabs, not cards.
- **Inner pages: soft, rounded.** Buttons use `rounded-lg`, cards use `rounded-2xl`, badges/pills
  use `rounded-full` (e.g. `RatingBadge`, testimonial cards, callout boxes).

Radius scale (from `--radius: 0.875rem` / 14px base, only used on inner pages):

| Token | Value |
|---|---|
| `--radius-sm` | 10px |
| `--radius-md` | 12px |
| `--radius-lg` | 14px |
| `--radius-xl` | 18px |
| `--radius-2xl` | 22px |
| `--radius-3xl` | 26px |
| `--radius-4xl` | 30px |

Shadows (inner pages only; homepage has none — flat color blocks instead):

```
--shadow-card: 0 1px 2px rgba(12, 47, 45, 0.06), 0 12px 32px -18px rgba(12, 47, 45, 0.35)
--shadow-lift: 0 2px 4px rgba(12, 47, 45, 0.08), 0 20px 44px -22px rgba(12, 47, 45, 0.45)
```
(Base shadow color is a deep teal-black, `#0C2F2D`, not pure black — soft and warm rather than
harsh.)

---

## 5. Homepage visual structure

The homepage (`src/routes/index.tsx`) is a strict vertical stack of full-bleed sections that
**alternate background color** — no two adjacent sections share a background:

| # | Section | Background | Content pattern |
|---|---|---|---|
| 1 | Header | `hp-ink` (`#060D08`) | Sticky, logo + nav + phone + emerald CTA button |
| 2 | Hero | `hp-ink` (`#060D08`) | Full-bleed photo with a slow Ken Burns zoom/pan (22s, disabled for `prefers-reduced-motion`), dark gradient scrim (`from-hp-ink/70 via-hp-ink/55 to-hp-ink/90`) over it, giant headline (up to 96px) + subhead + two CTAs |
| 3 | StatBand | `hp-accent` (`#03A14A`) | 3-column stat strip, huge black numerals (60–72px) |
| 4 | PricingSplit | `hp-paper` (`#F8F7F2`) | Two-column price breakdown, vertical divider on desktop |
| 5 | LessonList | `hp-ink` (`#060D08`) | Numbered list rows (`01`–`04`) with hover-reveal "Read more →", divided by hairline borders at 10% opacity |
| 6 | AreaStrip | `hp-paper` (`#F8F7F2`) | Flagship area highlighted large, rest as pill badges |
| 7 | RecentPasses | `hp-ink` (`#060D08`) | Full-bleed photo grid (real pass-day photos, no stock imagery), hover scale on images |
| 8 | WhyAutomatic | `hp-paper` (`#F8F7F2`) | Bullet list + a stat callout with a left accent border |
| 9 | FinalCta | `hp-accent` (`#03A14A`) | Centered, large headline + CTA button (which itself is `hp-ink`-colored, inverting against the green) |
| 10 | Footer | `hp-ink` (`#060D08`) | 4-column link grid |

Net pattern: **dark → accent → light → dark → light → dark → light → accent → dark**, so the
eye never gets two same-toned sections in a row. Photography is only full-bleed inside dark
(`hp-ink`) sections (Hero, RecentPasses) — light and accent sections are solid color with no
imagery.

---

## 6. Motion

- **Hero background:** `hero-ken-burns` keyframe — `scale(1)→scale(1.08)` with a slight
  translate, 22s ease-in-out infinite alternate. Skipped under `prefers-reduced-motion`. (An
  optional `/hero-video.mp4` can replace the photo entirely if dropped into `public/` — not
  currently present.)
- **Reviews marquee:** `marquee-scroll` keyframe — continuous `translateX(0)→translateX(-50%)`
  over a duplicated track, 50s linear infinite, pauses on hover/focus. Reduced-motion users get
  a static wrapped grid instead (`motion-safe:`/`motion-reduce:` split, not a JS check).
  See `TestimonialMarquee.tsx`.
- **Hover states:** buttons lift (`hover:-translate-y-0.5`), photo tiles scale
  (`group-hover:scale-105`), nav underlines animate in on active route.

---

## 7. Photography & content policy

No stock photography anywhere. All imagery is real: a hero shot of the instructor's car, and a
curated set of genuine student pass-day photos (`src/assets/pass-day-*.png`,
`src/lib/pass-photos.ts`) — cropped per-photo to cut out phone-screenshot letterboxing rather
than using generic frames. This is a deliberate trust signal for the brand and should carry over
into any redesign: real photos of real people on their test day, not illustration or stock.

---

## 8. Component conventions worth carrying over

- **CTA buttons (homepage):** sharp rectangle, `bg-hp-accent`, uppercase, `font-extrabold`,
  generous padding (`px-8 py-4` or larger), no radius, subtle hover lift.
- **CTA buttons (inner pages):** `rounded-lg`, solid `bg-accent` (amber), `font-semibold`.
- **Nav active state:** bottom border in `hp-accent`, text color shifts to `hp-accent`.
- **Star ratings:** always 5 filled stars via `lucide-react`'s `Star`, filled with `accent`
  (amber, `#F1AD53`) — used identically in `RatingBadge`, testimonial cards, and the Hero eyebrow
  (there specifically `hp-accent` green, the one exception where the homepage palette wins over
  amber, since it sits on the dark Hero background).
- **Eyebrow/label pattern:** small, uppercase, bold, wide-tracked, often in the accent color —
  used consistently for section pretitles and badges.
