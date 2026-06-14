import urllib.request
import xml.etree.ElementTree as ET
import json
import datetime
import os
import re

try:
    import feedparser
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False

print("Starting GridX Automated Data Pipeline...")
print(f"  Run time: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")

# ── 1. arXiv 논문 수집 ────────────────────────────────────────────────
print("\n[1/3] Fetching arXiv research papers...")

ARXIV_QUERIES = [
    'all:datacenter+AND+all:energy',
    'all:datacenter+AND+all:cooling',
    'all:datacenter+AND+all:AI',
    'all:datacenter+AND+all:renewable',
]

papers = []
seen_ids = set()

for query in ARXIV_QUERIES:
    url = (
        f'http://export.arxiv.org/api/query'
        f'?search_query={query}'
        f'&start=0&max_results=4'
        f'&sortBy=submittedDate&sortOrder=descending'
    )
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'GridX-Bot/1.0'})
        response = urllib.request.urlopen(req, timeout=20)
        root = ET.fromstring(response.read())
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        for entry in root.findall('atom:entry', ns):
            link = entry.find('atom:id', ns).text.strip()
            if link in seen_ids:
                continue
            seen_ids.add(link)
            title  = entry.find('atom:title', ns).text.replace('\n', ' ').strip()
            pub    = entry.find('atom:published', ns).text.strip()
            summary = entry.find('atom:summary', ns).text.replace('\n', ' ').strip()
            papers.append({
                'title':   title,
                'link':    link,
                'date':    pub[:10],
                'summary': summary[:200] + '...',
                'source':  'arXiv'
            })
        print(f"  Query '{query[:40]}...' OK")
    except Exception as e:
        print(f"  Query error: {e}")

# ── 2. 업계 뉴스 RSS 수집 (feedparser 있을 때) ────────────────────────
if HAS_FEEDPARSER:
    print("\n[2/3] Fetching DC industry news (RSS)...")
    RSS_FEEDS = [
        ('https://www.datacenterdynamics.com/feed/rss/',    'DC Dynamics'),
        ('https://www.datacenterknowledge.com/rss.xml',     'DC Knowledge'),
        ('https://www.theregister.com/data_centre/headlines.atom', 'The Register'),
    ]
    for feed_url, source_name in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            count = 0
            for entry in feed.entries[:4]:
                link = entry.get('link', '')
                if link in seen_ids:
                    continue
                seen_ids.add(link)
                title   = entry.get('title', '').strip()
                pub     = entry.get('published', entry.get('updated', ''))[:10]
                summary = entry.get('summary', entry.get('description', ''))
                # HTML 태그 간단 제거
                summary = re.sub(r'<[^>]+>', '', summary).strip()
                if len(summary) > 200:
                    summary = summary[:200] + '...'
                papers.append({
                    'title':   title,
                    'link':    link,
                    'date':    pub,
                    'summary': summary,
                    'source':  source_name
                })
                count += 1
            print(f"  {source_name}: {count} articles")
        except Exception as e:
            print(f"  {source_name} error: {e}")
else:
    print("\n[2/3] Skipping RSS (feedparser not available)")

# 날짜순 정렬, 최신 15개 유지
papers.sort(key=lambda x: x.get('date', ''), reverse=True)
papers = papers[:15]
print(f"  Total intel items: {len(papers)}")

# ── 3. dc_data.js 읽기 → INTEL_DATA 업데이트 → 쓰기 ─────────────────
print("\n[3/3] Updating dc_data.js...")

dc_data_path = 'dc_data.js'
if not os.path.exists(dc_data_path):
    print(f"ERROR: {dc_data_path} not found. Aborting.")
    exit(1)

content = open(dc_data_path, 'r', encoding='utf-8-sig').read()  # utf-8-sig: BOM 자동 제거

dc_match = re.search(r'const DC_DATA = (\[.*?\]);', content, re.DOTALL)
if not dc_match:
    print("ERROR: Cannot parse DC_DATA in dc_data.js. Aborting.")
    exit(1)

dc_list = json.loads(dc_match.group(1))

# 이전 테스트 항목 제거
dc_list = [d for d in dc_list if not d.get('name', '').startswith('Automated Scrape')]

# BOM 없는 UTF-8로 저장 (개행 LF 고정)
output = (
    'const DC_DATA = '    + json.dumps(dc_list, ensure_ascii=False, separators=(',', ':')) + ';\n\n'
    'const INTEL_DATA = ' + json.dumps(papers,  ensure_ascii=False, separators=(',', ':')) + ';\n'
)

with open(dc_data_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(output)

latest = f"{papers[0]['date']} | {papers[0]['title'][:55]}" if papers else 'N/A'
print(f"  dc_data.js updated: {len(dc_list)} DCs, {len(papers)} intel items")
print(f"  Latest: {latest}")
print("\nPipeline completed successfully!")
