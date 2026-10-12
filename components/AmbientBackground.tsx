'use client';

import { useEffect, useState, useRef } from 'react';
import { Reference } from '@/lib/types';
import { getKeyColors } from '@/lib/colors';

interface AmbientBackgroundProps {
  selectedTag: string;
  hoveredRef: Reference | null;
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

export default function AmbientBackground({ selectedTag, hoveredRef }: AmbientBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [targetPos, setTargetPos] = useState({ x: -500, y: -500 });
  const animFrameRef = useRef<number | null>(null);

  const defaultColor = CATEGORY_COLORS[selectedTag] || '#a1a1aa';
  const siteKeyColors = getKeyColors(hoveredRef);

  const isHovered = Boolean(hoveredRef && siteKeyColors);
  const primaryColor = siteKeyColors ? siteKeyColors[0] : defaultColor;
  const secondaryColor = siteKeyColors ? siteKeyColors[1] : defaultColor;

  // Smooth mouse follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      setMousePos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return prev;
        return {
          x: prev.x + dx * 0.14,
          y: prev.y + dy * 0.14,
        };
      });
      animFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animFrameRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetPos]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Fullscreen Multi-Stop Dynamic Gradient (Site Key Colors on Hover) */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: isHovered ? 0.22 : 0,
          background: isHovered
            ? `radial-gradient(circle at ${mousePos.x > 0 ? mousePos.x : 500}px ${mousePos.y > 0 ? mousePos.y : 300}px, ${primaryColor} 0%, ${secondaryColor} 45%, transparent 75%)`
            : 'none',
          willChange: 'background, opacity',
        }}
      />

      {/* 2. Cursor Follower Luminous Orb (Primary Key Color) */}
      {mousePos.x > -100 && (
        <div
          className="absolute w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ease-out"
          style={{
            transform: `translate3d(${mousePos.x - 340}px, ${mousePos.y - 340}px, 0)`,
            backgroundColor: primaryColor,
            opacity: isHovered ? 0.20 : 0.06,
            willChange: 'transform, opacity, background-color',
          }}
        />
      )}

      {/* 3. Secondary Key Color Atmospheric Orb (Top-Right / Opposite Corner) */}
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full blur-[160px] transition-all duration-700 ease-out"
        style={{
          backgroundColor: secondaryColor,
          opacity: isHovered ? 0.18 : selectedTag === '전체' ? 0.04 : 0.08,
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* 4. Bottom-Left Ambient Floor Light */}
      <div
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-700 ease-out"
        style={{
          backgroundColor: isHovered ? primaryColor : defaultColor,
          opacity: isHovered ? 0.16 : selectedTag === '전체' ? 0.03 : 0.06,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />
    </div>
  );
}
