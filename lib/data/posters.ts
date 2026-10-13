import { Reference } from '../types';

export const POSTER_GROUPS = [
  'All',
  'Trending',
  'Typography',
  'Print & Analog',
  'Movement & Era',
  'Digital & 3D',
  'Mood & Subculture',
] as const;

export interface PosterStyleDefinition {
  id: string;
  title: string;
  category: string;
  tags: string[];
  shortDesc: string;
  anatomy: string;
  principle: string;
  group: string;
}

export const POSTER_BASE_STYLES: PosterStyleDefinition[] = [
  {
    "id": "poster-heat-map",
    "title": "Heat Map",
    "category": "Trending",
    "tags": [
      "Heat Map"
    ],
    "shortDesc": "서멀 그라디언트 & 열화상 비주얼",
    "anatomy": "적외선 온도 스펙트럼의 고대비 멀티컬러 그라디언트(블루-시안-그린-옐로우-레드)와 미니멀한 테크니컬 그리드 레이아웃의 결합",
    "principle": "과학 관측 장비의 열역학적 기능 데이터를 감각적 색채 추상으로 변환",
    "group": "Trending"
  },
  {
    "id": "poster-biomorphism",
    "title": "Biomorphism",
    "category": "Trending",
    "tags": [
      "Biomorphism"
    ],
    "shortDesc": "유기적 곡선 & 생체 형태학",
    "anatomy": "세포막, 미생물, 자연물의 유기적인 굴곡을 모티프로 한 곡선형 블롭(Blob) 조형과 부드러운 스킨 톤 음영",
    "principle": "직선적 인공 구조를 탈피하고 생명체의 유연한 호흡과 볼륨감을 평면에 투영",
    "group": "Trending"
  },
  {
    "id": "poster-3d-surrealism",
    "title": "3D Surrealism",
    "category": "Trending",
    "tags": [
      "3D Surrealism"
    ],
    "shortDesc": "비현실적 3D 오브제 연출",
    "anatomy": "물리 법칙을 거스르는 공중 부유 오브제, 초현실적 질감 대비(금속과 액체, 유리와 털)의 3D 렌더링 배치",
    "principle": "꿈의 무의식적 시각 경험을 정교한 3D 하이퍼리얼리즘으로 가시화",
    "group": "Trending"
  },
  {
    "id": "poster-frutiger-aero",
    "title": "Frutiger Aero",
    "category": "Trending",
    "tags": [
      "Frutiger Aero"
    ],
    "shortDesc": "글로시 에어로 테크 & 투명 유리 질감",
    "anatomy": "2000년대 중반 유행한 투명한 물방울, 청록빛 오로라, 하이글로시 글래스 반사광과 생태주의 테크 그래픽",
    "principle": "낙관적 미래 기술과 자연의 조화를 스큐어모픽 광택으로 시각화",
    "group": "Trending"
  },
  {
    "id": "poster-halftone",
    "title": "Halftone",
    "category": "Trending",
    "tags": [
      "Halftone"
    ],
    "shortDesc": "망점 패턴 & 스크린 도트 미학",
    "anatomy": "전통 인쇄 망점의 크기와 각도를 극대화하여 이미지 명암을 표현하는 도트 매트릭스 텍스처",
    "principle": "기계적 복제 인쇄 프로세스의 최소 단위를 조형적 질감으로 전면화",
    "group": "Trending"
  },
  {
    "id": "poster-hyper-bloom",
    "title": "Hyper Bloom",
    "category": "Trending",
    "tags": [
      "Hyper Bloom"
    ],
    "shortDesc": "고채도 네온 발광 & 과포화 컬러",
    "anatomy": "블룸 셰이더와 글리터 이펙트가 결합된 초강력 네온 오라, 빛의 산란과 채도 폭발 연출",
    "principle": "디지털 디스플레이의 최대 발광 영역을 활용한 극적 시선 점유",
    "group": "Trending"
  },
  {
    "id": "poster-vaporwave",
    "title": "Vaporwave",
    "category": "Trending",
    "tags": [
      "Vaporwave"
    ],
    "shortDesc": "로파이 사이버 & 80s 노스탤지어",
    "anatomy": "파스텔 핑크/청록 그라디언트, 클래식 그리스 조각상 흉상, 윈도우 95 UI 창과 저해상도 격자선",
    "principle": "후기 자본주의 소비문화와 8090 디지털 노스탤지어의 아이러니한 키치 융합",
    "group": "Trending"
  },
  {
    "id": "poster-ascii",
    "title": "Ascii",
    "category": "Trending",
    "tags": [
      "Ascii"
    ],
    "shortDesc": "텍스트 그래픽 & 터미널 문자 아트",
    "anatomy": "모노스페이스 활자 기호(@, #, %, *, :)의 밀도 차이만으로 명암과 형상을 재구성한 순수 텍스트 그래픽",
    "principle": "텍스트와 이미지의 경계를 허무는 초기 컴퓨팅 환경의 미니멀리즘 복각",
    "group": "Trending"
  },
  {
    "id": "poster-maximalism",
    "title": "Maximalism",
    "category": "Trending",
    "tags": [
      "Maximalism"
    ],
    "shortDesc": "정보 과잉 & 레이어드 밀도감",
    "anatomy": "여백을 용납하지 않는 다층 레이어 콜라주, 타이포그래피 오버랩, 패턴 중첩이 만드는 고밀도 시각 장악",
    "principle": "절제의 미학을 거부하고 복잡성과 에너지의 포화 상태를 시각화",
    "group": "Trending"
  },
  {
    "id": "poster-neo-swiss",
    "title": "Neo Swiss",
    "category": "Trending",
    "tags": [
      "Neo Swiss"
    ],
    "shortDesc": "현대적 그리드 해체 & 신스위스",
    "anatomy": "엄격한 인터내셔널 타이포그래픽 스타일의 모듈 그리드를 기반으로 하되, 글리치와 파격적 스케일 왜곡을 도입",
    "principle": "모더니즘 질서 체계의 견고함과 포스트모더니즘 해체의 긴장감 유지",
    "group": "Trending"
  },
  {
    "id": "poster-micro-industrial",
    "title": "Micro Industrial",
    "category": "Trending",
    "tags": [
      "Micro Industrial"
    ],
    "shortDesc": "테크니컬 스펙 & 정밀 라벨 타이포",
    "anatomy": "제품 부품 번호, 바코드, 품질 검사 도장, 테크니컬 사양 텍스트가 극미세 폰트로 정밀 배치된 인더스트리얼 레이아웃",
    "principle": "공학적 유틸리티 문서의 서식을 순수 조형 그래픽 언어로 승화",
    "group": "Trending"
  },
  {
    "id": "poster-acid-wave",
    "title": "Acid Wave",
    "category": "Trending",
    "tags": [
      "Acid Wave"
    ],
    "shortDesc": "왜곡된 사이키델릭 & 형광 애시드",
    "anatomy": "고채도 형광 연두/자주 배색, 리퀴드 멜팅 왜곡, 레이브 파티 플라이어 특유의 불규칙한 그래픽 충돌",
    "principle": "시각적 안락함을 의도적으로 교란하는 강렬한 시신경 자극",
    "group": "Trending"
  },
  {
    "id": "poster-retro-futurism",
    "title": "Retro Futurism",
    "category": "Trending",
    "tags": [
      "Retro Futurism"
    ],
    "shortDesc": "스페이스 에이지 & 과거의 미래 상상",
    "anatomy": "6070년대 SF 삽화 풍의 돔 도시, 크롬 우주선, 에어로다이내믹 유선형 스트라이프와 세리프 폰트",
    "principle": "과거 세대가 낙관적으로 꿈꾸었던 미래주의 판타지의 향수 어린 재현",
    "group": "Trending"
  },
  {
    "id": "poster-pop-illustration",
    "title": "Pop Illustration",
    "category": "Trending",
    "tags": [
      "Pop Illustration"
    ],
    "shortDesc": "비비드 팝아트 일러스트레이션",
    "anatomy": "선명한 외곽선, 명도 높은 플랫 컬러 블록, 위트 있는 캐릭터와 대담한 그래픽 심볼",
    "principle": "대중문화의 직관적 기호를 명쾌한 조형미로 압축",
    "group": "Trending"
  },
  {
    "id": "poster-computer-vision",
    "title": "Computer Vision",
    "category": "Trending",
    "tags": [
      "Computer Vision"
    ],
    "shortDesc": "머신러닝 & AI 바운딩 박스 그래픽",
    "anatomy": "객체 감지(Object Detection) 녹색 바운딩 박스, 신뢰도 퍼센트(98.4%), 얼굴 인식 랜드마크 포인트 오버레이",
    "principle": "인간의 시각이 아닌 인공지능 알고리즘이 세상을 파싱하는 기계적 시선의 시각화",
    "group": "Trending"
  },
  {
    "id": "poster-dreamscape",
    "title": "Dreamscape",
    "category": "Trending",
    "tags": [
      "Dreamscape"
    ],
    "shortDesc": "몽환적 풍경 & 에테리얼 무드",
    "anatomy": "소프트 포커스 블러, 은은한 안개 텍스처, 파스텔 하늘빛과 비현실적 공간감이 어우러진 시적인 비주얼",
    "principle": "경계가 모호한 몽환적 감성과 정서적 휴식을 전달하는 시각적 시(Poetry)",
    "group": "Trending"
  },
  {
    "id": "poster-future-medieval",
    "title": "Future Medieval",
    "category": "Trending",
    "tags": [
      "Future Medieval"
    ],
    "shortDesc": "퓨처 미디벌 & 사이버 중세주의",
    "anatomy": "중세 문장(Coat of Arms), 칼·사슬·철갑 모티프에 사이버네틱 HUD 레이아웃과 크롬 재질을 융합",
    "principle": "원초적 신화·중세 상징주의와 첨단 테크놀로지의 디스토피아적 결합",
    "group": "Trending"
  },
  {
    "id": "poster-trinket-design",
    "title": "Trinket Design",
    "category": "Trending",
    "tags": [
      "Trinket Design"
    ],
    "shortDesc": "아기자기한 3D 오브젝트 컬렉션",
    "anatomy": "비즈, 플라스틱 키링, 미니어처 토이 등 작은 소장품들이 캔버스 위에 자유롭게 흩뿌려진 키치한 레이아웃",
    "principle": "소소한 개인적 애착 사물들의 콜렉팅 행위를 그래픽 내러티브로 승화",
    "group": "Trending"
  },
  {
    "id": "poster-vector-surrealism",
    "title": "Vector Surrealism",
    "category": "Trending",
    "tags": [
      "Vector Surrealism"
    ],
    "shortDesc": "샤프한 벡터 일러스트 초현실주의",
    "anatomy": "절대적인 곡률 제어와 노이즈 없는 칼 같은 벡터 베지어 곡선으로 그려낸 왜곡된 인체와 기하학 공간",
    "principle": "디지털 벡터 그래픽의 수학적 정확성으로 표현하는 초현실적 기괴함",
    "group": "Trending"
  },
  {
    "id": "poster-y2k",
    "title": "Y2K",
    "category": "Trending",
    "tags": [
      "Y2K"
    ],
    "shortDesc": "밀레니엄 사이버 키치 & 크롬 스타",
    "anatomy": "메탈릭 4각 별(Four-point Star), 볼록한 젤리 버튼, 에어브러시 메탈 광택과 사이버 폰트",
    "principle": "새천년 전환기의 디지털 낙관론과 하이퍼 테크놀로지 환상을 복각",
    "group": "Trending"
  },
  {
    "id": "poster-neo-brutalism",
    "title": "Neo Brutalism",
    "category": "Typography",
    "tags": [
      "Neo Brutalism"
    ],
    "shortDesc": "고대비 블랙 프레임 & 날것의 타이포",
    "anatomy": "두꺼운 솔리드 블랙 스트로크(4px), 드롭 섀도우(No Blur), 시스템 기본 폰트와 형광 옐로우 배경의 거친 조화",
    "principle": "불필요한 장식을 배제하고 날것의 기능과 구조적 뼈대를 충격적으로 전달",
    "group": "Typography"
  },
  {
    "id": "poster-anti-design",
    "title": "Anti-Design",
    "category": "Typography",
    "tags": [
      "Anti-Design"
    ],
    "shortDesc": "의도적 가독성 파괴 & 레이아웃 반항",
    "anatomy": "기존 그래픽 디자인의 정렬·자간·위계를 의도적으로 무시하고 텍스트를 겹치거나 뒤틀어버린 파격적 반항",
    "principle": "예측 가능한 정형성을 거부하고 독자에게 해석의 혼란과 적극적 참여를 유도",
    "group": "Typography"
  },
  {
    "id": "poster-swiss-punk",
    "title": "Swiss Punk",
    "category": "Typography",
    "tags": [
      "Swiss Punk"
    ],
    "shortDesc": "타이포그래피 해체 & 바인가르트 펑크",
    "anatomy": "볼프강 바인가르트의 전통 파괴에서 영감받은 콜라주, 자간 간격의 불규칙한 확장, 필름 네거티브 층위",
    "principle": "엄격한 스위스 모더니즘 내부에서 일어난 활자의 표현주의적 반란",
    "group": "Typography"
  },
  {
    "id": "poster-experimental-type",
    "title": "Experimental Type",
    "category": "Typography",
    "tags": [
      "Experimental Type"
    ],
    "shortDesc": "조형적 글자 왜곡 & 실험 타이포",
    "anatomy": "글자가 단어를 넘어선 하나의 추상 조형물이 되는 극단적 획 왜곡과 리퀴드 유기체 레터링",
    "principle": "문자의 언어적 기능보다 시각적 조형 에너지와 촉각성을 극대화",
    "group": "Typography"
  },
  {
    "id": "poster-liquid-type",
    "title": "Liquid Type",
    "category": "Typography",
    "tags": [
      "Liquid Type"
    ],
    "shortDesc": "흘러내리는 액상 & 멜팅 레터링",
    "anatomy": "은빛 수은이나 점성 액체처럼 표면 장력을 유지하며 녹아내리는 3D 크롬 레터링 조형",
    "principle": "고체 활자의 경직성을 액체의 가변적 유동성으로 치환",
    "group": "Typography"
  },
  {
    "id": "poster-blackletter-revival",
    "title": "Blackletter Revival",
    "category": "Typography",
    "tags": [
      "Blackletter Revival"
    ],
    "shortDesc": "현대적 고딕 블랙레터 & 프락투어",
    "anatomy": "중세 사본의 날카로운 펜촉 각도를 디지털 벡터의 극단적인 현대적 기하학과 융합한 현대 고딕 활자",
    "principle": "고전 성서 서체의 무게감과 현대 서브컬처(메탈/테크노)의 날카로움을 교차",
    "group": "Typography"
  },
  {
    "id": "poster-stretched-type",
    "title": "Stretched Type",
    "category": "Typography",
    "tags": [
      "Stretched Type"
    ],
    "shortDesc": "극단적 장평 왜곡 폰트",
    "anatomy": "가로 혹은 세로 방향으로 300% 이상 늘려진 극단적 장평과 자간의 긴장감 넘치는 캔버스 채움",
    "principle": "활자의 가로세로 비율 왜곡이 주는 압도적 공간 장악력과 속도감",
    "group": "Typography"
  },
  {
    "id": "poster-monospace-terminal",
    "title": "Monospace Terminal",
    "category": "Typography",
    "tags": [
      "Monospace Terminal"
    ],
    "shortDesc": "고정폭 코딩 폰트 & 시스템 콘솔",
    "anatomy": "Courier, IBM Plex Mono 등 동일 폭 활자로 구성된 완벽한 열(Column) 정렬과 콘솔 커서 블록",
    "principle": "컴퓨터 하드웨어의 논리적 규칙과 텍스트 그리드의 순수한 건축미",
    "group": "Typography"
  },
  {
    "id": "poster-hand-scribble",
    "title": "Hand Scribble",
    "category": "Typography",
    "tags": [
      "Hand Scribble"
    ],
    "shortDesc": "손글씨 낙서 & 아날로그 스크리블",
    "anatomy": "크레용, 거친 마커, 유성 매직으로 즉흥적으로 덧칠하고 긁어낸 자유분방한 드로잉 텍스처",
    "principle": "기계적 디지털 정밀함에 인간적인 체온과 원초적인 표현 충동을 주입",
    "group": "Typography"
  },
  {
    "id": "poster-kinetic-type",
    "title": "Kinetic Type",
    "category": "Typography",
    "tags": [
      "Kinetic Type"
    ],
    "shortDesc": "잔상과 속도감의 모션 타이포",
    "anatomy": "글자가 회전하고 이동하는 과정의 모션 블러, 에코 잔상, 도플러 효과를 평면에 동결시킨 그래픽",
    "principle": "시간성과 동역학(Dynamics)을 정적 포스터 프레임 안에 응축",
    "group": "Typography"
  },
  {
    "id": "poster-risograph",
    "title": "Risograph",
    "category": "Print & Analog",
    "tags": [
      "Risograph"
    ],
    "shortDesc": "리소 콩기름 잉크 & 오프셋 인쇄 미학",
    "anatomy": "형광 핑크(Fluorescent Pink)와 틸(Teal) 등 2~3도 별색 잉크의 중첩과 미세한 핀 어긋남(Misregistration) 효과",
    "principle": "디지털 인쇄에서는 흉내 낼 수 없는 아날로그 판화 특유의 온기와 우연의 미학",
    "group": "Print & Analog"
  },
  {
    "id": "poster-screen-print",
    "title": "Screen Print",
    "category": "Print & Analog",
    "tags": [
      "Screen Print"
    ],
    "shortDesc": "실크스크린 잉크 레이어링 & 거친 질감",
    "anatomy": "실크 샤 망사를 통과한 묵직한 잉크 피막의 두께감과 스퀴지 자국이 느껴지는 핸드프린트 포스터",
    "principle": "공방 예술의 수공예적 질감과 물리적 판화 프로세스의 조형화",
    "group": "Print & Analog"
  },
  {
    "id": "poster-xerox-punk",
    "title": "Xerox Punk",
    "category": "Print & Analog",
    "tags": [
      "Xerox Punk"
    ],
    "shortDesc": "복사기 텍스처 & 흑백 하이콘트라스트",
    "anatomy": "복사기를 여러 번 재복사하며 발생하는 토너 가루 얼룩, 찌그러진 텍스트, 거친 1비트 흑백 대비",
    "principle": "저비용 DIY 펑크 진(Zine) 문화의 로파이 미학과 언더그라운드 저항 정신",
    "group": "Print & Analog"
  },
  {
    "id": "poster-cut-paste-collage",
    "title": "Cut & Paste Collage",
    "category": "Print & Analog",
    "tags": [
      "Cut & Paste Collage"
    ],
    "shortDesc": "종이 오리기 & 잡지 콜라주",
    "anatomy": "가위나 칼로 거칠게 오려낸 잡지 사진 조각, 찢어진 종이의 흰 단면과 테이프 자국이 만드는 다다이즘 레이아웃",
    "principle": "이질적인 시각 파편들을 물리적으로 충돌시켜 새로운 맥락과 서사를 창조",
    "group": "Print & Analog"
  },
  {
    "id": "poster-diy-zine",
    "title": "DIY Zine",
    "category": "Print & Analog",
    "tags": [
      "DIY Zine"
    ],
    "shortDesc": "독립출판 진 & 핸드메이드 감성",
    "anatomy": "스테이플러 제본선, 손수 타자기로 친 글귀, 비정형 여백과 수제 스탬프가 돋보이는 소규모 출판물 감성",
    "principle": "제도권 디자인 규격을 벗어난 개인 창작자의 자유로운 육성과 독립성",
    "group": "Print & Analog"
  },
  {
    "id": "poster-duotone",
    "title": "Duotone",
    "category": "Print & Analog",
    "tags": [
      "Duotone"
    ],
    "shortDesc": "상반된 2가지 팬톤 컬러 배색",
    "anatomy": "암부와 명부를 두 가지 단색(예: 딥 블루 & 네온 오렌지)으로 단순화하여 강렬한 색조 대비를 창출하는 그래픽",
    "principle": "색상의 수를 엄격히 제한함으로써 전달력과 시각적 통일성을 극대화",
    "group": "Print & Analog"
  },
  {
    "id": "poster-gradient-grain",
    "title": "Gradient Grain",
    "category": "Print & Analog",
    "tags": [
      "Gradient Grain"
    ],
    "shortDesc": "노이즈 입자가 깔린 에어브러시 그라디언트",
    "anatomy": "벨벳처럼 부드러운 컬러 그러데이션 표면에 미세하고 거친 필름 그레인 노이즈를 블렌딩한 감성 비주얼",
    "principle": "완벽하게 매끄러운 디지털 색채에 아날로그 입자의 아늑한 질감을 부여",
    "group": "Print & Analog"
  },
  {
    "id": "poster-scanography",
    "title": "Scanography",
    "category": "Print & Analog",
    "tags": [
      "Scanography"
    ],
    "shortDesc": "평판 스캐너 문지름 왜곡 아트",
    "anatomy": "스캐너 헤드가 지나갈 때 물체나 인쇄물을 손으로 끌어당겨 발생하는 기이한 수평 늘어짐과 모션 블러 왜곡",
    "principle": "기계 장비의 작동 시간차(Time-lapse)를 조형적 제스처로 전유",
    "group": "Print & Analog"
  },
  {
    "id": "poster-sticker-bomb",
    "title": "Sticker Bomb",
    "category": "Print & Analog",
    "tags": [
      "Sticker Bomb"
    ],
    "shortDesc": "다채로운 그래픽 스티커 레이어링",
    "anatomy": "비닐 스티커, 홀로그램 라벨, 바코드 씰이 캐리어 가방이나 가로등처럼 빽빽하게 겹겹이 부착된 스트리트 비주얼",
    "principle": "도시 공간의 서브컬처적 낙서와 그래피티의 적층 구조를 그래픽으로 번안",
    "group": "Print & Analog"
  },
  {
    "id": "poster-grunge",
    "title": "Grunge",
    "category": "Print & Analog",
    "tags": [
      "Grunge"
    ],
    "shortDesc": "그런지 텍스처 & 찢겨진 표면",
    "anatomy": "스크래치, 먼지 얼룩, 풍화된 벽면 텍스처와 거친 타이포그래피가 어우러진 90년대 얼터너티브 록 감성",
    "principle": "시간의 경과와 마모, 퇴색의 흔적을 통해 날것의 감정과 진정성을 환기",
    "group": "Print & Analog"
  },
  {
    "id": "poster-bauhaus",
    "title": "Bauhaus",
    "category": "Movement & Era",
    "tags": [
      "Bauhaus"
    ],
    "shortDesc": "기하학 기본 도형 & 기능주의 조형미",
    "anatomy": "원, 삼각형, 사각형의 순수 기하학 조형과 삼원색(레드, 옐로우, 블루), 간결한 산세리프 활자의 합목적적 구성",
    "principle": "장식을 배제하고 기능과 형태가 하나 되는 모더니즘 디자인의 모태",
    "group": "Movement & Era"
  },
  {
    "id": "poster-constructivism",
    "title": "Constructivism",
    "category": "Movement & Era",
    "tags": [
      "Constructivism"
    ],
    "shortDesc": "러시아 구성주의 & 역동적 대각선",
    "anatomy": "붉은 쐐기와 검은 기둥, 45도 대각선 축을 가로지르는 역동적인 사진 몽타주와 묵직한 볼드 활자",
    "principle": "시각 예술을 사회적 혁명과 집단적 에너지를 추동하는 구조적 선동 도구로 설계",
    "group": "Movement & Era"
  },
  {
    "id": "poster-mid-century-modern",
    "title": "Mid-century Modern",
    "category": "Movement & Era",
    "tags": [
      "Mid-century Modern"
    ],
    "shortDesc": "50년대 레트로 유기적 기하학",
    "anatomy": "부메랑 곡선, 아메바 조형, 머스터드 옐로우와 아쿠아 블루의 온화한 파스텔 톤이 만드는 클래식 모던 미학",
    "principle": "전후 풍요로운 시대의 안락함과 유기적 형태미를 결합한 세련된 조형",
    "group": "Movement & Era"
  },
  {
    "id": "poster-psychedelic-60s",
    "title": "Psychedelic 60s",
    "category": "Movement & Era",
    "tags": [
      "Psychedelic 60s"
    ],
    "shortDesc": "물결치는 벤딩 레터링 & 환각적 비비드",
    "anatomy": "원근을 무시하고 액체처럼 구불구불 흐르는 핸드 레터링, 보색 대비의 진동(Vibration) 효과와 꽃 모티프",
    "principle": "지각의 확장과 환각적 의식 상태를 평면의 시각적 진동으로 변환",
    "group": "Movement & Era"
  },
  {
    "id": "poster-memphis",
    "title": "Memphis",
    "category": "Movement & Era",
    "tags": [
      "Memphis"
    ],
    "shortDesc": "소트사스의 유쾌한 지오메트릭 패턴",
    "anatomy": "지그재그 선, 도트, 스프링클 패턴과 파스텔/형광 컬러의 파격적인 유희, 합리주의에 대항한 위트",
    "principle": "지나치게 심각한 모더니즘 기능주의에 던진 유쾌하고 탈권위적인 그래픽 장난",
    "group": "Movement & Era"
  },
  {
    "id": "poster-op-art",
    "title": "Op Art",
    "category": "Movement & Era",
    "tags": [
      "Op Art"
    ],
    "shortDesc": "착시 현상 & 옵티컬 키네틱 아트",
    "anatomy": "동심원, 체커보드, 나선형 선들의 반복적인 밀도 변화를 통해 정지된 이미지에서 움직임 착시를 유발",
    "principle": "인간 망막의 생리적 착각을 자극하여 시각적 진동과 입체적 깊이를 창조",
    "group": "Movement & Era"
  },
  {
    "id": "poster-art-nouveau-revival",
    "title": "Art Nouveau Revival",
    "category": "Movement & Era",
    "tags": [
      "Art Nouveau Revival"
    ],
    "shortDesc": "유려한 식물 덩굴 곡선 & 아르누보",
    "anatomy": "알폰스 무하 풍의 유려한 식물 줄기 라인, 우아한 여성 곡선과 섬세한 꽃잎 장식이 돋보이는 그래픽",
    "principle": "자연의 유기적 생명선에서 길어 올린 유려한 곡선 장식의 부활",
    "group": "Movement & Era"
  },
  {
    "id": "poster-showa-retro",
    "title": "Showa Retro",
    "category": "Movement & Era",
    "tags": [
      "Showa Retro"
    ],
    "shortDesc": "일본 쇼와 시대의 빈티지 광고 감성",
    "anatomy": "7080년대 일본 인쇄물의 따뜻한 종이 질감, 소박한 명조/고딕 활자, 목판화 풍의 레트로 일러스트레이션",
    "principle": "소박하고 정겨운 아날로그 쇼와 시대의 감수성과 정취의 복각",
    "group": "Movement & Era"
  },
  {
    "id": "poster-newtro",
    "title": "Newtro",
    "category": "Movement & Era",
    "tags": [
      "Newtro"
    ],
    "shortDesc": "현대적 감각으로 재해석된 뉴트로",
    "anatomy": "과거의 레트로 그래픽 요소(도트, 네온, 카세트테이프)를 세련된 현대 디지털 베터리/타이포그래피 기술로 재조합",
    "principle": "단순한 복고(Retro)를 넘어 새로운 세대의 신선한 시선(New)으로 융합된 혼종 미학",
    "group": "Movement & Era"
  },
  {
    "id": "poster-archival",
    "title": "Archival",
    "category": "Movement & Era",
    "tags": [
      "Archival"
    ],
    "shortDesc": "고문서 & 테크니컬 차트 아카이브",
    "anatomy": "오래된 식물 도감, 천체 관측도, 도서관 색인 카드, 황변된 양장본 종이와 스탬프 넘버링 레이아웃",
    "principle": "인류 지식 축적의 역사적 물성과 고문서의 고고학적 아우라를 그래픽으로 승화",
    "group": "Movement & Era"
  },
  {
    "id": "poster-liquid-chrome",
    "title": "Liquid Chrome",
    "category": "Digital & 3D",
    "tags": [
      "Liquid Chrome"
    ],
    "shortDesc": "유동하는 액체 금속 & 크롬 반사광",
    "anatomy": "거울처럼 주변 환경을 반사하는 3D 메탈릭 표면과 날카로운 고광택 스펙큘러가 흐르는 조형",
    "principle": "초현대적 사이버 미학과 초자연적 유동성의 차가운 미래 감각",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-glassmorphism",
    "title": "Glassmorphism",
    "category": "Digital & 3D",
    "tags": [
      "Glassmorphism"
    ],
    "shortDesc": "반투명 아크릴 & 프로스트 글래스 굴절",
    "anatomy": "배경 블러(Backdrop Blur)와 얇은 반사 테두리, 반투명 유리판 뒤로 투과되는 다층적 깊이감",
    "principle": "디지털 인터페이스에 물리적 유리의 굴절과 깊이감을 부여하는 촉각적 레이어링",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-inflatable-3d",
    "title": "Inflatable 3D",
    "category": "Digital & 3D",
    "tags": [
      "Inflatable 3D"
    ],
    "shortDesc": "풍선처럼 부풀어 오른 튜브 3D",
    "anatomy": "공기가 빵빵하게 찬 고무 튜브, 비닐 풍선 질감과 둥글둥글한 볼륨감을 지닌 3D 레터링과 캐릭터",
    "principle": "탄력과 공기압의 부드러운 촉각성을 시각화하여 친근하고 경쾌한 에너지 전달",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-claymorphism",
    "title": "Claymorphism",
    "category": "Digital & 3D",
    "tags": [
      "Claymorphism"
    ],
    "shortDesc": "말랑한 점토 질감의 3D 오브젝트",
    "anatomy": "광택 없는 매트한 표면, 부드러운 내부 그림자(Inner Shadow)와 클레이 점토를 빚어낸 듯한 둥근 입체 조형",
    "principle": "차가운 디지털 픽셀을 장난기 가득한 수제 점토 인형의 포근함으로 전환",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-ps1-low-poly",
    "title": "PS1 Low Poly",
    "category": "Digital & 3D",
    "tags": [
      "PS1 Low Poly"
    ],
    "shortDesc": "초기 3D 콘솔 게임의 각진 로우폴리",
    "anatomy": "적은 수의 다각형 폴리곤(Polygon), 텍스처 워핑 왜곡, 픽셀 텍스처가 날것으로 드러나는 90년대 게임 미학",
    "principle": "초기 3D 그래픽의 기술적 한계가 빚어낸 거친 조형성과 레트로 향수",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-holographic",
    "title": "Holographic",
    "category": "Digital & 3D",
    "tags": [
      "Holographic"
    ],
    "shortDesc": "프리즘 무지개 빛 홀로그램 광채",
    "anatomy": "빛의 각도에 따라 마젠타, 시안, 옐로우로 오묘하게 변화하는 오색 프리즘 박과 무지개 반사광",
    "principle": "빛의 분산과 간섭 현상을 평면에 붙잡은 신비로운 미래적 광채",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-glitch-datamosh",
    "title": "Glitch / Datamosh",
    "category": "Digital & 3D",
    "tags": [
      "Glitch / Datamosh"
    ],
    "shortDesc": "영상 압축 결함 & 데이터모쉬 왜곡",
    "anatomy": "비디오 압축 코덱 I-프레임 제거로 발생하는 픽셀 번짐, RGB 채널 분리(Chromatic Aberration), 스캔라인 노이즈",
    "principle": "디지털 데이터 전송 오류와 시스템 붕괴의 우연한 패턴을 회화적 제스처로 승화",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-dithering",
    "title": "Dithering",
    "category": "Digital & 3D",
    "tags": [
      "Dithering"
    ],
    "shortDesc": "1비트 디더링 & 도트 그라디언트",
    "anatomy": "제한된 컬러 팔레트에서 점들의 밀도와 배치 패턴(Bayer Matrix)만으로 연속 톤을 흉내 내는 도트 그래픽",
    "principle": "저용량 디스플레이 한계를 극복하기 위한 수학적 알고리즘의 그래픽적 패턴화",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-pixel-art",
    "title": "Pixel Art",
    "category": "Digital & 3D",
    "tags": [
      "Pixel Art"
    ],
    "shortDesc": "레트로 8/16비트 정밀 픽셀 아트",
    "anatomy": "한 픽셀 단위로 정밀하게 찍어 올린 격자 도트 그래픽, CRT 모니터 비율과 향수를 부르는 아케이드 비주얼",
    "principle": "가장 원초적인 디지털 이미지 단위(픽셀)의 장인정신적 조형 구축",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-generative-code-art",
    "title": "Generative / Code Art",
    "category": "Digital & 3D",
    "tags": [
      "Generative / Code Art"
    ],
    "shortDesc": "수학적 알고리즘 & 크리에이티브 코딩",
    "anatomy": "프랙탈 기하학, 베지에 커브 파동 함수, 노이즈 필드(Perlin Noise)가 수학적 수식으로 생성해 낸 무한 패턴",
    "principle": "인간의 손 대신 알고리즘 규칙이 스스로 직조해 내는 정교한 디지털 자연미",
    "group": "Digital & 3D"
  },
  {
    "id": "poster-cyberpunk",
    "title": "Cyberpunk",
    "category": "Mood & Subculture",
    "tags": [
      "Cyberpunk"
    ],
    "shortDesc": "네온 사인 & 비 내리는 메트로폴리스",
    "anatomy": "암흑의 빌딩 숲과 대비되는 강렬한 마젠타·시안 네온 조명, 한자/가타카나 타이포그래피와 사이보그 인터페이스",
    "principle": "하이테크-로라이프(High Tech, Low Life) 디스토피아의 어둡고 강렬한 전자기적 에너지",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-solarpunk",
    "title": "Solarpunk",
    "category": "Mood & Subculture",
    "tags": [
      "Solarpunk"
    ],
    "shortDesc": "생태 유토피아 & 녹색 미래주의",
    "anatomy": "태양광 패널, 풍력 발전 타워, 울창한 수직 숲 건축물과 따뜻한 아르누보 곡선이 결합된 희망찬 유토피아",
    "principle": "기후 위기 디스토피아를 넘어 기술과 자연이 공존하는 낙관적 생태 미래 제시",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-neon-noir",
    "title": "Neon Noir",
    "category": "Mood & Subculture",
    "tags": [
      "Neon Noir"
    ],
    "shortDesc": "필름 누아르의 음영과 네온 불빛",
    "anatomy": "블라인드 사이로 비치는 짙은 그림자, 비에 젖은 아스팔트에 반사되는 보랏빛 네온사인과 고독한 분위기",
    "principle": "고전 흑백 범죄 영화의 명암 대비(Chiaroscuro)에 네온 컬러의 매혹적인 위험성을 융합",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-webcore",
    "title": "Webcore",
    "category": "Mood & Subculture",
    "tags": [
      "Webcore"
    ],
    "shortDesc": "초기 월드와이드웹 & 인터넷 로파이",
    "anatomy": "90년대 지오시티즈(GeoCities) 웹사이트, 깜빡이는 GIF 클립아트, 공사 중 표지판, 넷스케이프 감성의 인터넷 서브컬처",
    "principle": "상업화 이전 초기 인터넷 커뮤니티의 아마추어적 자유분방함과 기묘한 향수",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-liminal-space",
    "title": "Liminal Space",
    "category": "Mood & Subculture",
    "tags": [
      "Liminal Space"
    ],
    "shortDesc": "기묘한 공허함 & 경계적 공간",
    "anatomy": "텅 빈 호텔 복도, 심야의 수영장, 끝없이 펼쳐진 형광등 사무실 등 인간이 부재한 전이 공간의 으스스한 정적",
    "principle": "목적지가 아닌 통로로서의 공간이 유발하는 기시감(D&eacute;j&agrave; vu)과 초현실적 소외감",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-kawaii-maximal",
    "title": "Kawaii Maximal",
    "category": "Mood & Subculture",
    "tags": [
      "Kawaii Maximal"
    ],
    "shortDesc": "과밀한 카와이 무드 & 키치 서브컬처",
    "anatomy": "하트, 리본, 파스텔 캐릭터 스티커와 일본 대중문화 키치가 폭발하듯 캔버스 전체를 가득 메운 하이퍼 귀여움",
    "principle": "귀여움의 요소를 극단적으로 증폭하여 전복적인 시각적 쾌감과 마니아적 에너지 생성",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-anime-graphic",
    "title": "Anime Graphic",
    "category": "Mood & Subculture",
    "tags": [
      "Anime Graphic"
    ],
    "shortDesc": "애니메이션 레이아웃 & 감각적 타이포",
    "anatomy": "일본 애니메이션 타이틀 시퀀스 특유의 와이드 화면비 프레임, 대담한 한자/가타카나 타이포와 캐릭터 포커스",
    "principle": "시네마틱 애니메이션 연출의 드라마틱한 긴장감과 그래픽 디자인의 융합",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-gothic-romance",
    "title": "Gothic Romance",
    "category": "Mood & Subculture",
    "tags": [
      "Gothic Romance"
    ],
    "shortDesc": "어둡고 우아한 고딕 & 중세 로맨티시즘",
    "anatomy": "빅토리아 시대 레이스 패턴, 흑장미, 벨벳 텍스처, 뾰족한 고딕 아치와 세리프 캘리그래피의 낭만적 암흑미",
    "principle": "죽음과 사랑, 퇴폐와 우아함이 교차하는 서정적 고딕 서사의 시각화",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-sci-fi-hud",
    "title": "Sci-fi HUD",
    "category": "Mood & Subculture",
    "tags": [
      "Sci-fi HUD"
    ],
    "shortDesc": "우주선 HUD & 테크니컬 인터페이스",
    "anatomy": "원형 조준선 레이더, 고도계, 육각 데이터 그리드, 실시간 텔레메트리 다이어그램이 정밀하게 설계된 SF 화면",
    "principle": "첨단 미래 비행선 조종석의 조작 인터페이스가 전하는 압도적 전문성과 테크 아우라",
    "group": "Mood & Subculture"
  },
  {
    "id": "poster-blueprint-wireframe",
    "title": "Blueprint / Wireframe",
    "category": "Mood & Subculture",
    "tags": [
      "Blueprint / Wireframe"
    ],
    "shortDesc": "설계도 청사진 & 3D 와이어프레임",
    "anatomy": "짙은 코발트 블루 배경 위의 정밀한 흰색/시안 격자선, 3D 구조물의 투시 와이어프레임과 치수 보조선",
    "principle": "완성된 결과물 이전의 순수한 아이디어 골조와 아키텍처적 청사진의 미학",
    "group": "Mood & Subculture"
  }
];

export const POSTER_REFERENCES: Reference[] = (() => {
  const list: Reference[] = [];
  // 30 curated high-resolution graphic posters per style = 2,100 total posters
  for (let round = 0; round < 30; round++) {
    for (const style of POSTER_BASE_STYLES) {
      const num = round + 1;
      const id = num === 1 ? style.id : `${style.id}-${num}`;
      const imageUrl = num === 1 ? `/captures/posters/${style.id}.jpg` : `/captures/posters/${style.id}-${num}.jpg`;
      const title = `${style.title} #${String(num).padStart(2, '0')}`;
      list.push({
        id,
        title,
        url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(style.title + " graphic design poster")}`,
        category: style.category,
        tags: [style.title],
        shortDesc: style.shortDesc,
        anatomy: style.anatomy,
        principle: style.principle,
        imageUrl,
        majorCategory: 'POSTERS',
        group: style.group,
        aspectRatio: 'portrait',
      });
    }
  }
  return list;
})();

export function getAllPosterTags(posters: Reference[]): string[] {
  const set = new Set<string>();
  posters.forEach((p) => {
    p.tags.forEach((t) => set.add(t));
  });
  return ['전체', ...Array.from(set)];
}
