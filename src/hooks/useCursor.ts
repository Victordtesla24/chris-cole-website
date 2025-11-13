import { useEffect, useState, useRef } from 'react';

/**
 * Cursor Position Interface
 */
export interface CursorPosition {
  x: number;
  y: number;
}

/**
 * Cursor State Type
 */
export type CursorState = 'default' | 'hover' | 'click';

/**
 * useCursor Hook
 * 
 * Custom cursor state management hook
 * 
 * Requirements:
 * - Tracks mouse position
 * - Manages cursor scale state (default, hover, click)
 * - Returns cursor position and state
 * - Works with GSAP animations
 */
export function useCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [state, setState] = useState<CursorState>('default');
  const positionRef = useRef<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Mouse down handler (click state)
    const handleMouseDown = () => {
      setState('click');
    };

    // Mouse up handler (return to hover or default)
    const handleMouseUp = () => {
      setState('default');
    };

    // Hover detection for interactive elements
    const handleMouseEnter = () => {
      if (state !== 'click') {
        setState('hover');
      }
    };

    const handleMouseLeave = () => {
      if (state !== 'click') {
        setState('default');
      }
    };

    // Attach global event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Attach hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Initialize position
    if (typeof window !== 'undefined') {
      positionRef.current = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      };
      setPosition(positionRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [state]);

  // Get cursor scale based on state
  const getScale = (): number => {
    switch (state) {
      case 'hover':
        return 1.5;
      case 'click':
        return 0.75;
      default:
        return 1;
    }
  };

  return {
    position,
    state,
    scale: getScale(),
  };
}

