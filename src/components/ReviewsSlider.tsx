import React, { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
  date?: string;
  productName?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "default-1",
    author: "Sajid Rahman",
    rating: 5,
    text: "Leaf Aquatic sets the absolute standard for premium plant shipping. My Bucephalandra Ghost and Nana Golden arrived in sterile, thermally insulated boxes. Zero melting, zero pests, and immediate pearling. Simply spectacular!",
    productName: "Bucephalandra Ghost",
    date: "2026-07-15"
  },
  {
    id: "default-2",
    author: "Nabila Karim",
    rating: 5,
    text: "Outstanding quality! The tissue culture cups are completely contamination-free. The plants adapted to my high-tech tank within three days. Highly recommended for professional aquascapers in Dhaka.",
    productName: "Rotala rotundifolia",
    date: "2026-07-18"
  },
  {
    id: "default-3",
    author: "Tariqul Islam",
    rating: 5,
    text: "Pest-free and lush green. I ordered the Monte Carlo pot and it was dense, healthy, and clean. No snails, no algae. The customer service was also super helpful, guiding me on CO2 requirements.",
    productName: "Monte Carlo",
    date: "2026-07-10"
  }
];

export default function ReviewsSlider() {
  const { products } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Collect all approved reviews where featured is true
  const selectedReviews: ReviewItem[] = [];
  products.forEach((p) => {
    if (p.reviews) {
      p.reviews.forEach((r) => {
        if (r.approved && r.featured) {
          selectedReviews.push({
            id: r.id,
            author: r.author,
            rating: r.rating,
            text: r.text,
            date: r.date,
            productName: p.name
          });
        }
      });
    }
  });

  // Fallback to defaults if no reviews have been explicitly selected/featured
  const displayReviews = selectedReviews.length > 0 ? selectedReviews : DEFAULT_REVIEWS;

  // Auto-play effect
  useEffect(() => {
    if (isHovered || displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayReviews.length, isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayReviews.length);
  };

  const currentReview = displayReviews[activeIndex];

  if (displayReviews.length === 0) return null;

  return (
    <section 
      id="homepage-reviews-slider"
      className="bg-forest-dark text-cream py-16 px-6 md:px-12 rounded-none md:rounded-[24px] max-w-7xl mx-auto border-t border-gold/15 relative overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-green/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="flex justify-center mb-1">
          <Quote className="w-10 h-10 text-gold/20 rotate-180" />
        </div>
        
        <span className="text-xs text-gold uppercase font-bold tracking-widest block">
          {currentReview.productName ? `${currentReview.productName} Review` : "Aquascaper Testimonial"}
        </span>

        {/* Carousel slide transition wrapper */}
        <div className="min-h-[140px] md:min-h-[100px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <blockquote className="font-cormorant text-xl md:text-2xl leading-relaxed italic text-sage px-4 md:px-8">
                "{currentReview.text}"
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Author & Star Rating */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < currentReview.rating ? "fill-gold text-gold" : "text-cream/20"}`} 
              />
            ))}
          </div>
          <div className="font-poppins text-xs font-semibold text-cream flex items-center gap-2">
            <span>{currentReview.author}</span>
            {currentReview.date && (
              <span className="text-cream/40 font-light font-mono">({currentReview.date})</span>
            )}
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-between pt-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-gold/15 bg-forest-dark/40 text-gold hover:bg-gold hover:text-forest-dark transition-all duration-300 cursor-pointer disabled:opacity-50"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicators Dots */}
          <div className="flex gap-2">
            {displayReviews.map((rev, index) => (
              <button
                key={rev.id}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeIndex ? "bg-gold scale-125 w-4" : "bg-cream/25 hover:bg-cream/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-gold/15 bg-forest-dark/40 text-gold hover:bg-gold hover:text-forest-dark transition-all duration-300 cursor-pointer disabled:opacity-50"
            aria-label="Next Review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
