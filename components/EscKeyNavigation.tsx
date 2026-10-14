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
        // If history exists, router.back() restores scroll position & filter state in the list
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, fallbackHref]);

  return null;
}
