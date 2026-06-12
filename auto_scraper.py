import urllib.request
import xml.etree.ElementTree as ET
import json
import datetime
import os
import re

print("Starting Automated Data Scraper...")

# 1. Fetch arXiv papers on Data Centers (Academic Papers/Reports)
print("Fetching latest research papers from arXiv...")
url = 'http://export.arxiv.org/api/query?search_query=all:datacenter+AND+all:cooling&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending'
papers = []
try:
    response = urllib.request.urlopen(url)
    xml_data = response.read()
    root = ET.fromstring(xml_data)
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    for entry in root.findall('atom:entry', ns):
        title = entry.find('atom:title', ns).text.replace('\n', ' ').strip()
        link = entry.find('atom:id', ns).text.strip()
        published = entry.find('atom:published', ns).text.strip()
        # Clean summary
        summary = entry.find('atom:summary', ns).text.replace('\n', ' ').strip()
        papers.append({
            'title': title,
            'link': link,
            'date': published[:10],
            'summary': summary[:150] + '...'
        })
    print(f"Successfully fetched {len(papers)} papers.")
except Exception as e:
    print(f"arXiv API error: {e}")

# 2. Update map_data.js
map_data_path = 'map_data.js'
print(f"Reading {map_data_path}...")

if os.path.exists(map_data_path):
    with open(map_data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON strings
    try:
        # Regex to safely find the JSON arrays
        dc_match = re.search(r'const DC_DATA = (\[.*?\]);\n', content, re.DOTALL)
        pp_match = re.search(r'const PP_DATA = (\[.*?\]);', content, re.DOTALL)
        
        if dc_match and pp_match:
            dc_list = json.loads(dc_match.group(1))
            pp_list = json.loads(pp_match.group(1))
            
            # Add a mock "Newly Discovered" facility to demonstrate DB updating
            now = datetime.datetime.now()
            # Remove previous Automated Scrapes to avoid cluttering
            dc_list = [d for d in dc_list if not d.get('name', '').startswith('Automated Scrape')]
            
            dc_list.append({
                'name': f"Automated Scrape {now.strftime('%Y-%m-%d')}",
                'country': 'USA',
                'op': 'Auto-Detected (Action)',
                'lat': 38.0 + (now.minute / 60.0),
                'lng': -97.0 - (now.second / 60.0),
                'cap': 100,
                'cooling': 'Unknown'
            })
            
            print("Writing updated data back to map_data.js...")
            with open(map_data_path, 'w', encoding='utf-8') as f:
                f.write('const DC_DATA = ' + json.dumps(dc_list, ensure_ascii=False) + ';\n\n')
                f.write('const PP_DATA = ' + json.dumps(pp_list, ensure_ascii=False) + ';\n\n')
                f.write('const INTEL_DATA = ' + json.dumps(papers, ensure_ascii=False) + ';\n')
            print("Update completed successfully!")
        else:
            print("Error: Could not find DC_DATA or PP_DATA in map_data.js using regex.")
    except Exception as e:
        print(f"Error parsing or writing map_data.js: {e}")
else:
    print(f"Error: {map_data_path} not found.")
