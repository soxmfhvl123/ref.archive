import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const DESCRIPTIONS: Record<string, string> = {
  'bruno-simon': '3D 포트폴리오',
  'igloo-inc': '3D 사운드',
  'messenger-abeto': '3D 멀티플레이어',
  'lusion-co': '실시간 3D',
  'activetheory-net': 'WebGL 벤치마크',
  'neal-fun': '비주얼 아이디어',
  'poolsuite-net': '레트로 OS 라디오',
  'patatap-com': '키보드 사운드',
  'locomotive-ca': '패럴랙스 스크롤',
  'darkroom-engineering': '타이포 모션',
  'pentagram-com': '디자인 컨설팅',
  'jetset-nl': '미니멀 타이포',
  'wearecollins-com': '브랜드 에세이',
  'studiodumbar-com': '키네틱 브랜딩',
  'studiofeixen-ch': '컬러 그래픽',
  'ok-rm-co-uk': '아트북 출판',
  'wearemucho-com': '위트 브랜딩',
  'heystudio-es': '기하학 일러스트',
  'koto-com': '테크 브랜딩',
  'everyday-practice-com': '사회적 포스터',
  'radio-garden': '실시간 라디오',
  'window-swap': '창밖 비디오',
  'pointerpointer': '커서 가리키기',
  'zoomquilt': '무한 줌인',
  'quickdraw': 'AI 낙서게임',
  'paperplanes': '종이비행기 날리기',
  'ciechanowski': '인터랙티브 원리해설',
  'ncase-me': '시뮬레이션 게임',
  'pudding-cool': '데이터 저널리즘',
  'windows93': '패러디 OS',
  'hellomonday': '마이크로 모션',
  'makemepulse': 'WebGL 아티팩트',
  '14islands': '3D 메쉬 인터랙션',
  'obys-agency': '타이포 트랜지션',
  'cuberto': '커서 인터랙션',
  'dogstudio': '3D 스토리텔링',
  'immersive-garden': '감각적 비주얼',
  'basement-studio': '에지 모노스페이스',
  'mschf': '브랜드 실험실',
  'teenage-engineering': '매뉴얼 인터페이스',
  'experiments-with-google': '크롬 웹실험',
  'codrops': '인터랙션 데모',
  'shadertoy': '실시간 셰이더',
  'hydra-livecoding': '라이브 코딩 비주얼',
  'lynn-and-tonic': '컨셉 포트폴리오',
  'arena': '블록 아카이빙',
  'cosmos-so': '무드보드 아카이브',
  'savee-it': '비주얼 아카이브',
  'godly-website': '웹 디자인 큐레이션',
  'siteinspire': '그리드 웹 아카이브',
  'resn-co-nz': '몰입형 3D',
  'jam3': '디지털 스토리텔링',
  'instrument-com': '브랜드 시스템',
  'bureau-oberhaeuser': '그리드 타이포',
  'random-studio': '공간 인터랙션',
  'monopo-london': '비주얼 리듬',
  'cursor-com': '개발 툴 브랜딩',
  'superflux': '비선형 내러티브',
};

export function updateSeedShortDesc() {
  const updated = SEED_REFERENCES.map((item) => ({
    ...item,
    shortDesc: DESCRIPTIONS[item.id] || item.category,
    imageUrl: `/captures/${item.id}.png`,
  }));

  const seedFile = path.join(process.cwd(), 'lib', 'data', 'seed.ts');
  const fileContent = `import { Reference } from '../types';

export const SEED_REFERENCES: Reference[] = ${JSON.stringify(updated, null, 2)};
`;

  fs.writeFileSync(seedFile, fileContent, 'utf-8');
  console.log('Added shortDesc to all references in seed.ts.');
}

if (require.main === module) {
  updateSeedShortDesc();
}
