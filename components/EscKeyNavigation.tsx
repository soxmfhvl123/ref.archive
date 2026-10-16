'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EscKeyNavigationProps {
  fallbackHref?: string;
}

export default function EscKeyNavigation({ fallbackHref = '/' }: EscKeyNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined' && document.referrer && document.referrer.includes(window.location.host)) {
          window.history.back();
        } else {
          router.push(fallbackHref);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [router, fallbackHref]);

  return null;
}
