import React from "react";
import { useAppStore } from "../store";
import { motion } from "motion/react";

interface LegalPageProps {
  activeLegalKey: "privacy" | "terms" | "refund" | "shipping";
}

export default function LegalPage({ activeLegalKey }: LegalPageProps) {
  const { legal, setView } = useAppStore();

  return (
    <motion.div
      key="legal-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto px-6 py-10 text-left font-poppins"
    >
      <h1 className="font-cinzel text-2xl font-extrabold text-forest tracking-wider uppercase mb-6 pb-2 border-b border-forest/10">
        {activeLegalKey === "privacy" && "PRIVACY & COOKIES POLICY"}
        {activeLegalKey === "terms" && "TERMS & CONDITIONS"}
        {activeLegalKey === "refund" && "REFUND & LIVE ARRIVAL GUARANTEE"}
        {activeLegalKey === "shipping" && "SHIPPING & COD SYSTEM RATES"}
      </h1>

      <div className="prose prose-forest text-xs md:text-sm leading-relaxed text-forest/85 space-y-4 font-light whitespace-pre-line">
        {legal?.[activeLegalKey] || "Legal content policy details..."}
      </div>

      <button
        onClick={() => setView("home")}
        className="mt-10 bg-forest hover:bg-emerald-green text-cream px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        Return to Home
      </button>
    </motion.div>
  );
}
