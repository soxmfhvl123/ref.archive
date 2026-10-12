'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Reference } from '@/lib/types';
import { sound } from '@/lib/sound';
import Image from 'next/image';

interface CanvasViewProps {
  references: Reference[];
  onSelectRef: (ref: Reference) => void;
  onHoverRef?: (ref: Reference | null) => void;
  basePath?: string;
}

interface PhysicsCard {
  refItem: Reference;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  width: number;
  height: number;
  zIndex: number;
}

export default function CanvasView({ references, onSelectRef, onHoverRef, basePath = '' }: CanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<PhysicsCard[]>([]);
  const cardsRef = useRef<PhysicsCard[]>([]);
  const draggingIdRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ mouseX: number; mouseY: number; cardX: number; cardY: number }>({
    mouseX: 0,
    mouseY: 0,
    cardX: 0,
    cardY: 0,
  });
  const dragDistRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const topZIndexRef = useRef<number>(10);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [gravityMode, setGravityMode] = useState<boolean>(false);
  const gravityRef = useRef<boolean>(false);

  // Sync ref with state
  gravityRef.current = gravityMode;

  // Maximum items to display in canvas mode for buttery 60fps performance
  const displayItems = references.slice(0, 48);

  // Initialize card positions
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = Math.max(rect.height, window.innerHeight - 200);

    const cardWidth = 230;
    const cardHeight = 175;

    const initialCards: PhysicsCard[] = displayItems.map((item, idx) => {
      // Distribute in a loose organic grid across the container
      const cols = Math.max(2, Math.floor(w / (cardWidth + 40)));
      const row = Math.floor(idx / cols);
      const col = idx % cols;

      const baseX = 30 + col * (cardWidth + 30) + (Math.random() - 0.5) * 40;
      const baseY = 30 + row * (cardHeight + 40) + (Math.random() - 0.5) * 40;

      return {
        refItem: item,
        x: Math.max(20, Math.min(w - cardWidth - 20, baseX)),
        y: Math.max(20, baseY),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        rot: (Math.random() - 0.5) * 8,
        vRot: (Math.random() - 0.5) * 0.2,
        width: cardWidth,
        height: cardHeight,
        zIndex: idx + 1,
      };
    });

    topZIndexRef.current = initialCards.length + 5;
    cardsRef.current = initialCards;
    setCards([...initialCards]);
  }, [references]);

  // Main physics simulation loop (60fps rAF)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const container = containerRef.current;
      if (!container) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const boundsWidth = container.clientWidth || window.innerWidth;
      const boundsHeight = container.clientHeight || window.innerHeight;
      const currentCards = cardsRef.current;
      const draggingId = draggingIdRef.current;
      const isGravity = gravityRef.current;

      for (let i = 0; i < currentCards.length; i++) {
        const c = currentCards[i];
        if (c.refItem.id === draggingId) continue;

        // Ambient float drift
        if (!isGravity) {
          c.vx += Math.sin(currentTime * 0.0015 + i) * 0.06;
          c.vy += Math.cos(currentTime * 0.0012 + i * 1.3) * 0.06;
        } else {
          // Gravity mode: gentle downward pull
          c.vy += 9.8 * 0.8 * dt;
        }

        // Apply friction
        c.vx *= 0.96;
        c.vy *= 0.96;
        c.vRot *= 0.94;

        // Update positions
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vRot;

        // Clamp rotation
        if (c.rot > 25) { c.rot = 25; c.vRot = -Math.abs(c.vRot); }
        if (c.rot < -25) { c.rot = -25; c.vRot = Math.abs(c.vRot); }

        // Wall collisions (with restitution bounce)
        const pad = 16;
        if (c.x < pad) {
          c.x = pad;
          c.vx = Math.abs(c.vx) * 0.7 + 0.3;
          c.vRot += (Math.random() - 0.5) * 0.5;
        } else if (c.x + c.width > boundsWidth - pad) {
          c.x = boundsWidth - c.width - pad;
          c.vx = -Math.abs(c.vx) * 0.7 - 0.3;
          c.vRot += (Math.random() - 0.5) * 0.5;
        }

        if (c.y < pad) {
          c.y = pad;
          c.vy = Math.abs(c.vy) * 0.7 + 0.3;
        } else if (c.y + c.height > boundsHeight - pad) {
          c.y = boundsHeight - c.height - pad;
          c.vy = -Math.abs(c.vy) * (isGravity ? 0.4 : 0.7);
          if (isGravity && Math.abs(c.vy) < 0.2) c.vy = 0;
        }
      }

      // Sync state for rendering
      setCards([...currentCards]);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Drag interaction handlers
  const handleCardMouseDown = (e: React.MouseEvent, card: PhysicsCard) => {
    e.preventDefault();
    topZIndexRef.current += 1;
    card.zIndex = topZIndexRef.current;

    draggingIdRef.current = card.refItem.id;
    dragDistRef.current = 0;
    dragStartPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardX: card.x,
      cardY: card.y,
    };
    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };

    sound.playTick();
  };

  const handleShuffle = useCallback(() => {
    sound.playShuffle();
    const container = containerRef.current;
    const w = container?.clientWidth || window.innerWidth;
    const h = container?.clientHeight || window.innerHeight;
    const centerX = w / 2;
    const centerY = h / 2;

    cardsRef.current.forEach((c) => {
      const dx = c.x + c.width / 2 - centerX;
      const dy = c.y + c.height / 2 - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Explosive outward impulse with spin
      const force = 18 + Math.random() * 14;
      c.vx = (dx / dist) * force + (Math.random() - 0.5) * 10;
      c.vy = (dy / dist) * force + (Math.random() - 0.5) * 10;
      c.vRot = (Math.random() - 0.5) * 6;
    });
  }, []);

  const handleCenterTidy = useCallback(() => {
    sound.playClick();
    const container = containerRef.current;
    const w = container?.clientWidth || window.innerWidth;
    const h = container?.clientHeight || window.innerHeight;
    const cardW = 230;
    const cardH = 175;
    const cols = Math.max(2, Math.floor((w - 80) / (cardW + 24)));

    cardsRef.current.forEach((c, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const targetX = 40 + col * (cardW + 24);
      const targetY = 40 + row * (cardH + 24);

      c.vx = (targetX - c.x) * 0.12;
      c.vy = (targetY - c.y) * 0.12;
      c.vRot = -c.rot * 0.15;
    });
  }, []);

  // Global mousemove and mouseup listeners for dragging
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const draggingId = draggingIdRef.current;
      if (!draggingId) return;

      const card = cardsRef.current.find((c) => c.refItem.id === draggingId);
      if (!card) return;

      const dx = e.clientX - dragStartPosRef.current.mouseX;
      const dy = e.clientY - dragStartPosRef.current.mouseY;
      dragDistRef.current = Math.sqrt(dx * dx + dy * dy);

      card.x = dragStartPosRef.current.cardX + dx;
      card.y = dragStartPosRef.current.cardY + dy;

      const now = performance.now();
      const dt = Math.max(now - lastMousePosRef.current.time, 1);
      const mouseVx = (e.clientX - lastMousePosRef.current.x) / dt * 15;
      const mouseVy = (e.clientY - lastMousePosRef.current.y) / dt * 15;

      card.vx = mouseVx;
      card.vy = mouseVy;
      card.vRot = mouseVx * 0.08;

      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleWindowMouseUp = () => {
      const draggingId = draggingIdRef.current;
      if (!draggingId) return;

      // If user merely clicked without dragging (< 6px), open reference detail
      if (dragDistRef.current < 6) {
        const card = cardsRef.current.find((c) => c.refItem.id === draggingId);
        if (card) {
          onSelectRef(card.refItem);
        }
      }

      draggingIdRef.current = null;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [onSelectRef]);

  return (
    <div className="relative w-full">
      {/* Floating Canvas Controls Toolbar */}
      <div className="sticky top-28 z-30 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm py-2 px-3 border border-black/10 mb-3 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="font-normal opacity-80">Free-Canvas Mode</span>
          <span className="opacity-40">({displayItems.length} items floating)</span>
          <span className="opacity-30 hidden sm:inline">· 카드를 드래그해 던지거나 클릭하여 상세 보기</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleShuffle}
            className="bg-black text-white px-3 py-1 text-[13px] hover:bg-neutral-800 transition-colors cursor-pointer border-0"
          >
            랜덤 셔플 ✦
          </button>
          <button
            type="button"
            onClick={handleCenterTidy}
            className="bg-transparent border border-black/20 px-2.5 py-1 text-[13px] hover:border-black cursor-pointer"
          >
            정돈
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setGravityMode(!gravityMode);
            }}
            className={`bg-transparent p-0 border-0 cursor-pointer text-[13px] ${
              gravityMode ? 'underline underline-offset-4' : 'opacity-40 no-underline'
            }`}
          >
            {gravityMode ? '중력 ON' : '무중력 (Zero-G)'}
          </button>
        </div>
      </div>

      {/* Interactive Physics Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[75vh] h-[calc(100vh-180px)] overflow-hidden bg-neutral-50/50 border border-black/10"
        style={{ touchAction: 'none' }}
      >
        {cards.map((card) => {
          const isHovered = activeHoverId === card.refItem.id;
          const isDragging = draggingIdRef.current === card.refItem.id;

          const imageSrc = card.refItem.imageUrl.startsWith('http')
            ? card.refItem.imageUrl
            : `${basePath}${card.refItem.imageUrl.startsWith('/') ? '' : '/'}${card.refItem.imageUrl}`;
          const fallbackSrc = `${basePath}/captures/${card.refItem.id}.svg`;
          const videoSrc = card.refItem.videoUrl
            ? card.refItem.videoUrl.startsWith('http')
              ? card.refItem.videoUrl
              : `${basePath}${card.refItem.videoUrl.startsWith('/') ? '' : '/'}${card.refItem.videoUrl}`
            : undefined;

          return (
            <div
              key={card.refItem.id}
              onMouseDown={(e) => handleCardMouseDown(e, card)}
              onMouseEnter={() => {
                setActiveHoverId(card.refItem.id);
                sound.playTick();
                onHoverRef?.(card.refItem);
              }}
              onMouseLeave={() => {
                setActiveHoverId(null);
                onHoverRef?.(null);
              }}
              className="absolute select-none bg-white border border-black/15 shadow-sm transition-shadow cursor-grab active:cursor-grabbing group overflow-hidden"
              style={{
                width: `${card.width}px`,
                transform: `translate3d(${card.x.toFixed(1)}px, ${card.y.toFixed(1)}px, 0) rotate(${card.rot.toFixed(1)}deg)`,
                zIndex: card.zIndex,
                willChange: 'transform',
                boxShadow: isDragging
                  ? '0 12px 24px rgba(0,0,0,0.12)'
                  : isHovered
                  ? '0 6px 16px rgba(0,0,0,0.08)'
                  : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {/* Card Media Preview */}
              <div className="relative w-full aspect-[16/10] bg-neutral-100 overflow-hidden pointer-events-none">
                <Image
                  src={imageSrc}
                  alt={card.refItem.title}
                  fill
                  sizes="240px"
                  className={`object-cover object-top transition-opacity ${
                    isHovered && videoSrc ? 'opacity-0' : 'opacity-100'
                  }`}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== fallbackSrc) target.src = fallbackSrc;
                  }}
                />
                {videoSrc && isHovered && (
                  <video
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                )}
              </div>

              {/* Card Label */}
              <div className="p-2 text-[12px] leading-tight space-y-0.5 pointer-events-none">
                <div className="font-normal truncate tracking-tight">{card.refItem.title}</div>
                <div className="opacity-50 text-[11px] truncate">{card.refItem.tags[0]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
