#!/usr/bin/env python3
"""Stamp the synced legal bodies into their pages (#87).

sync-documents.sh converts the Terms and Privacy Policy from the Documents
repo into bare HTML fragments (terms/tos.html, privacy/privacy.html). The
pages used to fetch those fragments at load time, so anything that reads a
page without running its script -- AI fetchers, most crawlers, link
previews, reader modes, curl -- saw only "Loading the Privacy Policy...".

Now each page carries the body between <!-- LEGAL_START --> and
<!-- LEGAL_END -->, the way build-partials.py stamps the footer. The
fragment uses <h1> for every section, which is wrong inside a page that
already has one, so headings step down a level on the way in and lose the
<strong> pandoc wraps them in (the heading style carries the weight). The
fragments are still written and still served, so a direct link keeps
working.

    python3 build-legal.py   # after sync-documents.sh (which calls it)
"""

from __future__ import annotations

import re
from pathlib import Path

START_MARKER = "<!-- LEGAL_START -->"
END_MARKER = "<!-- LEGAL_END -->"

# page -> synced fragment
PAGES = {
    "terms/index.html": "terms/tos.html",
    "privacy/index.html": "privacy/privacy.html",
}

HEADING = re.compile(r"<h([1-5])(\s[^>]*)?>(.*?)</h\1>", re.DOTALL)
TAG = re.compile(r"<[^>]+>")


def demote(fragment: str) -> str:
    def step(m: re.Match[str]) -> str:
        level = int(m.group(1)) + 1
        attrs = m.group(2) or ""
        text = " ".join(TAG.sub("", m.group(3)).split())
        return f"<h{level}{attrs}>{text}</h{level}>"

    return HEADING.sub(step, fragment)


def replace_between_markers(text: str, replacement: str, path: Path) -> str:
    start = text.find(START_MARKER)
    end = text.find(END_MARKER)
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"{path}: missing or misordered legal markers")
    return (
        text[:start]
        + START_MARKER
        + "\n"
        + replacement
        + "\n"
        + text[end:]
    )


def main() -> int:
    root = Path(__file__).resolve().parent
    changed = 0
    for page, fragment in PAGES.items():
        path = root / page
        body = demote((root / fragment).read_text(encoding="utf-8").strip())
        original = path.read_text(encoding="utf-8")
        updated = replace_between_markers(original, body, path)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
