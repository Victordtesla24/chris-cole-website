'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StarLetterAnimation from '@/components/animations/StarLetterAnimation';

/**
 * Navbar Component
 * 
 * Fixed top navigation with brand and menu items
 * Matches original site structure with unusual heading hierarchy:
 * - Brand/Logo: h6 heading
 * - Navigation items: h1 headings (unusual but matches original)
 * 
 * Requirements:
 * - Brand/Logo: "CHRIS COLE" (h6 heading)
 * - Navigation items: WORK, ABOUT, CONTACT, SKETCHES (h1 headings)
 * - Fixed position on scroll
 * - Background changes on scroll (transparent → semi-transparent with blur)
 * - Active section highlighting works
 * - Smooth scroll to sections on click
 * - Hover effects (underline/glow)
 * - Mobile hamburger menu (responsive)
 * - Mobile menu opens/closes with animation
 * - Heading hierarchy maintained (h6 brand, h1 nav items, h2 sections)
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'work', 'about', 'contact', 'sketches'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'WORK', id: 'work', letter: 'W' },
    { name: 'ABOUT', id: 'about', letter: 'A' },
    { name: 'CONTACT', id: 'contact', letter: 'C' },
    { name: 'SKETCHES', id: 'sketches', letter: 'S' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Brand/Logo - h6 heading (matches original structure) */}
        <h6 className="text-xl font-bold tracking-tight">
          <Link href="/" className="hover:text-gray-200 transition-colors">
            CHRIS COLE
          </Link>
        </h6>
        
        {/* Desktop Navigation - h1 headings (matches original structure) */}
        <ul className="hidden md:flex space-x-8 text-sm font-mono uppercase">
          {navItems.map((item) => (
            <li 
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <StarLetterAnimation
                letter={item.letter}
                label={item.name}
                isHovered={hoveredItem === item.id}
                isActive={activeSection === item.id}
                onClick={() => scrollToSection(item.id)}
              />
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-white"></span>
              )}
            </li>
          ))}
        </ul>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
          <ul className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <h1>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left w-full hover:text-gray-200 transition-colors ${
                      activeSection === item.id ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {item.name}
                  </button>
                </h1>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
