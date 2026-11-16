import React from "react";
import { useAppStore } from "../store";
import BannerSlider from "../components/BannerSlider";
import ProductCard from "../components/ProductCard";
import ReviewsSlider from "../components/ReviewsSlider";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
// @ts-ignore
import aquascapingInspirationImg1 from "../assets/images/aquascaping_inspiration_1782394559700.jpg";

interface HomePageProps {
  setShopCategory: (category: string) => void;
}

export default function HomePage({ setShopCategory }: HomePageProps) {
  const { 
    products, categories, banners, websiteContent, setView 
  } = useAppStore();

  const featuredProducts = websiteContent?.homepageSections?.featuredProducts?.length > 0
    ? websiteContent.homepageSections.featuredProducts.map((id: string) => products.find(p => p.id === id)).filter(Boolean)
    : products.slice(0, 3);

  const bestSellers = websiteContent?.homepageSections?.bestSellers?.length > 0
    ? websiteContent.homepageSections.bestSellers.map((id: string) => products.find(p => p.id === id)).filter(Boolean)
    : products.slice(2, 6);

  const whatsappSettings = banners?.whatsapp || {
    phoneNumber: "8801799975540",
    link: "https://wa.me/8801799975540",
    enabled: true,
    defaultMessage: "Hello Leaf Aquatic, I would like to know more about your products."
  };

  const trackWhatsAppClick = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "whatsapp_click", {
        method: "WhatsApp",
        phone_number: whatsappSettings.phoneNumber,
        event_category: "Engagement",
        event_label: "WhatsApp Chat Click"
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Contact", {
        content_name: "WhatsApp Button Click",
        content_category: "Engagement"
      });
    }
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-16"
    >
      {/* Hero banner slider */}
      <BannerSlider />

      {/* Categories circle grid navigation */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2 className="font-playfair text-3xl md:text-4xl text-forest tracking-tighter font-light block mb-2">
          Browse <span className="italic font-normal text-gold">Botanical</span> Categories
        </h2>
        <p className="font-cormorant text-base text-forest/60 italic mb-10 max-w-lg mx-auto">
          Discover hand-selected categories designed for standard high-tech or low-tech natural layouts.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => {
            const matchProd = products.find((p) => p.category === cat.name);
            const catImg = cat.image || matchProd?.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=80";
            return (
              <button
                key={cat.id || cat.name}
                onClick={() => {
                  setShopCategory(cat.name);
                  setView("shop");
                }}
                className="bg-cream border border-forest/10 hover:border-gold/30 hover:bg-cream-dark/20 text-forest rounded-[20px] p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 group cursor-pointer shadow-none"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border border-forest/15 group-hover:border-gold/50 transition-colors">
                  <img
                    src={catImg}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-forest/10 pb-4">
          <div className="text-left">
            <h2 className="font-playfair text-3xl md:text-4xl text-forest tracking-tighter font-light">
              {websiteContent?.text?.featuredTitle ? (
                <span>{websiteContent.text.featuredTitle}</span>
              ) : (
                <>Atelier's <span className="italic font-normal text-gold">Curated</span> Specimens</>
              )}
            </h2>
            <p className="font-cormorant text-base text-forest/60 italic mt-1">
              {websiteContent?.text?.featuredSubtitle || "Exceptional specimens displaying brilliant foliage coloration, ready to grow."}
            </p>
          </div>
          <button
            onClick={() => setView("shop")}
            className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-gold hover:text-forest flex items-center gap-1.5 transition-colors cursor-pointer mt-2 md:mt-0"
          >
            <span>Browse All Species</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Plant Care Advice Showcase Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-8">
        {(banners?.promo || websiteContent?.images?.promoBanner) && (
          <div className="bg-forest text-cream rounded-[32px] overflow-hidden border border-gold/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-none">
            <div className="lg:col-span-7 p-8 md:p-12 text-left space-y-4">
              <span className="text-[9px] tracking-[0.25em] text-gold font-bold uppercase font-sans">
                Pruning and Care Standards
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-light text-cream leading-tight">
                {websiteContent?.text?.promoTitle ? (
                  <span>{websiteContent.text.promoTitle}</span>
                ) : (
                  <>The Art of <span className="italic font-normal text-gold">Nurturing</span> Submersed Foliage</>
                )}
              </h2>
              <p className="font-cormorant text-base md:text-lg text-sage/90 font-light leading-relaxed">
                {websiteContent?.text?.promoSubtitle || banners?.promo?.subtitle}
              </p>
              <button
                onClick={() => setView("blog")}
                className="bg-gold hover:bg-cream text-forest-dark font-sans font-bold text-[10px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{websiteContent?.text?.promoButtonLabel || "Read Aquascape Guru Blogs"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[300px]">
              <img
                src={websiteContent?.images?.promoBanner || banners?.promo?.image}
                alt="Healthy guarantee plants"
                className="w-full h-full object-cover filter brightness-[0.8] saturate-[1.1]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </section>

      {/* Popular Products section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <div className="text-left mb-8 border-b border-forest/10 pb-4">
          <h2 className="font-playfair text-3xl md:text-4xl text-forest tracking-tighter font-light">
            {websiteContent?.text?.bestSellersTitle ? (
              <span>{websiteContent.text.bestSellersTitle}</span>
            ) : (
              <>Hobbyists' <span className="italic font-normal text-gold">Coveted</span> Favorites</>
            )}
          </h2>
          <p className="font-cormorant text-base text-forest/60 italic mt-1">
            {websiteContent?.text?.bestSellersSubtitle || "Highly coveted by both novice aquascape designers and professional competitors."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Aquascaping Inspiration Gallery Showcase */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 text-center space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl text-forest tracking-tighter font-light block">
          {websiteContent?.text?.atelierTitle ? (
            <span>{websiteContent.text.atelierTitle}</span>
          ) : (
            <>Aquascaping <span className="italic font-normal text-gold">Inspiration</span> Atelier</>
          )}
        </h2>
        <p className="font-cormorant text-sm text-forest/60 italic max-w-xl mx-auto">
          {websiteContent?.text?.atelierSubtitle || "Take a glimpse at real layouts designed using our premium mosses, Rotala stem rows, and volcanic rock mounts."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
          <div className="md:col-span-8 rounded-2xl overflow-hidden h-96 relative group border border-forest/10 shadow-sm">
            <img
              src={websiteContent?.images?.atelierCard1Image || aquascapingInspirationImg1}
              alt="Gallery 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
              <span className="text-[10px] tracking-widest text-gold font-bold uppercase">
                {websiteContent?.text?.atelierCard1Badge || "GOLD MEDAL EXHIBITION"}
              </span>
              <h3 className="font-playfair text-xl font-bold text-cream">
                {websiteContent?.text?.atelierCard1Title || "The Emerald Terraces (Dutch style)"}
              </h3>
              <p className="text-xs text-sage/80 font-light mt-1">
                {websiteContent?.text?.atelierCard1Desc || "Planted exclusively with Rotala stems, Christmas Moss cushions, and Seiryu layout stones."}
              </p>
            </div>
          </div>
          <div className="md:col-span-4 rounded-2xl overflow-hidden h-96 relative group border border-forest/10 shadow-sm">
            <img
              src={websiteContent?.images?.atelierCard2Image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"}
              alt="Gallery 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
              <span className="text-[10px] tracking-widest text-gold font-bold uppercase">
                {websiteContent?.text?.atelierCard2Badge || "MINIMALIST ZEN"}
              </span>
              <h3 className="font-playfair text-xl font-bold text-cream">
                {websiteContent?.text?.atelierCard2Title || "Pro Iwagumi layout"}
              </h3>
              <p className="text-xs text-sage/80 font-light mt-1">
                {websiteContent?.text?.atelierCard2Desc || "Grounded by deep fissured A-Grade Seiryu Limestone blocks and Dwarf Hairgrass."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Spotlight */}
      <ReviewsSlider />

      {/* WhatsApp Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="bg-emerald-green/10 border border-emerald-green/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-emerald-green text-cream rounded-full">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-forest">Prefer Ordering via WhatsApp?</h3>
              <p className="text-xs text-forest/75 font-light">Skip the checkout form entirely. Instantly send your plant shopping cart to our botanist via click-to-chat!</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${whatsappSettings.phoneNumber}`}
            target="_blank"
            rel="noreferrer"
            onClick={trackWhatsAppClick}
            className="bg-emerald-green hover:bg-forest text-cream font-poppins font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Botanist</span>
          </a>
        </div>
      </section>

    </motion.div>
  );
}
