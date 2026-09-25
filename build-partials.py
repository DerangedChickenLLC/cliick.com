#!/usr/bin/env python3
"""Stamp the shared footer into every live page.

partials/footer.html is the one footer. Each page carries a copy between
<!-- FOOTER_START --> and <!-- FOOTER_END -->; edit the partial, run this,
commit the result. Links in the footer are root-absolute, so every page
gets the same text.

Start a Cliick (start/) is not listed: it is parked, and its footer is the
shared one plus a "Start a Cliick" link. When it ships, add that link to
the partial and start/index.html to PAGES.
"""

from __future__ import annotations

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


def replace_between_markers(text: str, replacement: str, path: Path) -> str:
    start = text.find(START_MARKER)
    end = text.find(END_MARKER)
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"{path}: missing or misordered footer markers")
    return text[:start] + replacement + text[end + len(END_MARKER):]


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

    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
