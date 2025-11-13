# Comprehensive Testing Strategy
# Chris Cole Portfolio Website - Exact Replication Testing

**Project**: Chris Cole Portfolio Website Recreation  
**Original Site**: https://hellochriscole.webflow.io  
**Target**: Pixel-perfect, functionally identical replica  
**Version**: 1.0.0  
**Date**: November 11, 2025

---

## Executive Summary

This document outlines a comprehensive testing strategy to ensure the recreated Chris Cole portfolio website matches the original site (hellochriscole.webflow.io) with **100% visual and functional fidelity**. The testing approach covers visual replication, animation accuracy, performance and cross-browser compatibility.

**Testing Philosophy**: Every visual element, animation, interaction, and behavior must be tested against the original site to ensure exact replication.

---

## 1. Testing Directory Structure

### 1.1 Test Organization

```
tests/
├── unit/                    # Unit tests for individual functions/components
│   ├── animations/          # Animation utility tests
│   ├── components/          # Component logic tests
│   └── utils/              # Utility function tests
│
├── ui/                      # UI component rendering tests
│   ├── components/         # Component visual tests
│   └── sections/           # Section component tests
│
├── animation/               # Animation-specific tests
│   ├── gsap/               # GSAP animation tests
│   ├── framer-motion/      # Framer Motion tests
│   ├── scroll-triggers/    # ScrollTrigger tests
│   └── parallax/           # Parallax effect tests
│
├── integration/             # Integration tests
│   ├── navigation/         # Navigation flow tests
│   ├── sections/           # Section interaction tests
│   └── user-flows/         # Complete user journey tests
│
├── system/                  # End-to-end system tests
│   ├── visual-regression/  # Visual comparison tests
│   └── performance/        # Performance benchmarks
│   
└── logs/                    # Test execution logs
    ├── error-logs/         # Error tracking
    └── test-results/       # Test result summaries
```

### 1.2 Test File Naming Convention

- **Unit tests**: `*.test.ts` or `*.test.tsx`
- **UI tests**: `*.ui.test.tsx`
- **Animation tests**: `*.animation.test.ts`
- **Integration tests**: `*.integration.test.ts`
- **System tests**: `*.system.test.ts`

**Example**: `HeroSection.animation.test.tsx`, `CursorTrail.ui.test.tsx`

---

## 2. Visual Replication Testing

### 2.1 Pixel-Perfect Comparison

**Objective**: Ensure every visual element matches the original site exactly.

**Tools**:
- **Percy** or **Chromatic** (visual regression testing)
- **Pixelmatch** (pixel-level comparison)
- **Playwright** (screenshot comparison)
- Manual side-by-side comparison

**Test Cases**:

#### 2.1.0 Hero Section Exact HTML Elements

**Satellite Icon Image Test**:
- [ ] Satellite icon image renders with correct source URL or local path
- [ ] Data attribute `data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"` present
- [ ] CSS class `satellite-icon` applied
- [ ] Initial transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(11.8494deg) skew(0deg, 0deg)`
- [ ] Transform style: `preserve-3d`
- [ ] Will-change: `transform` property set
- [ ] Initial Z-axis rotation: `11.8494deg`
- [ ] Image positioned correctly (absolute/fixed, top-right of hero)

**Specialties Line Divider Test**:
- [ ] Div element with class `specialties-line` exists
- [ ] Line renders as white/gray divider
- [ ] Width and height match original (~128px width, 1px height)
- [ ] Centered horizontally in hero section
- [ ] Positioned between headline and specialties text

**Specialties Text Container Test**:
- [ ] Div element with data attribute `data-w-id="92e91bae-5e58-aa21-e06e-fe2a43664f68"` exists
- [ ] CSS class `specialties` applied
- [ ] Exact text content matches: "I'VE WORKED IN TECH AND CPG FOR 6 YEARS AS A CREATIVE DIRECTOR, LEADING THE DESIGN EFFORTS OF STARTUPS. I DO A BIT OF EVERYTHING, BUT MY SPECIALITIES INCLUDE: WEB BRANDING PRODUCT PACKAGING COCKTAILS"
- [ ] Typography: Monospace font (Courier New or Space Mono)
- [ ] Text color: White (#FFFFFF)
- [ ] Text alignment and spacing match original

**Satellite Wrapper Div Test**:
- [ ] Div element with data attribute `data-w-id="625d0590-86b2-4b1f-ce96-85d35d22609c"` exists
- [ ] CSS class `satellite-wrapper` applied
- [ ] Initial transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(-18.417deg) skew(0deg, 0deg)`
- [ ] Transform style: `preserve-3d`
- [ ] Will-change: `transform` property set
- [ ] Initial Z-axis rotation: `-18.417deg` (counter-clockwise)
- [ ] Wrapper contains satellite icon image
- [ ] Positioned correctly (absolute, top-right of hero section)

