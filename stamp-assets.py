#!/usr/bin/env python3
"""Version the stylesheet and script links by their content (#75).

GitHub Pages serves every file with cache-control: max-age=600 and the
pages link redesign.css and js/redesign.js at fixed URLs, so after a deploy
a browser can pair the new page with the old stylesheet -- and some hold it
longer than that (DuckDuckGo on iPhone did, after #74). Each link carries
?v=<first 10 hex of the file's SHA-1>, so a changed file is a new URL and
an unchanged one keeps its cache.

    python3 stamp-assets.py          # rewrite the stamps
    python3 stamp-assets.py --check  # exit 1 if any stamp is stale (CI)

Run it after editing redesign.css or js/redesign.js, and commit the pages
it touches with the change.
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ["redesign.css", "js/redesign.js"]
# Every page that links them, including the parked Start page.
PAGES = sorted(
    p for p in ROOT.glob("**/index.html")
    if not p.relative_to(ROOT).parts[0] in {"prototype2", "docs", ".git"}
)


def digest(asset: str) -> str:
    return hashlib.sha1((ROOT / asset).read_bytes()).hexdigest()[:10]


def main() -> int:
    check = "--check" in sys.argv[1:]
    stamps = {asset: digest(asset) for asset in ASSETS}
    stale: list[str] = []
    for page in PAGES:
        text = page.read_text(encoding="utf-8")
        updated = text
        for asset, stamp in stamps.items():
            pattern = re.compile(r'(["\'])/' + re.escape(asset) + r'(?:\?v=[0-9a-f]*)?\1')
            updated = pattern.sub(lambda m: f"{m.group(1)}/{asset}?v={stamp}{m.group(1)}", updated)
        if updated != text:
            stale.append(str(page.relative_to(ROOT)))
            if not check:
                page.write_text(updated, encoding="utf-8")

    if check:
        if stale:
            print("Stale asset stamps -- run python3 stamp-assets.py:\n  " + "\n  ".join(stale))
            return 1
        print(f"Asset stamps current ({', '.join(f'{a}?v={s}' for a, s in stamps.items())}).")
        return 0
    print(f"Stamped {len(stale)} page(s): " + ", ".join(f"{a}?v={s}" for a, s in stamps.items()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
