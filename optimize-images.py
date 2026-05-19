#!/usr/bin/env python3
"""
Portfolio Image Optimizer
=========================
Run from your Angular project root:
    python optimize-images.py

What it does:
  • Resizes each image to 2× its actual display size (Retina-ready but not wasteful)
  • Converts PNG → WebP (90% smaller on average)
  • Keeps originals intact — writes .webp siblings alongside the source
  • Prints a before/after size report

After running:
  • Update your Angular HTML to use the .webp paths (see USAGE NOTE below)
  • OR drop in a <picture> element with the webp as <source> and png as fallback
"""

from PIL import Image
from pathlib import Path
import os

# ─────────────────────────────────────────────────────────────
# DISPLAY DIMENSIONS (measured from Lighthouse / DevTools)
# Key: relative path from src/assets/images/
# Value: (max_display_width, max_display_height) in CSS px
#        — script will render at 2× for Retina (device pixel ratio = 2)
# ─────────────────────────────────────────────────────────────
TARGET_SIZES = {
    # Project carousel / overlay thumbnails — sized for fullscreen lightbox
    "pathfinder-1.png":       (1800, 1100),
    "pathfinder-2.png":       (1800, 1100),
    "pathfinder-3.jpg":       (1600, 800),
    "dropify-1.png":          (1600, 1000),
    "dropify-2.png":          (1600, 1000),
    "dropify-3.png":          (1500, 700),
    "einsteins-art-1.png":    (1700, 1000),
    "einsteins-art-2.png":    (1500, 1000),
    "einsteins-art-3.png":    (1800, 900),
    "symposium-1.png":        (1600, 1000),
    "symposium-2.png":        (1600, 1000),
    "symposium-3.png":        (1600, 1000),

    # Newly added project screenshots — keep near source res so UI text stays readable
    "monsoon-ai-1.png":       (1600, 1000),
    "monsoon-ai-2.png":       (1600, 1000),
    "monsoon-ai-3.png":       (1600, 1000),
    "taripa-1.png":           (1600, 1000),
    "taripa-2.png":           (1600, 1000),
    "taripa-3.png":           (1600, 1000),
    "just-coffee-1.png":      (1800, 1000),
    "just-coffee-2.png":      (1800, 1000),
    "just-coffee-3.png":      (1800, 1000),
    "cut-the-cord-1.png":     (1600, 1000),
    "cut-the-cord-2.png":     (1600, 1000),
    "cut-the-cord-3.png":     (1600, 1000),

    # Travel Atelier project shots
    "travel-atelier-1.png":   (2000, 1100),
    "travel-atelier-2.png":   (2000, 1100),
    "travel-atelier-3.png":   (2000, 1600),

    # Profile / avatar images
    "profile.png":            (610, 610),   # was 609×607   →   243 KiB  (LCP element)
    "profile-about.jpg":      (360, 360),   # was 608×607   →    57 KiB

    # Testimonial avatars (displayed 44×49 → 2× = 88×98)
    "testimonial-samantha.png": (100, 100), # was 298×299   →   201 KiB
    "testimonial-louiery.jpg":  (100, 100),
    "testimonial-prof.jpg":     (100, 100),
}

# WebP quality (0–100). 82 gives excellent quality at ~20% of PNG size.
WEBP_QUALITY = 82

# Path to your Angular assets/images folder
ASSETS_DIR = Path("src/assets/images")


def human_size(n: int) -> str:
    """Return human-readable file size."""
    for unit in ("B", "KiB", "MiB"):
        if n < 1024:
            return f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} GiB"


def optimize(src_path: Path, max_w: int, max_h: int) -> None:
    """Resize + convert one image to WebP."""
    out_path = src_path.with_suffix(".webp")

    before = src_path.stat().st_size
    img = Image.open(src_path).convert("RGBA")

    # Only downscale — never upscale
    img.thumbnail((max_w, max_h), Image.LANCZOS)

    # WebP does not support RGBA for lossy; convert to RGB (no visible loss for photos)
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, (9, 9, 15))  # match --bg color
        background.paste(img, mask=img.split()[-1])
        img = background

    img.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
    after = out_path.stat().st_size

    saving = (1 - after / before) * 100
    print(f"  {src_path.name:<35} {human_size(before):>10} → {human_size(after):>9}  ({saving:.0f}% smaller)")


def main():
    if not ASSETS_DIR.exists():
        print(f"[ERROR] Could not find: {ASSETS_DIR}")
        print("Make sure you're running this from your Angular project root (e.g. the folder containing 'src/').")
        return

    print(f"\nOptimizing images in {ASSETS_DIR.resolve()}\n")
    print(f"  {'File':<35} {'Before':>10}   {'After':>9}  Savings")
    print("  " + "─" * 70)

    total_before = 0
    total_after  = 0

    for filename, (max_w, max_h) in TARGET_SIZES.items():
        src = ASSETS_DIR / filename
        if not src.exists():
            print(f"  {filename:<35} [SKIPPED — not found]")
            continue

        optimize(src, max_w, max_h)

        before = src.stat().st_size
        after  = (src.with_suffix(".webp")).stat().st_size
        total_before += before
        total_after  += after

    print("  " + "─" * 70)
    saving = (1 - total_after / total_before) * 100 if total_before else 0
    print(f"  {'TOTAL':<35} {human_size(total_before):>10} → {human_size(total_after):>9}  ({saving:.0f}% smaller)\n")

    print("Next steps:")
    print("  1. Update your Angular HTML to reference .webp instead of .png/.jpg")
    print("     Example: src='assets/images/profile.webp'")
    print("  2. For the logo, also replace logo-dark.png → logo-dark.webp")
    print("  3. Add fetchpriority='high' to the profile image (see index.html changes)")
    print("  4. See updated component HTML files for all other image references\n")


if __name__ == "__main__":
    main()