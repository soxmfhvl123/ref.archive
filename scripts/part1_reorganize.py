import json
import re
import os

with open('lib/data/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const SEED_REFERENCES: Reference\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Error: could not find SEED_REFERENCES")
    exit(1)

items = json.loads(match.group(1))
print(f"Initial count: {len(items)}")

# 1. 21 IDs to delete
DELETE_21_IDS = {
    'kamponggelamorous-com', 'formist-co', 'chipkidd-com', 'canva-com',
    'prism-springtail-3rk4-squarespace-com', 'grabcad-com', 'jam3',
    'sneakerfreaker-com', 'graphicmama-com', 'inspirationfeed-com',
    'fellowstudio-com', 'getty-edu', 'misa-art', 'gallery-canary-yellow-com',
    'vaultartspace-gucci-com', 'gonzalorodriguez-studio', 'fire-work-fr',
    'ryokoloves-art', 'wax-studios-com', 'forzonistudios-com', 'werkgraphic-com'
}

items = [item for item in items if item['id'] not in DELETE_21_IDS]
print(f"After deletion of 21 IDs: {len(items)}")

# 2. Rename tag "미디어 아트 & 3D" -> "미디어 아트 & 전시"
for item in items:
    item['tags'] = ['미디어 아트 & 전시' if t == '미디어 아트 & 3D' else t for t in item['tags']]

# 3. URL / title 수정
for item in items:
    if item['id'] == 'virgilabloh-com':
        item['url'] = 'https://www.virgilabloh.com/'
        item['title'] = 'The Virgil Abloh Archive'
    elif item['id'] == 'homelesspenthouse-com':
        item['url'] = 'https://www.homelesspenthouse.com/'
    elif item['id'] == 'open-foundry-com':
        item['url'] = 'https://open-foundry.com/'
    elif item['id'] == 'hayonstudio-com':
        item['url'] = 'https://hayonstudio.com/'
    elif item['id'] == 'p-kim-info':
        item['title'] = 'P-K — Phillip Windly Kim'

# 4. 재분류: id | 새 tags | 새 shortDesc
RECLASSIFY = {
    'virgilabloh-com': ('디자인 아카이브', '버질 아블로 아카이브'),
    'public-domain-com': ('디자인 아카이브', '버질 아블로 PUBLIC DOMAIN'),
    'gdbot-tumblr-com': ('디자인 아카이브', '그래픽 디자인 큐레이션'),
    'fuckyou-design': ('디자인 아카이브', '제보형 비주얼 큐레이션'),
    'brandarchive-xyz': ('디자인 아카이브', '브랜드 아이덴티티 DB'),
    'godly-website': ('디자인 아카이브', '웹 디자인 큐레이션'),
    'superflux': ('디자인 스튜디오', '스페큘러티브 디자인'),
    'studio-funday-com': ('디자인 스튜디오', '영화·공연 포스터 디자인'),
    'designbby-com': ('디자인 스튜디오', '게임 업계 브랜딩'),
    'mdesign-designhouse-co-kr': ('매거진 & 블로그', '국내 디자인 월간지'),
    'designdb-com': ('매거진 & 블로그', '국내 디자인 뉴스 DB'),
    'creativeboom-com': ('매거진 & 블로그', '크리에이티브 매거진'),
    'booooooom-com': ('매거진 & 블로그', '아트·사진 매거진'),
    'creativeapplications-net': ('매거진 & 블로그', '크리에이티브 테크 저널'),
    'thedieline-com': ('매거진 & 블로그', '패키징 디자인 매거진'),
    'underconsideration-com': ('매거진 & 블로그', '리브랜딩 리뷰 블로그'),
    'the-brandidentity-com': ('매거진 & 블로그', '브랜딩 매거진'),
    'visualjournal-it': ('매거진 & 블로그', '브랜딩·그래픽 저널'),
    'window-swap': ('실험적 웹', '세계의 창문 풍경'),
    'pudding-cool': ('실험적 웹', '데이터 저널리즘 에세이'),
    'darkroom-engineering': ('인터랙티브 모션', '웹 개발 스튜디오'),
    'obys-agency': ('인터랙티브 모션', '모션 웹 에이전시'),
    'basement-studio': ('3D WebGL', '3D 웹 디지털 스튜디오'),
    'monopo-london': ('브랜드 아이덴티티', '크리에이티브 에이전시'),
    '25ah-se': ('브랜드 아이덴티티', '스톡홀름 디자인 에이전시'),
    'p-kim-info': ('브랜드 아이덴티티', '브랜딩·크리에이티브 디렉터'),
    'vosk-design': ('브랜드 아이덴티티', '브랜드·디지털 스튜디오'),
    'olssonbarbieri-com': ('브랜드 아이덴티티', '오슬로 패키징 스튜디오'),
    'rodrigocorral-com': ('에디토리얼 & 출판', '북커버 디자인 스튜디오'),
    'johngalldesign-com': ('에디토리얼 & 출판', '북커버 디자이너'),
    'alvinlustig-com': ('에디토리얼 & 출판', '모던 북커버 아카이브'),
    'tendril-studio': ('모션 & 3D', '하이엔드 CGI & 모션'),
    'bluedotstudio-tv': ('모션 & 3D', '3D 애니메이션 스튜디오'),
    'vixen-studios-com': ('모션 & 3D', 'VFX & 3D 크리에이티브'),
    'gryun-notion-site': ('모션 & 3D', '모션그래픽 링크 모음'),
    'artstation-com': ('모션 & 3D', 'CG 아티스트 커뮤니티'),
    'jacksachs-tumblr-com': ('모션 & 3D', '3D 일러스트·애니메이션'),
    'jvg-es': ('모션 & 3D', 'CGI 광고 프로덕션'),
    'teamblackcat-ch': ('모션 & 3D', '3D 아티스트 콜렉티브'),
    'handsomefrank-com': ('일러스트 & 아티스트', '일러스트 에이전시'),
    'artworld-agency': ('일러스트 & 아티스트', '아티스트 매니지먼트'),
    'vivienscreative-com-au': ('일러스트 & 아티스트', '아티스트 매니지먼트'),
    'the-museum-visitor-com': ('패션 & 컬처', '서울 아트&디자인 패션 브랜드'),
    'kr-etudes-studio-com': ('패션 & 컬처', '파리 패션 브랜드'),
    'ls-graphics': ('리소스 & 툴', '무료 목업 리소스'),
    'unblast-com': ('리소스 & 툴', '무료 디자인 리소스'),
    'codrops': ('리소스 & 툴', '웹 애니메이션 튜토리얼'),
    'originkit-dev': ('리소스 & 툴', '모션 UI 컴포넌트'),
    'designer-story-tistory-com': ('리소스 & 툴', '피그마 강좌 블로그'),
    'uijar-com': ('디지털 제품 & UI', 'UI 디자인 인스피레이션'),
    'chiselandmouse-com': ('오브제 & 아트토이', '건축 모형 오브제'),
    'hayonstudio-com': ('오브제 & 아트토이', '하이메 아욘 오브제·가구'),
    'homelesspenthouse-com': ('오브제 & 아트토이', '리빙 오브제 셀렉트숍'),
    'random-studio': ('공간 & 전시 디자인', '경험 디자인 스튜디오'),
    'arauna-studio': ('공간 & 전시 디자인', '환경그래픽·사인 디자인'),
    'jongkimdesign-com': ('공간 & 전시 디자인', '공간 전략 디자인')
}

for item in items:
    iid = item['id']
    if iid in RECLASSIFY:
        new_tag, new_short = RECLASSIFY[iid]
        item['tags'] = [new_tag]
        item['shortDesc'] = new_short

# 5. anatomy / principle 수정: id | anatomy | principle
ANATOMY_PRINCIPLE = {
    'studiofeixen-ch': ('스위스 루체른의 멀티디서플린 디자인 스튜디오. 그래픽·타입·애니메이션·제품·공간 디자인', '기하학 형태와 강렬한 색의 포스터, 자체 서체와 디자인 툴 공개'),
    'heystudio-es': ('2007년 설립된 바르셀로나 크리에이티브 스튜디오. 브랜드 전략과 비주얼 언어 설계', '기본 도형과 원색으로 만드는 명쾌한 그래픽 시스템'),
    'everyday-practice-com': ('서울 그래픽 디자인 스튜디오 일상의실천. 전시·출판·아이덴티티·웹 작업', '사회적 주제를 다루는 전시 그래픽과 분야별로 정리된 작업 아카이브'),
    'window-swap': ('전 세계 사람들이 찍은 창밖 풍경 영상을 랜덤으로 보여주는 웹', '버튼 하나로 다른 장소를 여는 단순한 인터랙션과 정서적 콘셉트'),
    'obys-agency': ('유럽 기반 콘셉트 중심 디자인 스튜디오. 브랜드·웹 경험 제작 (Porsche Taycan, Miro, Peter Lindbergh 프로젝트)', '에디토리얼 레이아웃과 이미지 전환 모션의 하이엔드 웹 연출'),
    'basement-studio': ('웹사이트·브랜딩·3D·모션을 다루는 디지털 스튜디오 (Vercel, MrBeast, KidSuper 등)', '회사 공간을 3D 씬으로 만든 홈페이지와 개발 중심 브랜드 톤'),
    'visualjournal-it': ('이탈리아 아트디렉터 Alessandro Scarpellini가 운영하는 브랜딩·그래픽 디자인 큐레이션 저널', '모더니즘·환원주의 성향의 브랜딩 프로젝트 큐레이션'),
    'vosk-design': ('Yandex Pay 등과 작업한 브랜드·디지털 디자인 스튜디오 VOSK', '네이밍·아이덴티티·브랜드 웹사이트를 함께 설계하는 방식'),
    'homelesspenthouse-com': ('가구·조명·오브제·월아트를 파는 리빙 셀렉트숍 Homeless Penthouse', '미니멀하지만 위트 있는 오브제 큐레이션'),
    'fuckyou-design': ('이미지 제보(Submit)로 운영되는 비주얼 큐레이션 블로그', '조각·사진·3D 등 장르를 가리지 않는 강한 이미지 모음'),
    'brandarchive-xyz': ('로고·어플리케이션·아트디렉션을 업종·디자인 회사별로 모은 브랜드 아카이브 (일부 PRO 유료)', '디자인 회사별(Pentagram, Koto, JKR 등) 브랜드 사례 비교'),
    'ls-graphics': ('PSD·Sketch·Figma용 목업 리소스 사이트 (무료 + 유료 구독)', '프레젠테이션용 목업 소스'),
    'anothergraphic-org': ('그래픽·타이포 작업을 소개하는 아카이브 Another Graphic. 독일 디자이너 Cihan Tamti의 포스터 페이지', '흑백 실험적 타이포 포스터'),
    'gdbot-tumblr-com': ('레이아웃·매거진 등 그래픽 디자인 이미지를 태그로 분류해 모으는 텀블러', '인쇄물 중심의 그래픽 레퍼런스 큐레이션'),
    'iframefonts-gumroad-com': ('iFrame Fonts의 무료 디스플레이 서체 Kica (v2.0) 배포 페이지', '깔끔한 선과 굵은 획의 기하학적 디스플레이 서체'),
    'mouthwash-studio': ('LA 디자인 스튜디오 MOUTHWASH. Nike, The North Face, Apple Music, OpenAI 등과 작업', '아이덴티티·모션·캠페인을 산업·서비스 필터로 정리한 포트폴리오'),
    'artworld-agency': ('뉴욕·런던·파리 기반 아티스트 매니지먼트. 포토그래퍼·디렉터·CGI 아티스트·스타일리스트 대표', '아티스트 이름을 큰 세리프 타이포로 나열하는 로스터 레이아웃'),
    'the-brandidentity-com': ('브랜드 아이덴티티 프로젝트와 칼럼을 다루는 매거진', '최신 아이덴티티 사례와 브랜딩 비평'),
    'thedistrict-co-uk': ('영국 케임브리지의 디자인 프랙티스. 네이밍·캠페인·패키징·전시·출판까지', '브랜드를 글·이미지·전시로 확장하는 통합적 작업'),
    'jvg-es': ('마드리드 아트디렉션·프로덕션 스튜디오 JVG. 브랜드 CGI 광고 영상 제작 (Brio Aqua Flux)', '제품을 아트디렉션 중심의 CGI 장면으로 연출하는 방식'),
    'the-museum-visitor-com': ('서울 성수동 기반 아트&디자인 스튜디오 겸 패션 브랜드', '의류·협업·전시를 함께 운영하는 브랜드 구조'),
    'spacetypegenerator-com': ('Kiel Danger Mark(kielm)가 만든 키네틱 타이포 생성 웹 툴 (POW 모드)', '슬라이더 조작만으로 타이포 모션을 실시간 생성하는 방식'),
    'kr-etudes-studio-com': ('2012년 설립된 파리 기성복 브랜드 Études 한국 공식몰', '워크웨어 기반 컬렉션과 캠페인 비주얼'),
    'booooooom-com': ('아트·일러스트·사진을 소개하는 캐나다 아트 매거진·커뮤니티', '신진 아티스트 발굴과 공모전(Booooooom Awards)'),
    'mdesign-designhouse-co-kr': ('디자인하우스의 월간 <디자인> 웹사이트', '국내 디자인 프로젝트·인물 기사와 업계 흐름'),
    'designdb-com': ('한국디자인진흥원 디자인DB. 디자인 뉴스·트렌드·자료', '국내외 디자인 동향과 리서치 자료'),
    'materialdistrict-com': ('건축·인테리어·제품용 신소재 데이터베이스', '소재 검색으로 공간·오브제 마감재 탐색'),
    'thedieline-com': ('패키징 디자인 프로젝트와 업계 뉴스 매거진', '카테고리별 패키지 디자인 사례'),
    'playgroundparis-com': ('파리 그래픽 디자인 스튜디오 Playground. 모션·인쇄·일러스트 (Pitchfork 페스티벌 포스터, Radio Nova 아이덴티티 등)', '음악·문화 행사 포스터와 아이덴티티'),
    'handsomefrank-com': ('런던 일러스트레이션 에이전시', '스타일별 일러스트레이터 탐색과 커미션 사례'),
    'designer-story-tistory-com': ('안연정의 피그마 강좌 블로그 (유튜브 채널 병행)', '피그마 기능·디자인 시스템·플러그인 활용법'),
    'posterfortomorrow-org': ('인권·사회 이슈를 주제로 한 국제 포스터 공모전 아카이브', '메시지 중심 포스터 표현과 주제별 포스터 갤러리'),
    'ndc-co-jp': ('하라 켄야의 Nippon Design Center 하라 디자인 연구소', '무인양품 아트디렉션 등 여백과 소재감의 일본 디자인'),
    'alvinlustig-com': ('미국 모던 디자인 선구자 앨빈 러스티그의 북커버·작업 아카이브', '모더니즘 추상 형태를 쓴 북커버 디자인'),
    'johngalldesign-com': ('북커버 디자이너 존 갈의 포트폴리오', '콜라주와 타이포로 책 내용을 압축한 커버'),
    'underconsideration-com': ('기업·기관의 리브랜딩을 리뷰하는 블로그 Brand New', '리브랜딩 전후 비교와 비평'),
    'unblast-com': ('목업·폰트·아이콘 등 무료 디자인 리소스 사이트', '작업용 무료 소스'),
    'chiselandmouse-com': ('손으로 만드는 건축 모형·3D 시티맵 오브제 브랜드 Chisel & Mouse', '건축 형태를 석고 미니어처 오브제로 축소하는 조형'),
    'virgilabloh-com': ('버질 아블로 아카이브(V.A.A.). 2만 점 이상의 작업물·컬렉션·라이브러리를 관리하는 공식 아카이브', '아카이브를 문서·매뉴얼처럼 구성한 그래픽과 라벨링 타이포'),
    'rodrigocorral-com': ('뉴욕 북커버 디자인 스튜디오 Rodrigo Corral Design', '강한 오브젝트 이미지 하나로 만드는 북커버'),
    'ordinarypeople-info': ('서울 브랜드 전략·아트디렉션 스튜디오 오디너리피플. 올리브영 BI, 호암미술관 MI, 정국 \'Seven\' 앨범 커버, Netflix K-Content', '기업·미술관·K-pop을 오가는 아이덴티티 시스템'),
    'daeki-and-jun-com': ('서울 그래픽 디자인 스튜디오 대기와 준. DDP·강원특별자치도 브랜딩, 타이포잔치 2017', '아이덴티티·전시·타이포그래피를 넘나드는 작업'),
    'p-kim-info': ('샌프란시스코 기반 브랜딩·크리에이티브 디렉터 Phillip Windly Kim. Nike, NEED, Sundae School, Descente 등', '브랜딩·아트디렉션·공간까지 이어지는 작업과 연도별 리스트형 아카이브'),
    'naranjoetxeberria-com': ('2014년 설립된 마드리드 크리에이티브 프로젝트 N-E. Loewe, Hermès, Farfetch, Zara 등', '패션 브랜드를 위한 브랜딩·에디토리얼·아트디렉션'),
    'order-design': ('뉴욕 디자인 스튜디오 Order (NASA·NYCTA 그래픽 표준 매뉴얼 복간)', '시스템적 아이덴티티와 매뉴얼 디자인'),
    'jkrglobal-com': ('런던 기반 글로벌 브랜드 디자인 회사 Jones Knowles Ritchie', '대형 소비재 리브랜딩(버거킹 등)의 아이덴티티 시스템'),
    'creativeboom-com': ('아트·디자인·일러스트 소식을 다루는 영국 크리에이티브 매거진', '디자인 스튜디오 인터뷰와 프로젝트 소개'),
    'creativeapplications-net': ('아트·테크·크리에이티브 코딩 프로젝트를 다루는 저널', '미디어 아트·제너러티브 작업과 기술적 맥락'),
    'studio-remote-kr': ('서울·헬싱키 기반 그래픽 디자인 스튜디오 리모트. MMCA, 서울시립미술관, 국립중앙박물관, 29CM 등', '미술관·문화기관 아이덴티티와 에디토리얼, 자체 출판 프로젝트'),
    'vivienscreative-com-au': ('시드니·퍼스 기반 포토그래퍼·스타일리스트·헤어·메이크업 아티스트 매니지먼트', '아티스트별 포트폴리오 구성과 대형 타이포 로고'),
    'olssonbarbieri-com': ('오슬로 디자인 스튜디오. 와인·증류주·식음료 패키징과 아이덴티티 (ADC 2024 Boutique Design Studio of the Year)', '클래식한 타이포와 재료감의 패키징'),
    'teamblackcat-ch': ('스위스 기반 60명 이상의 3D·애니메이션 아티스트 콜렉티브', '3D 아트·모션·사운드를 통합한 비주얼 제작'),
    'forma-co': ('바르셀로나 그래픽·일러스트 스튜디오. Visa 아이콘 시스템, Barraquer 픽토그램, 카탈루냐 국립극장 아이덴티티', '아이콘·픽토그램·사인 시스템과 포스터 타이포'),
    'studio-funday-com': ('국내 영화·드라마·공연 포스터(키아트) 디자인 스튜디오', '인물과 분위기 중심의 포스터 키비주얼'),
    'houseofgul-com': ('포틀랜드·뉴욕 기반 Ali Godil의 크리에이티브 스튜디오. Netflix, Soho House, Adobe Foundation 등', '클라이언트·프로젝트를 타이포 목록으로 보여주는 레이아웃'),
    'aline-studio': ('샌프란시스코·런던·내슈빌 기반 브랜딩 스튜디오 A LINE. 테크 성장 기업 브랜딩', '전략과 아이덴티티를 연결하는 테크 브랜딩'),
    '28k-studio': ('스칸디나비아 디지털 디자인 스튜디오 28k. 웹·브랜드·프로덕트 디자인', '"평균 인생 약 28,000일" 콘셉트로 시작하는 다크 톤 웹사이트'),
    '25ah-se': ('스톡홀름 디자인 에이전시 Twenty-Five Art House. 브랜드 디자인과 필름 (스톡홀름국제영화제, Market Art Fair, Scandic Hotels)', '상업 전략 위에 비관습적인 디자인을 얹는 방식'),
    'doberman-co': ('EY Studio+ 소속 디자인 에이전시 EY Doberman. 브랜딩·웹·UI·접근성 (MoMA, IBM, Wealthsimple 등)', '서비스·디지털 제품 중심의 브랜드 경험'),
    'fold7-com': ('Miroma 그룹 소속 크리에이티브 광고 스튜디오(B Corp). Carlsberg, Adidas, Audible 등', '캠페인·브랜드 플랫폼 중심의 광고 크리에이티브'),
    'acre-studio': ('런던 디자인 회사 ACRE. 브랜드 아이덴티티·모션·디지털 디자인 (PORT Magazine 등)', '아이덴티티를 모션으로 확장하는 방식'),
    'arauna-studio': ('바르셀로나 Dani Rubio Arauna의 그래픽 스튜디오. 병원·양조장·문화기관의 환경그래픽·사인·전시 디자인', '공간에 입히는 환경그래픽과 사인 시스템'),
    'alphamark-design': ('북마케도니아 스코페 기반 B2B 브랜딩 스튜디오', 'B2B 브랜드 아이덴티티와 Webflow 웹사이트'),
    'apracticeforeverydaylife-com': ('런던 그래픽 스튜디오 A Practice for Everyday Life', '미술관·문화기관 아이덴티티와 출판 디자인'),
    '5-5-paris': ('파리 디자인 스튜디오 5.5. 아이덴티티·공간·제품·패키징 (루브르 서점, 파리 디자인위크 x 슈나이더 일렉트릭)', '브랜딩과 공간·오브제를 오가는 작업'),
    'trabuc-co': ('펜타그램 파트너 A.A. Trabucco-Campos. 아이덴티티·타이포그래피·리서치, 독립 출판사 Vernacular 공동 설립', '타이포 리서치 기반 아이덴티티'),
    'afom-com-au': ('호주 브랜드·디지털 스튜디오 A Friend of Mine. Lune Croissanterie, Great Wrap 등', '하우스 스타일 없이 브랜드마다 다른 아이덴티티 설계'),
    'hayonstudio-com': ('스페인 발렌시아의 하이메 아욘 스튜디오. 가구·조명·인테리어·한정판 아트피스·설치', '장식성과 캐릭터적인 형태의 오브제'),
    '21-87-co-uk': ('Matt Busher의 런던 디자인 스튜디오. 아트디렉션·브랜드·패키징·공간 (Acne Studios, Soho Home 등)', '패션·라이프스타일 브랜드의 절제된 아트디렉션'),
    'public-domain-com': ('버질 아블로가 설립한 실험적 리서치·디자인 프랙티스 PUBLIC DOMAIN의 아카이브 (Nike 협업)', '데스크톱 폴더 메타포로 탐색하는 아카이브 인터페이스'),
    'jacksachs-tumblr-com': ('3D 일러스트레이터·애니메이터 Jack Sachs의 개인 작업 (새 Gumball 로고·인트로 디자인)', '장난스러운 3D 캐릭터와 질감 있는 타이포'),
    'seunghoi-com': ('포틀랜드 기반 디자이너 안승회의 포트폴리오', '프로젝트별 상세 페이지 구성'),
    'clay-global': ('샌프란시스코 등 다수 오피스의 UI/UX·브랜딩 에이전시 Clay. Slack, Stripe, Google 등', '테크 기업 웹·제품 디자인'),
    'gryun-notion-site': ('모션그래픽 디자이너 김그륜이 정리한 모션 아티스트·회사·타이틀 시퀀스·툴 링크 모음', '모션 레퍼런스를 찾기 위한 출발점'),
    'ideo-com': ('인간 중심 디자인으로 알려진 글로벌 디자인·혁신 회사', '디자인 씽킹과 서비스 디자인 사례'),
    'artstation-com': ('게임·영화 CG 아티스트 포트폴리오 플랫폼', '컨셉 아트·3D 캐릭터·환경 아트'),
    'designbby-com': ('게임 업계(온라인 카지노·포커·복권 등) 전문 LA 디자인 스튜디오. 웹사이트·로고·CI', '게임 플랫폼용 브랜딩 사례'),
    'jongkimdesign-com': ('공간 전략 디자인 스튜디오 종킴디자인. 상업·호텔·레스토랑·주거·전시 공간 (Beanpole 등)', '브랜드를 공간으로 풀어내는 상업 공간 설계'),
    'designrangers-co-kr': ('2012년 설립된 서울 디자인 회사 디자인방위대(DBWD). 건축·산업·시각 디자인 전문가 구성, Dutch Lab·CLIPEN 운영', '건축·제품·브랜드를 아우르는 통합 디자인'),
    'darkroom-engineering': ('여러 나라에 분산된 디자인·개발 스튜디오. WebGL·모션·헤드리스 커머스, 오픈소스 Lenis 제작', '부드러운 스크롤(Lenis)과 퍼포먼스 중심 웹 개발'),
    'random-studio': ('암스테르담·파리 경험 디자인 스튜디오. Moncler, Nike, Bottega Veneta, Jacquemus 등', '아트·디자인·기술을 결합한 브랜드 공간·설치'),
    'impossibleforms-org': ('헬싱키 칼라사타마의 문화 센터 Museum of Impossible Forms', '공동체 기반 문화 프로그램과 실험적 웹 아이덴티티'),
    'hellomonday': ('뉴욕·코펜하겐·오르후스 기반 크리에이티브 스튜디오 Hello Monday. 디지털 제품·브랜드·경험', '유연한 트랜지션과 마이크로 인터랙션으로 완성하는 디테일')
}

for item in items:
    iid = item['id']
    if iid in ANATOMY_PRINCIPLE:
        anat, princ = ANATOMY_PRINCIPLE[iid]
        item['anatomy'] = anat
        item['principle'] = princ

# Category Mapping: tags[0] -> category
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

for item in items:
    first_tag = item['tags'][0]
    if first_tag in CATEGORY_MAP:
        item['category'] = CATEGORY_MAP[first_tag]
    else:
        print(f"Warning: unknown tag '{first_tag}' on item '{item['id']}'")

# Format into TypeScript
ts_code = "import { Reference } from '../types';\n\nexport const SEED_REFERENCES: Reference[] = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n"

with open('lib/data/seed.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print(f"Successfully updated seed.ts! Remaining items: {len(items)}")

# 6. Delete old captures/videos for deleted IDs and items to recapture
RECAPTURE_IDS = {
    'virgilabloh-com', 'homelesspenthouse-com', 'open-foundry-com', 'hayonstudio-com',
    'kr-etudes-studio-com', '21-87-co-uk', 'trabuc-co', 'playgroundparis-com',
    'hellomonday', 'lusion-co', 'resn-co-nz', 'paperplanes', 'pointerpointer',
    'windows93', 'alvinlustig-com', 'unblast-com', 'shadertoy', 'thedieline-com',
    '28k-studio', 'studio-funday-com', 'apracticeforeverydaylife-com'
}

all_delete_files = DELETE_21_IDS.union(RECAPTURE_IDS)
deleted_png = 0
deleted_webm = 0

for target_id in all_delete_files:
    png = f'public/captures/{target_id}.png'
    webm = f'public/videos/{target_id}.webm'
    if os.path.exists(png):
        os.remove(png)
        deleted_png += 1
    if os.path.exists(webm):
        os.remove(webm)
        deleted_webm += 1

print(f"Deleted {deleted_png} pngs and {deleted_webm} webms.")

