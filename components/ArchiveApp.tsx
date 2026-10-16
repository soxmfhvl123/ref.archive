'use client';

import { useState, useRef, useMemo, useEffect, memo, useCallback } from 'react';
import { Reference, MajorCategory } from '@/lib/types';
import { POSTER_GROUPS, POSTER_BASE_STYLES } from '@/lib/data/posters';
import {
  FURNITURE_GROUPS,
  FURNITURE_TAG_ORDER,
  FURNITURE_REGIONS,
  FURNITURE_MATERIAL_TAGS,
  FURNITURE_THEME_TAGS,
} from '@/lib/data/furniture';
import {
  FASHION_GROUPS,
  FASHION_TAG_ORDER,
  FASHION_REGIONS,
  FASHION_MATERIAL_TAGS,
  FASHION_THEME_TAGS,
} from '@/lib/data/fashion';
import Image from 'next/image';
import TiltCard from '@/components/TiltCard';
import CanvasView from '@/components/CanvasView';
import AmbientBackground from '@/components/AmbientBackground';
import { hoverStore } from '@/lib/hoverStore';

interface ArchiveAppProps {
  initialWebReferences?: Reference[];
  initialPosterReferences?: Reference[];
  initialFurnitureReferences?: Reference[];
  initialFashionReferences?: Reference[];
  initialReferences?: Reference[];
  initialTags?: string[];
  initialPosterTags?: string[];
  initialFurnitureTags?: string[];
  initialFashionTags?: string[];
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
  const fallbackPath = isPoster || imageUrl.includes('/posters/') ? imageUrl.replace('.jpg', '.svg') : `/captures/${id}.svg`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ aspectRatio: isPoster ? '3 / 4' : '16 / 10' }}
      className={`relative w-full ${aspectRatio} bg-neutral-100 overflow-hidden mb-2 sm:mb-3 border border-black/5`}
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
  const isFurniture = refItem.majorCategory === 'FURNITURE';
  const isFashion = refItem.majorCategory === 'FASHION';
  const cardAspectRatio = isPoster || isFashion ? 'aspect-[3/4]' : isFurniture ? 'aspect-[4/3]' : 'aspect-[16/10]';

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
        <div className="text-[13px] sm:text-[14px] leading-tight space-y-0.5 sm:space-y-1">
          <div className="flex items-baseline justify-between gap-1.5 sm:gap-2">
            <span className="font-normal tracking-tight truncate">{refItem.title}</span>
            {refItem.group && (isPoster || isFurniture || isFashion) && (
              <span className="hidden sm:inline-block text-[11px] opacity-40 uppercase tracking-wider shrink-0">{refItem.group}</span>
            )}
          </div>
          {refItem.shortDesc && (
            <div className="opacity-60 text-[12px] sm:text-[13px] line-clamp-1">{refItem.shortDesc}</div>
          )}
        </div>
      </TiltCard>
    </article>
  );
});

const IndexReferenceRow = memo(function IndexReferenceRow({
  refItem,
  idx,
  onSelect,
  isPostersView,
  isFurnitureView,
  isFashionView,
}: {
  refItem: Reference;
  idx: number;
  onSelect: (ref: Reference) => void;
  isPostersView?: boolean;
  isFurnitureView?: boolean;
  isFashionView?: boolean;
}) {
  return (
    <tr
      onClick={() => onSelect(refItem)}
      onMouseEnter={() => {
        hoverStore.setHovered(refItem);
      }}
      onMouseLeave={() => hoverStore.setHovered(null)}
      className="cursor-pointer hover:bg-black/[0.03] transition-colors"
    >
      <td className="py-2.5 pr-4 opacity-40 font-normal">
        {String(idx + 1).padStart(3, '0')}
      </td>
      <td className={`py-2.5 pr-6 font-normal ${isPostersView ? 'w-1/2' : isFurnitureView || isFashionView ? 'w-1/4' : 'w-1/3'}`}>
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
      {isFurnitureView || isFashionView ? (
        <>
          <td className="py-2.5 pr-6 opacity-60 font-normal w-1/4">
            {refItem.shortDesc}
          </td>
          <td className="py-2.5 pr-6 opacity-60 font-normal w-1/3">
            {refItem.anatomy}
          </td>
        </>
      ) : !isPostersView ? (
        <td className="py-2.5 pr-6 opacity-60 font-normal w-1/3">
          {refItem.shortDesc}
        </td>
      ) : null}
      <td className="py-2.5 pr-6 opacity-60 font-normal">
        {refItem.tags.join(', ')}
      </td>
    </tr>
  );
});

