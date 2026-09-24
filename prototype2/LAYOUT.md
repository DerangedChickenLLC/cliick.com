# Layout pass (#48) — findings and a plan for portrait and landscape

Survey of all nine prototype2 pages at eleven window sizes, plus real iOS
Safari. The goal from John (2026-09-24): as a visitor experiences it, the site
has **three** layouts today — desktop, a middle one where things collapse into
a single column, and phone. The intent is **two**: portrait (phone) and
landscape (desktop), where landscape **scales** to fit the window instead of
collapsing. That is about what a person sees, not a count of CSS breakpoints.

Nothing in this document is built yet. The decisions at the end are John's.

---

## What was measured

Sizes: phones 320x640, 360x740, 390x844, 430x932; a phone held sideways
844x390; a tablet 768x1024 and 1024x768; three unmaximised small-laptop
windows 1024x640, 1180x660, 1280x720; and 1440x900 as the reference desktop.
Each page was checked for sideways overflow, text running off the edge, the
page heading hidden under the nav or below the first screen, the smallest text
size, and — on Home, where the scrolling scenes run — whether any scene's copy
or phone image is cut off by the window.

Real iOS Safari was checked in the iOS 27 simulator (iPhone 18 Pro).

## The three layouts, as they exist today

| window | nav | Home | About | Membership |
|---|---|---|---|---|
| phones (320–430 wide) | menu button | stacked | stacked | stacked |
| phone sideways (844x390) | full links | stacked | stacked | stacked |
| tablet upright (768x1024) | full links | stacked | stacked | stacked |
| tablet sideways (1024x768) | full links | **stacked** | side by side | **stacked** |
| laptop 1024x640 | full links | **stacked** | side by side | **stacked** |
| laptop 1180x660 | full links | **stacked** | side by side | **stacked** |
| laptop 1280x720 | full links | scenes | side by side | side by side |
| desktop 1440x900 | full links | scenes | side by side | side by side |

The middle layout isn't one layout. **Each page collapses at a different
width**: About stays side by side down to 981px, Home drops its scenes below
1200px, and Membership stacks below about 1240px. In a 1100px-wide laptop
window, About is side by side while Home and Membership are stacked. That's
the inconsistency John is feeling.

What the middle layout looks like in a landscape window: on Home at 1024–1180
wide the headline and store badges sit on the left, the right half is empty,
and the phone image starts below the fold. Membership's plan cards are below
the fold at those sizes too. The window is wide but the layout is tall.

## Problems found

- **In iOS Safari the menu wouldn't open from below the top of a page.** Fixed
  in #50 / PR #51. (Chrome and a WebKit build both passed, which is why only
  real Safari found it.)
- **Phone held sideways (844x390)** gets the full nav links and every heading
  at desktop size, with everything stacked. On About the heading is 906px down
  a 390px-tall window, under two screens of photo.
- **About on phones** puts the photo, quote and caption above the heading. At
  320x640 the heading doesn't appear on the first screen at all. (Known; a
  content-order decision.)
- **Terms overflows sideways at 320px wide.** A 63-character Apple EULA web
  address in the legal text can't wrap. One CSS line fixes it.
- **Space under the nav.** About 80–88px sits between the menu bar and each
  subpage heading at every width. On desktop it reads as breathing room; on a
  phone it's about a tenth of the screen before any content.
- **Phone footer**: "Download Cliick on iOS" and "Download on Android" stack
  with a large gap.
- The small "Nova Scotia, where the question started" caption is 12.8px. It's
  a deliberate caption, noted for the text-size floor below.

What held up: nothing scrolls sideways anywhere except Terms at 320; no page
heading is ever hidden under the nav; and on Home, where the scenes run
(1280x720 and up), no scene's copy or phone image is cut off by the window.
The short-window adjustments work.

## The proposal: portrait and landscape

### What decides it

The shape of the window, not its width:

- **Landscape**: wider than it is tall, **and** at least about 520px tall.
- **Portrait**: everything else.

The height minimum is for a phone held sideways. At 390px tall the desktop
layout scaled to fit would be tiny, so a sideways phone stays in portrait.
An iPad held sideways (1024x768) and every laptop window, maximised or not,
get landscape. An iPad upright and a tall narrow desktop window get portrait,
which is right for their shape.

### Landscape scales

Landscape is one layout that scales to the window, not a set of layouts at
different widths:

- Sizes that matter to the composition — headings, the phone image, the
  scene copy, the About photo, the plan cards, gaps between columns — scale
  with whichever of the window's width or height is tighter compared to the
  1440x900 reference. A short window shrinks the layout as well as a narrow
  one, which is the 12" unmaximised case.
- **Body text has a floor** below which it stops shrinking (proposed 15px).
  Without it a small window becomes a miniature of the desktop page. Headings
  keep scaling; paragraphs stop.
- Done in CSS with a single "design unit" that every scaled size is a
  multiple of, not by shrinking the whole page with a transform. A transform
  would blur text, break browser zoom, and fight the pinned scenes.
- **Home runs its scrolling scenes in every landscape window**, not only at
  1200px and up. The separate stacked layout (`.fallback-flow`) becomes
  portrait-only. That removes the version of Home that has caused the most
  trouble — it's where the brown backdrop bug was.
- **About and Membership stay side by side** in every landscape window.

### Portrait is today's phone layout, tidied

Menu button, a single column, the current phone type sizes. It covers phones
in either orientation, tablets upright, and tall narrow windows. The tidying
is the list above: About's order, the space under the nav, the footer labels,
and the Terms URL.

## Decisions for John

**Answered 2026-09-24:** 1 yes — shape plus a minimum height of about 520px.
2 yes — a sideways phone gets portrait. 3 yes — an upright iPad gets portrait.
4 yes — a 15px body-text floor (the 12.8px photo caption is treated as a
deliberate exception unless John says otherwise). 5 open — John wants to see
both orders before choosing.


1. **The switch.** Shape plus a minimum height (proposed 520px), as above? Or
   something else.
2. **Phone held sideways gets portrait.** Proposed yes. The alternative, a
   scaled-down landscape at 390px tall, would be very small.
3. **An iPad upright gets portrait** — the menu button and single column, with
   a lot of width. Proposed yes, with the column kept to a comfortable reading
   width rather than stretched.
4. **Body-text floor**: proposed 15px. The existing 12.8px caption would sit
   below it; keep it as a deliberate exception, or lift it?
5. **About's order in portrait**: heading first, then photo and quote? Or keep
   the photo first?

## Proposed split, once the decisions are made

Each is a sitting or a day. The first two need the decisions above; the last
one doesn't need anything.

1. **The switch** — one portrait/landscape rule drives the nav, Home's scenes,
   and every side-by-side section; it replaces the 1200px script gate and the
   page-by-page widths. (M)
2. **Landscape scaling** — the design unit, then the scenes, heroes, photo and
   plan cards moved onto it, with the text floor. Checked at every landscape
   size in this survey. (M)
3. **Home's scenes in every landscape window** — scenes checked for clipping
   at 1024x640 and 1180x660; `.fallback-flow` becomes portrait-only. (M)
4. **Portrait tidy** — About's order, the space under the nav on phones, the
   footer download labels. (S)
5. **Terms long URL at 320px** — one CSS line; no decision needed. (S)
