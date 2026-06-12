import json, re
import pandas as pd

# Load existing JS data
with open('map_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const DC_DATA = (\[.*?\]);', text, re.DOTALL)
if not match:
    print("Could not find DC_DATA")
    exit(1)

js_str = match.group(1)
dc_data = json.loads(js_str)

# Load Excel data
df = pd.read_excel('temp_dc_copy.xlsx', sheet_name='📋 전체 목록', header=2)
df = df.dropna(subset=['국가', '운영사', '용량 (MW)'])

# Clean Excel strings
df['국가'] = df['국가'].astype(str).str.strip()
df['운영사'] = df['운영사'].astype(str).str.strip()
# Capacity might be numeric or string
df['용량 (MW)'] = pd.to_numeric(df['용량 (MW)'], errors='coerce')

import re
def get_words(text):
    if pd.isna(text): return set()
    return set(re.findall(r'\w+', str(text).lower()))

unmatched = []
matched_count = 0

for item in dc_data:
    i_name = str(item.get('name', ''))
    i_country = str(item.get('country', ''))
    i_words = get_words(i_name + " " + i_country)
    
    # Calculate overlap score for each row
    best_score = 0
    best_row = None
    
    for idx, row in df.iterrows():
        r_op = str(row['운영사'])
        r_city = str(row['도시/위치'])
        r_country = str(row['국가'])
        
        # Build set of words for this row
        r_words = get_words(r_op + " " + r_city + " " + r_country)
        
        # Calculate Jaccard-like overlap
        overlap = len(i_words.intersection(r_words))
        
        # Also give points if the operator is explicitly in the name
        op_words = get_words(r_op)
        if op_words and op_words.issubset(i_words):
            overlap += 2
            
        if overlap > best_score:
            best_score = overlap
            best_row = row
            
    # Require at least some meaningful overlap
    if best_score >= 2 and best_row is not None:
        matched_count += 1
        item['city'] = str(best_row['도시/위치']) if pd.notna(best_row['도시/위치']) else ''
        item['type'] = str(best_row['유형']) if pd.notna(best_row['유형']) else ''
        item['pue'] = str(best_row['PUE']) if pd.notna(best_row['PUE']) else ''
        item['wue'] = str(best_row['WUE (L/kWh)']) if pd.notna(best_row['WUE (L/kWh)']) else ''
        item['notes'] = str(best_row['비고']) if pd.notna(best_row['비고']) else ''
    else:
        unmatched.append(f"{i_name} ({i_country})")

print(f"Matched {matched_count} out of {len(dc_data)} items.")
if unmatched:
    print(f"Unmatched items ({len(unmatched)}):")
    for u in unmatched[:10]:
        print(" -", u)

# Serialize back
new_js_str = json.dumps(dc_data, indent=2, ensure_ascii=False)
new_text = text[:match.start(1)] + new_js_str + text[match.end(1):]

with open('map_data_merged.js', 'w', encoding='utf-8') as f:
    f.write(new_text)
print("Saved to map_data_merged.js")
