'use client';

import { useState, useRef, useMemo, useEffect, memo, useCallback } from 'react';
import { Reference, MajorCategory } from '@/lib/types';
import { POSTER_GROUPS } from '@/lib/data/posters';
import Image from 'next/image';
import TiltCard from '@/components/TiltCard';
import CanvasView from '@/components/CanvasView';
import AmbientBackground from '@/components/AmbientBackground';
import { hoverStore } from '@/lib/hoverStore';

interface ArchiveAppProps {
  initialWebReferences?: Reference[];
  initialPosterReferences?: Reference[];
  initialReferences?: Reference[];
  initialTags?: string[];
  initialPosterTags?: string[];
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getFullPath(pathStr: string) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  return `${basePath}${cleanPath}`;
}

const SafeImage = memo(function SafeImage({
  src,
  alt,
  fallbackSvg,
  className,
  objectFit = 'object-cover',
}: {
  src: string;
  alt: string;
  fallbackSvg?: string;
  className?: string;
  objectFit?: 'object-cover' | 'object-contain';
}) {
  const fullSrc = getFullPath(src);
  const fullFallback = fallbackSvg ? getFullPath(fallbackSvg) : fullSrc;
  const [imgSrc, setImgSrc] = useState(fullSrc);

  useEffect(() => {
    setImgSrc(fullSrc);
  }, [fullSrc]);

  const isSvg = imgSrc.toLowerCase().endsWith('.svg');

  if (isSvg) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (imgSrc !== fullFallback) {
            setImgSrc(fullFallback);
          }
        }}
        className={`absolute inset-0 w-full h-full ${objectFit} object-top ${className || ''}`}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      loading="lazy"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className={`${objectFit} object-top ${className || ''}`}
      unoptimized
      onError={() => {
        if (imgSrc !== fullFallback) {
          setImgSrc(fullFallback);
        }
      }}
    />
  );
});

