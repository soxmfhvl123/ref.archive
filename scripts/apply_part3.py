import json
import re
import os
from urllib.parse import urlparse

def norm_domain(url):
    return urlparse(url).netloc.lower().replace('www.', '').rstrip('/')

CATEGORY_MAP = {
    '디자인 스튜디오': 'Graphic Design Studio',
    '브랜드 아이덴티티': 'Brand Identity',
    '타이포그래피': 'Typography',
    '에디토리얼 & 출판': 'Editorial & Print',
    '디자인 아카이브': 'Archive & Curation',
    '매거진 & 블로그': 'Magazine & Blog',
    '3D WebGL': 'Interactive Web',
    '인터랙티브 모션': 'Interactive Web',
    '실험적 웹': 'Experimental Web',
    '모션 & 3D': 'Motion & 3D Studio',
    '미디어 아트 & 전시': 'Media Art & Gallery',
    '일러스트 & 아티스트': 'Illustration & Artist',
    '패션 & 컬처': 'Fashion & Culture',
    '디지털 제품 & UI': 'Product & Tech UI',
    '리소스 & 툴': 'Resource & Tool',
    '공간 & 전시 디자인': 'Spatial & Exhibition',
    '오브제 & 아트토이': 'Object & Art Toy',
}

def generate_svg(pid, ptitle, pcat, ptags):
    tag_str = " / ".join(ptags)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#111111"/>
  <rect x="60" y="60" width="1080" height="680" fill="none" stroke="#333333" stroke-width="2" opacity="0.4"/>
  <circle cx="100" cy="100" r="10" fill="#FFFFFF" opacity="0.3"/>
  <circle cx="130" cy="100" r="10" fill="#FFFFFF" opacity="0.3"/>
  <circle cx="160" cy="100" r="10" fill="#FFFFFF" opacity="0.3"/>
  <text x="100" y="360" font-family="-apple-system, sans-serif" font-weight="800" font-size="64" fill="#FFFFFF">{ptitle}</text>
  <text x="100" y="420" font-family="-apple-system, sans-serif" font-weight="400" font-size="28" fill="#AAAAAA">{pcat} · {tag_str}</text>
  <line x1="100" y1="470" x2="400" y2="470" stroke="#FFFFFF" stroke-width="4"/>
  <text x="100" y="680" font-family="monospace" font-size="20" fill="#AAAAAA">ref. archive capture</text>
</svg>'''

def main():
    with open('lib/data/seed.ts') as f:
        content = f.read()

    match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Could not parse SEED_REFERENCES from lib/data/seed.ts")

    existing_references = json.loads(match.group(1))
    print(f"Loaded {len(existing_references)} existing references from seed.ts")

    from parse_part3 import raw_text
    lines = [l.strip() for l in raw_text.strip().split('\n') if l.strip() and not l.strip().startswith('#')]
    print(f"Parsed {len(lines)} Part 3 lines.")

    seen_ids = {x['id'] for x in existing_references}
    seen_domains = {norm_domain(x['url']) for x in existing_references}

    added_items = []
    for line in lines:
        parts = [p.strip() for p in line.split('|')]
        pid, ptitle, purl, ptag, pshort, panat, pprinc = parts
        pdom = norm_domain(purl)

        if pid in seen_ids:
            print(f"Skipping duplicate ID: {pid}")
            continue
        if pdom in seen_domains:
            print(f"Skipping duplicate domain: {pdom} ({pid})")
            continue

        seen_ids.add(pid)
        seen_domains.add(pdom)

        category = CATEGORY_MAP[ptag]
        item = {
            "id": pid,
            "title": ptitle,
            "url": purl,
            "category": category,
            "tags": [ptag],
            "shortDesc": pshort,
            "anatomy": panat,
            "principle": pprinc,
            "imageUrl": f"/captures/{pid}.png",
            "videoUrl": f"/videos/{pid}.webm"
        }
        added_items.append(item)

    print(f"Added {len(added_items)} new Part 3 items.")

    all_references = existing_references + added_items
    print(f"Total references after Part 3: {len(all_references)}")

    json_str = json.dumps(all_references, ensure_ascii=False, indent=2)
    lines_json = json_str.split('\n')
    indented_json = '\n'.join('  ' + l if l.strip() not in ('[', ']') else l for l in lines_json)

    new_file_content = f"import {{ Reference }} from '../types';\n\nexport const SEED_REFERENCES: Reference[] = {indented_json};\n"

    with open('lib/data/seed.ts', 'w') as f:
        f.write(new_file_content)

    print("Successfully updated lib/data/seed.ts")

    # Generate fallback SVGs if missing
    created_svgs = 0
    for ref in all_references:
        svg_path = f"public/captures/{ref['id']}.svg"
        if not os.path.exists(svg_path):
            with open(svg_path, 'w') as f:
                f.write(generate_svg(ref['id'], ref['title'], ref['category'], ref['tags']))
            created_svgs += 1

    print(f"Generated {created_svgs} fallback SVGs.")

if __name__ == '__main__':
    main()
