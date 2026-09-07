# prototype2 — running punch list

Knock-on effects and deferred cleanups noticed while iterating. Not blocking;
review before finalising. Delete this file when prototype2 is promoted.

## Copy

- [x] ~~Hero slogan duplicates the closing CTA.~~ Resolved: the footer CTA
  is now `Join the Reset.` alone, so the title and footer are distinct.
- [x] ~~Capitalisation mismatch between hero and footer.~~ Gone with the
  footer's second line.
- [ ] **The hero phrase still recurs in scene 2.** The hero is "Reclaim your
  Feed" and scene 2's heading is "Start fresh and reclaim your feed" — so
  the homepage still says it twice, roughly one screen apart, and scene 2 is
  the more prominent of the two now that scene headings run 52px. Removing it
  from the footer disambiguated title from footer but not title from scene.
  Note the scene copy exists twice in `index.html` (stage + fallback), so any
  reword needs both.
- [ ] **Hero copy exists twice.** The stage scenes and the fallback flow each
  carry their own hero + section copy (author's note, `index.html`). Every
  copy edit must be made in both until the design settles.

## Layout

- [ ] **Hero headline wraps to two lines** at 1440px — "Reclaim your / Feed".
  It misses a single line by a few pixels against the container, so the wrap
  is accidental rather than designed. Either nudge the type/width to fit one
  line, or commit to the two-line stack.

## Hero backdrop (placeholder)

- [ ] **Subpage crop lands in the dark region.** `.page-hero .hero-bg` uses
  `object-position: center 75%`, which on the simulated backdrop picks up the
  navy lower-left rather than the warm bokeh. Subpage headers read flat and
  dark. Either shift to roughly `center 35%`, or give the SVG more interest
  low in the frame.
- [ ] **Hatch reads on the phone's black chrome.** The placeholder hatch is
  invisible over photography but shows as visible stripes across the app's
  dark nav bar. Consider masking it to the photo area or dropping its opacity.

## Colour schemes

- [ ] **A second scheme is planned** (visitor-selectable, a completely
  different look). Everything now resolves through the SCHEME block at the top
  of `redesign.css`; a second scheme should be defined by overriding that block
  alone. Do not introduce colour literals below it — the one leak we already
  hit was an inline `style="background: var(--band-gray)"` on About, which
  silently produced 1.01:1 text when the token was repointed.
- [ ] **Decide how the scheme is selected** — `data-scheme` on `<html>` plus a
  toggle, persisted. Not built.

## Subpage structure

- [ ] **About and Membership carry two headers.** The page header states the
  page, then a centred `eyebrow` + `h2` immediately restates it ("Membership"
  then "Powered by Subscription / Because you are not the product."). FAQ has
  no such section and jumps straight to search. Now that the page header has
  real content, the section header beneath it may be redundant on those two —
  an editorial call, not a styling one.
- [ ] **The supporting-art slot is empty on all three pages.** `.page-hero-art`
  is wired and documented; it just needs images. Sized to `min(360px, 32vw)`
  and dropped below 900px.
- [ ] **Page ledes are placeholders** written to make the pattern visible, not
  approved copy. They belong in the copy round.

## Explorations

- [ ] **Light gallery.** Real galleries hang work on white walls because a
  bright neutral surround makes photographs read as objects, and the product
  is user photography — so a light scheme may serve the content better than
  the dark one. Not a token swap: every relationship inverts (objects become
  raised and lighter, the night backdrop needs heavy correction or replacing,
  the phone's black bezel goes from melting into the wall to being the darkest
  thing on screen). The `.band.latte` context block is a working miniature of
  exactly this — the light gallery is that block applied site-wide.
- [ ] **Second scheme, visitor-selectable** (the other founder's, deliberately
  unlike this one). See the scheme notes above.

## Dark gallery — unfinished edges

- [ ] **`.win` on About keeps its `clip-path`,** which crops the phone. It is
  now a lit alcove rather than a flat slab, but if we want the homepage's
  no-box treatment here too, the crop has to go and About's layout shifts.
- [ ] **`.band.latte` is deliberately light** (`#F2EBDF`), not an oversight:
  it is the "back out into the light" beat before the black footer, and
  `.latte-fluffy` depends on `mix-blend-mode: multiply` to drop its baked-in
  white background, which only works over a light band. Making the band dark
  requires a transparent mascot asset — keying the white out leaves artifacts
  where its drop shadow was, since that shadow is grey-on-white and no
  luminance threshold separates it from the white cup.

## Scaffolding to remove before launch

- [ ] **Placeholder film slates.** Delete the marked block in `redesign.css`
  plus every `.phone--placeholder` class and `.film-slate` span once real
  recordings exist. `.phone-screen video` is already styled for the swap.
- [ ] **Simulated hero backdrop.** `images/redesign/hero-bg-sim.svg` is a
  procedural stand-in, not photography. Replace with the real shoot; the
  original `hero-bg.png` is still in the repo if we need to fall back.
- [ ] **Palette / hero-tone switchers** were removed from prototype2. They
  still exist in `/prototype/` if we want to revisit those variants.
