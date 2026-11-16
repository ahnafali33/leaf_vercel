import React, { useState } from "react";
import { useAppStore } from "../store";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { 
    cart, updateCartQuantity, removeFromCart, clearCart, 
    discount, applyCoupon, setView 
  } = useAppStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponFeedback("Coupon applied successfully!");
    } else {
      setCouponFeedback("Invalid or expired coupon code.");
    }
  };

  return (
    <motion.div
      key="cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
    >
      <h2 className="font-cinzel text-2xl font-bold tracking-widest text-forest mb-8 text-center uppercase">
        YOUR SHOPPING CART
      </h2>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-cream border border-forest/10 p-4 rounded-xl flex items-center gap-4 shadow-sm"
              >
                <img
                  src={item.product.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=80"}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-forest/10 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow min-w-0">
                  <h3 className="font-playfair text-sm font-bold text-forest truncate">{item.product.name}</h3>
                  <span className="text-[10px] text-forest/50 italic">{item.product.scientificName}</span>
                  <div className="flex items-center gap-4 mt-2">
                    {/* Quantity Changer */}
                    <div className="flex items-center border border-forest/15 rounded-lg overflow-hidden bg-cream-dark/25 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-forest/5 cursor-pointer font-bold text-forest"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-semibold text-forest">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-forest/5 cursor-pointer font-bold text-forest"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-forest">৳{item.product.price * item.quantity}</span>
                  </div>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-[#8A3324] hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Clear and Shop More Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setView("shop")}
                className="text-xs font-semibold text-gold hover:text-forest flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Botanical Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-forest/60 hover:text-[#8A3324] cursor-pointer"
              >
                Clear All Cart Items
              </button>
            </div>
          </div>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-4 bg-cream border border-forest/10 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase pb-2 border-b border-forest/10">
              Order Summary
            </h3>
            
            <div className="space-y-2 text-xs text-forest/75 font-light">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-semibold text-forest">৳{cartSubtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-green">
                  <span>Coupon Discount:</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated shipping:</span>
                <span className="font-semibold text-forest">৳60</span>
              </div>
              <div className="pt-2 border-t border-forest/10 flex justify-between text-sm font-bold text-forest">
                <span>Total Amount:</span>
                <span>৳{cartSubtotal - discount + 60}</span>
              </div>
            </div>

            {/* Coupon entry form */}
            <form onSubmit={handleApplyCouponCode} className="pt-3">
              <label className="text-[10px] font-bold text-forest uppercase block mb-1">PROMOTIONAL COUPON</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AQUA10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow bg-cream-dark/30 border border-forest/15 rounded-lg px-2 py-1.5 text-xs text-forest uppercase focus:outline-none focus:border-gold font-poppins"
                />
                <button
                  type="submit"
                  className="bg-forest hover:bg-gold hover:text-forest-dark text-cream text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponFeedback && (
                <p className="text-[10px] text-emerald-green font-medium mt-1 animate-pulse">{couponFeedback}</p>
              )}
            </form>

            {/* Checkout Buttons */}
            <button
              onClick={() => setView("checkout")}
              className="w-full bg-forest hover:bg-emerald-green text-cream py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center block shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-cream border border-dashed border-forest/15 rounded-2xl p-8 max-w-md mx-auto">
          <span className="text-4xl">🛒</span>
          <h3 className="font-playfair text-base font-bold text-forest mt-4">Your cart is empty</h3>
          <p className="text-xs text-forest/60 font-light mt-1 mb-6">Explore our pristine catalog and select premium specimens to start your forest layout.</p>
          <button
            onClick={() => setView("shop")}
            className="bg-forest hover:bg-emerald-green text-cream px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Browse Species Catalog
          </button>
        </div>
      )}
    </motion.div>
  );
}