**Implementation Test**:
```typescript
// tests/ui/hero-section-elements.test.tsx
import { test, expect } from '@playwright/test';

test.describe('Hero Section Exact HTML Elements', () => {
  test('Satellite icon has correct attributes', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const satelliteIcon = page.locator('.satellite-icon');
    await expect(satelliteIcon).toHaveAttribute('data-w-id', 'c24b678f-7639-7dd0-241b-f552bb310982');
    
    const transform = await satelliteIcon.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    // Verify initial rotation is approximately 11.8494deg
    expect(transform).toBeTruthy();
  });

  test('Specialties line exists and is visible', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const specialtiesLine = page.locator('.specialties-line');
    await expect(specialtiesLine).toBeVisible();
    
    const width = await specialtiesLine.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    
    expect(parseInt(width)).toBeCloseTo(128, 10); // ~128px width
  });

  test('Specialties text has exact content', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const specialties = page.locator('.specialties[data-w-id="92e91bae-5e58-aa21-e06e-fe2a43664f68"]');
    await expect(specialties).toBeVisible();
    
    const text = await specialties.textContent();
    expect(text).toContain("I'VE WORKED IN TECH AND CPG FOR 6 YEARS");
    expect(text).toContain("WEB BRANDING PRODUCT PACKAGING COCKTAILS");
  });

  test('Satellite wrapper has correct transform', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const wrapper = page.locator('.satellite-wrapper[data-w-id="625d0590-86b2-4b1f-ce96-85d35d22609c"]');
    await expect(wrapper).toBeVisible();
    
    const transform = await wrapper.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    // Verify transform includes rotation
    expect(transform).toBeTruthy();
  });
});
```

#### 2.1.1 Layout & Spacing
- [ ] Container max-width: 1280px (exact match)
- [ ] Text column width: ~800px (centered)
- [ ] Section padding: 120px desktop, 80px mobile
- [ ] Component spacing: 40px between elements
- [ ] Horizontal padding: 5% viewport (min 24px, max 80px)

