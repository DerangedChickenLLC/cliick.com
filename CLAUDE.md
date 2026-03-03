# cliick.com — Marketing Website

## Purpose

Static marketing website for Cliick, hosted on GitHub Pages at cliick.com. Contains landing page, privacy policy, terms of service, and support page.

## Structure

- `index.html` — Main landing page
- `privacy/`, `terms/`, `support/` — Subpages
- `partials/footer.html` — Shared footer partial
- `images/` — Website images
- `styles.css` — Global stylesheet

## Build & Sync

| Task | Command |
|------|---------|
| Sync shared footer across pages | `python3 build-partials.py` |
| Sync legal docs from Documents repo | `./sync-documents.sh` |
| Sync logos from Documents repo | `./sync-logos.sh` |

After editing the footer or syncing docs, commit and push to deploy (GitHub Pages auto-deploys from the repo).

## Anti-Patterns

- Never edit footer HTML in individual page files — edit `partials/footer.html` and run `python3 build-partials.py`
- Never edit legal docs here directly — they are synced from the Documents repo. Edit them there and run `./sync-documents.sh`
