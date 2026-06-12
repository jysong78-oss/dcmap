import re, json
with open('extracted_dc_data.js', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('const OLD_DC_DATA = ', '').strip().rstrip(';')
text = re.sub(r'([{,])\s*([a-zA-Z0-9_]+)\s*:', r'\1"\2":', text)
data = json.loads(text)
print('Loaded', len(data), 'items')
with open('old_dc.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)
