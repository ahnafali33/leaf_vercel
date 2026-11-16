/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Product } from "../types";
import { useAppStore } from "../store";
import { Star, CheckCircle, MessageSquare } from "lucide-react";

interface ReviewSectionProps {
  product: Product;
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  const { addCustomerReview } = useAppStore();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter approved reviews only
  const approvedReviews = product.reviews ? product.reviews.filter((r) => r.approved) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text) return;

    setSubmitting(true);
    setSuccessMsg(null);
    try {
      await addCustomerReview(product.id, { author, rating, text });
      setSuccessMsg("🌿 Review submitted! Our botanist will verify and approve your review shortly.");
      setAuthor("");
      setText("");
      setRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-forest/10 pt-10 mt-10 text-left font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Column 1: Review List */}
        <div className="md:col-span-7">
          <h3 className="font-cinzel text-lg font-bold text-forest mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            <span>Botanist & Hobbyist Reviews ({approvedReviews.length})</span>
          </h3>

          <div className="space-y-6">
            {approvedReviews.length > 0 ? (
              approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-cream-dark/15 border border-forest/5 p-5 rounded-xl text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-playfair text-sm font-bold text-forest">{rev.author}</h4>
                      <p className="text-[10px] text-forest/40">{rev.date}</p>
                    </div>
                    <div className="flex text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-gold" : "opacity-35"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-forest/80 leading-relaxed font-light">{rev.text}</p>
                  {rev.featured && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-green font-medium mt-3">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Aquascape Master Highlight</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-cream-dark/10 rounded-xl border border-dashed border-forest/10 p-6">
                <span className="text-2xl">🌱</span>
                <p className="text-xs text-forest/60 font-light mt-2">
                  No verified reviews for this specimen yet. Be the first to share your growth metrics!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Review Form */}
        <div className="md:col-span-5">
          <div className="bg-cream border border-forest/15 rounded-xl p-6 shadow-sm">
            <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-4">
              Write a Review
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating selector */}
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Your Rating</label>
                <div className="flex gap-1.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${i < rating ? "fill-gold text-gold" : "text-forest/20"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adnan Sami"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest placeholder-forest/40 focus:outline-none focus:border-gold transition-colors font-poppins"
                />
              </div>

              {/* Text */}
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Detailed Review</label>
                <textarea
                  required
                  placeholder="Share details of your light cycle, substrate choice, growth rate, and transition melt period..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-24 bg-cream-dark/30 border border-forest/15 rounded-lg p-3 text-xs text-forest placeholder-forest/40 focus:outline-none focus:border-gold transition-colors font-poppins"
                />
              </div>

              {successMsg && (
                <p className="text-[11px] text-emerald-green font-medium leading-normal animate-pulse">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-forest hover:bg-emerald-green text-cream py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {submitting ? "Submitting Review..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
