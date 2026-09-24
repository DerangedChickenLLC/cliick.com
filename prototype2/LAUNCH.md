# Finalisations before this replaces the live site

Everything here is deferred on purpose. The design work happens first; this is
the list of what has to be true before `prototype2/` stops being a prototype.
It is not a backlog of improvements — each line is something that is currently
*wrong for a live site* rather than merely unfinished.

Kept out of the web root by `_config.yml`. Add to it as things come up; delete
a line only when it is actually done.

## Prefix step — before the switch

**A narrow and mobile layout pass across all nine pages (#48).** Survey done; findings, a portrait/landscape plan and the decisions it needs are in [LAYOUT.md](LAYOUT.md). Nearly every
review during the design work was done at 1280px and up. The phone-width
fixes that did land (the call to action, the menu, the footer QR) came up one
at a time rather than from a pass. The 721–1199px range — tablets and narrow
laptops, where Home swaps the pinned stage for the fallback layout and the
split heroes fold at 980px — has only been checked for backdrop colour, never
for layout.

Widths: 320, 360, 390, 430 (phones), 768 and 1024 (tablet portrait and
landscape), 1100–1199 (narrow laptop, just under the stage breakpoint).

**Heights matter as much as widths.** A 12" laptop with the window not
maximised gives something like 1000–1280 wide by 600–700 tall. The pinned
stage is built on `100vh`, and the only concession to short windows is two
height tweaks above 1200px wide.

**Intended direction (John, 2026-09-24) — to be discussed, not yet
decided:** as a visitor experiences the site today there are three width
scenarios — desktop, a middle one where things collapse to a vertical stack,
and phone. The intent is two: portrait (phone) and landscape (desktop), where
landscape *scales* to fit the window rather than collapsing. This is about the
layouts a person experiences, not the number of CSS breakpoints; the
implementation uses however many it needs. (For reference, the stylesheet has
eleven width breakpoints, two short-window height tweaks and a script switch
at 1200px, most of them producing that middle scenario.)

Questions for that discussion:
- **What decides the switch.** Orientation (width versus height) rather than
  a width threshold means an iPad in landscape gets the desktop layout and a
  tall, narrow desktop window gets the phone layout — probably right in both
  cases.
- **A phone turned sideways** (about 844x390) is landscape too. Scaled to fit
  390px of height, the desktop layout would be tiny. It likely needs a minimum
  height to qualify as landscape, falling back to portrait below it.
- **How far it may scale.** Scaling by both width and height (so a short
  window shrinks as well as a narrow one) handles the 12" case, but body text
  needs a floor below which it stops shrinking, or small windows become
  miniatures.
- **The pinned stage would run in every landscape window,** not only at 1200px
  and up. That retires the separate fallback layout for landscape, which is
  where the brown backdrop bug lived.

Known going in:
- About at phone width puts the founders' photo, quote and caption above the
  H1, so the page opens with a quote from people it has not introduced yet.
  A content-order decision.
- The footer on a phone stacks "Download Cliick on iOS" and "Download on
  Android" with a large gap between them.
- Home below 1200px (the fallback layout) has had no layout review of its own.
- Nothing has been checked in real iOS Safari — only Chrome's device emulation
  and a WebKit build. The intermittent Safari nav report below is still open.

## Blocking — the site is broken or incoherent without these

**Decided 2026-09-24:** prototype2 replaces the root site in one go-live PR;
its `/prototype2/` paths are rewritten by script at the switch, not before, so
the preview keeps working until then. `/prototype/` is deleted in the same PR.
`/terms/` and `/privacy/` keep their URLs because the store listings use them.

~~**Terms of Service and Privacy Policy are on the old design.**~~ Done
(#46): `prototype2/terms/` and `prototype2/privacy/` are new-design wrappers
that fetch the synced bodies from `/terms/tos.html` and `/privacy/privacy.html`,
and every prototype2 footer points at them. `sync-documents.sh` writes only
those two body files, so the wrappers are safe from the next sync. At go-live
the wrappers replace the root `/terms/index.html` and `/privacy/index.html` —
keep those two URLs, since the store listings link to them.

**238 absolute `/prototype2/` references, across 13 files.**
HTML, CSS and JS all hard-code the prototype path — including the backdrop
image in `redesign.css` and the script tag on every page. Promoting the
prototype to the web root is a rewrite of every one of them, not a folder move.
Decide the approach before starting: relocate and rewrite, or serve from the
root and keep the paths.

**Every prototype2 page carries `<meta name="robots" content="noindex,
nofollow">`.** Correct while it is a prototype; it has to come off at go-live
or the new site will not be indexed at all.

**Start a Cliick is out of the live cut (#46).** The page is kept in the repo
and excluded from the build in `_config.yml`; every link to it was removed
(nav CTA, footer link, six scene links on Home). Restore the links and drop the
exclude line when it ships.

~~`/support/` and `/deleteme/` are live pages the prototype never covered.~~
Migrated (#46): `prototype2/support/` and `prototype2/deleteme/` are in the new
design, and every prototype footer links to them. `/deleteme/` is the web
deletion URL registered with Google Play — its policy text moved verbatim,
and the URL must survive the switch unchanged, as must `/support/`. With both
migrated nothing on the new site uses the old `styles.css`, so it can go at
the switch along with `partials/` and `build-partials.py`.

**The footer names the legal entity again (#46).** The live footer reads
"© Deranged Chicken LLC"; the prototype had "© Cliick". The Apple Developer
account's conversion from Individual to Deranged Chicken LLC was filed
2026-09-19 and is pending, so the site Apple may check should keep naming the
LLC. The prototype footer now reads "© Deranged Chicken LLC. Member-funded.
Ad-free. Always."

**Retire `/prototype/`.** The first prototype is still published. It should go
when the new site lands, along with any links pointing at it.

**Re-check the `_config.yml` exclude list once paths move.** `PUNCHLIST.md`,
this file and `prototype2/brand/` are kept off the web root by path. Every one
of those entries breaks the moment the directory changes.

**Decide which footer is canonical.** `build-partials.py` fills
`partials/footer.html` via a `{{BASE}}` placeholder for the live site. The
prototype pages carry their own footer markup instead. Two footers that must
agree is a footer that eventually won't.

## Content and assets still standing in for the real thing

- **Founders' signatures on About** are the Caveat webfont, not real
  signatures. Real ones were always the intent.
- **`hero-bg-sim.svg` is a simulation** of the aurora photograph, not the
  photograph. It is now the backdrop of every page on the site, so this is
  more load-bearing than it was when it was only the hero.
- **The phone mock screens carry "FILM TO COME" baked into the artwork.**
  Real screen recordings replace them. The text is in the PNGs, not the HTML,
  so it will not turn up in a content grep.
- ~~`footer-qr.png` is a placeholder.~~ Done (#46): it decoded to `YKART`,
  the Figma mock. Replaced with `footer-qr.svg`, generated for
  `https://cliick.com/get/` and verified by decoding it back. `/get/` sends an
  iPhone or iPad to the App Store and an Android phone to Google Play before
  anything paints; anything else sees the page with both badges. The QR only
  works once the site is live at the root — before that, `/get/` lives at
  `/prototype2/get/`.
- **Store badges** — the stretch bug is fixed; confirm these are the final
  approved assets.

## Meta and SEO

- ~~Only the homepage has Open Graph tags.~~ Tags added to About,
  Membership, FAQ, Terms and Privacy (#46). **Still open:** every page,
  including Home, uses the app icon as its `og:image`, so a shared link
  previews as a small square icon. A proper 1200x630 card per page is an
  asset job.

## Known issues carried in from the design work

- ~~The nav overlaps the hero heading below 1200px.~~ Fixed: `.hero` now
  reserves `--nav-h` the way `.page-hero` already did.
- **Intermittent nav displacement in Safari.** Reported, not reproduced —
  seven viewport sizes in a WebKit build, on load and after scrolling away and
  back, all measured `navY: 0`. Two speculative fixes are in (re-running the
  motion gate on `load` and on `pageshow`/bfcache). Still watching. If it
  recurs: `.nav` is now `position: fixed` unconditionally rather than under a
  JS-set class, which removes the mechanism rather than patching its
  triggers. That was the planned next move and it has been taken.
- **Backdrop tint exploration** is parked in `PUNCHLIST.md`.
