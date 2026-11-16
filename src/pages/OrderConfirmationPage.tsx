import React from "react";
import { useAppStore } from "../store";
import { CheckCircle, MessageCircle, Truck } from "lucide-react";
import { motion } from "motion/react";

export default function OrderConfirmationPage() {
  const { lastCreatedOrder, banners, setView } = useAppStore();

  const whatsappSettings = banners?.whatsapp || {
    phoneNumber: "8801799975540",
    link: "https://wa.me/8801799975540"
  };

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h3 className="font-playfair text-xl font-bold text-forest">No active invoice found</h3>
        <p className="text-xs text-forest/60 my-4 font-poppins">Explore our catalog to place an order.</p>
        <button
          onClick={() => setView("shop")}
          className="bg-forest text-cream text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const whatsappShareText = encodeURIComponent(
    `Hello Leaf Aquatic! 🌿 My Order ID is #${lastCreatedOrder.id}. Customer Name: ${lastCreatedOrder.customerName}, Phone: ${lastCreatedOrder.phone}, Total: ৳${lastCreatedOrder.total}. Please confirm my order dispatch.`
  );

  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 py-12 text-center font-poppins"
    >
      <div className="bg-cream border border-forest/15 rounded-3xl p-8 md:p-12 shadow-sm space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-green/10 text-emerald-green rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-forest tracking-wider uppercase">
            INVOICE SUBMITTED & RECEIPT GENERATED
          </h2>
          <p className="text-xs text-forest/70 font-light max-w-md mx-auto">
            Thank you, <strong className="text-forest font-semibold">{lastCreatedOrder.customerName}</strong>! Your specimen reservation has been successfully registered.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-cream-dark/20 border border-forest/10 p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-forest/10 pb-4 gap-2">
            <div>
              <span className="text-[10px] text-forest/50 font-bold uppercase block">SPECIMEN INVOICE ID</span>
              <span className="font-mono text-base font-bold text-forest">#{lastCreatedOrder.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-forest/50 font-bold uppercase block">STATUS</span>
              <span className="bg-gold/20 text-forest-dark font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {lastCreatedOrder.status || "Processing"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-forest/60 text-[10px] uppercase font-bold">Delivery Address</p>
              <p className="font-medium text-forest mt-0.5">{lastCreatedOrder.address}, {lastCreatedOrder.area}, {lastCreatedOrder.district}</p>
              <p className="text-forest/70 mt-1">Phone: {lastCreatedOrder.phone}</p>
            </div>
            <div>
              <p className="text-forest/60 text-[10px] uppercase font-bold">Payment Selected</p>
              <p className="font-medium text-forest mt-0.5">{lastCreatedOrder.paymentMethod || "Cash on Delivery"}</p>
              <p className="text-forest/70 mt-1">Status: {lastCreatedOrder.status}</p>
            </div>
          </div>

          <div className="border-t border-forest/10 pt-4 space-y-2 text-xs">
            <p className="font-bold text-forest uppercase text-[10px]">Ordered Items:</p>
            {lastCreatedOrder.items.map((i: any, index: number) => (
              <div key={i.productId || i.id || index} className="flex justify-between text-forest/85">
                <span>{i.name} (x{i.quantity})</span>
                <span className="font-semibold">৳{i.price * i.quantity}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-forest/10 flex justify-between font-bold text-forest text-sm">
              <span>Invoice Total Amount:</span>
              <span className="text-emerald-green font-mono">৳{lastCreatedOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href={`https://wa.me/${whatsappSettings.phoneNumber}?text=${whatsappShareText}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#1eb354] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Receipt on WhatsApp</span>
          </a>

          <button
            onClick={() => setView("shop")}
            className="flex-1 bg-forest hover:bg-emerald-green text-cream py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setView("shop")}
            className="text-xs font-semibold text-gold hover:text-forest underline cursor-pointer"
          >
            Return to Species Collection
          </button>
        </div>
      </div>
    </motion.div>
  );
}
