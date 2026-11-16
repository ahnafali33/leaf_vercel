/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useAppStore } from "../store";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, HelpCircle, Shield, Menu, X, BookOpen, Leaf, Home, ShoppingCart, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { cart, wishlist, setView, activeView, products, websiteContent } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Filter search matches
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.scientificName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchItemClick = (id: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setView("details", id);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-forest text-cream text-[9px] md:text-[10px] tracking-[0.2em] uppercase py-2.5 px-4 border-b border-gold/10 relative z-50 text-center font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1 md:gap-4 font-sans">
          <div className="flex items-center gap-2 justify-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse"></span>
            <span>{(websiteContent?.text?.announcementBar || "📦 FREE DELIVERY INSIDE DHAKA FOR ORDERS OVER ৳3000").replace(/1500/g, "3000")}</span>
          </div>
          <div className="flex items-center gap-6 justify-center">
            <span>{websiteContent?.text?.announcementGuarantee || "🌿 HEALTHY PLANT GUARANTEE"}</span>
            <span>{websiteContent?.text?.announcementCod || "🤝 CASH ON DELIVERY NATIONWIDE"}</span>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-forest/10 py-5 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Luxury Typography */}
          <Link 
            id="brand-logo-btn"
            to="/" 
            className="hover:opacity-95 transition-all text-left cursor-pointer flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center p-1 rounded-full bg-cream-dark/80 border border-gold/30 shadow-sm group-hover:border-gold group-hover:scale-105 transition-all duration-300">
              <img
                src={websiteContent?.images?.brandLogo || "/src/assets/images/leaf_aquatic_logo.jpg"}
                alt="Leaf Aquatic Logo"
                className="h-10 md:h-12 w-10 md:w-12 object-cover rounded-full border border-forest/10"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-green border-2 border-cream"></span>
            </div>

            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-playfair tracking-tight text-forest font-bold leading-none flex items-center gap-1">
                <span>{websiteContent?.text?.brandName || "LEAF"}</span>
                <span className="italic font-normal text-gold">{websiteContent?.text?.brandSubname || "AQUATIC"}</span>
              </div>
              <div className="text-[8px] md:text-[9px] tracking-[0.22em] text-emerald-green uppercase font-bold mt-1 font-sans">
                {websiteContent?.text?.brandTagline || "RETAILER • COLORFUL AQUATIC PLANTS"}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-[11px] uppercase tracking-[0.2em] text-forest font-bold">
            <Link 
              id="nav-home-btn"
              to="/" 
              className={`hover:text-gold transition-colors cursor-pointer py-1 ${activeView === "home" ? "text-gold border-b-2 border-gold" : "text-forest/80"}`}
            >
              HOME
            </Link>
            <Link 
              id="nav-shop-btn"
              to="/shop" 
              className={`hover:text-gold transition-colors cursor-pointer py-1 ${activeView === "shop" ? "text-gold border-b-2 border-gold" : "text-forest/80"}`}
            >
              SHOP
            </Link>
            <Link 
              id="nav-blogs-btn"
              to="/blog" 
              className={`hover:text-gold transition-colors cursor-pointer py-1 ${activeView === "blog" || activeView === "blog-details" ? "text-gold border-b-2 border-gold" : "text-forest/80"}`}
            >
              JOURNAL
            </Link>
            <Link 
              id="nav-quiz-btn"
              to="/ai-plant-finder" 
              className={`flex items-center gap-1 hover:text-gold transition-colors cursor-pointer py-1 ${activeView === "quiz" ? "text-gold border-b-2 border-gold" : "text-emerald-green"}`}
            >
              <HelpCircle className="w-3.5 h-3.5 animate-bounce" /> AI PLANT FINDER
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Toggle */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-forest/80 hover:text-gold transition-all cursor-pointer"
              title="Search store"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              id="wishlist-btn"
              to="/wishlist"
              className="relative p-2 text-forest/80 hover:text-gold transition-all cursor-pointer"
              title="Your Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-forest-dark text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-cream">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              id="cart-btn"
              to="/cart"
              className="relative p-2.5 bg-forest hover:bg-emerald-green text-cream rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-forest-dark text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-forest">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-forest/80 hover:text-gold rounded-full cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-forest/10 fixed top-[112px] left-0 w-full z-30 overflow-hidden shadow-lg font-poppins"
          >
            <div className="flex flex-col gap-4 p-6 text-sm tracking-wider font-semibold text-forest">
              <Link
                to="/"
                onClick={() => { setMobileMenuOpen(false); }}
                className={`text-left py-2 border-b border-forest/5 flex items-center gap-2 ${activeView === "home" ? "text-gold" : ""}`}
              >
                <Home className="w-4 h-4 text-emerald-green" /> HOME
              </Link>
              <Link
                to="/shop"
                onClick={() => { setMobileMenuOpen(false); }}
                className={`text-left py-2 border-b border-forest/5 flex items-center gap-2 ${activeView === "shop" ? "text-gold" : ""}`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-green" /> SHOP CATALOG
              </Link>
              <Link
                to="/blog"
                onClick={() => { setMobileMenuOpen(false); }}
                className={`text-left py-2 border-b border-forest/5 flex items-center gap-2 ${activeView === "blog" ? "text-gold" : ""}`}
              >
                <BookOpen className="w-4 h-4 text-emerald-green" /> BLOG & ARTICLES
              </Link>
              <Link
                to="/ai-plant-finder"
                onClick={() => { setMobileMenuOpen(false); }}
                className={`text-left py-2 border-b border-forest/5 flex items-center gap-2 text-emerald-green ${activeView === "quiz" ? "text-gold" : ""}`}
              >
                <HelpCircle className="w-4 h-4 text-gold animate-pulse" /> AI PLANT FINDER
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-dark/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-cream border border-gold/20 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-forest/5 rounded-full text-forest/70 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-cinzel text-lg font-bold text-forest mb-4">
                SEARCH OUR PLANT SPECIES
              </h3>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="e.g. Anubias, Bucephalandra, Stem, Java Fern, CO2..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream-dark border border-forest/20 rounded-xl px-4 py-3 pl-12 text-sm text-forest placeholder-forest/50 focus:outline-none focus:border-gold transition-colors font-poppins"
                  autoFocus
                />
                <Search className="absolute left-4 top-3.5 text-forest/50 w-5 h-5" />
              </div>

              {/* Live search results */}
              <div className="max-h-80 overflow-y-auto divide-y divide-forest/10 pr-2">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSearchItemClick(p.id)}
                      className="w-full text-left py-3 flex items-center gap-4 hover:bg-forest/5 transition-colors rounded-lg px-2"
                    >
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-forest/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-playfair text-sm font-bold text-forest">{p.name}</h4>
                        <p className="font-sans text-xs text-forest/60 italic">{p.scientificName}</p>
                        <p className="font-poppins text-xs text-gold font-medium mt-0.5">৳{p.price}</p>
                      </div>
                    </button>
                  ))
                ) : searchQuery ? (
                  <p className="text-center text-sm font-poppins text-forest/60 py-6">
                    No pristine botanical specimens match your query. Try searching "Anubias" or "Moss".
                  </p>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs font-poppins text-forest/50 mb-3">RECOMMENDED QUICK SEARCHES</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Anubias", "Bucephalandra", "Moss", "Stem Plants", "CO₂", "Hardscape"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSearchQuery(cat)}
                          className="bg-cream-dark hover:bg-forest hover:text-cream text-forest text-xs font-poppins px-3 py-1.5 rounded-full transition-all"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Navigation for Mobile (Height 60px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-forest/10 z-40 px-6 py-2 shadow-lg flex items-center justify-between">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-poppins min-w-11 min-h-11 justify-center transition-colors ${activeView === "home" ? "text-gold" : "text-forest/70"}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/shop"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-poppins min-w-11 min-h-11 justify-center transition-colors ${activeView === "shop" ? "text-gold" : "text-forest/70"}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Shop</span>
        </Link>
        <Link
          to="/wishlist"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-poppins min-w-11 min-h-11 justify-center transition-colors ${activeView === "wishlist" ? "text-gold" : "text-forest/70"}`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-forest-dark font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </Link>
        <Link
          to="/cart"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-poppins min-w-11 min-h-11 justify-center transition-colors ${activeView === "cart" ? "text-gold" : "text-forest/70"}`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-forest-dark font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <Link
          to="/admin"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-poppins min-w-11 min-h-11 justify-center transition-colors ${activeView === "admin" ? "text-gold" : "text-forest/70"}`}
        >
          <User className="w-5 h-5" />
          <span>Admin</span>
        </Link>
      </div>
    </>
  );
}
