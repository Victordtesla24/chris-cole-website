'use client';

import { Observer } from 'gsap/Observer';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(Observer);

const MAGNETIC_PARTICLE_COUNT = 24;

interface NavigatorWithMs extends Navigator {
  msMaxTouchPoints?: number;
}

const MagneticCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const navWithMs = navigator as NavigatorWithMs;
    const hasTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      !!(navWithMs.msMaxTouchPoints && navWithMs.msMaxTouchPoints > 0);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateEnabled = (reduceMotion: boolean) => {
      setEnabled(!hasTouch && !reduceMotion);
    };

    updateEnabled(motionQuery.matches);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      updateEnabled(event.matches);
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
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = trailRef.current;
    if (!container) return;

    const created = Array.from({ length: MAGNETIC_PARTICLE_COUNT }, () => {
      const particle = document.createElement('span');
      particle.className = 'magnetic-particle';
      container.appendChild(particle);
      return particle;
    });

    particlesRef.current = created;

    return () => {
      created.forEach((el) => {
        if (el.parentElement) {
          el.parentElement.removeChild(el);
        }
      });
      particlesRef.current = [];
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handlePointerMove = (self: Observer) => {
      const pointerEvent = self.event as PointerEvent | undefined;
      const targetX = pointerEvent?.clientX ?? self.x ?? 0;
      const targetY = pointerEvent?.clientY ?? self.y ?? 0;

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: targetX,
          y: targetY,
          duration: 0.2,
          ease: 'expo.out',
        });
      }

      particlesRef.current.forEach((particle, index) => {
        const offset = 4 + index * 1.1;
        gsap.to(particle, {
          x: targetX + Math.cos(index) * offset,
          y: targetY + Math.sin(index) * offset,
          scale: 0.4 + Math.random() * 0.6,
          opacity: 0.5 + Math.random() * 0.3,
          duration: 0.4 + index * 0.01,
          ease: 'power3.out',
        });
      });
    };

    const observer = Observer.create({
      target: window,
      type: 'pointer',
      onMove: handlePointerMove,
    });

    return () => {
      observer.kill();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const cachedTweens = new Map<HTMLElement, gsap.core.Tween>();
    const targets = Array.from(document.querySelectorAll('button, a')) as HTMLElement[];

    const handleEnter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const clientX = (event as PointerEvent).clientX || rect.left + rect.width / 2;
      const clientY = (event as PointerEvent).clientY || rect.top + rect.height / 2;
      const offsetX = (clientX - (rect.left + rect.width / 2)) * 0.28;
      const offsetY = (clientY - (rect.top + rect.height / 2)) * 0.28;

      gsap.to(cursorRef.current, {
        scale: 1.6,
        boxShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 50px rgba(129, 221, 255, 0.5)',
        duration: 0.25,
        ease: 'power2.out',
      });

      cachedTweens.set(
        target,
        gsap.to(target, {
          x: offsetX,
          y: offsetY,
          duration: 0.35,
          ease: 'power3.out',
        })
      );
    };

    const handleLeave = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const tween = cachedTweens.get(target);
      tween?.kill();
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.to(cursorRef.current, {
        scale: 1,
        boxShadow: '0 0 12px rgba(255, 255, 255, 0.7), 0 0 35px rgba(100, 200, 255, 0.25)',
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    targets.forEach((target) => {
      target.addEventListener('mouseenter', handleEnter);
      target.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', handleEnter);
        target.removeEventListener('mouseleave', handleLeave);
      });
      cachedTweens.clear();
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="magnetic-trail">
      <div ref={trailRef} />
      <div ref={cursorRef} className="magnetic-cursor" />
    </div>
  );
};

export default MagneticCursor;
