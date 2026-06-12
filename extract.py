import re
with open('GlobalnDC_v2.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find regions colors
rc_match = re.search(r'(const|let|var)\s+(regionColors|colorMap)\s*=\s*(\{.*?\});', text, re.DOTALL | re.IGNORECASE)
if rc_match:
    print('Found region colors:', rc_match.group(3)[:100])
    with open('extracted_colors.txt', 'w', encoding='utf-8') as f:
        f.write(rc_match.group(3))

# find data center array
arrays = re.findall(r'(const|let|var)\s+(\w+)\s*=\s*(\[\s*\{\s*[\'\"]?n[\'\"]?\s*:.*?\].*?);', text, re.DOTALL)
if arrays:
    var_name = arrays[0][1]
    data = arrays[0][2]
    with open('extracted_dc_data.js', 'w', encoding='utf-8') as out:
        out.write('const OLD_DC_DATA = ' + data + ';')
    print(f'Extracted {var_name} to extracted_dc_data.js. Length: {len(data)}')
