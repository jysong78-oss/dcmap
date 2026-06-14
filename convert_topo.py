import os

src = "C:/Users/jyson/OneDrive/Desktop/AI Tool 개발/claude_code_project/dcmap_backup_extracted/world_topo.js"
dst = "C:/Users/jyson/OneDrive/Desktop/AI Tool 개발/claude_code_project/dcmap_backup_extracted/world_topo.json"

with open(src, 'r', encoding='utf-8') as f:
    text = f.read()

# strip "const WORLD_TOPO = " prefix and trailing ";"
text = text.strip()
if text.startswith("const WORLD_TOPO ="):
    text = text[len("const WORLD_TOPO ="):].strip()
if text.endswith(";"):
    text = text[:-1].strip()

with open(dst, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"world_topo.js  : {os.path.getsize(src)/1024:.1f} KB")
print(f"world_topo.json: {os.path.getsize(dst)/1024:.1f} KB")
