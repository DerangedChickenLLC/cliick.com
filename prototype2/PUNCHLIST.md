# prototype2 — running punch list

Knock-on effects and deferred cleanups noticed while iterating. Not blocking;
review before finalising. Delete this file when prototype2 is promoted.

## Copy

- [ ] **Hero slogan duplicates the closing CTA.** Every page closes with
  `Join the Reset.` / `Reclaim your feed.` The homepage hero is now
  "Reclaim your Feed", so the page opens and closes on the same phrase.
  The closing CTA uses *both* slogans we've trialled, so it constrains any
  hero drawn from that line. Decide what the closer should say.
- [ ] **Capitalisation mismatch.** Hero reads "Reclaim your **F**eed";
  the closing CTA reads "Reclaim your **f**eed." Pick one.
- [ ] **Hero copy exists twice.** The stage scenes and the fallback flow each
  carry their own hero + section copy (author's note, `index.html`). Every
  copy edit must be made in both until the design settles.

## Layout

- [ ] **Hero headline wraps to two lines** at 1440px — "Reclaim your / Feed".
  It misses a single line by a few pixels against the container, so the wrap
  is accidental rather than designed. Either nudge the type/width to fit one
  line, or commit to the two-line stack.

## Scaffolding to remove before launch

- [ ] **Placeholder film slates.** Delete the marked block in `redesign.css`
  plus every `.phone--placeholder` class and `.film-slate` span once real
  recordings exist. `.phone-screen video` is already styled for the swap.
- [ ] **Palette / hero-tone switchers** were removed from prototype2. They
  still exist in `/prototype/` if we want to revisit those variants.
