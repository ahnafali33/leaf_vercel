import React from "react";
import { useAppStore } from "../store";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function ContactPage() {
  const { websiteContent } = useAppStore();

  return (
    <motion.div
      key="contact-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto px-6 py-12 text-left font-poppins space-y-12"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase bg-forest/10 px-4 py-1.5 rounded-full inline-block">
          Customer Experience
        </span>
        <h1 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
          Connect With Our Atelier
        </h1>
        <p className="font-cormorant text-base text-forest/70 italic leading-relaxed">
          Have questions about specimen availability, customized aquascaping setups, or nursery coordinates? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-2xl space-y-3 text-left">
          <MapPin className="w-6 h-6 text-gold" />
          <h3 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Boutique Address</h3>
          <p className="text-xs font-light text-forest/75 leading-relaxed">
            {websiteContent?.text?.contactAddress || "Banani Road 11, Dhaka, Bangladesh"}
          </p>
        </div>
        {/* Phone */}
        <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-2xl space-y-3 text-left">
          <Phone className="w-6 h-6 text-gold" />
          <h3 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Support Phone</h3>
          <p className="text-xs font-light text-forest/75 leading-relaxed font-mono">
            {websiteContent?.text?.contactPhone || "+880 171 2345 678"}
          </p>
        </div>
        {/* Email */}
        <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-2xl space-y-3 text-left">
          <Mail className="w-6 h-6 text-gold" />
          <h3 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Email Dispatch</h3>
          <p className="text-xs font-light text-forest/75 leading-relaxed">
            {websiteContent?.text?.contactEmail || "care@leafaquatic.com"}
          </p>
        </div>
      </div>

      <div className="bg-cream-dark/10 border border-forest/10 p-6 md:p-8 rounded-2xl max-w-2xl mx-auto">
        <h3 className="font-cinzel text-sm font-bold text-forest tracking-wider uppercase mb-6 text-center border-b border-forest/10 pb-3">
          Send An Electronic Inquiry
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Inquiry successfully transmitted! Our botanical assistants will email you within 12 hours.");
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-4 text-xs font-poppins font-medium"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-forest font-bold">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ahnaf Ali"
                className="w-full bg-cream border border-forest/15 rounded-xl p-3 focus:outline-none focus:border-gold font-poppins"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-forest font-bold">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. ahnaf@gmail.com"
                className="w-full bg-cream border border-forest/15 rounded-xl p-3 focus:outline-none focus:border-gold font-poppins"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-forest font-bold">Topic of Inquiry</label>
            <select
              required
              className="w-full bg-cream border border-forest/15 rounded-xl p-3 focus:outline-none focus:border-gold font-poppins text-xs font-semibold text-forest"
            >
              <option>General Plant Care & Advisory</option>
              <option>Rare Collector Plant Procurement</option>
              <option>Wholesale Nursery Supply Orders</option>
              <option>Delivery Tracking Support</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-forest font-bold">Your Message</label>
            <textarea
              required
              rows={5}
              placeholder="Detail your request here. Our botanical specialists are here to advise."
              className="w-full bg-cream border border-forest/15 rounded-xl p-3 focus:outline-none focus:border-gold font-poppins font-light"
            />
          </div>
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="bg-forest hover:bg-emerald-green text-cream px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] cursor-pointer shadow-sm font-poppins"
            >
              Transmit Inquiry
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
