'use client';

import { useEffect } from 'react';

interface EscKeyNavigationProps {
  fallbackHref?: string;
}

export default function EscKeyNavigation({ fallbackHref = '/' }: EscKeyNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined') {
          if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
            window.history.back();
          } else {
            window.location.href = fallbackHref;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [fallbackHref]);

  return null;
}
