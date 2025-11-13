import React from 'react';
import Image from 'next/image';

interface SpecialtyIconProps {
  name: string;
  iconSrc: string;
  className?: string;
}

/**
 * SpecialtyIcon Component
 * 
 * Reusable specialty icon component for the hero section
 * 
 * Requirements:
 * - Renders the correct SVG icon based on the source
 * - Size: ~40-50px height
 * - White outline style
 * - Accessible (alt text provided)
 * - All 5 icons render correctly
 */
const SpecialtyIcon: React.FC<SpecialtyIconProps> = ({ 
  name, 
  iconSrc, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full scale-150" />
        <Image
          src={iconSrc}
          alt={name}
          width={48}
          height={48}
          className="w-10 h-10 md:w-12 md:h-12 relative z-10"
          style={{
            filter: 'brightness(0) invert(1)', // Ensure white outline on any background
          }}
        />
      </div>
      <span className="text-xs md:text-sm text-white font-mono uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
};

export default SpecialtyIcon;
