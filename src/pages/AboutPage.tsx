import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <motion.div
      key="about-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto px-6 py-12 text-left font-poppins space-y-12"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase bg-forest/10 px-4 py-1.5 rounded-full inline-block">
          Our Botanical Heritage
        </span>
        <h1 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
          LUXURY BIOLOGY & UNDERWATER ART
        </h1>
        <p className="font-cormorant text-base text-forest/70 italic leading-relaxed">
          Leaf Aquatic was founded in Dhaka to bridge the gap between world-class plant science and luxury interior design.
        </p>
      </div>

      <div className="h-80 md:h-96 rounded-2xl overflow-hidden bg-cream-dark border border-forest/10 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury Aquascaping Nursery"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light leading-relaxed text-forest/85">
        <div className="space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-forest tracking-wide uppercase">Pristine Pest-Free Protocols</h3>
          <p>
            Every single plant that enters our inventory is raised under strict biological controls. Our tissue-culture specimens are 100% free of invasive snails, hydra, duckweed, filamentous algae, and aquatic pathogens.
          </p>
          <p>
            Through state-of-the-art laboratory cultivation, we ensure that our plants have immediate, healthy root structures capable of accelerating adaptation inside your aquascape from the first hour.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-forest tracking-wide uppercase">Dhaka Nursery Experts</h3>
          <p>
            Operating from Banani, Dhaka, our certified horticulturists oversee the acclimation of rare imports including rare Bucephalandra lines, variant Anubias, and special carpets under high-grade automated systems.
          </p>
          <p>
            We believe that your aquascape is a living painting. By choosing Leaf Aquatic, you are securing a verified biological foundation that promises pristine growth, rich colors, and a self-sustaining aquatic ecology.
          </p>
        </div>
      </div>

      <div className="bg-cream-dark/20 border border-forest/10 rounded-2xl p-6 text-center space-y-4">
        <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">Need Assistance?</h4>
        <p className="text-xs font-light text-forest/75 max-w-xl mx-auto leading-relaxed">
          Our biology experts are available to advise you on fertilizer regimes, lighting requirements, and substrate selection to guarantee the survival of your rare species.
        </p>
        <Link
          to="/contact"
          className="bg-forest hover:bg-emerald-green text-cream px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-block cursor-pointer font-poppins"
        >
          Contact Our Support Desk
        </Link>
      </div>
    </motion.div>
  );
}
