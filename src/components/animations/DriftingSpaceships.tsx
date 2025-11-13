'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * DriftingSpaceships Component
 * 
 * Spaceship icons drifting diagonally across background
 * 
 * Requirements:
 * - 5-8 spaceships visible at any time
 * - Spaceship SVG icons render correctly
 * - Sizes: 30px, 40px, 50px variations
 * - Diagonal drift animation (random directions)
 * - Duration: 80-120 seconds per traverse
 * - White outline, transparent fill
 * - Loops continuously (restarts from opposite corner)
 * - Slow rotation (optional, subtle)
 * - Fixed position, z-index: 0
 * - Pointer-events: none
 */
export default function DriftingSpaceships() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spaceshipsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate 5-8 spaceships
    const spaceshipCount = Math.floor(Math.random() * 4) + 5; // 5-8 spaceships
    const spaceships: HTMLDivElement[] = [];

    for (let i = 0; i < spaceshipCount; i++) {
      const spaceship = document.createElement('div');
      const size = [30, 40, 50][Math.floor(Math.random() * 3)]; // Random size
      const startSide = Math.random() > 0.5 ? 'left' : 'top';

      // Random start position
      let startX: number, startY: number, endX: number, endY: number;

      if (startSide === 'left') {
        startX = -size;
        startY = Math.random() * window.innerHeight;
        endX = window.innerWidth + size;
        endY = Math.random() * window.innerHeight;
      } else {
        startX = Math.random() * window.innerWidth;
        startY = -size;
        endX = Math.random() * window.innerWidth;
        endY = window.innerHeight + size;
      }

      spaceship.innerHTML = `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" stroke="white" stroke-width="2" fill="transparent"/>
          <circle cx="50" cy="50" r="8" stroke="white" stroke-width="1" fill="transparent"/>
        </svg>
      `;

      spaceship.style.position = 'absolute';
      spaceship.style.left = `${startX}px`;
      spaceship.style.top = `${startY}px`;
      spaceship.style.pointerEvents = 'none';

      container.appendChild(spaceship);
      spaceships.push(spaceship);
      spaceshipsRef.current.push(spaceship);

      // Drift animation
      if (!prefersReducedMotion) {
        const duration = Math.random() * 40 + 80; // 80-120 seconds
        const rotation = (Math.random() - 0.5) * 360; // Random rotation

        gsap.to(spaceship, {
          x: endX - startX,
          y: endY - startY,
          rotation: rotation,
          duration: duration,
          ease: 'none',
          repeat: -1,
          onRepeat: () => {
            // Reset position when animation repeats
            gsap.set(spaceship, {
              x: 0,
              y: 0,
              left: `${startX}px`,
              top: `${startY}px`,
            });
          },
        });
      }
    }

    return () => {
      spaceships.forEach((spaceship) => {
        gsap.killTweensOf(spaceship);
        if (spaceship.parentNode) {
          spaceship.parentNode.removeChild(spaceship);
        }
      });
      spaceshipsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    />
  );
}

