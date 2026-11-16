import React from "react";
import { useAppStore } from "../store";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";
import { motion } from "motion/react";

export default function WishlistPage() {
  const { wishlist, products, setView } = useAppStore();

  return (
    <motion.div
      key="wishlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
    >
      <h2 className="font-cinzel text-2xl font-bold tracking-widest text-forest mb-8 text-center uppercase">
        YOUR WISH LIST
      </h2>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((id) => {
            const p = products.find((prod) => prod.id === id);
            if (!p) return null;
            return <ProductCard key={p.id} product={p} />;
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream border border-dashed border-forest/15 rounded-2xl p-8 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gold mx-auto fill-gold/10" />
          <h3 className="font-playfair text-base font-bold text-forest mt-4">Your wishlist is empty</h3>
          <p className="text-xs text-forest/60 font-light mt-1 mb-6">Add rare collector plants to your personal save list for future setups.</p>
          <button
            onClick={() => setView("shop")}
            className="bg-forest hover:bg-emerald-green text-cream px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Explore Species
          </button>
        </div>
      )}
    </motion.div>
  );
}
