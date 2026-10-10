import json
import re
import os
import shutil
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

RENAMES_MAP = {
    'studio-spass': 'studiospass',
    'bureau-borsche': 'bureauborsche',
    'sulki-and-min': 'sulki-min',
    'studio-fnt': 'studiofnt',
    'workroom-press': 'workroom',
    'spin-studio': 'spin',
    'base-design': 'basedesign',
    'lundgren-lindqvist': 'lundgrenlindqvist',
    'porto-rocha': 'portorocha',
    'moving-brands': 'movingbrands',
    'and-walsh': 'andwalsh',
    'manual-creative': 'manual',
    'plus-ex': 'plus-x',
    'fonts-in-use': 'fontsinuse',
    'klim-type-foundry': 'klim',
    'slanted-publishers': 'slanted',
    'apartamento-magazine': 'apartamento',
    'its-nice-that': 'itsnicethat',
    'aiga-eye-on-design': 'eye-on-design',
    'hoverstat-es': 'hoverstates',
    'henry-heffernan': 'henryheffernan',
    'ouiwill': 'oui-will',
    'wild-agency': 'wild-as',
    'camerons-world': 'cameronsworld',
    'new-rafael': 'rafael-rozendaal',
    'buck-design': 'buck',
    'teamlab-art': 'teamlab',
    'uva-studio': 'uva',
    'mmca-go-kr': 'mmca',
    'hvass-and-hannibal': 'hvass-hannibal',
    'dazed-digital': 'dazed',
    'linear-app': 'linear',
    'rauno-me': 'rauno',
    'nothing-tech': 'nothing',
    'spline-design': 'spline',
    'threejs-org': 'threejs',
    'gsap-com': 'gsap',
    'rive-app': 'rive'
}

DISCARDED_IDS = [
    'non-format',
    'two-times-elliott',
    'graphic-mag',
    'cooper-hewitt',
    'tom-haugomat'
]

def main():
    # 1. Read existing seed.ts
    with open('lib/data/seed.ts') as f:
        content = f.read()

    match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Could not parse SEED_REFERENCES from lib/data/seed.ts")

    data = json.loads(match.group(1))
    part1_items = data[:150]
    print(f"Loaded {len(part1_items)} Part 1 references.")

    # 2. Parse Part 2 items
    from parse_part2 import raw_text
    lines = [l.strip() for l in raw_text.strip().split('\n') if l.strip() and not l.strip().startswith('#')]
    print(f"Parsed {len(lines)} Part 2 lines.")

    seen_ids = {x['id'] for x in part1_items}
    seen_domains = {norm_domain(x['url']) for x in part1_items}

    added_items = []
    for line in lines:
        parts = [p.strip() for p in line.split('|')]
        pid, ptitle, purl, ptag, pshort, panat, pprinc = parts
        pdom = norm_domain(purl)

        if pid in seen_ids or pdom in seen_domains:
            print(f"Skipping duplicate: {pid} ({purl})")
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

    print(f"Successfully created {len(added_items)} Part 2 reference objects.")

    all_references = part1_items + added_items
    print(f"Total references: {len(all_references)}")

    # 3. Write new lib/data/seed.ts
    json_str = json.dumps(all_references, ensure_ascii=False, indent=2)
    # Re-indent to match existing file (2-space base indent inside the array)
    lines_json = json_str.split('\n')
    indented_json = '\n'.join('  ' + l if l.strip() not in ('[', ']') else l for l in lines_json)

    new_file_content = f"import {{ Reference }} from '../types';\n\nexport const SEED_REFERENCES: Reference[] = {indented_json};\n"

    with open('lib/data/seed.ts', 'w') as f:
        f.write(new_file_content)

    print("Wrote lib/data/seed.ts successfully.")

    # 4. Migrate media assets for renamed IDs
    for old_id, new_id in RENAMES_MAP.items():
        # PNG
        old_png = f"public/captures/{old_id}.png"
        new_png = f"public/captures/{new_id}.png"
        if os.path.exists(old_png):
            if not os.path.exists(new_png):
                shutil.copy2(old_png, new_png)
            os.remove(old_png)

        # SVG
        old_svg = f"public/captures/{old_id}.svg"
        new_svg = f"public/captures/{new_id}.svg"
        if os.path.exists(old_svg):
            if not os.path.exists(new_svg):
                shutil.copy2(old_svg, new_svg)
            os.remove(old_svg)

        # WEBM
        old_webm = f"public/videos/{old_id}.webm"
        new_webm = f"public/videos/{new_id}.webm"
        if os.path.exists(old_webm):
            if not os.path.exists(new_webm):
                shutil.copy2(old_webm, new_webm)
            os.remove(old_webm)

    print("Migrated renamed asset files.")

    # 5. Clean up discarded draft items assets
    for did in DISCARDED_IDS:
        for ext, folder in [('.png', 'public/captures'), ('.svg', 'public/captures'), ('.webm', 'public/videos')]:
            fpath = f"{folder}/{did}{ext}"
            if os.path.exists(fpath):
                os.remove(fpath)

    print("Cleaned up discarded draft items assets.")

    # 6. Ensure fallback SVG exists for any reference without an SVG
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

    created_svgs = 0
    for ref in all_references:
        svg_path = f"public/captures/{ref['id']}.svg"
        if not os.path.exists(svg_path):
            with open(svg_path, 'w') as f:
                f.write(generate_svg(ref['id'], ref['title'], ref['category'], ref['tags']))
            created_svgs += 1

    print(f"Generated {created_svgs} missing fallback SVGs.")

if __name__ == '__main__':
    main()
