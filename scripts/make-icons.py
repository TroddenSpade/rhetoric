#!/usr/bin/env python3
"""Generate the PWA PNG icons from the Rhetoric seal.

Run from the project root:
    python3 scripts/make-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "public" / "icons"
ICONS.mkdir(parents=True, exist_ok=True)

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
INK = (32, 39, 51)
INK_DEEP = (22, 27, 35)
PAPER = (246, 241, 231)
GOLD = (199, 164, 91)
VERMILION = (178, 58, 32)


def seal(size: int, maskable: bool = False, rounded: bool = True) -> Image.Image:
    scale = 4
    side = size * scale
    image = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    radius = int(side * 0.2) if rounded and not maskable else 0
    draw.rounded_rectangle((0, 0, side, side), radius=radius, fill=INK)

    # Soft vertical gradient, clipped to the rounded background so the corners
    # stay transparent on the standard (non-maskable) icons.
    overlay = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for index in range(24):
        y = int(side * index / 24)
        alpha = int(46 * (1 - index / 24))
        overlay_draw.rectangle(
            (0, y, side, int(side * (index + 1) / 24)),
            fill=(*INK_DEEP, alpha),
        )
    clip = Image.new("L", (side, side), 0)
    ImageDraw.Draw(clip).rounded_rectangle((0, 0, side, side), radius=radius, fill=255)
    overlay.putalpha(Image.composite(overlay.getchannel("A"), Image.new("L", (side, side), 0), clip))
    image = Image.alpha_composite(image, overlay)
    draw = ImageDraw.Draw(image)

    # Scale the seal down for a maskable icon so it survives a circular crop.
    inset = int(side * 0.2) if maskable else int(side * 0.12)
    cx, cy = side / 2, side / 2
    outer = side / 2 - inset
    inner = outer * 0.82

    draw.ellipse(
        (cx - outer, cy - outer, cx + outer, cy + outer),
        outline=(*GOLD, 214),
        width=max(2, int(side * 0.017)),
    )
    draw.ellipse(
        (cx - inner, cy - inner, cx + inner, cy + inner),
        outline=(*GOLD, 110),
        width=max(1, int(side * 0.006)),
    )

    font_size = int(side * 0.5) if not maskable else int(side * 0.42)
    font = ImageFont.truetype(FONT_PATH, font_size)
    draw.text((cx, cy + side * 0.015), "R", font=font, fill=PAPER, anchor="mm")

    # Quill nib at the upper right.
    nib = int(side * 0.11)
    x0, y0 = cx + outer * 0.38, cy - outer * 0.42
    draw.line(
        (x0 - nib * 0.6, y0 + nib * 0.6, x0, y0),
        fill=(*GOLD, 190),
        width=max(2, int(side * 0.014)),
    )
    draw.polygon(
        (
            (x0, y0),
            (x0 + nib * 0.52, y0 - nib * 0.18),
            (x0 + nib * 0.2, y0 + nib * 0.42),
        ),
        fill=VERMILION,
    )

    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    for size in (192, 512):
        seal(size).save(ICONS / f"icon-{size}.png", optimize=True)
    seal(512, maskable=True).save(ICONS / "icon-maskable-512.png", optimize=True)
    # iOS applies its own mask, so this one should be full-bleed, not rounded.
    seal(180, rounded=False).save(ICONS / "apple-touch-icon.png", optimize=True)
    print("wrote icons:", ", ".join(sorted(path.name for path in ICONS.glob("*.png"))))


if __name__ == "__main__":
    main()
