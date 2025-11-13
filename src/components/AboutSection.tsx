'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariants, staggerContainerVariants } from '@/animations/fadeInUp';
import { useScrollTrigger } from '@/animations/scrollTrigger';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { controls } = useScrollTrigger(sectionRef);

  const skills = [
    'React & Next.js',
    'TypeScript',
    'Framer Motion',
    'GSAP',
    'Three.js',
    'Tailwind CSS',
    'Node.js',
    'WebGL',
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-container bg-primary-light"
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-4xl mx-auto"
      >
        <motion.h2
          variants={fadeInUpVariants}
          className="heading-secondary mb-8 text-center"
        >
          About Me
        </motion.h2>

        <motion.div variants={fadeInUpVariants} className="space-y-6 mb-12">
          <p className="text-body">
            I&apos;m a creative developer passionate about building beautiful, interactive web experiences
            that push the boundaries of what&apos;s possible in the browser.
          </p>
          <p className="text-body">
            With a background in both design and development, I bridge the gap between aesthetics
            and functionality, creating digital products that are not only visually stunning but
            also performant and accessible.
          </p>
        </motion.div>

        <motion.div variants={fadeInUpVariants}>
          <h3 className="text-2xl font-display font-semibold mb-6 text-center">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={controls}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;

