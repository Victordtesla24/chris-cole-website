/**
 * Section Divider Component
 * 
 * Curved arc/line between hero and work sections
 * Creates "planet horizon" visual effect
 */

import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-32 md:h-48 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0,200 Q 300,100 600,100 T 1200,100 L 1200,200 Z"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className="opacity-80"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;

