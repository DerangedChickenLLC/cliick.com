#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


def render_footer(partial_text: str, base: str) -> str:
    return partial_text.replace("{{BASE}}", base)


def replace_between_markers(text: str, replacement: str) -> str:
    start_marker = "<!-- FOOTER_START -->"
    end_marker = "<!-- FOOTER_END -->"

    start_index = text.find(start_marker)
    end_index = text.find(end_marker)

    if start_index == -1 or end_index == -1 or end_index < start_index:
        raise ValueError("Missing or misordered FOOTER markers")

    end_index_inclusive = end_index + len(end_marker)
    return text[:start_index] + replacement + text[end_index_inclusive:]


def main() -> int:
    repo_root = Path(__file__).resolve().parent
    partial_path = repo_root / "partials" / "footer.html"
    partial_text = partial_path.read_text(encoding="utf-8")

    targets: list[tuple[Path, str]] = [
        (repo_root / "index.html", "./"),
        (repo_root / "support" / "index.html", "../"),
        (repo_root / "privacy" / "index.html", "../"),
        (repo_root / "terms" / "index.html", "../"),
        (repo_root / "deleteme" / "index.html", "../"),
    ]

    changed = 0
    for path, base in targets:
        original = path.read_text(encoding="utf-8")
        rendered = render_footer(partial_text, base)
        updated = replace_between_markers(original, rendered)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
