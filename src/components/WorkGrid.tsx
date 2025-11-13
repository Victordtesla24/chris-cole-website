'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { fadeInUpVariants } from '@/animations/fadeInUp';
import { useScrollTrigger } from '@/animations/scrollTrigger';

const WorkGrid: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { controls } = useScrollTrigger(sectionRef);

  const projects = [
    {
      title: 'Interactive Portfolio',
      description: 'A stunning portfolio website with 3D animations and smooth transitions.',
      image: '/assets/images/project1.jpg',
      tags: ['React', 'Three.js', 'GSAP'],
      link: '#',
    },
    {
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with real-time inventory and payment integration.',
      image: '/assets/images/project2.jpg',
      tags: ['Next.js', 'Stripe', 'PostgreSQL'],
      link: '#',
    },
    {
      title: 'Creative Agency Site',
      description: 'Award-winning website for a creative agency with custom animations.',
      image: '/assets/images/project3.jpg',
      tags: ['React', 'Framer Motion', 'Tailwind'],
      link: '#',
    },
    {
      title: 'Mobile App UI',
      description: 'Beautiful mobile app interface with smooth micro-interactions.',
      image: '/assets/images/project4.jpg',
      tags: ['React Native', 'TypeScript', 'Animated'],
      link: '#',
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'Complex data visualization dashboard with real-time updates.',
      image: '/assets/images/project5.jpg',
      tags: ['D3.js', 'React', 'WebSocket'],
      link: '#',
    },
    {
      title: 'WebGL Experience',
      description: 'Immersive WebGL experience with custom shaders and physics.',
      image: '/assets/images/project6.jpg',
      tags: ['Three.js', 'WebGL', 'GLSL'],
      link: '#',
    },
  ];

  return (
    <section ref={sectionRef} id="work" className="section-container">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeInUpVariants}
        className="mb-12 text-center"
      >
        <h2 className="heading-secondary mb-4">Selected Work</h2>
        <p className="text-body max-w-2xl mx-auto">
          A collection of projects showcasing my expertise in creating engaging digital experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} {...project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default WorkGrid;

