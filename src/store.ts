/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { Product, Order, BlogPost, Coupon, BannerSettings, LegalSettings, CartItem, PaymentSettings, Category } from "./types";

interface AppState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  blogs: BlogPost[];
  coupons: Coupon[];
  banners: BannerSettings | null;
  legal: LegalSettings | null;
  paymentSettings: PaymentSettings | null;
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
  couponCode: string;
  discount: number; // Discount value applied to current cart
  isLoading: boolean;
  error: string | null;

  // View coordination
  activeView: "home" | "shop" | "details" | "cart" | "checkout" | "wishlist" | "blog" | "blog-details" | "admin" | "legal-page" | "confirmation" | "quiz";
  activeProductId: string | null;
  activeBlogId: string | null;
  activeLegalKey: "privacy" | "terms" | "refund" | "shipping" | null;
  lastCreatedOrder: Order | null;
  directCheckoutProduct: { product: Product; quantity: number } | null;

  // Actions
  fetchDB: () => Promise<void>;
  setDirectCheckout: (item: { product: Product; quantity: number } | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  clearCart: () => void;
  submitCheckout: (checkoutData: {
    customerName: string;
    phone: string;
    address: string;
    district: string;
    area: string;
    note: string;
    paymentMethod?: string;
    paymentNumberUsed?: string;
    paymentTransactionId?: string;
    paymentAmount?: number;
    paymentScreenshot?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // Admin Actions
  adminAddCategory: (category: Omit<Category, "id">) => Promise<void>;
  adminUpdateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  adminDeleteCategory: (id: string) => Promise<void>;
  adminAddProduct: (product: Omit<Product, "id" | "reviews">) => Promise<void>;
  adminUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  adminDeleteProduct: (id: string) => Promise<void>;
  adminAddBlog: (blog: Omit<BlogPost, "id" | "date">) => Promise<void>;
  adminUpdateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  adminDeleteBlog: (id: string) => Promise<void>;
  adminUpdateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  adminAddCoupon: (coupon: Coupon) => Promise<void>;
  adminDeleteCoupon: (code: string) => Promise<void>;
  adminUpdateBanners: (banners: Partial<BannerSettings>) => Promise<void>;
  adminUpdateLegal: (legal: Partial<LegalSettings>) => Promise<void>;
  adminUpdatePaymentSettings: (settings: Partial<PaymentSettings>) => Promise<void>;
  adminApproveReview: (prodId: string, revId: string) => Promise<void>;
  adminRejectReview: (prodId: string, revId: string) => Promise<void>;
  adminToggleFeaturedReview: (prodId: string, revId: string) => Promise<void>;
  addCustomerReview: (prodId: string, review: { author: string; rating: number; text: string }) => Promise<void>;
  seoSettings: any;
  adminUpdateSEOSettings: (settings: any) => Promise<void>;
  websiteContent: any;
  cloudinarySettings: any;
  courierSettings: any;
  domainSettings: any;
  adminUpdateWebsiteContent: (content: any) => Promise<void>;
  adminUpdateCloudinarySettings: (settings: any) => Promise<void>;
  adminUpdateCourierSettings: (settings: any) => Promise<void>;
  adminUpdateDomainSettings: (settings: any) => Promise<void>;
  checkDomainDNS: (domain: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  sendOrderToCourier: (orderId: string) => Promise<{ success: boolean; consignment?: any; error?: string }>;
  checkOrderCourierStatus: (orderId: string) => Promise<{ success: boolean; statusData?: any; error?: string }>;
  fetchCourierBalance: () => Promise<{ success: boolean; balance?: any; error?: string }>;

  // Navigation helpers
  setView: (view: AppState["activeView"], targetId?: string | null) => void;
  showLegal: (key: "privacy" | "terms" | "refund" | "shipping") => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  products: [],
  categories: [],
  orders: [],
  blogs: [],
  coupons: [],
  banners: null,
  legal: null,
  paymentSettings: null,
  seoSettings: null,
  websiteContent: null,
  cloudinarySettings: null,
  courierSettings: null,
  domainSettings: null,
  cart: [],
  wishlist: JSON.parse(localStorage.getItem("leaf_wishlist") || "[]"),
  recentlyViewed: JSON.parse(localStorage.getItem("leaf_recent") || "[]"),
  couponCode: "",
  discount: 0,
  isLoading: true,
  error: null,

  activeView: "home",
  activeProductId: null,
  activeBlogId: null,
  activeLegalKey: null,
  lastCreatedOrder: null,
  directCheckoutProduct: null,
  setDirectCheckout: (item) => set({ directCheckoutProduct: item }),

  fetchDB: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/db");
      if (!response.ok) throw new Error("Failed to load store database.");
      const db = await response.json();
      set({
        products: db.products,
        categories: db.categories,
        orders: db.orders,
        blogs: db.blogs,
        coupons: db.coupons,
        banners: db.banners,
        legal: db.legal,
        paymentSettings: db.paymentSettings || null,
        seoSettings: db.seoSettings || null,
        websiteContent: db.websiteContent || null,
        cloudinarySettings: db.cloudinarySettings || null,
        courierSettings: db.courierSettings || null,
        domainSettings: db.domainSettings || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "An error occurred fetching data.", isLoading: false });
    }
  },

  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existing = cart.find((item) => item.product.id === product.id);

    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      );
    } else {
      updated = [...cart, { product, quantity: Math.min(product.stock, quantity) }];
    }

    set({ cart: updated });
    get().applyCoupon(get().couponCode); // Recalculate discount
  },

  updateCartQuantity: (productId, quantity) => {
    const { cart } = get();
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(item.product.stock, Math.max(1, quantity)) };
      }
      return item;
    });
    set({ cart: updated });
    get().applyCoupon(get().couponCode); // Recalculate discount
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    const updated = cart.filter((item) => item.product.id !== productId);
    set({ cart: updated });
    get().applyCoupon(get().couponCode); // Recalculate discount
  },

  toggleWishlist: (productId) => {
    const { wishlist } = get();
    const updated = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    localStorage.setItem("leaf_wishlist", JSON.stringify(updated));
    set({ wishlist: updated });
  },

  applyCoupon: (code) => {
    if (!code) {
      set({ couponCode: "", discount: 0 });
      return { success: false, message: "" };
    }

    const { coupons, cart, directCheckoutProduct } = get();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      set({ couponCode: "", discount: 0 });
      return { success: false, message: "Invalid coupon code." };
    }

    const expiry = new Date(coupon.expiryDate);
    if (expiry < new Date()) {
      set({ couponCode: "", discount: 0 });
      return { success: false, message: "This coupon has expired." };
    }

    // Calculate subtotal
    const subtotal = directCheckoutProduct
      ? directCheckoutProduct.product.price * directCheckoutProduct.quantity
      : cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(subtotal, discount);

    set({ couponCode: coupon.code, discount });
    return { success: true, message: `Coupon applied: Saved ৳${discount}!` };
  },

  clearCart: () => {
    set({ cart: [], couponCode: "", discount: 0 });
  },

  submitCheckout: async (checkoutData) => {
    set({ isLoading: true });
    try {
      const { directCheckoutProduct, cart, couponCode } = get();
      const itemsToSend = directCheckoutProduct
        ? [{ productId: directCheckoutProduct.product.id, name: directCheckoutProduct.product.name, quantity: directCheckoutProduct.quantity }]
        : cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
          }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkoutData,
          items: itemsToSend,
          couponCode: couponCode,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Order checkout failed.");
      }

      set({
        lastCreatedOrder: res.order,
        cart: directCheckoutProduct ? get().cart : [],
        directCheckoutProduct: null,
        couponCode: "",
        discount: 0,
        activeView: "confirmation",
      });

      // Refresh product list due to stock change
      await get().fetchDB();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin Actions
  adminAddCategory: async (category) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!res.ok) throw new Error("Failed to add category");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateCategory: async (id, category) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!res.ok) throw new Error("Failed to update category");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminDeleteCategory: async (id) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminAddProduct: async (product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to add product");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateProduct: async (id, product) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminDeleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminAddBlog: async (blog) => {
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (!res.ok) throw new Error("Failed to add blog");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateBlog: async (id, blog) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminDeleteBlog: async (id) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminAddCoupon: async (coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coupon),
      });
      if (!res.ok) throw new Error("Failed to add coupon");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminDeleteCoupon: async (code) => {
    try {
      const res = await fetch(`/api/admin/coupons/${code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateBanners: async (banners) => {
    try {
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners),
      });
      if (!res.ok) throw new Error("Failed to update banners");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateLegal: async (legal) => {
    try {
      const res = await fetch("/api/admin/legal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(legal),
      });
      if (!res.ok) throw new Error("Failed to update legal pages");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdatePaymentSettings: async (settings) => {
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update payment settings");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminApproveReview: async (prodId, revId) => {
    try {
      const res = await fetch(`/api/reviews/approve/${prodId}/${revId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve review");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminRejectReview: async (prodId, revId) => {
    try {
      const res = await fetch(`/api/reviews/reject/${prodId}/${revId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to reject review");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminToggleFeaturedReview: async (prodId, revId) => {
    try {
      const res = await fetch(`/api/reviews/toggle-featured/${prodId}/${revId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle featured status of review");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  addCustomerReview: async (prodId, review) => {
    try {
      const res = await fetch(`/api/reviews/add/${prodId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error("Failed to add review");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateSEOSettings: async (settings) => {
    try {
      const res = await fetch("/api/admin/seo-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update SEO settings");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateWebsiteContent: async (content) => {
    try {
      const res = await fetch("/api/admin/website-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Failed to update website content");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateCloudinarySettings: async (settings) => {
    try {
      const res = await fetch("/api/admin/cloudinary-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update Cloudinary settings");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateCourierSettings: async (settings) => {
    try {
      const res = await fetch("/api/admin/courier-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update Courier settings");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  adminUpdateDomainSettings: async (settings) => {
    try {
      const res = await fetch("/api/admin/domain-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update Domain settings");
      await get().fetchDB();
    } catch (err) {
      console.error(err);
    }
  },

  checkDomainDNS: async (domain) => {
    try {
      const res = await fetch(`/api/admin/domain-settings/check-dns?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to check DNS propagation");
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  sendOrderToCourier: async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/send-to-steadfast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send order to Steadfast Courier");
      }
      await get().fetchDB();
      return { success: true, consignment: data.consignment };
    } catch (err: any) {
      console.error("sendOrderToCourier error:", err);
      return { success: false, error: err.message };
    }
  },

  checkOrderCourierStatus: async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/steadfast-status`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to check status");
      return { success: true, statusData: data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  fetchCourierBalance: async () => {
    try {
      const res = await fetch("/api/admin/courier-balance");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch balance");
      return { success: true, balance: data.current_balance || data.balance || data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  setView: (view, targetId = null) => {
    if (view === "details" && targetId) {
      const { recentlyViewed } = get();
      const updatedRecent = [targetId, ...recentlyViewed.filter((id) => id !== targetId)].slice(0, 4);
      localStorage.setItem("leaf_recent", JSON.stringify(updatedRecent));
      set({ activeView: view, activeProductId: targetId, recentlyViewed: updatedRecent });
    } else if (view === "blog-details" && targetId) {
      set({ activeView: view, activeBlogId: targetId });
    } else {
      set({ activeView: view, activeProductId: null, activeBlogId: null, activeLegalKey: null });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showLegal: (key) => {
    set({ activeView: "legal-page", activeLegalKey: key });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}));
