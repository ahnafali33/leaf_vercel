import React from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function CategoriesPage() {
  const { categories, products } = useAppStore();

  return (
    <motion.div
      key="categories-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left font-poppins space-y-12"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase bg-forest/10 px-4 py-1.5 rounded-full inline-block">
          Botanical Families
        </span>
        <h1 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
          Explore Our Plant Genera
        </h1>
        <p className="font-cormorant text-base text-forest/70 italic leading-relaxed">
          Choose from our scientifically classified specimen lines, curated specifically for premium long-term aquascaping vitality.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const specimenCount = products.filter((p) => p.category === cat.name).length;
          const slug = cat.seo?.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
            <Link
              key={cat.id || cat.name}
              to={`/category/${slug}`}
              className="group bg-cream-dark/15 hover:bg-cream-dark/30 border border-forest/10 hover:border-gold/35 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg cursor-pointer"
            >
              <div className="h-56 bg-cream-dark relative overflow-hidden">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent flex items-end p-5">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-cream tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] tracking-widest font-mono text-gold uppercase mt-1 inline-block">
                      {specimenCount} {specimenCount === 1 ? 'Specimen' : 'Specimens'} Available
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs font-light text-forest/75 leading-relaxed">
                  Discover premium, healthy tissue-culture and bareroot {cat.name} specimens prepared by our expert Dhaka nurseries.
                </p>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-forest transition-colors mt-auto font-poppins">
                  <span>Browse Species Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