const MediaPreviewCard = memo(function MediaPreviewCard({
  imageUrl,
  videoUrl,
  title,
  id,
  isMobile = false,
  aspectRatio = 'aspect-[16/10]',
  isPoster = false,
}: {
  imageUrl: string;
  videoUrl?: string;
  title: string;
  id: string;
  isMobile?: boolean;
  aspectRatio?: string;
  isPoster?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    // 80ms debounce to prevent firing video requests on rapid cursor sweeps
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 80);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
    setIsVideoReady(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const fullVideoSrc = !isMobile && videoUrl ? getFullPath(videoUrl) : undefined;
  const shouldMountVideo = !isMobile && isHovered && fullVideoSrc && !hasVideoError;
  const fallbackPath = isPoster || imageUrl.includes('/posters/') ? imageUrl : `/captures/${id}.svg`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ aspectRatio: isPoster ? '3 / 4' : '16 / 10' }}
      className={`relative w-full ${aspectRatio} bg-white overflow-hidden mb-3 border border-black/5`}
    >
      <SafeImage
        src={imageUrl}
        alt={title}
        fallbackSvg={fallbackPath}
        objectFit="object-cover"
        className={`transition-opacity duration-300 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}
      />
      {shouldMountVideo && (
        <video
          src={fullVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoReady(true)}
          onError={() => setHasVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});

const GridReferenceCard = memo(function GridReferenceCard({
  refItem,
  onSelect,
  isMobile = false,
}: {
  refItem: Reference;
  onSelect: (ref: Reference) => void;
  isMobile?: boolean;
}) {
  const isPoster = refItem.majorCategory === 'POSTERS';
  const cardAspectRatio = isPoster ? 'aspect-[3/4]' : 'aspect-[16/10]';

  return (
    <article className="block bg-transparent">
      <TiltCard
        onClick={() => onSelect(refItem)}
        onMouseEnter={() => {
          if (!isMobile) hoverStore.setHovered(refItem);
        }}
        onMouseLeave={() => {
          if (!isMobile) hoverStore.setHovered(null);
        }}
        maxTilt={isPoster ? 5 : 8}
      >
        <MediaPreviewCard
          imageUrl={refItem.imageUrl}
          videoUrl={refItem.videoUrl}
          title={refItem.title}
          id={refItem.id}
          isMobile={isMobile}
          aspectRatio={cardAspectRatio}
          isPoster={isPoster}
        />
        <div className="text-[14px] leading-tight space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-normal tracking-tight">{refItem.title}</span>
            {isPoster && refItem.group && (
              <span className="text-[11px] opacity-40 uppercase tracking-wider">{refItem.group}</span>
            )}
          </div>
          <div className="opacity-60 text-[13px]">{refItem.shortDesc}</div>
        </div>
      </TiltCard>
    </article>
  );
});

const IndexReferenceRow = memo(function IndexReferenceRow({
  refItem,
  idx,
  onSelect,
}: {
  refItem: Reference;
  idx: number;
  onSelect: (ref: Reference) => void;
}) {
  return (
    <tr
      onClick={() => onSelect(refItem)}
      onMouseEnter={() => {
        hoverStore.setHovered(refItem);
      }}
      onMouseLeave={() => hoverStore.setHovered(null)}
      className="cursor-pointer hover:bg-black/[0.02] transition-colors"
    >
      <td className="py-2.5 pr-4 opacity-40 font-normal">
        {String(idx + 1).padStart(3, '0')}
      </td>
      <td className="py-2.5 pr-6 font-normal">
        <a
          href={refItem.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="hover:underline underline-offset-4"
        >
          {refItem.title}
        </a>
      </td>
      <td className="py-2.5 pr-6 opacity-60 font-normal">{refItem.shortDesc}</td>
      <td className="py-2.5 pr-6 opacity-60 font-normal">
        {refItem.tags.join(', ')}
      </td>
    </tr>
  );
});

export default function ArchiveApp({
  initialWebReferences = [],
  initialPosterReferences = [],
  initialReferences = [],
  initialTags = [],
  initialPosterTags = [],
}: ArchiveAppProps) {
  const [majorCategory, setMajorCategory] = useState<MajorCategory>('WEB');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [activeRef, setActiveRef] = useState<Reference | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'index' | 'canvas'>('grid');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const webList = initialWebReferences.length > 0 ? initialWebReferences : initialReferences;
  const posterList = initialPosterReferences;
  const currentDataset = majorCategory === 'WEB' ? webList : posterList;

  const handleSwitchMajorCategory = useCallback(
    (cat: MajorCategory) => {
      setMajorCategory(cat);
      setSelectedGroup('All');
      setSelectedTag('전체');
      if (cat === 'POSTERS' && viewMode === 'canvas') {
        setViewMode('grid');
      }
      if (typeof window !== 'undefined') {
        const newHash = cat === 'POSTERS' ? '#posters' : '#web';
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      }
    },
    [viewMode]
  );

  // Sync URL hash or param on initial mount so direct link / reload preserves view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('category');
      if (hash === '#posters' || hash === '#poster' || tab === 'posters' || tab === 'poster') {
        setMajorCategory('POSTERS');
      }
    }
  }, []);

  const currentPosterTags = useMemo(() => {
    let pool = posterList;
    if (selectedGroup !== 'All') {
      pool = pool.filter((p) => p.group === selectedGroup);
    }
    const tagsSet = new Set<string>();
    pool.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return ['전체', ...Array.from(tagsSet)];
  }, [posterList, selectedGroup]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
      setIsMobile(mobile);
      if (mobile && viewMode === 'canvas') {
        setViewMode('grid');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [viewMode]);

  const handleSelectRef = useCallback((refItem: Reference) => {
    hoverStore.setHovered(refItem);
    setActiveRef(refItem);
  }, []);

  const handleCloseRef = useCallback(() => {
    hoverStore.setHovered(null);
    setActiveRef(null);
  }, []);

  const filteredReferences = useMemo(() => {
    let list = currentDataset;
    if (majorCategory === 'POSTERS' && selectedGroup !== 'All') {
      list = list.filter((ref) => ref.group === selectedGroup);
    }
    if (selectedTag !== '전체') {
      list = list.filter((ref) => ref.tags.includes(selectedTag));
    }
    return list;
  }, [currentDataset, majorCategory, selectedGroup, selectedTag]);

  // 'newest' is the default sorting (latest added first)
  const sortedReferences = useMemo(() => {
    return [...filteredReferences].reverse();
  }, [filteredReferences]);

  const BATCH_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset visible count when switching category or filtering
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [majorCategory, selectedGroup, selectedTag]);

  const displayedReferences = useMemo(() => {
    return sortedReferences.slice(0, visibleCount);
  }, [sortedReferences, visibleCount]);

  // Infinite scroll: smoothly load next batch 300px before reaching page bottom
  useEffect(() => {
    if (viewMode !== 'grid') return;
    if (visibleCount >= sortedReferences.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, sortedReferences.length));
        }
      },
      { rootMargin: '300px' }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [viewMode, visibleCount, sortedReferences.length]);

  return (
    <main className="min-h-screen bg-transparent text-black px-4 sm:px-6 md:px-10 pb-10 select-none relative">
      {/* Category & Site-hover reactive dynamic ambient gradient background (Desktop only) */}
      <AmbientBackground selectedTag={selectedTag} />

      {/* Sticky Top Bar Container: Header + Category Nav (Semi-translucent on mobile for 60fps, backdrop-blur on desktop) */}
      <div className="sticky top-0 z-40 bg-white/95 md:bg-transparent md:backdrop-blur-md pt-4 md:pt-10 pb-3 md:pb-4 mb-4 md:mb-6">
        {/* Line 1: Header + Major Category Switcher + Controls */}
        <header className="mb-4 flex flex-wrap justify-between items-baseline gap-y-3">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h1
              onClick={handleCloseRef}
              className="text-[14px] font-normal tracking-tight cursor-pointer inline-block"
            >
              ref-archive
            </h1>

            {/* Major Category Switcher: WEB / POSTERS (Typographic switcher, no boxes/borders) */}
            <div className="flex items-baseline gap-2.5 text-[14px]">
              <button
                type="button"
                onClick={() => handleSwitchMajorCategory('WEB')}
                className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] transition-opacity ${
                  majorCategory === 'WEB'
                    ? 'font-medium underline underline-offset-4 text-black'
                    : 'opacity-40 hover:opacity-100 no-underline text-black'
                }`}
              >
                WEB <span className="text-[12px] opacity-60">[{webList.length}]</span>
              </button>
              <span className="opacity-20 text-[12px] select-none">/</span>
              <button
                type="button"
                onClick={() => handleSwitchMajorCategory('POSTERS')}
                className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] transition-opacity ${
                  majorCategory === 'POSTERS'
                    ? 'font-medium underline underline-offset-4 text-black'
                    : 'opacity-40 hover:opacity-100 no-underline text-black'
                }`}
              >
                POSTERS <span className="text-[12px] opacity-60">[{posterList.length}]</span>
              </button>
            </div>

            <a
              href="https://cdj.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] opacity-40 hover:opacity-100 transition-opacity no-underline text-black"
            >
              arranged by studiofluxus™
            </a>
          </div>

          {/* Controls: View Switcher only */}
          <div className="flex items-center gap-3 text-[14px]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`bg-transparent p-0 border-0 cursor-pointer ${
                viewMode === 'grid' ? 'underline underline-offset-4 font-normal' : 'opacity-40 no-underline'
              }`}
            >
              그리드
            </button>
            <button
              type="button"
              onClick={() => setViewMode('index')}
              className={`bg-transparent p-0 border-0 cursor-pointer ${
                viewMode === 'index' ? 'underline underline-offset-4 font-normal' : 'opacity-40 no-underline'
              }`}
            >
              인덱스
            </button>
            <span className="hidden md:inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('canvas')}
                className={`bg-transparent p-0 border-0 cursor-pointer ${
                  viewMode === 'canvas' ? 'underline underline-offset-4 font-normal' : 'opacity-40 no-underline'
                }`}
              >
                캔버스
              </button>
              {viewMode === 'canvas' && (
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('refarchive-shuffle'));
                  }}
                  className="bg-black text-white px-2 py-0.5 text-[12px] cursor-pointer hover:bg-neutral-800 transition-colors ml-1 border-0"
                  title="모든 카드를 사방으로 흩뿌리기"
                >
                  셔플 ✦
                </button>
              )}
            </span>
          </div>
        </header>

        {/* Line 2: Tags & Groups Navigation */}
        {majorCategory === 'WEB' ? (
          /* Web Category Tags */
          <nav>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[14px]">
              {initialTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <li key={tag} className="inline-block">
                    <button
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] ${
                        isSelected ? 'underline underline-offset-4 font-normal' : 'no-underline opacity-70'
                      }`}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          /* Posters Groups & Styles Navigation */
          <div className="space-y-3">
            {/* Style Group Switcher */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] border-b border-black/10 pb-2.5">
              {POSTER_GROUPS.map((grp) => {
                const isSelected = selectedGroup === grp;
                const count = grp === 'All' ? posterList.length : posterList.filter((p) => p.group === grp).length;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      setSelectedGroup(grp);
                      setSelectedTag('전체');
                    }}
                    className={`bg-transparent p-0 border-0 cursor-pointer transition-colors ${
                      isSelected
                        ? 'font-medium text-black underline underline-offset-4'
                        : 'opacity-40 hover:opacity-100 no-underline'
                    }`}
                  >
                    {grp} <span className="text-[11px] opacity-60">[{count}]</span>
                  </button>
                );
              })}
            </div>

            {/* Style Tags within Selected Group */}
            <nav>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
                {currentPosterTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <li key={tag} className="inline-block">
                      <button
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`bg-transparent p-0 border-0 cursor-pointer text-[13px] ${
                          isSelected
                            ? 'underline underline-offset-4 font-normal text-black'
                            : 'no-underline opacity-60 hover:opacity-100'
                        }`}
                      >
                        {tag}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Line 3: Content View (Grid, Index, or Canvas) */}
      <section className="relative z-10">
        {viewMode === 'grid' && (
          <>
            {/* Grid View with Responsive Columns (Web vs Poster) */}
            <div
              className={
                majorCategory === 'POSTERS'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10'
                  : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10'
              }
            >
              {displayedReferences.map((refItem) => (
                <GridReferenceCard
                  key={refItem.id}
                  refItem={refItem}
                  onSelect={handleSelectRef}
                  isMobile={isMobile}
                />
              ))}
            </div>
            {visibleCount < sortedReferences.length && (
              <div ref={loadMoreRef} className="w-full h-24 pointer-events-none" />
            )}
          </>
        )}

        {viewMode === 'index' && (
          /* Index View */
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="opacity-40 font-normal pb-4">
                  <th className="py-2 pr-4 font-normal w-12">#</th>
                  <th className="py-2 pr-6 font-normal w-1/3">제목</th>
                  <th className="py-2 pr-6 font-normal w-1/3">설명</th>
                  <th className="py-2 pr-6 font-normal">태그</th>
                </tr>
              </thead>
              <tbody>
                {sortedReferences.map((refItem, idx) => (
                  <IndexReferenceRow
                    key={refItem.id}
                    refItem={refItem}
                    idx={idx}
                    onSelect={handleSelectRef}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isMobile && viewMode === 'canvas' && (
          /* Free-Canvas Mode (Matter/Physics-style Draggable Canvas) */
          <CanvasView
            references={sortedReferences}
            onSelectRef={handleSelectRef}
            onHoverRef={(refItem) => hoverStore.setHovered(refItem)}
            basePath={basePath}
          />
        )}
      </section>

      {/* Detail Overlay View */}
      {activeRef && (
        <div className="fixed inset-0 z-50 bg-white p-6 md:p-12 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Top Bar inside Detail */}
            <div className="flex justify-between items-baseline mb-8">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  onClick={handleCloseRef}
                  className="text-[14px] cursor-pointer"
                >
                  ref-archive
                </span>
                <a
                  href="https://cdj.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] opacity-40 hover:opacity-100 transition-opacity no-underline text-black"
                >
                  arranged by studiofluxus™
                </a>
              </div>
              <button
                type="button"
                onClick={handleCloseRef}
                className="text-[14px] bg-transparent border-0 cursor-pointer p-0"
              >
                닫기
              </button>
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-normal mb-8">{activeRef.title}</h2>

            {/* Large Capture */}
            <div
              style={{ aspectRatio: activeRef.majorCategory === 'POSTERS' ? '3 / 4' : '16 / 10' }}
              className={`relative w-full ${
                activeRef.majorCategory === 'POSTERS' ? 'max-w-xl aspect-[3/4]' : 'max-w-5xl aspect-[16/10]'
              } mb-8 bg-white overflow-hidden border border-black/5`}
            >
              <SafeImage
                src={activeRef.imageUrl}
                alt={activeRef.title}
                fallbackSvg={
                  activeRef.majorCategory === 'POSTERS' || activeRef.imageUrl.includes('/posters/')
                    ? activeRef.imageUrl
                    : `/captures/${activeRef.id}.svg`
                }
                objectFit="object-contain"
              />
            </div>

            {/* Detail Details: Summary, Reference, Link */}
            <div className="space-y-4 max-w-3xl text-[14px] leading-relaxed">
              <p>
                <span className="opacity-60">요약: </span>
                {activeRef.anatomy}
              </p>
              <p>
                <span className="opacity-60">참고: </span>
                {activeRef.principle}
              </p>
              <p>
                <span className="opacity-60">링크: </span>
                <a
                  href={activeRef.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {activeRef.majorCategory === 'POSTERS'
                    ? '핀터레스트 레퍼런스 탐색 ↗'
                    : activeRef.url}
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6">
            <button
              type="button"
              onClick={handleCloseRef}
              className="text-[14px] bg-transparent border-0 cursor-pointer p-0 underline underline-offset-4"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
