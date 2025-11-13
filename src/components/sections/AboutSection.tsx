/**
 * About Section Component
 * 
 * Bio and professional information with specialties
 * Matches hellochriscole.webflow.io about section
 * 
 * SUGGESTED ANIMATION OPTIONS (Choose 1):
 * 
 * Option 1: SPACE STATION ORBIT ANIMATION
 * - ISS-style space station orbiting Earth
 * - Realistic solar panels with subtle rotation
 * - Curved orbital path around screen edge
 * - Earth glimpse in corner with atmospheric glow
 * - Perfect for: Personal profile, teamwork, professional hub
 * 
 * Option 2: PULSAR BEACON ANIMATION
 * - Rotating neutron star emitting light beams
 * - Lighthouse-style rotating beacon effect
 * - Pulsing rhythm with radio wave rings
 * - Magnetic field lines visualization
 * - Perfect for: Expertise, broadcasting knowledge, guidance
 * 
 * Option 3: SATELLITE CONSTELLATION
 * - Network of mini satellites in formation
 * - Communication links between satellites
 * - Synchronized orbital choreography
 * - Data transmission light pulses
 * - Perfect for: Skills network, connections, communication
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import SpecialtyIcon from '@/components/ui/SpecialtyIcon';
import ParallaxStars from '@/components/animations/ParallaxStars';
import CometAnimation from '@/components/animations/CometAnimation';

const AboutSection: React.FC = () => {
  const satelliteRef = useRef<HTMLDivElement>(null);
  const satelliteWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Satellite icon continuous rotation
    if (satelliteRef.current) {
      gsap.to(satelliteRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }

    // Mouse parallax effect for satellite
    const handleMouseMove = (e: MouseEvent) => {
      if (satelliteWrapperRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(satelliteWrapperRef.current, {
          x,
          y,
          duration: 1,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const specialties = [
    { name: 'WEB', icon: '/svg/icon-web.svg' },
    { name: 'BRANDING', icon: '/svg/icon-branding.svg' },
    { name: 'PRODUCT', icon: '/svg/icon-product.svg' },
    { name: 'PACKAGING', icon: '/svg/icon-packaging.svg' },
    { name: 'COCKTAILS :)', icon: '/svg/icon-cocktails.svg' },
  ];

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-32 bg-black">
      {/* Starry Background with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxStars />
      </div>

      {/* Comet Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CometAnimation />
      </div>

      {/* Satellite Icon */}
      <div
        ref={satelliteWrapperRef}
        className="absolute top-20 right-10 md:top-32 md:right-20 z-20"
        style={{ transform: 'rotateZ(-18.417deg)' }}
        data-w-id="625d0590-86b2-4b1f-ce96-85d35d22609c"
      >
        <div
          ref={satelliteRef}
          className="satellite-icon w-16 h-16 md:w-20 md:h-20"
          style={{
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(11.8494deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
          }}
          data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"
        >
          <Image
            src="/svg/satellite.svg"
            alt=""
            width={80}
            height={80}
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Film Reel Icon - Bottom Left */}
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 z-20">
        <Image
          src="/svg/film-reel.svg"
          alt="Film Reel"
          width={60}
          height={60}
          className="w-12 h-12 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* About Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Bordered Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="border-2 border-white p-12 md:p-16 max-w-3xl mx-auto"
        >
          {/* Headline */}
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight"
          >
            I&apos;VE WORKED IN TECH AND CPG FOR 6 YEARS AS A CREATIVE DIRECTOR, LEADING THE DESIGN EFFORTS OF STARTUPS.
          </motion.h1>

          {/* Specialties Line Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="specialties-line w-32 h-px bg-white mb-8 mx-auto"
          />

          {/* Specialties Intro Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm md:text-base text-gray-300 mb-8 text-center"
            data-w-id="92e91bae-5e58-aa21-e06e-fe2a43664f68"
          >
            I DO A BIT OF EVERYTHING, BUT MY SPECIALITIES INCLUDE:
          </motion.p>

          {/* Specialty Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20"
          >
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <SpecialtyIcon 
                  name={specialty.name}
                  iconSrc={specialty.icon}
                  className="group"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
