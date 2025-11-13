/**
 * Unit Tests: Navbar Component
 * 
 * Tests navigation bar component logic
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

describe('Navbar Component', () => {
  test('component renders without errors', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  test('brand/logo "CHRIS COLE" is present as h6 heading', () => {
    const { container } = render(<Navbar />);
    const brand = screen.getByText('CHRIS COLE');
    expect(brand).toBeTruthy();
    // Brand text is inside an <a> tag, which is inside an <h6>
    const h6 = brand.closest('h6');
    expect(h6).toBeTruthy();
    expect(h6?.tagName).toBe('H6');
  });

  test('navigation items are present as h1 headings', () => {
    render(<Navbar />);
    const work = screen.getByText('WORK');
    const about = screen.getByText('ABOUT');
    const contact = screen.getByText('CONTACT');
    const sketches = screen.getByText('SKETCHES');
    
    expect(work).toBeTruthy();
    expect(about).toBeTruthy();
    expect(contact).toBeTruthy();
    expect(sketches).toBeTruthy();
    
    // Check that they are within h1 elements
    expect(work.closest('h1')).toBeTruthy();
    expect(about.closest('h1')).toBeTruthy();
    expect(contact.closest('h1')).toBeTruthy();
    expect(sketches.closest('h1')).toBeTruthy();
  });

  test('all navigation items are present', () => {
    render(<Navbar />);
    expect(screen.getByText('WORK')).toBeTruthy();
    expect(screen.getByText('ABOUT')).toBeTruthy();
    expect(screen.getByText('CONTACT')).toBeTruthy();
    expect(screen.getByText('SKETCHES')).toBeTruthy();
  });

  test('mobile menu button is present', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeTruthy();
  });

  test('navbar has fixed position classes', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('fixed');
    expect(nav?.className).toContain('top-0');
  });
});

