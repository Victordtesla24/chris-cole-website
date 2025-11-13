'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * LoadingOverlay with Rotating Rings and Center Text
 * 
 * Shows centered rings with rotating moon dots, LOADING text in center,
 * then transitions to tilted Saturn on left side
 */
export default function LoadingOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringsContainerRef = useRef<HTMLDivElement>(null);
  const moonsGroupRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !ringsContainerRef.current || !textRef.current || !moonsGroupRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Continuously rotate moon dots
    gsap.to(moonsGroupRef.current, {
      rotation: 360,
      duration: 15,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });

    // Main animation timeline
    const tl = gsap.timeline();

    // 1. Fade in overlay and rings
    tl.fromTo(overlayRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    tl.fromTo([ringsContainerRef.current, textRef.current],
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // 2. Hold and let moons rotate
    tl.to({}, { duration: 3 });

    // 3. Transition to Saturn position (left side) with tilt
    // Saturn is at 27.3% from left, 40.1% from top
    // Starting from center (50%, 50%), we need to move:
    // x: (27.3 - 50) = -22.7vw
    // y: (40.1 - 50) = -9.9vh
    tl.to(ringsContainerRef.current, {
      x: '-22.7vw',
      y: '-9.9vh',
      rotation: 39.5, // Match Saturn's BASE_TILT (Math.PI/6 = 30 degrees)
      scaleX: 1.2, // Match Saturn's elliptical perspective
      scaleY: 0.95,  // Match Saturn's RING_ASPECT_RATIO (0.4)
      duration: 1.5,
      ease: 'power2.inOut',
    });

    // 4. Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      duration: 0.5,
    }, '-=1');

    // 5. Fade out overlay
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        if (overlayRef.current) {
          overlayRef.current.style.display = 'none';
        }
      },
    }, '-=0.5');

    if (prefersReducedMotion) {
      tl.timeScale(10);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      data-w-id="5e181dd5-2adb-abf2-9999-c6fcf58866a5"
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
      style={{ willChange: 'opacity', pointerEvents: 'none' }}
    >
      <div ref={ringsContainerRef} className="relative">
        {/* Concentric Rings with Rotating Moons */}
        <svg width="400" height="400" viewBox="0 0 400 400" className="transform">
          {/* Static Rings */}
          {[90, 105, 120, 135, 150, 165, 180, 195].map((radius, index) => (
            <circle 
              key={radius}
              cx="200" 
              cy="200" 
              r={radius} 
              fill="none" 
              stroke="#fff" 
              strokeWidth="0.5"
              opacity={0.8 - (index * 0.08)}
            />
          ))}
          
          {/* Rotating Moon Dots Group */}
          <g ref={moonsGroupRef} style={{ transformOrigin: '200px 200px' }}>
            {[90, 105, 120, 135, 150, 165, 180, 195].map((radius, ringIndex) => (
              <g key={`moons-${radius}`}>
                {[0, 120, 240].map((angle) => (
                  <circle 
                    key={`${radius}-${angle}`}
                    cx={200 + radius * Math.cos((angle + ringIndex * 33) * Math.PI / 180)} 
                    cy={200 + radius * Math.sin((angle + ringIndex * 33) * Math.PI / 180)} 
                    r="2.5" 
                    fill="#fff"
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>
        
        {/* LOADING Text - Centered in Rings */}
        <div
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm tracking-[0.3em] text-center"
          style={{ fontFamily: 'Space Grotesk, monospace' }}
        >
          LOADING
          <div className="w-20 h-px bg-white mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  );
}
