import { Reference } from '../types';

export const FASHION_GROUPS = [
  'All',
  '주얼리',
  '디자이너 레이블',
  '스트리트·서브컬처',
  '레더·슈즈',
] as const;

export const FASHION_REGIONS = ['한국', '일본·아시아', '북유럽', '유럽', '북미'] as const;

export const FASHION_MATERIAL_TAGS = [
  '실버',
  '골드',
  '레더',
  '리넨',
  '울',
  '실크',
  '메탈 하드웨어',
  '나일론',
  '데님',
  '코튼',
  '캐시미어',
] as const;

export const FASHION_THEME_TAGS = [
  '고딕',
  '펑크·서브컬처',
  '바이커·록',
  '오컬트·리추얼',
  '아티즌',
  '해체·드레이프',
  '모노크롬',
  '아방가르드',
] as const;

export const FASHION_TAG_ORDER = [
  ...FASHION_REGIONS,
  ...FASHION_MATERIAL_TAGS,
  ...FASHION_THEME_TAGS,
];

export interface RawFashionItem {
  id: string;
  title: string;
  country: string;
  materials: string;
  referencePoint: string;
  group: typeof FASHION_GROUPS[number];
  founders?: string;
  region: typeof FASHION_REGIONS[number];
  tags: string[];
  url: string;
}

