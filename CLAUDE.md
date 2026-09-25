# cliick.com — Marketing Website

## Purpose

Static marketing website for Cliick, hosted on GitHub Pages at cliick.com
(the repo root is the web root; `_config.yml` keeps non-pages out of the
build). The redesign went live in #76; it was previewed at `/prototype2/`,
which now only holds redirect pages to the live URLs.

## Structure

- `index.html` — Home (pinned scroll scenes in wide windows, stacked on phones)
- `about/`, `membership/`, `faq/` — Subpages
- `terms/`, `privacy/` — Wrappers that fetch the synced legal bodies
  (`terms/tos.html`, `privacy/privacy.html`)
- `support/`, `deleteme/` — Support form (mailto) and account-deletion policy
- `get/` — The footer QR's target: sends iPhone/iPad to the App Store and
  Android to Google Play before paint; anything else sees both badges
- `start/` — Start a Cliick, parked: excluded from the build, no links to it
- `redesign.css`, `js/redesign.js` — The one stylesheet and the one script
- `images/` — Site images (`images/redesign/` for the redesign's assets)
- `partials/footer.html` — The shared footer
- `docs/` — Working notes (go-live list, layout plan, punch list, brand lab);
  excluded from the build
- `prototype2/` — Redirect pages only

URLs that must never change: `/terms/`, `/privacy/` (store listings),
`/support/`, `/deleteme/` (App Store / Google Play).

## Build & Sync

| Task | Command |
|------|---------|
| Stamp the shared footer into every page | `python3 build-partials.py` |
| Re-version the stylesheet/script links after editing either | `python3 stamp-assets.py` |
| Sync legal docs from the Documents repo | `./sync-documents.sh` |
| Sync logos | `./sync-logos.sh` |

Commit and push to deploy (GitHub Pages builds main). The Asset stamps
workflow fails a PR whose stylesheet/script stamps are stale.

## Anti-Patterns

- Never edit footer HTML in individual page files — edit `partials/footer.html`
  and run `python3 build-partials.py`
- Never edit `redesign.css` or `js/redesign.js` without running
  `python3 stamp-assets.py` — browsers keep the old copy otherwise (#75)
- Never edit legal docs here directly — they are synced from the Documents
  repo. Edit them there and run `./sync-documents.sh`
- Never add a working file (notes, scripts, review pages) outside `docs/`
  without adding it to `_config.yml` — every tracked file is public otherwise
