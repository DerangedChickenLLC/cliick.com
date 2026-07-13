#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


def render_footer(partial_text: str, base: str) -> str:
    return partial_text.replace("{{BASE}}", base)


def replace_between_markers(text: str, replacement: str, marker_prefix: str) -> str:
    start_marker = f"<!-- {marker_prefix}_START -->"
    end_marker = f"<!-- {marker_prefix}_END -->"

    start_index = text.find(start_marker)
    end_index = text.find(end_marker)

    if start_index == -1 or end_index == -1 or end_index < start_index:
        raise ValueError(f"Missing or misordered {marker_prefix} markers")

    end_index_inclusive = end_index + len(end_marker)
    return text[:start_index] + replacement + text[end_index_inclusive:]


def main() -> int:
    repo_root = Path(__file__).resolve().parent

    # Legacy footer (legal/support pages) and redesign footer (issue #3 pages)
    # live side by side while the redesign is prototyped. Redesign pages use
    # root-absolute links, so no {{BASE}} substitution is needed for them.
    jobs: list[tuple[Path, str, Path, str]] = [
        (repo_root / "support" / "index.html", "../", repo_root / "partials" / "footer.html", "FOOTER"),
        (repo_root / "privacy" / "index.html", "../", repo_root / "partials" / "footer.html", "FOOTER"),
        (repo_root / "terms" / "index.html", "../", repo_root / "partials" / "footer.html", "FOOTER"),
        (repo_root / "deleteme" / "index.html", "../", repo_root / "partials" / "footer.html", "FOOTER"),
        (repo_root / "index.html", "./", repo_root / "partials" / "footer-v2.html", "FOOTER_V2"),
        (repo_root / "about" / "index.html", "../", repo_root / "partials" / "footer-v2.html", "FOOTER_V2"),
        (repo_root / "membership" / "index.html", "../", repo_root / "partials" / "footer-v2.html", "FOOTER_V2"),
        (repo_root / "faq" / "index.html", "../", repo_root / "partials" / "footer-v2.html", "FOOTER_V2"),
    ]

    changed = 0
    for path, base, partial_path, marker_prefix in jobs:
        partial_text = partial_path.read_text(encoding="utf-8")
        original = path.read_text(encoding="utf-8")
        rendered = render_footer(partial_text, base)
        updated = replace_between_markers(original, rendered.rstrip("\n"), marker_prefix)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
