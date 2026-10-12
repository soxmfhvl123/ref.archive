'use client';

import React, { useRef, memo } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  maxTilt?: number;
}

const TiltCard = memo(function TiltCard({
  children,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  maxTilt = 8,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const chromaticRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -normY * maxTilt;
    const rotY = normX * maxTilt;
    const transX = normX * 3;
    const transY = normY * 3;

    // Direct DOM manipulation - ZERO React setState re-renders during mouse move!
    card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 8px) scale3d(1.015, 1.015, 1.015)`;

    if (glareRef.current) {
      const gx = ((x / rect.width) * 100).toFixed(1);
      const gy = ((y / rect.height) * 100).toFixed(1);
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 65%)`;
      glareRef.current.style.opacity = '0.18';
    }

    if (chromaticRef.current) {
      chromaticRef.current.style.transform = `translate(${(normX * 1.5).toFixed(1)}px, ${(normY * 1.5).toFixed(1)}px)`;
      chromaticRef.current.style.opacity = '0.35';
    }
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    isHoveredRef.current = true;
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 90ms ease-out';
    }
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';
    }

    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
    if (chromaticRef.current) {
      chromaticRef.current.style.opacity = '0';
    }

    onMouseLeave?.();
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none cursor-pointer group ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Chromatic fringe sheen on hover */}
      <div
        ref={chromaticRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-20 border border-black/10 mix-blend-difference opacity-0 transition-opacity duration-200"
      />

      {/* Dynamic specular glare overlay */}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30 opacity-0 transition-opacity duration-300"
        style={{
          mixBlendMode: 'overlay',
        }}
      />

      {children}
    </div>
  );
});

export default TiltCard;
