import json
import re
import os

with open('lib/data/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not find SEED_REFERENCES in seed.ts")
    exit(1)

existing_items = json.loads(match.group(1))
print(f"Loaded {len(existing_items)} existing items.")

# 1. 12 Items to Delete
DELETE_IDS = {
    'formist-co',
    'chipkidd-com',
    'kamponggelamorous-com',
    'canva-com',
    'prism-springtail-3rk4-squarespace-com',
    'grabcad-com',
    'jam3',
    'sneakerfreaker-com',
    'graphicmama-com',
    'inspirationfeed-com',
    'fellowstudio-com',
    'getty-edu'
}

filtered_items = [item for item in existing_items if item['id'] not in DELETE_IDS]
print(f"After deleting 12 items: {len(filtered_items)} remaining items.")

# 2. Fix 3 URLs
for item in filtered_items:
    if item['id'] == 'homelesspenthouse-com':
        item['url'] = 'https://www.homelesspenthouse.com/'
        item['title'] = 'HOMELESS PENTHOUSE'
    elif item['id'] == 'open-foundry-com':
        item['url'] = 'https://open-foundry.com/'
        item['title'] = 'Open Foundry'
    elif item['id'] == 'hayonstudio-com':
        item['url'] = 'https://hayonstudio.com/'
        item['title'] = 'Hayon Studio'

# 3. Explicit Category Mapping for Existing Items
EXPLICIT_TAGS = {
    # 디자인 아카이브
    'virgilabloh-com': ('디자인 아카이브', 'FREE-GAME 아카이브', '버질 아블로의 크리에이티브 마인드와 디자인 리소스 무료 아카이브'),
    'public-domain-com': ('디자인 아카이브', 'PUBLIC DOMAIN', '버질 아블로의 나이키 협업 및 스트리트웨어 디자인 아카이브'),
    'gdbot-tumblr-com': ('디자인 아카이브', 'Graphic Design Bot', '텀블러 기반 그래픽 디자인 및 서브컬처 비주얼 큐레이션'),
    'fuckyou-design': ('디자인 아카이브', 'FUCKYOU.DESIGN', '파격적인 비주얼과 안티디자인 웹 레퍼런스 큐레이션'),
    'brandarchive-xyz': ('디자인 아카이브', 'Brand Archive', '현대적 브랜드 아이덴티티와 패키지 디자인 큐레이션 플랫폼'),
    'godly-website': ('디자인 아카이브', 'Godly 웹 큐레이션', '최고 수준의 웹 인터랙션 및 모션 비디오 아카이브'),
    'p-kim-info': ('디자인 아카이브', 'P - K 아카이브', '독립 그래픽 디자이너의 방대한 시각 작업물 아카이브'),
    'arena': ('디자인 아카이브', '블록 아카이빙 플랫폼', '텍스트와 이미지를 블록 구조로 연결하는 지식 탐색 아카이브'),
    'cosmos-so': ('디자인 아카이브', '무드보드 비주얼 아카이브', '여백 중심의 시각 레퍼런스 큐레이션 플랫폼'),
    'savee-it': ('디자인 아카이브', '디자이너 비주얼 아카이브', '디자이너를 위한 고화질 비주얼 스피드 아카이빙 그리드'),
    'siteinspire': ('디자인 아카이브', '웹 디자인 아카이브', '정갈한 그리드 필터링 아카이브의 클래식 표준'),
    'brandingstyleguides-com': ('디자인 아카이브', '브랜드 가이드라인 아카이브', '글로벌 기업들의 공식 브랜드 가이드라인 PDF 아카이브'),
    'identitydesigned-com': ('디자인 아카이브', '브랜드 아이덴티티 쇼케이스', '전 세계 우수 브랜드 아이덴티티 케이스 스터디'),
    'chiselandmouse-com': ('디자인 아카이브', '건축 조각 아카이브', '도시 지도와 랜드마크 건물을 정밀 축소한 조각 아카이브'),

    # 디자인 스튜디오 (잘못 분류되었던 곳 교정 포함)
    'arauna-studio': ('디자인 스튜디오', 'Arauna 스튜디오', '바르셀로나 기반 그래픽 디자인 & 비주얼 디렉션 스튜디오'),
    'gonzalorodriguez-studio': ('디자인 스튜디오', 'Gonzalo Rodriguez', '스페인 기반 현대 그래픽 디자이너 포트폴리오'),
    'superflux': ('디자인 스튜디오', 'Superflux', '미래 시나리오와 기후, 기술을 탐구하는 디자인 연구 스튜디오'),
    'studiofeixen-ch': ('디자인 스튜디오', 'Studio Feixen', '스위스 루체른 기반 컬러와 조형 실험 그래픽 스튜디오'),
    'heystudio-es': ('디자인 스튜디오', 'HEY Studio', '바르셀로나 기반 대담한 기하학 일러스트 & 그래픽 스튜디오'),
    'everyday-practice-com': ('디자인 스튜디오', '일상의실천', '사회적 메시지와 포스터, 전시를 결합하는 디자인 스튜디오'),
    'ordinarypeople-info': ('디자인 스튜디오', 'Ordinary People', '서울 기반 현대 그래픽 디자인 스튜디오 오디너리피플'),
    'daeki-and-jun-com': ('디자인 스튜디오', 'DAEKI and JUN', '타이포그래피와 공간성을 결합하는 서울 그래픽 디자인 스튜디오'),
    'order-design': ('디자인 스튜디오', 'Order', '뉴욕 기반 정밀한 그리드와 시스템 디자인 스튜디오'),
    'studio-remote-kr': ('디자인 스튜디오', 'Studio Remote', '서울 기반 실험적 시각 언어의 독립 그래픽 스튜디오'),
    'studio-funday-com': ('디자인 스튜디오', '스튜디오 펀데이', '위트 있는 그래픽과 브랜드 비주얼을 만드는 디자인 스튜디오'),
    'fire-work-fr': ('디자인 스튜디오', 'Studio Fire Work', '프랑스 기반 그래픽 디자인 및 패키지 브랜딩 스튜디오'),
    'aline-studio': ('디자인 스튜디오', 'Aline Studio', '샌프란시스코/런던 기반 비주얼 디자인 스튜디오'),
    '28k-studio': ('디자인 스튜디오', '28k Studio', '디지털 프로덕트와 브랜드 인터페이스를 만드는 디자인 스튜디오'),
    'acre-studio': ('디자인 스튜디오', 'ACRE', '싱가포르 기반 브랜딩 및 크리에이티브 디자인 스튜디오'),
    'alphamark-design': ('디자인 스튜디오', 'Alphamark', '모던 미니멀리즘 비주얼 아이덴티티 디자인 스튜디오'),
    'apracticeforeverydaylife-com': ('디자인 스튜디오', 'A Practice for Everyday Life', '런던 기반 예술, 문화, 에디토리얼 디자인 전문 스튜디오'),
    '5-5-paris': ('디자인 스튜디오', 'Studio 5.5', '파리 기반 사물과 공간을 재해석하는 집단 디자인 스튜디오'),
    'trabuc-co': ('디자인 스튜디오', 'Trabucco Campos', '뉴욕 기반 펜타그램 출신 디자이너의 비주얼 포트폴리오'),
    'afom-com-au': ('디자인 스튜디오', 'A Friend of Mine', '호주 멜버른 기반 감각적인 브랜딩 & 패키지 디자인 스튜디오'),
    'hayonstudio-com': ('디자인 스튜디오', 'Hayon Studio', '세계적 산업 디자이너 겸 아티스트 하이메 아욘 스튜디오'),
    '21-87-co-uk': ('디자인 스튜디오', '21-87', '영국 브라이턴 기반 독립 디자인 오피스'),
    'seunghoi-com': ('디자인 스튜디오', 'Seunghoi An', '시카고/뉴욕 기반 한국인 디자이너의 타이포그래피 포트폴리오'),
    'designbby-com': ('디자인 스튜디오', 'DESIGNBBY', '현대적 서브컬처와 실험적 웹 비주얼을 다루는 디자인 스튜디오'),
    'jongkimdesign-com': ('디자인 스튜디오', 'Jongkim Design Studio', '공간과 브랜드를 아우르는 프리미엄 공간 디자인 스튜디오'),
    'designrangers-co-kr': ('디자인 스튜디오', '디자인방위대', '위트 있는 그래픽과 브랜딩 솔루션을 제시하는 크리에이티브 팀'),
    'werkgraphic-com': ('디자인 스튜디오', 'Werk Graphic', '스위스/독일 기반 정밀한 그리드 타이포그래피 스튜디오'),
    'vosk-design': ('디자인 스튜디오', 'Vosk Design', '디지털 아트와 브랜딩을 융합하는 크리에이티브 디자인 스튜디오'),
    'booooooom-com': ('디자인 스튜디오', 'Booooooom', '글로벌 아티스트 포트폴리오와 현대 시각 예술 플랫폼'),
    'visualjournal-it': ('디자인 스튜디오', 'Visual Journal', '이탈리아 기반 브랜딩 및 그래픽 디자인 아카이브'),
    'anothergraphic-org': ('디자인 스튜디오', 'Another Graphic', '현대 타이포그래피와 포스터 디자인 전문 그래픽 아카이브'),
    'houseofgul-com': ('디자인 스튜디오', 'House of Gul', '시카고 기반 예술과 패션을 넘나드는 다학제 디자인 스튜디오'),
    'teamblackcat-ch': ('디자인 스튜디오', 'Team Black Cat', '스위스 기반 국제 크리에이티브 컬렉티브 디자인 팀'),
    'forma-co': ('디자인 스튜디오', 'Forma', '바르셀로나 기반 그래픽 디자인 & 일러스트레이션 스튜디오'),
    'doberman-co': ('디자인 스튜디오', 'Doberman', '스톡홀름/뉴욕 기반 제품 디자인 및 디지털 혁신 에이전시'),
    'fold7-com': ('디자인 스튜디오', 'Fold7', '런던 기반 크리에이티브 광고 및 브랜드 캠페인 에이전시'),
    'clay-global': ('디자인 스튜디오', 'Clay Global', '샌프란시스코 기반 최고급 UI/UX 및 브랜드 디지털 에이전시'),
    'ideo-com': ('디자인 스튜디오', 'IDEO', '디자인 씽킹과 인간 중심 디자인을 창시한 글로벌 혁신 기업'),

    # 에디토리얼 & 출판
    'rodrigocorral-com': ('에디토리얼 & 출판', 'Rodrigo Corral 북디자인', '존 그린, 척 팔라닉 등 전설적 도서 표지를 만든 디자이너'),
    'johngalldesign-com': ('에디토리얼 & 출판', 'John Gall 북디자인', '무라카미 하루키 등 혁신적 북 커버를 디자인한 아트 디렉터'),
    'alvinlustig-com': ('에디토리얼 & 출판', 'Alvin Lustig 아카이브', '미국 모더니즘 그래픽과 북 커버 디자인의 선구자 아카이브'),
    'jetset-nl': ('에디토리얼 & 출판', 'Experimental Jetset', '단단하고 절제된 모더니즘 흑백 타이포그래피와 출판 디자인'),
    'bureau-oberhaeuser': ('에디토리얼 & 출판', 'Bureau Oberhaeuser', '정교한 그리드와 정보 시각화 중심의 에디토리얼 아카이브'),
    'ok-rm-co-uk': ('에디토리얼 & 출판', 'OK-RM 아트북 출판', '독립 출판과 전시 레이아웃의 실물 절제미를 담은 아카이브'),
    'bookcoverarchive-com': ('에디토리얼 & 출판', '북 커버 아카이브', '세계 유수 도서 표지와 에디토리얼 타이포그래피 아카이브'),
    'casualoptimist-com': ('에디토리얼 & 출판', '도서 출판 비평', '책 표지와 출판 문화의 시각적 혁신을 다루는 에디토리얼 매체'),

    # 실험적 웹
    'window-swap': ('실험적 웹', 'Window Swap', '전 세계 누군가의 창밖 풍경과 소리를 감상하는 무작위 뷰어'),
    'pudding-cool': ('실험적 웹', 'The Pudding', '데이터 시각화와 저널리즘을 스크롤로 엮어낸 인터랙티브 비주얼 에세이'),
    'neal-fun': ('실험적 웹', 'neal.fun 비주얼 실험실', '기발한 상상력과 미니 인터랙션으로 가득 찬 웹 플레이그라운드'),
    'poolsuite-net': ('실험적 웹', 'Poolsuite FM', '레트로 90년대 매킨토시 OS UI 기반 서머 라디오 플레이어'),
    'patatap-com': ('실험적 웹', 'Patatap 사운드 키보드', '키보드 입력과 시각 애니메이션, 사운드를 1:1로 동기화한 캔버스'),
    'pointerpointer': ('실험적 웹', 'Pointer Pointer', '화면 위 커서 위치를 정확히 가리키는 실제 사진 매칭 기믹'),
    'zoomquilt': ('실험적 웹', 'Zoomquilt 무한 줌', '일러스트레이션 속으로 끊임없이 파고드는 무한 줌인 아트워크'),
    'quickdraw': ('실험적 웹', 'Quick, Draw! 낙서 AI', '유저의 낙서를 신경망 AI가 실시간으로 인식하는 인터랙티브 게임'),
    'paperplanes': ('실험적 웹', 'Paper Planes', '스마트폰을 흔들어 접은 종이비행기를 글로벌 3D 화면으로 날리는 웹'),
    'ciechanowski': ('실험적 웹', 'Ciechanowski 원리해설', '물리와 기계의 작동 원리를 직관적인 인터랙티브 캔버스로 해설'),
    'ncase-me': ('실험적 웹', 'Nicky Case 시스템 게임', '신뢰의 진화 등 사회적 메커니즘을 게임 인터랙션으로 시뮬레이션'),
    'windows93': ('실험적 웹', 'Windows 93 패러디', '90년대 레트로 OS 패러디와 서브컬처 미니 프로그램 웹'),
    'mschf': ('실험적 웹', 'MSCHF 브랜드 실험실', '격주 드롭 형식의 기발한 문화적 사물과 인터랙티브 장난'),
    'experiments-with-google': ('실험적 웹', 'Chrome Experiments', '기술과 예술의 경계를 넘나드는 글로벌 인터랙티브 웹 실험 모음'),
    'codrops': ('실험적 웹', 'Codrops 인터랙션 데모', '최신 프론트엔드 모션, 셰이더, UI 인터랙션 데모의 교과서'),
    'hydra-livecoding': ('실험적 웹', 'Hydra 라이브 코딩', '브라우저에서 코드를 작성해 실시간 비디오 신디사이징을 구현'),
    'lynn-and-tonic': ('실험적 웹', 'Lynn Fisher 포트폴리오', '화면 크기와 연도에 따라 완전히 다른 레이아웃을 선보이는 웹'),

    # 인터랙티브 모션
    'darkroom-engineering': ('인터랙티브 모션', '가변 타이포 모션', '대형 가변 폰트(Variable Font) 모션과 최고급 웹 퍼포먼스'),
    'obys-agency': ('인터랙티브 모션', 'Obys Agency', '감각적인 타이포그래피 모션과 스무스 트랜지션 포트폴리오'),
    'basement-studio': ('인터랙티브 모션', 'Basement Studio', '모노스페이스 서체와 위트 있는 웹 모션을 결합한 디지털 스튜디오'),
    'locomotive-ca': ('인터랙티브 모션', 'Locomotive 스크롤', '자체 제작 패럴랙스 스크롤과 물리 엔진 모션의 기준점'),
    'cuberto': ('인터랙티브 모션', 'Cuberto 커서 모션', '마우스 커서 팔로우 애니메이션과 유기적인 모션 트랜지션'),
    'immersive-garden': ('인터랙티브 모션', 'Immersive Garden', '미세한 모션 지연과 여백 연출로 완성하는 하이엔드 감각'),
    'hellomonday': ('인터랙티브 모션', 'Hello Monday', '유연한 트랜지션과 마이크로 인터랙션으로 완성하는 디테일'),
    'originkit-dev': ('인터랙티브 모션', 'Originkit 모션 UI', '현대적 웹사이트를 위한 라이브 애니메이션 컴포넌트 모음'),

    # 3D WebGL
    'bruno-simon': ('3D WebGL', '3D 미니카 포트폴리오', '3D 미니카를 직접 운전하며 작품을 감상하는 인터랙티브 WebGL'),
    'igloo-inc': ('3D WebGL', '3D 사운드 포트폴리오', '3D 아티팩트, 사운드트랙, 패럴랙스 스크롤이 결합된 WebGL 씬'),
    'messenger-abeto': ('3D WebGL', '3D 멀티플레이어 행성', '작은 3D 행성 구체 위에서 유저들이 실시간으로 만나는 인터랙션'),
    'lusion-co': ('3D WebGL', '실시간 물리 시뮬레이션', '실시간 물리 시뮬레이션과 커서 반응형 3D 그래픽 렌더링'),
    'activetheory-net': ('3D WebGL', 'Active Theory', 'WebGL 셰이더와 유기적인 마우스 트래킹 렌더링 시스템의 벤치마크'),
    'resn-co-nz': ('3D WebGL', 'Resn 3D 익스피리언스', '몰입형 3D 인터랙션과 초현실적 비주얼 모션 포트폴리오'),
    'shadertoy': ('3D WebGL', 'Shadertoy 셰이더 랩', '픽셀 셰이더 코드 라이브 렌더링 및 글로벌 커뮤니티'),
    'radio-garden': ('3D WebGL', '3D 지구본 라디오', '3D 지구본을 회전시키며 전 세계 실시간 지역 라디오를 탐색'),
    'makemepulse': ('3D WebGL', 'MakeMePulse', '하이엔드 WebGL 그래픽과 압도적인 모션 인터랙션 브랜드 사이트'),
    '14islands': ('3D WebGL', '14islands 3D 메쉬', '유기적인 3D 메쉬 연출과 자연스러운 화면 전환 기술'),
    'random-studio': ('3D WebGL', 'Random Studio 공간 경험', '디지털과 공간 인터랙션을 연결하는 3D 브랜드 익스피리언스'),
    'dogstudio': ('3D WebGL', 'Dogstudio 3D 브랜딩', '대형 3D 오브젝트 렌더링과 사운드트랙 결합 인터랙션'),

    # 브랜드 아이덴티티
    'monopo-london': ('브랜드 아이덴티티', 'Monopo London', '도쿄와 런던을 잇는 대담한 비주얼 리듬의 브랜딩 에이전시'),
    '25ah-se': ('브랜드 아이덴티티', '25AH 브랜딩 하우스', '스톡홀름 기반 브랜드 아이덴티티 및 비주얼 아트 디렉션 스튜디오'),
    'pentagram-com': ('브랜드 아이덴티티', 'Pentagram 컨설팅', '세계 최대의 독립 디자인 컨설팅 그룹의 엄격한 시스템형 브랜딩'),
    'wearecollins-com': ('브랜드 아이덴티티', 'Collins 브랜드 에세이', '기업의 비전과 서사를 비주얼 시스템으로 변환하는 브랜딩'),
    'koto-com': ('브랜드 아이덴티티', 'Koto 테크 브랜딩', '기술 기업 브랜드에 친근하고 인간적인 터치를 가미하는 디자인'),
    'wearemucho-com': ('브랜드 아이덴티티', 'Mucho 아이디어 브랜딩', '명쾌한 비주얼 기믹과 위트 있는 아이디어로 완성하는 브랜딩'),
    'instrument-com': ('브랜드 아이덴티티', 'Instrument 브랜드 시스템', '글로벌 테크 기업들의 정교한 디지털 브랜드 시스템 구축'),
    'sainturbain-com': ('브랜드 아이덴티티', 'Saint Urbain', 'NYC와 LA 기반 독창적인 비주얼 아이덴티티 에이전시'),
    'motherdesign-com': ('브랜드 아이덴티티', 'Mother Design', '문화적 맥락과 서사를 연결하는 글로벌 브랜드 디자인 스튜디오'),
    'blvr-com': ('브랜드 아이덴티티', 'BLVR 신념 브랜딩', '기업의 신념과 핵심 가치를 시각 언어로 정립하는 에이전시'),
    'wolffolins-com': ('브랜드 아이덴티티', 'Wolff Olins 컨설턴시', '세계 유수 브랜드의 변혁을 이끌어온 글로벌 브랜드 컨설턴시'),
    'jkrglobal-com': ('브랜드 아이덴티티', 'Jones Knowles Ritchie', '버거킹 등 상징적인 글로벌 브랜드 리브랜딩을 주도한 크리에이티브사'),
    'naranjoetxeberria-com': ('브랜드 아이덴티티', 'Naranjo-Etxeberria', '마드리드 기반 간결하고 현대적인 브랜드 아이덴티티 스튜디오'),
    'olssonbarbieri-com': ('브랜드 아이덴티티', 'Olssøn Barbieri', '오슬로 기반 하이엔드 럭셔리 & 패키지 브랜드 디자인 스튜디오'),

    # 매거진 & 블로그 (신규 카테고리로 이전)
    'mdesign-designhouse-co-kr': ('매거진 & 블로그', '월간 디자인', '1976년 창간된 대한민국 최장수 디자인 전문 종합 매거진'),
    'cmf-designdb-com': ('매거진 & 블로그', '디자인DB (CMF)', '한국디자인진흥원 운영 디자인 트렌드 및 CMF 데이터 포털'),
    'creativeboom-com': ('매거진 & 블로그', 'Creative Boom', '창의 산업과 일러스트, 그래픽 아티스트를 조명하는 영국 매거진'),
    'underconsideration-com': ('매거진 & 블로그', 'Brand New', '글로벌 주요 브랜드의 리브랜딩 전후를 분석하고 비평하는 매체'),
    'creativeapplications-net': ('매거진 & 블로그', 'CreativeApplications.Net', '예술, 미디어 테크놀로지, 크리티컬 메이킹을 다루는 미디어'),
    'thedieline-com': ('매거진 & 블로그', 'Dieline 패키지 매거진', '전 세계 패키지 디자인과 브랜드 패키징 트렌드의 대표 플랫폼'),

    # 모션 & 3D (구 미디어 아트 & 3D에서 분리)
    'tendril-studio': ('모션 & 3D', 'Tendril CGI & 모션', '글로벌 테크 브랜드를 위한 하이엔드 3D 비주얼 & 모션 스튜디오'),
    'bluedotstudio-tv': ('모션 & 3D', 'Blue Dot 모션 스튜디오', '감각적인 캐릭터와 유기적인 움직임을 만드는 3D 애니메이션 팀'),
    'vixen-studios-com': ('모션 & 3D', 'VIXEN 크리에이티브', '3D 비주얼 효과(VFX)와 상업 모션 그래픽 프로젝트 아카이브'),
    'gryun-notion-site': ('모션 & 3D', 'Gryun Kim 모션 아카이브', '국내 정상급 모션 그래픽 디자이너 김그륜의 레퍼런스 노션 DB'),

    # 미디어 아트 & 전시 (순수 예술/전시로 정리)
    'refikanadol-com': ('미디어 아트 & 전시', 'Refik Anadol 미디어 아트', '데이터 알고리즘과 AI를 공간 조각으로 변환하는 거장 아카이브'),
    'whitney-org': ('미디어 아트 & 전시', '휘트니 미술관 전시', '미국 현대 미술의 정수를 보여주는 뉴욕 휘트니 미술관 아카이브'),
    'misa-art': ('미디어 아트 & 전시', 'MISA ART 글로벌 갤러리', '디지털 아트와 동시대 현대 미술품을 큐레이션하는 글로벌 플랫폼'),
    'impossibleforms-org': ('미디어 아트 & 전시', 'Museum of Impossible Forms', '실험적 미디어 아트와 비판적 담론을 탐색하는 문화 스페이스'),
    'vaultartspace-gucci-com': ('미디어 아트 & 전시', 'Vault Art Space (Gucci)', '구찌의 디지털 아트 및 NFT 실험 전시 공간'),

    # 일러스트 & 아티스트 (신규 카테고리로 이전)
    'handsome-frank-illustration-agency': ('일러스트 & 아티스트', 'Handsome Frank 에이전시', '세계 정상급 상업 일러스트레이터를 매니지먼트하는 영국 에이전시'),
    'vivienscreative-com-au': ('일러스트 & 아티스트', "Vivien's Creative", '패션, 광고, 시각 예술 아티스트 매니지먼트 에이전시'),
    'jacksachs-tumblr-com': ('일러스트 & 아티스트', 'Jack Sachs 3D 드로잉', '특유의 통통 튀는 질감과 유머러스한 3D 캐릭터 일러스트레이션'),
    'ryokoloves-art': ('일러스트 & 아티스트', 'Ryoko Kondo', '섬세한 수작업 감성과 독창적인 비주얼 드로잉 아티스트'),

    # 패션 & 컬처 (신규 카테고리로 이전)
    'the-museum-visitor-com': ('패션 & 컬처', 'THE MUSEUM VISITOR', '예술과 패션의 경계를 허무는 박물관 콘셉트의 패션 브랜드'),
    'kr-etudes-studio-com': ('패션 & 컬처', 'Études Studio', '파리 기반 현대 예술과 스트리트웨어를 융합한 남성복 브랜드'),
    'gallery-canary-yellow-com': ('패션 & 컬처', 'Canary Yellow 갤러리', '버질 아블로의 독립 문화 플랫폼이자 설치 아트 갤러리'),
    'forzonistudios-com': ('패션 & 컬처', 'Forzoni Studios (루이비통)', '루이비통 공방의 장인정신을 감각적인 필름과 그래픽으로 기록'),

    # 디지털 제품 & UI
    'uijar-com': ('디지털 제품 & UI', 'UIJar 디자인 영감', '실무 프로젝트를 위한 엄선된 UI/UX 디자인 패턴 큐레이션'),
    'teenage-engineering': ('디지털 제품 & UI', 'Teenage Engineering', '기계 매뉴얼과 공학 도면의 조형미를 웹 UI로 승화시킨 테크 브랜드'),
    'cursor-com': ('디지털 제품 & UI', 'Cursor AI 코드 에디터', '개발 툴의 기능미와 현대적 다크 브랜딩을 결합한 인터페이스'),
    'material-io': ('디지털 제품 & UI', 'Google Material Design', '구글의 글로벌 UI/UX 디자인 시스템 및 모바일/웹 인터페이스 표준 가이드'),

    # 리소스 & 툴 (신규 카테고리로 이전)
    'download-free-mockups': ('리소스 & 툴', 'ls.graphics 무료 목업', '디자이너를 위한 고화질 디바이스 및 패키지 3D 목업 리소스'),
    'unblast-com': ('리소스 & 툴', 'Unblast 디자인 리소스', '엄선된 무료 폰트, 목업, 그래픽 템플릿 다운로드 허브'),

    # 타이포그래피
    'fontmeme-com': ('타이포그래피', 'Font Meme 폰트 리소스', '영화, 대중문화, 브랜드 폰트 정보 및 타이포그래피 스타일 데이터'),
    'open-foundry-com': ('타이포그래피', 'Open Foundry 오픈 폰트', '브라우저에서 직접 테스트 가능한 무료 오픈소스 폰트 파운드리'),
    'studiodumbar-com': ('타이포그래피', 'Studio Dumbar / DEPT®', '실시간 키네틱 타이포그래피와 모션 브랜드 아이덴티티의 개척자'),
}

# Update existing items with explicit tags
for item in filtered_items:
    iid = item['id']
    if iid in EXPLICIT_TAGS:
        tag, short, anat = EXPLICIT_TAGS[iid]
        item['tags'] = [tag]
        item['category'] = tag
        item['shortDesc'] = short
        item['anatomy'] = anat

# 4. Define the 105 New Items
NEW_105_ITEMS = [
    # 1. 디자인 스튜디오 (9)
    {
        "id": "studio-spass",
        "title": "Studio Spass",
        "url": "https://studiospass.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "로테르담 그래픽 스튜디오",
        "anatomy": "유쾌한 시각적 실험과 공간/공공 디자인 연출을 넘나드는 네덜란드 스튜디오",
        "principle": "엄격한 그리드 안에 유머와 입체 조형성을 결합하는 실험성",
        "imageUrl": "/captures/studio-spass.png",
        "videoUrl": "/videos/studio-spass.webm"
    },
    {
        "id": "bureau-borsche",
        "title": "Bureau Borsche",
        "url": "https://bureauborsche.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "뮌헨 에디토리얼 스튜디오",
        "anatomy": "뮌헨 기반 에디토리얼 & 패션 브랜드 그래픽 스튜디오",
        "principle": "급진적 타이포그래피와 클래식 에디토리얼의 조화",
        "imageUrl": "/captures/bureau-borsche.png",
        "videoUrl": "/videos/bureau-borsche.webm"
    },
    {
        "id": "zak-group",
        "title": "Zak Group",
        "url": "https://zakgroup.co.uk/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "런던 문화예술 디자인",
        "anatomy": "런던 기반 문화 예술 & 전시 그래픽 디자인 스튜디오",
        "principle": "현대 미술관 및 비엔날레 시각 아이덴티티의 정석",
        "imageUrl": "/captures/zak-group.png",
        "videoUrl": "/videos/zak-group.webm"
    },
    {
        "id": "sulki-and-min",
        "title": "슬기와 민 (Sulki and Min)",
        "url": "http://www.sulki-min.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "한국 대표 그래픽 듀오",
        "anatomy": "한국 현대 그래픽 디자인을 대표하는 듀오 스튜디오의 아카이브",
        "principle": "개념적 규칙과 엄격한 형식 실험을 아우르는 작업 세계",
        "imageUrl": "/captures/sulki-and-min.png",
        "videoUrl": "/videos/sulki-and-min.webm"
    },
    {
        "id": "studio-fnt",
        "title": "Studio fnt",
        "url": "https://studiofnt.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "서울 그래픽 & 전시 디자인",
        "anatomy": "서울 기반 그래픽 디자인 및 전시/아이덴티티 스튜디오",
        "principle": "정교한 조형 감각과 문화 예술 프로젝트 아카이브",
        "imageUrl": "/captures/studio-fnt.png",
        "videoUrl": "/videos/studio-fnt.webm"
    },
    {
        "id": "workroom-press",
        "title": "워크룸 (Workroom)",
        "url": "http://workroompress.net/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "디자인 스튜디오 & 출판사",
        "anatomy": "디자인 스튜디오이자 독립 출판사 워크룸 프레스의 대표 아카이브",
        "principle": "출판과 그래픽 디자인의 긴밀한 교차점과 활자 조형미",
        "imageUrl": "/captures/workroom-press.png",
        "videoUrl": "/videos/workroom-press.webm"
    },
    {
        "id": "braulio-amado",
        "title": "Bráulio Amado",
        "url": "https://braulioamado.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "원초적 드로잉 & 그래픽",
        "anatomy": "뉴욕 기반 포르투갈 그래픽 디자이너 겸 일러스트레이터",
        "principle": "원초적이고 파격적인 색채와 드로잉 그래픽 스타일",
        "imageUrl": "/captures/braulio-amado.png",
        "videoUrl": "/videos/braulio-amado.webm"
    },
    {
        "id": "spin-studio",
        "title": "Spin",
        "url": "https://spin.co.uk/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "런던 독립 브랜딩 스튜디오",
        "anatomy": "런던 기반 독립 브랜딩 & 그래픽 디자인 스튜디오",
        "principle": "모던 미니멀리즘과 실험적 모션 타이포의 결합",
        "imageUrl": "/captures/spin-studio.png",
        "videoUrl": "/videos/spin-studio.webm"
    },
    {
        "id": "non-format",
        "title": "Non-Format",
        "url": "https://non-format.com/",
        "category": "디자인 스튜디오",
        "tags": ["디자인 스튜디오"],
        "shortDesc": "커스텀 타이포그래피 듀오",
        "anatomy": "오슬로/미니애폴리스 기반 다국적 크리에이티브 듀오",
        "principle": "독보적인 커스텀 타이포그래피와 아트 디렉션",
        "imageUrl": "/captures/non-format.png",
        "videoUrl": "/videos/non-format.webm"
    },

    # 2. 브랜드 아이덴티티 (10)
    {
        "id": "base-design",
        "title": "Base Design",
        "url": "https://basedesign.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "글로벌 브랜드 에이전시",
        "anatomy": "브뤼셀, 뉴욕, 제네바 기반 글로벌 브랜드 에이전시",
        "principle": "문화와 커머스를 연결하는 미니멀 브랜드 시스템",
        "imageUrl": "/captures/base-design.png",
        "videoUrl": "/videos/base-design.webm"
    },
    {
        "id": "snask",
        "title": "Snask",
        "url": "https://snask.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "록앤롤 크리에이티브 브랜딩",
        "anatomy": "스톡홀름 기반 파격적이고 유쾌한 크리에이티브 에이전시",
        "principle": "록앤롤 정신과 과감한 원색 실물 세트 스타일링 브랜딩",
        "imageUrl": "/captures/snask.png",
        "videoUrl": "/videos/snask.webm"
    },
    {
        "id": "lundgren-lindqvist",
        "title": "Lundgren+Lindqvist",
        "url": "https://www.lundgrenlindqvist.se/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "스웨덴 비주얼 아이덴티티",
        "anatomy": "스웨덴 예테보리 기반 정교한 비주얼 아이덴티티 스튜디오",
        "principle": "스칸디나비안 미니멀리즘과 세련된 웹 아키텍처",
        "imageUrl": "/captures/lundgren-lindqvist.png",
        "videoUrl": "/videos/lundgren-lindqvist.webm"
    },
    {
        "id": "porto-rocha",
        "title": "Porto Rocha",
        "url": "https://portorocha.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "브루클린 디자인 에이전시",
        "anatomy": "뉴욕 기반 브루클린 디자인 & 브랜딩 에이전시",
        "principle": "글로벌 테크와 문화 브랜드를 아우르는 구조적 아이덴티티",
        "imageUrl": "/captures/porto-rocha.png",
        "videoUrl": "/videos/porto-rocha.webm"
    },
    {
        "id": "moving-brands",
        "title": "Moving Brands",
        "url": "https://movingbrands.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "무빙 브랜딩 창시 기업",
        "anatomy": "런던, 샌프란시스코 기반 무빙 브랜딩 선구 기업",
        "principle": "정적 로고를 넘어 움직임을 전제로 한 브랜드 시스템 창시",
        "imageUrl": "/captures/moving-brands.png",
        "videoUrl": "/videos/moving-brands.webm"
    },
    {
        "id": "and-walsh",
        "title": "&Walsh",
        "url": "https://andwalsh.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "뉴욕 크리에이티브 에이전시",
        "anatomy": "제시카 월시가 이끄는 뉴욕 크리에이티브 에이전시",
        "principle": "초현실적 3D 비주얼과 대담한 타이포 브랜딩",
        "imageUrl": "/captures/and-walsh.png",
        "videoUrl": "/videos/and-walsh.webm"
    },
    {
        "id": "two-times-elliott",
        "title": "Two Times Elliott",
        "url": "https://twotimeselliott.co.uk/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "럭셔리 & 라이프스타일 디자인",
        "anatomy": "런던 기반 럭셔리, 패션, 라이프스타일 디자인 스튜디오",
        "principle": "절제된 우아함과 섬세한 마감의 브랜드 아이덴티티",
        "imageUrl": "/captures/two-times-elliott.png",
        "videoUrl": "/videos/two-times-elliott.webm"
    },
    {
        "id": "manual-creative",
        "title": "Manual",
        "url": "https://manualcreative.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "샌프란시스코 브랜드 디자인",
        "anatomy": "샌프란시스코 기반 브랜드 디자인 & 전략 컨설팅 스튜디오",
        "principle": "실리콘밸리 테크 및 크래프트 브랜드를 위한 정제된 브랜딩",
        "imageUrl": "/captures/manual-creative.png",
        "videoUrl": "/videos/manual-creative.webm"
    },
    {
        "id": "commission-studio",
        "title": "Commission Studio",
        "url": "https://commission.studio/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "런던 컨템포러리 에이전시",
        "anatomy": "런던 기반 컨템포러리 라이프스타일 브랜드 에이전시",
        "principle": "산업 디자인적 정밀도와 하이패션 감각의 결합",
        "imageUrl": "/captures/commission-studio.png",
        "videoUrl": "/videos/commission-studio.webm"
    },
    {
        "id": "plus-ex",
        "title": "플러스엑스 (Plus X)",
        "url": "https://plus-ex.com/",
        "category": "브랜드 아이덴티티",
        "tags": ["브랜드 아이덴티티"],
        "shortDesc": "통합 브랜드 경험 디자인",
        "anatomy": "서울 기반 통합 브랜드 경험 디자인 에이전시",
        "principle": "전략, UI/UX, 비주얼을 관통하는 온오프라인 통합 솔루션",
        "imageUrl": "/captures/plus-ex.png",
        "videoUrl": "/videos/plus-ex.webm"
    },

    # 3. 타이포그래피 (9)
    {
        "id": "fonts-in-use",
        "title": "Fonts In Use",
        "url": "https://fontsinuse.com/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "실제 서체 사용례 아카이브",
        "anatomy": "실제 출판물과 웹 속 서체 사용 사례 공공 아카이브",
        "principle": "서체와 디자이너, 용도를 교차 인덱싱한 타이포 백과사전",
        "imageUrl": "/captures/fonts-in-use.png",
        "videoUrl": "/videos/fonts-in-use.webm"
    },
    {
        "id": "typewolf",
        "title": "Typewolf",
        "url": "https://www.typewolf.com/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "웹 서체 큐레이션 표준",
        "anatomy": "웹 타이포그래피 트렌드 및 서체 조합 추천 가이드",
        "principle": "실제 라이브 웹사이트 중심의 웹 폰트 큐레이션 표준",
        "imageUrl": "/captures/typewolf.png",
        "videoUrl": "/videos/typewolf.webm"
    },
    {
        "id": "klim-type-foundry",
        "title": "Klim Type Foundry",
        "url": "https://klim.co.nz/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "뉴질랜드 독립 파운드리",
        "anatomy": "뉴질랜드 기반 크리스 소스비의 독립 서체 파운드리",
        "principle": "형태적 완벽성과 서사적 서체 테스터 인터페이스",
        "imageUrl": "/captures/klim-type-foundry.png",
        "videoUrl": "/videos/klim-type-foundry.webm"
    },
    {
        "id": "grilli-type",
        "title": "Grilli Type",
        "url": "https://www.grillitype.com/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "스위스 독립 디지털 파운드리",
        "anatomy": "스위스 기반 독립 디지털 서체 파운드리",
        "principle": "서체마다 독창적인 인터랙티브 스토리텔링 마이크로사이트 구축",
        "imageUrl": "/captures/grilli-type.png",
        "videoUrl": "/videos/grilli-type.webm"
    },
    {
        "id": "abc-dinamo",
        "title": "ABC Dinamo",
        "url": "https://abcdinamo.com/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "진보적 서체 디자인 파운드리",
        "anatomy": "베를린/바젤 기반 진보적 서체 디자인 파운드리",
        "principle": "가변 폰트(Variable Font) 하드웨어 툴과 파격적 서체 실험",
        "imageUrl": "/captures/abc-dinamo.png",
        "videoUrl": "/videos/abc-dinamo.webm"
    },
    {
        "id": "commercial-type",
        "title": "Commercial Type",
        "url": "https://commercialtype.com/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "정통 에디토리얼 서체 명가",
        "anatomy": "뉴욕과 런던의 폴 반스, 크리스티안 슈왈츠 서체 파운드리",
        "principle": "에디토리얼 신문 서체부터 모던 산세리프까지 정통 서체 명가",
        "imageUrl": "/captures/commercial-type.png",
        "videoUrl": "/videos/commercial-type.webm"
    },
    {
        "id": "velvetyne",
        "title": "Velvetyne Type Foundry",
        "url": "https://velvetyne.fr/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "프랑스 오픈소스 실험 파운드리",
        "anatomy": "프랑스 기반 오픈소스 무료 실험 서체 파운드리",
        "principle": "규칙에 얽매이지 않는 전위적 오픈소스 타이포그래피 커뮤니티",
        "imageUrl": "/captures/velvetyne.png",
        "videoUrl": "/videos/velvetyne.webm"
    },
    {
        "id": "noonnu",
        "title": "눈누 (Noonnu)",
        "url": "https://noonnu.cc/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "상업용 무료 한글 폰트 허브",
        "anatomy": "국내 상업용 무료 한글 폰트 통합 플랫폼",
        "principle": "웹폰트 테스트와 라이선스 확인이 가능한 대표적 한글 서체 허브",
        "imageUrl": "/captures/noonnu.png",
        "videoUrl": "/videos/noonnu.webm"
    },
    {
        "id": "dia-studio",
        "title": "DIA Studio",
        "url": "https://dia.tv/",
        "category": "타이포그래피",
        "tags": ["타이포그래피"],
        "shortDesc": "키네틱 타이포 브랜딩 전문",
        "anatomy": "뉴욕 기반 키네틱 타이포그래피 브랜딩 전문 스튜디오",
        "principle": "서체 모션 알고리즘을 브랜드의 핵심 시그니처로 구현",
        "imageUrl": "/captures/dia-studio.png",
        "videoUrl": "/videos/dia-studio.webm"
    },

    # 4. 에디토리얼 & 출판 (6)
    {
        "id": "slanted-publishers",
        "title": "Slanted Publishers",
        "url": "https://www.slanted.de/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "독일 인디 출판 매거진",
        "anatomy": "독일 기반 인디 출판사이자 디자인 매거진 슬란티드",
        "principle": "세계 도시별 타이포그래피 및 현대 그래픽 아트북 큐레이션",
        "imageUrl": "/captures/slanted-publishers.png",
        "videoUrl": "/videos/slanted-publishers.webm"
    },
    {
        "id": "spector-books",
        "title": "Spector Books",
        "url": "https://spectorbooks.com/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "라이프치히 예술 이론 출판사",
        "anatomy": "라이프치히 기반 미술, 이론, 디자인 전문 독립 출판사",
        "principle": "책을 하나의 독립된 예술 매체로 다루는 출판 미학",
        "imageUrl": "/captures/spector-books.png",
        "videoUrl": "/videos/spector-books.webm"
    },
    {
        "id": "roma-publications",
        "title": "Roma Publications",
        "url": "https://www.romapublications.org/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "암스테르담 독립 북디자인",
        "anatomy": "암스테르담 기반 카렐 마르텐스와 마르크 만더스의 독립 출판사",
        "principle": "절제된 북 디자인과 시각 예술가 모노그래프의 조화",
        "imageUrl": "/captures/roma-publications.png",
        "videoUrl": "/videos/roma-publications.webm"
    },
    {
        "id": "printed-matter",
        "title": "Printed Matter",
        "url": "https://www.printedmatter.org/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "뉴욕 아티스트 북 비영리 기구",
        "anatomy": "뉴욕 소재 세계 최대의 아티스트 북 전문 비영리 기구",
        "principle": "예술가 출판물과 독립 진(Zine) 문화의 발원지 아카이브",
        "imageUrl": "/captures/printed-matter.png",
        "videoUrl": "/videos/printed-matter.webm"
    },
    {
        "id": "idea-mag",
        "title": "IDEA Magazine (아이디어)",
        "url": "https://www.idea-mag.com/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "아시아 대표 그래픽 전문지",
        "anatomy": "도쿄 기반 1953년 창간된 아시아 대표 그래픽 디자인 전문지",
        "principle": "동서양 타이포그래피 역사와 비평을 아우르는 정밀한 에디토리얼",
        "imageUrl": "/captures/idea-mag.png",
        "videoUrl": "/videos/idea-mag.webm"
    },
    {
        "id": "apartamento-magazine",
        "title": "Apartamento Magazine",
        "url": "https://www.apartamentomagazine.com/",
        "category": "에디토리얼 & 출판",
        "tags": ["에디토리얼 & 출판"],
        "shortDesc": "바르셀로나 컬트 라이프 매거진",
        "anatomy": "바르셀로나 기반 일상 인테리어 및 라이프스타일 컬트 매거진",
        "principle": "정형화된 건축 사진을 거부하는 자연스럽고 따뜻한 에디토리얼",
        "imageUrl": "/captures/apartamento-magazine.png",
        "videoUrl": "/videos/apartamento-magazine.webm"
    },

    # 5. 매거진 & 블로그 (8)
    {
        "id": "its-nice-that",
        "title": "It's Nice That",
        "url": "https://www.itsnicethat.com/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "글로벌 비주얼 크리에이티브 미디어",
        "anatomy": "런던 기반 글로벌 크리에이티브 예술 & 디자인 웹 매거진",
        "principle": "전 세계 최신 비주얼 크리에이티브와 아티스트 인터뷰 큐레이션",
        "imageUrl": "/captures/its-nice-that.png",
        "videoUrl": "/videos/its-nice-that.webm"
    },
    {
        "id": "aiga-eye-on-design",
        "title": "AIGA Eye on Design",
        "url": "https://eyeondesign.aiga.org/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "미국 AIGA 비평 저널리즘",
        "anatomy": "미국 그래픽 아트 협회(AIGA) 발행 비평 웹 매거진",
        "principle": "디자인 윤리, 노동, 사회적 맥락을 깊이 있게 다루는 저널리즘",
        "imageUrl": "/captures/aiga-eye-on-design.png",
        "videoUrl": "/videos/aiga-eye-on-design.webm"
    },
    {
        "id": "dezeen",
        "title": "Dezeen",
        "url": "https://www.dezeen.com/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "세계적 건축 & 디자인 매거진",
        "anatomy": "세계에서 가장 영향력 있는 건축, 인테리어, 디자인 매거진",
        "principle": "글로벌 디자인 트렌드와 건축 혁신 프로젝트의 실시간 보도",
        "imageUrl": "/captures/dezeen.png",
        "videoUrl": "/videos/dezeen.webm"
    },
    {
        "id": "designboom",
        "title": "designboom",
        "url": "https://www.designboom.com/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "디지털 건축 & 디자인 최초 매체",
        "anatomy": "1999년 설립된 최초의 디지털 건축 & 디자인 웹 매거진",
        "principle": "기술 혁신, 프로덕트, 건축, 설치 미술을 망라하는 글로벌 매체",
        "imageUrl": "/captures/designboom.png",
        "videoUrl": "/videos/designboom.webm"
    },
    {
        "id": "creative-review",
        "title": "Creative Review",
        "url": "https://www.creativereview.co.uk/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "영국 광고 & 브랜딩 저널",
        "anatomy": "영국 런던 기반 광고, 디자인, 브랜딩 전문 저널",
        "principle": "창의 산업 전반의 상업적 성공과 시각 문화 트렌드 분석",
        "imageUrl": "/captures/creative-review.png",
        "videoUrl": "/videos/creative-review.webm"
    },
    {
        "id": "colossal",
        "title": "Colossal",
        "url": "https://www.thisiscolossal.com/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "비주얼 아트 & 공예 온라인 갤러리",
        "anatomy": "동시대 미술, 공예, 비주얼 컬처 중심의 온라인 갤러리 매거진",
        "principle": "장인정신과 비주얼 아트의 경이로움을 소개하는 예술 플랫폼",
        "imageUrl": "/captures/colossal.png",
        "videoUrl": "/videos/colossal.webm"
    },
    {
        "id": "graphic-mag",
        "title": "GRAPHIC (그래픽)",
        "url": "http://graphicmag.kr/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "서울 단일 테마 심층 그래픽지",
        "anatomy": "서울 기반 이슈별 단일 테마를 심층 탐구하는 그래픽 잡지",
        "principle": "형식주의를 벗어나 그래픽 디자인의 특정 주제를 다각도로 해부",
        "imageUrl": "/captures/graphic-mag.png",
        "videoUrl": "/videos/graphic-mag.webm"
    },
    {
        "id": "design-jungle",
        "title": "디자인정글 (Design Jungle)",
        "url": "https://www.jungle.co.kr/",
        "category": "매거진 & 블로그",
        "tags": ["매거진 & 블로그"],
        "shortDesc": "국내 디자인 소식 & 공모전",
        "anatomy": "한국 디자인계 소식과 공모전, 디자이너 인터뷰 포털",
        "principle": "국내 디자인 트렌드와 전시/공모전 정보를 아우르는 매체",
        "imageUrl": "/captures/design-jungle.png",
        "videoUrl": "/videos/design-jungle.webm"
    },

    # 6. 디자인 아카이브 (8)
    {
        "id": "letterform-archive",
        "title": "Letterform Archive",
        "url": "https://letterformarchive.org/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "샌프란시스코 타이포그래피 아카이브",
        "anatomy": "샌프란시스코 소재 10만 점 이상의 타이포/레터링 컬렉션",
        "principle": "서체와 인쇄술 역사를 고해상도 디지털 아카이브로 개방",
        "imageUrl": "/captures/letterform-archive.png",
        "videoUrl": "/videos/letterform-archive.webm"
    },
    {
        "id": "cooper-hewitt",
        "title": "Cooper Hewitt, Smithsonian Design Museum",
        "url": "https://www.cooperhewitt.org/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "스미스소니언 국립 디자인 뮤지엄",
        "anatomy": "스미스소니언 소속 미국 유일의 국립 디자인 박물관 컬렉션",
        "principle": "역사적 디자인 사물과 인터랙티브 펜 디지털 아카이브 시스템",
        "imageUrl": "/captures/cooper-hewitt.png",
        "videoUrl": "/videos/cooper-hewitt.webm"
    },
    {
        "id": "emuseum-ch",
        "title": "eMuseum (Museum für Gestaltung Zürich)",
        "url": "https://www.emuseum.ch/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "스위스 스타일 포스터 원본 DB",
        "anatomy": "취리히 디자인 박물관의 스위스 그래픽 및 포스터 컬렉션",
        "principle": "스위스 스타일 모더니즘 디자인의 원본 아카이브 데이터베이스",
        "imageUrl": "/captures/emuseum-ch.png",
        "videoUrl": "/videos/emuseum-ch.webm"
    },
    {
        "id": "logobook",
        "title": "Logobook",
        "url": "http://www.logobook.com/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "흑백 심볼 & 로고 인덱스",
        "anatomy": "세계 유수 로고 및 심볼마크 형태학적 아카이브",
        "principle": "기하학, 문자, 사물 등 형태별로 분류된 흑백 로고 인덱스",
        "imageUrl": "/captures/logobook.png",
        "videoUrl": "/videos/logobook.webm"
    },
    {
        "id": "hoverstat-es",
        "title": "Hoverstat.es",
        "url": "https://hoverstat.es/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "아방가르드 인터랙티브 웹 큐레이션",
        "anatomy": "실험적이고 파격적인 인터랙티브 웹 디자인 큐레이션",
        "principle": "주류 상업 웹의 문법을 깨부수는 아방가르드 웹 아카이브",
        "imageUrl": "/captures/hoverstat-es.png",
        "videoUrl": "/videos/hoverstat-es.webm"
    },
    {
        "id": "minimal-gallery",
        "title": "Minimal Gallery",
        "url": "https://minimal.gallery/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "미니멀리즘 웹사이트 갤러리",
        "anatomy": "미니멀리즘과 여백이 돋보이는 웹사이트 큐레이션",
        "principle": "불필요한 요소를 덜어낸 단정한 웹 디자인 모음",
        "imageUrl": "/captures/minimal-gallery.png",
        "videoUrl": "/videos/minimal-gallery.webm"
    },
    {
        "id": "brutalist-websites",
        "title": "Brutalist Websites",
        "url": "https://brutalistwebsites.com/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "원초적 브루탈리즘 웹 모음",
        "anatomy": "원초적이고 다듬어지지 않은 브루탈리즘 웹 큐레이션",
        "principle": "장식을 배제하고 거친 날것의 HTML/CSS 코드로 승부하는 웹",
        "imageUrl": "/captures/brutalist-websites.png",
        "videoUrl": "/videos/brutalist-websites.webm"
    },
    {
        "id": "awwwards",
        "title": "Awwwards",
        "url": "https://www.awwwards.com/",
        "category": "디자인 아카이브",
        "tags": ["디자인 아카이브"],
        "shortDesc": "글로벌 웹 디자인 어워드",
        "anatomy": "세계 최고의 웹 디자이너와 개발자를 심사하는 디지털 어워드",
        "principle": "디자인, 사용성, 창의성, 기술 완성도를 평가하는 글로벌 벤치마크",
        "imageUrl": "/captures/awwwards.png",
        "videoUrl": "/videos/awwwards.webm"
    },

    # 7. 3D WebGL (5)
    {
        "id": "henry-heffernan",
        "title": "Henry Heffernan",
        "url": "https://henryheffernan.com/",
        "category": "3D WebGL",
        "tags": ["3D WebGL"],
        "shortDesc": "3D 방 & CRT OS 포트폴리오",
        "anatomy": "90년대 사이버 OS 데스크톱을 3D 공간으로 재현한 포트폴리오",
        "principle": "3D 방 안의 CRT 모니터와 실제 동작하는 OS UI 인터랙션",
        "imageUrl": "/captures/henry-heffernan.png",
        "videoUrl": "/videos/henry-heffernan.webm"
    },
    {
        "id": "merci-michel",
        "title": "Merci-Michel",
        "url": "https://merci-michel.com/",
        "category": "3D WebGL",
        "tags": ["3D WebGL"],
        "shortDesc": "파리 최고급 디지털 프로덕션",
        "anatomy": "파리 기반 최고 수준의 디지털 프로덕션 스튜디오",
        "principle": "정교한 WebGL 셰이더와 물리 효과를 적용한 몰입형 인터랙션",
        "imageUrl": "/captures/merci-michel.png",
        "videoUrl": "/videos/merci-michel.webm"
    },
    {
        "id": "garden-eight",
        "title": "Garden Eight",
        "url": "https://garden-eight.com/",
        "category": "3D WebGL",
        "tags": ["3D WebGL"],
        "shortDesc": "도쿄/코펜하겐 인터랙티브 웹",
        "anatomy": "도쿄/코펜하겐 기반 디지털 디자인 & 인터랙티브 스튜디오",
        "principle": "부드러운 WebGL 왜곡 효과와 정교한 일본 감성 레이아웃",
        "imageUrl": "/captures/garden-eight.png",
        "videoUrl": "/videos/garden-eight.webm"
    },
    {
        "id": "utsubo",
        "title": "Utsubo",
        "url": "https://utsubo.com/",
        "category": "3D WebGL",
        "tags": ["3D WebGL"],
        "shortDesc": "3D 파티클 & 사운드 비주얼라이저",
        "anatomy": "인터랙티브 3D 공간 경험과 사운드 비주얼라이저 스튜디오",
        "principle": "마우스 움직임에 반응하는 유기적인 3D 파티클과 사운드 믹싱",
        "imageUrl": "/captures/utsubo.png",
        "videoUrl": "/videos/utsubo.webm"
    },
    {
        "id": "unseen-studio",
        "title": "Unseen Studio",
        "url": "https://unseen.co/",
        "category": "3D WebGL",
        "tags": ["3D WebGL"],
        "shortDesc": "하이엔드 3D 인터랙티브 에이전시",
        "anatomy": "영국 기반 하이엔드 3D 인터랙티브 디지털 에이전시",
        "principle": "영화적 3D 렌더링과 부드러운 스크롤 인터랙션의 결합",
        "imageUrl": "/captures/unseen-studio.png",
        "videoUrl": "/videos/unseen-studio.webm"
    },

    # 8. 인터랙티브 모션 (5)
    {
        "id": "aristide-benoist",
        "title": "Aristide Benoist",
        "url": "https://aristidebenoist.com/",
        "category": "인터랙티브 모션",
        "tags": ["인터랙티브 모션"],
        "shortDesc": "관성 스크롤 & 모션 교과서",
        "anatomy": "Awwwards 올해의 개발자 수상 아리스티드 브누아 포트폴리오",
        "principle": "독보적인 관성 스크롤과 부드러운 이미지 트랜지션 모션",
        "imageUrl": "/captures/aristide-benoist.png",
        "videoUrl": "/videos/aristide-benoist.webm"
    },
    {
        "id": "robin-noguier",
        "title": "Robin Noguier",
        "url": "https://robin-noguier.com/",
        "category": "인터랙티브 모션",
        "tags": ["인터랙티브 모션"],
        "shortDesc": "스마트폰 목업 인터랙션",
        "anatomy": "디자이너 로빈 노기에의 감각적인 포트폴리오",
        "principle": "스마트폰 목업과 스크롤 인터랙션을 유기적으로 엮은 UI 연출",
        "imageUrl": "/captures/robin-noguier.png",
        "videoUrl": "/videos/robin-noguier.webm"
    },
    {
        "id": "exo-ape",
        "title": "Exo Ape",
        "url": "https://exoape.com/",
        "category": "인터랙티브 모션",
        "tags": ["인터랙티브 모션"],
        "shortDesc": "럭셔리 비디오 스크롤 익스피리언스",
        "anatomy": "네덜란드 기반 럭셔리 디지털 익스피리언스 스튜디오",
        "principle": "스무스 스크롤과 고해상도 비디오 시퀀싱의 완벽한 조화",
        "imageUrl": "/captures/exo-ape.png",
        "videoUrl": "/videos/exo-ape.webm"
    },
    {
        "id": "ouiwill",
        "title": "OuiWill",
        "url": "https://ouiwill.com/",
        "category": "인터랙티브 모션",
        "tags": ["인터랙티브 모션"],
        "shortDesc": "속도감 있는 모션 타이포그래피",
        "anatomy": "샌프란시스코/파리 기반 디지털 브랜딩 에이전시",
        "principle": "속도감 있는 타이포그래피 모션과 역동적인 인터랙션",
        "imageUrl": "/captures/ouiwill.png",
        "videoUrl": "/videos/ouiwill.webm"
    },
    {
        "id": "wild-agency",
        "title": "WILD",
        "url": "https://wild.as/",
        "category": "인터랙티브 모션",
        "tags": ["인터랙티브 모션"],
        "shortDesc": "크리에이티브 테크놀로지 모션",
        "anatomy": "비엔나/취리히 기반 크리에이티브 테크놀로지 스튜디오",
        "principle": "마이크로 모션과 물리 엔진을 더한 인터랙티브 내러티브",
        "imageUrl": "/captures/wild-agency.png",
        "videoUrl": "/videos/wild-agency.webm"
    },

    # 9. 실험적 웹 (6)
    {
        "id": "studio-moniker",
        "title": "Studio Moniker",
        "url": "http://studiomoniker.com/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "참여형 집단 웹 실험실",
        "anatomy": "참여형 웹 실험과 조건부 인터랙션을 개척한 디자인 스튜디오",
        "principle": "다수가 마우스 커서로 만들어내는 집단적 시각 실험의 장",
        "imageUrl": "/captures/studio-moniker.png",
        "videoUrl": "/videos/studio-moniker.webm"
    },
    {
        "id": "camerons-world",
        "title": "Cameron's World",
        "url": "https://www.cameronsworld.net/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "지오시티즈 90년대 웹 1.0 꼴라주",
        "anatomy": "지오시티즈(GeoCities) 황금기 아카이브 웹 아트 프로젝트",
        "principle": "초창기 웹 1.0의 GIF 애니메이션과 사운드를 꼴라주한 인터랙션",
        "imageUrl": "/captures/camerons-world.png",
        "videoUrl": "/videos/camerons-world.webm"
    },
    {
        "id": "weavesilk",
        "title": "Silk (Interactive Generative Art)",
        "url": "http://weavesilk.com/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "빛의 대칭 제너레이티브 아트",
        "anatomy": "커서 드래그로 빛의 대칭 비단 문양을 그리는 제너레이티브 아트",
        "principle": "단순한 제스처로 완성되는 복잡하고 아름다운 수학적 빛의 궤적",
        "imageUrl": "/captures/weavesilk.png",
        "videoUrl": "/videos/weavesilk.webm"
    },
    {
        "id": "new-rafael",
        "title": "Rafaël Rozendaal",
        "url": "https://www.newrafael.com/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "웹사이트 자체를 파는 넷 아티스트",
        "anatomy": "웹사이트 자체를 하나의 독립된 예술품으로 판매하는 넷 아티스트",
        "principle": "브라우저 화면을 점유하는 미니멀리즘 인터랙티브 비주얼 조형",
        "imageUrl": "/captures/new-rafael.png",
        "videoUrl": "/videos/new-rafael.webm"
    },
    {
        "id": "mrdoob",
        "title": "Mr.doob (Ricardo Cabello)",
        "url": "https://mrdoob.com/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "three.js 창시자의 웹 실험실",
        "anatomy": "three.js 창시자 리카르도 카벨로의 전설적인 웹 실험실",
        "principle": "구글 그래비티부터 초창기 자바스크립트 3D 그래픽의 원점",
        "imageUrl": "/captures/mrdoob.png",
        "videoUrl": "/videos/mrdoob.webm"
    },
    {
        "id": "chrome-music-lab",
        "title": "Chrome Music Lab",
        "url": "https://musiclab.chromeexperiments.com/",
        "category": "실험적 웹",
        "tags": ["실험적 웹"],
        "shortDesc": "구글 크롬 시각 음악 실험실",
        "anatomy": "구글 크롬의 오픈소스 인터랙티브 음악 실험실",
        "principle": "소리와 시각 인터랙션을 직관적인 웹 캔버스로 시각화",
        "imageUrl": "/captures/chrome-music-lab.png",
        "videoUrl": "/videos/chrome-music-lab.webm"
    },

    # 10. 모션 & 3D (7)
    {
        "id": "buck-design",
        "title": "BUCK",
        "url": "https://buck.co/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "글로벌 모션 애니메이션 선두",
        "anatomy": "글로벌 모션 그래픽과 캐릭터 애니메이션의 세계적 선두 스튜디오",
        "principle": "독보적인 캐릭터 아트 디렉션과 최고난도 2D/3D 모션 연출",
        "imageUrl": "/captures/buck-design.png",
        "videoUrl": "/videos/buck-design.webm"
    },
    {
        "id": "manvsmachine",
        "title": "ManvsMachine",
        "url": "https://manvsmachine.co/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "나이키·애플 모션 명가",
        "anatomy": "런던, LA 기반 나이키, 애플 주요 캠페인을 제작하는 D&AD 수상 스튜디오",
        "principle": "조각적인 3D 형태미와 미래지향적 테크 모션의 정점",
        "imageUrl": "/captures/manvsmachine.png",
        "videoUrl": "/videos/manvsmachine.webm"
    },
    {
        "id": "golden-wolf",
        "title": "Golden Wolf",
        "url": "https://goldenwolf.tv/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "에너제틱 2D/3D 애니메이션",
        "anatomy": "런던과 뉴욕 기반 에너제틱한 2D/3D 애니메이션 스튜디오",
        "principle": "서브컬처, 코믹스, 스트리트 감성을 결합한 속도감 있는 모션",
        "imageUrl": "/captures/golden-wolf.png",
        "videoUrl": "/videos/golden-wolf.webm"
    },
    {
        "id": "oddfellows",
        "title": "Oddfellows",
        "url": "https://oddfellows.tv/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "스토리텔링 디자인 & 애니메이션",
        "anatomy": "포틀랜드 기반 스토리텔링 중심의 디자인 & 애니메이션 스튜디오",
        "principle": "따뜻하고 서정적인 일러스트레이션 모션과 감성적 사운드 연출",
        "imageUrl": "/captures/oddfellows.png",
        "videoUrl": "/videos/oddfellows.webm"
    },
    {
        "id": "ordinary-folk",
        "title": "Ordinary Folk",
        "url": "https://ordinaryfolk.co/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "섬세한 프레임 모션 내러티브",
        "anatomy": "밴쿠버 기반 섬세한 모션 그래픽과 시각 내러티브 스튜디오",
        "principle": "프레임 바이 프레임 모션의 부드러움과 절제된 일러스트 디렉션",
        "imageUrl": "/captures/ordinary-folk.png",
        "videoUrl": "/videos/ordinary-folk.webm"
    },
    {
        "id": "ash-thorp",
        "title": "Ash Thorp (ALT Creative)",
        "url": "https://ashthorp.com/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "배트맨·사이버펑크 CGI 거장",
        "anatomy": "배트맨, 고스트인더쉘 UI를 디자인한 세계적 CGI & 콘셉트 아티스트",
        "principle": "기계적 디테일과 사이버펑크 무드의 미래지향적 3D 아트",
        "imageUrl": "/captures/ash-thorp.png",
        "videoUrl": "/videos/ash-thorp.webm"
    },
    {
        "id": "andreas-wannerstedt",
        "title": "Andreas Wannerstedt",
        "url": "https://andreaswannerstedt.se/",
        "category": "모션 & 3D",
        "tags": ["모션 & 3D"],
        "shortDesc": "완벽한 무한 루프 3D 모션",
        "anatomy": "스톡홀름 기반 완벽한 기계적 루프 애니메이션 아티스트",
        "principle": "물리적 정밀함과 심리적 안정감을 주는 무한 루프 3D 모션",
        "imageUrl": "/captures/andreas-wannerstedt.png",
        "videoUrl": "/videos/andreas-wannerstedt.webm"
    },

    # 11. 미디어 아트 & 전시 (9)
    {
        "id": "teamlab-art",
        "title": "teamLab",
        "url": "https://www.teamlab.art/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "국경 없는 몰입형 디지털 아트",
        "anatomy": "도쿄 기반 국경 없는 몰입형 인터랙티브 디지털 아트 그룹",
        "principle": "관객의 움직임에 따라 유기적으로 피어나고 흩어지는 빛의 공간",
        "imageUrl": "/captures/teamlab-art.png",
        "videoUrl": "/videos/teamlab-art.webm"
    },
    {
        "id": "dstrict",
        "title": "d'strict",
        "url": "https://www.dstrict.com/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "아르떼뮤지엄·WAVE 미디어 파사드",
        "anatomy": "코엑스 'WAVE'와 아르떼뮤지엄을 창조한 한국의 미디어 아트 기업",
        "principle": "공공 캔버스를 압도하는 아나몰픽 일루전과 공감각적 공간 연출",
        "imageUrl": "/captures/dstrict.png",
        "videoUrl": "/videos/dstrict.webm"
    },
    {
        "id": "uva-studio",
        "title": "UVA (United Visual Artists)",
        "url": "https://uva.co.uk/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "빛과 건축 공간 설치 예술",
        "anatomy": "런던 기반 빛, 소리, 건축 공간을 융합하는 설치 미술 그룹",
        "principle": "프로그래밍된 빛의 빔과 조각이 만들어내는 시간과 공간의 조율",
        "imageUrl": "/captures/uva-studio.png",
        "videoUrl": "/videos/uva-studio.webm"
    },
    {
        "id": "ryoji-ikeda",
        "title": "Ryoji Ikeda (이케다 료지)",
        "url": "https://www.ryojiikeda.com/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "초음파 & 바이너리 미니멀 사운드",
        "anatomy": "일본의 세계적인 미니멀 사운드 아티스트이자 비주얼 아티스트",
        "principle": "순수 데이터 바이너리와 초음파 주파수를 시각화한 압도적 흑백 미학",
        "imageUrl": "/captures/ryoji-ikeda.png",
        "videoUrl": "/videos/ryoji-ikeda.webm"
    },
    {
        "id": "studio-drift",
        "title": "Studio Drift",
        "url": "https://studiodrift.com/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "드론 조각 & 키네틱 라이팅 아트",
        "anatomy": "암스테르담의 랄프 나우타와 로네케 호르딘의 예술 듀오",
        "principle": "수백 대의 드론 조각과 키네틱 라이팅으로 자연의 원리를 시각화",
        "imageUrl": "/captures/studio-drift.png",
        "videoUrl": "/videos/studio-drift.webm"
    },
    {
        "id": "rhizomatiks",
        "title": "Rhizomatiks (라이조마틱스)",
        "url": "https://rhizomatiks.com/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "기술 기반 미디어 아트 컬렉티브",
        "anatomy": "마나베 다이토가 이끄는 기술 기반 미디어 아트 컬렉티브",
        "principle": "하드웨어 해킹, AI, 댄서의 움직임을 데이터로 연결하는 미래 무대",
        "imageUrl": "/captures/rhizomatiks.png",
        "videoUrl": "/videos/rhizomatiks.webm"
    },
    {
        "id": "universal-everything",
        "title": "Universal Everything",
        "url": "https://universaleverything.com/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "생성형 3D 디지털 비디오 설치",
        "anatomy": "영국 기반 디지털 아트 및 비디오 설치 컬렉티브",
        "principle": "인간의 보행과 자연의 유기적 형태를 생성형 3D 그래픽으로 변환",
        "imageUrl": "/captures/universal-everything.png",
        "videoUrl": "/videos/universal-everything.webm"
    },
    {
        "id": "olafur-eliasson",
        "title": "Studio Olafur Eliasson",
        "url": "https://olafureliasson.net/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "빛과 날씨 공간 인식 현대미술",
        "anatomy": "빛, 날씨, 물, 공간 인식을 탐구하는 세계적인 현대 미술가",
        "principle": "자연 현상을 미술관 공간으로 끌어들여 지각의 한계를 확장",
        "imageUrl": "/captures/olafur-eliasson.png",
        "videoUrl": "/videos/olafur-eliasson.webm"
    },
    {
        "id": "mmca-go-kr",
        "title": "국립현대미술관 (MMCA)",
        "url": "https://www.mmca.go.kr/",
        "category": "미디어 아트 & 전시",
        "tags": ["미디어 아트 & 전시"],
        "shortDesc": "한국 현대미술 전시 아카이브",
        "anatomy": "한국 현대미술의 중심 국립현대미술관 전시 아카이브",
        "principle": "동시대 미술 전시, 소장품 데이터베이스 및 미디어 아트 전시기획",
        "imageUrl": "/captures/mmca-go-kr.png",
        "videoUrl": "/videos/mmca-go-kr.webm"
    },

    # 12. 일러스트 & 아티스트 (7)
    {
        "id": "jean-jullien",
        "title": "Jean Jullien",
        "url": "https://www.jeanjullien.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "따뜻한 해학의 붓선 일러스트",
        "anatomy": "프랑스 파리 출신의 세계적인 그래픽 아티스트 겸 일러스트레이터",
        "principle": "일상의 순간을 특유의 붓선과 따뜻한 해학으로 포착하는 일러스트",
        "imageUrl": "/captures/jean-jullien.png",
        "videoUrl": "/videos/jean-jullien.webm"
    },
    {
        "id": "malika-favre",
        "title": "Malika Favre",
        "url": "https://malikafavre.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "미니멀 팝아트 & 벡터 거장",
        "anatomy": "바르셀로나 기반 미니멀리즘과 팝아트의 정점 말리카 파브르",
        "principle": "대담한 색면과 포지티브/네거티브 여백을 활용한 우아한 벡터 아트",
        "imageUrl": "/captures/malika-favre.png",
        "videoUrl": "/videos/malika-favre.webm"
    },
    {
        "id": "tom-haugomat",
        "title": "Tom Haugomat",
        "url": "https://tomhaugomat.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "시네마틱 앵글과 빛의 서사",
        "anatomy": "파리 기반 시네마틱 앵글과 빛의 명암을 다루는 일러스트레이터",
        "principle": "원경 구도와 절제된 4~5가지 팬톤 컬러로 구축하는 영화 같은 서사",
        "imageUrl": "/captures/tom-haugomat.png",
        "videoUrl": "/videos/tom-haugomat.webm"
    },
    {
        "id": "christoph-niemann",
        "title": "Christoph Niemann",
        "url": "https://www.christophniemann.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "사물의 기발한 시각적 은유",
        "anatomy": "뉴요커 표지와 앱스트랙트로 유명한 세계적 아티스트",
        "principle": "일상의 사물 하나를 기발한 시각적 은유로 전환하는 아이디어 스케치",
        "imageUrl": "/captures/christoph-niemann.png",
        "videoUrl": "/videos/christoph-niemann.webm"
    },
    {
        "id": "hvass-and-hannibal",
        "title": "Hvass&Hannibal",
        "url": "https://hvasshannibal.dk/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "북유럽 조형 & 패턴 일러스트",
        "anatomy": "코펜하겐 기반 나나 & 소피의 다학제 예술 및 일러스트 스튜디오",
        "principle": "북유럽 감성의 패턴, 텍스타일, 조형 일러스트레이션",
        "imageUrl": "/captures/hvass-and-hannibal.png",
        "videoUrl": "/videos/hvass-and-hannibal.webm"
    },
    {
        "id": "james-jean",
        "title": "James Jean",
        "url": "https://jamesjean.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "초현실주의 환상 회화 거장",
        "anatomy": "프라다, 영화 포스터 등 환상적인 필치를 선보이는 거장 화가",
        "principle": "동서양 고전 회화 기법과 초현실주의가 결합된 정교한 드로잉",
        "imageUrl": "/captures/james-jean.png",
        "videoUrl": "/videos/james-jean.webm"
    },
    {
        "id": "geoff-mcfetridge",
        "title": "Geoff McFetridge",
        "url": "https://championstudio.com/",
        "category": "일러스트 & 아티스트",
        "tags": ["일러스트 & 아티스트"],
        "shortDesc": "선과 조형 언어의 인간 성찰",
        "anatomy": "LA 기반 챔피언 스튜디오의 아티스트 제프 맥페트리지",
        "principle": "인간의 조건과 관계를 단순한 선과 모호한 조형 언어로 성찰",
        "imageUrl": "/captures/geoff-mcfetridge.png",
        "videoUrl": "/videos/geoff-mcfetridge.webm"
    },

    # 13. 패션 & 컬처 (7)
    {
        "id": "ssense-editorial",
        "title": "SSENSE Editorial",
        "url": "https://www.ssense.com/en-us/editorial",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "아방가르드 패션 문화 비평",
        "anatomy": "글로벌 패션 플랫폼 센스(SSENSE)의 문화 비평 에디토리얼",
        "principle": "전통 패션 잡지의 틀을 깬 아방가르드 문화 에세이와 비주얼",
        "imageUrl": "/captures/ssense-editorial.png",
        "videoUrl": "/videos/ssense-editorial.webm"
    },
    {
        "id": "032c",
        "title": "032c",
        "url": "https://032c.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "베를린 서브컬처 패션 미학",
        "anatomy": "베를린 기반 컨템포러리 문화 잡지이자 의류 브랜드",
        "principle": "자유와 반항의 베를린 서브컬처 미학과 아카이브 저널리즘",
        "imageUrl": "/captures/032c.png",
        "videoUrl": "/videos/032c.webm"
    },
    {
        "id": "system-magazine",
        "title": "System Magazine",
        "url": "https://system-magazine.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "패션 산업 심층 대화 저널",
        "anatomy": "글로벌 패션 산업의 심층 인터뷰와 독점 화보를 다루는 반년간지",
        "principle": "패션계 핵심 거장들의 대화와 파격적인 비주얼 디렉션",
        "imageUrl": "/captures/system-magazine.png",
        "videoUrl": "/videos/system-magazine.webm"
    },
    {
        "id": "dazed-digital",
        "title": "Dazed",
        "url": "https://www.dazeddigital.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "런던 유스 컬처 & 진보 패션",
        "anatomy": "런던 기반 유스 컬처와 진보적 패션을 선도하는 데이즈드",
        "principle": "젊은 예술가들의 파격적인 목소리와 대안적 시각 언어",
        "imageUrl": "/captures/dazed-digital.png",
        "videoUrl": "/videos/dazed-digital.webm"
    },
    {
        "id": "gentle-monster",
        "title": "Gentle Monster",
        "url": "https://www.gentlemonster.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "초현실 공간 & 아이웨어 브랜딩",
        "anatomy": "공간 경험과 초현실적 비주얼로 브랜딩의 룰을 바꾼 아이웨어 브랜드",
        "principle": "거대 로봇 설치물과 웹 3D 비주얼이 만드는 예측 불가능한 경험",
        "imageUrl": "/captures/gentle-monster.png",
        "videoUrl": "/videos/gentle-monster.webm"
    },
    {
        "id": "tamburins",
        "title": "Tamburins (탬버린즈)",
        "url": "https://www.tamburins.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "오브제 & 향의 내러티브",
        "anatomy": "감각적인 향과 행위 예술적 비주얼을 선보이는 코스메틱 브랜드",
        "principle": "제품을 오브제로 다루며 향의 내러티브를 시각화하는 독보적 미학",
        "imageUrl": "/captures/tamburins.png",
        "videoUrl": "/videos/tamburins.webm"
    },
    {
        "id": "ader-error",
        "title": "ADER error (아더에러)",
        "url": "https://adererror.com/",
        "category": "패션 & 컬처",
        "tags": ["패션 & 컬처"],
        "shortDesc": "해체주의 패션 & 블루 시그니처",
        "anatomy": "서울 기반 '일상에서 놓친 것들'을 재해석하는 패션 크리에이티브 집단",
        "principle": "해체주의적 디자인과 유쾌한 블루 시그니처 비주얼 브랜딩",
        "imageUrl": "/captures/ader-error.png",
        "videoUrl": "/videos/ader-error.webm"
    },

    # 14. 디지털 제품 & UI (4)
    {
        "id": "mobbin",
        "title": "Mobbin",
        "url": "https://mobbin.com/",
        "category": "디지털 제품 & UI",
        "tags": ["디지털 제품 & UI"],
        "shortDesc": "실무 iOS & 웹 UI 플로우 패턴",
        "anatomy": "세계 최고의 실무 iOS 및 웹 앱 UI/UX 디자인 패턴 라이브러리",
        "principle": "실제 서비스들의 온보딩, 결제, 네비게이션 플로우 스크린샷 아카이브",
        "imageUrl": "/captures/mobbin.png",
        "videoUrl": "/videos/mobbin.webm"
    },
    {
        "id": "linear-app",
        "title": "Linear",
        "url": "https://linear.app/",
        "category": "디지털 제품 & UI",
        "tags": ["디지털 제품 & UI"],
        "shortDesc": "실리콘밸리 다크 UI 표준",
        "anatomy": "실리콘밸리 제품 팀들의 표준 이슈 트래커이자 최고급 다크 UI 벤치마크",
        "principle": "군더더기 없는 타이포그래피, 키보드 단축키 중심의 초고속 인터페이스",
        "imageUrl": "/captures/linear-app.png",
        "videoUrl": "/videos/linear-app.webm"
    },
    {
        "id": "rauno-me",
        "title": "Rauno Freiberg",
        "url": "https://rauno.me/",
        "category": "디지털 제품 & UI",
        "tags": ["디지털 제품 & UI"],
        "shortDesc": "Vercel 인터랙션 디자인 랩",
        "anatomy": "Vercel 인터랙션 디자이너 라우노 프라이베르크의 인터페이스 실험실",
        "principle": "마이크로 인터랙션과 보이지 않는 물리 디테일의 극한을 탐구",
        "imageUrl": "/captures/rauno-me.png",
        "videoUrl": "/videos/rauno-me.webm"
    },
    {
        "id": "nothing-tech",
        "title": "Nothing",
        "url": "https://nothing.tech/",
        "category": "디지털 제품 & UI",
        "tags": ["디지털 제품 & UI"],
        "shortDesc": "투명 테크 & 도트 매트릭스 UI",
        "anatomy": "투명 테크놀로지와 도트 매트릭스 UI의 전자기기 브랜드",
        "principle": "기존 스마트폰의 획일성을 탈피한 독창적인 레트로 퓨처리즘 디자인 언어",
        "imageUrl": "/captures/nothing-tech.png",
        "videoUrl": "/videos/nothing-tech.webm"
    },

    # 15. 리소스 & 툴 (5)
    {
        "id": "spline-design",
        "title": "Spline",
        "url": "https://spline.design/",
        "category": "리소스 & 툴",
        "tags": ["리소스 & 툴"],
        "shortDesc": "웹 기반 3D 인터랙션 제작 툴",
        "anatomy": "웹 브라우저에서 직접 3D 씬을 제작하고 인터랙션을 배포하는 툴",
        "principle": "코딩 없이 누구나 웹용 3D 오브젝트와 애니메이션을 제작 가능한 UI",
        "imageUrl": "/captures/spline-design.png",
        "videoUrl": "/videos/spline-design.webm"
    },
    {
        "id": "threejs-org",
        "title": "three.js",
        "url": "https://threejs.org/",
        "category": "리소스 & 툴",
        "tags": ["리소스 & 툴"],
        "shortDesc": "웹 3D 그래픽 표준 라이브러리",
        "anatomy": "웹 3D 그래픽을 대중화한 오픈소스 WebGL 자바스크립트 라이브러리",
        "principle": "웹 브라우저 3D 렌더링 생태계의 기초 표준과 방대한 공식 예제들",
        "imageUrl": "/captures/threejs-org.png",
        "videoUrl": "/videos/threejs-org.webm"
    },
    {
        "id": "gsap-com",
        "title": "GSAP (GreenSock)",
        "url": "https://gsap.com/",
        "category": "리소스 & 툴",
        "tags": ["리소스 & 툴"],
        "shortDesc": "웹 모션 & 스크롤트리거 표준 엔진",
        "anatomy": "고성능 웹 애니메이션과 스크롤 트리거의 사실상 글로벌 표준 라이브러리",
        "principle": "브라우저 간 호환성과 부드러운 60fps 모션 시퀀싱 엔진",
        "imageUrl": "/captures/gsap-com.png",
        "videoUrl": "/videos/gsap-com.webm"
    },
    {
        "id": "rive-app",
        "title": "Rive",
        "url": "https://rive.app/",
        "category": "리소스 & 툴",
        "tags": ["리소스 & 툴"],
        "shortDesc": "실시간 인터랙티브 벡터 모션",
        "anatomy": "런타임 상태 머신을 지원하는 차세대 실시간 인터랙티브 벡터 애니메이션 툴",
        "principle": "디자이너가 제작한 모션이 앱과 게임에서 실시간 로직과 1:1 연동",
        "imageUrl": "/captures/rive-app.png",
        "videoUrl": "/videos/rive-app.webm"
    },
    {
        "id": "touchdesigner",
        "title": "TouchDesigner",
        "url": "https://derivative.ca/",
        "category": "리소스 & 툴",
        "tags": ["리소스 & 툴"],
        "shortDesc": "실시간 미디어 아트 비주얼 툴",
        "anatomy": "미디어 아트와 대형 인터랙티브 전시를 위한 노드 기반 비주얼 프로그래밍 툴",
        "principle": "실시간 비디오 믹싱, 센서 입력, 제너레이티브 비주얼을 처리하는 표준 플랫폼",
        "imageUrl": "/captures/touchdesigner.png",
        "videoUrl": "/videos/touchdesigner.webm"
    }
]

print(f"Adding {len(NEW_105_ITEMS)} new references.")
all_final_items = filtered_items + NEW_105_ITEMS
print(f"Total references in dataset: {len(all_final_items)}")

# Check tag distribution
tag_stats = {}
for item in all_final_items:
    t = item['tags'][0]
    tag_stats[t] = tag_stats.get(t, 0) + 1

print("\nFinal Tag Distribution (15 Categories):")
for t, count in sorted(tag_stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {t}: {count}개")

# Write to lib/data/seed.ts
ts_code = "import { Reference } from '../types';\n\nexport const SEED_REFERENCES: Reference[] = " + json.dumps(all_final_items, ensure_ascii=False, indent=2) + ";\n"

with open('lib/data/seed.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("\nSuccessfully updated lib/data/seed.ts!")
