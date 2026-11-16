import React from "react";
import { useAppStore } from "../store";
import Breadcrumbs from "../components/Breadcrumbs";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface BlogDetailsPageProps {
  activeBlog: any;
}

export default function BlogDetailsPage({ activeBlog }: BlogDetailsPageProps) {
  const { setView } = useAppStore();

  if (!activeBlog) return null;

  return (
    <motion.div
      key="blog-details"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto px-6 py-10 text-left font-poppins"
    >
      <Breadcrumbs type="blog" blog={activeBlog} />

      <button
        onClick={() => setView("blog")}
        className="flex items-center gap-1 text-xs font-poppins font-semibold text-forest/70 hover:text-gold mb-8 transition-colors cursor-pointer text-left"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Academy Blogs</span>
      </button>

      <article className="space-y-6">
        {/* Category and title */}
        <div>
          <span className="text-[10px] bg-forest text-cream font-bold px-3 py-1 rounded-md tracking-wider uppercase mb-3 inline-block">
            {activeBlog.category}
          </span>
          <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-forest leading-tight">
            {activeBlog.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-forest/50 mt-4">
            <span>Written by {activeBlog.author}</span>
            <span>•</span>
            <span>Published on {activeBlog.date}</span>
            <span>•</span>
            <span>{activeBlog.readTime}</span>
          </div>
        </div>

        {/* Header Banner */}
        <div className="h-80 md:h-[400px] rounded-2xl overflow-hidden bg-cream-dark border border-forest/10">
          <img
            src={activeBlog.image}
            alt={activeBlog.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* HTML Content Render Helper */}
        <div className="prose prose-forest text-xs md:text-sm leading-relaxed text-forest/90 space-y-4 font-light font-poppins pt-4">
          {activeBlog.content.split("\n\n").map((para: string, idx: number) => {
            if (para.startsWith("###")) {
              return (
                <h3 key={idx} className="font-cinzel text-sm font-bold text-forest pt-4 pb-1 uppercase border-b border-forest/5">
                  {para.replace("###", "").trim()}
                </h3>
              );
            }
            if (para.startsWith("##")) {
              return (
                <h2 key={idx} className="font-cinzel text-base font-bold text-forest pt-6 pb-2 uppercase border-b border-forest/10">
                  {para.replace("##", "").trim()}
                </h2>
              );
            }
            return (
              <p key={idx} className="whitespace-pre-line">
                {para}
              </p>
            );
          })}
        </div>

        {/* FAQ Accordion Block */}
        {activeBlog.faq && activeBlog.faq.length > 0 && (
          <div className="bg-cream-dark/25 border border-forest/10 p-6 rounded-2xl mt-12 space-y-4">
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-2">SPECIES FAQ</h4>
            {activeBlog.faq.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs font-bold text-forest">❓ {item.question}</p>
                <p className="text-xs font-light text-forest/75 pl-4">{item.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tags footer */}
        <div className="pt-6 border-t border-forest/10 flex gap-2">
          {activeBlog.tags?.map((t: string) => (
            <span key={t} className="bg-cream-dark text-forest text-[10px] px-3 py-1 rounded-full font-medium">#{t}</span>
          ))}
        </div>

      </article>
    </motion.div>
  );
}
