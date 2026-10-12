import json
import re
import os
from urllib.parse import urlparse

CATEGORY_MAP = {
    '3D WebGL': 'Interactive Web',
    '리소스 & 툴': 'Resource & Tool',
    '디자인 스튜디오': 'Graphic Design Studio',
    '실험적 웹': 'Experimental Web',
}

raw_items = """
ilithya-rocks | Ilithya | https://ilithya.rocks | 3D WebGL | GLSL 셰이더 아카이브 | GLSL 프래그먼트 셰이더·레이마칭 기반의 실험적 웹 그래픽 아카이브 | 브라우저 GPU 셰이더만으로 구현하는 절차적 비주얼과 수학적 그래픽
david-li | David Li Experiments | https://david.li | 3D WebGL | WebGL 유체 시뮬레이션 | 유체 시뮬레이션·연기·젤리 물리 엔진 중심의 WebGL 실험실 | 실시간 물리 연산과 유체 역학을 웹 브라우저에서 매끄럽게 구동하는 기술력
paper-design | Paper (Studio Lumio) | https://paper.design | 리소스 & 툴 | 인터랙티브 캔버스 툴 | 캔버스 기반 인터랙티브 드로잉 툴 겸 크리에이티브 랩 인터페이스 | 드로잉 도구의 조작감과 미니멀한 UI의 유기적 결합
stink-studios | Stink Studios | https://stinkstudios.com | 디자인 스튜디오 | 글로벌 디지털 에이전시 | 글로벌 크리에이티브 에이전시의 브랜드 캠페인 및 디지털 경험 케이스 스터디 | 데이터 시각화와 영상, 인터랙티브 웹을 하나의 브랜드 서사로 결합
adult-swim-music | Adult Swim Singles | https://www.adultswim.com/music | 실험적 웹 | 사이키델릭 넷아트 음악 웹 | 어덜트 스윔의 파괴적이고 사이키델릭한 넷아트형 음악 릴리즈 웹 | 주류 웹 디자인 규칙을 해체하고 독자적인 서브컬처 미학을 구현
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
    print(f"Total references after addition: {len(all_references)}")

    json_str = json.dumps(all_references, ensure_ascii=False, indent=2)
    lines_json = json_str.split('\n')
    indented_json = '\n'.join('  ' + l if l.strip() not in ('[', ']') else l for l in lines_json)

    new_file_content = f"import {{ Reference }} from '../types';\n\nexport const SEED_REFERENCES: Reference[] = {indented_json};\n"

    with open('lib/data/seed.ts', 'w') as f:
        f.write(new_file_content)

    print("Updated lib/data/seed.ts successfully.")

if __name__ == '__main__':
    main()