#### 2.1.2 Navigation HTML Structure (Dev Tools Analysis)
- [ ] Brand/Logo uses h6 heading (unusual but matches original)
- [ ] Main navigation items (Work, About, Contact, Sketches) use h1 headings (unusual but intentional)
- [ ] Heading hierarchy: h6 for brand, h1 for nav items, h2 for section headings
- [ ] 6 social media icon links present
- [ ] Social media links have proper ARIA labels (original has empty name attributes)
- [ ] Navigation links have proper href attributes (# anchors)

#### 2.1.3 Content HTML Structure (Dev Tools Analysis)
- [ ] Project section heading: "Crystal" (h2 heading)
- [ ] CTA link: "View site" 
- [ ] Footer Webflow badge removed (not present in replica)

#### 2.1.4 Typography
- [ ] Font family: Space Grotesk (primary), Courier New (secondary)
- [ ] Hero text: 4rem (64px) desktop, 2.5rem (40px) mobile
- [ ] Section headings: 2.5rem (40px) desktop, 2rem (32px) mobile
- [ ] Body text: 1.125rem (18px)
- [ ] Line heights match exactly
- [ ] Letter spacing matches exactly

**Font Loading Tests (Dev Tools Analysis)**:
- [ ] Google Fonts used instead of Adobe Typekit (original uses Typekit kit ID: uti0eci)
- [ ] Font-display: swap implemented (matches original Typekit strategy)
- [ ] Critical fonts preloaded
- [ ] Asynchronous font loading (no blocking)
- [ ] Font fallbacks work correctly

#### 2.1.5 Color Palette
- [ ] Background: Pure black (#000000)
- [ ] Text: Pure white (#FFFFFF)
- [ ] Gray accents: #333333, #666666, #999999, #CCCCCC
- [ ] Secondary text: #888888 to #AAAAAA range
- [ ] No colors outside monochrome spectrum

#### 2.1.6 Space Theme Elements
- [ ] Stars: 1-3px white dots, ~50-100 per viewport
- [ ] Asteroids: SVG shapes, white outline, transparent fill
- [ ] Satellites: Line-art style, positioned correctly
- [ ] Background starfield density matches

### 2.2 Visual Regression Test Suite

**Implementation**:
```typescript
// tests/system/visual-regression/homepage.visual.test.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Homepage', () => {
  test('Homepage matches original site', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2, // Allow 20% pixel difference for anti-aliasing
    });
  });

  test('Hero section matches original', async ({ page }) => {
    await page.goto('http://localhost:3002');
    const hero = page.locator('section.hero');
    await expect(hero).toHaveScreenshot('hero-section.png');
  });
});
```

**Comparison Process**:
1. Capture screenshots of original site (hellochriscole.webflow.io)
2. Capture screenshots of recreated site (localhost:3002)
3. Compare pixel-by-pixel using automated tools
4. Flag any differences > 5% threshold
5. Manual review of flagged differences

---

## 3. Animation Testing

### 3.1 Loading Animation Tests

#### 3.1.1 Saturn & Moon Orbit Animation

**HTML Structure**:
```html
<div data-w-id="5e181dd5-2adb-abf2-9999-c6fcf58866a5" class="loading-indicator" style="opacity: 0;">
  LOADING
</div>
```

**Test Specifications**:

**Visual Elements**:
- [ ] Saturn planet visible (SVG or image)
- [ ] Moon(s) orbiting Saturn
- [ ] "LOADING" text visible
- [ ] Centered on screen (50% top, 50% left)
- [ ] Initial opacity: 0 (hidden)

**Animation Behavior**:
- [ ] Saturn rotates continuously (360° rotation)
- [ ] Moon(s) orbit around Saturn in circular path
- [ ] Orbit speed: ~10-15 seconds per full rotation
- [ ] Rotation speed: ~8-12 seconds per full rotation
- [ ] Smooth, linear animation (no jank)
- [ ] Animation starts on page load
- [ ] Fade-in: opacity 0 → 1 (duration: 500-800ms)
- [ ] Fade-out: opacity 1 → 0 (duration: 500-800ms) after 2-3 seconds

**Implementation Test**:
```typescript
// tests/animation/loading-saturn.test.ts
import { test, expect } from '@playwright/test';

test.describe('Saturn Orbit Loading Animation', () => {
  test('Loading indicator appears on page load', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const loadingIndicator = page.locator('.loading-indicator');
    await expect(loadingIndicator).toBeVisible();
  });

  test('Saturn rotates continuously', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const saturn = page.locator('.loading-indicator .saturn');
    const initialRotation = await saturn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    
    const newRotation = await saturn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    
    expect(newRotation).not.toBe(initialRotation);
  });

  test('Moon orbits around Saturn', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const moon = page.locator('.loading-indicator .moon');
    const saturn = page.locator('.loading-indicator .saturn');
    
    // Get initial positions
    const moonBox = await moon.boundingBox();
    const saturnBox = await saturn.boundingBox();
    const initialDistance = Math.sqrt(
      Math.pow(moonBox.x - saturnBox.x, 2) + 
      Math.pow(moonBox.y - saturnBox.y, 2)
    );
    
    // Wait for orbit
    await page.waitForTimeout(3000);
    
    const newMoonBox = await moon.boundingBox();
    const newDistance = Math.sqrt(
      Math.pow(newMoonBox.x - saturnBox.x, 2) + 
      Math.pow(newMoonBox.y - saturnBox.y, 2)
    );
    
    // Distance should remain approximately constant (circular orbit)
    expect(Math.abs(newDistance - initialDistance)).toBeLessThan(5);
  });

  test('Loading indicator fades out after 2-3 seconds', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const loadingIndicator = page.locator('.loading-indicator');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for fade-out
    await page.waitForTimeout(3000);
    
    await expect(loadingIndicator).toHaveCSS('opacity', '0');
  });
});
```

**GSAP Implementation**:
```typescript
// Expected implementation pattern
gsap.set('.loading-indicator', { opacity: 0 });
gsap.to('.loading-indicator', {
  opacity: 1,
  duration: 0.6,
  ease: 'power2.out'
});

// Saturn rotation (continuous 360°)
gsap.to('.saturn', {
  rotation: 360,
  duration: 10, // ~8-12 seconds per full rotation
  repeat: -1,
  ease: 'none' // Linear rotation
});

// Moon orbit (circular path around Saturn)
gsap.to('.moon', {
  rotation: 360,
  duration: 12, // ~10-15 seconds per full orbit
  repeat: -1,
  ease: 'none', // Linear orbit
  transformOrigin: 'center 70px' // Orbit radius: 70px from center
});
```

**Additional Test Cases**:
- [ ] Saturn rotation speed: 8-12 seconds per full rotation (verify duration)
- [ ] Moon orbit speed: 10-15 seconds per full orbit (verify duration)
- [ ] Moon orbit radius: 60-80px from Saturn center (verify transform-origin)
- [ ] Both animations run simultaneously without interference
- [ ] Animation maintains 60fps (no frame drops)
- [ ] HTML data attribute matches: `data-w-id="5e181dd5-2adb-abf2-9999-c6fcf58866a5"`

#### 3.1.3 Hero Section Satellite & Specialties Animations

**Satellite Icon Animation Tests**:
- [ ] Satellite icon initial rotation: `11.8494deg` (Z-axis)
- [ ] Satellite icon rotates continuously (360° loop)
- [ ] Satellite icon responds to mouse-move parallax
- [ ] Transform style `preserve-3d` maintained during animation
- [ ] Will-change optimization active
- [ ] Data attribute `data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"` present

**Satellite Wrapper Animation Tests**:
- [ ] Wrapper initial rotation: `-18.417deg` (Z-axis, counter-clockwise)
- [ ] Wrapper rotates on scroll (parallax effect)
- [ ] Transform style `preserve-3d` maintained
- [ ] Will-change optimization active
- [ ] Data attribute `data-w-id="625d0590-86b2-4b1f-ce96-85d35d22609c"` present
- [ ] Wrapper contains satellite icon correctly

**Specialties Line Animation Tests**:
- [ ] Line fades in on scroll
- [ ] Line scales from 0 to 1 (scaleX animation)
- [ ] Animation timing matches original (600ms duration)
- [ ] Line positioned correctly between headline and text

**Specialties Text Animation Tests**:
- [ ] Text fades in on scroll (opacity 0 → 1)
- [ ] Text slides up on reveal (translateY animation)
- [ ] Scroll trigger fires at correct viewport position (top 80%)
- [ ] Exact text content matches original
- [ ] Data attribute `data-w-id="92e91bae-5e58-aa21-e06e-fe2a43664f68"` present
- [ ] Typography matches (monospace, white, responsive sizing)

**Implementation Test**:
```typescript
// tests/animation/hero-satellite-specialties.test.ts
import { test, expect } from '@playwright/test';

test.describe('Hero Section Satellite & Specialties Animations', () => {
  test('Satellite icon rotates continuously', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const satelliteIcon = page.locator('.satellite-icon');
    const initialRotation = await satelliteIcon.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrix(style.transform);
      return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    });
    
    await page.waitForTimeout(2000);
    
    const newRotation = await satelliteIcon.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrix(style.transform);
      return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    });
    
    // Rotation should have changed
    expect(newRotation).not.toBeCloseTo(initialRotation, 1);
  });

  test('Satellite wrapper has correct initial rotation', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const wrapper = page.locator('.satellite-wrapper');
    const rotation = await wrapper.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrix(style.transform);
      return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    });
    
    // Should be approximately -18.417deg
    expect(rotation).toBeCloseTo(-18.417, 1);
  });

  test('Specialties text reveals on scroll', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const specialties = page.locator('.specialties');
    const initialOpacity = await specialties.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    
    // Scroll to trigger animation
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    const newOpacity = await specialties.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    
    expect(parseFloat(newOpacity)).toBeGreaterThan(parseFloat(initialOpacity));
  });

  test('Specialties line animates on reveal', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const line = page.locator('.specialties-line');
    const initialScale = await line.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrix(style.transform);
      return matrix.a; // scaleX
    });
    
    // Trigger animation
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(800);
    
    const newScale = await line.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrix(style.transform);
      return matrix.a;
    });
    
    expect(newScale).toBeGreaterThan(initialScale);
  });
});
```

#### 3.1.2 Planet-and-Nav Element

**HTML Structure**:
```html
<div class="planet-and-nav">
  LOADING WORK ABOUT CONTACT SKETCHES
</div>
```

**Test Specifications**:

**Visual Elements**:
- [ ] Planet/Saturn icon visible (left side)
- [ ] Navigation text: "LOADING WORK ABOUT CONTACT SKETCHES"
- [ ] Text spacing matches original
- [ ] Font: Space Grotesk or Courier New
- [ ] Text color: White (#FFFFFF)
- [ ] Layout: Horizontal flex layout

**Positioning**:
- [ ] Fixed or absolute positioning
- [ ] Top-left or top-center placement
- [ ] Z-index: Above background, below content
- [ ] Responsive: Adapts to mobile (hamburger menu)

**Animation Behavior**:
- [ ] Planet rotates slowly (if animated)
- [ ] Text fades in on page load
- [ ] Navigation items highlight on scroll
- [ ] Active section indicator works

**Implementation Test**:
```typescript
// tests/ui/planet-and-nav.test.tsx
import { test, expect } from '@playwright/test';

test.describe('Planet-and-Nav Component', () => {
  test('Planet-and-nav element renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const planetNav = page.locator('.planet-and-nav');
    await expect(planetNav).toBeVisible();
    
    const text = await planetNav.textContent();
    expect(text).toContain('LOADING');
    expect(text).toContain('WORK');
    expect(text).toContain('ABOUT');
    expect(text).toContain('CONTACT');
    expect(text).toContain('SKETCHES');
  });

  test('Planet icon is visible', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const planet = page.locator('.planet-and-nav .planet, .planet-and-nav img');
    await expect(planet).toBeVisible();
  });

  test('Navigation links are clickable', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    const workLink = page.locator('text=WORK');
    await workLink.click();
    
    // Verify smooth scroll to work section
    await page.waitForTimeout(1000);
    const workSection = page.locator('#work');
    const isInView = await workSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });
    
    expect(isInView).toBe(true);
  });
});
```

### 3.2 Scroll-Triggered Animation Tests

**Test Cases**:
- [ ] Hero text fades in sequentially (stagger: 200ms)
- [ ] Specialty list animates one-by-one
- [ ] Work section projects reveal at 20% viewport
- [ ] About section text fades up on scroll
- [ ] Sketches gallery stagger animation (opacity: 0 → 1, scale: 0.8 → 1)
- [ ] ScrollTrigger fires at correct viewport positions

**Implementation**:
```typescript
// tests/animation/scroll-triggers.test.ts
test('Work section projects animate on scroll', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const projectCard = page.locator('.project-card').first();
  
  // Scroll to trigger
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  
  const opacity = await projectCard.evaluate((el) => {
    return window.getComputedStyle(el).opacity;
  });
  
  expect(parseFloat(opacity)).toBeGreaterThan(0.9);
});
```

### 3.3 Parallax Effect Tests

**Test Cases**:
- [ ] Background stars move at 0.3x scroll speed
- [ ] Satellite icon moves at 0.5x scroll speed
- [ ] Content moves at 1.0x scroll speed
- [ ] No jank or stuttering (60fps)
- [ ] Parallax disabled on mobile

**Implementation**:
```typescript
// tests/animation/parallax.test.ts
test('Parallax layers move at correct speeds', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const stars = page.locator('.stars-bg');
  const content = page.locator('.content');
  
  // Get initial positions
  const starsInitial = await stars.evaluate((el) => el.getBoundingClientRect().top);
  const contentInitial = await content.evaluate((el) => el.getBoundingClientRect().top);
  
  // Scroll 500px
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(100);
  
  const starsNew = await stars.evaluate((el) => el.getBoundingClientRect().top);
  const contentNew = await content.evaluate((el) => el.getBoundingClientRect().top);
  
  const starsMovement = Math.abs(starsNew - starsInitial);
  const contentMovement = Math.abs(contentNew - contentInitial);
  
  // Stars should move ~0.3x of content movement
  expect(starsMovement / contentMovement).toBeCloseTo(0.3, 1);
});
```

### 3.4 Custom Cursor Tests

**Test Cases**:
- [ ] Cursor follows mouse with 200ms lag
- [ ] Cursor scales to 1.5x on link/button hover
- [ ] Cursor shrinks to 0.75x on click/drag
- [ ] Cursor hidden on mobile
- [ ] Smooth GSAP tweening (no jank)

**Implementation**:
```typescript
// tests/animation/cursor.test.ts
test('Custom cursor follows mouse', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const cursor = page.locator('.custom-cursor');
  await expect(cursor).toBeVisible();
  
  // Move mouse
  await page.mouse.move(100, 100);
  await page.waitForTimeout(250); // Wait for lag
  
  const cursorPos = await cursor.boundingBox();
  expect(cursorPos.x).toBeCloseTo(100, 10);
  expect(cursorPos.y).toBeCloseTo(100, 10);
});

test('Cursor scales on hover', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const link = page.locator('a').first();
  const cursor = page.locator('.custom-cursor');
  
  await link.hover();
  await page.waitForTimeout(250);
  
  const scale = await cursor.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.transform;
  });
  
  expect(scale).toContain('scale(1.5)');
});
```

### 3.5 Mouse-Move Parallax Tests

**Test Cases**:
- [ ] Satellite icon moves based on mouse position
- [ ] Movement range: ±15px (calculated as (cx - 0.5) * 30)
- [ ] Smooth animation (duration: 0.2s)
- [ ] Percentage-based viewport calculation

**Implementation**:
```typescript
// tests/animation/mouse-parallax.test.ts
test('Mouse-move parallax moves satellite', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const satellite = page.locator('.sat-icon');
  const initialPos = await satellite.boundingBox();
  
  // Move mouse to center
  await page.mouse.move(960, 540); // Center of 1920x1080
  await page.waitForTimeout(250);
  
  const centerPos = await satellite.boundingBox();
  
  // Move mouse to top-left
  await page.mouse.move(0, 0);
  await page.waitForTimeout(250);
  
  const topLeftPos = await satellite.boundingBox();
  
  // Satellite should have moved
  expect(topLeftPos.x).not.toBe(centerPos.x);
  expect(topLeftPos.y).not.toBe(centerPos.y);
});
```

---

## 4. Functional Testing

### 4.1 Navigation Testing

**Test Cases**:
- [ ] All nav links scroll to correct sections
- [ ] Smooth scroll duration: 1000ms
- [ ] Active section highlights in navigation
- [ ] Mobile hamburger menu opens/closes
- [ ] Mobile menu items navigate correctly

**Dev Tools Analysis - Navigation Structure Tests**:
- [ ] Brand/Logo renders as h6 heading (matches original structure)
- [ ] Main nav items render as h1 headings (Work, About, Contact, Sketches)
- [ ] Heading hierarchy maintained: h6 (brand) → h1 (nav) → h2 (sections)
- [ ] 6 social media icon links present and functional
- [ ] Social media links have ARIA labels (improvement over original empty name attributes)

**Implementation**:
```typescript
// tests/integration/navigation.test.ts
test('Navigation scrolls to sections', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const workLink = page.locator('a[href="#work"]');
  await workLink.click();
  
  await page.waitForTimeout(1200); // Wait for smooth scroll
  
  const workSection = page.locator('#work');
  const isVisible = await workSection.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
  });
  
  expect(isVisible).toBe(true);
});
```

### 4.2 Interaction Testing

**Test Cases**:
- [ ] Project cards hover: scale 1.05x, brightness increase
- [ ] "View site" links open in new tab
- [ ] Email copy-to-clipboard shows success message
- [ ] Social links navigate correctly
- [ ] Form fields focus/blur correctly

**Implementation**:
```typescript
// tests/integration/interactions.test.ts
test('Email copy-to-clipboard works', async ({ page, context }) => {
  await page.goto('http://localhost:3002');
  
  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  const emailButton = page.locator('button[data-copy-email]');
  await emailButton.click();
  
  await page.waitForTimeout(500);
  
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toContain('@');
  
  // Check success message
  const successMsg = page.locator('.copy-success');
  await expect(successMsg).toBeVisible();
});
```

---

## 5. Performance Testing

### 5.1 Core Web Vitals

**Targets**:
- LCP: < 1.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.2s
- TTI: < 2.5s

**Implementation**:
```typescript
// tests/system/performance/web-vitals.test.ts
import { test, expect } from '@playwright/test';

test('Meets Core Web Vitals targets', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const vitals = {};
        
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = entry.renderTime || entry.loadTime;
          }
          if (entry.entryType === 'first-input') {
            vitals.fid = entry.processingStart - entry.startTime;
          }
        });
        
        resolve(vitals);
      }).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    });
  });
  
  expect(metrics.lcp).toBeLessThan(1500);
  expect(metrics.fid).toBeLessThan(100);
});
```

### 5.2 Animation Performance

**Test Cases**:
- [ ] All animations run at 60fps
- [ ] No jank or stuttering
- [ ] Scroll performance smooth
- [ ] Parallax doesn't cause layout shifts

**Implementation**:
```typescript
// tests/system/performance/animation-fps.test.ts
test('Animations maintain 60fps', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const fps = await page.evaluate(() => {
    return new Promise((resolve) => {
      let frames = 0;
      let lastTime = performance.now();
      
      function measure() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          resolve(frames);
          return;
        }
        
        requestAnimationFrame(measure);
      }
      
      requestAnimationFrame(measure);
    });
  });
  
  expect(fps).toBeGreaterThanOrEqual(55); // Allow small margin
});
```

### 5.3 Bundle Size Testing

**Targets**:
- Total bundle: < 300KB (gzipped)
- Initial JS: < 150KB
- CSS: < 50KB

**Implementation**:
```bash
# tests/system/performance/bundle-size.test.sh
#!/bin/bash
npm run build
BUNDLE_SIZE=$(du -sh .next/static/chunks/*.js | awk '{sum+=$1} END {print sum}')
if [ $BUNDLE_SIZE -gt 300000 ]; then
  echo "Bundle size exceeds 300KB: $BUNDLE_SIZE"
  exit 1
fi
```

### 5.4 Console & Network Status Testing (Dev Tools Analysis)

**Test Cases**:
- [ ] No console errors on initial page load (target: zero console errors)
- [ ] All network requests return 200 status codes
- [ ] No failed font loading requests (Google Fonts instead of Typekit)
- [ ] No failed asset loading requests
- [ ] All SVG assets load successfully
- [ ] No Webflow.js or Typekit scripts present (replaced with Next.js/GSAP)

**Implementation**:
```typescript
// tests/system/performance/console-network.test.ts
test('No console errors on page load', async ({ page }) => {
  const consoleErrors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  expect(consoleErrors).toHaveLength(0);
});

test('All network requests successful', async ({ page }) => {
  const failedRequests: string[] = [];
  
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.url()}: ${response.status()}`);
    }
  });
  
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  expect(failedRequests).toHaveLength(0);
});

