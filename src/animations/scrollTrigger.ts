import { useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const useScrollAnimation = () => {
  const controls = useAnimation();
  
  return { controls };
};

export const scrollTriggerConfig = {
  triggerOnce: true,
  threshold: 0.1,
  rootMargin: '-50px',
};

/**
 * useScrollTrigger Hook (Framer Motion)
 * 
 * Framer Motion scroll trigger hook using react-intersection-observer
 * 
 * Requirements:
 * - TypeScript errors fixed (useInView API corrected)
 * - Hook returns controls and inView state
 * - Works with Framer Motion animations
 * - Config options work correctly (triggerOnce, threshold, rootMargin)
 * 
 * Supports two usage patterns:
 * 1. useScrollTrigger(ref) - with external ref
 * 2. useScrollTrigger(options) - with options, returns internal ref
 */
export const useScrollTrigger = (
  refOrOptions?: React.RefObject<HTMLElement> | {
    triggerOnce?: boolean;
    threshold?: number;
    rootMargin?: string;
  }
) => {
  const controls = useAnimation();
  const internalRef = useRef<HTMLElement>(null);
  
  // Determine if first arg is a ref or options
  const isRef = refOrOptions && 'current' in (refOrOptions as React.RefObject<HTMLElement>);
  const externalRef = isRef ? (refOrOptions as React.RefObject<HTMLElement>) : null;
  const options = !isRef ? (refOrOptions as { triggerOnce?: boolean; threshold?: number; rootMargin?: string } | undefined) : undefined;
  
  const elementRef = externalRef || internalRef;
  
  const { ref: intersectionRef, inView } = useInView({
    triggerOnce: options?.triggerOnce ?? scrollTriggerConfig.triggerOnce,
    threshold: options?.threshold ?? scrollTriggerConfig.threshold,
    rootMargin: options?.rootMargin ?? scrollTriggerConfig.rootMargin,
  });

  // Combine refs - attach intersection observer ref to element
  useEffect(() => {
    if (elementRef.current) {
      // Use callback ref pattern for useInView
      if (typeof intersectionRef === 'function') {
        intersectionRef(elementRef.current);
      } else if (intersectionRef && 'current' in intersectionRef) {
        // If it's a ref object, assign the current element
        (intersectionRef as React.MutableRefObject<HTMLElement | null>).current = elementRef.current;
      }
    }
  }, [intersectionRef, elementRef]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!(options?.triggerOnce ?? scrollTriggerConfig.triggerOnce)) {
      controls.start('hidden');
    }
  }, [controls, inView, options?.triggerOnce]);

  return { 
    controls, 
    inView,
    ref: elementRef,
  };
};

// GSAP Scroll Trigger Configuration
export const gsapScrollConfig = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
  scrub: false,
};

