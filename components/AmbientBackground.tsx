'use client';

import { useEffect, useState, useRef } from 'react';

interface AmbientBackgroundProps {
  selectedTag: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  전체: '#e4e4e7',
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
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [targetPos, setTargetPos] = useState({ x: -500, y: -500 });
  const animFrameRef = useRef<number | null>(null);

  const activeColor = CATEGORY_COLORS[selectedTag] || '#a1a1aa';

  // Smooth mouse follower with linear interpolation
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
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return prev;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
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
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.8 }}
    >
      {/* Top-right subtle ambient color aura shifting on category change */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] transition-colors duration-1000 ease-out"
        style={{
          backgroundColor: activeColor,
          opacity: selectedTag === '전체' ? 0.04 : 0.08,
        }}
      />

      {/* Bottom-left ambient corner light */}
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] transition-colors duration-1000 ease-out"
        style={{
          backgroundColor: activeColor,
          opacity: selectedTag === '전체' ? 0.03 : 0.06,
        }}
      />

      {/* Cursor tracking ambient light beam */}
      {mousePos.x > -100 && (
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-[120px] transition-colors duration-700 ease-out pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x - 225}px, ${mousePos.y - 225}px, 0)`,
            backgroundColor: activeColor,
            opacity: 0.06,
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
}