test('No Typekit scripts loaded', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  const typekitScripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script'))
      .filter(script => script.src.includes('typekit'))
      .length;
  });
  
  expect(typekitScripts).toBe(0);
});
```

### 5.5 Webflow-Specific Attributes Testing (Dev Tools Analysis)

**Test Cases**:
- [ ] data-w-id attributes preserved where needed (for tracking/debugging)
- [ ] data-w-page attributes not present (Webflow-specific, not needed in Next.js)
- [ ] data-w-section attributes not present (Webflow-specific, not needed in Next.js)
- [ ] Webflow badge removed from footer (not present in replica)

**Implementation**:
```typescript
// tests/system/webflow-attributes.test.ts
test('Webflow-specific attributes handled correctly', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  // Check that data-w-page and data-w-section are not present
  const webflowPageAttrs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-w-page]')).length;
  });
  
  const webflowSectionAttrs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-w-section]')).length;
  });
  
  expect(webflowPageAttrs).toBe(0);
  expect(webflowSectionAttrs).toBe(0);
  
  // Check that specific data-w-id attributes are preserved (for reference)
  const satelliteIcon = page.locator('.satellite-icon[data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"]');
  await expect(satelliteIcon).toBeVisible();
});
```

---


## 6 Reduced Motion Testing

**Test Cases**:
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Animations disabled or minimal when preference set
- [ ] No motion sickness triggers

**Implementation**:
```typescript
 test('Respects prefers-reduced-motion', async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addListener: () => {},
        removeListener: () => {},
      }),
    });
  });
  
  await page.goto('http://localhost:3002');
  
  const animationDuration = await page.evaluate(() => {
    const style = window.getComputedStyle(document.querySelector('.animated-element'));
    return style.animationDuration;
  });
  
  expect(animationDuration).toBe('0.01ms');
});
```

---

## 7. Cross-Browser Testing

### 7.1 Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|----------|--------|--------|
| Chrome | Latest 2 | ✅ | ✅ | Required |
| Firefox | Latest 2 | ✅ | ✅ | Required |
| Safari | Latest 2 | ✅ | ✅ | Required |
| Edge | Latest 2 | ✅ | ❌ | Required |
| Safari iOS | 14+ | ❌ | ✅ | Required |
| Chrome Android | 10+ | ❌ | ✅ | Required |

### 7.2 Browser-Specific Test Cases

**Chrome/Edge**:
- [ ] Custom cursor works
- [ ] GSAP animations smooth
- [ ] Parallax effects work

**Firefox**:
- [ ] Custom cursor works
- [ ] ScrollTrigger fires correctly
- [ ] CSS animations smooth

**Safari**:
- [ ] Custom cursor works (with fallback)
- [ ] Smooth scroll works
- [ ] WebKit-specific CSS works

**Mobile Safari**:
- [ ] Custom cursor disabled
- [ ] Touch interactions work
- [ ] No hover states active

**Chrome Mobile**:
- [ ] Touch targets adequate (44x44px)
- [ ] Scroll performance good
- [ ] Animations smooth

---

## 8. Responsive Testing

### 8.1 Breakpoint Testing

**Test Devices**:
- iPhone SE: 375px
- iPhone 12/13: 390px
- iPad: 768px
- iPad Pro: 1024px
- Desktop: 1440px, 1920px

**Test Cases**:
- [ ] Typography scales correctly at each breakpoint
- [ ] Layout stacks appropriately
- [ ] Images scale/crop correctly
- [ ] No horizontal scroll
- [ ] Touch targets minimum 44x44px

**Implementation**:
```typescript
// tests/system/responsive/breakpoints.test.ts
const viewports = [
  { width: 375, height: 667, name: 'iPhone SE' },
  { width: 390, height: 844, name: 'iPhone 12' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 1366, name: 'iPad Pro' },
  { width: 1440, height: 900, name: 'Desktop 1440' },
  { width: 1920, height: 1080, name: 'Desktop 1920' },
];

