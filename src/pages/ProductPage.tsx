import React from "react";
import { useAppStore } from "../store";
import ProductImageGallery from "../components/ProductImageGallery";
import ReviewSection from "../components/ReviewSection";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import { 
  ArrowLeft, Activity, Sun, Wind, Thermometer, MessageCircle, Heart 
} from "lucide-react";
import { motion } from "motion/react";

interface ProductPageProps {
  activeProduct: any;
}

export default function ProductPage({ activeProduct }: ProductPageProps) {
  const { 
    products, categories, banners, wishlist, recentlyViewed,
    addToCart, setDirectCheckout, setView, toggleWishlist 
  } = useAppStore();

  if (!activeProduct) return null;

  const whatsappSettings = banners?.whatsapp || {
    phoneNumber: "8801799975540",
    link: "https://wa.me/8801799975540",
    enabled: true,
    defaultMessage: "Hello Leaf Aquatic, I would like to know more about your products."
  };

  const generateWhatsAppProductLink = (product: any) => {
    const text = encodeURIComponent(`Hello Leaf Aquatic! 🌿 I am interested in ordering the premium plant specimen: ${product.name} (৳${product.price}). Please share availability.`);
    return `https://wa.me/${whatsappSettings.phoneNumber}?text=${text}`;
  };

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 md:px-8 py-10"
    >
      <Breadcrumbs type="product" product={activeProduct} categories={categories} />

      {/* Back button */}
      <button
        onClick={() => setView("shop")}
        className="flex items-center gap-1 text-xs font-poppins font-semibold text-forest/70 hover:text-gold mb-8 transition-colors cursor-pointer text-left"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Species Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
        
        {/* Left Side: Images Gallery */}
        <div className="lg:col-span-6">
          <ProductImageGallery images={activeProduct.images} productName={activeProduct.name} />
        </div>

        {/* Right Side: Product Details info */}
        <div className="lg:col-span-6 text-left space-y-6 font-poppins">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-green tracking-widest">{activeProduct.category}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-forest mt-1 leading-tight">{activeProduct.name}</h1>
            <p className="font-sans text-sm md:text-base italic text-forest/60 font-light mt-1">{activeProduct.scientificName}</p>
          </div>

          {/* Pricing with original discount */}
          <div className="flex items-baseline gap-4 border-y border-forest/10 py-3">
            <span className="text-2xl font-bold text-forest">৳{activeProduct.price}</span>
            {activeProduct.originalPrice > activeProduct.price && (
              <>
                <span className="text-sm text-forest/40 line-through">৳{activeProduct.originalPrice}</span>
                <span className="bg-[#8A3324]/10 text-[#8A3324] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save ৳{activeProduct.originalPrice - activeProduct.price}!
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-forest/85 leading-relaxed font-light">{activeProduct.description}</p>

          {/* Species biological specifications Grid */}
          <div className="bg-cream-dark/20 border border-forest/10 rounded-xl p-5 space-y-3">
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-2">SPECIES GROWTH PARAMETERS</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-forest/60 font-light">Tech Level:</span>
                <span className="font-bold text-forest">{activeProduct.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-forest/60 font-light">Lighting:</span>
                <span className="font-bold text-forest">{activeProduct.light}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-forest/60 font-light">CO₂ Input:</span>
                <span className="font-bold text-forest">{activeProduct.co2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-forest/60 font-light">Temperature:</span>
                <span className="font-bold text-forest">{activeProduct.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-light text-forest/60">Tank Placement:</span>
                <span className="font-bold text-forest">{activeProduct.placement}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-light text-forest/60">Growth Speed:</span>
                <span className="font-bold text-forest">{activeProduct.growthRate}</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-forest/70 font-light border-t border-forest/10">
              <strong>Compatibility:</strong> {activeProduct.tankCompatibility}
            </div>
          </div>

          {/* Stock Warning details */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeProduct.stock > 0 ? "bg-emerald-green" : "bg-red-500"}`}></span>
              <span className="font-medium text-forest">{activeProduct.stock > 0 ? "Pruned, Packaged & Available" : "Out of Stock"}</span>
            </div>
            {activeProduct.stock > 0 && activeProduct.stock <= 5 && (
              <span className="text-[#8A3324] font-semibold animate-pulse">⚡ ONLY {activeProduct.stock} POTS REMAINING!</span>
            )}
          </div>

          {/* Buttons Layout */}
          <div className="space-y-3 pt-4">
            {activeProduct.stock > 0 ? (
              <>
                <button
                  id="details-buy-now-btn"
                  onClick={() => {
                    setDirectCheckout({ product: activeProduct, quantity: 1 });
                    setView("checkout");
                  }}
                  className="w-full bg-gold hover:bg-[#D4A62F] text-forest-dark py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer text-center shadow-lg active:scale-[0.98] block"
                >
                  Order Now (Buy Instantly)
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="details-add-to-cart-btn"
                    onClick={() => addToCart(activeProduct, 1)}
                    className="w-full bg-transparent hover:bg-forest/5 text-forest border border-forest/30 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Add To Cart
                  </button>

                  <a
                    href={generateWhatsAppProductLink(activeProduct)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-transparent hover:bg-[#25D366]/5 text-[#25D366] border border-[#25D366]/40 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold uppercase tracking-wider text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </>
            ) : (
              <button
                disabled
                className="w-full bg-forest/15 text-forest/40 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest cursor-not-allowed text-center"
              >
                Sold Out (Pre-order Coming Soon)
              </button>
            )}
          </div>

          {/* Care Instructions Text */}
          <div className="space-y-2 pt-4">
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">HOW TO TRANSITION & PLANT</h4>
            <p className="text-xs text-forest/75 font-light leading-relaxed">{activeProduct.careGuide}</p>
          </div>

          {/* Toggle Wishlist Option */}
          <button
            onClick={() => toggleWishlist(activeProduct.id)}
            className="text-xs font-semibold text-gold hover:text-forest flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span>{wishlist.includes(activeProduct.id) ? "Remove from Wishlist" : "Save to My Private Wishlist"}</span>
          </button>
        </div>

      </div>

      {/* Review section attachment */}
      <ReviewSection product={activeProduct} />

      {/* Recommendations Engine: Recently Viewed Specimen Column */}
      {recentlyViewed.length > 1 && (
        <div className="border-t border-forest/10 pt-10 mt-16 text-left">
          <h3 className="font-cinzel text-lg font-bold text-forest mb-6 uppercase tracking-wider">Recently Viewed Specimens</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed
              .filter((id) => id !== activeProduct.id)
              .slice(0, 4)
              .map((id) => {
                const p = products.find((prod) => prod.id === id);
                if (!p) return null;
                return <ProductCard key={p.id} product={p} />;
              })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
