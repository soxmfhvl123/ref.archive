'use client';

import React, { useState, useRef, useCallback } from 'react';
import { sound } from '@/lib/sound';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  maxTilt?: number;
}

export default function TiltCard({
  children,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  maxTilt = 8,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [chromaticOffset, setChromaticOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2; // -1 to 1

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;
      const transX = normX * 3;
      const transY = normY * 3;

      setTransformStyle(
        `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 10px) scale3d(1.015, 1.015, 1.015)`
      );

      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
      });

      setChromaticOffset({
        x: normX * 1.5,
        y: normY * 1.5,
      });
    },
    [maxTilt]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playTick();
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)');
    setGlarePos({ x: 50, y: 50, opacity: 0 });
    setChromaticOffset({ x: 0, y: 0 });
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
        transform: transformStyle,
        transition: isHovered
          ? 'transform 90ms ease-out'
          : 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Chromatic fringe sheen on hover */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-20 border border-black/10 mix-blend-difference"
          style={{
            transform: `translate(${chromaticOffset.x}px, ${chromaticOffset.y}px)`,
            opacity: 0.4,
            transition: 'transform 70ms linear',
          }}
        />
      )}

      {/* Dynamic specular glare overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`,
          opacity: glarePos.opacity,
          mixBlendMode: 'overlay',
        }}
      />

      {children}
    </div>
  );
}
