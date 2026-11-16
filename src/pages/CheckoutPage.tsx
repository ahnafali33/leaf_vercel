import React, { useState } from "react";
import { useAppStore } from "../store";
import { motion } from "motion/react";

export default function CheckoutPage() {
  const { 
    paymentSettings, directCheckoutProduct: directCheckout, cart, discount,
    setView, submitCheckout
  } = useAppStore();

  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutDistrict, setCheckoutDistrict] = useState("Inside Dhaka");
  const [checkoutArea, setCheckoutArea] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<"COD" | "Full Payment">("COD");
  const [activeBrandPayment, setActiveBrandPayment] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState("");

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const settings = paymentSettings || {
    bKashEnabled: true,
    bKashNumber: "01799975540",
    bKashAccountType: "Personal",
    bKashInstruction: "Open bKash app -> Choose Send Money -> Enter the number -> Type full amount -> Put ORD number as Reference -> Confirm pin",
    bKashLogo: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?auto=format&fit=crop&q=80&w=300",
    nagadEnabled: true,
    nagadNumber: "01999975540",
    nagadAccountType: "Personal",
    nagadInstruction: "Open Nagad app -> Choose Send Money -> Enter the number -> Type full amount -> Put ORD number as Reference -> Confirm pin",
    nagadLogo: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?auto=format&fit=crop&q=80&w=300",
    accountHolderName: "Ahnaf Ali",
    codEnabled: true,
    codAdvanceAmount: 150,
    codInstruction: "Cash on Delivery is available. A small advance payment of ৳150 is required via bKash/Nagad to confirm every Cash on Delivery order to avoid spam/refusals. Our team will assist you via WhatsApp.",
    whatsappNumber: "8801799975540",
    whatsappLink: "https://wa.me/8801799975540",
    whatsappDefaultMessage: "Hello Leaf Aquatic, I would like to place a Cash on Delivery order."
  };

  const shippingCharge = checkoutDistrict === "Outside Dhaka" ? 120 : 60;
  const items = directCheckout ? [{ product: directCheckout.product, quantity: directCheckout.quantity }] : cart;
  const subtotal = directCheckout ? directCheckout.product.price * directCheckout.quantity : cartSubtotal;
  const grandTotal = subtotal - discount + shippingCharge;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutPhone || !checkoutAddress || !checkoutArea) {
      alert("Please fill in all mandatory address fields.");
      return;
    }

    if (paymentMethodSelected === "Full Payment") {
      if (!senderNumber || !transactionId) {
        alert("Please enter both your sender phone number and the Transaction ID (TrxID) for verification.");
        return;
      }
    }

    const res = await submitCheckout({
      customerName: checkoutName,
      phone: checkoutPhone,
      address: checkoutAddress,
      district: checkoutDistrict,
      area: checkoutArea,
      note: checkoutNote,
      paymentMethod: paymentMethodSelected === "Full Payment" ? activeBrandPayment : "Cash on Delivery",
      paymentNumberUsed: paymentMethodSelected === "Full Payment" ? senderNumber : "",
      paymentTransactionId: paymentMethodSelected === "Full Payment" ? transactionId : "",
      paymentAmount: grandTotal,
      paymentScreenshot: paymentMethodSelected === "Full Payment" ? screenshotFile : "",
    });

    if (res.success) {
      setView("confirmation");
    } else {
      alert(res.error || "Failed to submit order. Please try again.");
    }
  };

  return (
    <motion.div
      key="checkout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
    >
      <h2 className="font-cinzel text-2xl font-bold tracking-widest text-forest mb-8 text-center uppercase">
        SECURE PORTAL CHECKOUT
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Delivery details Form */}
        <div className="lg:col-span-7 bg-cream border border-forest/10 p-6 rounded-2xl shadow-sm">
          <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-4 pb-1 border-b border-forest/10">
            Shipping Details (Bangladesh Delivery)
          </h3>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-forest block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. S.M. Ahnaf Ali"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-forest block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={checkoutPhone}
                onChange={(e) => setCheckoutPhone(e.target.value)}
                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
              />
            </div>

            {/* District Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-forest block mb-1">District *</label>
                <select
                  value={checkoutDistrict}
                  onChange={(e) => setCheckoutDistrict(e.target.value)}
                  className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest focus:outline-none font-poppins font-medium"
                >
                  <option value="Dhaka">Dhaka (৳60 shipping)</option>
                  <option value="Outside Dhaka">Outside Dhaka (৳120 shipping)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Area / Police Station *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banani"
                  value={checkoutArea}
                  onChange={(e) => setCheckoutArea(e.target.value)}
                  className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
                />
              </div>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="text-xs font-medium text-forest block mb-1">Detailed Street Address *</label>
              <textarea
                required
                placeholder="House, Road, Apartment Number, Landmark details..."
                value={checkoutAddress}
                onChange={(e) => setCheckoutAddress(e.target.value)}
                className="w-full h-20 bg-cream-dark/30 border border-forest/15 rounded-lg p-3 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
              />
            </div>

            {/* Order Note */}
            <div>
              <label className="text-xs font-medium text-forest block mb-1">Order Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Pack with thermal insulator layer, call before delivery..."
                value={checkoutNote}
                onChange={(e) => setCheckoutNote(e.target.value)}
                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
              />
            </div>

            {/* Payment Section */}
            <div className="pt-4 border-t border-forest/10 space-y-4">
              <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-2">
                Select Payment Method
              </h4>

              {/* Payment Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethodSelected("Full Payment")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    paymentMethodSelected === "Full Payment"
                      ? "border-[#e2125d] bg-rose-50/5 shadow-sm"
                      : "border-forest/10 hover:border-forest/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      checked={paymentMethodSelected === "Full Payment"}
                      readOnly
                      className="mt-1 accent-[#e2125d]"
                    />
                    <div>
                      <span className="text-xs font-bold text-forest block">Full Payment (Instant)</span>
                      <span className="text-[10px] text-forest/70 block mt-0.5 leading-relaxed">
                        Pay securely via official bKash / Nagad Send Money. Fast & automatic processing.
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 items-center">
                    <span className="bg-[#e2125d]/10 text-[#e2125d] text-[9px] font-bold px-1.5 py-0.5 rounded">bKash</span>
                    <span className="bg-[#f47321]/10 text-[#f47321] text-[9px] font-bold px-1.5 py-0.5 rounded">Nagad</span>
                  </div>
                </div>

                {settings.codEnabled && (
                  <div
                    onClick={() => setPaymentMethodSelected("COD")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      paymentMethodSelected === "COD"
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-forest/10 hover:border-forest/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={paymentMethodSelected === "COD"}
                        readOnly
                        className="mt-1 accent-gold"
                      />
                      <div>
                        <span className="text-xs font-bold text-forest block">Cash on Delivery</span>
                        <span className="text-[10px] text-forest/70 block mt-0.5 leading-relaxed">
                          Pay the courier at delivery. Small advance verification required via WhatsApp.
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="bg-emerald-600/10 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        WhatsApp Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Forms/Instructions based on selection */}
              {paymentMethodSelected === "Full Payment" ? (
                <div className="bg-cream-dark/10 p-5 rounded-xl border border-forest/5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {settings.bKashEnabled && (
                      <button
                        type="button"
                        onClick={() => setActiveBrandPayment("bKash")}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                          activeBrandPayment === "bKash"
                            ? "border-[#e2125d] bg-[#e2125d]/5"
                            : "border-forest/10 hover:border-forest/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#e2125d]" />
                          <span className="text-xs font-bold text-forest">bKash</span>
                        </div>
                        <span className="text-[9px] font-semibold text-[#e2125d]">Select</span>
                      </button>
                    )}

                    {settings.nagadEnabled && (
                      <button
                        type="button"
                        onClick={() => setActiveBrandPayment("Nagad")}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                          activeBrandPayment === "Nagad"
                            ? "border-[#f47321] bg-[#f47321]/5"
                            : "border-forest/10 hover:border-forest/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#f47321]" />
                          <span className="text-xs font-bold text-forest">Nagad</span>
                        </div>
                        <span className="text-[9px] font-semibold text-[#f47321]">Select</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-cream p-4 rounded-xl border border-forest/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                      <span className="text-xs font-bold text-forest uppercase flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${activeBrandPayment === "bKash" ? "bg-[#e2125d]" : "bg-[#f47321]"}`} />
                        {activeBrandPayment} Payment Method Details
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Status: Active</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 text-[10px]">Send Money Number</p>
                        <p className="font-bold text-forest text-sm font-mono tracking-wider">
                          {activeBrandPayment === "bKash" ? settings.bKashNumber : settings.nagadNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px]">Account Type</p>
                        <p className="font-bold text-forest">
                          {activeBrandPayment === "bKash" ? settings.bKashAccountType : settings.nagadAccountType}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-[10px]">Account Holder Name</p>
                      <p className="font-bold text-forest">{settings.accountHolderName}</p>
                    </div>

                    <div className="bg-cream-dark/20 p-3 rounded text-[10px] text-forest/90 leading-relaxed border-l-4 border-gold">
                      <span className="font-bold uppercase block mb-1">Send Money Guide:</span>
                      {activeBrandPayment === "bKash" ? settings.bKashInstruction : settings.nagadInstruction}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-forest block mb-1">
                        Sender Mobile Number (Your account number) *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g., 01XXXXXXXXX"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full bg-cream border border-forest/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-forest block mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 9X29A8K9L"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-cream border border-forest/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-500">Amount Paid (Invoice Total)</p>
                      <p className="text-sm font-bold text-forest font-mono">
                        ৳{grandTotal}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-forest block mb-1">
                        Optional Payment Screenshot
                      </label>
                      <div className="border border-dashed border-forest/20 rounded-lg p-3 text-center bg-cream/50 relative hover:bg-cream-dark/10 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="text-center">
                          <p className="text-xs text-forest/70 font-semibold">
                            {screenshotFile ? "✓ Screenshot Loaded" : "Click or drag your payment proof image here"}
                          </p>
                          <p className="text-[9px] text-gray-500 mt-0.5">JPEG, PNG supported (optional)</p>
                        </div>
                      </div>
                      {screenshotFile && (
                        <div className="mt-2 relative inline-block">
                          <img src={screenshotFile} className="h-16 w-16 object-cover rounded border border-forest/10" alt="screenshot" />
                          <button
                            type="button"
                            onClick={() => setScreenshotFile("")}
                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gold/5 p-5 rounded-xl border border-gold/20 space-y-3">
                  <span className="font-cinzel text-xs font-bold text-forest uppercase block">
                    Cash On Delivery Verified Process
                  </span>
                  <p className="text-[11px] text-forest/90 leading-relaxed">
                    {settings.codInstruction}
                  </p>
                  <div className="bg-cream-dark/15 p-3 rounded border border-forest/5 text-xs text-forest/80 font-mono flex items-center justify-between">
                    <span>Advance Security Amount:</span>
                    <span className="font-bold text-sm">৳{settings.codAdvanceAmount}</span>
                  </div>
                </div>
              )}
            </div>

            {paymentMethodSelected === "Full Payment" ? (
              <button
                id="checkout-full-submit-btn"
                type="submit"
                className="w-full bg-[#e2125d] hover:bg-[#c40f4f] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center block shadow-md mt-6"
              >
                Confirm Payment & Submit Order
              </button>
            ) : (
              <button
                id="checkout-cod-submit-btn"
                type="submit"
                className="w-full bg-forest hover:bg-emerald-green text-cream py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center block shadow-md mt-6"
              >
                Place Cash On Delivery Order
              </button>
            )}
          </form>
        </div>

        {/* Order Items Summary Column */}
        <div className="lg:col-span-5 bg-cream border border-forest/10 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase pb-2 border-b border-forest/10">
            Selected Specimens ({items.length})
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((i: any) => (
              <div key={i.product.id} className="flex items-center gap-3 border-b border-forest/5 pb-3">
                <img
                  src={i.product.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=80"}
                  alt={i.product.name}
                  className="w-12 h-12 rounded object-cover border border-forest/10 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-grow">
                  <h4 className="font-playfair text-xs font-bold text-forest truncate">{i.product.name}</h4>
                  <p className="text-[10px] text-forest/50">Qty: {i.quantity} × ৳{i.product.price}</p>
                </div>
                <span className="text-xs font-bold text-forest">৳{i.product.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-forest/80 font-light border-t border-forest/10 pt-3">
            <div className="flex justify-between">
              <span>Plant Subtotal:</span>
              <span className="font-semibold text-forest">৳{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-green">
                <span>Promotional Discount:</span>
                <span>-৳{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier Delivery Fee ({checkoutDistrict}):</span>
              <span className="font-semibold text-forest">৳{shippingCharge}</span>
            </div>
            <div className="pt-2 border-t border-forest/10 flex justify-between text-base font-bold text-forest">
              <span>Final Order Total:</span>
              <span className="text-emerald-green font-mono">৳{grandTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
