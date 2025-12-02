'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

/**
 * SaturnCanvasAnimation
 *
 * This component renders a Saturn-like illustration with concentric rings and orbiting moons.
 * It aims to visually replicate the static Saturn animation on hellochriscole.webflow.io.
 * Key points of this implementation:
 *  - The rings do not rotate as a set; they are fixed in a single plane.
 *  - A single tilt is applied to all rings to simulate a 3D perspective.
 *  - Rings are spaced evenly and sized so none intersect the planet.
 *  - Small moons orbit along the rings to add gentle motion.
 *  - A sparse, static star field decorates the background.
 */

interface SaturnCanvasAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  glowRadius: number;
}

interface Ring {
  a: number;
  b: number;
  tilt: number;
  opacity: number;
  speedFactor: number;
  phase: number;
  moonAngle: number;
}

interface FrontSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  alpha: number;
}

// Configuration constants
const PLANET_RADIUS_RATIO = 0.08;
const RING_COUNT = 8;
const RING_ASPECT_RATIO = 0.4;
const STAR_COUNT = 140;
const BASE_TILT = Math.PI / 6;
const TILT_VARIATION = 0.0;
const MIN_RING_RADIUS_FACTOR = 2.0;
const MAX_RING_RADIUS_FACTOR = 3.5;
const BASE_ROTATION_SPEED = 0.0;    // rings don't spin
const BASE_MOON_SPEED = 0.0002;     // moons drift slowly

