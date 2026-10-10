import json
import re
import os
from urllib.parse import urlparse

CATEGORY_MAP = {
    '타이포그래피': 'Typography',
    '디자인 아카이브': 'Archive & Curation',
    '리소스 & 툴': 'Resource & Tool',
}

raw_items = """
uncut | UNCUT | https://uncut.wtf | 타이포그래피 | 무료 컨템포러리 서체 카탈로그 | 상업적 사용이 가능한 동시대 서체 160여 종을 모은 무료 서체 카탈로그 | 흔한 서체에서 벗어나고 싶을 때 쓸 개성 있는 무료 서체 탐색
footer-design | Footer | https://footer.design | 디자인 아카이브 | 웹사이트 푸터 큐레이션 | 웹사이트 푸터(footer) 디자인만 모아 유형·스타일별로 분류한 갤러리 | 웹사이트 마지막 인상을 정리하는 푸터 레이아웃 패턴
website-headlines | Website Headlines | https://websiteheadlines.com | 디자인 아카이브 | 웹사이트 헤드라인 라이브러리 | SaaS·B2B·DTC 브랜드 웹사이트의 헤드라인 문구를 기법별로 태그해 모은 라이브러리 | 첫 화면 카피를 어떻게 쓸지 막힐 때 참고할 헤드라인 구조
maneken | Maneken | https://maneken.app | 리소스 & 툴 | 브라우저 목업 에디터 | 브라우저에서 바로 쓰는 목업 편집 툴 (무료 플랜 + 유료 Pro) | 완성한 디자인을 실제 매체 위에 빠르게 얹어 보여주는 방식
mockup-world | Mockup World | https://www.mockupworld.co | 리소스 & 툴 | 무료 목업 모음 | 아이폰·맥북·패키지·포스터 등 무료 PSD 목업을 모은 사이트 | 프레젠테이션용 무료 목업 소스
"""

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

    lines = [l.strip() for l in raw_items.strip().split('\n') if l.strip()]
    added = []
    for line in lines:
        parts = [p.strip() for p in line.split('|')]
        pid, ptitle, purl, ptag, pshort, panat, pprinc = parts
        cat = CATEGORY_MAP[ptag]
        item = {
            "id": pid,
            "title": ptitle,
            "url": purl,
            "category": cat,
            "tags": [ptag],
            "shortDesc": pshort,
            "anatomy": panat,
            "principle": pprinc,
            "imageUrl": f"/captures/{pid}.png",
            "videoUrl": f"/videos/{pid}.webm"
        }
        added.append(item)

        # SVG fallback
        svg_path = f"public/captures/{pid}.svg"
        if not os.path.exists(svg_path):
            with open(svg_path, 'w') as sf:
                sf.write(generate_svg(pid, ptitle, cat, [ptag]))
            print(f"Generated fallback SVG for {pid}")

    all_references = existing_references + added
    print(f"Total references after Part 4: {len(all_references)}")

    json_str = json.dumps(all_references, ensure_ascii=False, indent=2)
    lines_json = json_str.split('\n')
    indented_json = '\n'.join('  ' + l if l.strip() not in ('[', ']') else l for l in lines_json)

    new_file_content = f"import {{ Reference }} from '../types';\n\nexport const SEED_REFERENCES: Reference[] = {indented_json};\n"

    with open('lib/data/seed.ts', 'w') as f:
        f.write(new_file_content)

    print("Updated lib/data/seed.ts successfully.")

if __name__ == '__main__':
    main()
