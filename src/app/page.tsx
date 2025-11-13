/**
 * Home Page Component
 * 
 * Main page structure following App Router pattern
 * Matches original site structure from hellochriscole.webflow.io
 */

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import SectionDivider from '@/components/ui/SectionDivider';
import WorkSection from '@/components/sections/WorkSection';
import BTRSection from '@/components/sections/BTRSection';
import ComprehensiveAnalysisSection from '@/components/sections/ComprehensiveAnalysisSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import SketchesSection from '@/components/sections/SketchesSection';
import SaturnCanvasAnimation from '@/components/animations/SaturnCanvasAnimation';
import DriftingSpaceships from '@/components/animations/DriftingSpaceships';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      
      <Navbar />
      
      {/* Saturn Animation - Hero Section Only */}
      <div className="relative" style={{ height: '100vh' }}>
        <SaturnCanvasAnimation />
        <HeroSection />
      </div>
      
      <div className="relative z-10">
        <WorkSection />
        <BTRSection />
        <ComprehensiveAnalysisSection />
        <AboutSection />
        <ContactSection />
        <SketchesSection />
      </div>
      
      <Footer />
    </main>
  );
}
