export type MajorCategory = 'WEB' | 'POSTERS' | 'FURNITURE' | 'FASHION';

export interface Reference {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  shortDesc: string; // 한 단어/간략 설명 (예: "3D 포트폴리오", "실시간 라디오")
  anatomy: string;   // 요약
  principle: string; // 참고
  imageUrl: string;
  videoUrl?: string; // 호버 시 재생될 비디오 경로
  capturedAt?: string;
  majorCategory?: MajorCategory; // 대카테고리: 'WEB' | 'POSTERS'
  group?: string;                // 하위 그룹: 'Trending', 'Typography', etc.
  aspectRatio?: 'landscape' | 'portrait';
}

export type TagOption = 'ALL' | string;
