/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useAppStore } from "../store";
import { ArrowRight, Sparkles, ShieldCheck, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LazyImage } from "./LazyImage";

export default function BannerSlider() {
  const { banners, setView, websiteContent } = useAppStore();
  const [leaves, setLeaves] = useState<{ id: number; left: number; delay: number; scale: number; duration: number }[]>([]);

  // Generate floating leaf parameters
  useEffect(() => {
    const arr = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95, // % from left
      delay: Math.random() * 10, // seconds delay
      scale: 0.5 + Math.random() * 0.8,
      duration: 12 + Math.random() * 8, // seconds fall duration
    }));
    setLeaves(arr);
  }, []);

  if (!banners && !websiteContent?.images?.heroBanner) return null;

  const heroImage = websiteContent?.images?.heroBanner || banners?.hero?.image;
  const heroSubtitleText = websiteContent?.text?.heroSubtitle || banners?.hero?.subtitle;
  const heroButtonText = websiteContent?.text?.heroButtonLabel || banners?.hero?.text;

  return (
    <div className="relative overflow-hidden bg-forest-dark text-cream py-16 md:py-24 px-6 md:px-12 rounded-none md:rounded-b-[24px] border-b border-gold/20">
      
      {/* Background Cinematic image with elegant dark gradient cover */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={heroImage}
          alt="Aquascape forest background"
          className="opacity-35 filter brightness-[0.7] saturate-[1.1] scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-transparent"></div>
      </div>

      {/* Floating Leaves Animation Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="floating-leaf"
            style={{
              left: `${leaf.left}%`,
              animationDelay: `${leaf.delay}s`,
              animationDuration: `${leaf.duration}s`,
              transform: `scale(${leaf.scale})`,
              top: "-50px"
            }}
          >
            {/* SVG leaf shape with emerald-green/gold translucent colors */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 fill-gold">
              <path d="M12 2C12 2 3 7 3 13C3 17.9706 7.02944 22 12 22C16.9706 22 21 17.9706 21 13C21 7 12 2 12 2ZM12 22C11.45 22 11 21.55 11 21C11 15 8 11 8 11C8 11 11 9 12 5C13 9 16 11 16 11C16 11 13 15 13 21C13 21.55 12.55 22 12 22Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Brand Hero content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 text-left">
        
        {/* Left side info block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-4 py-1 text-xs font-bold tracking-[0.2em] text-gold uppercase font-sans">
            <Sparkles className="w-3 h-3" />
            <span>Monsoon Aquascaping Harvest 2026</span>
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl tracking-tighter text-cream leading-[1.05] md:leading-[0.95] max-w-2xl font-light">
            {websiteContent?.text?.heroTitleLine1 ? (
              <>
                {websiteContent.text.heroTitleLine1} <br/>
                <span className="italic font-normal text-gold">{websiteContent.text.heroTitleLine2 || ""}</span>
              </>
            ) : (
              <>
                The Art of <br/><span className="italic font-normal text-gold">Living</span> Water
              </>
            )}
          </h1>

          <p className="font-cormorant text-lg md:text-xl text-sage/90 max-w-xl leading-relaxed italic">
            {heroSubtitleText}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="hero-explore-btn"
              onClick={() => setView("shop")}
              className="bg-gold hover:bg-cream text-forest-dark font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-none"
            >
              <span>{heroButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-quiz-btn"
              onClick={() => setView("quiz")}
              className="bg-transparent hover:bg-gold/10 border border-cream/30 text-cream font-sans font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>AI Plant Finder Quiz</span>
            </button>
          </div>

          {/* Quick core values list */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream/10 max-w-lg text-[10px] uppercase tracking-[0.1em] font-sans text-sage/75 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Sterile & Snail-Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Live Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🚚 Dhaka Delivery inside 48h</span>
            </div>
          </div>
        </div>

        {/* Right side teaser glassmorphic badge */}
        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-dark border border-gold/10 p-8 rounded-[24px] relative text-left"
          >
            <span className="text-[9px] tracking-[0.3em] text-gold font-bold uppercase block mb-2 font-sans">
              LIMITED COLLECTOR CROP
            </span>
            <h3 className="font-playfair text-2xl font-light text-cream mb-2 leading-tight">
              Bucephalandra <br/><span className="italic font-normal text-gold">Ghost 2011</span>
            </h3>
            <p className="text-xs text-sage/80 leading-relaxed font-light mb-6 font-sans">
              We have harvested an extremely small stock of pristine, snail-free submersed Bucephalandra Ghost 2011 with hypnotic metallic purple foliage. Directly grown on natural lava rock mounts.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-sans text-lg font-bold text-cream">৳1250 <span className="text-xs text-sage/60 line-through font-normal">৳1500</span></span>
              <button
                onClick={() => setView("details", "prod-2")}
                className="bg-transparent hover:bg-cream hover:text-forest-dark border border-cream/40 text-cream text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer font-sans"
              >
                Claim Mount
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