const SaturnCanvasAnimation: React.FC<SaturnCanvasAnimationProps> = ({ className = '', style = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const rotationRef = useRef({ offset: 0, lastTimestamp: 0 });
  const visibilityRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  /** Initialize stars with random positions, sizes, and opacities. */
  const initStars = useCallback((canvas: HTMLCanvasElement) => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const isBright = Math.random() > 0.75;
      const size = isBright ? Math.random() * 1.2 + 0.4 : Math.random() * 0.6 + 0.15;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        opacity: isBright ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4 + 0.2,
        twinkleSpeed: 0.6 + Math.random() * 1.4,
        twinklePhase: Math.random() * Math.PI * 2,
        glowRadius: size * (isBright ? 6 : 3),
      });
    }
    starsRef.current = stars;
  }, []);

  /** Draw the star field. */
  const drawStars = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    starsRef.current.forEach((star) => {
      const sparkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const finalOpacity = star.opacity * sparkle;

      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.glowRadius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`);
      gradient.addColorStop(0.6, `rgba(255, 255, 255, ${finalOpacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(star.x, star.y, star.size * (1.1 + sparkle * 0.2), 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  }, []);

  /** Draw the planet (black disc with faint white outline). */
  const drawPlanet = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.closePath();
  }, []);

  /**
   * Draw the rings. Each ring is rendered in two passes: back segments and front segments.
   * We classify a segment as front or back based on its unrotated y-coordinate (ry).
   */
  const drawRings = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, rotationOffset: number) => {
    const frontSegments: FrontSegment[] = [];
    const segCount = 220;
    ringsRef.current.forEach((ring) => {
      const { a, b, tilt, opacity, speedFactor, phase } = ring;

      const orientationAngle = rotationOffset * speedFactor;  // always zero when speed is 0

      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);
      const cosOri = Math.cos(orientationAngle);
      const sinOri = Math.sin(orientationAngle);

      for (let s = 0; s < segCount; s++) {
        const t0 = (s / segCount) * Math.PI * 2 + phase;
        const t1 = ((s + 1) / segCount) * Math.PI * 2 + phase;
        const x0 = a * Math.cos(t0);
        const y0 = b * Math.sin(t0);
        const x1 = a * Math.cos(t1);
        const y1 = b * Math.sin(t1);

        // Apply tilt
        const rx0 = x0 * cosTilt - y0 * sinTilt;
        const ry0 = x0 * sinTilt + y0 * cosTilt;
        const rx1 = x1 * cosTilt - y1 * sinTilt;
        const ry1 = x1 * sinTilt + y1 * cosTilt;

        // Orientation rotation (does nothing when rotation speed is zero)
        const fx0 = rx0 * cosOri - ry0 * sinOri;
        const fy0 = rx0 * sinOri + ry0 * cosOri;
        const fx1 = rx1 * cosOri - ry1 * sinOri;
        const fy1 = rx1 * sinOri + ry1 * cosOri;

        // Brighten near side (positive x) and darken far side
        const normX = ((fx0 / a) + 1) / 2;
        const alpha = opacity * (0.5 + 0.5 * normX);

        // Classify segment as front or back based on pre-orientation ry
        const isFront = ((ry0 + ry1) / 2) > 0;

        if (isFront) {
          frontSegments.push({
            x0: fx0 + cx, y0: fy0 + cy,
            x1: fx1 + cx, y1: fy1 + cy,
            alpha,
          });
        } else {
          ctx.beginPath();
          ctx.moveTo(cx + fx0, cy + fy0);
          ctx.lineTo(cx + fx1, cy + fy1);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }
    });

    return frontSegments;
  }, []);

  /** Main render loop. */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const planetRadius = width * PLANET_RADIUS_RATIO;
    const cx = width * 0.273;
    const cy = height * 0.401;

    // Update rotation offset (remains zero because BASE_ROTATION_SPEED is zero)
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const timeInSeconds = now / 1000;
    if (!rotationRef.current.lastTimestamp) {
      rotationRef.current.lastTimestamp = now;
    }

    const dt = now - rotationRef.current.lastTimestamp;
    rotationRef.current.lastTimestamp = now;
    rotationRef.current.offset += dt * BASE_ROTATION_SPEED;

    // Advance moon angles
    ringsRef.current.forEach((ring) => {
      ring.moonAngle += dt * BASE_MOON_SPEED * ring.speedFactor;
    });

    drawStars(ctx, timeInSeconds);

    // Draw back half of rings and collect front segments
    const frontSegments = drawRings(ctx, cx, cy, rotationRef.current.offset);

    // Compute moon positions and split into back and front
    const backMoons: Array<{ x: number; y: number }> = [];
    const frontMoons: Array<{ x: number; y: number }> = [];

    ringsRef.current.forEach((ring) => {
      const { a, b, tilt, speedFactor, phase, moonAngle } = ring;

      const t = moonAngle + phase;

      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      const x = a * Math.cos(t);
      const y = b * Math.sin(t);

      const rx = x * cosTilt - y * sinTilt;
      const ry = x * sinTilt + y * cosTilt;

      const orientationAngle = rotationRef.current.offset * speedFactor;
      const cosOri = Math.cos(orientationAngle);
      const sinOri = Math.sin(orientationAngle);

      const fx = rx * cosOri - ry * sinOri;
      const fy = rx * sinOri + ry * cosOri;

      const px = cx + fx;
      const py = cy + fy;

      if (fy > 0) {
        frontMoons.push({ x: px, y: py });
      } else {
        backMoons.push({ x: px, y: py });
      }
    });

    // Draw moons behind the planet
    backMoons.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();
    });

    // Draw planet
    drawPlanet(ctx, cx, cy, planetRadius);

    // Draw front ring segments
    frontSegments.forEach((seg) => {
      ctx.beginPath();
      ctx.moveTo(seg.x0, seg.y0);
      ctx.lineTo(seg.x1, seg.y1);
      ctx.strokeStyle = `rgba(255, 255, 255, ${seg.alpha})`;
      ctx.lineWidth = 1.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // Draw moons in front of the planet
    frontMoons.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(render);
  }, [drawStars, drawRings, drawPlanet]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyState = (isVisible: boolean, reduceMotion: boolean) => {
      visibilityRef.current = isVisible;
      setShouldAnimate(isVisible && !reduceMotion);
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              const isVisible = entries.some((entry) => entry.isIntersecting);
              applyState(isVisible, motionQuery.matches);
            },
            { rootMargin: '200px' }
          )
        : null;

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      applyState(true, motionQuery.matches);
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      applyState(visibilityRef.current, event.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else if (motionQuery.removeListener) {
        motionQuery.removeListener(handleMotionChange);
      }
      observer?.disconnect();
      applyState(false, motionQuery.matches);
    };
  }, []);

  // Resize canvas and initialize stars/rings on mount
  useEffect(() => {
    if (!shouldAnimate) {
      starsRef.current = [];
      ringsRef.current = [];
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Initialize stars
      initStars(canvas);

      // Initialize rings with a single global tilt
      const planetRadiusPx = rect.width * dpr * PLANET_RADIUS_RATIO;
      const globalTilt = BASE_TILT + (Math.random() - 0.5) * TILT_VARIATION;
      const newRings: Ring[] = [];
      const deltaFactor = (MAX_RING_RADIUS_FACTOR - MIN_RING_RADIUS_FACTOR) / (RING_COUNT - 1);

      for (let i = 0; i < RING_COUNT; i++) {
        const ringFactor = MIN_RING_RADIUS_FACTOR + deltaFactor * i;
        const a = planetRadiusPx * ringFactor;
        const b = a * RING_ASPECT_RATIO;
        const tilt = globalTilt;
        const opacity = 0.8 - 0.4 * (i / (RING_COUNT - 1));
        const speedFactor = 1 + (Math.random() - 0.5) * 0.4;
        const phase = Math.random() * Math.PI * 2;
        const moonAngle = Math.random() * Math.PI * 2;

        newRings.push({ a, b, tilt, opacity, speedFactor, phase, moonAngle });
      }

      ringsRef.current = newRings;
    };

    resize();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      // Clear references so GC can reclaim memory.
      starsRef.current = [];
      ringsRef.current = [];
    };
  }, [initStars, shouldAnimate]);

  // Start the render loop on mount
  useEffect(() => {
    if (!shouldAnimate) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return undefined;
    }

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [render, shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className={`saturn-canvas-container ${className}`.trim()}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default SaturnCanvasAnimation;
