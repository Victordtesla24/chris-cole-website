'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll Component
 * 
 * Initializes Lenis smooth scrolling library
 * Provides buttery smooth scroll experience
 * 
 * Requirements:
 * - Scroll duration: ~1.2s
 * - Works on all sections
 * - No conflicts with native scroll
 * - Cleanup on unmount (no memory leaks)
 * - Touch scrolling works on mobile
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

