# Finalisations before this replaces the live site

Everything here is deferred on purpose. The design work happens first; this is
the list of what has to be true before `prototype2/` stops being a prototype.
It is not a backlog of improvements — each line is something that is currently
*wrong for a live site* rather than merely unfinished.

Kept out of the web root by `_config.yml`. Add to it as things come up; delete
a line only when it is actually done.

## Blocking — the site is broken or incoherent without these

**Terms of Service and Privacy Policy are on the old design.**
`/terms/` and `/privacy/` load `../styles.css` and use `<nav class="navbar">`,
which is the live site's stylesheet and the live site's nav markup. The new
footer links straight at them (`prototype2/index.html`, the Terms/Privacy
pair), so a reader following those links walks out of the new site mid-journey
and lands in the old one. Note the bodies are **synced from the Documents
repo** by `sync-documents.sh` — the fix belongs in whatever wrapper that script
fills, not in the generated output, or the next sync reverts it.

**238 absolute `/prototype2/` references, across 13 files.**
HTML, CSS and JS all hard-code the prototype path — including the backdrop
image in `redesign.css` and the script tag on every page. Promoting the
prototype to the web root is a rewrite of every one of them, not a folder move.
Decide the approach before starting: relocate and rewrite, or serve from the
root and keep the paths.

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
- **`footer-qr.png`** — confirm it resolves to the live install link.
- **Store badges** — the stretch bug is fixed; confirm these are the final
  approved assets.

## Meta and SEO

- **Only the homepage has Open Graph tags.** About, Membership, FAQ and Start
  have a `<title>` and a description but no `og:` block, so any link shared to
  them previews as a bare URL. Needs per-page OG images too, not just tags.

## Known issues carried in from the design work

- **The nav overlaps the hero heading below 1200px.** Confirmed in both
  Chrome and WebKit at 1000x630: `.hero` does not reserve `--nav-h`, and the
  nav sits on the copy. The pinned stage is off at that width, so this is the
  fallback layout only.
- **Intermittent nav displacement in Safari.** Reported, not reproduced —
  seven viewport sizes in a WebKit build, on load and after scrolling away and
  back, all measured `navY: 0`. Two speculative fixes are in (re-running the
  motion gate on `load` and on `pageshow`/bfcache). Still watching. If it
  recurs, the next move is taking `.nav` off JS entirely: `position: fixed`
  unconditionally, which removes the mechanism instead of patching triggers.
- **Backdrop tint exploration** is parked in `PUNCHLIST.md`.
