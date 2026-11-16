import React from "react";
import { useAppStore } from "../store";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function BlogPage() {
  const { blogs, setView } = useAppStore();

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
    >
      <div className="text-center mb-12">
        <h2 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
          AQUASCAPE GURU ACADEMY
        </h2>
        <p className="font-cormorant text-sm text-forest/60 italic mt-1">
          Care guidelines, design tutorials, and water parameters compiled by our veteran aquascape biologists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map((b) => (
          <div
            key={b.id}
            onClick={() => setView("blog-details", b.id)}
            className="bg-cream border border-forest/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="h-56 overflow-hidden bg-cream-dark relative">
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-forest text-cream text-[10px] font-bold tracking-wider px-3 py-1 rounded-md uppercase">
                {b.category}
              </span>
            </div>
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-3 text-[10px] text-forest/50">
                  <span>By {b.author}</span>
                  <span>•</span>
                  <span>{b.readTime}</span>
                </div>
                <h3 className="font-playfair text-lg font-bold text-forest group-hover:text-gold transition-colors mt-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-forest/75 font-light leading-relaxed mt-2 line-clamp-2">
                  {b.excerpt}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-forest/5 mt-4">
                <div className="flex gap-1.5 flex-wrap">
                  {b.tags?.slice(0, 2).map((t: string) => (
                    <span key={t} className="bg-cream-dark text-forest text-[9px] px-2 py-0.5 rounded-full font-medium">#{t}</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
