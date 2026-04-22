"""원본 → rembg + 회색 원형 판/테두리 제거 → public/images/character-somi.png

OpenCV Hough로 원(회색 판)을 잡고, 원본 기준 명도·채도·국소분산으로 판/링만 투명 처리합니다."""
from __future__ import annotations

import os
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import remove
from scipy.ndimage import uniform_filter


def _detect_gray_disc(bgr: np.ndarray) -> tuple[float, float, float] | None:
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    g = cv2.GaussianBlur(g, (5, 5), 0)
    h, w = g.shape
    c = cv2.HoughCircles(
        g,
        cv2.HOUGH_GRADIENT,
        dp=1.1,
        minDist=min(w, h) // 3,
        param1=50,
        param2=22,
        minRadius=30,
        maxRadius=min(w, h) // 2,
    )
    if c is None or len(c[0]) < 1:
        return None
    x, y, rad = c[0][0]
    return float(x), float(y), float(rad)


def _strip_gray_plate(rgba: np.ndarray, orig_bgr: np.ndarray, cx: float, cy: float, R: float) -> np.ndarray:
    orig = cv2.cvtColor(orig_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    Rr, Gg, Bb = orig[:, :, 0], orig[:, :, 1], orig[:, :, 2]
    Y = 0.299 * Rr + 0.587 * Gg + 0.114 * Bb
    ch = np.maximum(np.abs(Rr - Gg), np.maximum(np.abs(Rr - Bb), np.abs(Gg - Bb)))
    k = 5
    m = uniform_filter(Y, k)
    v = uniform_filter(Y * Y, k) - m * m

    a = rgba[:, :, 3] > 5
    h, w = Y.shape
    yy, xx = np.ogrid[:h, :w]
    d = np.hypot(xx - cx, yy - cy)

    kill1 = a & (d < R) & (Y < 242) & (ch < 32) & (v < 50) & ~((Y > 248) & a) & ~(ch > 40)
    kill2 = a & (d >= R - 10) & (d <= R + 9) & (Y < 222) & (ch < 32)
    kill3 = a & (np.abs(d - R) < 7) & (Y < 238) & (ch < 32)
    # 남는 연한 회색 링(저주파·중간 명도)
    kill4 = a & (d < R + 2) & (Y < 250) & (Y > 165) & (ch < 24) & (v < 28)

    killed = kill1 | kill2 | kill3 | kill4
    a2 = rgba.copy()
    a2[killed, 3] = 0
    return a2


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    args = [a for a in sys.argv[1:] if a != "--no-crop"]
    no_crop = "--no-crop" in sys.argv[1:]
    default_src = Path(os.environ.get("SOMI_MASCOT_SRC", "")) if os.environ.get("SOMI_MASCOT_SRC") else None
    if len(args) >= 1 and not args[0].startswith("-"):
        src = Path(args[0])
    elif default_src and default_src.is_file():
        src = default_src
    else:
        src = (
            Path(os.environ.get("USERPROFILE", ""))
            / ".cursor"
            / "projects"
            / "c-Users-Administrator-Desktop-COOT-Ai"
            / "assets"
            / "c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_7e73edef76f71bfb518e06c732fe7cd3_images_image-96abc9e2-2e4f-4689-a11b-74c7e89af95d.png"
        )

    if not src.is_file():
        print("Source not found:", src, file=sys.stderr)
        sys.exit(1)

    out = root / "public" / "images" / "character-somi.png"
    out.parent.mkdir(parents=True, exist_ok=True)

    bgr_full = cv2.imread(str(src))
    if bgr_full is None:
        raw = np.fromfile(str(src), dtype=np.uint8)
        bgr_full = cv2.imdecode(raw, cv2.IMREAD_COLOR)
    if bgr_full is None:
        bgr_full = np.array(Image.open(src).convert("RGB"))[:, :, ::-1]
        bgr_full = np.ascontiguousarray(bgr_full)

    bgr = bgr_full.copy()
    if not no_crop:
        h0, w0 = bgr.shape[:2]
        left, top = int(w0 * 0.04), int(h0 * 0.02)
        right, bottom = int(w0 * 0.97), int(h0 * 0.70)
        bgr = bgr[top:bottom, left:right]

    disc = _detect_gray_disc(bgr)
    if disc is None:
        print("Hough: circle not found, using rembg only", file=sys.stderr)
        img = Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
        r = remove(img)
    else:
        cx, cy, R = disc
        img = Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
        r = remove(img)
        arr = np.array(r, dtype=np.float32)
        arr = _strip_gray_plate(arr, bgr, cx, cy, R)
        r = Image.fromarray(np.uint8(np.clip(arr, 0, 255)))

    a = np.array(r)[:, :, 3]
    bbox = np.argwhere(a > 8)
    if len(bbox):
        y0, x0 = bbox.min(0)
        y1, x1 = bbox.max(0) + 1
        r = r.crop((x0, y0, x1, y1))
    r.save(out, "PNG")
    print("saved", out, "size", r.size)


if __name__ == "__main__":
    main()
