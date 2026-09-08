# prototype2 — running punch list

Knock-on effects and deferred cleanups noticed while iterating. Not blocking;
review before finalising. Delete this file when prototype2 is promoted.

## Copy

- [ ] **Manifesto line, verbatim, for the new page.** From a contributor, in the
  room: *"Everyone please STOP posting your personal lives on advertising
  platforms!"* Too scolding for body copy — it makes the visitor the wrongdoer
  on a site whose whole posture is invitational — but it is the founding
  grievance stated plainly, and a quote is allowed an intensity a paragraph is
  not. Belongs on the manifesto page planned alongside About, set as a stated
  conviction and ideally attributed. Its sharpest idea, "advertising platforms"
  as the frame for what those products structurally are, is already carried
  into scene 2.
- [x] ~~"No X. No Y." is becoming a refrain.~~ Made deliberate: all three
  scenes now close on it — "Invite only. No searching. No pushed content." /
  "No followers. No reach." / "No tracking. No data brokers. No AI training."
  Counts vary 3-2-3 so it reads as a refrain rather than a template.
- [ ] **"No AI training" is now load-bearing.** It closes the homepage's final
  scene as well as appearing in the promise chips and the FAQ, so it is one of
  the site's most prominent promises. It is also the policy claim in the
  ledger most likely to age badly. Needs an owner to confirm it holds
  indefinitely before launch, not just today.

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

- [x] ~~About and Membership carry two headers.~~ Resolved: the page name is
  now a small eyebrow and each page's real headline was promoted into the
  header, so there is one header per page.
- [ ] **FAQ's headline is invented copy.** "Questions, answered." and "Search
  below, or browse by topic." were written to fill the merged pattern — About
  and Membership reuse their own existing copy, FAQ had none. Copy round.
- [ ] **The supporting-art slot is empty on all three pages.** `.page-hero-art`
  is wired and documented; it just needs images. Sized to `min(360px, 32vw)`
  and dropped below 900px.
- [ ] **Page ledes are placeholders** written to make the pattern visible, not
  approved copy. They belong in the copy round.

## Responsive

- [ ] **Small-screen nav.** Four links plus the wordmark do not fit below
  ~340px; `.nav-links` is the only element still pushing past the viewport at
  320px, on every page, and it is the one genuinely broken responsive case
  left. Needs a real pattern — drawer, disclosure, or a condensed row — not a
  tweak. Decide the pattern before building; it also has to work over the lit
  backdrop and against the frosted nav bar.
- [ ] **Optimisation pass generally** — breakpoints are chosen per component
  rather than from a shared set.

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
