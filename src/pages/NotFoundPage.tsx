import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export default function NotFoundPage() {
  return (
    <motion.div
      key="404-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-6 py-20 text-center font-poppins space-y-6"
    >
      <div className="w-20 h-20 bg-[#8A3324]/10 text-[#8A3324] rounded-full flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A3324] bg-[#8A3324]/10 px-4 py-1.5 rounded-full inline-block">
          Pristine Specimen Not Found
        </span>
        <h1 className="font-cinzel text-3xl font-extrabold text-forest uppercase pt-2 tracking-wide">
          404 Page Lost
        </h1>
        <p className="font-cormorant text-base text-forest/70 italic leading-relaxed">
          The underwater coordinates you requested do not contain any active botanical life. It may have been harvested or relocated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 font-semibold">
        <Link
          to="/shop"
          className="flex-1 border border-forest/15 hover:border-gold text-forest text-xs py-3 rounded-xl transition-all cursor-pointer text-center font-poppins"
        >
          Browse Catalog
        </Link>
        <Link
          to="/"
          className="flex-1 bg-forest hover:bg-emerald-green text-cream text-xs py-3 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-sm font-poppins"
        >
          Return to Home
        </Link>
      </div>
    </motion.div>
  );
}
