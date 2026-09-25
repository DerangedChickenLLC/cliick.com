# Go-live record and what is still open

The redesign replaced the root site in #76 (2026-09-25). This file was the
list of what had to be true first; it is now the record of how that was
done and the list of what is still standing in for the real thing.

Kept out of the web root by `_config.yml` (`docs/`).

## Done at go-live (#76)

- **Layout pass (#48):** one portrait/landscape rule (#54), landscape scales
  with the window (#55), Home's scenes in every landscape window (#56) and in
  wide portrait (#66), portrait tidy (#57), Terms overflow (#58), slim phone
  nav (#70), About's pinned photo/ledger column (#68), spacing and marks (#72).
  Checked in real iOS Safari as well as Chrome and WebKit.
- **Paths:** `prototype2/` moved to the root; 230 `/prototype2/` references
  rewritten by script. Every old `/prototype2/…` address is a redirect page.
- **URLs kept:** `/terms/`, `/privacy/` (store listings), `/support/`,
  `/deleteme/` (App Store / Google Play). `terms/tos.html` and
  `privacy/privacy.html` stay where `sync-documents.sh` writes them.
- **Retired:** `/prototype/`, the old `styles.css`, the old home, terms,
  privacy, support and deleteme pages.
- **Indexing:** `noindex` removed from the eight real pages; kept on `/get/`
  (the QR router) and the parked Start page.
- **One footer:** `partials/footer.html` stamped into every page by
  `build-partials.py`.
- **Versioned assets (#75):** `stamp-assets.py` + the Asset stamps workflow.
- **App screens (#63):** real app stills, film labels off.
- **Footer names the LLC:** "© Deranged Chicken LLC" (Apple's seller-name
  conversion is pending; keep it).

## Still open

- **Start a Cliick is out of the live cut (#46).** `start/` is excluded in
  `_config.yml` and nothing links to it. When it ships: restore the nav CTA,
  the footer link (add it to `partials/footer.html`, add `start/index.html`
  to `build-partials.py`), the scene links on Home, and drop the exclude.
- **Founders' signatures on About** are the Caveat webfont. Accepted for
  launch (John, 2026-09-25); real signatures are still the intent.
- **`hero-bg-sim.svg` is a simulation** of the aurora photograph, and it is
  the backdrop of every page.
- **App screens are January 2026 stills.** The demo cast and scripted capture
  is #64; films replace the stills later.
- **Open Graph images:** every page shares the app icon as `og:image`, so a
  shared link previews as a small square. A 1200x630 card per page is an
  asset job.
- **Store badges:** confirm these are the final approved assets.
- **Intermittent Safari nav displacement:** reported, never reproduced; the
  nav is unconditionally `position: fixed` now. Watch for it.
- **Backdrop tint exploration** is parked in `PUNCHLIST.md`.
