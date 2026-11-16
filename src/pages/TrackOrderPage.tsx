import React, { useState } from "react";
import { useAppStore } from "../store";
import { Search, Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function TrackOrderPage() {
  const { orders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [foundOrders, setFoundOrders] = useState<any[] | null>(null);

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.trim().toLowerCase();
    const results = orders.filter(
      (o: any) =>
        (o.id && o.id.toLowerCase().includes(term)) ||
        (o.customerPhone && o.customerPhone.toLowerCase().includes(term))
    );

    setFoundOrders(results);
  };

  return (
    <motion.div
      key="track"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 py-10 text-left font-poppins space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
          LIVE SPECIMEN ORDER TRACKER
        </h2>
        <p className="font-cormorant text-sm text-forest/60 italic max-w-md mx-auto">
          Track real-time courier consignment dispatch status using your Order ID or Phone number.
        </p>
      </div>

      <form onSubmit={handleTrackSearch} className="bg-cream border border-forest/10 p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-xs font-bold text-forest uppercase block">
          Enter Order ID or Contact Phone Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. ORD-178239 or 01712345678"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-dark/30 border border-forest/15 rounded-xl pl-9 pr-4 py-3 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
            />
          </div>
          <button
            type="submit"
            className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            Track Order
          </button>
        </div>
      </form>

      {/* Results Section */}
      {foundOrders !== null && (
        <div className="space-y-6">
          {foundOrders.length === 0 ? (
            <div className="bg-cream border border-forest/10 p-8 rounded-2xl text-center space-y-2">
              <Package className="w-10 h-10 text-forest/30 mx-auto" />
              <h3 className="font-playfair text-base font-bold text-forest">No Orders Found</h3>
              <p className="text-xs text-forest/60 italic font-light">
                No active order matched "{searchQuery}". Please check your Order ID from the invoice receipt.
              </p>
            </div>
          ) : (
            foundOrders.map((order: any) => (
              <div key={order.id} className="bg-cream border border-forest/15 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-forest/10 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] text-forest/50 font-bold uppercase block">ORDER ID</span>
                    <span className="font-mono text-base font-bold text-forest">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-forest/50 font-bold uppercase block">TOTAL AMOUNT</span>
                    <span className="font-mono text-sm font-bold text-emerald-green">৳{order.totalAmount}</span>
                  </div>
                </div>

                {/* Progress Bar Timeline */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-green text-cream mx-auto flex items-center justify-center text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-forest block">Placed</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      order.orderStatus === "Processing" || order.orderStatus === "Dispatched" || order.orderStatus === "Delivered"
                        ? "bg-emerald-green text-cream"
                        : "bg-forest/10 text-forest/40"
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-forest block">Processing</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      order.orderStatus === "Dispatched" || order.orderStatus === "Delivered"
                        ? "bg-emerald-green text-cream"
                        : "bg-forest/10 text-forest/40"
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-forest block">Dispatched</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      order.orderStatus === "Delivered"
                        ? "bg-emerald-green text-cream"
                        : "bg-forest/10 text-forest/40"
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-forest block">Delivered</span>
                  </div>
                </div>

                {/* Courier consignment info */}
                {order.courierConsignmentId && (
                  <div className="bg-cream-dark/20 p-4 rounded-xl border border-forest/10 space-y-1 text-xs">
                    <span className="font-bold text-forest block uppercase text-[10px]">Steadfast Courier Consignment ID:</span>
                    <span className="font-mono text-sm font-bold text-forest">{order.courierConsignmentId}</span>
                    {order.courierTrackingUrl && (
                      <a
                        href={order.courierTrackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold font-bold hover:underline block pt-1 text-[11px]"
                      >
                        Track directly on Steadfast Courier Portal →
                      </a>
                    )}
                  </div>
                )}

                {/* Items breakdown */}
                <div className="border-t border-forest/10 pt-4 space-y-2 text-xs">
                  <span className="font-bold text-forest uppercase text-[10px] block">Items in Shipment:</span>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-forest/80">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
