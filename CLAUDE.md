# cliick.com — Marketing Website

## Purpose

Static marketing website for Cliick, hosted on GitHub Pages at cliick.com. Contains landing page, privacy policy, terms of service, and support page.

## Structure

- `index.html` — Main landing page (redesign, issue #3)
- `about/`, `membership/`, `faq/` — Redesign subpages (issue #3)
- `privacy/`, `terms/`, `support/`, `deleteme/` — Legal/support subpages (legacy styling)
- `partials/footer.html` — Shared footer partial for legal/support pages
- `partials/footer-v2.html` — Shared footer partial for redesign pages (uses `FOOTER_V2` markers)
- `images/` — Website images (`images/redesign/` holds assets exported from the Figma mocks)
- `styles.css` — Legacy stylesheet (legal/support pages only)
- `redesign.css` — Redesign stylesheet (home/about/membership/faq)
- `js/redesign.js` — FAQ search, plan toggle

### Redesign notes (issue #3)

- The home page opens with a **pinned scene stage**: `.stage-frame` (inside
  `.stage-track#stage`) is `position: sticky` for ~4.5 viewport-heights of
  scroll. `js/redesign.js` maps scroll progress to a scene index (hero → 3
  copy scenes); CSS keyed off `data-scene` + `is-past/is-active/is-future`
  drives all motion — copy enter/exit, screen crossfade, hero-photo and
  gray-window fades — so everything shares one clock and the phone never
  collides with copy (their regions are disjoint by construction).
- Gated by `body.stage-motion` (JS + ≥1200px + motion allowed, re-evaluated
  live on media-query change); otherwise the `.fallback-flow` (normal hero +
  showcase rows with static phones) renders instead. **Hero + section copy
  exists in BOTH the stage scenes and the fallback flow — edit both** until
  the design settles.
- In motion mode the nav rides `position: fixed` with scene-aware skins:
  transparent white-text over the hero (helped by a top scrim on the photo),
  frosted light bar with dark text (`body.nav-solid`) everywhere else. The
  "Welcome to Cliick" header lives in the copy column, below the nav and
  left of the window, so it cannot collide with either at any viewport size.
- Phone screens are placeholder stills; swap the stacked `<img data-screen>`
  elements for `<video>` (or one looped video seeked per scene) when app
  screen recordings exist. Scene boundaries live in `BOUNDS` in redesign.js.
- Two earlier variants are preserved in git: tag `savepoint-porthole-design`
  (clip-path porthole windows) and commit fd52d8f (free-fixed phone + IO).

## Build & Sync

| Task | Command |
|------|---------|
| Sync shared footer across pages | `python3 build-partials.py` |
| Sync legal docs from Documents repo | `./sync-documents.sh` |
| Sync logos from Documents repo | `./sync-logos.sh` |

After editing the footer or syncing docs, commit and push to deploy (GitHub Pages auto-deploys from the repo).

## Anti-Patterns

- Never edit footer HTML in individual page files — edit `partials/footer.html` (legal/support pages) or `partials/footer-v2.html` (redesign pages) and run `python3 build-partials.py`
- Never edit legal docs here directly — they are synced from the Documents repo. Edit them there and run `./sync-documents.sh`
