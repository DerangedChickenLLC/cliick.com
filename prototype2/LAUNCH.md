# Finalisations before this replaces the live site

Everything here is deferred on purpose. The design work happens first; this is
the list of what has to be true before `prototype2/` stops being a prototype.
It is not a backlog of improvements — each line is something that is currently
*wrong for a live site* rather than merely unfinished.

Kept out of the web root by `_config.yml`. Add to it as things come up; delete
a line only when it is actually done.

## Blocking — the site is broken or incoherent without these

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
- **`footer-qr.png` is a placeholder.** It decodes to the string `YKART`,
  not a URL — it is the mock from the Figma file, carried over from the first
  prototype, and there is no real QR anywhere on the site. It is hidden on
  phones, but every desktop visitor who scans it gets nothing. Needs the
  install URL it should carry; since a desktop visitor may be on either
  platform, that URL has to route to the right store rather than being the
  App Store link.
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
