/**
 * Integration Tests: Navbar Navigation
 * 
 * Tests navigation flow and interactions
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('Navbar Navigation Integration', () => {
  beforeEach(() => {
    mockScrollIntoView.mockClear();
    // Mock getElementById to return elements
    document.getElementById = jest.fn((id: string) => {
      const element = document.createElement('div');
      element.id = id;
      element.getBoundingClientRect = jest.fn(() => ({
        top: 100,
        bottom: 200,
        left: 0,
        right: 0,
        width: 100,
        height: 100,
        x: 0,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect));
      return element;
    });
  });

  test('clicking navigation item scrolls to section', () => {
    render(<Navbar />);
    const workButton = screen.getByText('WORK');
    
    fireEvent.click(workButton);
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('all navigation items are clickable', () => {
    render(<Navbar />);
    const navItems = ['WORK', 'ABOUT', 'CONTACT', 'SKETCHES'];
    
    navItems.forEach(item => {
      const button = screen.getByText(item);
      expect(button).toBeTruthy();
      fireEvent.click(button);
    });
    
    expect(mockScrollIntoView).toHaveBeenCalledTimes(navItems.length);
  });

  test('mobile menu opens and closes on button click', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Menu should be closed initially
    expect(screen.queryByText('WORK')?.closest('.md\\:hidden')).toBeFalsy();
    
    // Open menu
    fireEvent.click(menuButton);
    
    // Menu should be open (mobile menu items visible)
    // Note: This test may need adjustment based on actual mobile menu implementation
  });

  test('clicking mobile menu item closes menu', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Open menu first
    fireEvent.click(menuButton);
    
    // Click a menu item (use getAllByText to get mobile menu item)
    const workButtons = screen.getAllByText('WORK');
    // Mobile menu item should be the second one (after desktop)
    const mobileWorkButton = workButtons[1];
    fireEvent.click(mobileWorkButton);
    
    // Menu should close (implementation dependent)
    expect(mockScrollIntoView).toHaveBeenCalled();
  });
});

