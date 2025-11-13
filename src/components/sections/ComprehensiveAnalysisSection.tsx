'use client';

import React from 'react';
import ParallaxStars from '@/components/animations/ParallaxStars';
import AsteroidBeltAnimation from '@/components/animations/AsteroidBeltAnimation';

/**
 * Comprehensive Analysis Section Component
 * 
 * SUGGESTED ANIMATION OPTIONS (Choose 1):
 * 
 * Option 1: GALAXY SPIRAL ANIMATION
 * - Rotating spiral galaxy with luminous arms
 * - Thousands of star particles following spiral pattern
 * - Bright galactic core with dimmer outer regions
 * - Logarithmic spiral mathematics (phi-based)
 * - Perfect for: Analysis, insight, comprehensive view, big picture
 * 
 * Option 2: NEBULA CLOUD ANIMATION
 * - Flowing, morphing nebula with particle clouds
 * - Color gradients in monochrome (white to gray)
 * - Organic, fluid motion using Perlin noise
 * - Stars forming within the nebula
 * - Perfect for: Creation, formation, emergence of patterns
 * 
 * Option 3: BLACK HOLE ACCRETION DISK
 * - Central black hole with orbiting accretion disk
 * - Matter spiraling inward with increasing speed
 * - Gravitational lensing light bending effects
 * - Event horizon boundary visualization
 * - Perfect for: Deep analysis, gravity of information, convergence
 */

interface ComprehensiveAnalysisSectionProps {
  className?: string;
}

const ComprehensiveAnalysisSection: React.FC<ComprehensiveAnalysisSectionProps> = ({ 
  className = '' 
}) => {
  return (
    <section
      id="comprehensive-analysis"
      className={`relative min-h-screen flex items-center justify-center bg-black ${className}`}
    >
      {/* Starry Background with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxStars />
      </div>

      {/* Content Container with Two-Column Layout */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          {/* Left Side: Asteroid Belt Animation */}
          <div className="flex-1 flex items-center justify-center w-full lg:w-auto min-h-[500px]">
            <div className="w-full h-full max-w-2xl">
              <AsteroidBeltAnimation />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="flex-1 flex items-center justify-center w-full lg:w-auto">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-wider">
                COMPREHENSIVE ANALYSIS
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                (UNDER CONSTRUCTION)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveAnalysisSection;
