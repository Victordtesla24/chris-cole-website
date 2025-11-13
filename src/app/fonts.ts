import { Space_Grotesk } from 'next/font/google';

/**
 * Primary Font: Space Grotesk
 * 
 * Original Site: Adobe Typekit (kit ID: uti0eci)
 * Replica: Google Fonts (Space Grotesk) - free, reliable alternative
 * 
 * Requirements:
 * - Font-display: swap (show fallback immediately)
 * - Preload: true (critical font)
 * - Weights: 300, 400, 500, 600, 700
 * - Subsets: latin
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap', // Match original Typekit font-display: swap strategy
  preload: true, // Preload critical fonts for performance
});

/**
 * Secondary Font: Courier New
 * System font (no installation needed)
 * Fallback: Courier, monospace
 * Defined in Tailwind config
 */

