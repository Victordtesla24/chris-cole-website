'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CursorTrail Component
 * 
 * Custom cursor that follows mouse with lag
 * 
 * Requirements:
 * - Custom cursor visible (white circle, 24px diameter)
 * - Follows mouse with 200ms lag (smooth trailing effect)
 * - Default state: 24px circle, 80% opacity
 * - Mix-blend-mode: difference (inverts on backgrounds)
 * - Hover state: Scales to 36px (1.5x) on links/buttons
 * - Click state: Shrinks to 18px (0.75x) on mousedown
 * - Returns to hover or default on mouseup
 * - Hidden on mobile/tablet (desktop only)
 * - Smooth GSAP tweening (no jank)
 * - No pointer-events (doesn't block clicks)
 * - Will-change optimization active
 * - Cleanup on unmount
 */
export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on mobile/tablet
    const isMobile = window.innerWidth < 1024;
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    let rafId: number;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // Update cursor position with lag
    const updateCursor = () => {
      if (!cursor) return;

      const dx = mousePosition.current.x - cursorPosition.current.x;
      const dy = mousePosition.current.y - cursorPosition.current.y;

      cursorPosition.current.x += dx * 0.15; // 200ms lag approximation
      cursorPosition.current.y += dy * 0.15;

      gsap.to(cursor, {
        x: cursorPosition.current.x,
        y: cursorPosition.current.y,
        duration: 0.2,
        ease: 'power2.out',
      });

      rafId = requestAnimationFrame(updateCursor);
    };

    // Hover detection
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Click detection
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Find all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Global mouse events
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Initialize cursor position
    cursorPosition.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    gsap.set(cursor, { x: cursorPosition.current.x, y: cursorPosition.current.y });

    // Start animation loop
    rafId = requestAnimationFrame(updateCursor);

    // Scale animation based on state
    const scaleTween = gsap.to(cursor, {
      scale: isClicking ? 0.75 : isHovering ? 1.5 : 1,
      duration: 0.2,
      ease: 'power2.out',
    });

    // Watch for state changes
    const stateWatcher = () => {
      gsap.to(cursor, {
        scale: isClicking ? 0.75 : isHovering ? 1.5 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const intervalId = setInterval(stateWatcher, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
      scaleTween.kill();
    };
  }, [isHovering, isClicking]);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full bg-white pointer-events-none z-[10000] mix-blend-difference opacity-80"
      style={{
        willChange: 'transform',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
