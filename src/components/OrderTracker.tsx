import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package, Clock, CheckCircle, Truck, FileText, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import Breadcrumbs from "./Breadcrumbs";

export default function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const trimmedId = orderId.trim();
      const res = await fetch(`/api/orders/track/${trimmedId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("No active order coordinates found matching this identifier. Please verify your invoice number.");
        }
        throw new Error("Failed to trace order status. Please try again.");
      }
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        throw new Error("Order trace failed.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  // Maps order status to progress step (0 to 3)
  const getProgressStep = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes("completed")) return 3;
    if (s.includes("shipped")) return 2;
    if (s.includes("processing") || s.includes("verified")) return 1;
    return 0; // Created / Pending
  };

  const steps = [
    { title: "Invoice Registered", desc: "Order details received inside our system", icon: FileText },
    { title: "Packaged & Nurtured", desc: "Plants carefully selected, sterilized & packed", icon: Clock },
    { title: "In Transit", desc: "Shipped via climate-controlled courier express", icon: Truck },
    { title: "Completed", desc: "Securely delivered to your ecosystem", icon: CheckCircle },
  ];

  const currentStep = order ? getProgressStep(order.status) : 0;

  return (
    <div className="bg-cream min-h-[70vh] flex flex-col justify-start">
      <Breadcrumbs type="generic" label="Track Order" />

      <div className="max-w-2xl mx-auto px-6 w-full py-10 space-y-8">
        
        {/* Tracker search block */}
        <div className="bg-white/40 border border-forest/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm backdrop-blur-md">
          <div className="text-center space-y-2">
            <h1 className="font-playfair text-2xl md:text-3xl font-light text-forest tracking-tight">
              Trace Your <span className="italic font-normal text-gold">Aquascaping</span> Delivery
            </h1>
            <p className="font-poppins text-xs text-forest/60 max-w-md mx-auto">
              Input your unique order or invoice coordinates (e.g. <span className="font-mono text-gold font-bold">ord-17182394559</span>) to view its real-time fulfillment timeline.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter Invoice / Order ID"
                className="w-full bg-cream/80 border border-forest/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-xl px-4 py-3 text-xs text-forest placeholder:text-forest/40 outline-none transition-all pr-10 font-mono font-medium"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <Search className="absolute right-3 top-3.5 w-4 h-4 text-forest/30" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-forest hover:bg-emerald-green disabled:bg-forest/50 text-cream text-[10px] uppercase font-bold tracking-widest px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-poppins"
            >
              {isLoading ? "Searching..." : "Trace"}
            </button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#8A3324]/5 border border-[#8A3324]/10 rounded-xl p-4 flex gap-3 items-start text-xs text-[#8A3324] max-w-md mx-auto font-poppins"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider text-[10px]">Trace Coordinate Error</p>
              <p className="font-light">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-8 h-8 border-3 border-forest border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest/60 font-poppins">Decrypting Order Path...</span>
          </div>
        )}

        {/* Results Block */}
        {order && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/70 border border-forest/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-md backdrop-blur-md">
              
              {/* Order Info Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-forest/10 pb-4 gap-3">
                <div className="space-y-1 font-poppins">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-forest/5 px-3 py-1 rounded-full">
                    Invoice Trace: {order.id}
                  </span>
                  <p className="text-xs text-forest/60 pt-1">
                    Customer: <strong className="text-forest">{order.customerName}</strong>
                  </p>
                </div>
                <div className="text-left md:text-right font-poppins space-y-1">
                  <p className="text-[10px] text-forest/40 uppercase tracking-wider font-bold">Trace Status</p>
                  <p className="text-xs font-bold text-emerald-green uppercase tracking-wide bg-emerald-green/10 px-3 py-1 rounded-lg inline-block">
                    {order.status}
                  </p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="relative font-poppins py-4">
                {/* Connector Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-forest/10 -translate-x-1/2 hidden md:block"></div>
                
                <div className="space-y-8 relative">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const StepIcon = step.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-row md:items-center gap-6 relative ${
                          idx % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Timeline Icon Node */}
                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-md ${
                              isDone
                                ? "bg-forest border-forest text-cream animate-none"
                                : "bg-cream border-forest/20 text-forest/30"
                            }`}
                          >
                            <StepIcon className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Gap Spacer for Left / Right layouts */}
                        <div className="w-10 h-10 shrink-0 md:hidden"></div>

                        {/* Text Card */}
                        <div className="flex-grow md:w-1/2 font-poppins">
                          <div
                            className={`p-4 rounded-xl border transition-all duration-300 md:max-w-xs ${
                              idx % 2 === 0 ? "md:ml-auto md:text-right" : "md:mr-auto md:text-left"
                            } ${
                              isDone
                                ? "bg-white border-forest/15 shadow-sm"
                                : "bg-white/20 border-transparent text-forest/40"
                            }`}
                          >
                            <h4 className={`text-xs font-bold uppercase tracking-wide ${isDone ? "text-forest" : "text-forest/40"}`}>
                              {step.title}
                            </h4>
                            <p className="text-[10px] text-forest/60 mt-1 font-light leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>

                        {/* Dummy opposite spacer to balance flex row */}
                        <div className="hidden md:block w-1/2"></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary checklist */}
              {order.items && order.items.length > 0 && (
                <div className="border-t border-forest/10 pt-5 space-y-3 font-poppins">
                  <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">Botanical Package Items</h4>
                  <div className="divide-y divide-forest/5 text-xs text-forest/80">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-bold">{item.product?.name || "Premium Aquatic Botanical"}</p>
                          <p className="text-[10px] text-forest/50 font-light">Qty: {item.quantity} × ৳{item.product?.price || 0}</p>
                        </div>
                        <span className="font-bold">৳{item.quantity * (item.product?.price || 0)}</span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between font-bold text-forest">
                      <span>Botanical Total</span>
                      <span>৳{order.total}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
