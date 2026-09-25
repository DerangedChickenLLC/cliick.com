#!/usr/bin/env python3
"""Stamp the shared footer, and the synced legal text, into the pages.

partials/footer.html is the one footer. Each page carries a copy between
<!-- FOOTER_START --> and <!-- FOOTER_END -->; edit the partial, run this,
commit the result. Links in the footer are root-absolute, so every page
gets the same text.

Terms and Privacy carry their policy text between <!-- LEGAL_START --> and
<!-- LEGAL_END --> (#78). The text is synced from the Documents repo into
terms/tos.html and privacy/privacy.html by sync-documents.sh, which runs
this afterwards. It used to be fetched by a script at view time, so anything
reading the page without JavaScript saw only "Loading...". Headings step
down a level on the way in: the fragment uses <h1> per section, and the page
already has one.

Start a Cliick (start/) is not listed: it is parked, and its footer is the
shared one plus a "Start a Cliick" link. When it ships, add that link to
the partial and start/index.html to PAGES.
"""

from __future__ import annotations

import html
import re
from pathlib import Path

START_MARKER = "<!-- FOOTER_START -->"
END_MARKER = "<!-- FOOTER_END -->"

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
]


LEGAL = [
    ("terms/index.html", "terms/tos.html"),
    ("privacy/index.html", "privacy/privacy.html"),
]
LEGAL_START = "<!-- LEGAL_START -->"
LEGAL_END = "<!-- LEGAL_END -->"
HEADING = re.compile(r"<h([1-5])((?:\s[^>]*)?)>(.*?)</h\1>", re.S | re.I)
ID_ATTR = re.compile(r'\sid="([^"]*)"')


def replace_between_markers(
    text: str, replacement: str, path: Path,
    start_marker: str = START_MARKER, end_marker: str = END_MARKER,
) -> str:
    start = text.find(start_marker)
    end = text.find(end_marker)
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"{path}: missing or misordered {start_marker} markers")
    return text[:start] + replacement + text[end + len(end_marker):]


def step_down_headings(fragment: str) -> str:
    """h1-h5 become h2-h6, keeping the id; the heading's text only, since the
    fragment wraps it in <strong> and the heading style carries the weight."""

    def one(m: re.Match) -> str:
        level = int(m.group(1)) + 1
        found = ID_ATTR.search(m.group(2) or "")
        id_attr = f' id="{found.group(1)}"' if found else ""
        text = html.unescape(re.sub(r"<[^>]+>", "", m.group(3))).strip()
        return f"<h{level}{id_attr}>{html.escape(text, quote=False)}</h{level}>"

    return HEADING.sub(one, fragment)


def main() -> int:
    root = Path(__file__).resolve().parent
    partial = (root / "partials" / "footer.html").read_text(encoding="utf-8").strip()

    changed = 0
    for page in PAGES:
        path = root / page
        original = path.read_text(encoding="utf-8")
        updated = replace_between_markers(original, partial, path)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    for page, source in LEGAL:
        path = root / page
        body = step_down_headings((root / source).read_text(encoding="utf-8").strip())
        block = f"{LEGAL_START}\n{body}\n{LEGAL_END}"
        original = path.read_text(encoding="utf-8")
        updated = replace_between_markers(original, block, path, LEGAL_START, LEGAL_END)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
