/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useAppStore } from "../store";
import { HelpCircle, ChevronRight, ChevronLeft, Sparkles, AlertCircle, ShoppingCart, Info, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Match {
  productId: string;
  plantName: string;
  reason: string;
}

interface QuizResult {
  matches: Match[];
  expertAdvice: string;
}

export default function QuizModal() {
  const { products, addToCart, setView } = useAppStore();
  const [step, setStep] = useState(1);
  const [difficulty, setDifficulty] = useState("Any");
  const [light, setLight] = useState("Any");
  const [co2, setCO2] = useState("Any");
  const [placement, setPlacement] = useState("Any");
  const [preferences, setPreferences] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetQuiz = () => {
    setStep(1);
    setDifficulty("Any");
    setLight("Any");
    setCO2("Any");
    setPlacement("Any");
    setPreferences("");
    setResult(null);
    setError(null);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty,
          light,
          co2,
          placement,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult AI. Please check server status.");
      }

      const data = await response.json();
      setResult(data);
      setStep(6); // Result screen
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-poppins min-h-[600px] flex flex-col justify-center">
      {/* Decorative Title */}
      <div className="text-center mb-10">
        <span className="text-xs tracking-widest text-gold font-bold bg-forest/10 px-3 py-1.5 rounded-full inline-block mb-3 font-poppins uppercase">
          Leaf AI Expert Advisor
        </span>
        <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-forest tracking-tight">
          AQUATIC PLANT FINDER
        </h2>
        <p className="font-cormorant text-base md:text-lg text-forest/70 max-w-lg mx-auto italic mt-1">
          Tell us about your aquarium setup. Our AI master-botanist will diagnose your parameters and match you with the perfect live specimens.
        </p>
      </div>

      <div className="bg-cream border border-forest/15 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        {/* Floating background leaf effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-sage/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Progress bar */}
        {step <= 5 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-forest/60 font-medium mb-2">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-green"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Experience Level */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-left"
            >
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-forest mb-2">
                What is your experience with aquarium plants?
              </h3>
              <p className="text-xs text-forest/60 mb-6">
                This helps us select plants with the appropriate survival rates and pruning requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "Low Tech", label: "Low Tech Setup", desc: "No CO₂ required. Hardy species thriving in low to moderate light." },
                  { value: "Mid Tech", label: "Mid Tech Setup", desc: "Moderate light, liquid fertilizers, or simple low CO₂ setup." },
                  { value: "High Tech", label: "High Tech Setup", desc: "Strong light, nutrient substrate, and dedicated CO₂ injection." },
                  { value: "Any", label: "Any Level", desc: "Show me all specimens regardless of setup technology levels." },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setDifficulty(opt.value); handleNext(); }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      difficulty === opt.value
                        ? "bg-forest border-gold text-cream shadow-md"
                        : "bg-cream-dark/40 border-forest/10 text-forest hover:border-gold hover:bg-cream-dark/80"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider mb-2 block">{opt.label}</span>
                    <span className="text-[11px] leading-relaxed opacity-85 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Light Level */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-left"
            >
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-forest mb-2">
                What is the lighting intensity on your tank?
              </h3>
              <p className="text-xs text-forest/60 mb-6">
                Lighting dictates photosynthesis speed and color pigments. Matching light ensures no melt.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "Low", label: "Low Light", desc: "Standard built-in hood lights, ambient window light." },
                  { value: "Medium", label: "Medium Light", desc: "Upgraded brand LED bar (Sunsun, Chihiros basic)." },
                  { value: "High", label: "High Light", desc: "Professional high-spectrum RGB rails (Chihiros WRGB, ADA)." },
                  { value: "Any", label: "Any Light", desc: "Surprise me or show all lighting capabilities." },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setLight(opt.value); handleNext(); }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      light === opt.value
                        ? "bg-forest border-gold text-cream shadow-md"
                        : "bg-cream-dark/40 border-forest/10 text-forest hover:border-gold hover:bg-cream-dark/80"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider mb-2 block">{opt.label}</span>
                    <span className="text-[11px] leading-relaxed opacity-85 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="mt-6 flex items-center gap-1 text-xs text-forest/60 hover:text-gold cursor-pointer font-medium">
                <ChevronLeft className="w-4 h-4" /> Go Back
              </button>
            </motion.div>
          )}

          {/* STEP 3: CO2 Level */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-left"
            >
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-forest mb-2">
                Do you inject pressurized CO₂ gas?
              </h3>
              <p className="text-xs text-forest/60 mb-6">
                CO2 is the primary building block. Many rare plants like Bucephalandra and Rotala need it to thrive.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "None", label: "No CO₂ Injection", desc: "Completely low-tech setup, relying on atmospheric gas exchange." },
                  { value: "Low", label: "Low CO₂", desc: "Liquid organic carbon supplements, or DIY yeast kits." },
                  { value: "High", label: "High pressurized CO₂", desc: "Pressurized gas cylinder with solenoid and ceramic diffuser." },
                  { value: "Any", label: "Any System", desc: "Show me all plants suited for both high and low tech." },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setCO2(opt.value); handleNext(); }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      co2 === opt.value
                        ? "bg-forest border-gold text-cream shadow-md"
                        : "bg-cream-dark/40 border-forest/10 text-forest hover:border-gold hover:bg-cream-dark/80"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider mb-2 block">{opt.label}</span>
                    <span className="text-[11px] leading-relaxed opacity-85 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="mt-6 flex items-center gap-1 text-xs text-forest/60 hover:text-gold cursor-pointer font-medium">
                <ChevronLeft className="w-4 h-4" /> Go Back
              </button>
            </motion.div>
          )}

          {/* STEP 4: Placement */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-left"
            >
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-forest mb-2">
                Where do you plan to plant these?
              </h3>
              <p className="text-xs text-forest/60 mb-6">
                Foreground plants carpet the front; midground plants cover hardscape; backgrounds grow tall.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "Foreground", label: "Foreground", desc: "Carpets, small mosses, or short front border bushes." },
                  { value: "Midground", label: "Midground", desc: "Plants attached to wood, rocks, crevices, or bushy ferns." },
                  { value: "Background", label: "Background", desc: "Tall stem plants, large grass blades that frame the back." },
                  { value: "Any", label: "Any Position", desc: "Show me versatile botanicals suitable for any placement." },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setPlacement(opt.value); handleNext(); }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      placement === opt.value
                        ? "bg-forest border-gold text-cream shadow-md"
                        : "bg-cream-dark/40 border-forest/10 text-forest hover:border-gold hover:bg-cream-dark/80"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider mb-2 block">{opt.label}</span>
                    <span className="text-[11px] leading-relaxed opacity-85 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="mt-6 flex items-center gap-1 text-xs text-forest/60 hover:text-gold cursor-pointer font-medium">
                <ChevronLeft className="w-4 h-4" /> Go Back
              </button>
            </motion.div>
          )}

          {/* STEP 5: Preferences and Consultation Submit */}
          {step === 5 && (
            isLoading ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                  <h3 className="font-cinzel text-lg md:text-xl font-bold text-forest tracking-wider uppercase">
                    Consulting Botanist AI...
                  </h3>
                </div>

                {/* Animated Chat Bubbles */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center font-bold text-xs text-forest">AI</div>
                    <div className="bg-cream-dark/40 border border-forest/10 rounded-xl rounded-tl-none p-4 max-w-md space-y-2">
                      <div className="h-3 w-40 bg-forest/10 rounded animate-pulse" />
                      <div className="h-3.5 w-64 bg-forest/10 rounded animate-pulse" />
                      {/* Typing indicator */}
                      <div className="flex space-x-1.5 pt-2">
                        <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skeleton response card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="bg-[#F8F6F0] rounded-2xl overflow-hidden border border-forest/5 p-4 flex flex-col h-[280px] justify-between shadow-sm animate-pulse opacity-75">
                      <div className="w-full h-24 bg-cream-dark rounded-xl" />
                      <div className="space-y-2 pt-3">
                        <div className="h-4 w-3/4 bg-forest/10 rounded" />
                        <div className="h-3 w-1/2 bg-forest/5 rounded" />
                        <div className="h-3 w-5/6 bg-forest/5 rounded" />
                      </div>
                      <div className="flex gap-2 pt-3">
                        <div className="h-8 flex-grow bg-forest/10 rounded-lg" />
                        <div className="h-8 w-10 bg-forest/10 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-left"
              >
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-forest mb-2">
                  Any specific wishes or livestock notes?
                </h3>
                <p className="text-xs text-forest/60 mb-6">
                  Tell us if you have cherry shrimps, need red colors, have goldfishes, or prefer slow growth.
                </p>
                <div className="mb-6">
                  <textarea
                    placeholder="e.g. Must be 100% shrimp-safe, prefer intense red colors, compact leaf size for nano tanks..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="w-full h-32 bg-cream-dark/30 border border-forest/15 rounded-xl p-4 text-sm text-forest focus:outline-none focus:border-gold transition-colors font-poppins"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2 border border-red-200 mb-4 font-poppins">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-between items-center gap-4">
                  <button onClick={handleBack} className="flex items-center gap-1 text-xs text-forest/60 hover:text-gold cursor-pointer font-medium">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-forest hover:bg-emerald-green disabled:bg-forest/50 text-cream px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Get AI Recommendations</span>
                  </button>
                </div>
              </motion.div>
            )
          )}

          {/* STEP 6: AI QUIZ RESULT PREVIEW */}
          {step === 6 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-left"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="font-cinzel text-lg md:text-xl font-bold text-forest tracking-wider uppercase">
                  MATCHED AQUATIC SPECIMENS
                </h3>
              </div>

              {/* Recommendation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {result.matches.map((match) => {
                  // Find real product details from catalog to extract image
                  const realProd = products.find((p) => p.id === match.productId);
                  return (
                    <div
                      key={match.productId}
                      className="bg-cream-dark/25 border border-forest/10 rounded-xl p-5 hover:border-gold/40 transition-all duration-300 relative group"
                    >
                      {realProd && (
                        <div className="relative h-32 rounded-lg overflow-hidden mb-3 border border-forest/5">
                          <img
                            src={realProd.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"}
                            alt={match.plantName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 right-2 bg-forest/90 text-cream text-[10px] font-bold px-2 py-1 rounded-md">
                            ৳{realProd.price}
                          </span>
                        </div>
                      )}
                      <h4 className="font-playfair text-base font-bold text-forest mb-1">
                        {match.plantName}
                      </h4>
                      {realProd && (
                        <span className="text-[10px] uppercase font-poppins bg-sage/20 text-forest font-semibold px-2 py-0.5 rounded-full mb-3 inline-block">
                          {realProd.difficulty} • {realProd.light} Light
                        </span>
                      )}
                      <p className="text-xs text-forest/75 leading-relaxed font-light mb-4">
                        {match.reason}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setView("details", match.productId)}
                          className="flex-1 border border-forest/15 hover:border-gold bg-cream hover:bg-cream-dark text-forest text-xs font-semibold py-2 rounded-lg transition-all cursor-pointer text-center"
                        >
                          View Details
                        </button>
                        {realProd && realProd.stock > 0 && (
                          <button
                            onClick={() => addToCart(realProd, 1)}
                            className="bg-forest hover:bg-emerald-green text-cream px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expert Advice Block */}
              <div className="bg-forest text-cream rounded-xl p-6 border border-gold/15 mb-8 relative">
                <div className="absolute top-4 right-4 text-gold">
                  <Info className="w-5 h-5 opacity-45" />
                </div>
                <h4 className="font-cinzel text-xs font-bold tracking-widest text-gold mb-2 uppercase">
                  Expert Botanical Consultation Notes
                </h4>
                <p className="text-xs font-light leading-relaxed text-cream/90">
                  {result.expertAdvice}
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={resetQuiz}
                  className="bg-cream-dark hover:bg-forest hover:text-cream text-forest px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer border border-forest/15"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
