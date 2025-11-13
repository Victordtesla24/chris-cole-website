'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * MouseParallax Component
 * 
 * 3D parallax effect based on mouse position
 * 
 * Requirements:
 * - Satellite icons move based on mouse position
 * - Movement range: ±15px (calculated as (cx - 0.5) * 30)
 * - Percentage-based viewport calculation
 * - Smooth animation (duration: 0.2s)
 * - Background stars move subtly (optional enhancement)
 * - Responsive feel (not laggy)
 * - Cleanup on unmount
 */
export default function MouseParallax({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of viewport
      const cx = e.clientX / window.innerWidth; // 0 to 1
      const cy = e.clientY / window.innerHeight; // 0 to 1

      // Calculate movement range: ±15px
      const moveX = (cx - 0.5) * 30;
      const moveY = (cy - 0.5) * 30;

      // Apply smooth parallax movement
      gsap.to(container, {
        x: moveX,
        y: moveY,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    // Reset on mouse leave
    const handleMouseLeave = () => {
      gsap.to(container, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(container);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

