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

  // Maximum items to display in canvas mode for buttery 60fps performance
  const displayItems = references.slice(0, 48);

  // Initialize card positions across full viewport
  useEffect(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;

    const cardWidth = 230;
    const cardHeight = 175;

    const cols = Math.max(2, Math.floor((w - 60) / (cardWidth + 40)));

    const initialCards: PhysicsCard[] = displayItems.map((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const baseX = 40 + col * (cardWidth + 30) + (Math.random() - 0.5) * 50;
      const baseY = 120 + row * (cardHeight + 35) + (Math.random() - 0.5) * 40;

      return {
        refItem: item,
        x: Math.max(20, Math.min(w - cardWidth - 20, baseX)),
        y: Math.max(100, Math.min(h - cardHeight - 20, baseY)),
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        rot: (Math.random() - 0.5) * 10,
        vRot: (Math.random() - 0.5) * 0.25,
        width: cardWidth,
        height: cardHeight,
        zIndex: idx + 1,
      };
    });

    topZIndexRef.current = initialCards.length + 5;
    cardsRef.current = initialCards;
    setCards([...initialCards]);
  }, [references]);

  // Main physics simulation loop roaming across the entire website/screen
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const boundsWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
      const boundsHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
      const currentCards = cardsRef.current;
      const draggingId = draggingIdRef.current;

      for (let i = 0; i < currentCards.length; i++) {
        const c = currentCards[i];
        if (c.refItem.id === draggingId) continue;

        // Weightless ambient float drift across entire page
        c.vx += Math.sin(currentTime * 0.0014 + i) * 0.07;
        c.vy += Math.cos(currentTime * 0.0011 + i * 1.3) * 0.07;

        // Air resistance damping
        c.vx *= 0.96;
        c.vy *= 0.96;
        c.vRot *= 0.94;

        // Position update
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vRot;

        // Rotation clamp
        if (c.rot > 24) { c.rot = 24; c.vRot = -Math.abs(c.vRot); }
        if (c.rot < -24) { c.rot = -24; c.vRot = Math.abs(c.vRot); }

        // Screen boundary collisions across full browser window
        const padX = 16;
        const padTop = 100; // Float below header
        const padBottom = 20;

        if (c.x < padX) {
          c.x = padX;
          c.vx = Math.abs(c.vx) * 0.75 + 0.3;
          c.vRot += (Math.random() - 0.5) * 0.6;
        } else if (c.x + c.width > boundsWidth - padX) {
          c.x = boundsWidth - c.width - padX;
          c.vx = -Math.abs(c.vx) * 0.75 - 0.3;
          c.vRot += (Math.random() - 0.5) * 0.6;
        }

        if (c.y < padTop) {
          c.y = padTop;
          c.vy = Math.abs(c.vy) * 0.75 + 0.3;
        } else if (c.y + c.height > boundsHeight - padBottom) {
          c.y = boundsHeight - c.height - padBottom;
          c.vy = -Math.abs(c.vy) * 0.75 - 0.3;
        }
      }

      setCards([...currentCards]);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Explosive random scatter impulse across whole screen
  const handleShuffle = useCallback(() => {
    sound.playShuffle();
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const centerX = w / 2;
    const centerY = h / 2;

    cardsRef.current.forEach((c) => {
      const dx = c.x + c.width / 2 - centerX;
      const dy = c.y + c.height / 2 - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const force = 22 + Math.random() * 18;
      c.vx = (dx / dist) * force + (Math.random() - 0.5) * 12;
      c.vy = (dy / dist) * force + (Math.random() - 0.5) * 12;
      c.vRot = (Math.random() - 0.5) * 8;
    });
  }, []);

  // Listen for global shuffle event from header
  useEffect(() => {
    const onShuffleEvent = () => handleShuffle();
    window.addEventListener('refarchive-shuffle', onShuffleEvent);
    return () => window.removeEventListener('refarchive-shuffle', onShuffleEvent);
  }, [handleShuffle]);

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
      const mouseVx = (e.clientX - lastMousePosRef.current.x) / dt * 16;
      const mouseVy = (e.clientY - lastMousePosRef.current.y) / dt * 16;

      card.vx = mouseVx;
      card.vy = mouseVy;
      card.vRot = mouseVx * 0.08;

      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleWindowMouseUp = () => {
      const draggingId = draggingIdRef.current;
      if (!draggingId) return;

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
    /* Fullscreen unconstrained free-floating canvas plane - NO boxes, NO borders */
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none z-20 overflow-hidden"
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
            className="absolute pointer-events-auto select-none bg-white border border-black/15 shadow-sm transition-shadow cursor-grab active:cursor-grabbing group overflow-hidden"
            style={{
              width: `${card.width}px`,
              transform: `translate3d(${card.x.toFixed(1)}px, ${card.y.toFixed(1)}px, 0) rotate(${card.rot.toFixed(1)}deg)`,
              zIndex: card.zIndex,
              willChange: 'transform',
              boxShadow: isDragging
                ? '0 16px 32px rgba(0,0,0,0.14)'
                : isHovered
                ? '0 8px 20px rgba(0,0,0,0.10)'
                : '0 1px 4px rgba(0,0,0,0.06)',
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
  );
}
