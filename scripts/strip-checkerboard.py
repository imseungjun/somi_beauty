"""Remove checkerboard / flat neutral background from mascot PNG via flood-fill from edges."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def flood_transparent(rgba: np.ndarray, sx: int, sy: int, tol: int) -> None:
    h, w = rgba.shape[:2]
    if not (0 <= sx < w and 0 <= sy < h):
        return
    target = rgba[sy, sx, :3].astype(np.int16)
    seen = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque([(sx, sy)])
    while q:
        x, y = q.popleft()
        if seen[y, x]:
            continue
        seen[y, x] = True
        p = rgba[y, x, :3].astype(np.int16)
        if int(np.sum(np.abs(p - target))) > tol:
            continue
        rgba[y, x, 3] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny, nx]:
                q.append((nx, ny))


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / "public" / "images" / "character-somi.png"
    img = Image.open(path).convert("RGBA")
    a = np.array(img)
    h, w = a.shape[:2]
    tol = 64
    seeds: set[tuple[int, int]] = {(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1)}
    step = max(1, w // 24)
    for x in range(0, w, step):
        seeds.add((x, 0))
        seeds.add((x, h - 1))
    step_y = max(1, h // 24)
    for y in range(0, h, step_y):
        seeds.add((0, y))
        seeds.add((w - 1, y))

    for sx, sy in seeds:
        flood_transparent(a, sx, sy, tol)

    Image.fromarray(a).save(path, optimize=True)


if __name__ == "__main__":
    main()
