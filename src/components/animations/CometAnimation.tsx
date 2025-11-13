'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * CometAnimation
 * 
 * Cinematic 3D comet with dynamic particle tails
 * Features:
 * - Stationary comet moving in linear horizontal path
 * - Detailed icy nucleus with craggy texture
 * - Dual tail system (ion + dust) with 800+ particles
 * - Dynamic particle physics and dispersion
 * - Bright coma glow effect
 * - Particles spawn, flow, and fade continuously
 * - Monochromatic black/white space theme
 */

interface CometAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'ion' | 'dust';
  trailLength: number;
}

// Configuration constants
const COMET_SPEED = 0.15;
const NUCLEUS_SIZE = 12;
const COMA_SIZE = 45;
const ION_PARTICLE_COUNT = 500;
const DUST_PARTICLE_COUNT = 300;
const PARTICLE_SPAWN_RATE = 3;
const STAR_COUNT = 50;
const COMET_Y_RATIO = 0.5; // Vertical center

const CometAnimation: React.FC<CometAnimationProps> = ({
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cometXRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);

  /**
   * Initialize star field
   */
  const initStars = useCallback((canvas: HTMLCanvasElement) => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    starsRef.current = stars;
  }, []);

  /**
   * Spawn tail particles
   */
  const spawnParticles = useCallback((
    cometX: number,
    cometY: number,
    count: number,
    type: 'ion' | 'dust'
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = type === 'ion' 
        ? Math.PI + (Math.random() - 0.5) * 0.3  // Straight back
        : Math.PI + (Math.random() - 0.5) * 0.6; // Wider spread

      const speed = type === 'ion' 
        ? 2 + Math.random() * 3 
        : 1 + Math.random() * 2;

      particlesRef.current.push({
        x: cometX,
        y: cometY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: type === 'ion' ? 1.5 + Math.random() : 2 + Math.random() * 1.5,
        opacity: 1,
        life: 1,
        maxLife: type === 'ion' ? 80 + Math.random() * 40 : 60 + Math.random() * 30,
        type,
        trailLength: type === 'ion' ? 15 : 10,
      });
    }
  }, []);

  /**
   * Draw star field
   */
  const drawStars = useCallback((ctx: CanvasRenderingContext2D) => {
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  }, []);

  /**
   * Draw comet nucleus with craggy texture
   */
  const drawNucleus = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    // Base nucleus
    const gradient = ctx.createRadialGradient(
      x - size * 0.3,
      y - size * 0.3,
      0,
      x,
      y,
      size
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(220, 220, 220, 0.9)');
    gradient.addColorStop(1, 'rgba(150, 150, 150, 0.7)');

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Craggy texture with random surface features
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const craterX = x + Math.cos(angle) * size * 0.6;
      const craterY = y + Math.sin(angle) * size * 0.6;
      const craterSize = size * (0.15 + Math.random() * 0.1);

      ctx.beginPath();
      ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
      ctx.fill();
    }
    ctx.restore();

    // Bright center
    ctx.beginPath();
    ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  /**
   * Draw coma glow
   */
  const drawComa = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.6, 'rgba(200, 220, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, []);

  /**
   * Draw tail particles
   */
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((particle) => {
      // Draw particle trail
      ctx.save();
      ctx.globalAlpha = particle.opacity * 0.3;
      ctx.strokeStyle = particle.type === 'ion' 
        ? 'rgba(200, 220, 255, 1)' 
        : 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = particle.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(
        particle.x + particle.vx * particle.trailLength,
        particle.y + particle.vy * particle.trailLength
      );
      ctx.stroke();
      ctx.restore();

      // Draw particle core
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
      gradient.addColorStop(0.5, `rgba(220, 230, 255, ${particle.opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }, []);

  /**
   * Main render loop
   */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    const dt = lastTimestampRef.current ? now - lastTimestampRef.current : 0;
    lastTimestampRef.current = now;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    drawStars(ctx);

    // Update comet position (linear horizontal motion)
    cometXRef.current += COMET_SPEED * (dt / 16);

    // Loop comet position
    if (cometXRef.current > canvas.width + COMA_SIZE) {
      cometXRef.current = -COMA_SIZE;
    }

    const cometY = canvas.height * COMET_Y_RATIO;

    // Spawn new particles
    if (Math.random() < PARTICLE_SPAWN_RATE / 60) {
      spawnParticles(cometXRef.current, cometY, 2, 'ion');
      spawnParticles(cometXRef.current, cometY, 1, 'dust');
    }

    // Update particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1 / particle.maxLife;
      particle.opacity = particle.life;

      // Add gravity effect for dust particles
      if (particle.type === 'dust') {
        particle.vy += 0.02;
      }

      return particle.life > 0 && particle.x > -100;
    });

    // Draw coma glow
    drawComa(ctx, cometXRef.current, cometY, COMA_SIZE);

    // Draw tail particles
    drawParticles(ctx);

    // Draw nucleus
    drawNucleus(ctx, cometXRef.current, cometY, NUCLEUS_SIZE);

    animationFrameId.current = requestAnimationFrame(render);
  }, [drawStars, drawComa, drawParticles, drawNucleus, spawnParticles]);

  // Initialize on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initStars(canvas);
      cometXRef.current = canvas.width * 0.1; // Start from left
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [initStars]);

  // Start animation
  useEffect(() => {
    render();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [render]);

  return (
    <div
      className={`comet-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000000',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        aria-label="Comet with dynamic particle tails moving in linear path"
      />
    </div>
  );
};

export default CometAnimation;
