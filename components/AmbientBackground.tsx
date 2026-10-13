'use client';

import { useEffect, useState, useRef } from 'react';
import { hoverStore, HoverData } from '@/lib/hoverStore';
import { MajorCategory } from '@/lib/types';

interface AmbientBackgroundProps {
  selectedTag: string;
  viewMode?: 'grid' | 'index' | 'canvas';
  majorCategory?: MajorCategory;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getFullPath(pathStr: string) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  return `${basePath}${cleanPath}`;
}

export default function AmbientBackground({
  selectedTag,
  viewMode = 'grid',
  majorCategory = 'WEB',
}: AmbientBackgroundProps) {
  const [hoverData, setHoverData] = useState<HoverData>({ ref: null, colors: null });
  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches));
  }, []);

  const [isCurrentPoster, setIsCurrentPoster] = useState(false);

  // Determine if currently displayed item is a poster in index view
  const isPosterIndex =
    viewMode === 'index' && (isCurrentPoster || majorCategory === 'POSTERS');

  // Subscribe directly to decoupled hoverStore
  useEffect(() => {
    const unsubscribe = hoverStore.subscribe((data) => {
      setHoverData(data);

      if (data.ref) {
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        const isPoster = Boolean(
          data.ref.majorCategory === 'POSTERS' ||
          data.ref.imageUrl?.includes('/posters/') ||
          data.ref.aspectRatio === 'portrait'
        );
        setIsCurrentPoster(isPoster);
        const fullImg = getFullPath(data.ref.imageUrl);
        setActiveImgUrl(fullImg);
        setIsHovered(true);
      } else {
        // Debounce unhovering slightly (50ms) so moving mouse across adjacent table rows
        // seamlessly swaps images without flickering opacity
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          fadeTimeoutRef.current = setTimeout(() => {
            setActiveImgUrl(null);
            setIsCurrentPoster(false);
          }, 240);
        }, 50);
      }
    });

    return () => {
      unsubscribe();
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{ contain: 'strict' }}
    >
      {/* 1) Poster Index View: Crisp, unblurred poster displayed as-is in the background */}
      {!isMobile && isPosterIndex && activeImgUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 transition-opacity duration-200 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            willChange: 'opacity, transform',
          }}
        >
          <div
            className="relative max-h-[82vh] h-[82vh] aspect-[3/4] max-w-[85vw] transition-transform duration-200 ease-out"
            style={{
              transform: isHovered ? 'scale(1)' : 'scale(0.97)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImgUrl}
              alt=""
              className="w-full h-full object-contain filter drop-shadow-2xl select-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (activeImgUrl && activeImgUrl.endsWith('.jpg')) {
                  target.src = activeImgUrl.replace('.jpg', '.svg');
                }
              }}
            />
          </div>
        </div>
      )}

      {/* 2) Standard Heavy Gaussian Blurred Ambient Gradient for Web & non-index views */}
      {!isMobile && !isPosterIndex && activeImgUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-600 ease-out"
          style={{
            opacity: isHovered ? 0.32 : 0,
            willChange: 'opacity',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImgUrl}
            alt=""
            className="w-full h-full object-cover filter blur-[90px] saturate-[175%] contrast-[105%]"
            style={{
              transform: 'translate3d(0, 0, 0) scale(1.35)',
              willChange: 'opacity, filter',
            }}
          />
        </div>
      )}

      {/* Subtle default corner glow when no card is hovered and not in poster index view */}
      {!isPosterIndex && (
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[160px] bg-neutral-300 transition-opacity duration-700 ease-out"
          style={{
            opacity: isHovered ? 0 : selectedTag === '전체' ? 0.03 : 0.06,
          }}
        />
      )}
    </div>
  );
}
