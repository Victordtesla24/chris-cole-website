
'use client';

import React from 'react';
import BlackHoleAnimation from '../animations/BlackHoleAnimation';

interface BTRSectionProps {
  className?: string;
}

const BTRSection: React.FC<BTRSectionProps> = ({ className = '' }) => {
  return (
    <section
      id="btr"
      className={`relative min-h-screen flex items-center justify-center bg-black overflow-hidden ${className}`}
    >
      {/* Black Hole Animation (Full Screen Background) */}
      <div className="absolute inset-0 z-0">
        <BlackHoleAnimation />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          
          {/* Main Title */}
          <h2 
            className="text-8xl md:text-9xl font-light text-white mb-8 tracking-wider"
            style={{
              fontFamily: 'var(--font-condensed, "Roboto Condensed", Arial, sans-serif)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
            }}
          >
            BTR
          </h2>
          
          {/* Subtitle */}
          <p 
            className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed mb-6"
            style={{
              letterSpacing: '0.2em',
              opacity: 0.8,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            (ULTRA-REALISTIC 3D)
          </p>
          
          {/* Description */}
          <p 
            className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-2xl"
            style={{
              letterSpacing: '0.15em',
              opacity: 0.1,
            }}
          >
          </p>

          {/* Technical Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-500 text-sm">
            <div>
              <div className="text-white text-2xl font-bold">7,000+</div>
              <div className="text-xs uppercase tracking-wider">Particles</div>
            </div>
            <div>
              <div className="text-white text-2xl font-bold">&gt;30%</div>
              <div className="text-xs uppercase tracking-wider">Gray Coverage</div>
            </div>
            <div>
              <div className="text-white text-2xl font-bold">50+</div>
              <div className="text-xs uppercase tracking-wider">Gradient Levels</div>
            </div>
            <div>
              <div className="text-white text-2xl font-bold">3D</div>
              <div className="text-xs uppercase tracking-wider">WebGL Render</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div 
          className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-30"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>
    </section>
  );
};

export default BTRSection;
