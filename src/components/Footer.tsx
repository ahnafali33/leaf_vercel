/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useAppStore } from "../store";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send, ArrowUp } from "lucide-react";

export default function Footer() {
  const { showLegal, setView, websiteContent } = useAppStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-forest-dark text-cream font-poppins pt-16 pb-24 md:pb-12 border-t border-gold/15 mt-20 relative overflow-hidden">
      {/* Decorative botanical circle background */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-forest/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-green/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-1 text-left">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={websiteContent?.images?.footerLogo || websiteContent?.images?.brandLogo || "/src/assets/images/leaf_aquatic_logo.jpg"}
                alt="Leaf Aquatic Logo"
                className="h-12 w-12 object-cover rounded-full border border-gold/40 shadow-sm bg-cream"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-cinzel text-lg font-bold tracking-widest text-gold block leading-none">
                  {websiteContent?.text?.brandName || "LEAF"} {websiteContent?.text?.brandSubname || "AQUATIC"}
                </span>
                <span className="text-[8px] tracking-[0.2em] text-emerald-300 uppercase font-bold block mt-1">
                  {websiteContent?.text?.brandTagline || "RETAILER • COLORFUL AQUATIC PLANTS"}
                </span>
              </div>
            </div>
            <p className="text-xs text-sage/75 leading-relaxed font-light mb-6">
              {websiteContent?.text?.footerDescription || "Our curated collection represents the intersection of luxury, biology, and art. We harvest, nurture, and ship premium underwater flora to elevate your living spaces with aquatic tranquility."}
            </p>
            <div className="flex gap-4">
              {websiteContent?.social?.facebook && (
                <a href={websiteContent.social.facebook} target="_blank" rel="noreferrer" className="p-2 bg-forest hover:bg-gold hover:text-forest-dark rounded-full transition-all text-cream">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {websiteContent?.social?.instagram && (
                <a href={websiteContent.social.instagram} target="_blank" rel="noreferrer" className="p-2 bg-forest hover:bg-gold hover:text-forest-dark rounded-full transition-all text-cream">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {websiteContent?.social?.youtube && (
                <a href={websiteContent.social.youtube} target="_blank" rel="noreferrer" className="p-2 bg-forest hover:bg-gold hover:text-forest-dark rounded-full transition-all text-cream">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-left">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-gold mb-4 pb-2 border-b border-gold/10">
              EXPLORE
            </h4>
            <ul className="space-y-3 text-xs text-sage/80 font-light">
              <li>
                <Link to="/shop" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Shop All Plants
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Aquascaping Tutorials
                </Link>
              </li>
              <li>
                <Link to="/ai-plant-finder" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  AI Plant Finder Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Policies */}
          <div className="text-left">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-gold mb-4 pb-2 border-b border-gold/10">
              LEGAL POLICIES
            </h4>
            <ul className="space-y-3 text-xs text-sage/80 font-light">
              <li>
                <Link to="/privacy-policy" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Refund & Live Guarantee
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-cream hover:underline transition-all cursor-pointer">
                  Shipping & COD Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="text-left">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-gold mb-4 pb-2 border-b border-gold/10">
              {websiteContent?.text?.newsletterTitle || "NEWSLETTER"}
            </h4>
            <p className="text-xs text-sage/75 leading-relaxed font-light mb-4">
              {websiteContent?.text?.newsletterSubtitle || "Subscribe to receive weekly care guides, aquascaping tips, and early-bird notifications on extremely rare collector plant harvests."}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-forest border border-gold/10 rounded-xl px-3 py-2.5 pr-10 text-xs text-cream placeholder-sage/50 focus:outline-none focus:border-gold transition-colors font-poppins"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-gold hover:text-cream transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-sage font-light animate-pulse">
                  🌱 Thank you! You are now subscribed to Leaf Care guides.
                </p>
              )}
            </form>

            <div className="mt-6 space-y-2 text-xs text-sage/70 font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{websiteContent?.text?.contactPhone || "+880 171 2345 678"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{websiteContent?.text?.contactEmail || "care@leafaquatic.com"}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{websiteContent?.text?.contactAddress || "Banani Road 11, Dhaka, Bangladesh"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Bottom Credits */}
        <div className="border-t border-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <p className="text-[11px] text-sage/55 font-light">
              &copy; {new Date().getFullYear()} Leaf Aquatic. All Rights Reserved. Crafted with deep biological care.
            </p>
            <Link 
              to="/admin" 
              className="text-[10px] text-sage/35 hover:text-gold transition-colors cursor-pointer animate-pulse"
              title="Admin Portal"
            >
              Atelier Gate
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-gold hover:text-cream transition-colors cursor-pointer"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
