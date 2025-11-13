import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export const useCursorTrail = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button').forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return { cursorPosition, isHovering };
};

export const cursorTrailVariants = {
  default: {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  hover: {
    scale: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
};

