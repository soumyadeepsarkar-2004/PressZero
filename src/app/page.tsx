"use client";

import React from "react";
import HeroSection from "@/components/hero/HeroSection";
import ProductWalkthroughTour from "@/components/hero/ProductWalkthroughTour";
import InteractiveDemoSection from "@/components/hero/InteractiveDemoSection";
import FeatureGrid from "@/components/hero/FeatureGrid";
import PortalShowcase from "@/components/hero/PortalShowcase";
import PrivacyManifesto from "@/components/hero/PrivacyManifesto";
import SeoKnowledgeHub from "@/components/hero/SeoKnowledgeHub";
import BottomCtaBanner from "@/components/layout/BottomCtaBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Editorial Introduction */}
      <HeroSection />

      {/* 2. Primary Interactive Video Walkthrough Tour */}
      <ProductWalkthroughTour />

      {/* 3. Interactive Sandbox Demonstration Bench */}
      <InteractiveDemoSection />

      {/* 4. Core Capabilities & 6 Living Engineering Simulations */}
      <FeatureGrid />

      {/* 5. Official Exam & Visa Portal Specifications Matrix */}
      <PortalShowcase />

      {/* 6. Zero-Knowledge Architecture & Offline PWA Technical Deep-Dive */}
      <PrivacyManifesto />

      {/* 7. Comprehensive Semantic SEO Knowledge Hub & FAQs */}
      <SeoKnowledgeHub />

      {/* 8. Dedicated Master Bottom Callout Banner */}
      <BottomCtaBanner />
    </main>
  );
}