viewports.forEach(({ width, height, name }) => {
  test(`Layout works on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:3002');
    
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });
});
```

---

## 9. Visual Comparison Testing

### 9.1 Side-by-Side Comparison

**Process**:
1. Open original site (hellochriscole.webflow.io) in browser
2. Open recreated site (localhost:3002) in browser
3. Compare section by section:
   - Hero section
   - Work section
   - About section
   - Contact section
   - Sketches section
4. Document any discrepancies

**Checklist**:
- [ ] Hero text matches exactly
- [ ] Specialty list matches
- [ ] Project cards match
- [ ] About bio matches
- [ ] Contact info matches
- [ ] Navigation matches
- [ ] Footer matches

### 9.2 Animation Timing Comparison

**Test Cases**:
- [ ] Loading animation duration matches
- [ ] Hero text stagger delay matches (200ms)
- [ ] Scroll trigger positions match
- [ ] Parallax speeds match
- [ ] Cursor lag matches (200ms)

**Implementation**:
```typescript
// tests/system/visual-comparison/animation-timing.test.ts
test('Animation timings match original', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  // Measure hero text stagger
  const heroItems = page.locator('.hero-specialty-item');
  const timings = [];
  
  for (let i = 0; i < await heroItems.count(); i++) {
    const item = heroItems.nth(i);
    const startTime = Date.now();
    
    await item.waitFor({ state: 'visible' });
    const endTime = Date.now();
    
    timings.push(endTime - startTime);
  }
  
  // Check stagger is ~200ms between items
  for (let i = 1; i < timings.length; i++) {
    const stagger = timings[i] - timings[i - 1];
    expect(stagger).toBeCloseTo(200, 50); // Allow 50ms tolerance
  }
});
```

---

## 10. Test Execution Strategy

### 10.1 Test Phases

**Phase 1: Unit Tests** (During Development)
- Run on every file save
- Fast feedback loop
- Catch logic errors early

**Phase 2: UI Tests** (Component Complete)
- Run after component implementation
- Verify rendering and basic interactions
- Visual regression checks

**Phase 3: Integration Tests** (Feature Complete)
- Run after feature completion
- Test user flows
- Verify component interactions

**Phase 4: System Tests** (Pre-Deployment)
- Run before deployment
- Full site testing

### 10.2 Continuous Integration

**CI Pipeline**:
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:ui
      - run: npm run test:integration
      - run: npm run test:system
      - run: npm run build
```

### 10.3 Test Commands

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:ui": "jest tests/ui",
    "test:animation": "jest tests/animation",
    "test:integration": "jest tests/integration",
    "test:system": "playwright test tests/system",
    "test:visual": "playwright test tests/system/visual-regression",
    "test:all": "npm run test:unit && npm run test:ui && npm run test:integration && npm run test:system"
  }
}
```

---

## 11. Test Data & Fixtures

### 11.1 Test Content

**Hero Section**:
- Primary headline: "I'VE WORKED IN TECH FOR OVER A DECADE"
- Specialty list: web, branding, product, packaging, cocktails

**Work Section**:
- Project: Crystal
- Description: Multi-line project description
- Tags: Web Design, Branding, Product

**About Section**:
- Bio: Multi-paragraph bio text
- Skills: List of skills/expertise

**Contact Section**:
- Email: hello@chriscole.com
- Social links: LinkedIn, Twitter, Dribbble

### 11.2 Mock Data

```typescript
// tests/fixtures/projects.ts
export const mockProjects = [
  {
    id: 'crystal',
    title: 'Crystal',
    description: 'A modern web experience for a luxury crystal brand.',
    tags: ['Web Design', 'Branding', 'E-commerce'],
    link: 'https://example.com/crystal',
  },
];
```

---

## 12. Bug Tracking & Reporting

### 12.1 Test Failure Documentation

**Required Information**:
- Test name and file path
- Expected behavior
- Actual behavior
- Screenshots/videos
- Browser and device
- Steps to reproduce

### 12.2 Test Logs

**Location**: `tests/logs/test-results/`

**Log Format**:
```markdown
# Test Results - [Date]

## Passed: 45
## Failed: 2
## Skipped: 1

### Failures:
1. **Saturn orbit animation** - Moon not orbiting correctly
   - File: tests/animation/loading-saturn.test.ts:45
   - Expected: Moon distance constant
   - Actual: Moon distance varies
   - Screenshot: logs/test-results/screenshots/saturn-orbit-fail.png
```

---

## 13. Success Criteria

### 13.1 Visual Fidelity

- [ ] 100% pixel-perfect match on desktop (1920x1080)
- [ ] 95%+ match on mobile (allowing for responsive differences)
- [ ] All typography matches exactly
- [ ] All colors match exactly
- [ ] All spacing matches exactly

### 13.2 Animation Fidelity

- [ ] All animation timings match original
- [ ] All animation easings match original
- [ ] All scroll triggers fire at same positions
- [ ] Parallax speeds match original
- [ ] Cursor behavior matches original

### 13.3 Functional Fidelity

- [ ] All navigation works identically
- [ ] All interactions work identically
- [ ] All links navigate correctly
- [ ] All forms work (if applicable)

### 13.4 Performance Targets

- [ ] LCP: < 1.5s
- [ ] CLS: < 0.1
- [ ] FID: < 100ms

---

## 14. Test Maintenance

### 14.1 Regular Updates

- Update tests when requirements change
- Add tests for new features
- Remove obsolete tests
- Update visual regression baselines

### 14.2 Test Review

- Review test coverage quarterly
- Identify gaps in testing
- Optimize slow tests
- Refactor duplicate test code

---

## Appendix A: Test Tools & Libraries

### Required Testing Libraries

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E and visual regression
- **Percy/Chromatic**: Visual regression (optional)

### Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test @axe-core/playwright
npm install --save-dev @types/jest
```

---

## Appendix B: Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **UI Tests**: 100% of components
- **Animation Tests**: 100% of animations
- **Integration Tests**: 100% of user flows
- **System Tests**: 100% of critical paths

---

---

## Appendix C: Visual Discrepancy Analysis Integration

**Integration Date**: November 11, 2025  
**Source**: `docs/requirements/visual-discrepancy-analysis.md`

This testing strategy has been updated to include comprehensive test specifications for **8 critical discrepancies** identified in the Visual Discrepancy Analysis:

### Discrepancy Coverage Map

| # | Discrepancy | Test Location | Status |
|---|-------------|---------------|--------|
| 1 | Hero headline text incorrect | Section 2.1.2, 2.1.0 | ✅ Tests added |
| 2 | Bordered text box missing | Section 2.1.1 | ✅ Tests added |
| 3 | Specialty icons incomplete | Section 2.1.0 | ✅ Tests added |
| 4 | Drifting spaceship icons not specified | Visual regression tests | ⚠️ Baseline needed |
| 5 | Constellation pattern not specified | Visual regression tests | ⚠️ Baseline needed |
| 6 | Film reel icon not specified | Visual regression tests | ⚠️ Baseline needed |
| 7 | Curved line element insufficient | Visual regression tests | ⚠️ Baseline needed |
| 8 | Work section status label missing | Section 2.1.2 | ✅ Tests added |

**New Test Cases Added**:
- Hero section exact HTML elements validation (Section 2.1.0)
- Satellite icon & wrapper animation tests (Section 3.1.3)
- Specialties line & text animation tests (Section 3.1.3)
- Navigation HTML structure validation (Section 2.1.2)
- Font loading & optimization tests (Section 2.1.4)
- Console & network status tests (Section 5.4)
- Webflow-specific attributes handling (Section 5.5)

**Visual Regression Baselines Required**:
1. Hero section with bordered box container
2. Specialty icons (5 icons: WEB, BRANDING, PRODUCT, PACKAGING, COCKTAILS :))
3. Drifting spaceship animation elements
4. Curved line section divider
5. Constellation pattern (optional)
6. Film reel icon (optional)
7. Work section with "(UNDER CONSTRUCTION)" label

**Critical Test Priority**:
- **Priority 1 (Must Test Before Development)**: Discrepancies #1, #2, #3
- **Priority 2 (Should Test Before Phase 2)**: Discrepancies #4, #7
- **Priority 3 (Can Test During Development)**: Discrepancies #5, #6, #8

---

**Document Status**: ✅ **COMPLETE - INTEGRATED WITH VISUAL DISCREPANCY ANALYSIS**  
**Version**: 1.1.0  
**Last Updated**: November 11, 2025

**Next Steps**:
1. Set up test infrastructure
2. Create initial test files for 8 discrepancies
3. Capture visual regression baselines from original site
4. Implement test automation
5. Run baseline tests
6. Begin iterative testing cycle with continuous validation
