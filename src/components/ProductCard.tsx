/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Product } from "../types";
import { useAppStore } from "../store";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import { LazyImage } from "./LazyImage";

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, setView } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);
  const discountAmount = product.originalPrice > product.price ? product.originalPrice - product.price : 0;
  const discountPercent = discountAmount ? Math.round((discountAmount / product.originalPrice) * 100) : 0;

  const handleCardClick = () => {
    setView("details", product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-cream border border-forest/10 rounded-[20px] overflow-hidden transition-all duration-300 relative flex flex-col group h-full water-ripple"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none font-sans">
        {discountPercent > 0 && (
          <span className="bg-gold text-forest-dark text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            SAVE {discountPercent}%
          </span>
        )}
        <span
          className={`text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full text-center ${
            product.difficulty === "Low Tech"
              ? "bg-emerald-green text-cream"
              : product.difficulty === "Mid Tech"
              ? "bg-forest text-cream"
              : "bg-[#8A3324] text-cream"
          }`}
        >
          {product.difficulty}
        </span>
      </div>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full border transition-all cursor-pointer ${
          isWishlisted
            ? "bg-[#8A3324]/10 border-[#8A3324]/20 text-[#8A3324]"
            : "bg-cream/90 border-forest/10 text-forest/70 hover:text-[#8A3324]"
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#8A3324]" : ""}`} />
      </button>

      {/* Image container with hover zoom */}
      <div
        onClick={handleCardClick}
        className="relative h-48 md:h-56 bg-cream-dark/30 overflow-hidden cursor-pointer flex-shrink-0"
      >
        <LazyImage
          src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"}
          alt={product.name}
          className="group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            console.error(`Failed to load image for ${product.name}, using fallback.`);
            e.currentTarget.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800";
          }}
        />
        <div className="absolute inset-0 bg-forest-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-cream/95 text-forest text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-full flex items-center gap-1.5 shadow-none border border-forest/10">
            <Eye className="w-3.5 h-3.5" /> VIEW DETAILS
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between text-left">
        <div className="cursor-pointer" onClick={handleCardClick}>
          <span className="text-[9px] uppercase font-sans tracking-[0.2em] text-emerald-green/95 font-bold block mb-1">
            {product.category}
          </span>
          <h3 className="font-playfair text-lg font-normal text-forest group-hover:text-gold transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="font-sans text-xs italic text-forest/60 font-light mt-0.5 line-clamp-1">
            {product.scientificName}
          </p>
        </div>

        <div className="mt-4">
          {/* Price & Stock info */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 font-sans">
              <span className="text-base font-bold text-forest">৳{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-forest/40 line-through">৳{product.originalPrice}</span>
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-wider font-bold font-sans ${product.stock > 0 ? "text-emerald-green/90" : "text-[#8A3324]"}`}>
              {product.stock > 0 ? `In Stock` : "Sold Out"}
            </span>
          </div>

          {/* Quick Buy actions */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <button
                id={`add-to-cart-btn-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="w-full bg-forest hover:bg-emerald-green text-cream py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-forest/15 text-forest/40 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] cursor-not-allowed text-center"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
