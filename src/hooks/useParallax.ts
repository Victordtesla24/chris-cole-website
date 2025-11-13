import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * useParallax Hook
 * 
 * Reusable hook for parallax scroll effects
 * 
 * Requirements:
 * - Accepts speed multiplier (0.3x, 0.5x, 1.0x)
 * - Moves element at specified speed relative to scroll
 * - Smooth animation (scrub: true)
 * - Works with ScrollTrigger
 * - Cleanup on unmount
 * 
 * @param speed - Parallax speed multiplier (0.3 = slow, 0.5 = medium, 1.0 = normal)
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Create parallax animation
    scrollTriggerInstance = gsap.to(element, {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      y: (_i, _el) => {
        // Calculate parallax movement based on scroll position
        const scrollY = window.scrollY;
        return scrollY * (1 - speed); // Inverse relationship: slower speed = less movement
      },
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true, // Smooth scrubbing tied to scroll position
      },
    }).scrollTrigger as ScrollTrigger;

    // Cleanup on unmount
    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      // Also kill any ScrollTrigger instances associated with this element
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return ref;
}

