"use client";

import React from "react";
import { LandingNavbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { CodePlaygroundSection } from "./components/CodePlaygroundSection";
import { CompatibilitySection } from "./components/CompatibilitySection";
import { CtaSection } from "./components/CtaSection";
import { LandingFooter } from "./components/Footer";

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white font-sans antialiased">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <CodePlaygroundSection />
        <CompatibilitySection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};
