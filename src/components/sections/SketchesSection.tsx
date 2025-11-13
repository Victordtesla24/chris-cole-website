/**
 * Sketches Section Component
 * 
 * Sketch gallery with staggered animations
 * Matches IMPLEMENTATION_COMPONENTS.md (414-435)
 * 
 * SUGGESTED ANIMATION OPTIONS (Choose 1):
 * 
 * Option 1: METEOR SHOWER ANIMATION
 * - Multiple shooting stars streaking across sky
 * - Randomized trajectories and timing
 * - Glowing trails that fade over time
 * - Various sizes and speeds for realism
 * - Perfect for: Creative inspiration, fleeting moments, artistic flow
 * 
 * Option 2: ORBITAL DEBRIS FIELD
 * - Scattered space debris floating in orbit
 * - Random rotation and drift patterns
 * - Mix of satellite parts, panels, and fragments
 * - Zero-gravity tumbling motion
 * - Perfect for: Collection, scattered works, fragments of ideas
 * 
 * Option 3: AURORA BOREALIS (SPACE VIEW)
 * - Flowing curtains of light viewed from orbit
 * - Particle interaction with Earth's magnetosphere
 * - Ethereal undulating wave patterns
 * - Subtle color gradients in monochrome
 * - Perfect for: Beauty, natural phenomenon, atmospheric creativity
 */

'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollTrigger } from '@/animations/scrollTrigger';
import ParallaxStars from '@/components/animations/ParallaxStars';

const SketchesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { controls } = useScrollTrigger(sectionRef);
  const [selectedSketch, setSelectedSketch] = useState<number | null>(null);

  // Placeholder sketches - replace with actual images
  const sketches = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    image: `/assets/images/sketch-${i + 1}.jpg`,
    title: `Sketch ${i + 1}`,
  }));

  return (
    <section ref={sectionRef} id="sketches" className="relative section-container py-20 md:py-32 min-h-screen bg-black">
      {/* Starry Background with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxStars />
      </div>

      <div className="relative z-10">
      <motion.h2
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
      >
        SKETCHES
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {sketches.map((sketch, index) => (
          <motion.div
            key={sketch.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={controls}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer overflow-hidden border-2 border-white/20 hover:border-white transition-colors"
            onClick={() => setSelectedSketch(sketch.id)}
          >
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{sketch.title}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedSketch !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSketch(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSketch(null)}
                className="absolute top-4 right-4 text-white text-2xl z-10"
              >
                ×
              </button>
              <div className="bg-gray-800 aspect-video flex items-center justify-center">
                <span className="text-gray-500">Sketch {selectedSketch}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
};

export default SketchesSection;
