/**
 * UI Tests: Navbar Component
 * 
 * Tests visual rendering and structure
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Navbar UI Structure', () => {
  test('heading hierarchy is correct (h6 brand, h1 nav items)', () => {
    const { container } = render(<Navbar />);
    
    // Brand should be h6
    const brand = screen.getByText('CHRIS COLE');
    const h6 = brand.closest('h6');
    expect(h6?.tagName).toBe('H6');
    
    // Nav items should be h1
    const navItems = ['WORK', 'ABOUT', 'CONTACT', 'SKETCHES'];
    navItems.forEach(item => {
      const element = screen.getByText(item);
      expect(element.closest('h1')).toBeTruthy();
    });
  });

  test('navbar has correct CSS classes for fixed positioning', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('fixed');
    expect(nav?.className).toContain('z-50');
  });

  test('background transition classes are present', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('transition-all');
    expect(nav?.className).toContain('duration-300');
  });

  test('mobile menu button is only visible on mobile', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeTruthy();
    expect(menuButton.className).toContain('md:hidden');
  });

  test('desktop navigation is hidden on mobile', () => {
    const { container } = render(<Navbar />);
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).toBeTruthy();
  });
});

