import json
import re

# Read seed.ts
with open('lib/data/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not find SEED_REFERENCES")
    exit(1)

items = json.loads(match.group(1))

# Custom detailed dictionary mapping for items
mappings = {
    # 1. 3D WebGL
    "bruno-simon": ("3D WebGL", "Interactive Web", "3D 미니카 포트폴리오", "3D 미니카를 직접 조종하며 포트폴리오 조형물을 탐색하는 WebGL 인터랙션", "물리 엔진과 3D 공간 연출을 포트폴리오 탐색 과정에 통합"),
    "igloo-inc": ("3D WebGL", "Interactive Web", "3D 사운드 포트폴리오", "3D 아티팩트, 멀티트랙 사운드, 패럴랙스 스크롤이 하나의 씬으로 엮인 WebGL 연출", "스크롤 트리거 연출에 감각적 오디오 믹싱을 결합해 몰입감 극대화"),
    "messenger-abeto": ("3D WebGL", "Interactive Web", "3D 멀티플레이어 구체", "3D 행성 구체 위에서 유저들이 실시간으로 만나 소통하는 인터랙션", "텍스트 메시징 UI를 3D 멀티플레이어 행성 인터랙션으로 재해석"),
    "lusion-co": ("3D WebGL", "Interactive Web", "실시간 3D 시뮬레이션", "실시간 물리 시뮬레이션과 커서 반응형 3D 그래픽 렌더링", "기술을 장식이 아닌 감각적 촉감으로 변환하는 실시간 WebGL 렌더링"),
    "activetheory-net": ("3D WebGL", "Interactive Web", "WebGL 셰이더 포트폴리오", "WebGL 셰이더와 유기적인 마우스 트래킹 렌더링 시스템", "실시간 셰이더와 웹 XR을 아우르는 인터랙션 연출의 기준점"),
    "resn-co-nz": ("3D WebGL", "Interactive Web", "몰입형 3D 인터랙션", "몰입형 3D 인터랙션과 초현실적 비주얼 모션 포트폴리오", "웹 브라우저에서 표현 가능한 3D 몰입감과 비주얼 스토리텔링의 결합"),
    "shadertoy": ("3D WebGL", "Interactive Web", "실시간 셰이더 커뮤니티", "픽셀 셰이더 코드 라이브 렌더링 및 글로벌 커뮤니티", "코드 몇 줄로 완성하는 실시간 셰이더 수학과 미학의 상극"),
    "radio-garden": ("3D WebGL", "Interactive Web", "실시간 지구본 라디오", "3D 지구본을 회전시키며 전 세계 실시간 지역 라디오를 탐색하는 웹", "지리적 3D 인터랙션과 실시간 오디오 스트리밍의 유기적 결합"),
    "makemepulse": ("3D WebGL", "Interactive Web", "WebGL 아티팩트 브랜드", "하이엔드 WebGL 그래픽과 압도적인 모션 인터랙션 브랜드 사이트", "웹 기술을 예술적 인터랙티브 캔버스로 변환하는 몰입감"),
    "14islands": ("3D WebGL", "Interactive Web", "3D 메쉬 인터랙션", "유기적인 3D 메쉬 연출과 자연스러운 화면 전환", "3D 오브젝트와 텍스트 레이아웃의 유기적 융합"),
    "random-studio": ("3D WebGL", "Interactive Web", "공간 경험 디자인", "디지털과 공간 인터랙션을 연결하는 3D 경험 사이트", "공간감과 건축적 라이팅을 웹 인터페이스로 확장"),
    "dogstudio": ("3D WebGL", "Interactive Web", "3D 브랜딩 서사", "대형 3D 동물/마스크 렌더링과 사운드트랙 결합 브랜딩", "시각적 3D 오브젝트와 사운드를 통합한 서사 연출"),

    # 2. 인터랙티브 모션
    "locomotive-ca": ("인터랙티브 모션", "Interactive Web", "패럴랙스 스크롤 모션", "자체 제작 패럴랙스 스크롤 인터랙션과 타이포그래피 모션", "스크롤 속도 및 시점 연출의 물리적 댐핑 컨트롤"),
    "cuberto": ("인터랙티브 모션", "Interactive Web", "커서 모션 인터랙션", "마우스 커서 팔로우 애니메이션과 역동적인 비디오 트랜지션", "커서 인터랙션의 표준을 보여주는 유기적 포인터 피드백"),
    "immersive-garden": ("인터랙티브 모션", "Interactive Web", "에디토리얼 비주얼 모션", "마이크로 인터랙션과 고화질 에디토리얼 텍스처 레이어링", "미세한 모션 지연과 여백 연출로 완성하는 하이엔드 감각"),
    "pudding-cool": ("인터랙티브 모션", "Interactive Web", "데이터 저널리즘 에세이", "데이터 시각화와 저널리즘이 스크롤과 결합된 비주얼 에세이", "정적 그래프를 넘어 스크롤 기반 데이터 스토리를 전달하는 저널리즘"),
    "godly-website": ("인터랙티브 모션", "Interactive Web", "웹 모션 큐레이션", "엄선된 최고 수준의 웹 디자인 비디오 & 이미지 아카이브", "웹사이트의 비디오 비주얼과 스크롤 모션을 큐레이션"),
    "hellomonday": ("인터랙티브 모션", "Interactive Web", "마이크로 모션 포트폴리오", "감각적인 애니메이션 및 부드러운 마이크로 인터랙션 모음", "유연한 트랜지션과 마이크로 인터랙션으로 완성하는 디테일"),
    "originkit-dev": ("인터랙티브 모션", "Product & Tech UI", "모션 UI 컴포넌트", "현대적 웹사이트를 위한 라이브 애니메이션 컴포넌트 라이브러리", "모션 UI 인터랙션을 모듈형 코드 컴포넌트로 제공"),

    # 3. 브랜드 아이덴티티
    "pentagram-com": ("브랜드 아이덴티티", "Brand Identity", "세계적 브랜드 컨설팅", "엄격한 그리드 시스템 기반 아카이브 레이아웃", "독립 디자인 컨설팅 그룹의 시스템형 아카이빙 교과서"),
    "wearecollins-com": ("브랜드 아이덴티티", "Brand Identity", "전략적 비주얼 에세이", "명확한 브랜드 명제와 스토리를 연결하는 비주얼 에세이", "기업의 전략적 방향성이 비주얼 디자인 결과물로 이어지는 서사"),
    "koto-com": ("브랜드 아이덴티티", "Brand Identity", "테크 브랜드 아이덴티티", "기술 기업 브랜드에 친근하고 인간적인 터치를 가미한 디자인", "차갑고 건조한 테크 브랜딩에 다정한 그래픽 페르소나 부여"),
    "wearemucho-com": ("브랜드 아이덴티티", "Brand Identity", "아이디어 중심 브랜딩", "명쾌하고 직관적인 비주얼 기믹과 아이디어 위주의 브랜딩 사례", "단 한 문장과 명확한 그래픽으로 브랜드를 전달하는 직관성"),
    "instrument-com": ("브랜드 아이덴티티", "Brand Identity", "대형 테크 브랜드 시스템", "구조적 안정감과 타이포 중심의 브랜드 에이전시 웹사이트", "대형 테크 브랜드 사이트의 정교한 시스템적 완성도"),
    "sainturbain-com": ("브랜드 아이덴티티", "Brand Identity", "브랜드 디자인 스튜디오", "NYC와 LA를 기반으로 한 독창적 브랜드 비주얼 아이덴티티 포트폴리오", "대담한 색상과 타이포그래피 조합으로 명확한 브랜드 성격 구축"),
    "motherdesign-com": ("브랜드 아이덴티티", "Brand Identity", "글로벌 브랜드 컨설팅", "글로벌 크리에이티브 에이전시 Mother의 브랜드 디자인 부문 아카이브", "문화적 맥락과 브랜드 스토리를 연결하는 비주얼 시스템"),
    "blvr-com": ("브랜드 아이덴티티", "Brand Identity", "신념 중심 브랜드 에이전시", "기업의 신념과 핵심 가치를 디자인으로 전환하는 브랜딩 포트폴리오", "브랜드 철학을 명확한 비주얼 톤앤매너로 변환"),
    "fellowstudio-com": ("브랜드 아이덴티티", "Brand Identity", "브랜드 전략 컨설팅", "그래픽 디자인과 브랜드 전략이 사업 성장에 미치는 영향 분석", "디자인 자산이 브랜드 가치로 전환되는 과정 전달"),
    "wolffolins-com": ("브랜드 아이덴티티", "Brand Identity", "글로벌 브랜드 컨설턴시", "세계적인 브랜드 아이덴티티 컨설팅 그룹 Wolff Olins 포트폴리오", "변혁적 브랜드 전략과 파격적 아이덴티티 구축"),

    # 4. 타이포그래피
    "darkroom-engineering": ("타이포그래피", "Typography", "가변 타이포 모션", "대형 모노스페이스 서체 가변 모션과 압도적인 웹 퍼포먼스", "타이포그래피의 가변 폰트 모션만으로 브랜딩 완성"),
    "studiodumbar-com": ("타이포그래피", "Typography", "키네틱 타이포 브랜딩", "실시간 키네틱 타이포그래피와 움직이는 키 비주얼 아카이브", "정적 로고를 넘어 끊임없이 반응하는 모션 브랜드 언어"),
    "monopo-london": ("타이포그래피", "Typography", "실험적 타이포 모션", "대담한 레이아웃과 감각적인 시각 리듬의 에이전시 포트폴리오", "불규칙한 대각선 및 파격적인 비주얼 타이포 리듬감"),
    "fontmeme-com": ("타이포그래피", "Typography", "폰트 & 타이포 리소스", "영화, 게임, 브랜드 폰트 정보 및 타이포그래피 리소스 데이터베이스", "상용 및 대중문화 폰트 스타일을 검색 가능한 아카이브로 구축"),
    "open-foundry-com": ("타이포그래피", "Typography", "오픈소스 폰트 파운드리", "무료 오픈소스 폰트 시각적 테스트 및 파운드리 플랫폼", "브라우저에서 직접 서체 무게와 인터페이스 반응성을 테스트"),

    # 5. 에디토리얼 & 출판
    "jetset-nl": ("에디토리얼 & 출판", "Editorial & Print", "미니멀 타이포 출판", "단단하고 절제된 흑백 타이포그래피와 구조적 그리드 레이아웃", "불필요한 장식을 덜어낸 모더니즘 디자인 언어의 단단함"),
    "bureau-oberhaeuser": ("에디토리얼 & 출판", "Editorial & Print", "그리드 타이포 아카이브", "정교한 그리드와 모노스페이스 타이포의 미니멀리즘 아카이브", "그리드 시스템과 타이포그래피의 엄격한 정교함"),
    "ok-rm-co-uk": ("에디토리얼 & 출판", "Editorial & Print", "독립 아트북 출판", "독립 아트북, 에디토리얼 레이아웃 중심의 정교한 아카이브", "종이와 인쇄물의 실물 절제미를 디지털 스크린 위로 전사"),
    "bookcoverarchive-com": ("에디토리얼 & 출판", "Editorial & Print", "북 커버 디자인 아카이브", "세계적인 도서 표지 디자인 및 타이포그래피 아카이브", "도서 인쇄물의 지면 디자인과 서체 배치를 아카이빙"),
    "casualoptimist-com": ("에디토리얼 & 출판", "Editorial & Print", "도서 출판 디자인 아티클", "출판 문화, 도서 디자인, 그래픽 아트를 다루는 에디토리얼 블로그", "책 표지와 출판 그래픽 비평 중심의 에디토리얼 모음"),
    "chipkidd-com": ("에디토리얼 & 출판", "Editorial & Print", "북 커버 디자이너 포트폴리오", "세계적 북 커버 디자이너 칩 키드의 대표작 아카이브", "책의 내용과 은유를 시각적 아이디어 하나로 변환하는 표현력"),

    # 6. 디자인 아카이브
    "arena": ("디자인 아카이브", "Archive & Curation", "블록 연결형 지식 아카이브", "마인드맵과 블록 연결형 아카이빙 지식 탐색 플랫폼", "텍스트와 이미지를 하이퍼링크 블록 체계로 잇는 아카이빙"),
    "cosmos-so": ("디자인 아카이브", "Archive & Curation", "무드보드 비주얼 아카이브", "여백 중심의 시각 레퍼런스 무드보드 아카이브 인터페이스", "이미지 자체만 말하게 하는 극제된 아카이빙 그리드 레이아웃"),
    "savee-it": ("디자인 아카이브", "Archive & Curation", "디자이너 비주얼 아카이브", "디자이너를 위한 고화질 비주얼 스피드 아카이빙 그리드", "최소한의 UI 억제와 완벽한 이미지 정렬 비율"),
    "siteinspire": ("디자인 아카이브", "Archive & Curation", "웹 디자인 필터 아카이브", "정갈한 그리드 필터링 아카이브의 클래식 표준", "태그와 태그 검색만으로 탐색하는 텍스트 중심 아카이브 구조"),
    "brandingstyleguides-com": ("디자인 아카이브", "Archive & Curation", "브랜드 가이드라인 아카이브", "글로벌 기업들의 공식 브랜드 스타일 가이드 PDF 아카이브", "브랜드 규정집과 가이드라인 시스템을 정교하게 수집"),
    "identitydesigned-com": ("디자인 아카이브", "Archive & Curation", "브랜드 아이덴티티 쇼케이스", "전 세계 우수 브랜드 아이덴티티 케이스 스터디 아카이브", "브랜드의 탄생 과정과 결과물을 깊이 있게 기록하는 저널"),
    "uijar-com": ("디자인 아카이브", "Archive & Curation", "UI 디자인 인스피레이션", "실무 프로젝트를 위한 엄선된 UI/UX 디자인 레퍼런스 모음", "실용적인 화면 레이아웃과 UI 디자인 인스피레이션 큐레이션"),
    "inspirationfeed-com": ("디자인 아카이브", "Archive & Curation", "일본 그래픽 디자인 컬렉션", "60가지 뛰어난 일본 그래픽 디자인 사례 및 비주얼 컬렉션", "동양적 타이포그래피와 여백 활용 디자인 레퍼런스 큐레이션"),

    # 7. 디지털 제품 & UI
    "teenage-engineering": ("디지털 제품 & UI", "Product & Tech UI", "하드웨어 매뉴얼 UI", "제품 사이트를 기계 매뉴얼 및 도면 스타일로 구현한 인터페이스", "하드웨어 매뉴얼의 조형미를 웹 아카이브 인터페이스로 치환"),
    "cursor-com": ("디지털 제품 & UI", "Product & Tech UI", "AI 코드 에디터 브랜딩", "개발 툴 UI의 실용성과 현대적 다크/라이트 브랜딩의 결합", "실용적 개발자 툴 인터페이스와 세련된 웹 브랜딩 결합"),
    "material-io": ("디지털 제품 & UI", "Product & Tech UI", "구글 디자인 시스템", "구글의 오픈소스 머티리얼 디자인 가이드라인 및 컴포넌트", "글로벌 모바일/웹 UI 표준을 디자인 시스템으로 정립"),
    "cmf-designdb-com": ("디지털 제품 & UI", "Product & Tech UI", "CMF 디자인 DB", "소재, 가공, 마감(Color, Material, Finish) 산업 디자인 데이터베이스", "제품 디자인의 질감과 소재 데이터를 체계적으로 아카이빙"),
    "canva-com": ("디지털 제품 & UI", "Product & Tech UI", "웹 기반 그래픽 툴", "누구나 쉽게 사용할 수 있는 웹 기반 그래픽 디자인 플랫폼", "복잡한 그래픽 툴을 웹 브라우저 UI로 단순화"),
    "grabcad-com": ("디지털 제품 & UI", "Product & Tech UI", "3D 엔지니어링 커뮤니티", "엔지니어와 디자이너를 위한 3D CAD 모델 라이브러리", "기계 공학 3D 도면 및 모델링 데이터 아카이빙"),

    # 8. 미디어 아트 & 3D
    "refikanadol-com": ("미디어 아트 & 3D", "Media Art & Gallery", "AI 파라메트릭 미디어 아트", "데이터 알고리즘과 AI를 활용한 세계적 미디어 아티스트 레픽 아나돌 아카이브", "방대한 데이터 입자를 3D 조각과 미디어 캔버스로 변환"),
    "whitney-org": ("미디어 아트 & 3D", "Media Art & Gallery", "현대 미술관 전시", "휘트니 미술관의 현대 미술 전시 및 미디어 아카이브", "미술관 전시 콘텐츠의 에디토리얼 웹 인터페이스"),
    "bluedotstudio-tv": ("미디어 아트 & 3D", "Motion & 3D Studio", "3D 애니메이션 스튜디오", "고품질 3D 애니메이션 및 캐릭터 모션 그래픽 포트폴리오", "3D 캐릭터 렌더링과 사운드 디렉팅의 완성도"),
    "tendril-studio": ("미디어 아트 & 3D", "Motion & 3D Studio", "하이엔드 CGI & 모션", "글로벌 테크/패션 브랜드를 위한 하이엔드 3D CGI 애니메이션 포트폴리오", "유기적인 텍스처 렌더링과 시네마틱 모션의 결합"),
    "vixen-studios-com": ("미디어 아트 & 3D", "Motion & 3D Studio", "VFX & 3D 크리에이티브", "3D 비주얼 효과, VFX, 상업 모션 그래픽 아카이브", "상업 브랜딩을 위한 CGI 비주얼 연출"),
    "misa-art": ("미디어 아트 & 3D", "Media Art & Gallery", "글로벌 아트 갤러리", "디지털 아트, NFT, 동시대 미술품을 아우르는 글로벌 아트 플랫폼", "전통 미술과 디지털 미디어 아트를 연결하는 전시 큐레이션"),
    "impossibleforms-org": ("미디어 아트 & 3D", "Media Art & Gallery", "실험적 미디어 아트 플랫폼", "대안적 예술 표현과 문화적 담론을 담은 미디어 프로젝트 아카이브", "비판적 예술 탐구와 미디어 아트를 결합한 디지털 스페이스"),

    # 9. 실험적 웹
    "neal-fun": ("실험적 웹", "Experimental Web", "비주얼 아이디어 모음", "기발한 비주얼 상상력과 미니 인터랙티브 컨텐츠 모음", "복잡한 웹 기술 대신 확실한 기획 아이디어 하나로 몰입 유발"),
    "poolsuite-net": ("실험적 웹", "Experimental Web", "레트로 OS 라디오", "레트로 90년대 OS 윈도우 UI 기반 라디오 및 음악 플레이어", "브랜드 정체성 자체를 인터랙티브 비주얼 OS 플레이어로 구현"),
    "patatap-com": ("실험적 웹", "Experimental Web", "키보드 사운드 캔버스", "키보드 입력 반응형 2D 그래픽 캔버스 및 사운드 시퀀싱", "키보드 키 입력 단 하나로 시각 반응과 오디오를 1:1 완벽 동기화"),
    "pointerpointer": ("실험적 웹", "Experimental Web", "커서 가리키기 기믹", "사용자의 커서 위치 좌표를 가리키는 실제 사람 사진을 매칭", "단 하나의 농담 같은 위트 기믹 아이디어를 고수해 만든 유머"),
    "zoomquilt": ("실험적 웹", "Experimental Web", "무한 줌인 아키텍처", "그림 프레임 속으로 무한히 깊이 들어가는 줌인 애니메이션 아트", "반복적 물리 줌 렌더링만으로 한계 없는 깊이감 창출"),
    "quickdraw": ("실험적 웹", "Experimental Web", "AI 낙서 게임", "유저가 그린 낙서를 AI가 20초 안에 맞히는 스케치 게임 인터랙션", "데이터 수집 프로세스를 놀이 인터랙션으로 전환"),
    "paperplanes": ("실험적 웹", "Experimental Web", "종이비행기 날리기", "스마트폰으로 접은 비행기를 날리면 글로벌 화면 속으로 들어가는 웹", "모바일 센서와 WebGL 글로벌 3D 공간을 이어주는 대륙간 인터랙션"),
    "ciechanowski": ("실험적 웹", "Experimental Web", "인터랙티브 원리 해설", "기계 및 물리 작동 원리를 실시간 조작 캔버스로 해설하는 아티클", "지식 설명형 웹 인터랙션이 도달할 수 있는 최고 수준의 직관성"),
    "ncase-me": ("실험적 웹", "Experimental Web", "시스템 시뮬레이션 게임", "사회적 시스템과 이론을 직접 조작하는 시뮬레이션 게임", "복잡한 개념과 이론을 플레이어의 직관적 선택 게임으로 전달"),
    "windows93": ("실험적 웹", "Experimental Web", "패러디 OS 웹스페이스", "90년대 가짜 윈도우 OS 패러디와 다양한 미니 프로그램 인터랙션", "B급 서브컬처 패러디와 브라우저 속 OS 가상화의 결합"),
    "mschf": ("실험적 웹", "Experimental Web", "브랜드 아이디어 실험실", "격주 드롭 형식의 기발한 사물과 가짜 브랜딩 인터랙션", "브랜드 사이트 자체가 하나의 유쾌한 장난이자 예술 실험인 형태"),
    "experiments-with-google": ("실험적 웹", "Experimental Web", "크롬 웹실험 아카이브", "세계적인 웹 익스페리언스 및 기술 실습 프로젝트 아카이브", "기술과 예술의 경계를 넘나드는 커뮤니티형 웹 실험 데이터베이스"),
    "codrops": ("실험적 웹", "Experimental Web", "웹 애니메이션 데모", "최신 웹 애니메이션, 셰이더, UI 인터랙션 데모 교과서", "웹 프론트엔드 모션 인터랙션의 표준 기술과 소스 아카이빙"),
    "hydra-livecoding": ("실험적 웹", "Experimental Web", "라이브 코딩 비주얼", "브라우저 라이브 코딩 비주얼 렌더링 및 비디오 믹싱 툴", "실시간 코드 입력을 아날로그 질감의 그래픽으로 연결"),
    "lynn-and-tonic": ("실험적 웹", "Experimental Web", "컨셉 파격 포트폴리오", "해마다 완전히 새로운 컨셉과 레이아웃으로 개편되는 포트폴리오", "단일 웹사이트가 가질 수 있는 컨셉 변경의 무한한 자유도"),
    "superflux": ("실험적 웹", "Experimental Web", "비선형 미래 서사", "비선형적 서사와 미래 시나리오 기반의 아카이브 탐색", "디자인을 고찰과 내러티브 탐구의 도구로 다루는 비선형 웹"),
}

# General fallback rule generator based on domain and text
def process_item(item):
    iid = item.get('id', '')
    if iid in mappings:
        tag, cat, short, anat, princ = mappings[iid]
        item['tags'] = [tag]
        item['category'] = cat
        item['shortDesc'] = short
        item['anatomy'] = anat
        item['principle'] = princ
        return item

    title = item.get('title', '')
    url = item.get('url', '')

    # Default rules for remaining audited items
    if any(k in title.lower() or k in url.lower() for k in ['brand', 'identity', 'consultancy', 'fellowstudio', 'jkrglobal', 'naranjoetxeberria', 'order.design', 'ordinarypeople', 'daeki', 'blvr']):
        tag = '브랜드 아이덴티티'
        cat = 'Brand Identity'
        short = '브랜드 아이덴티티'
        anat = f"{title} - 브랜드 비주얼 아이덴티티 및 브랜딩 케이스 스터디"
        princ = "브랜드 전략과 비주얼 시스템을 명확하게 표현하는 아카이브"
    elif any(k in title.lower() or k in url.lower() for k in ['archive', 'inspiration', 'curated', 'feed', 'gallery', 'uijar', 'savee', 'siteinspire', 'bookcover']):
        tag = '디자인 아카이브'
        cat = 'Archive & Curation'
        short = '디자인 아카이브'
        anat = f"{title} - 그래픽 및 웹 디자인 큐레이션 모음"
        princ = "엄선된 시각 자료와 아카이빙 체계를 제공"
    elif any(k in title.lower() or k in url.lower() for k in ['font', 'type', 'typography', 'lettering']):
        tag = '타이포그래피'
        cat = 'Typography'
        short = '타이포그래피 리소스'
        anat = f"{title} - 서체 디자인 및 타이포그래피 탐색 레퍼런스"
        princ = "폰트 형태와 타이포 그래픽 배치의 기술적/예술적 사례"
    elif any(k in title.lower() or k in url.lower() for k in ['motion', '3d', 'vfx', 'animation', 'tendril', 'bluedot']):
        tag = '미디어 아트 & 3D'
        cat = 'Motion & 3D Studio'
        short = '3D 모션 그래픽'
        anat = f"{title} - 3D 애니메이션 및 모션 그래픽 프로젝트"
        princ = "역동적인 3D 비주얼과 모션 기술의 결합"
    elif any(k in title.lower() or k in url.lower() for k in ['art', 'museum', 'exhibition', 'gallery', 'whitney', 'impossibleforms']):
        tag = '미디어 아트 & 3D'
        cat = 'Media Art & Gallery'
        short = '미디어 아트 & 전시'
        anat = f"{title} - 미디어 아트 및 디지털 전시 프로젝트"
        princ = "예술적 시도와 미디어 기술의 결합을 보여주는 전시기획"
    elif any(k in title.lower() or k in url.lower() for k in ['publish', 'editorial', 'book', 'magazine']):
        tag = '에디토리얼 & 출판'
        cat = 'Editorial & Print'
        short = '에디토리얼 출판'
        anat = f"{title} - 인쇄물 및 에디토리얼 레이아웃 디자인"
        princ = "그리드 체계와 지면 편집의 정교함"
    elif any(k in title.lower() or k in url.lower() for k in ['app', 'tool', 'component', 'ui', 'kit', 'dev', 'system', 'material']):
        tag = '디지털 제품 & UI'
        cat = 'Product & Tech UI'
        short = '디지털 제품 & UI'
        anat = f"{title} - UI/UX 디자인 시스템 및 제품 인터페이스"
        princ = "사용자 경험 중심의 기능적 인터페이스 디자인"
    else:
        tag = '디자인 스튜디오'
        cat = 'Graphic Design Studio'
        short = '디자인 스튜디오'
        anat = f"{title} - 그래픽 디자인 및 크리에이티브 포트폴리오"
        princ = "독창적인 비주얼 언어와 프로젝트 아카이빙"

    item['tags'] = [tag]
    item['category'] = cat
    item['shortDesc'] = short
    item['anatomy'] = anat
    item['principle'] = princ
    return item

processed_items = [process_item(item) for item in items]

# Format python data into TypeScript code
ts_code = "import { Reference } from '../types';\n\nexport const SEED_REFERENCES: Reference[] = " + json.dumps(processed_items, ensure_ascii=False, indent=2) + ";\n"

with open('lib/data/seed.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print(f"Successfully processed {len(processed_items)} items and updated seed.ts!")

