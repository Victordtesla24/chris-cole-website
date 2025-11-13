'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Constellation Component (Optional)
 * 
 * Connected stars forming constellation pattern
 * 
 * Requirements:
 * - 4-5 stars connected by white lines
 * - Positioned in upper left area
 * - White dots + white connecting lines
 * - Optional subtle rotation/drift animation
 * - Doesn't interfere with other elements
 */
export default function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create SVG for constellation
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.style.position = 'absolute';
    svg.style.top = '10%';
    svg.style.left = '5%';
    svg.style.pointerEvents = 'none';
    svg.style.opacity = '0.6';

    // Star positions (4-5 stars in upper left)
    const stars = [
      { x: 30, y: 30 },
      { x: 60, y: 50 },
      { x: 90, y: 25 },
      { x: 120, y: 45 },
      { x: 100, y: 70 },
    ];

    // Draw connecting lines
    const lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ];

    lines.forEach(([start, end]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', stars[start].x.toString());
      line.setAttribute('y1', stars[start].y.toString());
      line.setAttribute('x2', stars[end].x.toString());
      line.setAttribute('y2', stars[end].y.toString());
      line.setAttribute('stroke', 'white');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0.5');
      svg.appendChild(line);
    });

    // Draw stars
    stars.forEach((star) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', star.x.toString());
      circle.setAttribute('cy', star.y.toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', 'white');
      svg.appendChild(circle);
    });

    container.appendChild(svg);

    // Optional subtle rotation/drift
    if (!prefersReducedMotion) {
      gsap.to(svg, {
        rotation: 360,
        duration: 120, // Very slow rotation
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      if (svg.parentNode) {
        svg.parentNode.removeChild(svg);
      }
      gsap.killTweensOf(svg);
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