export default function ArchiveApp({
  initialWebReferences = [],
  initialPosterReferences = [],
  initialFurnitureReferences = [],
  initialFashionReferences = [],
  initialReferences = [],
  initialTags = [],
  initialPosterTags = [],
  initialFurnitureTags = [],
  initialFashionTags = [],
}: ArchiveAppProps) {
  const [majorCategory, setMajorCategory] = useState<MajorCategory>('WEB');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [activeRef, setActiveRef] = useState<Reference | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'index' | 'canvas'>('grid');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const activeTagRef = useRef<HTMLButtonElement | null>(null);

  // Keyboard shortcut: '/' or 'Cmd+K' to focus search, 'Escape' to clear and close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if (isInput) {
        if (e.key === 'Escape') {
          setSearchQuery('');
          (e.target as HTMLElement).blur();
          setIsSearchOpen(false);
        }
        return;
      }
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll selected tag into view horizontally on mobile
  useEffect(() => {
    if (activeTagRef.current) {
      activeTagRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedTag, selectedGroup]);

  const webList = initialWebReferences.length > 0 ? initialWebReferences : initialReferences;
  const posterList = initialPosterReferences;
  const furnitureList = initialFurnitureReferences;
  const fashionList = initialFashionReferences;
  const currentDataset =
    majorCategory === 'WEB'
      ? webList
      : majorCategory === 'POSTERS'
      ? posterList
      : majorCategory === 'FURNITURE'
      ? furnitureList
      : fashionList;

  const handleSwitchMajorCategory = useCallback(
    (cat: MajorCategory) => {
      setMajorCategory(cat);
      setSelectedGroup('All');
      setSelectedTag('전체');
      if (typeof window !== 'undefined') {
        const newHash =
          cat === 'POSTERS'
            ? '#posters'
            : cat === 'FURNITURE'
            ? '#furniture'
            : cat === 'FASHION'
            ? '#fashion'
            : '#web';
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
      } else if (hash === '#furniture' || hash === '#furn' || tab === 'furniture' || tab === 'furn') {
        setMajorCategory('FURNITURE');
      } else if (hash === '#fashion' || hash === '#fash' || tab === 'fashion' || tab === 'fash') {
        setMajorCategory('FASHION');
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

  const currentFurnitureTags = useMemo(() => {
    let pool = furnitureList;
    if (selectedGroup !== 'All') {
      pool = pool.filter((f) => f.group === selectedGroup);
    }
    const tagsSet = new Set<string>();
    pool.forEach((f) => f.tags.forEach((t) => tagsSet.add(t)));
    const sorted = FURNITURE_TAG_ORDER.filter((t) => tagsSet.has(t));
    return ['전체', ...sorted];
  }, [furnitureList, selectedGroup]);

  const furnitureTagClusters = useMemo(() => {
    const tagsWithoutAll = currentFurnitureTags.filter((t) => t !== '전체');
    const regions = tagsWithoutAll.filter((t) => (FURNITURE_REGIONS as readonly string[]).includes(t));
    const materials = tagsWithoutAll.filter((t) => (FURNITURE_MATERIAL_TAGS as readonly string[]).includes(t));
    const themes = tagsWithoutAll.filter((t) => (FURNITURE_THEME_TAGS as readonly string[]).includes(t));

    const showFirstDivider = regions.length > 0 && (materials.length > 0 || themes.length > 0);
    const showSecondDivider = materials.length > 0 && themes.length > 0;

    return { regions, materials, themes, showFirstDivider, showSecondDivider };
  }, [currentFurnitureTags]);

  const currentFashionTags = useMemo(() => {
    let pool = fashionList;
    if (selectedGroup !== 'All') {
      pool = pool.filter((f) => f.group === selectedGroup);
    }
    const tagsSet = new Set<string>();
    pool.forEach((f) => f.tags.forEach((t) => tagsSet.add(t)));
    const sorted = FASHION_TAG_ORDER.filter((t) => tagsSet.has(t));
    return ['전체', ...sorted];
  }, [fashionList, selectedGroup]);

  const fashionTagClusters = useMemo(() => {
    const tagsWithoutAll = currentFashionTags.filter((t) => t !== '전체');
    const regions = tagsWithoutAll.filter((t) => (FASHION_REGIONS as readonly string[]).includes(t));
    const materials = tagsWithoutAll.filter((t) => (FASHION_MATERIAL_TAGS as readonly string[]).includes(t));
    const themes = tagsWithoutAll.filter((t) => (FASHION_THEME_TAGS as readonly string[]).includes(t));

    const showFirstDivider = regions.length > 0 && (materials.length > 0 || themes.length > 0);
    const showSecondDivider = materials.length > 0 && themes.length > 0;

    return { regions, materials, themes, showFirstDivider, showSecondDivider };
  }, [currentFashionTags]);

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
    if (typeof window !== 'undefined') {
      window.history.pushState({ refDetail: refItem.id }, '', `#ref-${refItem.id}`);
    }
  }, []);

  const handleCloseRef = useCallback(() => {
    hoverStore.setHovered(null);
    setActiveRef(null);
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#ref-')) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname +
          (majorCategory === 'POSTERS'
            ? '#posters'
            : majorCategory === 'FURNITURE'
            ? '#furniture'
            : majorCategory === 'FASHION'
            ? '#fashion'
            : '#web')
      );
    }
  }, [majorCategory]);

  // ESC key support to close detail view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeRef) {
          e.preventDefault();
          e.stopPropagation();
          handleCloseRef();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activeRef, handleCloseRef]);

  // Mobile back gesture & browser back button support to close detail view
  useEffect(() => {
    const handlePopState = () => {
      if (activeRef) {
        hoverStore.setHovered(null);
        setActiveRef(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeRef]);

  const filteredReferences = useMemo(() => {
    let list = currentDataset;
    if (
      (majorCategory === 'POSTERS' ||
        majorCategory === 'FURNITURE' ||
        majorCategory === 'FASHION') &&
      selectedGroup !== 'All'
    ) {
      list = list.filter((ref) => ref.group === selectedGroup);
    }
    if (selectedTag !== '전체') {
      list = list.filter((ref) => ref.tags.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((ref) => {
        return (
          ref.title.toLowerCase().includes(q) ||
          (ref.shortDesc && ref.shortDesc.toLowerCase().includes(q)) ||
          (ref.anatomy && ref.anatomy.toLowerCase().includes(q)) ||
          (ref.principle && ref.principle.toLowerCase().includes(q)) ||
          (ref.url && ref.url.toLowerCase().includes(q)) ||
          ref.tags.some((t) => t.toLowerCase().includes(q)) ||
          (ref.group && ref.group.toLowerCase().includes(q)) ||
          (ref.category && ref.category.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [currentDataset, majorCategory, selectedGroup, selectedTag, searchQuery]);

  // 'newest' is the default sorting for WEB (latest added first). For POSTERS, preserve curated series order.
  const sortedReferences = useMemo(() => {
    return majorCategory === 'WEB' ? [...filteredReferences].reverse() : [...filteredReferences];
  }, [filteredReferences, majorCategory]);

  const BATCH_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset visible count when switching category, filtering or searching
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [majorCategory, selectedGroup, selectedTag, searchQuery]);

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
      <AmbientBackground
        selectedTag={selectedTag}
        viewMode={viewMode}
        majorCategory={majorCategory}
      />

      {/* Sticky Top Bar Container: Header + Category Nav (Transparent background with backdrop blur) */}
      <div className="sticky top-0 z-40 bg-transparent backdrop-blur-md pt-3 md:pt-10 pb-2.5 md:pb-4 mb-3 md:mb-6">
        {/* Line 1: Header + Major Category Switcher + Controls */}
        <header className="mb-2.5 md:mb-4 flex flex-wrap justify-between items-baseline gap-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 sm:gap-x-4 gap-y-1">
            <h1
              onClick={handleCloseRef}
              className="text-[14px] font-normal tracking-tight cursor-pointer inline-block"
            >
              ref-archive
            </h1>

            {/* Major Category Switcher: WEB / POSTERS / FURNITURE (Typographic switcher, no boxes/borders) */}
            <div className="flex items-baseline gap-2 text-[14px]">
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
              <span className="opacity-20 text-[12px] select-none">/</span>
              <button
                type="button"
                onClick={() => handleSwitchMajorCategory('FURNITURE')}
                className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] transition-opacity ${
                  majorCategory === 'FURNITURE'
                    ? 'font-medium underline underline-offset-4 text-black'
                    : 'opacity-40 hover:opacity-100 no-underline text-black'
                }`}
              >
                FURNITURE <span className="text-[12px] opacity-60">[{furnitureList.length}]</span>
              </button>
              <span className="opacity-20 text-[12px] select-none">/</span>
              <button
                type="button"
                onClick={() => handleSwitchMajorCategory('FASHION')}
                className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] transition-opacity ${
                  majorCategory === 'FASHION'
                    ? 'font-medium underline underline-offset-4 text-black'
                    : 'opacity-40 hover:opacity-100 no-underline text-black'
                }`}
              >
                FASHION <span className="text-[12px] opacity-60">[{fashionList.length}]</span>
              </button>
            </div>

            <a
              href="https://cdj.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-[14px] opacity-40 hover:opacity-100 transition-opacity no-underline text-black"
            >
              arranged by studiofluxus™
            </a>
          </div>

          {/* Controls: Search + View Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 text-[14px]">
            {/* Search Input / Toggle */}
            <div className="relative flex items-center">
              {isSearchOpen || searchQuery ? (
                <div className="flex items-center gap-1.5 bg-black/[0.04] px-2 py-0.5 rounded transition-all border border-black/10">
                  <span className="text-[12px] opacity-40 select-none">🔍</span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색..."
                    className="bg-transparent text-[13px] text-black placeholder:text-neutral-400 focus:outline-none w-20 sm:w-28 md:w-36 transition-all focus:w-24 sm:focus:w-36 md:focus:w-44"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[11px] opacity-40 hover:opacity-100 p-0.5 border-0 bg-transparent cursor-pointer leading-none"
                      title="검색어 지우기"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[11px] opacity-40 hover:opacity-100 p-0.5 border-0 bg-transparent cursor-pointer leading-none"
                      title="검색 닫기"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }}
                  className="bg-transparent p-0 border-0 cursor-pointer opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 text-[13px] md:text-[14px]"
                  title="검색 (단축키: /)"
                >
                  <span>검색</span>
                  <span className="hidden sm:inline text-[11px] opacity-40 font-mono">[/]</span>
                </button>
              )}
            </div>

            <span className="opacity-20 text-[12px] select-none">/</span>

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
          /* Web Category Tags: Clean horizontal swipe on mobile, wrapped on desktop */
          <nav className="overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <ul className="flex items-center gap-x-4 md:gap-x-5 whitespace-nowrap md:whitespace-normal md:flex-wrap text-[13px] md:text-[14px] py-0.5">
              {initialTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <li key={tag} className="inline-block shrink-0">
                    <button
                      type="button"
                      ref={isSelected ? activeTagRef : null}
                      onClick={() => setSelectedTag(tag)}
                      className={`bg-transparent p-0 border-0 cursor-pointer text-[13px] md:text-[14px] ${
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
        ) : majorCategory === 'FURNITURE' ? (
          /* Furniture Groups & Tags Navigation: Clean 2-row horizontal swipe on mobile, wrapped on desktop */
          <div className="space-y-2">
            {/* Furniture Group Switcher */}
            <div className="flex items-center gap-x-3.5 md:gap-x-4 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal md:flex-wrap no-scrollbar text-[13px] border-b border-black/10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {FURNITURE_GROUPS.map((grp) => {
                const isSelected = selectedGroup === grp;
                const count = grp === 'All' ? furnitureList.length : furnitureList.filter((f) => f.group === grp).length;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      setSelectedGroup(grp);
                      setSelectedTag('전체');
                    }}
                    className={`bg-transparent p-0 border-0 cursor-pointer shrink-0 transition-colors ${
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

            {/* Furniture Tags within Selected Group */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <nav className="flex-1 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <ul className="flex items-center gap-x-3.5 md:gap-x-4 whitespace-nowrap md:whitespace-normal md:flex-wrap text-[13px]">
                  {/* 전체 */}
                  <li key="전체" className="inline-block shrink-0">
                    <button
                      type="button"
                      ref={selectedTag === '전체' ? activeTagRef : null}
                      onClick={() => setSelectedTag('전체')}
                      className={`bg-transparent p-0 border-0 cursor-pointer text-[13px] ${
                        selectedTag === '전체'
                          ? 'underline underline-offset-4 font-normal text-black'
                          : 'no-underline opacity-60 hover:opacity-100'
                      }`}
                    >
                      전체
                    </button>
                  </li>

                  {/* 지역 (Regions) */}
                  {furnitureTagClusters.regions.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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

                  {/* 지역 - 재료/키워드 세로 구분선 */}
                  {furnitureTagClusters.showFirstDivider && (
                    <li className="inline-block shrink-0 opacity-20 select-none text-[12px] -mx-1" aria-hidden="true">
                      |
                    </li>
                  )}

                  {/* 재료 (Materials) */}
                  {furnitureTagClusters.materials.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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

                  {/* 재료 - 키워드 세로 구분선 */}
                  {furnitureTagClusters.showSecondDivider && (
                    <li className="inline-block shrink-0 opacity-20 select-none text-[12px] -mx-1" aria-hidden="true">
                      |
                    </li>
                  )}

                  {/* 키워드 (Themes) */}
                  {furnitureTagClusters.themes.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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
          </div>
        ) : majorCategory === 'FASHION' ? (
          /* Fashion Groups & Tags Navigation: Clean 2-row horizontal swipe on mobile, wrapped on desktop */
          <div className="space-y-2">
            {/* Fashion Group Switcher */}
            <div className="flex items-center gap-x-3.5 md:gap-x-4 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal md:flex-wrap no-scrollbar text-[13px] border-b border-black/10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {FASHION_GROUPS.map((grp) => {
                const isSelected = selectedGroup === grp;
                const count = grp === 'All' ? fashionList.length : fashionList.filter((f) => f.group === grp).length;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      setSelectedGroup(grp);
                      setSelectedTag('전체');
                    }}
                    className={`bg-transparent p-0 border-0 cursor-pointer shrink-0 transition-colors ${
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

            {/* Fashion Tags within Selected Group */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <nav className="flex-1 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <ul className="flex items-center gap-x-3.5 md:gap-x-4 whitespace-nowrap md:whitespace-normal md:flex-wrap text-[13px]">
                  {/* 전체 */}
                  <li key="전체" className="inline-block shrink-0">
                    <button
                      type="button"
                      ref={selectedTag === '전체' ? activeTagRef : null}
                      onClick={() => setSelectedTag('전체')}
                      className={`bg-transparent p-0 border-0 cursor-pointer text-[13px] ${
                        selectedTag === '전체'
                          ? 'underline underline-offset-4 font-normal text-black'
                          : 'no-underline opacity-60 hover:opacity-100'
                      }`}
                    >
                      전체
                    </button>
                  </li>

                  {/* 지역 (Regions) */}
                  {fashionTagClusters.regions.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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

                  {/* 지역 - 재료/키워드 세로 구분선 */}
                  {fashionTagClusters.showFirstDivider && (
                    <li className="inline-block shrink-0 opacity-20 select-none text-[12px] -mx-1" aria-hidden="true">
                      |
                    </li>
                  )}

                  {/* 재료 (Materials) */}
                  {fashionTagClusters.materials.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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

                  {/* 재료 - 키워드 세로 구분선 */}
                  {fashionTagClusters.showSecondDivider && (
                    <li className="inline-block shrink-0 opacity-20 select-none text-[12px] -mx-1" aria-hidden="true">
                      |
                    </li>
                  )}

                  {/* 키워드 (Themes) */}
                  {fashionTagClusters.themes.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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
          </div>
        ) : (
          /* Posters Groups & Styles Navigation: Clean 2-row horizontal swipe on mobile, wrapped on desktop */
          <div className="space-y-2">
            {/* Style Group Switcher */}
            <div className="flex items-center gap-x-3.5 md:gap-x-4 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal md:flex-wrap no-scrollbar text-[13px] border-b border-black/10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                    className={`bg-transparent p-0 border-0 cursor-pointer shrink-0 transition-colors ${
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
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <nav className="flex-1 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <ul className="flex items-center gap-x-3.5 md:gap-x-4 whitespace-nowrap md:whitespace-normal md:flex-wrap text-[13px]">
                  {currentPosterTags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <li key={tag} className="inline-block shrink-0">
                        <button
                          type="button"
                          ref={isSelected ? activeTagRef : null}
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

              {/* Mobile Category Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setCategorySearchQuery('');
                  setIsCategoryDrawerOpen(true);
                }}
                className="shrink-0 text-[11px] tracking-tight px-2 py-0.5 border border-black/20 hover:border-black/50 transition-colors bg-transparent select-none flex items-center gap-1 md:hidden"
                title={`전체 ${POSTER_BASE_STYLES.length}개 스타일 목록 보기`}
              >
                <span>전체 목록</span>
                <span className="text-[9px] opacity-60">⊞</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Line 3: Content View (Grid, Index, or Canvas) */}
      <section className="relative z-10">
        {/* Search Results Summary Header if searching */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between text-[13px] border-b border-black/10 pb-2">
            <span className="text-neutral-600">
              &ldquo;<span className="font-medium text-black">{searchQuery}</span>&rdquo; 검색 결과: {filteredReferences.length}개
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-black underline underline-offset-2 bg-transparent border-0 cursor-pointer text-[12px] opacity-60 hover:opacity-100"
            >
              검색어 초기화
            </button>
          </div>
        )}

        {/* Empty State when no items match search or filter */}
        {filteredReferences.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-[15px] text-black mb-1.5">
              &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-[13px] text-neutral-500 mb-4">다른 검색어를 입력하시거나 필터를 초기화해 보세요.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('전체');
                setSelectedGroup('All');
              }}
              className="px-3 py-1.5 border border-black/20 hover:border-black text-[13px] bg-transparent cursor-pointer transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}

        {viewMode === 'grid' && (
          <>
            {/* Grid View with Responsive Columns (Web vs Poster vs Furniture) */}
            <div
              className={
                majorCategory === 'POSTERS'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-10'
                  : majorCategory === 'FURNITURE'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-7 sm:gap-y-10'
                  : majorCategory === 'FASHION'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-7 sm:gap-y-10'
                  : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10'
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
                  <th className={`py-2 pr-6 font-normal ${majorCategory === 'POSTERS' ? 'w-1/2' : majorCategory === 'FURNITURE' || majorCategory === 'FASHION' ? 'w-1/4' : 'w-1/3'}`}>
                    {majorCategory === 'FURNITURE' || majorCategory === 'FASHION' ? '이름 / 브랜드' : '제목'}
                  </th>
                  {majorCategory === 'FURNITURE' || majorCategory === 'FASHION' ? (
                    <>
                      <th className="py-2 pr-6 font-normal w-1/4">소재·매체</th>
                      <th className="py-2 pr-6 font-normal w-1/3">참고 포인트</th>
                    </>
                  ) : majorCategory !== 'POSTERS' ? (
                    <th className="py-2 pr-6 font-normal w-1/3">설명</th>
                  ) : null}
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
                    isPostersView={majorCategory === 'POSTERS'}
                    isFurnitureView={majorCategory === 'FURNITURE'}
                    isFashionView={majorCategory === 'FASHION'}
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
        <div className="fixed inset-0 z-50 bg-white px-4 py-5 sm:p-8 md:p-12 overflow-y-auto flex flex-col justify-between pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div>
            {/* Top Bar inside Detail */}
            <div className="flex justify-between items-baseline mb-6 sm:mb-8">
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
                  className="hidden sm:inline-block text-[14px] opacity-40 hover:opacity-100 transition-opacity no-underline text-black"
                >
                  arranged by studiofluxus™
                </a>
              </div>
              <button
                type="button"
                onClick={handleCloseRef}
                className="text-[14px] bg-transparent border-0 cursor-pointer py-1.5 px-3 -mr-2"
              >
                닫기
              </button>
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-normal mb-8">{activeRef.title}</h2>

            {/* Large Capture */}
            <div
              style={{
                aspectRatio:
                  activeRef.majorCategory === 'POSTERS' || activeRef.majorCategory === 'FASHION'
                    ? '3 / 4'
                    : activeRef.majorCategory === 'FURNITURE'
                    ? '4 / 3'
                    : '16 / 10',
              }}
              className={`relative w-full ${
                activeRef.majorCategory === 'POSTERS' || activeRef.majorCategory === 'FASHION'
                  ? 'max-w-xl aspect-[3/4]'
                  : activeRef.majorCategory === 'FURNITURE'
                  ? 'max-w-4xl aspect-[4/3]'
                  : 'max-w-5xl aspect-[16/10]'
              } mb-8 bg-white overflow-hidden border border-black/5`}
            >
              <SafeImage
                src={activeRef.imageUrl}
                alt={activeRef.title}
                fallbackSvg={
                  activeRef.majorCategory === 'POSTERS' || activeRef.imageUrl.includes('/posters/')
                    ? activeRef.imageUrl.replace('.jpg', '.svg')
                    : activeRef.majorCategory === 'FURNITURE' || activeRef.imageUrl.includes('/furniture/')
                    ? activeRef.imageUrl.replace('.jpg', '.svg')
                    : activeRef.majorCategory === 'FASHION' || activeRef.imageUrl.includes('/fashion/')
                    ? activeRef.imageUrl
                    : `/captures/${activeRef.id}.svg`
                }
                objectFit="object-contain"
              />
            </div>

            {/* Detail Details: Summary, Reference, Link */}
            <div className="space-y-4 max-w-3xl text-[14px] leading-relaxed">
              {activeRef.majorCategory === 'FURNITURE' || activeRef.majorCategory === 'FASHION' ? (
                <>
                  <p>
                    <span className="opacity-60">{activeRef.majorCategory === 'FASHION' ? '소재: ' : '재료·매체: '}</span>
                    {activeRef.shortDesc}
                  </p>
                  <p>
                    <span className="opacity-60">참고 포인트: </span>
                    {activeRef.anatomy}
                  </p>
                  <p>
                    <span className="opacity-60">정보: </span>
                    {activeRef.principle}
                  </p>
                </>
              ) : activeRef.majorCategory !== 'POSTERS' ? (
                <>
                  <p>
                    <span className="opacity-60">요약: </span>
                    {activeRef.anatomy}
                  </p>
                  <p>
                    <span className="opacity-60">참고: </span>
                    {activeRef.principle}
                  </p>
                </>
              ) : null}
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
                    : activeRef.majorCategory === 'FURNITURE' || activeRef.majorCategory === 'FASHION'
                    ? `${activeRef.title} 공식 웹페이지 / 정보 바로가기 ↗`
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

      {/* Mobile Category Explorer Modal / Bottom Sheet */}
      {isCategoryDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
          onClick={() => setIsCategoryDrawerOpen(false)}
        >
          <div
            className="w-full sm:max-w-xl max-h-[85vh] bg-white text-black border-t sm:border border-black/20 flex flex-col overflow-hidden shadow-2xl pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-black/10 flex items-center justify-between bg-white">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-medium">스타일 카테고리 ({POSTER_BASE_STYLES.length})</span>
                <span className="text-[12px] opacity-40">총 {posterList.length}개</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="text-[13px] opacity-60 hover:opacity-100 px-2 py-1 border-0 bg-transparent cursor-pointer font-sans"
              >
                닫기 ✕
              </button>
            </div>

            {/* Live Search Input */}
            <div className="px-5 py-2.5 border-b border-black/10 bg-neutral-50/50">
              <input
                type="text"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                placeholder="스타일 검색 (예: Y2K, Bauhaus, Cyberpunk)..."
                className="w-full text-[13px] bg-transparent outline-none border-b border-black/20 focus:border-black py-1 placeholder:opacity-40"
              />
            </div>

            {/* Modal Body: Groups and Styles */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 overscroll-contain">
              {/* Option to select All */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup('All');
                    setSelectedTag('전체');
                    setIsCategoryDrawerOpen(false);
                  }}
                  className={`text-[13px] px-3 py-1.5 border transition-colors cursor-pointer ${
                    selectedGroup === 'All' && selectedTag === '전체'
                      ? 'bg-black text-white border-black font-medium'
                      : 'border-black/20 hover:border-black bg-transparent'
                  }`}
                >
                  전체 포스터 보기 ({posterList.length})
                </button>
              </div>

              {/* Group list */}
              {POSTER_GROUPS.filter((g) => g !== 'All').map((grp) => {
                const stylesInGroup = POSTER_BASE_STYLES.filter((s) => s.group === grp);
                const filteredStyles = categorySearchQuery.trim()
                  ? stylesInGroup.filter(
                      (s) =>
                        s.title.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                        s.shortDesc.toLowerCase().includes(categorySearchQuery.toLowerCase())
                    )
                  : stylesInGroup;

                if (filteredStyles.length === 0) return null;

                return (
                  <div key={grp} className="space-y-2">
                    <div className="flex items-baseline justify-between border-b border-black/10 pb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroup(grp);
                          setSelectedTag('전체');
                          setIsCategoryDrawerOpen(false);
                        }}
                        className="text-[13px] font-medium hover:underline text-left bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {grp} <span className="text-[11px] opacity-60">[{posterList.filter((p) => p.group === grp).length}]</span>
                      </button>
                      <span className="text-[11px] opacity-40">{filteredStyles.length}개 스타일</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filteredStyles.map((style) => {
                        const isCurrent = selectedTag === style.title;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => {
                              setSelectedGroup(grp);
                              setSelectedTag(style.title);
                              setIsCategoryDrawerOpen(false);
                            }}
                            className={`text-[12px] px-2.5 py-1 transition-colors border cursor-pointer ${
                              isCurrent
                                ? 'bg-black text-white border-black font-medium'
                                : 'bg-black/[0.02] border-black/10 hover:border-black/40 text-black'
                            }`}
                          >
                            {style.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
