import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800";

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  // Ensure we have a valid, non-empty array of images
  const galleryImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Track active index reset when images change (e.g. switching product)
  useEffect(() => {
    setActiveIndex(0);
    setImageErrors({});
  }, [images]);

  // Touch handlers for swipe support
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left -> Next image
        handleNext();
      } else {
        // Swipe right -> Previous image
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Hover zoom handler (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(1.8)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  // Image loading fallback error handling
  const handleImageError = (index: number, src: string) => {
    console.error(`Leaf Aquatic Image Error: Failed to load image at index ${index} (${src}) for product "${productName}". Falling back to premium generic botanical image.`);
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getCurrentImageSrc = (index: number) => {
    if (imageErrors[index] || !galleryImages[index]) {
      return FALLBACK_IMAGE;
    }
    return galleryImages[index];
  };

  return (
    <div className="space-y-4 font-poppins">
      {/* 1. Large Main Featured Image Stage */}
      <div 
        className="relative h-96 sm:h-[450px] bg-cream border border-forest/15 rounded-2xl overflow-hidden shadow-sm group select-none cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="w-full h-full overflow-hidden hidden md:block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
        >
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={getCurrentImageSrc(activeIndex)}
            alt={`${productName} - View ${activeIndex + 1}`}
            style={zoomStyle}
            className="w-full h-full object-cover transition-transform duration-100"
            onError={() => handleImageError(activeIndex, galleryImages[activeIndex])}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Mobile View (No zoom on hover to avoid conflict with gestures) */}
        <div 
          className="w-full h-full md:hidden"
          onClick={() => setIsLightboxOpen(true)}
        >
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={getCurrentImageSrc(activeIndex)}
            alt={`${productName} - View ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onError={() => handleImageError(activeIndex, galleryImages[activeIndex])}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Quick Zoom-In Indicator */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 bg-cream/80 backdrop-blur-md p-2 rounded-full border border-forest/10 hover:bg-forest hover:text-cream text-forest transition-all shadow-sm z-10"
          title="Zoom View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows (Only shown if more than one image) */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-cream/80 backdrop-blur-md p-2 rounded-full border border-forest/10 hover:bg-forest hover:text-cream text-forest transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-cream/80 backdrop-blur-md p-2 rounded-full border border-forest/10 hover:bg-forest hover:text-cream text-forest transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* 2. Thumbnail Strip underneath */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {galleryImages.map((img, i) => {
            const isSelected = i === activeIndex;
            const hasError = imageErrors[i];
            const imgSrc = hasError ? FALLBACK_IMAGE : img;

            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative h-20 bg-cream rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected ? "border-gold shadow-md scale-95" : "border-forest/10 hover:border-gold/50"
                }`}
              >
                <img 
                  src={imgSrc} 
                  alt={`${productName} thumbnail ${i + 1}`} 
                  className="w-full h-full object-cover" 
                  onError={() => handleImageError(i, img)}
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-gold/5" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-cream/75 hover:text-cream hover:bg-cream/10 p-2.5 rounded-full transition-all cursor-pointer border border-cream/10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Stage */}
            <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
              {/* Image */}
              <motion.img
                key={activeIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={getCurrentImageSrc(activeIndex)}
                alt={productName}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />

              {/* Lightbox Navigation */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 sm:-left-16 bg-cream/10 border border-cream/20 text-cream p-3 rounded-full hover:bg-cream/25 hover:scale-105 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 sm:-right-16 bg-cream/10 border border-cream/20 text-cream p-3 rounded-full hover:bg-cream/25 hover:scale-105 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Indicator and Title */}
            <div className="absolute bottom-6 text-center space-y-1">
              <p className="text-cream text-sm font-bold uppercase tracking-wider">{productName}</p>
              {galleryImages.length > 1 && (
                <p className="text-cream/60 text-xs font-mono">
                  Image {activeIndex + 1} of {galleryImages.length}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
