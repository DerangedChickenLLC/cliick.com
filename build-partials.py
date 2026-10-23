#!/usr/bin/env python3
"""Stamp the shared nav and footer into every live page.

partials/nav.html and partials/footer.html are the one nav and the one
footer. Each page carries a copy between <!-- NAV_START --> / <!-- NAV_END -->
and <!-- FOOTER_START --> / <!-- FOOTER_END -->; edit a partial, run this,
commit the result. Links are root-absolute, so every page gets the same text.

The nav marks the page you're on: the link whose href matches the page's URL
gets aria-current="page" (NAV_CURRENT below). Pages outside the nav (support,
legal, get) get no marker.

Start a Cliick (start/) is not listed: it is parked, and its footer is the
shared one plus a "Start a Cliick" link. When it ships, add that link to
the partial and start/index.html to PAGES.
"""

from __future__ import annotations

from pathlib import Path

PAGES = [
    "index.html",
    "about/index.html",
    "membership/index.html",
    "faq/index.html",
    "get/index.html",
    "support/index.html",
    "deleteme/index.html",
    "terms/index.html",
    "privacy/index.html",
    "social-media-is-dead/index.html",
]

# Page -> the footer's headline, where a page says it in its own words.
# Everything else in the footer stays shared.
FOOTER_HEADING = {
    "social-media-is-dead/index.html": "Download Cliick. Bring your peeps.",
}

# Page -> the nav link that is "this page".
NAV_CURRENT = {
    "index.html": "/",
    "about/index.html": "/about/",
    "membership/index.html": "/membership/",
    "faq/index.html": "/faq/",
}


def replace_between_markers(text: str, name: str, replacement: str, path: Path) -> str:
    start_marker, end_marker = f"<!-- {name}_START -->", f"<!-- {name}_END -->"
    start = text.find(start_marker)
    end = text.find(end_marker)
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"{path}: missing or misordered {name.lower()} markers")
    return text[:start] + replacement + text[end + len(end_marker):]


def nav_for(page: str, nav: str) -> str:
    href = NAV_CURRENT.get(page)
    if href is None:
        return nav
    link = f'<a href="{href}">'
    if nav.count(link) != 1:
        raise ValueError(f"nav partial: expected one {link} for {page}")
    return nav.replace(link, f'<a href="{href}" aria-current="page">')


def footer_for(page: str, footer: str) -> str:
    heading = FOOTER_HEADING.get(page)
    if heading is None:
        return footer
    default = "<h2>Join the Reset</h2>"
    if footer.count(default) != 1:
        raise ValueError(f"footer partial: expected one {default} for {page}")
    return footer.replace(default, f"<h2>{heading}</h2>")


def main() -> int:
    root = Path(__file__).resolve().parent
    nav = (root / "partials" / "nav.html").read_text(encoding="utf-8").strip()
    footer = (root / "partials" / "footer.html").read_text(encoding="utf-8").strip()

    changed = 0
    for page in PAGES:
        path = root / page
        original = path.read_text(encoding="utf-8")
        updated = replace_between_markers(original, "NAV", nav_for(page, nav), path)
        updated = replace_between_markers(updated, "FOOTER", footer_for(page, footer), path)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
