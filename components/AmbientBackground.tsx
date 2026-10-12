'use client';

import { useEffect, useState, useRef } from 'react';
import { hoverStore, HoverData } from '@/lib/hoverStore';

interface AmbientBackgroundProps {
  selectedTag: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getFullPath(pathStr: string) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  return `${basePath}${cleanPath}`;
}

export default function AmbientBackground({ selectedTag }: AmbientBackgroundProps) {
  const [hoverData, setHoverData] = useState<HoverData>({ ref: null, colors: null });
  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches));
  }, []);

  // Subscribe directly to decoupled hoverStore
  useEffect(() => {
    const unsubscribe = hoverStore.subscribe((data) => {
      setHoverData(data);

      if (data.ref) {
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        const fullImg = getFullPath(data.ref.imageUrl);
        setActiveImgUrl(fullImg);
        setIsHovered(true);
      } else {
        setIsHovered(false);
        // Retain current image during smooth 600ms fadeout to prevent jarring disappearance
        fadeTimeoutRef.current = setTimeout(() => {
          setActiveImgUrl(null);
        }, 650);
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
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{ contain: 'strict' }}
    >
      {/* Heavy Gaussian Blurred Website Main Screen as Dynamic Ambient Gradient (Desktop only to prevent mobile fill-rate lag) */}
      {!isMobile && activeImgUrl && (
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

      {/* Subtle default corner glow when no card is hovered */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[160px] bg-neutral-300 transition-opacity duration-700 ease-out"
        style={{
          opacity: isHovered ? 0 : selectedTag === '전체' ? 0.03 : 0.06,
        }}
      />
    </div>
  );
}
