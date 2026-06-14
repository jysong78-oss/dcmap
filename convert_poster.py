from PIL import Image
import os

src = "C:/Users/jyson/OneDrive/Desktop/AI Tool 개발/claude_code_project/dcmap_backup_extracted/GridX_Poster.png"
dst = "C:/Users/jyson/OneDrive/Desktop/AI Tool 개발/claude_code_project/dcmap_backup_extracted/GridX_Poster.webp"

img = Image.open(src)
img.save(dst, "WEBP", quality=20, method=6)

src_kb = os.path.getsize(src) / 1024
dst_kb = os.path.getsize(dst) / 1024
print(f"PNG: {src_kb:.1f} KB  ->  WebP: {dst_kb:.1f} KB  ({100 - dst_kb/src_kb*100:.1f}% 절감)")
