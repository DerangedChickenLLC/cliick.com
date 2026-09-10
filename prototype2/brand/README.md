# Wordmark — source and tooling

The CLIICK wordmark is **drawn, not set**. There is no font behind it: every
curve is a circular arc and every stem a rectangle, emitted as SVG paths by
`build-wordmark.py`. Nothing here depends on a licensed typeface.

This mirrors how the bird is handled in the Clique repo (`assets/logo-source.svg`
plus `scripts/generate-brand-assets.mjs`) — a source of truth plus a generator,
rather than a pile of exported files nobody can regenerate.

## Files

| | |
|---|---|
| `build-wordmark.py` | The generator. Run it to rebuild every variant. |
| `optical-centre.html` | Measures the lockup's optical alignment (below). |
| `../images/brand/cliick-wordmark.svg` | Shipped: the small optical cut, used in the nav. |
| `../images/brand/cliick-wordmark-lg.svg` | Shipped: H2, for large use. |
| `../images/brand/cliick-mark.svg` | Shipped: the bird, `logo-source.svg` minus `#Outer_Circle`. |

```
python3 build-wordmark.py     # writes cliick-<variant>.svg beside itself
```

## What is shipped, and why there are two cuts

`CUTS` in the generator holds the pair actually in use:

- **h2** — 5.5% stem, tracked +17. The chosen register: thin, crisp, wide.
- **h2-small** — 8% stem, tracked +19. Same skeleton, tuned to match h2's
  *colour* rather than its measurements.

A 5.5% stem cannot hold at nav or favicon size — it thins to sub-pixel and
antialiases to grey mush. That is what the second cut is for. This is ordinary
optical sizing; the two are one mark, not two designs.

`DIRECTIONS` and `LADDER` keep the explorations that led here, so the reasoning
is not lost: the ladder is the thin/tracked register pushed in four steps, and
H2 is the rung that was chosen.

## Constraints baked into the drawing

Worth knowing before changing a number, because each of these was hit the hard
way:

- **Optical overshoot.** Round shapes (the Cs, the tittles) exceed the cap line
  by `ov`. A circle stopping exactly on the line reads *shorter* than the flat
  stem beside it.
- **Asymmetric sidebearings.** The C's mouth opens right, contributing a fixed
  ~11 units of white. Without a tighter right sidebearing the word breaks into
  "C LIIC K". Tracking is added uniformly so this correction stays constant in
  absolute terms rather than scaling away.
- **Plumb terminals need an open enough aperture.** A vertical cut only exists
  while the cut line still crosses the inner circle. Heavy weights close the
  counter past that point and the cut has nothing to bite on — which is why
  thin weights make this terminal style available and heavy ones do not.
- **Dots grow as a multiple while shrinking absolutely.** A dot at a fixed
  multiple of a thinning stem disappears, so `dot_scale` rises as `weight`
  falls just to hold the tittles at roughly constant real size.
- **Caps, not lowercase.** `Cl` closes into a `d` at small sizes and quick
  glances. It is a pattern-matching problem, not a drawing problem, and caps
  are the fix: an `L` has a foot and cannot close a bowl.

## Optical centre (`optical-centre.html`)

Serve the site and open `/prototype2/brand/optical-centre.html`.

The wordmark's SVG box is taller than its caps, because the tittles sit above
them. Two wrong answers follow from that:

- Centring the **box** drops the letters visibly low.
- Centring the **cap band** overcorrects — the tittles put ink above the caps,
  which lifts the wordmark's centre of mass, so the name reads a hair high.
  Reviewers caught exactly this.

The tool rasterises both marks, takes the alpha-weighted vertical centroid of
each, and reports the `translateY` multiplier that puts the wordmark's centre
of ink on the mark's. The current value in `redesign.css` is **-0.074**.

**Re-run it whenever** the tittle geometry changes (`dot_scale`, `dot_gap`),
the mark changes, or the lockup ratio changes. The constant is measured for one
specific pair — it is not a universal nudge.

## Lockup

The mark sits at **2.04&times;** the wordmark's cap height. Below ~1.6&times; it
goes subordinate; above ~2.4&times; it towers over the caps. The 0.04 carries the
4-unit bleed the mark's viewBox adds on each side — without that bleed the
geometry sits flush to the edge, antialiasing has nowhere to blend, and the
curves render clipped.

Size from `--wm-cap` (the cap height), never from box height: the box moves
whenever the tittle geometry does, and sizing off it would silently resize the
letters.
