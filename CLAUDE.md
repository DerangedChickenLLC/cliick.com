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

- The home "showcase" uses a stationary-phone effect: each gray window has
  `clip-path` and contains its own `position: fixed` phone copy, so scrolling
  windows sweep over a phone that never moves. Small screens and
  `prefers-reduced-motion` fall back to static phones.
- Phone screens are placeholder stills; swap `<img>` → `<video>` in both the
  fixed and static copies of each window when app screen recordings exist.

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
