# Implementation Components - Complete Systematic List
# Chris Cole Portfolio Website - Exact Replica

**Project**: Chris Cole Portfolio Website Recreation  
**Original Site**: https://hellochriscole.webflow.io  
**Version**: 1.0.0  
**Date**: November 11, 2025  
**Status**: Complete Component Breakdown

---

## Executive Summary

This document provides a **systematic, end-to-end list** of all implementation components that can be **independently built, tested (manually using browser tab), and user-verified/UAT'ed** to ensure strict adherence with business requirements, implementation plan, and the objective to build an exact replica of `https://hellochriscole.webflow.io/` including all animations and visual effects.

**Component Organization**: Components are organized by build priority, dependency order, and testing complexity.

---

## Table of Contents

1. [Foundation & Configuration Components](#1-foundation--configuration-components)
2. [Layout Components](#2-layout-components)
3. [Animation System Components](#3-animation-system-components)
4. [Section Components](#4-section-components)
5. [UI Components](#5-ui-components)
6. [Utility Components & Hooks](#6-utility-components--hooks)
7. [Asset Requirements](#7-asset-requirements)
8. [Testing & Verification Checklist](#8-testing--verification-checklist)

---

## 1. Foundation & Configuration Components

### 1.1 Project Configuration Files

#### Component: `next.config.js`
- **Purpose**: Next.js configuration for static site generation
- **Dependencies**: None
- **Build Order**: 1
- **Test Method**: Verify build completes without errors
- **Verification**:
  - [ ] `npm run build` succeeds
  - [ ] Static HTML files generated in `.next/`
  - [ ] Image optimization enabled
  - [ ] Console removal in production works

#### Component: `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Dependencies**: None
- **Build Order**: 1
- **Test Method**: Type checking
- **Verification**:
  - [ ] `npm run type-check` passes with zero errors
  - [ ] Path aliases work (`@/*`, `@/components/*`)
  - [ ] Strict mode enabled

#### Component: `tailwind.config.js`
- **Purpose**: Tailwind CSS configuration with custom theme
- **Dependencies**: None
- **Build Order**: 1
- **Test Method**: Visual verification + build check
- **Verification**:
  - [ ] Custom colors defined (black, white, gray scale)
  - [ ] Custom fonts configured (Space Grotesk, Courier New)
  - [ ] Custom animations defined (twinkle, float, drift)
  - [ ] Content paths include all source files
  - [ ] Tailwind classes compile correctly

#### Component: `postcss.config.js`
- **Purpose**: PostCSS configuration for Tailwind processing
- **Dependencies**: tailwind.config.js
- **Build Order**: 1
- **Test Method**: Build verification
- **Verification**:
  - [ ] CSS processes correctly
  - [ ] Autoprefixer works
  - [ ] Tailwind utilities available

#### Component: `package.json`
- **Purpose**: Project dependencies and scripts
- **Dependencies**: None
- **Build Order**: 1
- **Test Method**: Dependency installation
- **Verification**:
  - [ ] All dependencies listed correctly
  - [ ] Scripts work (`dev`, `build`, `start`, `lint`, `type-check`)
  - [ ] Engines specified (Node >= 18, npm >= 9)

### 1.2 Global Styles & Fonts

#### Component: `src/app/globals.css`
- **Purpose**: Global CSS styles, Tailwind directives, custom utilities
- **Dependencies**: tailwind.config.js
- **Build Order**: 2
- **Test Method**: Visual inspection in browser
- **Verification**:
  - [ ] Background is pure black (#000000)
  - [ ] Text is pure white (#FFFFFF)
  - [ ] Custom cursor hidden (`cursor-none`)
  - [ ] Smooth scroll enabled
  - [ ] Reduced motion preferences respected
  - [ ] Custom utility classes work (`.text-hero`, `.text-section`, `.section-padding`)
  - [ ] Focus indicators visible (accessibility)

#### Component: `src/app/fonts.ts`
- **Purpose**: Google Fonts configuration (Space Grotesk)
- **Dependencies**: None
- **Build Order**: 2
- **Test Method**: Browser DevTools + visual inspection
- **Verification**:
  - [ ] Space Grotesk loads from Google Fonts
  - [ ] Font-display: swap strategy
  - [ ] Preload enabled for critical fonts
  - [ ] All weights available (300, 400, 500, 600, 700)
  - [ ] Font variable exported correctly (`--font-space-grotesk`)
  - [ ] No Typekit scripts present (replaced with Google Fonts)

---

## 2. Layout Components

### 2.1 Root Layout

#### Component: `src/app/layout.tsx`
- **Purpose**: Root HTML layout, metadata, font application
- **Dependencies**: fonts.ts, globals.css
- **Build Order**: 3
- **Test Method**: Browser inspection + SEO tools
- **Verification**:
  - [ ] HTML structure correct (`<html>`, `<head>`, `<body>`)
  - [ ] Font variable applied to HTML element
  - [ ] Metadata tags present (title, description, OG tags, Twitter cards)
  - [ ] SmoothScroll wrapper present
  - [ ] CursorTrail component included
  - [ ] Language attribute set (`lang="en"`)
  - [ ] Viewport meta tag present

### 2.2 Smooth Scroll Wrapper

#### Component: `src/components/layout/SmoothScroll.tsx`
- **Purpose**: Lenis smooth scroll initialization
- **Dependencies**: lenis package
- **Build Order**: 4
- **Test Method**: Manual scroll test in browser
- **Verification**:
  - [ ] Smooth scroll works (not janky, buttery smooth)
  - [ ] Scroll duration: ~1.2s
  - [ ] Works on all sections
  - [ ] No conflicts with native scroll
  - [ ] Cleanup on unmount (no memory leaks)
  - [ ] Touch scrolling works on mobile

### 2.3 Navigation Bar

#### Component: `src/components/layout/Navbar.tsx`
- **Purpose**: Fixed top navigation with brand and menu items
- **Dependencies**: None
- **Build Order**: 5
- **Test Method**: Visual inspection + interaction testing
- **Verification**:
  - [ ] Brand/Logo: "CHRIS COLE" (h6 heading) - matches original structure
  - [ ] Navigation items: WORK, ABOUT, CONTACT, SKETCHES (h1 headings) - matches original
  - [ ] Fixed position on scroll
  - [ ] Background changes on scroll (transparent → semi-transparent with blur)
  - [ ] Active section highlighting works
  - [ ] Smooth scroll to sections on click
  - [ ] Hover effects (underline/glow)
  - [ ] Mobile hamburger menu (responsive)
  - [ ] Mobile menu opens/closes with animation
  - [ ] Heading hierarchy maintained (h6 brand, h1 nav items, h2 sections)

### 2.4 Footer

#### Component: `src/components/layout/Footer.tsx`
- **Purpose**: Footer with copyright and credits
- **Dependencies**: None
- **Build Order**: 5
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Copyright text present (current year)
  - [ ] Tech stack credit present
  - [ ] Design credit/acknowledgment present
  - [ ] No Webflow badge (removed for replica)
  - [ ] Centered layout
  - [ ] Monospace font for technical details
  - [ ] Proper spacing and padding

---

## 3. Animation System Components

### 3.1 Loading Overlay

#### Component: `src/components/animations/LoadingOverlay.tsx`
- **Purpose**: Saturn & Moon orbit loading animation
- **Dependencies**: GSAP
- **Build Order**: 6
- **Test Method**: Page load observation + timing verification
- **Verification**:
  - [ ] Full-screen black overlay appears on page load
  - [ ] Saturn planet visible (SVG or image)
  - [ ] Moon(s) visible and orbiting Saturn
  - [ ] "LOADING" text visible
  - [ ] Saturn rotates continuously (360°, 8-12 seconds per rotation)
  - [ ] Moon orbits in circular path (10-15 seconds per orbit)
  - [ ] Fade-in animation: 500-800ms duration
  - [ ] Fade-out animation: 500-800ms duration
  - [ ] Total display time: 2-3 seconds
  - [ ] Smooth, linear animation (60fps, no jank)
  - [ ] Data attribute present: `data-w-id="5e181dd5-2adb-abf2-9999-c6fcf58866a5"`
  - [ ] Centered on screen (50% top, 50% left)
  - [ ] Z-index: 9999 (above all content)
  - [ ] Respects prefers-reduced-motion

### 3.2 Custom Cursor Trail

#### Component: `src/components/animations/CursorTrail.tsx`
- **Purpose**: Custom cursor that follows mouse with lag
- **Dependencies**: GSAP
- **Build Order**: 6
- **Test Method**: Mouse movement + hover testing
- **Verification**:
  - [ ] Custom cursor visible (white circle, 24px diameter)
  - [ ] Follows mouse with 200ms lag (smooth trailing effect)
  - [ ] Default state: 24px circle, 80% opacity
  - [ ] Mix-blend-mode: difference (inverts on backgrounds)
  - [ ] Hover state: Scales to 36px (1.5x) on links/buttons
  - [ ] Click state: Shrinks to 18px (0.75x) on mousedown
  - [ ] Returns to hover or default on mouseup
  - [ ] Hidden on mobile/tablet (desktop only)
  - [ ] Smooth GSAP tweening (no jank)
  - [ ] No pointer-events (doesn't block clicks)
  - [ ] Will-change optimization active
  - [ ] Cleanup on unmount

### 3.3 Parallax Stars Background

#### Component: `src/components/animations/ParallaxStars.tsx`
- **Purpose**: Background starfield with parallax scroll effect
- **Dependencies**: GSAP, ScrollTrigger
- **Build Order**: 7
- **Test Method**: Scroll testing + visual inspection
- **Verification**:
  - [ ] Stars visible (1-3px white dots)
  - [ ] ~50-100 stars per viewport
  - [ ] Random positioning
  - [ ] Twinkling animation (opacity 1 → 0.3 → 1, 2-4s duration)
  - [ ] Parallax effect: Stars move at 0.3x scroll speed
  - [ ] Fixed position (doesn't scroll with content)
  - [ ] Z-index: 0 (behind content)
  - [ ] Pointer-events: none (doesn't block interactions)
  - [ ] Smooth parallax (no jank, 60fps)
  - [ ] ScrollTrigger registered correctly

### 3.4 Drifting Spaceships

#### Component: `src/components/animations/DriftingSpaceships.tsx`
- **Purpose**: Spaceship icons drifting diagonally across background
- **Dependencies**: GSAP, spaceship.svg asset
- **Build Order**: 8
- **Test Method**: Visual observation + timing verification
- **Verification**:
  - [ ] 5-8 spaceships visible at any time
  - [ ] Spaceship SVG icons render correctly
  - [ ] Sizes: 30px, 40px, 50px variations
  - [ ] Diagonal drift animation (random directions)
  - [ ] Duration: 80-120 seconds per traverse
  - [ ] White outline, transparent fill
  - [ ] Loops continuously (restarts from opposite corner)
  - [ ] Slow rotation (optional, subtle)
  - [ ] Fixed position, z-index: 0
  - [ ] Pointer-events: none

### 3.5 Mouse-Move Parallax

#### Component: `src/components/animations/MouseParallax.tsx`
- **Purpose**: 3D parallax effect based on mouse position
- **Dependencies**: GSAP
- **Build Order**: 8
- **Test Method**: Mouse movement testing
- **Verification**:
  - [ ] Satellite icons move based on mouse position
  - [ ] Movement range: ±15px (calculated as `(cx - 0.5) * 30`)
  - [ ] Percentage-based viewport calculation
  - [ ] Smooth animation (duration: 0.2s)
  - [ ] Background stars move subtly (optional enhancement)
  - [ ] Responsive feel (not laggy)
  - [ ] Cleanup on unmount

### 3.6 Constellation Pattern (Optional)

#### Component: `src/components/animations/Constellation.tsx`
- **Purpose**: Connected stars forming constellation pattern
- **Dependencies**: constellation.svg asset (optional)
- **Build Order**: 9 (optional)
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] 4-5 stars connected by white lines
  - [ ] Positioned in upper left area
  - [ ] White dots + white connecting lines
  - [ ] Optional subtle rotation/drift animation
  - [ ] Doesn't interfere with other elements

---

## 4. Section Components

### 4.1 Hero Section

#### Component: `src/components/sections/HeroSection.tsx`
- **Purpose**: Hero section with headline, specialties, and satellite icon
- **Dependencies**: GSAP, ScrollTrigger, specialty icons
- **Build Order**: 9
- **Test Method**: Visual comparison + animation testing
- **Verification**:
  - [ ] **CRITICAL**: Headline text matches exactly: "I'VE WORKED IN TECH AND CPG FOR 6 YEARS AS A CREATIVE DIRECTOR, LEADING THE DESIGN EFFORTS OF STARTUPS."
  - [ ] **CRITICAL**: Bordered container present (2px solid white border)
  - [ ] Container padding: 48px 64px (responsive)
  - [ ] Container max-width: 800px (centered)
  - [ ] Specialties intro text: "I DO A BIT OF EVERYTHING, BUT MY SPECIALITIES INCLUDE:"
  - [ ] **CRITICAL**: 5 specialty icons present (WEB, BRANDING, PRODUCT, PACKAGING, COCKTAILS :))
  - [ ] Specialty icons: ~40-50px height, white outline style
  - [ ] Icon spacing: ~60-80px horizontal gap
  - [ ] Satellite icon visible (top-right area)
  - [ ] Satellite icon initial rotation: 11.8494deg (Z-axis)
  - [ ] Satellite icon rotates continuously (360° loop)
  - [ ] Satellite wrapper initial rotation: -18.417deg (Z-axis)
  - [ ] Satellite responds to mouse-move parallax
  - [ ] Data attributes present: `data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"` (icon), `data-w-id="625d0590-86b2-4b1f-ce96-85d35d22609c"` (wrapper)
  - [ ] Headline fades in sequentially (stagger: 200ms)
  - [ ] Specialties line divider present (`.specialties-line`)
  - [ ] Specialties line animates (fade-in + scaleX)
  - [ ] Specialties text container: `data-w-id="92e91bae-5e58-aa21-e06e-fe2a43664f68"`
  - [ ] Scroll indicator (down arrow) present
  - [ ] Section ID: `id="home"`
  - [ ] Min-height: 100vh (full viewport)
  - [ ] Typography: Space Grotesk, responsive sizing

### 4.2 Section Divider (Curved Line)

#### Component: `src/components/ui/SectionDivider.tsx`
- **Purpose**: Curved arc/line between hero and work sections
- **Dependencies**: None
- **Build Order**: 10
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Large curved SVG path visible
  - [ ] Spans nearly full viewport width
  - [ ] White stroke, ~2-3px width
  - [ ] Positioned between hero and work sections
  - [ ] Creates "planet horizon" visual effect
  - [ ] Smooth curve (quadratic bezier path)

### 4.3 Work Section

#### Component: `src/components/sections/WorkSection.tsx`
- **Purpose**: Portfolio projects display
- **Dependencies**: GSAP, ScrollTrigger, ProjectCard component
- **Build Order**: 11
- **Test Method**: Visual inspection + scroll testing
- **Verification**:
  - [ ] Section heading: "WORK" (h2 heading)
  - [ ] **CRITICAL**: Status label: "(UNDER CONSTRUCTION)" below heading
  - [ ] Status label: Monospace font, gray color, ~16-18px
  - [ ] Section ID: `id="work"`
  - [ ] Project cards present (if any projects)
  - [ ] Scroll-triggered reveal: Elements fade-up when 20% in viewport
  - [ ] Staggered entry animation on scroll
  - [ ] Project hover effects work (scale 1.05x, brightness increase)
  - [ ] "View site" links present (if projects exist)
  - [ ] Links open in new tab
  - [ ] Parallax: Background elements move slower than foreground
  - [ ] Typography matches original

### 4.4 About Section

#### Component: `src/components/sections/AboutSection.tsx`
- **Purpose**: Bio and personal information
- **Dependencies**: GSAP, ScrollTrigger
- **Build Order**: 12
- **Test Method**: Visual inspection + scroll testing
- **Verification**:
  - [ ] Section heading: "ABOUT" (h2 heading)
  - [ ] Section ID: `id="about"`
  - [ ] Bio paragraph(s) present
  - [ ] Text blocks fade in on scroll
  - [ ] Optional: Text reveals character-by-character (typewriter effect)
  - [ ] Decorative space elements float around content (optional)
  - [ ] Typography: Space Grotesk, readable line height
  - [ ] Text column width: ~800px (centered, max-width constraint)
  - [ ] Proper spacing and padding

### 4.5 Contact Section

#### Component: `src/components/sections/ContactSection.tsx`
- **Purpose**: Contact information and social links
- **Dependencies**: GSAP, EmailCopyButton component
- **Build Order**: 13
- **Test Method**: Interaction testing + clipboard API
- **Verification**:
  - [ ] Section heading: "CONTACT" (h2 heading)
  - [ ] Section ID: `id="contact"`
  - [ ] Email address displayed: "hello@chriscole.com" (or correct email)
  - [ ] Email copy-to-clipboard button works
  - [ ] Success animation plays on copy (checkmark, toast message)
  - [ ] Social links present (LinkedIn, Twitter, Dribbble, etc.)
  - [ ] Social links navigate correctly (open in new tab)
  - [ ] Social icons render correctly (SVG or icon font)
  - [ ] Links glow on hover
  - [ ] Form fields focus/blur correctly (if contact form exists)
  - [ ] Submit button press animation works (3D depress effect, if form exists)

### 4.6 Sketches Section

#### Component: `src/components/sections/SketchesSection.tsx`
- **Purpose**: Sketch gallery with staggered animations
- **Dependencies**: GSAP, ScrollTrigger, SketchGallery component
- **Build Order**: 14
- **Test Method**: Visual inspection + scroll + hover testing
- **Verification**:
  - [ ] Section heading: "SKETCHES" (h2 heading)
  - [ ] Section ID: `id="sketches"`
  - [ ] Gallery layout: Grid of sketch thumbnails (3-4 columns)
  - [ ] **CRITICAL**: Staggered animation on scroll:
    - [ ] Initial state: opacity 0, scale 0.8
    - [ ] Animated state: opacity 1, scale 1
    - [ ] Stagger delay: 0.1s between each thumbnail
    - [ ] Trigger: `#sketches` section ID
    - [ ] Start position: `'top 80%'` viewport
  - [ ] Hover effects: Scale up (1.1x), border glow
  - [ ] Click to expand: Full-size lightbox/modal
  - [ ] Modal: Fade-in with backdrop blur
  - [ ] Navigate between sketches in modal
  - [ ] Images load correctly (optimized, lazy-loaded)

---

## 5. UI Components

### 5.1 Specialty Icon Component

#### Component: `src/components/ui/SpecialtyIcon.tsx`
- **Purpose**: Reusable specialty icon component
- **Dependencies**: SVG assets
- **Build Order**: 7 (before HeroSection)
- **Test Method**: Visual inspection + prop testing
- **Verification**:
  - [ ] Accepts icon name prop (WEB, BRANDING, PRODUCT, PACKAGING, COCKTAILS)
  - [ ] Renders correct SVG icon
  - [ ] Size: ~40-50px height
  - [ ] White outline style
  - [ ] Monochrome (no colors)
  - [ ] Accessible (alt text or aria-label)
  - [ ] All 5 icons render correctly

### 5.2 Project Card Component

#### Component: `src/components/ui/ProjectCard.tsx`
- **Purpose**: Individual project card with hover effects
- **Dependencies**: GSAP (optional for animations)
- **Build Order**: 10 (before WorkSection)
- **Test Method**: Hover testing + visual inspection
- **Verification**:
  - [ ] Project title displays
  - [ ] Project description displays
  - [ ] Project tags display
  - [ ] "View site" CTA link present
  - [ ] Hover: Scale 1.05x with smooth transition
  - [ ] Hover: Brightness increase (filter: brightness(1.1))
  - [ ] **CRITICAL**: Exact Tailwind classes: `transition-transform duration-300 scale-105`
  - [ ] Link hover: Arrow shifts right, underline appears
  - [ ] Image loads correctly (Next.js Image component)
  - [ ] Responsive: Adapts to mobile/tablet

### 5.3 Email Copy Button

#### Component: `src/components/ui/EmailCopyButton.tsx`
- **Purpose**: Email copy-to-clipboard with success animation
- **Dependencies**: Clipboard API
- **Build Order**: 12 (before ContactSection)
- **Test Method**: Click testing + clipboard verification
- **Verification**:
  - [ ] Email address displayed
  - [ ] Copy icon/button visible
  - [ ] Click copies email to clipboard
  - [ ] Success animation: Icon morphs to checkmark
  - [ ] Toast message: "Copied to clipboard!" appears
  - [ ] Toast fades out after 2s
  - [ ] Resets to copy icon after timeout
  - [ ] Works in all browsers (fallback for unsupported browsers)
  - [ ] Hover state: Icon brightens, tooltip "Copy email"

### 5.4 Sketch Gallery Component

#### Component: `src/components/ui/SketchGallery.tsx`
- **Purpose**: Gallery container with lightbox functionality
- **Dependencies**: GSAP, ScrollTrigger
- **Build Order**: 13 (before SketchesSection)
- **Test Method**: Click testing + modal testing
- **Verification**:
  - [ ] Grid layout (3-4 columns, responsive)
  - [ ] Thumbnails render correctly
  - [ ] Click thumbnail opens lightbox
  - [ ] Lightbox: Full-size image displayed
  - [ ] Lightbox: Backdrop blur/overlay
  - [ ] Lightbox: Close button (X icon)
  - [ ] Lightbox: Navigate between sketches (prev/next)
  - [ ] Lightbox: Keyboard navigation (arrow keys, Escape)
  - [ ] Lightbox: Fade-in animation
  - [ ] Images optimized (lazy-loaded, WebP format preferred)

### 5.5 Button Component (Optional)

#### Component: `src/components/ui/Button.tsx`
- **Purpose**: Reusable button with 3D press effect
- **Dependencies**: GSAP (optional)
- **Build Order**: 12 (if contact form exists)
- **Test Method**: Click testing + visual inspection
- **Verification**:
  - [ ] Button renders correctly
  - [ ] **CRITICAL**: 3D press effect on click:
    - [ ] Press: translateY(2px), scale(0.98), shadow reduces
    - [ ] Release: Springs back with elastic ease
    - [ ] Duration: 100ms press, 200ms release
  - [ ] Hover: Border glow, slight scale (1.02x)
  - [ ] Focus: Visible outline (accessibility)
  - [ ] Disabled state works (if applicable)

---

## 6. Utility Components & Hooks

### 6.1 Scroll Reveal Hook

#### Component: `src/hooks/useScrollReveal.ts`
- **Purpose**: Reusable hook for scroll-triggered fade-up animations
- **Dependencies**: GSAP, ScrollTrigger
- **Build Order**: 6 (before sections)
- **Test Method**: Used in sections, verify animations trigger
- **Verification**:
  - [ ] Returns ref to attach to element
  - [ ] Animates when element is 20% visible in viewport
  - [ ] Animation: opacity 0 → 1, translateY(30px) → 0
  - [ ] Duration: 600ms, ease: 'power2.out'
  - [ ] ScrollTrigger registered correctly
  - [ ] Cleanup on unmount (ScrollTrigger.kill())

### 6.2 Scroll Trigger Hook (Framer Motion)

#### Component: `src/animations/scrollTrigger.ts` (FIX REQUIRED)
- **Purpose**: Framer Motion scroll trigger hook
- **Dependencies**: framer-motion, react-intersection-observer
- **Build Order**: 6
- **Test Method**: Type checking + usage in components
- **Verification**:
  - [ ] TypeScript errors fixed (useInView API corrected)
  - [ ] Hook returns controls and inView state
  - [ ] Works with Framer Motion animations
  - [ ] Config options work correctly (triggerOnce, threshold, rootMargin)

### 6.3 Parallax Hook

#### Component: `src/hooks/useParallax.ts`
- **Purpose**: Reusable hook for parallax scroll effects
- **Dependencies**: GSAP, ScrollTrigger
- **Build Order**: 7
- **Test Method**: Used in parallax components
- **Verification**:
  - [ ] Accepts speed multiplier (0.3x, 0.5x, 1.0x)
  - [ ] Moves element at specified speed relative to scroll
  - [ ] Smooth animation (scrub: true)
  - [ ] Works with ScrollTrigger
  - [ ] Cleanup on unmount

### 6.4 Cursor Hook

#### Component: `src/hooks/useCursor.ts`
- **Purpose**: Custom cursor state management hook
- **Dependencies**: None (used by CursorTrail)
- **Build Order**: 6
- **Test Method**: Used in CursorTrail component
- **Verification**:
  - [ ] Tracks mouse position
  - [ ] Manages cursor scale state (default, hover, click)
  - [ ] Returns cursor position and state
  - [ ] Works with GSAP animations

---

## 7. Asset Requirements

### 7.1 SVG Assets (Critical)

#### Asset: `public/svg/satellite.svg`
- **Purpose**: Hero section satellite icon
- **Priority**: CRITICAL (required for HeroSection)
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] SVG file exists
  - [ ] Line-art style, monochrome white
  - [ ] Optimized (SVGO)
  - [ ] Renders correctly in browser
  - [ ] Size appropriate (~48px default)

#### Asset: `public/svg/icon-web.svg`
- **Purpose**: WEB specialty icon
- **Priority**: CRITICAL (required for HeroSection)
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Browser/monitor wireframe design
  - [ ] White outline, minimal style
  - [ ] ~40-50px height
  - [ ] Monochrome

#### Asset: `public/svg/icon-branding.svg`
- **Purpose**: BRANDING specialty icon
- **Priority**: CRITICAL
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Triangle/mountain geometric design
  - [ ] White outline, geometric style
  - [ ] ~40-50px height

#### Asset: `public/svg/icon-product.svg`
- **Purpose**: PRODUCT specialty icon
- **Priority**: CRITICAL
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] 3D isometric box/cube design
  - [ ] White outline, perspective view
  - [ ] ~40-50px height

#### Asset: `public/svg/icon-packaging.svg`
- **Purpose**: PACKAGING specialty icon
- **Priority**: CRITICAL
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Package/box design (different from product icon)
  - [ ] White outline
  - [ ] ~40-50px height

#### Asset: `public/svg/icon-cocktails.svg`
- **Purpose**: COCKTAILS specialty icon
- **Priority**: CRITICAL
- **Build Order**: Before HeroSection
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Bottle with smiley face design
  - [ ] White outline
  - [ ] ~40-50px height
  - [ ] NOTE: Accompanies "COCKTAILS :)" text

#### Asset: `public/svg/spaceship.svg`
- **Purpose**: Drifting spaceship animation
- **Priority**: HIGH (required for DriftingSpaceships)
- **Build Order**: Before DriftingSpaceships component
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Simple side-view rocket/shuttle design
  - [ ] White outline, transparent fill
  - [ ] Optimized for animation

### 7.2 SVG Assets (Optional)

#### Asset: `public/svg/film-reel.svg`
- **Purpose**: Film reel icon (WORK section indicator)
- **Priority**: LOW (optional)
- **Build Order**: 11 (if implementing)
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] Film reel/cinema icon design
  - [ ] ~60-80px size
  - [ ] White outline
  - [ ] Positioned bottom-left (if implemented)

#### Asset: `public/svg/constellation.svg`
- **Purpose**: Constellation pattern
- **Priority**: LOW (optional)
- **Build Order**: 9 (if implementing)
- **Test Method**: Visual inspection
- **Verification**:
  - [ ] 4-5 connected stars
  - [ ] White dots + connecting lines
  - [ ] Upper left area positioning

### 7.3 Image Assets

#### Asset: `public/images/projects/` (Project Thumbnails)
- **Purpose**: Work section project images
- **Priority**: MEDIUM (if projects exist)
- **Build Order**: 11
- **Test Method**: Visual inspection + optimization check
- **Verification**:
  - [ ] Images optimized (WebP format preferred)
  - [ ] Appropriate sizes (1920x1080 or smaller)
  - [ ] Lazy-loaded (Next.js Image component)
  - [ ] Alt text provided

#### Asset: `public/images/sketches/` (Sketch Gallery)
- **Purpose**: Sketches section gallery images
- **Priority**: MEDIUM (if sketches exist)
- **Build Order**: 14
- **Test Method**: Visual inspection + gallery testing
- **Verification**:
  - [ ] Images optimized
  - [ ] Various sizes (responsive)
  - [ ] Lazy-loaded
  - [ ] Alt text provided

### 7.4 Favicon Set

#### Asset: `public/favicon.ico` + Apple Touch Icons
- **Purpose**: Browser favicons
- **Priority**: LOW (nice to have)
- **Build Order**: Any time
- **Test Method**: Browser tab inspection
- **Verification**:
  - [ ] favicon.ico (32x32)
  - [ ] apple-touch-icon.png (180x180)
  - [ ] favicon-16x16.png
  - [ ] favicon-32x32.png
  - [ ] favicon-192x192.png (Android)
  - [ ] favicon-512x512.png (Android)

---

## 8. Testing & Verification Checklist

### 8.1 Visual Fidelity Testing

#### Test: Side-by-Side Comparison
- **Method**: Open original site and replica in separate browser tabs
- **Components**: All sections
- **Verification**:
  - [ ] Hero section matches exactly (text, layout, spacing)
  - [ ] Work section matches (if projects exist)
  - [ ] About section matches
  - [ ] Contact section matches
  - [ ] Sketches section matches (if sketches exist)
  - [ ] Navigation matches
  - [ ] Footer matches
  - [ ] Typography matches (font, sizes, weights)
  - [ ] Colors match (black, white, gray only)
  - [ ] Spacing matches (padding, margins, gaps)

### 8.2 Animation Fidelity Testing

#### Test: Animation Timing Comparison
- **Method**: Record animations and compare timing
- **Components**: All animation components
- **Verification**:
  - [ ] Loading animation duration matches (2-3 seconds)
  - [ ] Saturn rotation speed matches (8-12 seconds)
  - [ ] Moon orbit speed matches (10-15 seconds)
  - [ ] Hero text stagger delay matches (200ms)
  - [ ] Scroll trigger positions match (20% viewport)
  - [ ] Parallax speeds match (0.3x, 0.5x, 1.0x)
  - [ ] Cursor lag matches (200ms)
  - [ ] All animations at 60fps (no jank)

### 8.3 Functional Testing

#### Test: Navigation & Interactions
- **Method**: Manual interaction testing
- **Components**: Navbar, Links, Buttons
- **Verification**:
  - [ ] All nav links scroll to correct sections
  - [ ] Smooth scroll works (Lenis)
  - [ ] Active section highlights correctly
  - [ ] Mobile menu works
  - [ ] Email copy-to-clipboard works
  - [ ] Social links navigate correctly
  - [ ] Project links open in new tab
  - [ ] All hover effects work
  - [ ] All click interactions work

### 8.4 Responsive Testing

#### Test: Breakpoint Testing
- **Method**: Browser DevTools responsive mode
- **Components**: All sections
- **Verification**:
  - [ ] Mobile (375px): Layout stacks, typography scales
  - [ ] Tablet (768px): Layout adapts, typography adjusts
  - [ ] Desktop (1920px): Full layout, all effects visible
  - [ ] No horizontal scroll on any viewport
  - [ ] Touch targets ≥ 44x44px on mobile
  - [ ] Custom cursor disabled on mobile
  - [ ] Parallax disabled on mobile (performance)

### 8.5 Performance Testing

#### Test: Core Web Vitals
- **Method**: Lighthouse + Chrome DevTools
- **Components**: Entire site
- **Verification**:
  - [ ] LCP: < 1.5s
  - [ ] FID: < 100ms
  - [ ] CLS: < 0.1
  - [ ] FCP: < 1.2s
  - [ ] TTI: < 2.5s
  - [ ] Bundle size: < 300KB (gzipped)
  - [ ] Animation frame rate: 60fps
  - [ ] No console errors
  - [ ] All network requests successful (200 status)

### 8.6 Accessibility Testing

#### Test: WCAG 2.1 AA Compliance
- **Method**: Axe DevTools + Manual testing
- **Components**: All components
- **Verification**:
  - [ ] Color contrast: 21:1 (white on black)
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus indicators visible
  - [ ] Screen reader compatible (test with VoiceOver/NVDA)
  - [ ] ARIA labels on icon buttons
  - [ ] Alt text on all images
  - [ ] Semantic HTML structure
  - [ ] Heading hierarchy correct (h6 brand, h1 nav, h2 sections)

### 8.7 Cross-Browser Testing

#### Test: Browser Compatibility
- **Method**: Test in multiple browsers
- **Components**: Entire site
- **Verification**:
  - [ ] Chrome (latest): All features work
  - [ ] Firefox (latest): All features work
  - [ ] Safari (latest): All features work
  - [ ] Edge (latest): All features work
  - [ ] Mobile Safari (iOS): Touch interactions work
  - [ ] Chrome Mobile (Android): Touch interactions work
  - [ ] Custom cursor works (desktop browsers)
  - [ ] Animations smooth in all browsers

---

## 9. Build Order Summary

### Phase 1: Foundation (Days 1-2)
1. Configuration files (next.config.js, tsconfig.json, tailwind.config.js, postcss.config.js, package.json)
2. Global styles (globals.css)
3. Fonts (fonts.ts)
4. Root layout (layout.tsx)

### Phase 2: Layout & Core (Days 3-4)
5. SmoothScroll component
6. Navbar component
7. Footer component

### Phase 3: Animation System (Days 5-7)
8. LoadingOverlay component
9. CursorTrail component
10. ParallaxStars component
11. Animation hooks (useScrollReveal, useParallax, useCursor)
12. Fix scrollTrigger.ts TypeScript errors

### Phase 4: UI Components (Days 8-9)
13. SpecialtyIcon component
14. ProjectCard component
15. EmailCopyButton component
16. SketchGallery component
17. Button component (if needed)

### Phase 5: Sections (Days 10-14)
18. HeroSection component (with all critical corrections)
19. SectionDivider component
20. WorkSection component
21. AboutSection component
22. ContactSection component
23. SketchesSection component

### Phase 6: Decorative Animations (Days 15-16)
24. DriftingSpaceships component
25. MouseParallax component
26. Constellation component (optional)
27. FilmReelIcon component (optional)

### Phase 7: Assets (Throughout)
28. SVG assets (satellite, specialty icons, spaceship)
29. Image assets (projects, sketches)
30. Favicon set

### Phase 8: Integration & Testing (Days 17-21)
31. Integrate all components in page.tsx
32. Visual regression testing
33. Animation timing verification
34. Cross-browser testing
35. Performance optimization
36. Accessibility audit

---

## 10. Critical Implementation Notes

### 10.1 Must-Fix Before Development

1. **Hero Headline Text**: Must be "I'VE WORKED IN TECH AND CPG FOR 6 YEARS AS A CREATIVE DIRECTOR, LEADING THE DESIGN EFFORTS OF STARTUPS." (NOT "over a decade")
2. **Bordered Container**: Hero section MUST have white-bordered box containing headline + specialties
3. **Specialty Icons**: All 5 icons MUST be present (WEB, BRANDING, PRODUCT, PACKAGING, COCKTAILS :))
4. **TypeScript Error**: Fix `scrollTrigger.ts` useInView API usage

### 10.2 High Priority (Before Phase 2)

5. **Drifting Spaceships**: Implement spaceship drift animation (NOT asteroids)
6. **Curved Line Divider**: Section divider between hero and work sections

### 10.3 Medium Priority (During Development)

7. **Constellation Pattern**: Optional decorative element
8. **Film Reel Icon**: Optional WORK section indicator
9. **Work Section Status**: "(UNDER CONSTRUCTION)" label

### 10.4 Technical Requirements

- **GSAP Plugin Registration**: Must register ScrollTrigger in each file using it
- **SSR Considerations**: All window/document access must be in useEffect
- **Component Placement**: CursorTrail after Navbar in Layout
- **Responsive Design**: Use Tailwind modifiers (`text-2xl md:text-3xl`)
- **Performance**: All animations must maintain 60fps

---

## 11. Component Dependency Graph

```
Configuration Files (1.1)
    ↓
Global Styles & Fonts (1.2)
    ↓
Root Layout (2.1)
    ↓
SmoothScroll (2.2) → Navbar (2.3) → Footer (2.4)
    ↓
Animation Hooks (6.1-6.4)
    ↓
Animation Components (3.1-3.6)
    ↓
UI Components (5.1-5.5)
    ↓
Section Components (4.1-4.6)
    ↓
Page Integration (app/page.tsx)
```

---

## Document Status

**Status**: ✅ **COMPLETE - READY FOR IMPLEMENTATION**  
**Version**: 1.0.0  
**Last Updated**: November 11, 2025  
**Total Components**: 36+ independent components  
**Total Assets**: 10+ SVG assets, image assets, favicon set

**Next Steps**:
1. Review this component list with development team
2. Prioritize components based on build order
3. Assign components to developers
4. Begin Phase 1 implementation
5. Test each component independently before integration
6. Verify against original site at each milestone

---

**END OF IMPLEMENTATION COMPONENTS DOCUMENT**

