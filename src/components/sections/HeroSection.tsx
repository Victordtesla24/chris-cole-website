/**
 * Hero Section Component (Landing Page)
 * 
 * Exact replica of hellochriscole.webflow.io landing page
 * Shows Saturn illustration with centered vertical navigation menu
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'WORK', id: 'work' },
    { label: 'ABOUT', id: 'about' },
    { label: 'CONTACT', id: 'contact' },
    { label: 'SKETCHES', id: 'sketches' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-end overflow-hidden pr-16 md:pr-32">
      {/* Right-Aligned Navigation Menu */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 flex flex-col items-end justify-center space-y-8 md:space-y-12"
      >
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            onClick={() => scrollToSection(item.id)}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wider hover:text-gray-300 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.nav>
    </section>
  );
};

export default HeroSection;
