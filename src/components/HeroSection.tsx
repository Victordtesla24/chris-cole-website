'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariants, staggerContainerVariants } from '@/animations/fadeInUp';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Content */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="section-container text-center z-10"
      >
        <motion.h1
          variants={fadeInUpVariants}
          className="heading-primary mb-6"
        >
          Creative Developer &
          <br />
          <span className="text-gradient">Digital Artist</span>
        </motion.h1>

        <motion.p
          variants={fadeInUpVariants}
          className="text-body max-w-2xl mx-auto mb-10"
        >
          Crafting immersive digital experiences through innovative design and cutting-edge technology.
        </motion.p>

        <motion.div
          variants={fadeInUpVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#work" className="btn-primary">
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-all duration-300"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-accent rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

