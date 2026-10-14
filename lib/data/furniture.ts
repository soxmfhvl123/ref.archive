import { Reference } from '../types';

export const FURNITURE_GROUPS = [
  'All',
  '스틸 가구 디자이너',
  '스틸 가구 브랜드·제조사',
  '일본·아시아 디자이너와 작가',
  '한국 디자이너·작가·갤러리',
  '빛과 재료',
  '반응하는 공간·인터랙션',
  '상자와 공간의 미술, 미니멀 건축',
  '컬렉터블 디자인 갤러리·페어',
] as const;

export interface RawFurnitureItem {
  id: string;
  title: string;
  country: string;
  materials: string;
  referencePoint: string;
  namingType: string;
  group: typeof FURNITURE_GROUPS[number];
  url: string;
}

export const RAW_FURNITURE_DATA: RawFurnitureItem[] = [
  // 1. 스틸 가구 디자이너 (1~22)
  {
    id: "furn-donald-judd",
    title: "Donald Judd",
    country: "미국",
    materials: "코르텐 스틸, 알루미늄, 합판",
    referencePoint: "상자 하나로 작품·가구·건축을 잇는다. 손자국 없는 표면",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://juddfoundation.org/"
  },
  {
    id: "furn-muller-van-severen",
    title: "Muller Van Severen",
    country: "벨기에",
    materials: "분체도장 스틸 + 색",
    referencePoint: "차가운 선 위에 색 하나. 행거 Colour Rack",
    namingType: "두 사람의 성",
    group: "스틸 가구 디자이너",
    url: "https://www.mullervanseveren.be/"
  },
  {
    id: "furn-superstudio",
    title: "Superstudio",
    country: "이탈리아",
    materials: "격자 라미네이트",
    referencePoint: "Quaderna 테이블. 사각 격자가 가구에서 공간 전체로 확장",
    namingType: "조어형",
    group: "스틸 가구 디자이너",
    url: "https://www.zanotta.com/en-us/products/tables/quaderna"
  },
  {
    id: "furn-jean-prouve",
    title: "Jean Prouvé",
    country: "프랑스",
    materials: "절곡 강판",
    referencePoint: "건축 구조 원리로 만든 스틸 가구",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.vitra.com/en-us/about-vitra/designer/details/jean-prouve"
  },
  {
    id: "furn-eileen-gray",
    title: "Eileen Gray",
    country: "아일랜드·프랑스",
    materials: "강관, 유리",
    referencePoint: "E-1027 테이블. 사람에 맞춰 높이가 바뀌는 가구",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.aram.co.uk/designers/eileen-gray.html"
  },
  {
    id: "furn-andreas-christen",
    title: "Andreas Christen",
    country: "스위스",
    materials: "알루미늄 판재",
    referencePoint: "Lehni 가구. Judd의 금속 가구에 영향",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://lehni.ch/de/lehni/designer/portrait/1/andreas-christen"
  },
  {
    id: "furn-maarten-van-severen",
    title: "Maarten Van Severen",
    country: "벨기에",
    materials: "알루미늄, 스틸",
    referencePoint: "극도로 얇은 선과 면, .03 의자",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://maartenvanseveren.be/"
  },
  {
    id: "furn-jonathan-nesci",
    title: "Jonathan Nesci",
    country: "미국",
    materials: "알루미늄, 금속 판재",
    referencePoint: "산업용 금속 판재를 그대로 쓴 미니멀 가구",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://jonathannesci.com/"
  },
  {
    id: "furn-fredrik-paulsen",
    title: "Fredrik Paulsen",
    country: "스웨덴",
    materials: "알루미늄, 스틸",
    referencePoint: "미니멀과 브루탈리즘을 섞은 금속 가구, Joy Objects",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://fredrikpaulsen.com/"
  },
  {
    id: "furn-martin-szekely",
    title: "Martin Szekely",
    country: "프랑스",
    materials: "금속 외",
    referencePoint: "극도로 절제된 형태, Galerie kreo",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.martinszekely.com/"
  },
  {
    id: "furn-oskar-zieta",
    title: "Oskar Zieta",
    country: "폴란드",
    materials: "공기 주입 스틸",
    referencePoint: "Plopp 스툴. 차가운 스틸의 부드러운 변형",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://zieta.pl/"
  },
  {
    id: "furn-marcel-breuer",
    title: "Marcel Breuer",
    country: "헝가리·독일",
    materials: "크롬 강관",
    referencePoint: "강관 의자의 출발점, Wassily",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.knoll.com/designer/Marcel-Breuer"
  },
  {
    id: "furn-mies-van-der-rohe",
    title: "Mies van der Rohe",
    country: "독일",
    materials: "크롬 스틸",
    referencePoint: "건축가의 가구, Less is more",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.knoll.com/designer/Mies-van-der-Rohe"
  },
  {
    id: "furn-charlotte-perriand",
    title: "Charlotte Perriand",
    country: "프랑스",
    materials: "강관",
    referencePoint: "르 코르뷔지에와 함께한 LC 시리즈",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.cassina.com/it/en/designers/charlotte-perriand.html"
  },
  {
    id: "furn-harry-bertoia",
    title: "Harry Bertoia",
    country: "이탈리아·미국",
    materials: "스틸 와이어",
    referencePoint: "와이어 체어. 금속을 가볍게",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.harrybertoia.org/"
  },
  {
    id: "furn-konstantin-grcic",
    title: "Konstantin Grcic",
    country: "독일",
    materials: "주조 알루미늄, 판금 스틸",
    referencePoint: "Chair_One, 1mm 강판 의자 Bishop",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://konstantin-grcic.com/"
  },
  {
    id: "furn-jasper-morrison",
    title: "Jasper Morrison",
    country: "영국",
    materials: "다양",
    referencePoint: "Super Normal. 존재감을 낮추는 가구",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://jaspermorrison.com/"
  },
  {
    id: "furn-ron-arad",
    title: "Ron Arad",
    country: "이스라엘·영국",
    materials: "판금, 스틸",
    referencePoint: "금속을 조각처럼 다룬다",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.ronarad.co.uk/"
  },
  {
    id: "furn-max-lamb",
    title: "Max Lamb",
    country: "영국",
    materials: "금속, 돌",
    referencePoint: "원재료의 날것을 살린 재료 실험",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://maxlamb.org/"
  },
  {
    id: "furn-vincenzo-de-cotiis",
    title: "Vincenzo De Cotiis",
    country: "이탈리아",
    materials: "재생 금속, 유리섬유",
    referencePoint: "표면에 흔적이 남는 갤러리형 금속 가구",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.decotiis.it/"
  },
  {
    id: "furn-destroyers-builders",
    title: "Destroyers/Builders",
    country: "벨기에",
    materials: "금속, 나무",
    referencePoint: "건축적 볼륨의 오브제",
    namingType: "조어형",
    group: "스틸 가구 디자이너",
    url: "https://destroyersbuilders.com/"
  },
  {
    id: "furn-tom-dixon",
    title: "Tom Dixon",
    country: "영국",
    materials: "금속, 조명",
    referencePoint: "금속 가구와 조명을 한 브랜드로 묶음",
    namingType: "작가 이름",
    group: "스틸 가구 디자이너",
    url: "https://www.tomdixon.net/"
  },

  // 2. 스틸 가구 브랜드·제조사 (23~35)
  {
    id: "furn-usm-haller",
    title: "USM Haller",
    country: "스위스",
    materials: "크롬 강관 + 강판",
    referencePoint: "건축 모듈을 가구로 줄인 사각 그리드 시스템",
    namingType: "약자 + 건축가 이름",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.usm.com/"
  },
  {
    id: "furn-objects-of-common-interest",
    title: "Objects of Common Interest",
    country: "미국·그리스",
    materials: "아크릴, 레진",
    referencePoint: "반투명 재료와 색, 가구와 설치의 경계",
    namingType: "조어형(문장)",
    group: "스틸 가구 브랜드·제조사",
    url: "https://objectsofcommoninterest.com/"
  },
  {
    id: "furn-vitsoe",
    title: "Vitsœ",
    country: "영국",
    materials: "알루미늄",
    referencePoint: "Dieter Rams 606 선반. 한 시스템을 평생 유지",
    namingType: "창업자 이름 변형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.vitsoe.com/"
  },
  {
    id: "furn-lehni",
    title: "Lehni",
    country: "스위스",
    materials: "알루미늄 판재",
    referencePoint: "Andreas Christen과 Judd의 금속 가구 제작사",
    namingType: "회사 이름",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.lehni.ch/"
  },
  {
    id: "furn-valerie-objects",
    title: "Valerie Objects",
    country: "벨기에",
    materials: "금속 외",
    referencePoint: "작가 오브제를 내는 출판사형 브랜드",
    namingType: "사람 이름 + 단어",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.valerie-objects.com/"
  },
  {
    id: "furn-frama",
    title: "Frama",
    country: "덴마크",
    materials: "스틸, 나무",
    referencePoint: "산업 스틸 선반을 차분한 리빙으로",
    namingType: "조어형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://framacph.com/"
  },
  {
    id: "furn-snarkitecture",
    title: "Snarkitecture",
    country: "미국",
    materials: "다양",
    referencePoint: "건축을 비틀어 경험으로 만드는 스튜디오",
    namingType: "조어형(합성어)",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.snarkitecture.com/"
  },
  {
    id: "furn-string-furniture",
    title: "String Furniture",
    country: "스웨덴",
    materials: "금속 사이드 패널",
    referencePoint: "얇은 선의 벽 선반 시스템",
    namingType: "단어형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://stringfurniture.com/"
  },
  {
    id: "furn-tecta",
    title: "Tecta",
    country: "독일",
    materials: "강관",
    referencePoint: "바우하우스 캔틸레버 의자 복각",
    namingType: "조어형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://tecta.de/"
  },
  {
    id: "furn-thonet",
    title: "Thonet",
    country: "독일",
    materials: "강관",
    referencePoint: "강관 의자 대량생산의 역사",
    namingType: "창업자 이름",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.thonet.de/"
  },
  {
    id: "furn-tolix",
    title: "Tolix",
    country: "프랑스",
    materials: "판금 스틸",
    referencePoint: "산업용 스틸 의자의 아이콘",
    namingType: "조어형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://tolix.com/"
  },
  {
    id: "furn-emeco",
    title: "Emeco",
    country: "미국",
    materials: "알루미늄",
    referencePoint: "1006 Navy 의자. 오래 쓰는 금속 가구",
    namingType: "약자형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.emeco.net/"
  },
  {
    id: "furn-pastoe",
    title: "Pastoe",
    country: "네덜란드",
    materials: "박스형 수납장",
    referencePoint: "상자 단위의 모듈 수납",
    namingType: "조어형",
    group: "스틸 가구 브랜드·제조사",
    url: "https://www.pastoe.com/"
  },

  // 3. 일본·아시아 디자이너와 작가 (36~48)
  {
    id: "furn-shiro-kuramata",
    title: "Shiro Kuramata",
    country: "일본",
    materials: "스틸 메쉬, 아크릴, 유리",
    referencePoint: "보이지 않는 가구. 영어 재즈 곡명을 붙인 How High the Moon",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.moma.org/artists/3297"
  },
  {
    id: "furn-tatsuo-miyajima",
    title: "Tatsuo Miyajima",
    country: "일본",
    materials: "LED 숫자 카운터",
    referencePoint: "숫자가 세어지고 사라지며 시간과 삶을 말한다. YELLOW BOX 카운터와 직결",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://tatsuomiyajima.com/"
  },
  {
    id: "furn-tokujin-yoshioka",
    title: "Tokujin Yoshioka",
    country: "일본",
    materials: "유리, 아크릴, 빛",
    referencePoint: "투명한 재료와 빛으로 만든 가구",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.tokujin.com/"
  },
  {
    id: "furn-junya-ishigami",
    title: "Junya Ishigami",
    country: "일본",
    materials: "얇은 스틸 판",
    referencePoint: "극한까지 얇게 만든 스틸 테이블. 건축과 가구의 경계",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "http://jysh.net/"
  },
  {
    id: "furn-ryoji-ikeda",
    title: "Ryoji Ikeda",
    country: "일본",
    materials: "데이터, 빛, 소리",
    referencePoint: "데이터를 빛과 숫자로 보여준다",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.ryojiikeda.com/"
  },
  {
    id: "furn-nendo",
    title: "nendo",
    country: "일본",
    materials: "다양",
    referencePoint: "작은 '!'의 순간을 만드는 스튜디오",
    namingType: "조어형(일본어 '점토')",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.nendo.jp/"
  },
  {
    id: "furn-isamu-noguchi",
    title: "Isamu Noguchi",
    country: "일본·미국",
    materials: "종이 조명 Akari",
    referencePoint: "동양 전통 재료를 세계적 조명으로",
    namingType: "작가 이름 + 제품명 일본어",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.noguchi.org/"
  },
  {
    id: "furn-sanaa",
    title: "SANAA",
    country: "일본",
    materials: "얇은 스틸, 유리",
    referencePoint: "가볍고 투명한 공간과 가구",
    namingType: "약자형",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.pritzkerprize.com/laureates/2010"
  },
  {
    id: "furn-naoto-fukasawa",
    title: "Naoto Fukasawa",
    country: "일본",
    materials: "다양",
    referencePoint: "행동에 맞춘 무의식의 디자인",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://naotofukasawa.com/"
  },
  {
    id: "furn-jo-nagasaka-schemata",
    title: "Jo Nagasaka / Schemata",
    country: "일본",
    materials: "레진, 나무",
    referencePoint: "건축가가 만든 재료 실험 가구",
    namingType: "작가 이름 + 사무소명",
    group: "일본·아시아 디자이너와 작가",
    url: "https://schemata.jp/"
  },
  {
    id: "furn-tadao-ando",
    title: "Tadao Ando",
    country: "일본",
    materials: "콘크리트, 빛",
    referencePoint: "빛으로 완성되는 공간",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "http://www.tadao-ando.com/"
  },
  {
    id: "furn-sou-fujimoto",
    title: "Sou Fujimoto",
    country: "일본",
    materials: "격자, 스틸",
    referencePoint: "격자 구조로 안과 밖의 경계를 흐린다",
    namingType: "작가 이름",
    group: "일본·아시아 디자이너와 작가",
    url: "https://www.sou-fujimoto.net/"
  },
  {
    id: "furn-neri-and-hu",
    title: "Neri&Hu",
    country: "중국",
    materials: "건축, 가구",
    referencePoint: "아시아 기반 건축가의 가구 브랜드 확장",
    namingType: "두 사람의 성",
    group: "일본·아시아 디자이너와 작가",
    url: "http://www.neriandhu.com/"
  },

  // 4. 한국 디자이너·작가·갤러리 (49~58)
  {
    id: "furn-hyungshin-hwang",
    title: "황형신 Hyungshin Hwang",
    country: "한국",
    materials: "스테인리스 스틸",
    referencePoint: "스테인리스 판을 겹친 가구로 해외 갤러리에 진출",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.hyungshinhwang.com/"
  },
  {
    id: "furn-wonmin-park",
    title: "박원민 Wonmin Park",
    country: "한국",
    materials: "반투명 레진",
    referencePoint: "빛이 스미는 색면 가구. 해외 컬렉터블 시장",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://wonminpark.com/"
  },
  {
    id: "furn-kwangho-lee",
    title: "이광호 Kwangho Lee",
    country: "한국",
    materials: "구리 에나멜, 전선",
    referencePoint: "한국적 손작업을 세계 갤러리 언어로",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.kwangholee.com/"
  },
  {
    id: "furn-do-ho-suh",
    title: "서도호 Do Ho Suh",
    country: "한국",
    materials: "패브릭 집, 공간",
    referencePoint: "집과 방, 개인의 공간을 옮긴다. 방이라는 주제와 직결",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.lehmannmaupin.com/artists/do-ho-suh"
  },
  {
    id: "furn-rareraw",
    title: "레어로우 Rareraw",
    country: "한국",
    materials: "철재",
    referencePoint: "rare + raw 영어 조어. 국내 철제 리빙 브랜드",
    namingType: "조어형",
    group: "한국 디자이너·작가·갤러리",
    url: "https://rareraw.com/"
  },
  {
    id: "furn-byung-hoon-choi",
    title: "최병훈 Byung Hoon Choi",
    country: "한국",
    materials: "돌, 미니멀",
    referencePoint: "한국 원로 가구 작가의 해외 갤러리 경로",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.friedmanbenda.com/artists/byung-hoon-choi/"
  },
  {
    id: "furn-lee-hun-chung",
    title: "이헌정 Lee Hun Chung",
    country: "한국",
    materials: "도자, 콘크리트",
    referencePoint: "재료 하나로 가구와 공간을 만든다",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.instagram.com/leehunchung/"
  },
  {
    id: "furn-ha-jihoon",
    title: "하지훈 Ha Jihoon",
    country: "한국",
    materials: "나무, 금속",
    referencePoint: "한국 전통 가구 구조를 현대 가구로 재해석",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://jihoonha.com/"
  },
  {
    id: "furn-lee-bul",
    title: "이불 Lee Bul",
    country: "한국",
    materials: "거울, 금속, 빛",
    referencePoint: "건축적 유토피아와 빛의 설치",
    namingType: "작가 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.lehmannmaupin.com/artists/lee-bul"
  },
  {
    id: "furn-gallery-seomi",
    title: "갤러리서미 Gallery Seomi",
    country: "한국",
    materials: "갤러리",
    referencePoint: "한국 컬렉터블 디자인을 해외에 소개하는 갤러리",
    namingType: "갤러리 이름",
    group: "한국 디자이너·작가·갤러리",
    url: "https://www.galleryseomi.com/"
  },

  // 5. 빛과 재료 (59~72)
  {
    id: "furn-sabine-marcelis",
    title: "Sabine Marcelis",
    country: "네덜란드",
    materials: "레진, 유리, 네온",
    referencePoint: "재료 안에서 번지는 빛. 가구와 조명의 경계",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://sabinemarcelis.com/"
  },
  {
    id: "furn-dan-flavin",
    title: "Dan Flavin",
    country: "미국",
    materials: "형광등",
    referencePoint: "기성 조명 하나로 공간 전체를 바꾼다. Judd와 같은 계보",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://www.diaart.org/collection/collection/flavin-dan"
  },
  {
    id: "furn-james-turrell",
    title: "James Turrell",
    country: "미국",
    materials: "빛, 공간",
    referencePoint: "빛 자체를 재료로 쓰는 공간",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://jamesturrell.com/"
  },
  {
    id: "furn-olafur-eliasson",
    title: "Olafur Eliasson",
    country: "덴마크·아이슬란드",
    materials: "빛, 인지",
    referencePoint: "관객이 들어와야 완성되는 작품",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://olafureliasson.net/"
  },
  {
    id: "furn-studio-drift",
    title: "Studio Drift",
    country: "네덜란드",
    materials: "움직이는 빛",
    referencePoint: "피고 지는 조명 Shylight. 빛의 움직임",
    namingType: "스튜디오명",
    group: "빛과 재료",
    url: "https://studiodrift.com/"
  },
  {
    id: "furn-robert-irwin",
    title: "Robert Irwin",
    country: "미국",
    materials: "빛, 막",
    referencePoint: "지각과 공간의 관계",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://www.pacegallery.com/artists/robert-irwin/"
  },
  {
    id: "furn-ingo-maurer",
    title: "Ingo Maurer",
    country: "독일",
    materials: "조명",
    referencePoint: "조명에 시와 위트를 넣는다",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://www.ingo-maurer.com/"
  },
  {
    id: "furn-michael-anastassiades",
    title: "Michael Anastassiades",
    country: "키프로스·영국",
    materials: "황동, 유리구",
    referencePoint: "극도로 단순한 기하 조명",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://michaelanastassiades.com/"
  },
  {
    id: "furn-flos",
    title: "Flos",
    country: "이탈리아",
    materials: "조명",
    referencePoint: "디자이너 조명을 출판하는 브랜드 모델",
    namingType: "단어형(라틴어 '꽃')",
    group: "빛과 재료",
    url: "https://flos.com/"
  },
  {
    id: "furn-artemide",
    title: "Artemide",
    country: "이탈리아",
    materials: "조명",
    referencePoint: "빛과 사람의 관계를 말하는 조명 브랜드",
    namingType: "신화 이름",
    group: "빛과 재료",
    url: "https://www.artemide.com/"
  },
  {
    id: "furn-lambert-and-fils",
    title: "Lambert & Fils",
    country: "캐나다",
    materials: "금속, 유리 조명",
    referencePoint: "구조가 드러나는 조명",
    namingType: "이름 + 프랑스어",
    group: "빛과 재료",
    url: "https://lambertetfils.com/"
  },
  {
    id: "furn-bocci",
    title: "Bocci",
    country: "캐나다",
    materials: "유리 조명",
    referencePoint: "공정에서 형태가 나오는 조명",
    namingType: "조어형",
    group: "빛과 재료",
    url: "https://bocci.com/"
  },
  {
    id: "furn-formafantasma",
    title: "Formafantasma",
    country: "이탈리아·네덜란드",
    materials: "재료 연구",
    referencePoint: "재료와 사회를 함께 묻는 리서치 디자인",
    namingType: "조어형(이탈리아어)",
    group: "빛과 재료",
    url: "https://formafantasma.com/"
  },
  {
    id: "furn-jenny-holzer",
    title: "Jenny Holzer",
    country: "미국",
    materials: "LED 텍스트",
    referencePoint: "빛으로 된 문장. 숫자·텍스트 표현의 참고",
    namingType: "작가 이름",
    group: "빛과 재료",
    url: "https://projects.jennyholzer.com/"
  },

  // 6. 반응하는 공간·인터랙션 (73~80)
  {
    id: "furn-rafael-lozano-hemmer",
    title: "Rafael Lozano-Hemmer",
    country: "멕시코·캐나다",
    materials: "전구, 센서",
    referencePoint: "Pulse Room. 관객의 심장박동이 전구 불빛이 되어 남는다",
    namingType: "작가 이름",
    group: "반응하는 공간·인터랙션",
    url: "https://www.lozano-hemmer.com/"
  },
  {
    id: "furn-random-international",
    title: "rAndom International",
    country: "영국·독일",
    materials: "센서, 물, 빛",
    referencePoint: "Rain Room. 사람이 있는 곳만 비가 멈춘다",
    namingType: "조어형",
    group: "반응하는 공간·인터랙션",
    url: "https://www.random-international.com/"
  },
  {
    id: "furn-philip-beesley",
    title: "Philip Beesley",
    country: "캐나다",
    materials: "반응형 구조",
    referencePoint: "사람에게 반응하는 살아있는 건축",
    namingType: "작가 이름",
    group: "반응하는 공간·인터랙션",
    url: "https://www.philipbeesleyarchitect.com/"
  },
  {
    id: "furn-tangible-media-group-mit",
    title: "Tangible Media Group (MIT)",
    country: "미국",
    materials: "형태 디스플레이",
    referencePoint: "inFORM. 데이터가 물리적 형태로 바뀐다. 논문 선행연구",
    namingType: "연구실명",
    group: "반응하는 공간·인터랙션",
    url: "https://tangible.media.mit.edu/"
  },
  {
    id: "furn-studio-roosegaarde",
    title: "Studio Roosegaarde",
    country: "네덜란드",
    materials: "인터랙티브 빛",
    referencePoint: "지나가는 사람에게 반응해 빛나는 풍경",
    namingType: "작가 이름",
    group: "반응하는 공간·인터랙션",
    url: "https://studioroosegaarde.net/"
  },
  {
    id: "furn-carlo-ratti-associati",
    title: "Carlo Ratti Associati",
    country: "이탈리아",
    materials: "반응형 건축",
    referencePoint: "데이터와 센서로 공간을 바꾼다",
    namingType: "작가 이름",
    group: "반응하는 공간·인터랙션",
    url: "https://carloratti.com/"
  },
  {
    id: "furn-united-visual-artists",
    title: "United Visual Artists",
    country: "영국",
    materials: "빛, 설치",
    referencePoint: "빛과 공간의 관계를 설치로",
    namingType: "단어형",
    group: "반응하는 공간·인터랙션",
    url: "https://www.uva.co.uk/"
  },
  {
    id: "furn-teamlab",
    title: "teamLab",
    country: "일본",
    materials: "디지털 인터랙션",
    referencePoint: "사람이 움직이면 공간이 바뀐다",
    namingType: "조어형",
    group: "반응하는 공간·인터랙션",
    url: "https://www.teamlab.art/"
  },

  // 7. 상자와 공간의 미술, 미니멀 건축 (81~89)
  {
    id: "furn-sol-lewitt",
    title: "Sol LeWitt",
    country: "미국",
    materials: "열린 큐브, 격자",
    referencePoint: "사각 단위의 반복과 변주",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.moma.org/artists/3528"
  },
  {
    id: "furn-carl-andre",
    title: "Carl Andre",
    country: "미국",
    materials: "바닥에 놓인 금속판",
    referencePoint: "관객이 밟고 지나가는 스틸 작품",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.moma.org/artists/174"
  },
  {
    id: "furn-richard-serra",
    title: "Richard Serra",
    country: "미국",
    materials: "내후성 강판",
    referencePoint: "거대한 스틸 판이 사람의 걸음과 공간을 바꾼다",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://gagosian.com/artists/richard-serra/"
  },
  {
    id: "furn-john-pawson",
    title: "John Pawson",
    country: "영국",
    materials: "미니멀 건축, 가구",
    referencePoint: "비움으로 만드는 공간과 가구",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.johnpawson.com/"
  },
  {
    id: "furn-fred-sandback",
    title: "Fred Sandback",
    country: "미국",
    materials: "실",
    referencePoint: "선 몇 개로 보이지 않는 면과 공간을 만든다",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.fredsandbackarchive.org/"
  },
  {
    id: "furn-john-mccracken",
    title: "John McCracken",
    country: "미국",
    materials: "광택 판",
    referencePoint: "단색 판 하나가 벽과 바닥 사이에 선다",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.davidzwirner.com/artists/john-mccracken"
  },
  {
    id: "furn-vincent-van-duysen",
    title: "Vincent Van Duysen",
    country: "벨기에",
    materials: "건축, 가구",
    referencePoint: "건축가 언어를 리빙 브랜드로 확장",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://vincentvanduysen.com/"
  },
  {
    id: "furn-peter-zumthor",
    title: "Peter Zumthor",
    country: "스위스",
    materials: "건축",
    referencePoint: "분위기(Atmosphere)로 말하는 공간",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.archdaily.com/tag/peter-zumthor"
  },
  {
    id: "furn-valerio-olgiati",
    title: "Valerio Olgiati",
    country: "스위스",
    materials: "건축",
    referencePoint: "하나의 개념으로 밀어붙인 공간",
    namingType: "작가 이름",
    group: "상자와 공간의 미술, 미니멀 건축",
    url: "https://www.olgiati.net/"
  },

  // 8. 컬렉터블 디자인 갤러리·페어 (90~100)
  {
    id: "furn-galerie-philia",
    title: "Galerie Philia",
    country: "스위스·미국·싱가포르",
    materials: "갤러리",
    referencePoint: "황형신 등 신진 컬렉터블 디자인 발굴",
    namingType: "단어형(그리스어 '사랑')",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://www.galerie-philia.com/"
  },
  {
    id: "furn-carpenters-workshop-gallery",
    title: "Carpenters Workshop Gallery",
    country: "영국·프랑스·미국",
    materials: "갤러리",
    referencePoint: "기능 조각과 디자인 아트의 대표 갤러리",
    namingType: "단어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://carpentersworkshopgallery.com/"
  },
  {
    id: "furn-friedman-benda",
    title: "Friedman Benda",
    country: "미국",
    materials: "갤러리",
    referencePoint: "동시대 디자인 작가 중심 갤러리",
    namingType: "두 사람의 성",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://www.friedmanbenda.com/"
  },
  {
    id: "furn-galerie-kreo",
    title: "Galerie kreo",
    country: "프랑스",
    materials: "갤러리",
    referencePoint: "디자이너와 함께 한정판을 제작",
    namingType: "조어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://www.galeriekreo.com/"
  },
  {
    id: "furn-side-gallery",
    title: "Side Gallery",
    country: "스페인",
    materials: "갤러리",
    referencePoint: "Sabine Marcelis 등 빛과 재료 작가",
    namingType: "단어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://side-gallery.com/"
  },
  {
    id: "furn-etage-projects",
    title: "Etage Projects",
    country: "덴마크",
    materials: "갤러리",
    referencePoint: "젊은 북유럽 컬렉터블 디자인",
    namingType: "단어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://etageprojects.com/"
  },
  {
    id: "furn-design-miami",
    title: "Design Miami",
    country: "미국·스위스",
    materials: "페어",
    referencePoint: "컬렉터블 디자인 최대 페어",
    namingType: "행사명",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://designmiami.com/"
  },
  {
    id: "furn-collectible",
    title: "Collectible",
    country: "벨기에",
    materials: "페어",
    referencePoint: "신진 디자이너 중심 컬렉터블 페어",
    namingType: "단어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://collectible.design/"
  },
  {
    id: "furn-nilufar",
    title: "Nilufar",
    country: "이탈리아",
    materials: "갤러리",
    referencePoint: "빈티지와 동시대 디자인의 혼합",
    namingType: "사람 이름",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://nilufar.com/"
  },
  {
    id: "furn-the-future-perfect",
    title: "The Future Perfect",
    country: "미국",
    materials: "갤러리·숍",
    referencePoint: "디자이너 가구를 생활 공간으로",
    namingType: "문장형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://www.thefutureperfect.com/"
  },
  {
    id: "furn-salon-94-design",
    title: "Salon 94 Design",
    country: "미국",
    materials: "갤러리",
    referencePoint: "디자인과 미술을 같이 다룬다. Judd 가구의 북미 대리",
    namingType: "조어형",
    group: "컬렉터블 디자인 갤러리·페어",
    url: "https://salon94design.com/"
  }
];

export const FURNITURE_REFERENCES: Reference[] = RAW_FURNITURE_DATA.map((item) => {
  // Extract individual tags from country and materials
  const materialTags = item.materials
    .split(/[,·+]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.includes('외') && !s.includes('다양'));
  const countryTags = item.country.split(/[·,]/).map((s) => s.trim());

  const tags = Array.from(new Set([item.group, ...countryTags, ...materialTags]));

  return {
    id: item.id,
    title: item.title,
    url: item.url,
    category: item.group,
    tags,
    shortDesc: item.materials,
    anatomy: item.referencePoint,
    principle: `국가: ${item.country} · 명칭 유형: ${item.namingType}`,
    imageUrl: `/captures/furniture/${item.id}.jpg`,
    majorCategory: 'FURNITURE',
    group: item.group,
    aspectRatio: 'landscape',
  };
});

export function getAllFurnitureTags(furniture: Reference[]): string[] {
  const set = new Set<string>();
  furniture.forEach((f) => {
    f.tags.forEach((t) => set.add(t));
  });
  return ['전체', ...Array.from(set)];
}