export const RAW_FASHION_DATA: RawFashionItem[] = [
  {
    id: "fash-king-kroach",
    title: "KING KROACH 킹크로치",
    country: "한국",
    materials: "실버",
    referencePoint: "2009 서울. 언더 소셜 클럽 블랙 블러드 브로바스에서 출발, '51% VIRTUE 49% VICE'",
    group: "주얼리",
    founders: undefined,
    region: "한국",
    tags: ["실버", "고딕", "펑크·서브컬처"],
    url: "https://kingkroach.com/",
  },
  {
    id: "fash-gaboratory",
    title: "Gaboratory",
    country: "미국",
    materials: "실버, 골드, 레더",
    referencePoint: "1988 LA 베니스비치. 헝가리 출신 실버스미스의 스컬·크로스, 사후 가족 공방 운영",
    group: "주얼리",
    founders: "Gabor Nagy",
    region: "북미",
    tags: ["실버", "고딕", "바이커·록"],
    url: "https://gaboratory.com/",
  },
  {
    id: "fash-chin-teo",
    title: "Chin Teo",
    country: "독일",
    materials: "실버, 골드",
    referencePoint: "2009. 말레이시아 출신, 베를린 기반. 전통 은세공으로 만든 중세풍 브루탈 실버",
    group: "주얼리",
    founders: "Chin Teo",
    region: "유럽",
    tags: ["실버", "오컬트·리추얼"],
    url: "https://www.instagram.com/chin_teo/",
  },
  {
    id: "fash-oss",
    title: "OSS",
    country: "스페인(파리에서 시작)",
    materials: "실버",
    referencePoint: "스케치 없이 손으로 빚는 불규칙한 옥시다이즈 실버. 현재 마드리드",
    group: "주얼리",
    founders: "Josefina & Pablo",
    region: "유럽",
    tags: ["실버", "아티즌"],
    url: "https://oss-oss.com/",
  },
  {
    id: "fash-ma-plus",
    title: "M.A+",
    country: "이탈리아",
    materials: "레더",
    referencePoint: "2006 로마 근교. 카르페 디엠 출신, 한 장의 가죽을 접어 만드는 구조",
    group: "디자이너 레이블",
    founders: "Maurizio Amadei",
    region: "유럽",
    tags: ["레더", "아티즌"],
    url: "https://maurizioamadei.it/",
  },
  {
    id: "fash-masnada",
    title: "Masnada",
    country: "이탈리아",
    materials: "리넨, 울, 실크",
    referencePoint: "2007 피렌체. 손염색 천연섬유의 조형적 드레이프",
    group: "디자이너 레이블",
    founders: "Angelo Iannello",
    region: "유럽",
    tags: ["해체·드레이프", "모노크롬"],
    url: "https://www.masnada.it/",
  },
  {
    id: "fash-alyx",
    title: "1017 ALYX 9SM",
    country: "이탈리아·미국",
    materials: "메탈 하드웨어, 나일론",
    referencePoint: "2015. 롤러코스터 버클과 블랙 하드웨어",
    group: "디자이너 레이블",
    founders: "Matthew M. Williams",
    region: "북미",
    tags: ["펑크·서브컬처"],
    url: "https://www.instagram.com/alyxstudio/",
  },
  {
    id: "fash-number-nine",
    title: "NUMBER (N)INE",
    country: "일본",
    materials: "데님, 레더",
    referencePoint: "1996. 그런지·록 아카이브의 상징. 미야시타 이탈 후 KOOKS 운영 (본인 라인: numberninebytakahiromiyashita.com)",
    group: "디자이너 레이블",
    founders: "Takahiro Miyashita",
    region: "일본·아시아",
    tags: ["데님", "바이커·록", "펑크·서브컬처"],
    url: "https://www.n-nine.com/",
  },
  {
    id: "fash-the-viridi-anne",
    title: "The Viridi-anne",
    country: "일본",
    materials: "레더, 코튼",
    referencePoint: "2001 도쿄. 블랙 기조, 경년변화를 의식한 소재",
    group: "디자이너 레이블",
    founders: "Tomoaki Okaniwa",
    region: "일본·아시아",
    tags: ["모노크롬"],
    url: "https://viridi-anne.jp/",
  },
  {
    id: "fash-d-gnak",
    title: "D.GNAK",
    country: "한국",
    materials: "울",
    referencePoint: "2008. KANG.D를 뒤집은 이름. 비대칭·해체의 무채색 테일러링",
    group: "디자이너 레이블",
    founders: "강동준",
    region: "한국",
    tags: ["아방가르드", "모노크롬"],
    url: "https://www.dgnak.com/",
  },
  {
    id: "fash-thug-club",
    title: "THUG CLUB 떠그클럽",
    country: "한국",
    materials: "데님, 레더, 실버 하드웨어",
    referencePoint: "2018 이태원. 바이커·힙합에 중세 무드",
    group: "스트리트·서브컬처",
    founders: "조영민 & 권지율",
    region: "한국",
    tags: ["데님", "레더", "바이커·록", "펑크·서브컬처"],
    url: "https://thugclub.store/",
  },
  {
    id: "fash-mastermind-japan",
    title: "mastermind JAPAN",
    country: "일본",
    materials: "코튼, 캐시미어",
    referencePoint: "1997. 스컬 로고의 블랙 럭셔리 스트리트",
    group: "스트리트·서브컬처",
    founders: "Masaaki Homma",
    region: "일본·아시아",
    tags: ["고딕", "펑크·서브컬처"],
    url: "https://mastermindtokyo.com/",
  },
  {
    id: "fash-guidi",
    title: "Guidi",
    country: "이탈리아",
    materials: "홀스 레더",
    referencePoint: "1896 페시아 태너리. 텀블 다잉 백집 부츠",
    group: "레더·슈즈",
    founders: "Guidi 가문",
    region: "유럽",
    tags: ["레더", "아티즌"],
    url: "https://guidi.it/",
  },
  {
    id: "fash-taichi-murakami",
    title: "Taichi Murakami",
    country: "일본",
    materials: "홀스·캥거루 레더",
    referencePoint: "M.A+ 패턴메이커 출신. 테크니컬 스포츠웨어 연구를 담은 레더 가방",
    group: "레더·슈즈",
    founders: "Taichi Murakami",
    region: "일본·아시아",
    tags: ["레더", "아티즌"],
    url: "https://taichimurakami.com/",
  },
];

export const FASHION_REFERENCES: Reference[] = RAW_FASHION_DATA.map((item) => {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    category: `Fashion & Culture · ${item.group}`,
    tags: [item.region, ...item.tags],
    shortDesc: `${item.materials} · ${item.country}`,
    anatomy: item.referencePoint,
    principle: `국가: ${item.country} · 명칭/유형: ${item.group}` + (item.founders && item.founders !== '-' ? ` · 디렉터/창업: ${item.founders}` : ''),
    imageUrl: `/captures/fashion/${item.id}.svg`,
    videoUrl: `/videos/fashion/${item.id}.webm`,
    majorCategory: 'FASHION' as const,
    group: item.group,
    aspectRatio: 'portrait' as const,
  };
});

export function getAllFashionTags(fashionRefs: Reference[]): string[] {
  const set = new Set<string>();
  fashionRefs.forEach((r) => r.tags.forEach((t) => set.add(t)));
  return ['전체', ...FASHION_TAG_ORDER.filter((t) => set.has(t))];
}
