import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal Hook
 * 
 * Reusable hook for scroll-triggered fade-up animations
 * 
 * Requirements:
 * - Returns ref to attach to element
 * - Animates when element is 20% visible in viewport
 * - Animation: opacity 0 → 1, translateY(30px) → 0
 * - Duration: 600ms, ease: 'power2.out'
 * - ScrollTrigger registered correctly
 * - Cleanup on unmount (ScrollTrigger.kill())
 */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Create animation with ScrollTrigger
    scrollTriggerInstance = gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%', // Element is 20% visible (80% from top)
          toggleActions: 'play none none reverse',
        },
      }
    ).scrollTrigger as ScrollTrigger;

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
  }, []);

  return ref;
}

