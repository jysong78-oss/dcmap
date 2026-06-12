import re
with open('GlobalnDC_v2.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

colors = re.findall(r'const\s+regionColors\s*=\s*\{([^}]+)\}', text)
if colors:
    print('regionColors:', colors[0])

colors2 = re.findall(r'const\s+colorMap\s*=\s*\{([^}]+)\}', text)
if colors2:
    print('colorMap:', colors2[0])

# Just dump all hex colors and their preceding 20 chars
for match in re.finditer(r'.{0,30}#[0-9a-fA-F]{6}', text):
    print(match.group(0))
