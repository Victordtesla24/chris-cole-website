# System Architecture Document
# Chris Cole Portfolio Website - Exact Replica

**Project**: Chris Cole Portfolio Website Recreation  
**Original Site**: https://hellochriscole.webflow.io  
**Target Platform**: Next.js 14 + TypeScript + Tailwind CSS  
**Deployment**: Render.com  
**Version**: 1.0.0  
**Date**: November 11, 2025  
**Status**: Architecture Specification Complete

---

## Executive Summary

This document defines the complete system architecture for building an **exact pixel-perfect replica** of Chris Cole's portfolio website. The architecture is designed as a **static site** using Next.js 14 App Router with client-side rendering, optimized for performance and visual fidelity to the original Webflow site.

**Architecture Type**: Static Site Generation (SSG) with Client-Side Hydration  
**Deployment Model**: Serverless/Static Hosting (Render.com)  
**API Architecture**: None (Static Content Only)  
**Data Flow**: Client-Side Only (No Backend Services)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Client/Server Architecture](#3-clientserver-architecture)
4. [System Flow Diagrams](#4-system-flow-diagrams)
5. [Component Architecture](#5-component-architecture)
6. [Animation System Architecture](#6-animation-system-architecture)
7. [Asset Management](#7-asset-management)
8. [Performance Architecture](#8-performance-architecture)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Security Architecture](#10-security-architecture)
11. [Monitoring & Observability](#11-monitoring--observability)

---

## 1. System Overview

### 1.1 Architecture Pattern

**Pattern**: Static Site Generation (SSG) with Client-Side Hydration

```
┌─────────────────────────────────────────────────────────────┐
│                    STATIC SITE ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Browser    │────────▶│  Render.com  │                  │
│  │   (Client)   │◀────────│  (Static)    │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                        │                          │
│         │                        │                          │
│         ▼                        ▼                          │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   React      │         │  Next.js     │                  │
│  │   Hydration  │         │  Static HTML │                  │
│  └──────────────┘         └──────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────────────┐           │
│  │         Client-Side Animations (GSAP)        │           │
│  │         Client-Side Interactions (React)     │           │
│  │         No Backend/API Required              │           │
│  └──────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Key Architectural Decisions

1. **Static Site Generation**: All pages pre-rendered at build time
2. **No Backend Services**: Pure client-side application
3. **No API Endpoints**: All content is static
4. **Client-Side Hydration**: React hydrates static HTML for interactivity
5. **CDN Delivery**: Static assets served via Render.com CDN
6. **Client-Side Animations**: GSAP/Framer Motion run entirely in browser

### 1.3 System Boundaries

**In Scope**:
- Static HTML/CSS/JS generation
- Client-side rendering and hydration
- Client-side animations and interactions
- Static asset serving
- SEO optimization (meta tags, structured data)

**Out of Scope**:
- Backend API services
- Database systems
- User authentication
- Content management system (CMS)
- Server-side data fetching
- Real-time features

---

## 2. Technology Stack

### 2.1 Core Framework Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK LAYERS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 7: Deployment                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Render.com (Static Hosting)                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 6: Build & Compilation                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Next.js 14 (App Router) | TypeScript 5.3+           │    │
│  │ PostCSS | Tailwind CSS 3.4+                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 5: UI Framework                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ React 18.2+ | React DOM                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 4: Animation Libraries                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ GSAP 3.12+ (ScrollTrigger) | Framer Motion 11+      │    │
│  │ @studio-freight/lenis 1.0+ (Smooth Scroll)          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 3: Styling                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Tailwind CSS 3.4+ | Custom CSS                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 2: Utilities                                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ react-intersection-observer | react-use             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 1: Runtime                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Node.js 18+ (Build) | Browser (Runtime)             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack Details

**Framework & Language**:
- **Next.js 14** (App Router) - Static site generation, routing, optimization
- **TypeScript 5.3+** - Type safety, developer experience
- **React 18.2+** - UI component library, client-side hydration

**Styling**:
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization
- **Custom CSS** - Complex animations, global styles

**Animation Libraries**:
- **GSAP 3.12+** - Professional animation platform
  - ScrollTrigger plugin (scroll-based animations)
  - Core animations (timelines, tweens)
- **Framer Motion 11+** - React animation library
  - Component animations
  - AnimatePresence for enter/exit
- **@studio-freight/lenis 1.0+** - Smooth scrolling library

**Additional Libraries**:
- **react-intersection-observer** - Scroll triggers (alternative)
- **react-use** - Custom hooks for utility functions

**Build Tools**:
- **Next.js Build System** - Webpack-based bundling
- **TypeScript Compiler** - Type checking and compilation
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

**Port Binding/Configuration(DEV Environment)**
- **Backend Server/API Endpoints** Port 3001 - by default
- **Frontend Server/React Server** Port 3002 - by default

**Deployment**:
- **Render.com** - Static site hosting
- **Node.js 18+** - Build runtime
- **Git** - Version control and deployment trigger

---

## 3. Client/Server Architecture

### 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Browser (User)                        │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  React Application (Hydrated)                     │   │   │
│  │  │  ┌─────────────────────────────────────────────┐  │   │   │
│  │  │  │  Layout Components                          │  │   │   │
│  │  │  │  - Navbar                                   │  │   │   │
│  │  │  │  - Footer                                   │  │   │   │
│  │  │  │  - SmoothScroll                             │  │   │   │
│  │  │  └─────────────────────────────────────────────┘  │   │   │ 
│  │  │  ┌──────────────────────────────────────────────┐ │   │   │ 
│  │  │  │  Section Components                          │ │   │   │
│  │  │  │  - HeroSection                               │ │   │   │
│  │  │  │  - WorkSection                               │ │   │   │
│  │  │  │  - AboutSection                              │ │   │   │
│  │  │  │  - ContactSection                            │ │   │   │
│  │  │  │  - SketchesSection                           │ │   │   │
│  │  │  └──────────────────────────────────────────────┘ │   │   │  
│  │  │  ┌──────────────────────────────────────────────┐ │   │   │ 
│  │  │  │  Animation Components                        │ │   │   │
│  │  │  │  - LoadingOverlay (Saturn & Moon)            │ │   │   │
│  │  │  │  - CursorTrail                               │ │   │   │
│  │  │  │  - ParallaxStars                             │ │   │   │
│  │  │  │  - DriftingSpaceships                        │ │   │   │
│  │  │  │  - MouseParallax                             │ │   │   │
│  │  │  └──────────────────────────────────────────────┘ │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Animation Engine (GSAP/Framer Motion)            │   │   │
│  │  │  - Scroll-triggered animations                    │   │   │
│  │  │  - Mouse-move parallax                            │   │   │
│  │  │  - Custom cursor interactions                     │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ Static Assets
                              │ (HTML, CSS, JS, SVG, Images)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Render.com (Static Hosting)                │    │
│  │  ┌───────────────────────────────────────────────────┐  │    │
│  │  │  CDN Edge Servers (Global Distribution)           │  │    │
│  │  │  - Static HTML files                              │  │    │
│  │  │  - CSS bundles                                    │  │    │
│  │  │  - JavaScript bundles                             │  │    │
│  │  │  - SVG assets                                     │  │    │
│  │  │  - Image assets                                   │  │    │
│  │  │  - Font files (Google Fonts)                      │  │    │
│  │  └───────────────────────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────────────────────┐  │    │
│  │  │  Build Server (On Deploy)                         │  │    │
│  │  │  - npm install                                    │  │    │
│  │  │  - npm run build (Next.js SSG)                    │  │    │
│  │  │  - Generate static HTML/CSS/JS                    │  │    │
│  │  │  - Optimize assets                                │  │    │
│  │  └───────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Font Loading
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Google Fonts (fonts.googleapis.com)                    │    │
│  │  - Space Grotesk font family                            │    │
│  │  - Asynchronous loading                                 │    │
│  │  - font-display: swap                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Request/Response Flow

**Initial Page Load Flow**:

```
1. User Request
   │
   ▼
2. Render.com CDN
   │
   ├─▶ Serves static HTML (pre-rendered)
   ├─▶ Serves CSS bundle (Tailwind + Custom)
   ├─▶ Serves JavaScript bundle (React + GSAP + Framer Motion)
   └─▶ Serves static assets (SVG, images)
   │
   ▼
3. Browser Receives Assets
   │
   ├─▶ Parses HTML (immediate render)
   ├─▶ Loads CSS (styles applied)
   ├─▶ Loads JavaScript (React hydration)
   └─▶ Loads fonts (Google Fonts - async)
   │
   ▼
4. Client-Side Hydration
   │
   ├─▶ React hydrates static HTML
   ├─▶ GSAP initializes animations
   ├─▶ Lenis initializes smooth scroll
   └─▶ Event listeners attached
   │
   ▼
5. Interactive Application
   │
   ├─▶ Loading overlay plays (Saturn animation)
   ├─▶ Hero section animates in
   ├─▶ Scroll triggers activate
   └─▶ User interactions enabled
```

### 3.3 Static Site Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              BUILD TIME (Next.js SSG)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Source Code                                             │
│     ┌─────────────────────────────────────────────────┐     │
│     │  - React Components (.tsx)                      │     │
│     │  - TypeScript Types (.ts)                       │     │
│     │  - Styles (Tailwind + Custom CSS)               │     │
│     │  - Static Assets (SVG, images)                  │     │
│     └─────────────────────────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│  2. TypeScript Compilation                                  │
│     ┌─────────────────────────────────────────────────┐     │
│     │  - Type checking                                │     │
│     │  - Compilation to JavaScript                    │     │
│     └─────────────────────────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│  3. Next.js Build Process                                   │
│     ┌─────────────────────────────────────────────────┐     │
│     │  - App Router compilation                       │     │
│     │  - Static page generation                       │     │
│     │  - CSS processing (PostCSS + Tailwind)          │     │
│     │  - Asset optimization                           │     │
│     │  - Code splitting                               │     │
│     │  - Tree-shaking (GSAP optimization)             │     │
│     └─────────────────────────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│  4. Output (Static Files)                                   │
│     ┌─────────────────────────────────────────────────┐     │
│     │  .next/static/                                  │     │
│     │    ├── chunks/ (JavaScript bundles)             │     │
│     │    ├── css/ (CSS bundles)                       │     │
│     │    └── media/ (Optimized images)                │     │
│     │                                                 │     │
│     │  .next/server/                                  │     │
│     │    └── app/ (Server components)                 │     │
│     │                                                 │     │
│     │  public/ (Static assets)                        │     │
│     │    ├── svg/ (SVG icons)                         │     │
│     │    └── images/ (Image assets)                   │     │
│     └─────────────────────────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│  5. Deployment to Render.com                                │
│     ┌─────────────────────────────────────────────────┐     │
│     │  - Upload static files                          │     │
│     │  - CDN distribution                             │     │
│     │  - Health check activation                      │     │
│     └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. System Flow Diagrams

### 4.1 Page Load Sequence Diagram

```
User Browser          Render.com CDN        Google Fonts        Animation Engine
     │                       │                     │                    │
     │─── HTTP GET ─────────▶│                     │                    │
     │                       │                     │                    │
     │◀── HTML (Static) ─────│                     │                    │
     │                       │                     │                    │
     │─── Request CSS ──────▶│                     │                    │
     │◀── CSS Bundle ────────│                     │                    │
     │                       │                     │                    │
     │─── Request JS ───────▶│                     │                    │
     │◀── JS Bundle ─────────│                     │                    │
     │                       │                     │                    │
     │─── Request Fonts ──────────────────────────▶│                    │
     │◀── Font Files ──────────────────────────────│                    │
     │                       │                     │                    │
     │  [HTML Rendered]      │                     │                    │
     │  [CSS Applied]        │                     │                    │
     │                       │                     │                    │
     │  [React Hydration]    │                     │                    │
     │                       │                     │                    │
     │  [GSAP Init] ───────────────────────────────────────────────────▶│
     │                       │                     │                    │
     │  [Lenis Init]         │                     │                    │
     │                       │                     │                    │
     │  [Loading Overlay]    │                     │                    │
     │  [Saturn Animation]   │                     │                    │
     │                       │                     │                    │
     │  [Hero Section]       │                     │                    │
     │  [Scroll Triggers]    │                     │                    │
     │                       │                     │                    │
     │  [Interactive]        │                     │                    │
```

### 4.2 User Interaction Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER INTERACTION FLOW                     │
├──────────────────────────────────────────────────────────────┤
│                      │                                       │
│  User Action         │  System Response                      │
│  ────────────────────┼───────────────────────────────────────│
│                      │                                       │
│  Page Load           │  1. Static HTML rendered              │
│                      │  2. CSS applied                       │
│                      │  3. JavaScript loaded                 │
│                      │  4. React hydrates                    │
│                      │  5. Loading overlay plays             │
│                      │  6. Hero section animates in          │
│                      │                                       │
│  Scroll Down         │  1. Lenis smooth scroll activated     │
│                      │  2. ScrollTrigger detects position    │
│                      │  3. Parallax layers move              │
│                      │  4. Section reveals animate           │
│                      │  5. Background stars parallax         │
│                      │                                       │
│  Mouse Move          │  1. CursorTrail follows mouse         │
│                      │  2. MouseParallax calculates position │
│                      │  3. Satellite icons move              │
│                      │  4. Background elements shift         │
│                      │                                       │
│  Hover Link/Button   │  1. Cursor scales to 1.5x             │
│                      │  2. Link underline animates           │
│                      │  3. Hover effect applied              │
│                      │                                       │
│  Click Navigation    │  1. Smooth scroll to section          │
│                      │  2. Active section highlighted        │
│                      │  3. Section animates into view        │
│                      │                                       │
│  Click Email Copy    │  1. Clipboard API called              │
│                      │  2. Success animation plays           │
│                      │  3. Toast message displayed           │
│                      │                                       │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Animation System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  ANIMATION SYSTEM FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Initialization Phase:                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. GSAP.registerPlugin(ScrollTrigger)              │    │
│  │  2. Lenis smooth scroll initialized                 │    │
│  │  3. Event listeners attached                        │    │
│  │  4. Animation refs created                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Loading Animation:                                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. LoadingOverlay component mounts                 │    │
│  │  2. Saturn rotation animation starts                │    │
│  │  3. Moon orbit animation starts                     │    │
│  │  4. Fade-in animation (500-800ms)                   │    │
│  │  5. Display for 2-3 seconds                         │    │
│  │  6. Fade-out animation (500-800ms)                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Hero Section Animation:                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. Headline fades in (stagger: 200ms)              │    │
│  │  2. Specialties line animates (scaleX)              │    │
│  │  3. Specialty icons stagger in                      │    │
│  │  4. Satellite icon rotates continuously             │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Scroll-Triggered Animations:                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. ScrollTrigger detects viewport position         │    │
│  │  2. Section elements animate when 20% visible       │    │
│  │  3. Parallax layers move at different speeds        │    │
│  │  4. Background stars drift (0.3x scroll speed)      │    │
│  │  5. Satellite icons drift (0.5x scroll speed)       │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Continuous Animations:                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. Stars twinkle (random delays)                   │    │
│  │  2. Spaceships drift (80-120s duration)             │    │
│  │  3. Cursor follows mouse (200ms lag)                │    │
│  │  4. Mouse-move parallax updates                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Root Layout (app/layout.tsx)                                │
│  └─▶ SmoothScroll                                            │
│      └─▶ CursorTrail                                         │
│          └─▶ Page Component (app/page.tsx)                   │
│              ├─▶ LoadingOverlay                              │
│              ├─▶ ParallaxStars                               │
│              ├─▶ Navbar                                      │
│              ├─▶ HeroSection                                 │
│              │   ├─▶ SatelliteWrapper                        │
│              │   │   └─▶ SatelliteIcon                       │
│              │   ├─▶ BorderedContainer                       │
│              │   │   ├─▶ Headline                            │
│              │   │   ├─▶ SpecialtiesLine                     │
│              │   │   └─▶ SpecialtiesList                     │
│              │   │       └─▶ SpecialtyIcon (×5)              │
│              │   └─▶ SectionDivider (Curved Line)            │
│              ├─▶ WorkSection                                 │
│              │   ├─▶ SectionHeading                          │
│              │   ├─▶ StatusLabel ("UNDER CONSTRUCTION")      │
│              │   └─▶ ProjectCard (×N)                        │
│              ├─▶ AboutSection                                │
│              │   ├─▶ SectionHeading                          │
│              │   └─▶ BioContent                              │
│              ├─▶ ContactSection                              │
│              │   ├─▶ SectionHeading                          │
│              │   ├─▶ EmailCopyButton                         │
│              │   └─▶ SocialLinks                             │
│              ├─▶ SketchesSection                             │
│              │   ├─▶ SectionHeading                          │
│              │   └─▶ SketchGallery                           │
│              │       └─▶ SketchThumbnail (×N)                │
│              ├─▶ DriftingSpaceships                          │
│              ├─▶ Constellation (Optional)                    │
│              ├─▶ FilmReelIcon (Optional)                     │
│              └─▶ Footer                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Component Communication

**Data Flow**: Unidirectional (Parent → Child)

```
┌─────────────────────────────────────────────────────────────┐
│              COMPONENT DATA FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Static Content (No Props)                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - All content is static (hardcoded)                │    │
│  │  - No props passed between components               │    │
│  │  - No state management required                     │    │
│  │  - No data fetching                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Event Communication (Client-Side Only)                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Scroll events → ScrollTrigger                    │    │
│  │  - Mouse events → CursorTrail, MouseParallax        │    │
│  │  - Click events → Navigation, Email Copy            │    │
│  │  - Hover events → Cursor scale, Link effects        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Animation Coordination                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - GSAP Timeline coordination                       │    │
│  │  - ScrollTrigger shared instances                   │    │
│  │  - Animation refs (useRef)                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Animation System Architecture

### 6.1 Animation Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              ANIMATION SYSTEM ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Animation Libraries                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  GSAP 3.12+                                         │    │
│  │  ├─ ScrollTrigger (scroll-based)                    │    │
│  │  ├─ Core Animations (timelines, tweens)             │    │
│  │  └─ Plugin Registration (per file)                  │    │
│  │                                                     │    │
│  │  Framer Motion 11+                                  │    │
│  │  ├─ Component Animations                            │    │
│  │  └─ AnimatePresence (enter/exit)                    │    │
│  │                                                     │    │
│  │  Lenis 1.0+                                         │    │
│  │  └─ Smooth Scrolling                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Layer 2: Animation Hooks                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  useScrollReveal()                                  │    │
│  │  useParallax()                                      │    │
│  │  useCursor()                                        │    │
│  │  useMouseParallax()                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Layer 3: Animation Components                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  LoadingOverlay (Saturn & Moon)                     │    │
│  │  CursorTrail (Custom Cursor)                        │    │
│  │  ParallaxStars (Background)                         │    │
│  │  DriftingSpaceships (Decorative)                    │    │
│  │  MouseParallax (3D Hover Effect)                    │    │
│  │  ScrollReveal (Section Animations)                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Layer 4: Animation Targets                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - DOM Elements (refs)                              │    │
│  │  - CSS Properties (transform, opacity)              │    │
│  │  - SVG Elements                                     │    │
│  │  - Custom Cursor Element                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Animation Types & Triggers

```
┌─────────────────────────────────────────────────────────────┐
│              ANIMATION TYPES & TRIGGERS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Type 1: Page Load Animations                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Trigger: Component mount                           │    │
│  │  Library: GSAP                                      │    │
│  │  Examples:                                          │    │
│  │    - Loading overlay (Saturn & Moon)                │    │
│  │    - Hero section fade-in                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Type 2: Scroll-Triggered Animations                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Trigger: ScrollTrigger (viewport position)         │    │
│  │  Library: GSAP ScrollTrigger                        │    │
│  │  Examples:                                          │    │
│  │    - Section reveals (fade-up)                      │    │
│  │    - Parallax scrolling                             │    │
│  │    - Staggered sketch gallery                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Type 3: Mouse-Triggered Animations                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Trigger: Mouse events (move, hover, click)         │    │
│  │  Library: GSAP                                      │    │
│  │  Examples:                                          │    │
│  │    - Custom cursor trail                            │    │
│  │    - Mouse-move parallax                            │    │
│  │    - Link hover effects                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Type 4: Continuous Animations                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Trigger: Component mount (infinite loop)           │    │
│  │  Library: GSAP / CSS Animations                     │    │
│  │  Examples:                                          │    │
│  │    - Twinkling stars                                │    │
│  │    - Drifting spaceships                            │    │
│  │    - Saturn rotation                                │    │
│  │    - Moon orbit                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Type 5: Interaction Animations                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Trigger: User interaction (click, hover)           │    │
│  │  Library: GSAP / Framer Motion                      │    │
│  │  Examples:                                          │    │
│  │    - Button press effect                            │    │
│  │    - Email copy success                             │    │
│  │    - Mobile menu toggle                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Asset Management

### 7.1 Asset Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ASSET ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Static Assets (public/)                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  public/                                            │    │
│  │  ├── svg/                                           │    │
│  │  │   ├── satellite.svg                              │    │
│  │  │   ├── icon-web.svg                               │    │
│  │  │   ├── icon-branding.svg                          │    │
│  │  │   ├── icon-product.svg                           │    │
│  │  │   ├── icon-packaging.svg                         │    │
│  │  │   ├── icon-cocktails.svg                         │    │
│  │  │   ├── spaceship.svg                              │    │
│  │  │   ├── film-reel.svg (optional)                   │    │
│  │  │   ├── constellation.svg (optional)               │    │
│  │  │   └── icons/ (social media, arrows)              │    │
│  │  │                                                  │    │
│  │  ├── images/                                        │    │
│  │  │   ├── projects/ (project thumbnails)             │    │
│  │  │   └── sketches/ (sketch gallery)                 │    │
│  │  │                                                  │    │
│  │  └── favicon/ (favicon set)                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│                        ▼                                    │
│  Asset Loading Strategy                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - SVG: Inline or <img> tag                         │    │
│  │  - Images: Next.js Image component                  │    │
│  │  - Fonts: Google Fonts (async, preload)             │    │
│  │  - Optimization: SVGO, Image optimization           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Font Loading Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  FONT LOADING ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Original Site (Typekit) → Replica (Google Fonts)           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  Original:                                            │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  Adobe Typekit (uti0eci)                     │     │  │
│  │  │  - Script: use.typekit.net/uti0eci.js        │     │  │
│  │  │  - Font-display: swap                        │     │  │
│  │  │  - Asynchronous loading                      │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  │                                                       │  │
│  │  Replica:                                             │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  Google Fonts (Space Grotesk)                │     │  │
│  │  │  - next/font/google                          │     │  │
│  │  │  - font-display: swap                        │     │  │
│  │  │  - Preload: true                             │     │  │
│  │  │  - Subsets: ['latin']                        │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Font Loading Flow:                                         │
│  1. Preconnect to fonts.googleapis.com                      │
│  2. Preload critical font files                             │
│  3. Load font files asynchronously                          │
│  4. Apply font-display: swap (show fallback immediately)    │
│  5. Swap to custom font when loaded                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Performance Architecture

### 8.1 Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────┐
│            PERFORMANCE OPTIMIZATION ARCHITECTURE            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Build-Time Optimizations                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Code splitting by route                          │    │
│  │  - Tree-shaking (GSAP modules)                      │    │
│  │  - CSS minification                                 │    │
│  │  - JavaScript minification                          │    │
│  │  - Image optimization (Next.js Image)               │    │
│  │  - SVG optimization (SVGO)                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Runtime Optimizations                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Lazy loading (images below fold)                 │    │
│  │  - Font preloading                                  │    │
│  │  - Critical CSS inlining                            │    │
│  │  - will-change CSS property (GPU acceleration)      │    │
│  │  - RequestAnimationFrame (60fps animations)         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  CDN Optimizations                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Global CDN distribution (Render.com)             │    │
│  │  - Asset caching headers                            │    │
│  │  - Gzip/Brotli compression                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Performance Targets                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - LCP: < 1.5s                                      │    │
│  │  - FID: < 100ms                                     │    │
│  │  - CLS: < 0.1                                       │    │
│  │  - FCP: < 1.2s                                      │    │
│  │  - TTI: < 2.5s                                      │    │
│  │  - Bundle Size: < 300KB (gzipped)                   │    │
│  │  - Animation: 60fps (no jank)                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Bundle Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BUNDLE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Main Bundle (Initial Load)                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - React core                                       │    │
│  │  - Next.js runtime                                  │    │
│  │  - Critical components (Layout, Navbar)             │    │
│  │  - Critical CSS (Tailwind base)                     │    │
│  │  Size Target: < 150KB (gzipped)                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Animation Bundle (Code Split)                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - GSAP core                                        │    │
│  │  - ScrollTrigger plugin                             │    │
│  │  - Animation components                             │    │
│  │  - Lazy loaded on interaction                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Section Bundles (Route-Based Splitting)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - HeroSection bundle                               │    │
│  │  - WorkSection bundle                               │    │
│  │  - AboutSection bundle                              │    │
│  │  - ContactSection bundle                            │    │
│  │  - SketchesSection bundle                           │    │
│  │  - Lazy loaded on scroll                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Total Bundle Size Target: < 300KB (gzipped)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Deployment Architecture

### 9.1 Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Development → Build → Deploy → CDN                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  1. Source Code (Git Repository)                    │    │
│  │     └─▶ Push to main branch                         │    │
│  │                                                     │    │
│  │  2. Render.com Build Server                         │    │
│  │     ├─▶ Git clone                                   │    │
│  │     ├─▶ npm install                                 │    │
│  │     ├─▶ npm run build (Next.js SSG)                 │    │
│  │     └─▶ Generate static files                       │    │
│  │                                                     │    │
│  │  3. Render.com CDN                                  │    │
│  │     ├─▶ Upload static files                         │    │
│  │     ├─▶ Distribute to edge servers                  │    │
│  │     └─▶ Activate health check                       │    │
│  │                                                     │    │
│  │  4. Global Distribution                             │    │
│  │     └─▶ Users access via nearest edge server        │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Render.com Configuration

**Service Configuration** (from render.yaml):
```yaml
services:
  - type: web
    name: chris-cole-portfolio
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SITE_URL
        sync: false
    healthCheckPath: /
    autoDeploy: true
```

**Deployment Architecture**:
- **Build Server**: Node.js 18+ runtime
- **Static Hosting**: Render.com web service
- **CDN**: Global edge distribution
- **Health Check**: Root path (`/`) monitoring
- **Auto-Deploy**: Triggered on Git push to main branch

---

## 10. Security Architecture

### 10.1 Security Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                  SECURITY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Static Site Security (No Backend)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - No server-side vulnerabilities                   │    │
│  │  - No database exposure                             │    │
│  │  - No API endpoints                                 │    │
│  │  - No authentication required                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Client-Side Security                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Content Security Policy (CSP) headers            │    │
│  │  - XSS prevention (React sanitization)              │    │
│  │  - HTTPS only (Render.com default)                  │    │
│  │  - Secure cookie flags (if applicable)              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Asset Security                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - SVG sanitization (if user-generated)              │   │
│  │  - Image validation                                  │   │
│  │  - Font loading from trusted sources (Google)        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Monitoring & Observability

### 11.1 Monitoring Strategy

```
┌─────────────────────────────────────────────────────────────┐
│            MONITORING & OBSERVABILITY                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Performance Monitoring                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Core Web Vitals tracking                         │    │
│  │  - Lighthouse CI integration                        │    │
│  │  - Render.com built-in metrics                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Error Tracking (Optional)                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Sentry integration (optional)                    │    │
│  │  - Console error logging                            │    │
│  │  - Network error tracking                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Analytics (Optional)                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Google Analytics (optional)                      │    │
│  │  - Plausible Analytics (privacy-friendly)           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Uptime Monitoring                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - Render.com health checks                         │    │
│  │  - UptimeRobot (optional)                           │    │
│  │  - Pingdom (optional)                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. API Architecture

### 12.1 API Endpoints

**Status**: **NO API ENDPOINTS REQUIRED**

This is a **static site** with no backend services. All functionality is client-side only:

- **No REST API**: All content is static
- **No GraphQL API**: No data fetching required
- **No Server-Side API Routes**: Next.js API routes not used
- **No External API Calls**: Except Google Fonts (font loading)

### 12.2 External Service Integration

**Google Fonts API** (Font Loading Only):
```
Endpoint: https://fonts.googleapis.com/css2
Method: GET
Purpose: Load Space Grotesk font family
Strategy: Asynchronous, preload, font-display: swap
```

**No Other External APIs Required**

---

## 13. Data Architecture

### 13.1 Data Model

**Status**: **NO DATA MODEL REQUIRED**

This is a **static site** with no data persistence:

- **No Database**: All content is hardcoded in components
- **No State Management**: React local state only (UI state)
- **No Data Fetching**: No async data loading
- **No CMS Integration**: Content is static

### 13.2 Content Structure

**Static Content Map**:
```typescript
// All content is static (hardcoded in components)
const siteContent = {
  hero: {
    headline: "I'VE WORKED IN TECH AND CPG FOR 6 YEARS...",
    specialties: ["WEB", "BRANDING", "PRODUCT", "PACKAGING", "COCKTAILS :)"],
  },
  work: {
    title: "WORK",
    status: "(UNDER CONSTRUCTION)",
    projects: [/* static project data */],
  },
  about: {
    title: "ABOUT",
    bio: "/* static bio text */",
  },
  contact: {
    title: "CONTACT",
    email: "hello@chriscole.com",
    socialLinks: [/* static social links */],
  },
  sketches: {
    title: "SKETCHES",
    images: [/* static image paths */],
  },
};
```

---

## 14. System Integration Points

### 14.1 Integration Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              SYSTEM INTEGRATION POINTS                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Internal Integrations (None Required)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - All components are self-contained                │    │
│  │  - No service-to-service communication              │    │
│  │  - No microservices architecture                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  External Integrations                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. Google Fonts (fonts.googleapis.com)             │    │
│  │     - Font loading only                             │    │
│  │     - No data exchange                              │    │
│  │                                                     │    │
│  │  2. Render.com (Deployment Platform)                │    │
│  │     - Static file hosting                           │    │
│  │     - CDN distribution                              │    │
│  │     - Build automation                              │    │
│  │                                                     │    │
│  │  3. Git Repository (Version Control)                │    │
│  │     - Source code management                        │    │
│  │     - Deployment trigger                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Scalability Architecture

### 15.1 Scalability Considerations

**Static Site Scalability**:
- **Horizontal Scaling**: Automatic via CDN (Render.com)
- **No Server Load**: Static files only
- **Global Distribution**: CDN edge servers worldwide
- **No Database Bottlenecks**: No database required
- **No API Rate Limits**: No API calls (except fonts)

**Performance at Scale**:
- CDN caching reduces origin server load
- Static files can be cached indefinitely
- No server-side computation required
- Bandwidth scales automatically with CDN

---

## 16. Disaster Recovery & Backup

### 16.1 Backup Strategy

**Source Code**:
- Git repository (GitHub/GitLab) - primary backup
- Local development copies

**Static Assets**:
- Version controlled in Git repository
- Render.com deployment history

**No Database Backup Required**: No database exists

---

## 17. Compliance & Standards

### 17.1 Compliance Requirements

**Performance**:
- Core Web Vitals targets (LCP, FID, CLS)

**SEO**:
- Meta tags (title, description, OG tags)
- Structured data (JSON-LD)
- Semantic HTML
- Sitemap generation
- robots.txt configuration

---

## 18. Architecture Decision Records

### 18.1 Key Architecture Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Static Site Generation (SSG) | No dynamic content, better performance | SSR, CSR, ISR |
| Next.js 14 App Router | Modern routing, optimal for static sites | Pages Router, Remix |
| GSAP for Animations | Professional-grade, exact timing control | CSS Animations, Framer Motion only |
| Render.com Hosting | Free tier, easy deployment, CDN included | Vercel, Netlify, AWS S3 |
| Google Fonts | Free, reliable, replaces Typekit | Self-hosted fonts, Adobe Fonts |
| No Backend/API | Static content only, simpler architecture | Headless CMS, API routes |

---

## Document Status

**Status**: ✅ **COMPLETE**  
**Version**: 1.0.0  
**Last Updated**: November 11, 2025  
**Next Review**: After implementation begins

**Related Documents**:
- `docs/requirements/business-requirements.md`
- `docs/requirements/implementation-plan.md`
- `docs/testing/testing-strategy.md`
- `docs/analysis/visual-discrepancy-analysis.md`
- `docs/analysis/dev-tools-analysis.md`

---

**END OF SYSTEM ARCHITECTURE DOCUMENT**

