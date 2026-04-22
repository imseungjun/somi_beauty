"""검은 단색 배경 캐릭터 PNG → 투명 배경. Pillow floodfill(빠른 C 구현) 사용."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw

# 대화/에셋에서 내려받은 원본(있으면 복사)
RAW_CANDIDATES = [
    Path(
        r"C:\Users\Administrator\.cursor\projects\c-Users-Administrator-Desktop-COOT-Ai\assets"
        r"\c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_7e73edef76f71bfb518e06c732fe7cd3_images_"
        r"ChatGPT_Image_2026__4__22_____04_11_48-2c576dcc-3514-45d7-875d-bb0f3bac9675.png"
    ),
]


def _dark_corner_px(px: tuple[int, ...], *, b_max: int = 50, sum_max: int = 3 * 45) -> bool:
    r, g, b = int(px[0]), int(px[1]), int(px[2])
    a = 255 if len(px) < 4 else int(px[3])
    return a > 0 and (r + g + b) < sum_max and max(r, g, b) < b_max


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out = root / "public" / "images" / "character-somi.png"
    for raw in RAW_CANDIDATES:
        if raw.is_file():
            shutil.copy2(raw, out)
            break
    if not out.is_file():
        raise SystemExit(f"원본이 없습니다: {out}")

    im = Image.open(out).convert("RGBA")
    w, h = im.size
    fill: tuple[int, int, int, int] = (0, 0, 0, 0)
    thresh = 32
    for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if _dark_corner_px(im.getpixel(xy)):
            ImageDraw.floodfill(im, xy, fill, thresh=thresh)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, optimize=True)


if __name__ == "__main__":
    main()
