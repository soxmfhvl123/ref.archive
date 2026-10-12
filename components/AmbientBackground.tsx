'use client';

import { useEffect, useState, useRef } from 'react';
import { hoverStore, HoverData } from '@/lib/hoverStore';

interface AmbientBackgroundProps {
  selectedTag: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  전체: '#d4d4d8',
  '3D WebGL': '#06b6d4',
  '인터랙티브 모션': '#0ea5e9',
  '실험적 웹': '#8b5cf6',
  '디자인 스튜디오': '#ef4444',
  '브랜드 아이덴티티': '#2563eb',
  타이포그래피: '#27272a',
  '에디토리얼 & 출판': '#d97706',
  '디자인 아카이브': '#a855f7',
  '매거진 & 블로그': '#f43f5e',
  '모션 & 3D': '#ec4899',
  '미디어 아트 & 전시': '#14b8a6',
  '일러스트 & 아티스트': '#f97316',
  '패션 & 컬처': '#6366f1',
  '디지털 제품 & UI': '#3b82f6',
  '리소스 & 툴': '#10b981',
  '공간 & 전시 디자인': '#78716c',
  '오브제 & 아트토이': '#eab308',
};

export default function AmbientBackground({ selectedTag }: AmbientBackgroundProps) {
  const [hoverData, setHoverData] = useState<HoverData>({ ref: null, colors: null });
  const cursorOrbRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const animFrameRef = useRef<number | null>(null);

  const defaultColor = CATEGORY_COLORS[selectedTag] || '#a1a1aa';
  const isHovered = Boolean(hoverData.ref && hoverData.colors);
  const primaryColor = hoverData.colors ? hoverData.colors[0] : defaultColor;
  const secondaryColor = hoverData.colors ? hoverData.colors[1] : defaultColor;

  // Subscribe directly to decoupled hoverStore (No ArchiveApp re-renders!)
  useEffect(() => {
    const unsubscribe = hoverStore.subscribe((data) => {
      setHoverData(data);
    });
    return unsubscribe;
  }, []);

  // High-performance DOM-based cursor tracking (Zero React setState on mousemove!)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const updateOrb = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        currentPos.current.x += dx * 0.15;
        currentPos.current.y += dy * 0.15;

        if (cursorOrbRef.current) {
          cursorOrbRef.current.style.transform = `translate3d(${currentPos.current.x - 340}px, ${currentPos.current.y - 340}px, 0)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(updateOrb);
    };

    animFrameRef.current = requestAnimationFrame(updateOrb);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{ contain: 'strict' }}
    >
      {/* 1. Fullscreen Multi-Stop Dynamic Gradient (Site Key Colors on Hover) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 0.20 : 0,
          background: isHovered
            ? `radial-gradient(circle 800px at 50% 35%, ${primaryColor} 0%, ${secondaryColor} 50%, transparent 80%)`
            : 'none',
          willChange: 'opacity',
        }}
      />

      {/* 2. Cursor Follower Luminous Orb (Direct DOM update, Zero re-renders) */}
      <div
        ref={cursorOrbRef}
        className="absolute w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-colors duration-400 ease-out"
        style={{
          transform: `translate3d(-500px, -500px, 0)`,
          backgroundColor: primaryColor,
          opacity: isHovered ? 0.18 : 0.05,
          willChange: 'transform, background-color',
        }}
      />

      {/* 3. Secondary Key Color Atmospheric Orb (Top-Right) */}
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full blur-[160px] transition-all duration-600 ease-out"
        style={{
          backgroundColor: secondaryColor,
          opacity: isHovered ? 0.16 : selectedTag === '전체' ? 0.04 : 0.07,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          willChange: 'background-color, opacity, transform',
        }}
      />

      {/* 4. Bottom-Left Floor Light */}
      <div
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-600 ease-out"
        style={{
          backgroundColor: isHovered ? primaryColor : defaultColor,
          opacity: isHovered ? 0.14 : selectedTag === '전체' ? 0.03 : 0.06,
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          willChange: 'background-color, opacity, transform',
        }}
      />
    </div>
  );
}
