"""Generate small hover-preview thumbs for each project's first image."""
from PIL import Image
from pathlib import Path

# (source_filename, thumb_filename)
PAIRS = [
    ("pathfinder-1.png",   "pathfinder-1-thumb.webp"),
    ("symposium-1.png",    "symposium-1-thumb.webp"),
    ("travel-atelier-1.png","travel-atelier-1-thumb.webp"),
    ("dropify-1.png",      "dropify-1-thumb.webp"),
    ("einsteins-art-1.png","einsteins-art-1-thumb.webp"),
    ("monsoon-ai-1.png",   "monsoon-ai-1-thumb.webp"),
    ("taripa-1.png",       "taripa-1-thumb.webp"),
    ("just-coffee-1.png",  "just-coffee-1-thumb.webp"),
    ("cut-the-cord-1.png", "cut-the-cord-1-thumb.webp"),
]

SIZE = (500, 320)  # hover preview is ~280px wide; 500 covers retina

assets = Path("src/assets/images")
for src_name, out_name in PAIRS:
    src = assets / src_name
    if not src.exists():
        print(f"[SKIP] {src_name} not found")
        continue
    img = Image.open(src).convert("RGBA")
    img.thumbnail(SIZE, Image.LANCZOS)
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (9, 9, 15))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    out = assets / out_name
    img.save(out, "WEBP", quality=82, method=6)
    print(f"{src_name:25} -> {out_name:30} ({out.stat().st_size//1024} KiB)")
