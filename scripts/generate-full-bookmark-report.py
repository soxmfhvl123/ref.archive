import json
import sys
import os
import urllib.parse

sys.path.append(os.getcwd())
from SEED_REFERENCES_CHECK import EXISTING_URLS

with open('./scratch_audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

kept = data['kept']

clean_candidates = []
seen_domains = set()

for item in kept:
    url = item['url']
    title = item['title'] or url

    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.replace('www.', '')
    except Exception:
        domain = url

    if domain in seen_domains or any(domain in existing for existing in EXISTING_URLS):
        continue
    seen_domains.add(domain)

    url_lower = url.lower()
    title_lower = title.lower()

    if any(k in url_lower or k in title_lower for k in ['font', 'type', 'typography', 'foundry']):
        cat = '타이포그래피 & 폰트 파운드리'
    elif any(k in url_lower or k in title_lower for k in ['studio', 'agency', 'design', 'fellow', 'mother', 'biggs', 'jongkim']):
        cat = '그래픽 & 브랜드 디자인 스튜디오'
    elif any(k in url_lower or k in title_lower for k in ['art', 'refik', 'form', 'impossible', 'exhibition', 'museum']):
        cat = '미디어 아트 & 디지털 에디토리얼'
    elif any(k in url_lower or k in title_lower for k in ['material', 'cmf', 'craft', 'interior', 'space', 'architecture']):
        cat = 'CMF & 공간/소재 아카이브'
    elif any(k in url_lower or k in title_lower for k in ['awwwards', 'dev', 'kit', 'code', 'demo', 'motion', 'webgl', 'interactive']):
        cat = '인터랙티브 웹 & UI 라이브러리'
    else:
        cat = '기타 웹 레퍼런스'

    clean_candidates.append({
        'title': title,
        'domain': domain,
        'url': url,
        'category': cat,
    })

print(f"Total Unique New Candidates after deduplication: {len(clean_candidates)}")

with open('./scratch_clean_candidates.json', 'w', encoding='utf-8') as out_f:
    json.dump(clean_candidates, out_f, ensure_ascii=False, indent=2)
