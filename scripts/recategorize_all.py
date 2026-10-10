import json
import re

# Read seed.ts
with open('lib/data/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not find SEED_REFERENCES in seed.ts")
    exit(1)

raw_json = match.group(1)
items = json.loads(raw_json)

def categorize_item(item):
    url = item.get('url', '').lower()
    title = item.get('title', '').lower()
    anatomy = item.get('anatomy', '')
    principle = item.get('principle', '')
    id_str = item.get('id', '')

    # Specific mapping by ID or keywords
    if id_str in ['bruno-simon', 'igloo-inc', 'messenger-abeto', 'lusion-co', 'activetheory-net', 'resn-co-nz', 'shadertoy', 'radio-garden', 'makemepulse', '14islands', 'random-studio', 'dogstudio']:
        tags = ['3D WebGL']
        cat = 'Interactive Web'
    elif id_str in ['locomotive-ca', 'cuberto', 'immersive-garden', 'pudding-cool', 'godly-website', 'obys-agency', 'hellomonday', 'originkit']:
        tags = ['인터랙티브 모션']
        cat = 'Interactive Web'
    elif id_str in ['darkroom-engineering', 'studiodumbar-com', 'monopo-london', 'fontmeme-com']:
        tags = ['타이포그래피']
        cat = 'Typography'
    elif id_str in ['pentagram-com', 'wearecollins-com', 'koto-com', 'wearemucho-com', 'instrument-com', 'sainturbain-com', 'motherdesign', 'blvr-com', 'fellowstudio-com', 'wolffolins-com']:
        tags = ['브랜드 아이덴티티']
        cat = 'Brand Identity'
    elif id_str in ['jetset-nl', 'bureau-oberhaeuser', 'ok-rm-co-uk', 'slanted-publishers', 'readymag']:
        tags = ['에디토리얼 & 출판']
        cat = 'Editorial & Print'
    elif id_str in ['arena', 'cosmos-so', 'savee-it', 'siteinspire', 'inspirationfeed-com', 'uijar-com', 'hoverstat-es', 'brandarchive-xyz', 'curated-design']:
        tags = ['디자인 아카이브']
        cat = 'Archive & Curation'
    elif id_str in ['neal-fun', 'poolsuite-net', 'patatap-com', 'pointerpointer', 'zoomquilt', 'quickdraw', 'paperplanes', 'ciechanowski', 'ncase-me', 'windows93', 'mschf', 'experiments-with-google', 'codrops', 'hydra-livecoding', 'lynn-and-tonic', 'superflux']:
        tags = ['실험적 웹']
        cat = 'Experimental Web'
    elif id_str in ['teenage-engineering', 'cursor-com', 'material-io', 'originkit']:
        tags = ['디지털 제품 & UI']
        cat = 'Product & Tech UI'
    elif id_str in ['everyday-practice-com', 'heystudio-es', 'studiofeixen-ch', 'basement-studio']:
        tags = ['디자인 스튜디오']
        cat = 'Graphic Design Studio'
    elif 'motion' in title or 'animation' in title or 'tendril' in id_str or 'bluedot' in id_str or 'gryun' in id_str:
        tags = ['3D & 모션 그래픽']
        cat = 'Motion & 3D Studio'
    elif 'museum' in title or 'exhibitions' in title or 'refik' in id_str or 'whitney' in title or 'getty' in title or 'impossibleforms' in id_str:
        tags = ['미디어 아트 & 전시']
        cat = 'Media Art & Gallery'
    else:
        # Categorize by title/url keywords for audited bookmarks
        if any(k in title or k in url for k in ['studio', 'design', 'agency', 'creative']):
            if any(k in title or k in url for k in ['brand', 'identity', 'consultancy']):
                tags = ['브랜드 아이덴티티']
                cat = 'Brand Identity'
            elif any(k in title or k in url for k in ['motion', '3d', 'vfx', 'animation']):
                tags = ['3D & 모션 그래픽']
                cat = 'Motion & 3D Studio'
            else:
                tags = ['디자인 스튜디오']
                cat = 'Graphic Design Studio'
        elif any(k in title or k in url for k in ['archive', 'feed', 'inspiration', 'gallery', 'collection', 'list', 'resource', 'magazine']):
            tags = ['디자인 아카이브']
            cat = 'Archive & Curation'
        elif any(k in title or k in url for k in ['font', 'type', 'foundry', 'lettering', 'typography']):
            tags = ['타이포그래피']
            cat = 'Typography'
        elif any(k in title or k in url for k in ['art', 'museum', 'exhibition', 'artist', 'gallery']):
            tags = ['미디어 아트 & 전시']
            cat = 'Media Art & Gallery'
        elif any(k in title or k in url for k in ['3d', 'canvas', 'shader', 'gl', 'three']):
            tags = ['3D WebGL']
            cat = 'Interactive Web'
        elif any(k in title or k in url for k in ['app', 'tool', 'component', 'ui', 'kit', 'dev', 'system']):
            tags = ['디지털 제품 & UI']
            cat = 'Product & Tech UI'
        else:
            tags = ['디자인 스튜디오']
            cat = 'Graphic Design Studio'

    item['tags'] = tags
    item['category'] = cat
    return item

new_items = [categorize_item(item) for item in items]

# Count distribution
tag_counts = {}
for item in new_items:
    t = item['tags'][0]
    tag_counts[t] = tag_counts.get(t, 0) + 1

print("New Tag Distribution across 171 items:")
for t, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {t}: {count}")

