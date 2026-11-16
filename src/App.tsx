/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, lazy, Suspense } from "react";
import { useAppStore } from "./store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BannerSlider from "./components/BannerSlider";
import ProductCard from "./components/ProductCard";
import ReviewSection from "./components/ReviewSection";
import ReviewsSlider from "./components/ReviewsSlider";
import QuizModal from "./components/QuizModal";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductImagesManager from "./components/ProductImagesManager";
import SEOEngine from "./components/SEOEngine";
import WebsiteCMS from "./components/WebsiteCMS";
import { 
  ShoppingBag, Trash2, Heart, ArrowRight, ArrowLeft, Tag, HelpCircle, 
  Settings, Check, Send, CheckCircle2, ChevronRight, MessageCircle, AlertTriangle, Star, 
  Activity, Sun, Wind, Thermometer, ShieldCheck, Plus, Pencil, Trash, FileText, Layout,
  CreditCard, Globe, Sliders, MapPin, Phone, Mail, Loader2, Truck, ExternalLink, RefreshCw,
  Cloud, Copy, Server, Radio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate, Link, Routes, Route } from "react-router-dom";
import OrderTracker from "./components/OrderTracker";
import Breadcrumbs from "./components/Breadcrumbs";
import {
  HomepageSkeleton,
  CategoryPageSkeleton,
  ProductDetailsSkeleton,
  BlogSkeleton,
  BlogDetailsSkeleton,
  ShoppingCartSkeleton,
  CheckoutSkeleton,
  QuizSkeleton,
  AdminDashboardSkeleton,
  LegalPageSkeleton,
  ReviewSkeleton
} from "./components/Skeleton";
// @ts-ignore
import aquascapingInspirationImg1 from "./assets/images/aquascaping_inspiration_1782394559700.jpg";

// Route-level Lazy Loaded Page Modules
const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const PlantFinderPage = lazy(() => import("./pages/PlantFinderPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { 
    products, categories, orders, blogs, coupons, banners, legal, paymentSettings,
    cart, wishlist, recentlyViewed, couponCode, discount, isLoading, error,
    activeView, activeProductId, activeBlogId, activeLegalKey, lastCreatedOrder,
    directCheckoutProduct, setDirectCheckout,
    fetchDB, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, applyCoupon, 
    clearCart, submitCheckout, setView, showLegal,
    adminAddProduct, adminUpdateProduct, adminDeleteProduct,
    adminAddCategory, adminUpdateCategory, adminDeleteCategory,
    adminAddBlog, adminUpdateBlog, adminDeleteBlog,
    adminUpdateOrderStatus, adminAddCoupon, adminDeleteCoupon,
    adminUpdateBanners, adminUpdateLegal, adminUpdatePaymentSettings,
    adminApproveReview, adminRejectReview, adminToggleFeaturedReview,
    seoSettings, adminUpdateSEOSettings,
    websiteContent, adminUpdateWebsiteContent,
    cloudinarySettings, adminUpdateCloudinarySettings,
    courierSettings, adminUpdateCourierSettings, sendOrderToCourier, checkOrderCourierStatus, fetchCourierBalance,
    domainSettings, adminUpdateDomainSettings, checkDomainDNS
  } = useAppStore();

  // Search, Filters & Sorting for Shop Page
  const [shopCategory, setShopCategory] = useState("All");
  const [shopPrice, setShopPrice] = useState(10000); // Max Price
  const [shopDifficulty, setShopDifficulty] = useState("All");
  const [shopLight, setShopLight] = useState("All");
  const [shopCO2, setShopCO2] = useState("All");
  const [shopSort, setShopSort] = useState("popular");
  const [shopSearch, setShopSearch] = useState("");
  const [shopBrand, setShopBrand] = useState("All");
  const [shopAvailability, setShopAvailability] = useState("All");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);

  // URL Path -> Store State Synchronization (with dynamic loading fallback support)
  useEffect(() => {
    if (isLoading) return; // Wait until loaded

    const path = location.pathname;

    if (path === "/") {
      if (activeView !== "home") setView("home");
    } else if (path === "/shop") {
      if (activeView !== "shop") setView("shop");
      if (shopCategory !== "All") setShopCategory("All");
    } else if (path === "/blog" || path === "/journal") {
      if (activeView !== "blog") setView("blog");
    } else if (path === "/ai-plant-finder" || path === "/quiz") {
      if (activeView !== "quiz") setView("quiz");
    } else if (path === "/cart") {
      if (activeView !== "cart") setView("cart");
    } else if (path === "/wishlist") {
      if (activeView !== "wishlist") setView("wishlist");
    } else if (path === "/checkout") {
      if (activeView !== "checkout") setView("checkout");
    } else if (path === "/admin") {
      if (activeView !== "admin") setView("admin");
    } else if (path === "/confirmation") {
      if (activeView !== "confirmation") setView("confirmation");
    } else if (path === "/track-order") {
      if (activeView !== ("track-order" as any)) setView("track-order" as any);
    } else if (path === "/about") {
      if (activeView !== ("about" as any)) setView("about" as any);
    } else if (path === "/contact") {
      if (activeView !== ("contact" as any)) setView("contact" as any);
    } else if (path === "/categories") {
      if (activeView !== ("categories" as any)) setView("categories" as any);
    } else if (path === "/privacy-policy") {
      if (activeView !== "legal-page" || activeLegalKey !== "privacy") showLegal("privacy");
    } else if (path === "/terms") {
      if (activeView !== "legal-page" || activeLegalKey !== "terms") showLegal("terms");
    } else if (path === "/refund-policy") {
      if (activeView !== "legal-page" || activeLegalKey !== "refund") showLegal("refund");
    } else if (path === "/shipping-policy") {
      if (activeView !== "legal-page" || activeLegalKey !== "shipping") showLegal("shipping");
    } else {
      // Check dynamic product slug /product/:slug
      const prodMatch = path.match(/^\/product\/([^/]+)$/);
      if (prodMatch) {
        const slug = prodMatch[1];
        const matched = products.find(p => {
          const s = p.seo?.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return s === slug || p.id === slug;
        });
        if (matched) {
          if (activeView !== "details" || activeProductId !== matched.id) {
            setView("details", matched.id);
          }
        } else {
          if (products.length > 0) {
            setView("404" as any);
          }
        }
        return;
      }

      // Check dynamic blog slug /blog/:slug
      const blogMatch = path.match(/^\/blog\/([^/]+)$/);
      if (blogMatch) {
        const slug = blogMatch[1];
        const matched = blogs.find(b => {
          const s = b.seo?.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return s === slug || b.id === slug;
        });
        if (matched) {
          if (activeView !== "blog-details" || activeBlogId !== matched.id) {
            setView("blog-details", matched.id);
          }
        } else {
          if (blogs.length > 0) {
            setView("404" as any);
          }
        }
        return;
      }

      // Check dynamic category slug /category/:slug
      const catMatch = path.match(/^\/category\/([^/]+)$/);
      if (catMatch) {
        const slug = catMatch[1];
        const matched = categories.find(c => {
          const s = c.seo?.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return s === slug || c.id === slug;
        });
        if (matched) {
          if (activeView !== "shop" || shopCategory !== matched.name) {
            setShopCategory(matched.name);
            setView("shop");
          }
        } else {
          if (categories.length > 0) {
            setView("404" as any);
          }
        }
        return;
      }

      // 404 Not Found Page fallback
      if (products.length > 0 && categories.length > 0 && blogs.length > 0) {
        setView("404" as any);
      }
    }
    setIsInitialSyncDone(true);
  }, [location.pathname, isLoading, products, categories, blogs]);

  // Store State -> URL Path Bidirectional Synchronization
  useEffect(() => {
    if (isLoading) return;
    if (!isInitialSyncDone) return;

    let expectedPath = "/";

    if (activeView === "home") {
      expectedPath = "/";
    } else if (activeView === "shop") {
      if (shopCategory !== "All") {
        const cat = categories.find(c => c.name === shopCategory);
        if (cat) {
          const slug = cat.seo?.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          expectedPath = `/category/${slug}`;
        } else {
          expectedPath = "/shop";
        }
      } else {
        expectedPath = "/shop";
      }
    } else if (activeView === "blog") {
      expectedPath = "/blog";
    } else if (activeView === "quiz") {
      expectedPath = "/ai-plant-finder";
    } else if (activeView === "cart") {
      expectedPath = "/cart";
    } else if (activeView === "wishlist") {
      expectedPath = "/wishlist";
    } else if (activeView === "checkout") {
      expectedPath = "/checkout";
    } else if (activeView === "admin") {
      expectedPath = "/admin";
    } else if (activeView === "confirmation") {
      expectedPath = "/confirmation";
    } else if (activeView === ("track-order" as any)) {
      expectedPath = "/track-order";
    } else if (activeView === ("about" as any)) {
      expectedPath = "/about";
    } else if (activeView === ("contact" as any)) {
      expectedPath = "/contact";
    } else if (activeView === ("categories" as any)) {
      expectedPath = "/categories";
    } else if (activeView === "details" && activeProductId) {
      const p = products.find(prod => prod.id === activeProductId);
      if (p) {
        const slug = p.seo?.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        expectedPath = `/product/${slug}`;
      } else {
        expectedPath = `/product/${activeProductId}`;
      }
    } else if (activeView === "blog-details" && activeBlogId) {
      const b = blogs.find(blog => blog.id === activeBlogId);
      if (b) {
        const slug = b.seo?.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        expectedPath = `/blog/${slug}`;
      } else {
        expectedPath = `/blog/${activeBlogId}`;
      }
    } else if (activeView === "legal-page" && activeLegalKey) {
      if (activeLegalKey === "privacy") expectedPath = "/privacy-policy";
      else if (activeLegalKey === "terms") expectedPath = "/terms";
      else if (activeLegalKey === "refund") expectedPath = "/refund-policy";
      else if (activeLegalKey === "shipping") expectedPath = "/shipping-policy";
    } else if (activeView === ("404" as any)) {
      return; // Maintain original wrong path in address bar
    }

    if (location.pathname !== expectedPath) {
      navigate(expectedPath);
    }
  }, [activeView, activeProductId, activeBlogId, activeLegalKey, shopCategory, isLoading, products, categories, blogs]);

  // Checkout Fields
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutDistrict, setCheckoutDistrict] = useState("Dhaka");
  const [checkoutArea, setCheckoutArea] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Bangladesh checkout payment states
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<"Full Payment" | "Cash on Delivery">("Full Payment");
  const [activeBrandPayment, setActiveBrandPayment] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<string>("");

  // Admin Dashboard States
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminActiveSub, setAdminActiveSub] = useState<"products" | "orders" | "blogs" | "coupons" | "banners" | "legal" | "reviews" | "payments" | "categories" | "seo" | "cms" | "courier" | "domain">("products");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [adminOrderFilter, setAdminOrderFilter] = useState<"active" | "completed" | "cancelled" | "all">("active");
  const [adminPaymentSubTab, setAdminPaymentSubTab] = useState<"bkash-nagad" | "cod" | "verification" | "history">("bkash-nagad");
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);

  // Custom Domain & Google Cloud State
  const [adminDomainForm, setAdminDomainForm] = useState({
    customDomain: "leafaquatic.com",
    subdomain: "www.leafaquatic.com",
    forceHttps: true,
    canonicalRedirect: true,
    googleCloudProject: "leafaquatic-app",
    cloudRunService: "leafaquatic-service",
    cloudRunRegion: "asia-east1",
    sslStatus: "Active",
    txtVerificationCode: "google-site-verification=leafaquatic-verification-key"
  });
  const [dnsCheckLoading, setDnsCheckLoading] = useState(false);
  const [dnsCheckResult, setDnsCheckResult] = useState<any>(null);
  const [copiedDnsKey, setCopiedDnsKey] = useState<string | null>(null);

  useEffect(() => {
    if (domainSettings) {
      setAdminDomainForm({
        customDomain: domainSettings.customDomain || "leafaquatic.com",
        subdomain: domainSettings.subdomain || "www.leafaquatic.com",
        forceHttps: domainSettings.forceHttps !== false,
        canonicalRedirect: domainSettings.canonicalRedirect !== false,
        googleCloudProject: domainSettings.googleCloudProject || "leafaquatic-app",
        cloudRunService: domainSettings.cloudRunService || "leafaquatic-service",
        cloudRunRegion: domainSettings.cloudRunRegion || "asia-east1",
        sslStatus: domainSettings.sslStatus || "Active",
        txtVerificationCode: domainSettings.txtVerificationCode || "google-site-verification=leafaquatic-verification-key"
      });
    }
  }, [domainSettings]);

  // Admin Form States
  const [adminProductForm, setAdminProductForm] = useState({
    id: "",
    name: "",
    scientificName: "",
    price: 0,
    originalPrice: 0,
    description: "",
    careGuide: "",
    difficulty: "Low Tech" as "Low Tech" | "Mid Tech" | "High Tech",
    light: "Low" as "Low" | "Medium" | "High",
    co2: "None" as "None" | "Low" | "High",
    category: "Anubias",
    images: [] as string[],
    stock: 10,
    growthRate: "Slow" as "Slow" | "Medium" | "Fast",
    placement: "Foreground" as "Foreground" | "Midground" | "Background",
    temperature: "22-28°C",
    tankCompatibility: "Shrimp safe",
    slug: ""
  });

  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [isUploadingBlogImg, setIsUploadingBlogImg] = useState(false);

  const uploadImageToServer = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`File too large: ${file.name}. Maximum file size is 10MB.`);
      return "";
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Upload failed");
    }

    const data = await res.json();
    return data.url || base64;
  };

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [adminCategoryForm, setAdminCategoryForm] = useState({
    id: "",
    name: "",
    image: "",
    slug: ""
  });

  const [adminBlogForm, setAdminBlogForm] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "Aquarium Plant Care Guides",
    tags: "",
    author: "Ahnaf Ali",
    readTime: "5 min read",
    image: "",
    faqQuestion1: "",
    faqAnswer1: "",
    faqQuestion2: "",
    faqAnswer2: "",
    seoTitle: "",
    seoDescription: "",
    slug: ""
  });

  const [adminCouponForm, setAdminCouponForm] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    expiryDate: "2027-12-31"
  });

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);

  // Admin WhatsApp Settings Form States
  const [adminWhatsappPhone, setAdminWhatsappPhone] = useState("");
  const [adminWhatsappLink, setAdminWhatsappLink] = useState("");
  const [adminWhatsappEnabled, setAdminWhatsappEnabled] = useState(true);
  const [adminWhatsappMessage, setAdminWhatsappMessage] = useState("");

  // Admin Payment Settings Form States
  const [adminBKashEnabled, setAdminBKashEnabled] = useState(true);
  const [adminBKashNumber, setAdminBKashNumber] = useState("");
  const [adminBKashAccountType, setAdminBKashAccountType] = useState("Personal");
  const [adminBKashInstruction, setAdminBKashInstruction] = useState("");
  const [adminNagadEnabled, setAdminNagadEnabled] = useState(true);
  const [adminNagadNumber, setAdminNagadNumber] = useState("");
  const [adminNagadAccountType, setAdminNagadAccountType] = useState("Personal");
  const [adminNagadInstruction, setAdminNagadInstruction] = useState("");
  const [adminAccountHolderName, setAdminAccountHolderName] = useState("");
  const [adminCodEnabled, setAdminCodEnabled] = useState(true);
  const [adminCodAdvanceAmount, setAdminCodAdvanceAmount] = useState(150);
  const [adminCodInstruction, setAdminCodInstruction] = useState("");
  const [adminPayWhatsappNumber, setAdminPayWhatsappNumber] = useState("");
  const [adminPayWhatsappLink, setAdminPayWhatsappLink] = useState("");
  const [adminPayWhatsappDefaultMessage, setAdminPayWhatsappDefaultMessage] = useState("");
  const [adminShippingChargeDhaka, setAdminShippingChargeDhaka] = useState(60);
  const [adminShippingChargeOutside, setAdminShippingChargeOutside] = useState(120);

  // Sync WhatsApp settings state when banners are loaded
  useEffect(() => {
    if (banners?.whatsapp) {
      setAdminWhatsappPhone(banners.whatsapp.phoneNumber || "");
      setAdminWhatsappLink(banners.whatsapp.link || "");
      setAdminWhatsappEnabled(banners.whatsapp.enabled ?? true);
      setAdminWhatsappMessage(banners.whatsapp.defaultMessage || "");
    }
  }, [banners]);

  // Sync Payment settings when loaded
  useEffect(() => {
    if (paymentSettings) {
      setAdminBKashEnabled(paymentSettings.bKashEnabled ?? true);
      setAdminBKashNumber(paymentSettings.bKashNumber || "");
      setAdminBKashAccountType(paymentSettings.bKashAccountType || "Personal");
      setAdminBKashInstruction(paymentSettings.bKashInstruction || "");
      setAdminNagadEnabled(paymentSettings.nagadEnabled ?? true);
      setAdminNagadNumber(paymentSettings.nagadNumber || "");
      setAdminNagadAccountType(paymentSettings.nagadAccountType || "Personal");
      setAdminNagadInstruction(paymentSettings.nagadInstruction || "");
      setAdminAccountHolderName(paymentSettings.accountHolderName || "");
      setAdminCodEnabled(paymentSettings.codEnabled ?? true);
      setAdminCodAdvanceAmount(paymentSettings.codAdvanceAmount ?? 150);
      setAdminCodInstruction(paymentSettings.codInstruction || "");
      setAdminPayWhatsappNumber(paymentSettings.whatsappNumber || "");
      setAdminPayWhatsappLink(paymentSettings.whatsappLink || "");
      setAdminPayWhatsappDefaultMessage(paymentSettings.whatsappDefaultMessage || "");
      setAdminShippingChargeDhaka(paymentSettings.shippingChargeDhaka ?? 60);
      setAdminShippingChargeOutside(paymentSettings.shippingChargeOutside ?? 120);
    }
  }, [paymentSettings]);

  // Submit Handler for Admin WhatsApp configurations
  const handleUpdateWhatsappSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedWhatsapp = {
      phoneNumber: adminWhatsappPhone,
      link: adminWhatsappLink,
      enabled: adminWhatsappEnabled,
      defaultMessage: adminWhatsappMessage
    };
    await adminUpdateBanners({
      whatsapp: updatedWhatsapp
    });
    alert("WhatsApp configurations updated successfully!");
  };

  // Submit Handler for Admin Payment configurations
  const handleUpdatePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdatePaymentSettings({
      bKashEnabled: adminBKashEnabled,
      bKashNumber: adminBKashNumber,
      bKashAccountType: adminBKashAccountType,
      bKashInstruction: adminBKashInstruction,
      nagadEnabled: adminNagadEnabled,
      nagadNumber: adminNagadNumber,
      nagadAccountType: adminNagadAccountType,
      nagadInstruction: adminNagadInstruction,
      accountHolderName: adminAccountHolderName,
      codEnabled: adminCodEnabled,
      codAdvanceAmount: adminCodAdvanceAmount,
      codInstruction: adminCodInstruction,
      whatsappNumber: adminPayWhatsappNumber,
      whatsappLink: adminPayWhatsappLink,
      whatsappDefaultMessage: adminPayWhatsappDefaultMessage,
      shippingChargeDhaka: adminShippingChargeDhaka,
      shippingChargeOutside: adminShippingChargeOutside
    });
    alert("Payment configurations and gateway settings updated successfully!");
  };

  useEffect(() => {
    fetchDB();
  }, [fetchDB]);

  // Steadfast Courier States & Sync
  const [courierForm, setCourierForm] = useState({
    apiKey: "",
    secretKey: "",
    baseUrl: "https://portal.steadfast.com.bd/api/v1",
    autoSendOnConfirm: true
  });
  const [sendingOrderIds, setSendingOrderIds] = useState<Record<string, boolean>>({});
  const [checkingOrderIds, setCheckingOrderIds] = useState<Record<string, boolean>>({});
  const [courierBalance, setCourierBalance] = useState<number | string | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [courierTestResult, setCourierTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (courierSettings) {
      setCourierForm({
        apiKey: courierSettings.apiKey || "",
        secretKey: courierSettings.secretKey || "",
        baseUrl: courierSettings.baseUrl || "https://portal.steadfast.com.bd/api/v1",
        autoSendOnConfirm: courierSettings.autoSendOnConfirm !== false
      });
    }
  }, [courierSettings]);

  const handleDispatchToSteadfast = async (orderId: string) => {
    setSendingOrderIds((prev) => ({ ...prev, [orderId]: true }));
    const res = await sendOrderToCourier(orderId);
    setSendingOrderIds((prev) => ({ ...prev, [orderId]: false }));
    if (res.success) {
      alert(`Order #${orderId} successfully dispatched to Steadfast Courier! Consignment ID: ${res.consignment?.consignment_id || res.consignment?.id || 'Created'}`);
    } else {
      alert(`Failed to send order to Steadfast Courier: ${res.error}`);
    }
  };

  const handleCheckSteadfastStatus = async (orderId: string) => {
    setCheckingOrderIds((prev) => ({ ...prev, [orderId]: true }));
    const res = await checkOrderCourierStatus(orderId);
    setCheckingOrderIds((prev) => ({ ...prev, [orderId]: false }));
    if (res.success) {
      const statusStr = res.statusData?.delivery_status || res.statusData?.consignment?.status || "Status Updated";
      alert(`Live Steadfast Delivery Status for Order #${orderId}: ${statusStr.toUpperCase()}`);
    } else {
      alert(`Error checking Steadfast status: ${res.error}`);
    }
  };

  const handleSaveCourierSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdateCourierSettings(courierForm);
    alert("Steadfast Courier API configuration saved successfully!");
  };

  const handleFetchCourierBalance = async () => {
    setIsCheckingBalance(true);
    const res = await fetchCourierBalance();
    setIsCheckingBalance(false);
    if (res.success) {
      setCourierBalance(res.balance);
      setCourierTestResult({ success: true, message: `Connected! Account balance: ৳${res.balance}` });
    } else {
      setCourierBalance(null);
      setCourierTestResult({ success: false, message: res.error || "Connection failed." });
    }
  };

  // Dynamic SEO Integration Engine for Client Preview & Crawler Indexing
  useEffect(() => {
    if (!seoSettings) return;

    let title = seoSettings.homepage?.websiteTitle || "Leaf Aquatic - Premium Aquarium Plants";
    let description = seoSettings.homepage?.homepageDescription || "Exotic, high-quality, pest-free aquatic plants and rare mosses.";
    let keywords = seoSettings.homepage?.homepageKeywords || "aquarium plants, mosses, leaf aquatic";
    let ogImage = seoSettings.homepage?.homepageOgImage || "";
    let schemaMarkup = "";

    // 1. Resolve current active view and extract specific SEO fields
    if (activeView === "details" && activeProductId) {
      const activeProduct = products.find((p) => p.id === activeProductId);
      if (activeProduct) {
        const seo = activeProduct.seo || {};
        title = seo.seoTitle || `${activeProduct.name} | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
        description = seo.metaDescription || activeProduct.description || description;
        keywords = seo.customMetaKeywords || activeProduct.difficulty || keywords;
        ogImage = seo.ogImage || (activeProduct.images && activeProduct.images[0]) || ogImage;
        schemaMarkup = seo.productSchema || "{}";
      }
    } else if (activeView === "blog-details" && activeBlogId) {
      const activeBlog = blogs.find((b) => b.id === activeBlogId);
      if (activeBlog) {
        const seo = activeBlog.seo || {};
        title = seo.seoTitle || `${activeBlog.title} | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
        description = seo.metaDescription || activeBlog.excerpt || description;
        keywords = seo.customMetaKeywords || keywords;
        ogImage = seo.ogImage || activeBlog.image || ogImage;
        schemaMarkup = seo.articleSchema || "{}";
      }
    } else if (activeView === "shop") {
      if (shopCategory !== "All") {
        const activeCategory = categories.find((c) => c.name === shopCategory || c.id === shopCategory);
        if (activeCategory) {
          const seo = activeCategory.seo || {};
          title = seo.seoTitle || `${activeCategory.name} Category | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
          description = seo.metaDescription || description;
          ogImage = seo.ogImage || activeCategory.image || ogImage;
          schemaMarkup = seo.categorySchema || "{}";
        }
      } else if (seoSettings.pages?.shop) {
        title = seoSettings.pages.shop.seoTitle || title;
        description = seoSettings.pages.shop.metaDescription || description;
        ogImage = seoSettings.pages.shop.ogImage || ogImage;
      }
    } else if (activeView === "legal-page" && activeLegalKey) {
      const pageSEO = seoSettings.pages?.[activeLegalKey];
      if (pageSEO) {
        title = pageSEO.seoTitle || `${activeLegalKey.replace("-", " ")} | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
        description = pageSEO.metaDescription || description;
        ogImage = pageSEO.ogImage || ogImage;
      }
    } else if (activeView === "cart") {
      title = `Shopping Cart | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
    } else if (activeView === "checkout") {
      title = `Checkout Invoice | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
    } else if (activeView === "wishlist") {
      title = `My Wishlist | ${seoSettings.global?.businessName || "Leaf Aquatic"}`;
    }

    // Apply document title
    document.title = title;

    // Apply Dynamic Canonical URL
    const canonicalUrl = window.location.origin + window.location.pathname;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    // Helper to update/create meta tag
    const updateMeta = (nameAttr: string, valueAttr: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Apply Meta Description & Keywords
    updateMeta("name", "description", description);
    updateMeta("name", "keywords", keywords);

    // Google Search Console Site Verification
    if (seoSettings.searchConsole?.searchConsoleCode) {
      updateMeta("name", "google-site-verification", seoSettings.searchConsole.searchConsoleCode);
    }

    // Open Graph Social Meta Tags
    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:type", activeView === "blog-details" ? "article" : "website");
    if (ogImage) {
      updateMeta("property", "og:image", ogImage);
    }

    // Twitter Card Social Meta Tags
    updateMeta("name", "twitter:title", title);
    updateMeta("name", "twitter:description", description);
    updateMeta("name", "twitter:card", "summary_large_image");
    if (ogImage) {
      updateMeta("name", "twitter:image", ogImage);
    }

    // Dynamic JSON-LD schema injection
    if (schemaMarkup && schemaMarkup !== "{}") {
      try {
        let scriptTag = document.getElementById("dynamic-seo-schema") as HTMLScriptElement;
        if (!scriptTag) {
          scriptTag = document.createElement("script");
          scriptTag.type = "application/ld+json";
          scriptTag.id = "dynamic-seo-schema";
          document.head.appendChild(scriptTag);
        }
        scriptTag.text = schemaMarkup;
      } catch (err) {
        console.error("Failed to parse schema markup", err);
      }
    } else {
      // Remove any previously injected detail schemas to keep DOM pristine
      const scriptTag = document.getElementById("dynamic-seo-schema");
      if (scriptTag) scriptTag.remove();
    }

    // Dynamic Google Analytics 4 (GA4) Injection
    if (seoSettings.analytics?.ga4MeasurementId) {
      const gaId = seoSettings.analytics.ga4MeasurementId;
      if (!document.getElementById("dynamic-ga4-script")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-ga4-script";
        scriptEl.async = true;
        scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(scriptEl);

        const initScript = document.createElement("script");
        initScript.id = "dynamic-ga4-init";
        initScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(initScript);
      }
    }

    // Dynamic Google Tag Manager (GTM) Injection
    if (seoSettings.analytics?.gtmId) {
      const gtmId = seoSettings.analytics.gtmId;
      if (!document.getElementById("dynamic-gtm-script")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-gtm-script";
        scriptEl.text = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(scriptEl);
      }
    }

    // Dynamic Facebook Pixel Injection
    if (seoSettings.analytics?.facebookPixelId) {
      const pixelId = seoSettings.analytics.facebookPixelId;
      if (!document.getElementById("dynamic-fbpixel-script")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-fbpixel-script";
        scriptEl.text = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(scriptEl);
      }
    }

    // Dynamic Microsoft Clarity Injection
    if (seoSettings.analytics?.clarityId) {
      const clarityId = seoSettings.analytics.clarityId;
      if (!document.getElementById("dynamic-clarity-script")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "dynamic-clarity-script";
        scriptEl.text = `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `;
        document.head.appendChild(scriptEl);
      }
    }
  }, [activeView, activeProductId, activeBlogId, activeLegalKey, shopCategory, seoSettings, products, categories, blogs]);

  // Handle Order submit
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dbSettings = paymentSettings || {
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

    if (paymentMethodSelected === "Full Payment") {
      if (!senderNumber.trim()) {
        alert("Please enter the Sender Mobile Number used to send the payment.");
        return;
      }
      if (!transactionId.trim()) {
        alert("Please enter your Transaction ID.");
        return;
      }
    }

    const payMethod = paymentMethodSelected === "Full Payment" ? activeBrandPayment : "Cash on Delivery";
    const payAmt = cartSubtotal - discount + shippingCharge;

    const res = await submitCheckout({
      customerName: checkoutName,
      phone: checkoutPhone,
      address: checkoutAddress,
      district: checkoutDistrict,
      area: checkoutArea,
      note: checkoutNote,
      paymentMethod: payMethod,
      paymentNumberUsed: senderNumber,
      paymentTransactionId: transactionId,
      paymentAmount: payAmt,
      paymentScreenshot: screenshotFile,
    });

    if (res.success) {
      const savedCheckoutDistrict = checkoutDistrict;
      const savedCheckoutArea = checkoutArea;
      
      // Clear forms
      setCheckoutName("");
      setCheckoutPhone("");
      setCheckoutAddress("");
      setCheckoutArea("");
      setCheckoutNote("");
      setSenderNumber("");
      setTransactionId("");
      setScreenshotFile("");

      if (paymentMethodSelected === "Cash on Delivery") {
        // Redirect to WhatsApp with pre-filled message
        const prodsList = checkoutItems.map(item => `• ${item.product.name} (Qty: ${item.quantity})`).join("\n");
        const waMsg = `Hello Leaf Aquatic,

I would like to place a Cash on Delivery order.

Order Details:
${prodsList}

Total Price: ৳${payAmt}
Delivery District: ${savedCheckoutDistrict}
Delivery Area: ${savedCheckoutArea}

I understand that a small advance payment of ৳${dbSettings.codAdvanceAmount} is required to confirm my Cash on Delivery order.`;

        const finalWaNumber = dbSettings.whatsappNumber.replace(/[^0-9]/g, "");
        const waUrl = `https://api.whatsapp.com/send?phone=${finalWaNumber}&text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  // Dynamic WhatsApp Settings with database configuration fallbacks
  const whatsappSettings = banners?.whatsapp || {
    phoneNumber: "8801799975540",
    link: "https://wa.me/8801799975540",
    enabled: true,
    defaultMessage: "Hello Leaf Aquatic, I would like to know more about your products."
  };

  // WhatsApp helper for product orders
  const generateWhatsAppProductLink = (product: any) => {
    const text = encodeURIComponent(`Hello Leaf Aquatic! 🌿 I am interested in ordering the premium plant specimen: ${product.name} (৳${product.price}). Please share availability.`);
    return `https://wa.me/${whatsappSettings.phoneNumber}?text=${text}`;
  };

  // WhatsApp checkout helper
  const generateWhatsAppOrderLink = (order: any) => {
    const itemsText = order.items.map((i: any) => `- ${i.name} x${i.quantity} (৳${i.price * i.quantity})`).join("\n");
    const text = encodeURIComponent(`*Leaf Aquatic Invoice: ${order.id}* 🌿\n\n*Customer Details:*\nName: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}, ${order.area}, ${order.district}\nNote: ${order.note || "None"}\n\n*Order Items:*\n${itemsText}\n\n*Total Amount:* ৳${order.total} (includes shipping: ৳${order.shippingCharge})\n\nPlease verify and process my order!`);
    return `https://wa.me/${whatsappSettings.phoneNumber}?text=${text}`;
  };

  // Click tracking helper for WhatsApp Buttons (GA4 & Facebook Pixel)
  const trackWhatsAppClick = () => {
    console.log("Tracking WhatsApp Button Click:", {
      phone: whatsappSettings.phoneNumber,
      timestamp: new Date().toISOString()
    });
    
    // Google Analytics 4 tracking
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "whatsapp_click", {
        method: "WhatsApp",
        phone_number: whatsappSettings.phoneNumber,
        event_category: "Engagement",
        event_label: "WhatsApp Chat Click"
      });
    }
    
    // Facebook Pixel tracking
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Contact", {
        content_name: "WhatsApp Button Click",
        content_category: "Engagement"
      });
    }
  };

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(couponInput);
    setCouponFeedback(result.message);
  };

  // Filter products for Shop Page
  const filteredProducts = products.filter((p: any) => {
    const matchCat = shopCategory === "All" || p.category === shopCategory;
    const matchPrice = p.price <= shopPrice;
    const matchDiff = shopDifficulty === "All" || p.difficulty === shopDifficulty;
    const matchLight = shopLight === "All" || p.light === shopLight;
    const matchCO2 = shopCO2 === "All" || p.co2 === shopCO2;
    const matchSearch = (p.name || "").toLowerCase().includes(shopSearch.toLowerCase()) || 
                        (p.scientificName || "").toLowerCase().includes(shopSearch.toLowerCase());

    const pBrand = p.brand || (p.id === "prod-2" || p.id === "prod-5" ? "ADA" : p.id === "prod-3" ? "Tropica" : "Leaf Premium");
    const matchBrand = shopBrand === "All" || pBrand === shopBrand;

    const matchAvailability = shopAvailability === "All" || 
      (shopAvailability === "In Stock" && p.stock > 0) || 
      (shopAvailability === "Out of Stock" && p.stock === 0);

    return matchCat && matchPrice && matchDiff && matchLight && matchCO2 && matchSearch && matchBrand && matchAvailability;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (shopSort === "price-low") return a.price - b.price;
    if (shopSort === "price-high") return b.price - a.price;
    if (shopSort === "newest") return b.id.localeCompare(a.id);
    return 0; // popular
  });

  const featuredProducts = websiteContent?.homepageSections?.featuredProducts?.length > 0
    ? websiteContent.homepageSections.featuredProducts.map((id: string) => products.find(p => p.id === id)).filter(Boolean)
    : products.slice(0, 3);

  const formatOrderTime = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return isoString;
    }
  };

  const handleCopyOrderInfo = (order: any) => {
    const itemsText = order.items.map((it: any) => `- ${it.name} x${it.quantity} (৳${it.price * it.quantity})`).join("\n");
    const textToCopy = `=== LEAF AQUATIC ORDER INVOICE ===
Order ID: ${order.id}
Date: ${formatOrderTime(order.createdAt)}
Status: ${order.status}

CUSTOMER DETAILS:
Name: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address}, ${order.area}, ${order.district}
Special Note: ${order.note || "None"}

ORDER ITEMS:
${itemsText}

SUMMARY:
Subtotal: ৳${order.total - order.shippingCharge}
Shipping Charge: ৳${order.shippingCharge}
Total Paid: ৳${order.total}
==================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };
  const bestSellers = websiteContent?.homepageSections?.bestSellers?.length > 0
    ? websiteContent.homepageSections.bestSellers.map((id: string) => products.find(p => p.id === id)).filter(Boolean)
    : products.slice(2, 6);

  // Active product details extraction
  const activeProduct = products.find((p) => p.id === activeProductId);
  // Active blog extraction
  const activeBlog = blogs.find((b) => b.id === activeBlogId);

  // Total Calculations supporting direct Buy Now or full cart
  const checkoutItems = directCheckoutProduct
    ? [{ product: directCheckoutProduct.product, quantity: directCheckoutProduct.quantity }]
    : cart;

  const cartSubtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCharge = (checkoutDistrict || "").toLowerCase() === "dhaka"
    ? (cartSubtotal >= 3000 ? 0 : (paymentSettings?.shippingChargeDhaka ?? 60))
    : (paymentSettings?.shippingChargeOutside ?? 120);
  const cartTotal = Math.max(0, cartSubtotal - discount) + (cartSubtotal > 0 ? shippingCharge : 0);

  return (
    <div className="min-h-screen bg-cream font-sans text-forest-dark flex flex-col justify-between selection:bg-gold selection:text-forest-dark pb-16 md:pb-0">
      
      {/* Dynamic Announcement Line / Offer Banner */}
      {banners?.offer && (
        <div className="bg-gold text-forest-dark text-[10px] md:text-xs font-poppins font-semibold py-2 overflow-hidden relative w-full flex items-center select-none border-b border-forest/5">
          <div className="animate-marquee flex gap-12 whitespace-nowrap w-full">
            <span className="flex gap-12 shrink-0">
              <Link to="/shop" className="hover:underline">
                {banners.offer.text.replace(/1500/g, "3000")}
              </Link>
              <Link to="/shop" className="hover:underline">
                {banners.offer.text.replace(/1500/g, "3000")}
              </Link>
            </span>
            <span className="flex gap-12 shrink-0" aria-hidden="true">
              <Link to="/shop" className="hover:underline">
                {banners.offer.text.replace(/1500/g, "3000")}
              </Link>
              <Link to="/shop" className="hover:underline">
                {banners.offer.text.replace(/1500/g, "3000")}
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Primary Layout Views */}
      <main className="flex-grow">
        
        {isLoading && (
          <div className="min-h-[500px]">
            {(() => {
              const path = location.pathname;
              if (path === "/") return <HomepageSkeleton />;
              if (path === "/shop" || path.startsWith("/category/")) return <CategoryPageSkeleton />;
              if (path === "/blog" || path === "/journal") return <BlogSkeleton />;
              if (path.startsWith("/blog/")) return <BlogDetailsSkeleton />;
              if (path === "/ai-plant-finder" || path === "/quiz") return <QuizSkeleton />;
              if (path === "/cart") return <ShoppingCartSkeleton />;
              if (path === "/checkout") return <CheckoutSkeleton />;
              if (path === "/admin") return <AdminDashboardSkeleton />;
              if (path.startsWith("/product/")) return <ProductDetailsSkeleton />;
              if (["/privacy-policy", "/terms", "/refund-policy", "/shipping-policy"].includes(path)) return <LegalPageSkeleton />;
              
              // Fallback
              return <HomepageSkeleton />;
            })()}
          </div>
        )}

        {/* View Switcher */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            
            {(() => {
              const homeView = activeView === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-16"
              >
                {/* Hero banner slider with falling leaf details */}
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

                {/* Customer Reviews Spotlight / Care Previews */}
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

            const shopView = activeView === "shop" && (
              <motion.div
                key="shop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto px-6 md:px-8 py-10"
              >
                {shopCategory !== "All" ? (
                  <Breadcrumbs type="category" category={shopCategory} categories={categories} />
                ) : (
                  <Breadcrumbs type="generic" label="Shop" />
                )}

                <div className="text-center mb-10">
                  <h2 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider">
                    THE SPECIES COLLECTION
                  </h2>
                  <p className="font-cormorant text-sm text-forest/60 italic mt-1">
                    Carefully harvested, sterilized, and labeled. Filter by technology level, lighting specs, or CO₂ parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  
                  {/* Shop Filters Panel (Desktop Sidebar) */}
                  <div className="hidden lg:block lg:col-span-1 space-y-6 bg-cream border border-forest/10 p-6 rounded-2xl text-left shadow-sm h-fit">
                    <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                      <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">
                        FILTER SPECIMENS
                      </h3>
                      <button
                        onClick={() => {
                          setShopCategory("All");
                          setShopPrice(10000);
                          setShopDifficulty("All");
                          setShopLight("All");
                          setShopCO2("All");
                          setShopBrand("All");
                          setShopAvailability("All");
                          setShopSearch("");
                        }}
                        className="text-[10px] text-gold font-poppins font-semibold hover:underline"
                      >
                        Reset All
                      </button>
                    </div>

                    {/* Search Keyword */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Search Keyword</label>
                      <input
                        type="text"
                        placeholder="Search species name..."
                        value={shopSearch}
                        onChange={(e) => setShopSearch(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Botanical Category</label>
                      <select
                        value={shopCategory}
                        onChange={(e) => setShopCategory(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                      >
                        <option value="All">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.id || c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Max Price Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-forest uppercase">
                        <span>Max Budget</span>
                        <span>৳{shopPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="8000"
                        step="50"
                        value={shopPrice}
                        onChange={(e) => setShopPrice(Number(e.target.value))}
                        className="w-full accent-gold bg-cream-dark h-1 rounded-full cursor-pointer"
                      />
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Technology Level</label>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {["All", "Low Tech", "Mid Tech", "High Tech"].map((d) => (
                          <label key={d} className="flex items-center gap-2 text-xs font-poppins text-forest/85 cursor-pointer">
                            <input
                              type="radio"
                              name="diff"
                              checked={shopDifficulty === d}
                              onChange={() => setShopDifficulty(d)}
                              className="accent-gold"
                            />
                            <span>{d === "All" ? "All Levels" : d}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Light Requirement */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Light Requirement</label>
                      <select
                        value={shopLight}
                        onChange={(e) => setShopLight(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                      >
                        <option value="All">All Lighting Conditions</option>
                        <option value="Low">Low Light</option>
                        <option value="Medium">Medium Light</option>
                        <option value="High">High Light</option>
                      </select>
                    </div>

                    {/* CO2 Requirement */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">CO₂ injection</label>
                      <select
                        value={shopCO2}
                        onChange={(e) => setShopCO2(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                      >
                        <option value="All">All Systems</option>
                        <option value="None">No CO₂ Necessary</option>
                        <option value="Low">Low CO₂ Injection</option>
                        <option value="High">High CO₂ Injection</option>
                      </select>
                    </div>

                    {/* Brand Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Brand</label>
                      <select
                        value={shopBrand}
                        onChange={(e) => setShopBrand(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                      >
                        <option value="All">All Brands</option>
                        <option value="ADA">ADA (Aqua Design Amano)</option>
                        <option value="Tropica">Tropica Aquarium Plants</option>
                        <option value="Leaf Premium">Leaf Premium Botanicals</option>
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Availability</label>
                      <select
                        value={shopAvailability}
                        onChange={(e) => setShopAvailability(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                      >
                        <option value="All">All Items</option>
                        <option value="In Stock">In Stock Only</option>
                        <option value="Out of Stock">Out of Stock Only</option>
                      </select>
                    </div>

                    {/* Sorting option */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-forest uppercase">Sort By</label>
                      <select
                        value={shopSort}
                        onChange={(e) => setShopSort(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins font-medium"
                      >
                        <option value="popular">Popular Specimen</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest Additions</option>
                      </select>
                    </div>
                  </div>

                  {/* Shop Products Grid */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Desktop status bar */}
                    <div className="hidden lg:flex justify-between items-center bg-cream-dark/25 p-3 rounded-xl border border-forest/5 font-poppins text-xs text-forest">
                      <span>Displaying <strong>{sortedProducts.length}</strong> beautiful plant specimens</span>
                      <div className="flex gap-2">
                        {shopCategory !== "All" && (
                          <span className="bg-forest text-cream text-[9px] px-2 py-0.5 rounded-full">{shopCategory}</span>
                        )}
                        {shopDifficulty !== "All" && (
                          <span className="bg-forest text-cream text-[9px] px-2 py-0.5 rounded-full">{shopDifficulty}</span>
                        )}
                        {shopBrand !== "All" && (
                          <span className="bg-forest text-cream text-[9px] px-2 py-0.5 rounded-full">{shopBrand}</span>
                        )}
                        {shopAvailability !== "All" && (
                          <span className="bg-forest text-cream text-[9px] px-2 py-0.5 rounded-full">{shopAvailability}</span>
                        )}
                      </div>
                    </div>

                    {/* Mobile filter trigger bar */}
                    <div className="lg:hidden flex justify-between items-center bg-cream-dark/25 p-3 rounded-xl border border-forest/5 font-poppins text-xs text-forest">
                      <span>Displaying <strong>{sortedProducts.length}</strong> specimens</span>
                      <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="bg-forest hover:bg-gold text-cream hover:text-forest-dark px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Filter
                      </button>
                    </div>

                    {/* Mobile Filter Drawer */}
                    <AnimatePresence>
                      {isMobileFilterOpen && (
                        <>
                          {/* Backdrop */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-forest-dark/50 backdrop-blur-sm z-50 lg:hidden"
                          />
                          {/* Drawer Content */}
                          <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed right-0 top-0 bottom-0 w-[280px] bg-cream p-6 shadow-2xl z-50 flex flex-col gap-5 text-left overflow-y-auto lg:hidden font-poppins"
                          >
                            <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">
                                FILTER SPECIMENS
                              </h3>
                              <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="text-xs font-bold text-[#8A3324] hover:underline"
                              >
                                Close
                              </button>
                            </div>

                            {/* Reset Button */}
                            <button
                              onClick={() => {
                                setShopCategory("All");
                                setShopPrice(10000);
                                setShopDifficulty("All");
                                setShopLight("All");
                                setShopCO2("All");
                                setShopBrand("All");
                                setShopAvailability("All");
                                setShopSearch("");
                              }}
                              className="text-left text-xs font-bold text-gold uppercase hover:underline"
                            >
                              Reset All Filters
                            </button>

                            {/* Search Keyword */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Search Keyword</label>
                              <input
                                type="text"
                                placeholder="Search species name..."
                                value={shopSearch}
                                onChange={(e) => setShopSearch(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none focus:border-gold font-poppins"
                              />
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Botanical Category</label>
                              <select
                                value={shopCategory}
                                onChange={(e) => setShopCategory(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                              >
                                <option value="All">All Categories</option>
                                {categories.map((c) => (
                                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Max Price Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-forest uppercase">
                                <span>Max Budget</span>
                                <span>৳{shopPrice}</span>
                              </div>
                              <input
                                type="range"
                                min="100"
                                max="8000"
                                step="50"
                                value={shopPrice}
                                onChange={(e) => setShopPrice(Number(e.target.value))}
                                className="w-full accent-gold bg-cream-dark h-1 rounded-full cursor-pointer"
                              />
                            </div>

                            {/* Difficulty Level */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Technology Level</label>
                              <div className="flex flex-col gap-1.5 pt-1">
                                {["All", "Low Tech", "Mid Tech", "High Tech"].map((d) => (
                                  <label key={d} className="flex items-center gap-2 text-xs font-poppins text-forest/85 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="diff-mobile"
                                      checked={shopDifficulty === d}
                                      onChange={() => setShopDifficulty(d)}
                                      className="accent-gold"
                                    />
                                    <span>{d === "All" ? "All Levels" : d}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Light Requirement */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Light Requirement</label>
                              <select
                                value={shopLight}
                                onChange={(e) => setShopLight(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                              >
                                <option value="All">All Lighting Conditions</option>
                                <option value="Low">Low Light</option>
                                <option value="Medium">Medium Light</option>
                                <option value="High">High Light</option>
                              </select>
                            </div>

                            {/* CO2 Requirement */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">CO₂ injection</label>
                              <select
                                value={shopCO2}
                                onChange={(e) => setShopCO2(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                              >
                                <option value="All">All Systems</option>
                                <option value="None">No CO₂ Necessary</option>
                                <option value="Low">Low CO₂ Injection</option>
                                <option value="High">High CO₂ Injection</option>
                              </select>
                            </div>

                            {/* Brand Filter */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Brand</label>
                              <select
                                value={shopBrand}
                                onChange={(e) => setShopBrand(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                              >
                                <option value="All">All Brands</option>
                                <option value="ADA">ADA (Aqua Design Amano)</option>
                                <option value="Tropica">Tropica Aquarium Plants</option>
                                <option value="Leaf Premium">Leaf Premium Botanicals</option>
                              </select>
                            </div>

                            {/* Availability Filter */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Availability</label>
                              <select
                                value={shopAvailability}
                                onChange={(e) => setShopAvailability(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins"
                              >
                                <option value="All">All Items</option>
                                <option value="In Stock">In Stock Only</option>
                                <option value="Out of Stock">Out of Stock Only</option>
                              </select>
                            </div>

                            {/* Sorting option */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-forest uppercase">Sort By</label>
                              <select
                                value={shopSort}
                                onChange={(e) => setShopSort(e.target.value)}
                                className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg p-2 text-xs text-forest focus:outline-none font-poppins font-medium"
                              >
                                <option value="popular">Popular Specimen</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest Additions</option>
                              </select>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {sortedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-24 bg-cream border border-dashed border-forest/15 rounded-2xl p-8">
                        <span className="text-3xl">🥀</span>
                        <h3 className="font-playfair text-base font-bold text-forest mt-3">No specimens found</h3>
                        <p className="text-xs text-forest/60 max-w-sm mx-auto font-light leading-relaxed mt-1">
                          No aquatic plants currently fit your strict selection. Try increasing your max budget slider or setting filters to "All".
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            );

            const detailsView = activeView === "details" && activeProduct && (
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

                    {/* Buttons: Watch-inspired High-Conversion Layout */}
                    <div className="space-y-3 pt-4">
                      {activeProduct.stock > 0 ? (
                        <>
                          {/* Primary full-width high-visibility Buy Now button */}
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

                          {/* Secondary items: Add to Cart & Order via WhatsApp */}
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
                        .filter((id) => id !== activeProductId)
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

            const cartView = activeView === "cart" && (
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

            const checkoutView = activeView === "checkout" && (() => {
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
                            {/* Option 1: Full Payment via bKash / Nagad */}
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

                            {/* Option 2: Cash on Delivery */}
                            {settings.codEnabled && (
                              <div
                                onClick={() => setPaymentMethodSelected("Cash on Delivery")}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                                  paymentMethodSelected === "Cash on Delivery"
                                    ? "border-gold bg-gold/5 shadow-sm"
                                    : "border-forest/10 hover:border-forest/20"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <input
                                    type="radio"
                                    checked={paymentMethodSelected === "Cash on Delivery"}
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
                              {/* Brand Selectors inside Full Payment */}
                              <div className="grid grid-cols-2 gap-3">
                                {/* bKash card selector */}
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

                                {/* Nagad card selector */}
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

                              {/* Active Payment Method Instructions and Credentials Box */}
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

                                {/* Instructions Box */}
                                <div className="bg-cream-dark/20 p-3 rounded text-[10px] text-forest/90 leading-relaxed border-l-4 border-gold">
                                  <span className="font-bold uppercase block mb-1">Send Money Guide:</span>
                                  {activeBrandPayment === "bKash" ? settings.bKashInstruction : settings.nagadInstruction}
                                </div>
                              </div>

                              {/* Transaction Details Fields */}
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

                                {/* Amount verification */}
                                <div>
                                  <p className="text-[10px] text-gray-500">Amount Paid (Invoice Total)</p>
                                  <p className="text-sm font-bold text-forest font-mono">
                                    ৳{cartSubtotal - discount + shippingCharge}
                                  </p>
                                </div>

                                {/* Optional Screenshot upload */}
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
                                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Cash on Delivery Information */
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
                            className="w-full bg-forest hover:bg-emerald-green text-cream py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md text-center"
                          >
                            Confirm Payment & Order (৳{cartSubtotal - discount + shippingCharge})
                          </button>
                        ) : (
                          <button
                            id="checkout-cod-whatsapp-btn"
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-cream py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" /> Continue via WhatsApp to Confirm Order
                          </button>
                        )}
                      </form>
                    </div>

                  {/* Summary Checklist Panel */}
                  <div className="lg:col-span-5 bg-cream border border-forest/10 p-6 rounded-2xl space-y-4 shadow-sm">
                    <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase pb-2 border-b border-forest/10">
                      Verify Invoice Summary
                    </h3>

                    <div className="divide-y divide-forest/5 max-h-60 overflow-y-auto pr-2">
                      {checkoutItems.map((item) => (
                        <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                          <span className="truncate max-w-[200px] text-forest font-medium">{item.product.name} x{item.quantity}</span>
                          <span className="font-semibold text-forest">৳{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-forest/10 space-y-2 text-xs text-forest/75 font-light">
                      <div className="flex justify-between">
                        <span>Cart Subtotal:</span>
                        <span>৳{cartSubtotal}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-green">
                          <span>Coupon discount:</span>
                          <span>-৳{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Courier delivery charge:</span>
                        <span>৳{shippingCharge}</span>
                      </div>
                      <div className="pt-2 border-t border-forest/10 flex justify-between text-sm font-bold text-forest">
                        <span>Invoice Total:</span>
                        <span>৳{cartSubtotal - discount + shippingCharge}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDirectCheckout(null);
                        setView(directCheckoutProduct ? "shop" : "cart");
                      }}
                      className="w-full border border-forest/15 hover:border-gold text-forest text-xs py-2.5 rounded-xl transition-all font-semibold text-center cursor-pointer block font-sans"
                    >
                      {directCheckoutProduct ? "Cancel & Continue Shopping" : "Edit Cart Items"}
                    </button>
                  </div>

                </div>
              </motion.div>
            )})();

            const wishlistView = activeView === "wishlist" && (
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

            const blogView = activeView === "blog" && (
              <motion.div
                key="blog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
              >
                <div className="text-center mb-12">
                  <h2 className="font-cinzel text-3xl font-extrabold text-forest tracking-wider uppercase">
                    AQUASCAPE GURU ACADEMY
                  </h2>
                  <p className="font-cormorant text-sm text-forest/60 italic mt-1">
                    Care guidelines, design tutorials, and water parameters compiled by our veteran aquascape biologists.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {blogs.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setView("blog-details", b.id)}
                      className="bg-cream border border-forest/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="h-56 overflow-hidden bg-cream-dark relative">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-forest text-cream text-[10px] font-bold tracking-wider px-3 py-1 rounded-md uppercase">
                          {b.category}
                        </span>
                      </div>
                      <div className="p-6 space-y-3 flex-grow flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-center gap-3 text-[10px] text-forest/50">
                            <span>By {b.author}</span>
                            <span>•</span>
                            <span>{b.readTime}</span>
                          </div>
                          <h3 className="font-playfair text-lg font-bold text-forest group-hover:text-gold transition-colors mt-2 leading-snug">
                            {b.title}
                          </h3>
                          <p className="text-xs text-forest/75 font-light leading-relaxed mt-2 line-clamp-2">
                            {b.excerpt}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-forest/5 mt-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {b.tags.slice(0, 2).map((t) => (
                              <span key={t} className="bg-cream-dark text-forest text-[9px] px-2 py-0.5 rounded-full font-medium">#{t}</span>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Guide <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );

            const blogDetailsView = activeView === "blog-details" && activeBlog && (
              <motion.div
                key="blog-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-3xl mx-auto px-6 py-10 text-left font-poppins"
              >
                <Breadcrumbs type="blog" blog={activeBlog} />

                <button
                  onClick={() => setView("blog")}
                  className="flex items-center gap-1 text-xs font-poppins font-semibold text-forest/70 hover:text-gold mb-8 transition-colors cursor-pointer text-left"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Academy Blogs</span>
                </button>

                <article className="space-y-6">
                  {/* Category and title */}
                  <div>
                    <span className="text-[10px] bg-forest text-cream font-bold px-3 py-1 rounded-md tracking-wider uppercase mb-3 inline-block">
                      {activeBlog.category}
                    </span>
                    <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-forest leading-tight">
                      {activeBlog.title}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-forest/50 mt-4">
                      <span>Written by {activeBlog.author}</span>
                      <span>•</span>
                      <span>Published on {activeBlog.date}</span>
                      <span>•</span>
                      <span>{activeBlog.readTime}</span>
                    </div>
                  </div>

                  {/* Header Banner */}
                  <div className="h-80 md:h-[400px] rounded-2xl overflow-hidden bg-cream-dark border border-forest/10">
                    <img
                      src={activeBlog.image}
                      alt={activeBlog.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* HTML Content Render Helper */}
                  <div className="prose prose-forest text-xs md:text-sm leading-relaxed text-forest/90 space-y-4 font-light font-poppins pt-4">
                    {/* Parse content sections directly for clean rendering */}
                    {activeBlog.content.split("\n\n").map((para, idx) => {
                      if (para.startsWith("###")) {
                        return (
                          <h3 key={idx} className="font-cinzel text-sm font-bold text-forest pt-4 pb-1 uppercase border-b border-forest/5">
                            {para.replace("###", "").trim()}
                          </h3>
                        );
                      }
                      if (para.startsWith("##")) {
                        return (
                          <h2 key={idx} className="font-cinzel text-base font-bold text-forest pt-6 pb-2 uppercase border-b border-forest/10">
                            {para.replace("##", "").trim()}
                          </h2>
                        );
                      }
                      // Render standard paragraphs or simple list bullet structures
                      return (
                        <p key={idx} className="whitespace-pre-line">
                          {para}
                        </p>
                      );
                    })}
                  </div>

                  {/* FAQ Accordion Block */}
                  {activeBlog.faq && activeBlog.faq.length > 0 && (
                    <div className="bg-cream-dark/25 border border-forest/10 p-6 rounded-2xl mt-12 space-y-4">
                      <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase mb-2">SPECIES FAQ</h4>
                      {activeBlog.faq.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs font-bold text-forest">❓ {item.question}</p>
                          <p className="text-xs font-light text-forest/75 pl-4">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags footer */}
                  <div className="pt-6 border-t border-forest/10 flex gap-2">
                    {activeBlog.tags.map((t) => (
                      <span key={t} className="bg-cream-dark text-forest text-[10px] px-3 py-1 rounded-full font-medium">#{t}</span>
                    ))}
                  </div>

                </article>
              </motion.div>
            );

            const quizView = activeView === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QuizModal />
              </motion.div>
            );

            const legalPageView = activeView === "legal-page" && activeLegalKey && legal && (
              <motion.div
                key="legal-page"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto px-6 py-10 text-left font-poppins"
              >
                <h1 className="font-cinzel text-2xl font-extrabold text-forest tracking-wider uppercase mb-6 pb-2 border-b border-forest/10">
                  {activeLegalKey === "privacy" && "PRIVACY & COOKIES POLICY"}
                  {activeLegalKey === "terms" && "TERMS & CONDITIONS"}
                  {activeLegalKey === "refund" && "REFUND & LIVE ARRIVAL GUARANTEE"}
                  {activeLegalKey === "shipping" && "SHIPPING & COD SYSTEM RATES"}
                </h1>

                <div className="prose prose-forest text-xs md:text-sm leading-relaxed text-forest/85 space-y-4 font-light whitespace-pre-line">
                  {legal[activeLegalKey]}
                </div>

                <button
                  onClick={() => setView("home")}
                  className="mt-10 bg-forest hover:bg-emerald-green text-cream px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </motion.div>
            );

            const confirmationView = activeView === "confirmation" && lastCreatedOrder && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl mx-auto px-6 py-16 text-center font-poppins space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-green/10 text-emerald-green rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-gold bg-forest/10 px-3 py-1 rounded-full">
                    Invoice {lastCreatedOrder.id} Created
                  </span>
                  <h1 className="font-cinzel text-2xl font-bold text-forest uppercase pt-2">
                    Order Submitted Successfully!
                  </h1>
                  <p className="font-cormorant text-base text-forest/70 italic">
                    We have received your Cash On Delivery invoice. Your plants will be securely packaged in Dhaka inside 24 hours.
                  </p>
                </div>

                {/* WhatsApp validation warning block */}
                <div className="bg-emerald-green text-cream rounded-xl p-5 border border-gold/15 text-left space-y-3 shadow-md">
                  <h4 className="font-cinzel text-xs font-bold tracking-widest text-gold uppercase">WhatsApp Verification Required</h4>
                  <p className="text-xs font-light leading-relaxed">
                    To expedite processing, please click below to send your invoice copy directly to our customer helpdesk via WhatsApp. Unverified orders will require a phone callback.
                  </p>
                  <a
                    href={generateWhatsAppOrderLink(lastCreatedOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gold hover:bg-cream text-forest-dark font-poppins font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Invoice to WhatsApp</span>
                  </a>
                </div>

                {/* Summary checklist details */}
                <div className="bg-cream-dark/25 border border-forest/10 rounded-xl p-5 text-left space-y-3">
                  <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">Delivery Address</h3>
                  <div className="text-xs text-forest/75 font-light leading-relaxed space-y-1">
                    <p><strong>Customer:</strong> {lastCreatedOrder.customerName}</p>
                    <p><strong>Phone:</strong> {lastCreatedOrder.phone}</p>
                    <p><strong>Street Address:</strong> {lastCreatedOrder.address}</p>
                    <p><strong>District:</strong> {lastCreatedOrder.district} (Area: {lastCreatedOrder.area})</p>
                    {lastCreatedOrder.note && <p><strong>Special Note:</strong> "{lastCreatedOrder.note}"</p>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setView("shop")}
                    className="flex-1 border border-forest/15 hover:border-gold text-forest text-xs py-3 rounded-xl transition-all font-semibold cursor-pointer text-center"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => setView("home")}
                    className="flex-1 bg-forest hover:bg-emerald-green text-cream text-xs py-3 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-sm"
                  >
                    Return to Homepage
                  </button>
                </div>

              </motion.div>
            );

            const adminView = activeView === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto px-6 md:px-8 py-10 text-left font-poppins"
              >
                {!isAdminAuth ? (
                  /* Admin Password Gate */
                  <div className="max-w-md mx-auto bg-cream border border-forest/15 p-8 rounded-2xl shadow-xl text-center space-y-4">
                    <Settings className="w-12 h-12 text-gold mx-auto" />
                    <h2 className="font-cinzel text-xl font-bold text-forest uppercase">ADMIN SECURITY PORTAL</h2>
                    <p className="text-xs text-forest/60 font-light">Enter the administrator key to manage products, blogs, coupons, banners, and review approvals.</p>
                    
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const msgBuffer = new TextEncoder().encode(adminPass);
                          const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                          const hashArray = Array.from(new Uint8Array(hashBuffer));
                          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                          
                          if (hashHex === "e2c539d318eb8c5201a1680435d7388ca7a8f397b791d228eaac61438596cc09") {
                            setIsAdminAuth(true);
                            setAdminPass("");
                          } else {
                            alert("Invalid administrator security code.");
                          }
                        } catch (err) {
                          console.error("Hashing failed, falling back:", err);
                          // Backup plain verification if crypto is somehow not supported
                          if (adminPass === "@Ahnaf01716456902") {
                            setIsAdminAuth(true);
                            setAdminPass("");
                          } else {
                            alert("Invalid administrator security code.");
                          }
                        }
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="password"
                        required
                        placeholder="Enter admin security password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full bg-cream-dark/30 border border-forest/15 rounded-lg px-3 py-2 text-xs text-center text-forest focus:outline-none focus:border-gold font-poppins"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="w-full bg-forest hover:bg-gold hover:text-forest-dark text-cream text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
                      >
                        Unlock Dashboard
                      </button>
                    </form>
                  </div>
                ) : (
                  /* FULL ADMIN CONTROL CENTER */
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-forest/10 pb-4">
                      <div>
                        <h2 className="font-cinzel text-2xl font-bold tracking-widest text-forest">LEAF AQUATIC CONTROL CENTER</h2>
                        <p className="text-xs text-forest/60">Live full-stack inventory, content, coupon, and invoice trackers</p>
                      </div>
                      <button
                        onClick={() => setIsAdminAuth(false)}
                        className="text-xs font-bold text-[#8A3324] hover:underline cursor-pointer"
                      >
                        Exit Admin Session
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Navigation bar */}
                      <div className="lg:col-span-3 flex flex-col gap-2 bg-cream-dark/15 border border-forest/10 p-4 rounded-xl font-poppins text-xs font-semibold text-forest">
                        <button
                          onClick={() => setAdminActiveSub("products")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "products" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <ShoppingBag className="w-4 h-4" /> <span>Product Catalog ({products.length})</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("categories")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "categories" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Layout className="w-4 h-4" /> <span>Manage Categories ({categories.length})</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("orders")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "orders" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <FileText className="w-4 h-4" /> <span>Invoice Orders ({orders.length})</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("courier")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "courier" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Truck className="w-4 h-4" /> <span>Steadfast Courier</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("blogs")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "blogs" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Star className="w-4 h-4" /> <span>Blog Academy ({blogs.length})</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("coupons")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "coupons" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Tag className="w-4 h-4" /> <span>Discount Coupons ({coupons.length})</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("reviews")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "reviews" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Star className="w-4 h-4" /> <span>Review Approvals</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("banners")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "banners" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <MessageCircle className="w-4 h-4" /> <span>WhatsApp Settings</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("payments")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "payments" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <CreditCard className="w-4 h-4" /> <span>Payment Management</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("seo")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "seo" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Globe className="w-4 h-4" /> <span>SEO Engine</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("cms")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "cms" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Sliders className="w-4 h-4" /> <span>Website CMS</span>
                        </button>
                        <button
                          onClick={() => setAdminActiveSub("domain")}
                          className={`p-3 text-left rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${adminActiveSub === "domain" ? "bg-forest text-cream" : "hover:bg-forest/5"}`}
                        >
                          <Cloud className="w-4 h-4" /> <span>Custom Domain & Cloud</span>
                        </button>
                      </div>

                      {/* Right Sub-View */}
                      <div className="lg:col-span-9 bg-cream border border-forest/10 p-6 rounded-2xl shadow-sm min-h-[400px]">
                        
                        {/* 12Z. CATEGORIES MANAGER */}
                        {adminActiveSub === "categories" && (
                          <div className="space-y-6 font-poppins">
                            <div className="flex justify-between items-center border-b border-forest/10 pb-3">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest">CATEGORY MANAGEMENT</h3>
                              <button
                                onClick={() => {
                                  setAdminCategoryForm({ id: "", name: "", image: "", slug: "" });
                                  setIsCategoryFormOpen(true);
                                }}
                                className="bg-forest text-cream font-bold text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-forest-dark transition-colors cursor-pointer shadow-none"
                              >
                                <Plus className="w-3.5 h-3.5" /> ADD CATEGORY
                              </button>
                            </div>

                            {/* CATEGORY FORM */}
                            {isCategoryFormOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-cream-dark/20 border border-forest/15 rounded-xl p-5 space-y-4"
                              >
                                <div className="flex justify-between items-center border-b border-forest/10 pb-2">
                                  <h4 className="text-xs font-bold text-forest uppercase">
                                    {adminCategoryForm.id ? "Edit Category" : "Create New Category"}
                                  </h4>
                                  <button
                                    onClick={() => setIsCategoryFormOpen(false)}
                                    className="text-xs text-forest/50 hover:text-forest"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-forest/60 uppercase">Category Name</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Stem Plants"
                                      value={adminCategoryForm.name}
                                      onChange={(e) => setAdminCategoryForm({ ...adminCategoryForm, name: e.target.value })}
                                      className="w-full bg-cream border border-forest/10 rounded p-2 text-xs text-forest focus:outline-none"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-forest/60 uppercase">Manual Slug (Optional)</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. stem-plants"
                                      value={adminCategoryForm.slug || ""}
                                      onChange={(e) => setAdminCategoryForm({ ...adminCategoryForm, slug: e.target.value })}
                                      className="w-full bg-cream border border-forest/10 rounded p-2 text-xs text-forest focus:outline-none font-mono"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-forest/60 uppercase">Category Image URL (Optional)</label>
                                    <input
                                      type="text"
                                      placeholder="https://images.unsplash.com/..."
                                      value={adminCategoryForm.image}
                                      onChange={(e) => setAdminCategoryForm({ ...adminCategoryForm, image: e.target.value })}
                                      className="w-full bg-cream border border-forest/10 rounded p-2 text-xs text-forest focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {/* Base64 Drag & Drop Image Uploader */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-forest/60 uppercase block">Or Upload Local Image File</label>
                                  <div className="border border-dashed border-forest/20 rounded-lg p-4 bg-cream/50 hover:bg-cream-dark/10 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative min-h-[100px]">
                                    {isUploadingCategoryImg ? (
                                      <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-gold" />
                                        <span className="text-[10px] text-forest/50 font-medium">Uploading to Cloudinary / storage...</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5 text-forest/35" />
                                        <span className="text-[10px] text-forest/50 font-medium">Drag & drop or click to upload category image</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setIsUploadingCategoryImg(true);
                                              try {
                                                const url = await uploadImageToServer(file);
                                                if (url) {
                                                  setAdminCategoryForm(prev => ({ ...prev, image: url }));
                                                }
                                              } catch (err: any) {
                                                alert(err.message || "Failed to upload image. Please try again.");
                                              } finally {
                                                setIsUploadingCategoryImg(false);
                                              }
                                            }
                                          }}
                                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Preview */}
                                {adminCategoryForm.image && (
                                  <div className="flex items-center gap-4 bg-cream p-3 rounded-lg border border-forest/5">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-forest/15">
                                      <img
                                        src={adminCategoryForm.image}
                                        alt="Category preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800";
                                        }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[10px] font-bold text-forest uppercase">IMAGE PREVIEW</p>
                                      <button
                                        onClick={() => setAdminCategoryForm(prev => ({ ...prev, image: "" }))}
                                        className="text-[10px] text-[#8A3324] hover:underline"
                                      >
                                        Remove Image
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                  <button
                                    onClick={() => setIsCategoryFormOpen(false)}
                                    className="bg-cream border border-forest/15 text-forest px-4 py-2 rounded text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!adminCategoryForm.name.trim()) {
                                        alert("Category name is required.");
                                        return;
                                      }
                                      const { id, ...rest } = adminCategoryForm;
                                      if (id) {
                                        await adminUpdateCategory(id, rest);
                                      } else {
                                        await adminAddCategory(rest);
                                      }
                                      setIsCategoryFormOpen(false);
                                    }}
                                    className="bg-forest text-cream px-4 py-2 rounded text-xs font-bold animate-pulse-once"
                                  >
                                    {adminCategoryForm.id ? "Save Changes" : "Create Category"}
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {/* LIST OF CATEGORIES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {categories.map((cat) => {
                                const matchProd = products.find((p) => p.category === cat.name);
                                const count = products.filter((p) => p.category === cat.name).length;
                                return (
                                  <div
                                    key={cat.id || cat.name}
                                    className="bg-cream-dark/5 border border-forest/10 p-4 rounded-xl flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full overflow-hidden border border-forest/15 bg-cream">
                                        <img
                                          src={cat.image || matchProd?.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=80"}
                                          alt={cat.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=80";
                                          }}
                                        />
                                      </div>
                                      <div className="text-left">
                                        <h4 className="text-xs font-bold text-forest uppercase tracking-wide">{cat.name}</h4>
                                        <p className="text-[10px] text-forest/50 font-semibold">{count} products assigned</p>
                                      </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => {
                                          setAdminCategoryForm({
                                            id: cat.id,
                                            name: cat.name,
                                            image: cat.image || "",
                                            slug: cat.slug || cat.seo?.slug || ""
                                          });
                                          setIsCategoryFormOpen(true);
                                        }}
                                        className="p-2 text-forest/70 hover:text-forest bg-cream hover:bg-cream-dark/20 border border-forest/10 rounded-lg cursor-pointer"
                                        title="Edit Category Name and Image"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (confirm(`Are you sure you want to delete category "${cat.name}"? Products assigned to it will retain their category name but no longer link to this category structure.`)) {
                                            await adminDeleteCategory(cat.id);
                                          }
                                        }}
                                        className="p-2 text-[#8A3324] hover:text-red-700 bg-cream hover:bg-cream-dark/20 border border-forest/10 rounded-lg cursor-pointer"
                                        title="Delete Category"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 12A. PRODUCTS MANAGER */}
                        {adminActiveSub === "products" && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-forest/10 pb-3">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest">PRODUCT MANAGEMENT</h3>
                              <button
                                onClick={() => {
                                  setAdminProductForm({
                                    id: "", name: "", scientificName: "", price: 250, originalPrice: 300,
                                    description: "Write details...", careGuide: "Securing guidelines...",
                                    difficulty: "Low Tech", light: "Low", co2: "None", category: categories[0]?.name || "Anubias",
                                    images: ["https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"],
                                    stock: 15, growthRate: "Slow", placement: "Foreground", temperature: "22-28°C", tankCompatibility: "Shrimp safe",
                                    slug: ""
                                  });
                                  setIsProductFormOpen(true);
                                }}
                                className="bg-emerald-green hover:bg-forest text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> <span>Add New Plant</span>
                              </button>
                            </div>

                            {/* Product Form Drawer */}
                            {isProductFormOpen && (
                              <div className="bg-cream-dark/25 p-5 rounded-xl border border-forest/10 space-y-4">
                                <h4 className="font-cinzel text-[10px] font-bold text-forest tracking-widest">
                                  {adminProductForm.id ? "EDIT PLANT SPECIES" : "REGISTER NEW SPECIMEN"}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <input
                                    type="text"
                                    placeholder="Plant Name"
                                    value={adminProductForm.name}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, name: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Scientific Name"
                                    value={adminProductForm.scientificName}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, scientificName: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Price (৳)"
                                    value={adminProductForm.price}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, price: Number(e.target.value) })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Original Price (৳)"
                                    value={adminProductForm.originalPrice}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, originalPrice: Number(e.target.value) })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <div className="flex flex-col gap-1 bg-cream border border-forest/10 rounded p-1.5 justify-center">
                                    <span className="text-[9px] font-bold text-forest/40 uppercase px-1">Category</span>
                                    <select
                                      value={adminProductForm.category}
                                      onChange={(e) => setAdminProductForm({ ...adminProductForm, category: e.target.value })}
                                      className="bg-transparent text-xs text-forest focus:outline-none cursor-pointer p-0.5"
                                    >
                                      {categories.map((c) => (
                                        <option key={c.id || c.name} value={c.name}>{c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <input
                                    type="number"
                                    placeholder="Stock pots"
                                    value={adminProductForm.stock}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, stock: Number(e.target.value) })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <select
                                    value={adminProductForm.difficulty}
                                    onChange={(e: any) => setAdminProductForm({ ...adminProductForm, difficulty: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  >
                                    <option value="Low Tech">Low Tech</option>
                                    <option value="Mid Tech">Mid Tech</option>
                                    <option value="High Tech">High Tech</option>
                                  </select>
                                  <select
                                    value={adminProductForm.light}
                                    onChange={(e: any) => setAdminProductForm({ ...adminProductForm, light: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  >
                                    <option value="Low">Low Light</option>
                                    <option value="Medium">Medium Light</option>
                                    <option value="High">High Light</option>
                                  </select>
                                  <select
                                    value={adminProductForm.co2}
                                    onChange={(e: any) => setAdminProductForm({ ...adminProductForm, co2: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  >
                                    <option value="None">No CO₂ Required</option>
                                    <option value="Low">Low CO₂ Injection</option>
                                    <option value="High">High CO₂ Injection</option>
                                  </select>
                                  <select
                                    value={adminProductForm.growthRate}
                                    onChange={(e: any) => setAdminProductForm({ ...adminProductForm, growthRate: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  >
                                    <option value="Slow">Slow Growth</option>
                                    <option value="Medium">Medium Growth</option>
                                    <option value="Fast">Fast Growth</option>
                                  </select>
                                  <select
                                    value={adminProductForm.placement}
                                    onChange={(e: any) => setAdminProductForm({ ...adminProductForm, placement: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  >
                                    <option value="Foreground">Foreground Placement</option>
                                    <option value="Midground">Midground Placement</option>
                                    <option value="Background">Background Placement</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="Temperature (e.g. 22-28°C)"
                                    value={adminProductForm.temperature}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, temperature: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Tank Compatibility (e.g. Shrimp safe)"
                                    value={adminProductForm.tankCompatibility}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, tankCompatibility: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Manual Slug (Optional - e.g. custom-slug)"
                                    value={adminProductForm.slug || ""}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, slug: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2 font-mono"
                                  />
                                </div>
                                
                                <ProductImagesManager
                                  images={adminProductForm.images}
                                  onChange={(newImages) => setAdminProductForm({ ...adminProductForm, images: newImages })}
                                />

                                <div className="grid grid-cols-1 gap-2 text-xs">
                                  <textarea
                                    placeholder="Foliage Description"
                                    value={adminProductForm.description}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, description: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2 h-16"
                                  />
                                  <textarea
                                    placeholder="Botanist Care & Dosing guidelines"
                                    value={adminProductForm.careGuide}
                                    onChange={(e) => setAdminProductForm({ ...adminProductForm, careGuide: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2 h-16"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setIsProductFormOpen(false)}
                                    className="text-xs text-forest/60 hover:underline px-4 py-1.5"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const { id, images, ...rest } = adminProductForm;
                                      const payload = {
                                        ...rest,
                                        images: images
                                      };
                                      if (id) {
                                        await adminUpdateProduct(id, payload);
                                      } else {
                                        await adminAddProduct(payload);
                                      }
                                      setIsProductFormOpen(false);
                                    }}
                                    className="bg-forest text-cream text-xs px-4 py-1.5 rounded font-bold"
                                  >
                                    Save Product Specs
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Live products table */}
                            <div className="divide-y divide-forest/5">
                              {products.map((p) => (
                                <div key={p.id} className="py-3 flex items-center justify-between text-xs font-poppins">
                                  <div className="flex items-center gap-3">
                                    <img src={p.images?.[0] || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"} alt={p.name} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                                    <div>
                                      <h4 className="font-bold text-forest">{p.name}</h4>
                                      <span className="text-[10px] text-forest/50">{p.scientificName} • Stock: {p.stock} pots</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-forest">৳{p.price}</span>
                                    <button
                                      onClick={() => {
                                        setAdminProductForm({
                                          id: p.id, name: p.name, scientificName: p.scientificName,
                                          price: p.price, originalPrice: p.originalPrice, description: p.description,
                                          careGuide: p.careGuide, difficulty: p.difficulty, light: p.light,
                                          co2: p.co2, category: p.category, images: p.images || [], stock: p.stock,
                                          growthRate: p.growthRate, placement: p.placement, temperature: p.temperature, tankCompatibility: p.tankCompatibility,
                                          slug: p.slug || p.seo?.slug || ""
                                        });
                                        setIsProductFormOpen(true);
                                      }}
                                      className="p-1 hover:text-gold"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => adminDeleteProduct(p.id)}
                                      className="p-1 hover:text-[#8A3324]"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 12B. ORDERS MANAGER */}
                        {adminActiveSub === "orders" && (
                          <div className="space-y-6">
                            <div className="border-b border-forest/10 pb-3">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest uppercase">INVOICE ORDER STATUS TRACKER</h3>
                              <p className="text-[10px] text-forest/60 mt-1 font-poppins">
                                Manage customer invoices, process crops, deliver or cancel specimen requests.
                              </p>
                            </div>

                            {/* Status Filter Subtabs */}
                            <div className="flex flex-wrap gap-2 border-b border-forest/5 pb-3">
                              <button
                                onClick={() => setAdminOrderFilter("active")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                  adminOrderFilter === "active"
                                    ? "bg-forest text-cream font-bold"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                <span>Active & Processing</span>
                                <span className="bg-cream/25 text-inherit font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                  {orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length}
                                </span>
                              </button>

                              <button
                                onClick={() => setAdminOrderFilter("completed")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                  adminOrderFilter === "completed"
                                    ? "bg-emerald-green text-cream font-bold"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                <span>Completed</span>
                                <span className="bg-cream/25 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                  {orders.filter((o) => o.status === "Delivered").length}
                                </span>
                              </button>

                              <button
                                onClick={() => setAdminOrderFilter("cancelled")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                  adminOrderFilter === "cancelled"
                                    ? "bg-[#8A3324] text-cream font-bold"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                <span>Cancelled</span>
                                <span className="bg-cream/25 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                  {orders.filter((o) => o.status === "Cancelled").length}
                                </span>
                              </button>

                              <button
                                onClick={() => setAdminOrderFilter("all")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                  adminOrderFilter === "all"
                                    ? "bg-gold text-forest-dark font-bold"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                <span>All Orders</span>
                                <span className="bg-cream/25 text-inherit font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                  {orders.length}
                                </span>
                              </button>
                            </div>

                            <div className="space-y-6 divide-y divide-forest/10">
                              {orders.filter((o) => {
                                if (adminOrderFilter === "completed") return o.status === "Delivered";
                                if (adminOrderFilter === "cancelled") return o.status === "Cancelled";
                                if (adminOrderFilter === "active") return o.status !== "Delivered" && o.status !== "Cancelled";
                                return true;
                              }).length === 0 ? (
                                <div className="text-center py-12 bg-cream-dark/10 rounded-2xl border border-forest/10 font-poppins">
                                  <p className="text-xs text-forest/60 font-semibold">No orders found in this section.</p>
                                  <p className="text-[10px] text-forest/40 mt-1">
                                    Updating an order's status will instantly route it to the correct tab.
                                  </p>
                                </div>
                              ) : (
                                orders
                                  .filter((o) => {
                                    if (adminOrderFilter === "completed") return o.status === "Delivered";
                                    if (adminOrderFilter === "cancelled") return o.status === "Cancelled";
                                    if (adminOrderFilter === "active") return o.status !== "Delivered" && o.status !== "Cancelled";
                                    return true;
                                  })
                                  .map((o) => (
                                    <div key={o.id} className="pt-4 text-xs space-y-3 text-left font-poppins animate-fade-in">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <span className="font-bold text-forest">{o.id}</span>
                                          <span className="text-forest/50 ml-2 font-semibold">
                                            ({formatOrderTime(o.createdAt)})
                                          </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                          <button
                                            onClick={() => handleCopyOrderInfo(o)}
                                            className="bg-forest hover:bg-gold hover:text-forest-dark text-cream text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1"
                                          >
                                            {copiedOrderId === o.id ? "Copied! ✓" : "Copy Invoice"}
                                          </button>
                                          <select
                                            value={o.status}
                                            onChange={(e: any) => adminUpdateOrderStatus(o.id, e.target.value)}
                                            className="bg-cream-dark/50 border border-forest/10 rounded px-2 py-1 font-semibold text-forest focus:outline-none"
                                          >
                                            <option value="Pending">Pending Validation</option>
                                            <option value="Payment Verification Pending">Awaiting Reconcile</option>
                                            <option value="Payment Verified">Payment Verified</option>
                                            <option value="Processing">Processing Crop</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered (Completed)</option>
                                            <option value="Cancelled">Cancelled</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 bg-cream-dark/15 p-3 rounded">
                                        <div>
                                          <p><strong>Customer:</strong> {o.customerName}</p>
                                          <p><strong>Phone:</strong> {o.phone}</p>
                                          <p><strong>Address:</strong> {o.address}, {o.area}, {o.district}</p>
                                        </div>
                                        <div>
                                          <p><strong>Total Amount:</strong> ৳{o.total} (Shipping: ৳{o.shippingCharge})</p>
                                          <p><strong>Special Notes:</strong> "{o.note || "None"}"</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="font-semibold text-forest mb-1">Ordered Specimens:</p>
                                        <ul className="list-disc list-inside text-forest/70 space-y-0.5">
                                          {o.items.map((it, index) => (
                                            <li key={index}>{it.name} x{it.quantity} (৳{it.price * it.quantity})</li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Steadfast Courier Integration Box */}
                                      <div className="bg-forest/5 border border-forest/15 rounded-lg p-3 space-y-2 text-left">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <Truck className="w-4 h-4 text-forest" />
                                            <span className="font-bold text-forest text-xs">Steadfast Courier:</span>
                                            {o.steadfastConsignmentId ? (
                                              <span className="bg-forest/10 text-forest px-2 py-0.5 rounded text-[10px] font-bold">
                                                CID #{o.steadfastConsignmentId}
                                              </span>
                                            ) : (
                                              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                                Not Sent
                                              </span>
                                            )}
                                            {o.steadfastStatus && (
                                              <span className="bg-gold/20 text-forest-dark px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                {o.steadfastStatus}
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2">
                                            {o.steadfastConsignmentId ? (
                                              <button
                                                type="button"
                                                onClick={() => handleCheckSteadfastStatus(o.id)}
                                                disabled={checkingOrderIds[o.id]}
                                                className="bg-forest hover:bg-forest/80 text-cream text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                              >
                                                {checkingOrderIds[o.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                                Check Status
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => handleDispatchToSteadfast(o.id)}
                                                disabled={sendingOrderIds[o.id]}
                                                className="bg-forest hover:bg-gold hover:text-forest-dark text-cream text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                              >
                                                {sendingOrderIds[o.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Truck className="w-3 h-3" />}
                                                Send to Courier
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {o.steadfastTrackingCode && (
                                          <div className="text-[10px] text-forest/70 font-semibold">
                                            Tracking Code: <span className="font-mono text-forest">{o.steadfastTrackingCode}</span>
                                          </div>
                                        )}

                                        {o.steadfastError && (
                                          <div className="text-[10px] text-red-600 bg-red-50 p-2 rounded border border-red-200 font-medium flex items-center justify-between gap-2">
                                            <span>Notice: {o.steadfastError}</span>
                                            <button
                                              type="button"
                                              onClick={() => handleDispatchToSteadfast(o.id)}
                                              className="underline text-red-800 font-bold hover:text-red-900 cursor-pointer"
                                            >
                                              Retry Dispatch
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* 12C. REVIEWS APPROVAL */}
                        {adminActiveSub === "reviews" && (
                          <div className="space-y-8">
                            <div>
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest border-b border-forest/10 pb-3 uppercase mb-4">CUSTOMER REVIEWS APPROVAL</h3>
                              <div className="space-y-4">
                                {products.some((p) => p.reviews && p.reviews.some((r) => !r.approved)) ? (
                                  products.map((p) => {
                                    const pending = p.reviews ? p.reviews.filter((r) => !r.approved) : [];
                                    if (pending.length === 0) return null;
                                    return (
                                      <div key={p.id} className="space-y-3 bg-cream-dark/15 p-4 rounded-xl text-left text-xs">
                                        <h4 className="font-bold text-forest">Species: {p.name}</h4>
                                        {pending.map((r) => (
                                          <div key={r.id} className="border-t border-forest/10 pt-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                              <p><strong>Author:</strong> {r.author} (Rating: {r.rating} stars)</p>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => adminApproveReview(p.id, r.id)}
                                                  className="bg-emerald-green text-cream px-3 py-1 rounded hover:opacity-90 cursor-pointer text-[10px] font-bold"
                                                >
                                                  Approve
                                                </button>
                                                <button
                                                  onClick={() => adminRejectReview(p.id, r.id)}
                                                  className="bg-[#8A3324] text-cream px-3 py-1 rounded hover:opacity-90 cursor-pointer text-[10px] font-bold"
                                                >
                                                  Reject / Delete
                                                </button>
                                              </div>
                                            </div>
                                            <p className="text-forest/80 italic">"{r.text}"</p>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-center py-6 text-forest/50 text-xs bg-cream-dark/5 rounded-xl border border-dashed border-forest/10">No pending unapproved customer reviews in queue.</p>
                                )}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-forest/10">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest pb-3 uppercase mb-4">APPROVED REVIEWS & HOMEPAGE SLIDER SELECTION</h3>
                              <div className="space-y-4">
                                {products.some((p) => p.reviews && p.reviews.some((r) => r.approved)) ? (
                                  products.map((p) => {
                                    const approved = p.reviews ? p.reviews.filter((r) => r.approved) : [];
                                    if (approved.length === 0) return null;
                                    return (
                                      <div key={p.id} className="space-y-3 bg-cream-dark/15 p-4 rounded-xl text-left text-xs">
                                        <h4 className="font-bold text-forest">Species: {p.name}</h4>
                                        {approved.map((r) => (
                                          <div key={r.id} className="border-t border-forest/10 pt-3 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                              <div>
                                                <p className="font-semibold text-forest/90">
                                                  {r.author} (★ {r.rating}/5)
                                                  {r.date && <span className="text-[10px] text-forest/40 ml-2 font-mono">{r.date}</span>}
                                                </p>
                                                <p className="text-forest/75 italic mt-1 font-poppins">"{r.text}"</p>
                                              </div>
                                              
                                              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                                                {/* Selection Toggle for Homepage Slider */}
                                                <button
                                                  onClick={() => adminToggleFeaturedReview(p.id, r.id)}
                                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                                    r.featured 
                                                      ? "bg-gold text-forest-dark font-black shadow-sm border border-gold" 
                                                      : "bg-cream-dark/40 border border-forest/20 text-forest/60 hover:text-forest hover:bg-cream-dark/60"
                                                  }`}
                                                >
                                                  <Star className={`w-3 h-3 ${r.featured ? "fill-forest-dark text-forest-dark" : "text-forest/40"}`} />
                                                  <span>{r.featured ? "Featured in Slider" : "Show in Slider"}</span>
                                                </button>

                                                <button
                                                  onClick={() => adminRejectReview(p.id, r.id)}
                                                  className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg cursor-pointer text-[10px]"
                                                  title="Delete this review from product and slider"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-center py-8 text-forest/50 text-xs bg-cream-dark/5 rounded-xl border border-dashed border-forest/10">No approved reviews yet. Approve some customer reviews to showcase them on the homepage.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                          {/* 12D. BLOGS CRUD */}
                        {adminActiveSub === "blogs" && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-forest/10 pb-3">
                              <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest">BLOG ARTICLES</h3>
                              <button
                                onClick={() => {
                                  setAdminBlogForm({
                                    id: "", title: "", excerpt: "", content: "",
                                    category: "Aquarium Plant Care Guides", tags: "Plant Care, Growth",
                                    author: "Ahnaf Ali", readTime: "5 min read",
                                    image: "/src/assets/images/bucephalandra_plant_1782394547181.jpg",
                                    faqQuestion1: "", faqAnswer1: "", faqQuestion2: "", faqAnswer2: "",
                                    seoTitle: "", seoDescription: "", slug: ""
                                  });
                                  setIsBlogFormOpen(true);
                                }}
                                className="bg-emerald-green hover:bg-forest text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> <span>Write Article</span>
                              </button>
                            </div>

                            {isBlogFormOpen && (
                              <div className="bg-cream-dark/25 p-5 rounded-xl border border-forest/10 space-y-4 text-xs text-left">
                                <h4 className="font-cinzel text-[10px] font-bold text-forest tracking-widest uppercase">
                                  {adminBlogForm.id ? "EDIT BLOG ARTICLE" : "WRITE NEW BLOG ARTICLE"}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <input
                                    type="text"
                                    placeholder="Title"
                                    value={adminBlogForm.title}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, title: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Excerpt / Short Summary"
                                    value={adminBlogForm.excerpt}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, excerpt: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Category"
                                    value={adminBlogForm.category}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, category: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Tags (comma-separated)"
                                    value={adminBlogForm.tags}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, tags: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <div className="col-span-2 border border-forest/10 bg-cream/30 p-4 rounded-xl space-y-3">
                                    <h5 className="font-cinzel text-[9px] font-bold text-forest/70 tracking-wider uppercase">BLOG BANNER IMAGE</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* URL Input */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-forest/60 uppercase">Banner Image URL</label>
                                        <input
                                          type="text"
                                          placeholder="https://images.unsplash.com/..."
                                          value={adminBlogForm.image}
                                          onChange={(e) => setAdminBlogForm({ ...adminBlogForm, image: e.target.value })}
                                          className="w-full bg-cream border border-forest/10 rounded p-2 text-xs text-forest focus:outline-none"
                                        />
                                      </div>

                                      {/* Local File Upload */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-forest/60 uppercase block">Or Upload Local Image</label>
                                        <div className="border border-dashed border-forest/20 rounded-lg p-3 bg-cream/50 hover:bg-cream-dark/10 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer relative min-h-[70px]">
                                          {isUploadingBlogImg ? (
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                              <Loader2 className="w-4 h-4 animate-spin text-gold" />
                                              <span className="text-[9px] text-forest/50 font-medium">Uploading to storage...</span>
                                            </div>
                                          ) : (
                                            <>
                                              <Plus className="w-4 h-4 text-forest/35" />
                                              <span className="text-[9px] text-forest/50 font-medium text-center">Drag & drop or click to upload banner</span>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    setIsUploadingBlogImg(true);
                                                    try {
                                                      const url = await uploadImageToServer(file);
                                                      if (url) {
                                                        setAdminBlogForm(prev => ({ ...prev, image: url }));
                                                      }
                                                    } catch (err: any) {
                                                      alert(err.message || "Failed to upload image. Please try again.");
                                                    } finally {
                                                      setIsUploadingBlogImg(false);
                                                    }
                                                  }
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                              />
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Preview Banner */}
                                    {adminBlogForm.image && (
                                      <div className="flex items-center gap-3 bg-cream p-2.5 rounded-lg border border-forest/5">
                                        <div className="w-20 h-12 rounded overflow-hidden border border-forest/15 bg-cream">
                                          <img
                                            src={adminBlogForm.image}
                                            alt="Blog banner preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800";
                                            }}
                                          />
                                        </div>
                                        <div className="text-left flex-1">
                                          <p className="text-[9px] font-bold text-forest uppercase">IMAGE PREVIEW</p>
                                          <p className="text-[9px] text-forest/50 truncate max-w-xs">{adminBlogForm.image}</p>
                                        </div>
                                        <button
                                          onClick={() => setAdminBlogForm(prev => ({ ...prev, image: "" }))}
                                          className="text-[10px] text-[#8A3324] hover:underline font-bold px-2 cursor-pointer"
                                        >
                                          Clear Image
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Author"
                                    value={adminBlogForm.author}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, author: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Read Time (e.g. 5 min read)"
                                    value={adminBlogForm.readTime}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, readTime: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="SEO Page Title"
                                    value={adminBlogForm.seoTitle}
                                    onChange={(e) => setAdminBlogForm({ ...adminBlogForm, seoTitle: e.target.value })}
                                    className="bg-cream border border-forest/10 rounded p-2"
                                  />
                                  <div className="col-span-2">
                                    <input
                                      type="text"
                                      placeholder="Manual Slug (Optional - e.g. custom-blog-slug)"
                                      value={adminBlogForm.slug || ""}
                                      onChange={(e) => setAdminBlogForm({ ...adminBlogForm, slug: e.target.value })}
                                      className="w-full bg-cream border border-forest/10 rounded p-2 font-mono"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <input
                                      type="text"
                                      placeholder="SEO Meta Description"
                                      value={adminBlogForm.seoDescription}
                                      onChange={(e) => setAdminBlogForm({ ...adminBlogForm, seoDescription: e.target.value })}
                                      className="w-full bg-cream border border-forest/10 rounded p-2"
                                    />
                                  </div>
                                </div>

                                <div className="border-t border-forest/10 pt-3 space-y-3">
                                  <h5 className="font-cinzel text-[9px] font-bold text-forest/70 tracking-wider">ARTICLE FAQ INTEGRATION (OPTIONAL)</h5>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2 border border-forest/5 p-2.5 rounded bg-cream-dark/10">
                                      <p className="font-semibold text-[10px] text-forest/70">FAQ Question #1</p>
                                      <input
                                        type="text"
                                        placeholder="e.g. How often should I trim this plant?"
                                        value={adminBlogForm.faqQuestion1}
                                        onChange={(e) => setAdminBlogForm({ ...adminBlogForm, faqQuestion1: e.target.value })}
                                        className="w-full bg-cream border border-forest/10 rounded p-1.5 text-xs"
                                      />
                                      <textarea
                                        placeholder="FAQ Answer #1"
                                        value={adminBlogForm.faqAnswer1}
                                        onChange={(e) => setAdminBlogForm({ ...adminBlogForm, faqAnswer1: e.target.value })}
                                        className="w-full bg-cream border border-forest/10 rounded p-1.5 h-12 text-xs"
                                      />
                                    </div>
                                    <div className="space-y-2 border border-forest/5 p-2.5 rounded bg-cream-dark/10">
                                      <p className="font-semibold text-[10px] text-forest/70">FAQ Question #2</p>
                                      <input
                                        type="text"
                                        placeholder="e.g. Does it require CO2 injection?"
                                        value={adminBlogForm.faqQuestion2}
                                        onChange={(e) => setAdminBlogForm({ ...adminBlogForm, faqQuestion2: e.target.value })}
                                        className="w-full bg-cream border border-forest/10 rounded p-1.5 text-xs"
                                      />
                                      <textarea
                                        placeholder="FAQ Answer #2"
                                        value={adminBlogForm.faqAnswer2}
                                        onChange={(e) => setAdminBlogForm({ ...adminBlogForm, faqAnswer2: e.target.value })}
                                        className="w-full bg-cream border border-forest/10 rounded p-1.5 h-12 text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <textarea
                                  placeholder="Detailed Markdown Content"
                                  value={adminBlogForm.content}
                                  onChange={(e) => setAdminBlogForm({ ...adminBlogForm, content: e.target.value })}
                                  className="w-full h-32 bg-cream border border-forest/10 rounded p-2"
                                />
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setIsBlogFormOpen(false)} className="px-4 py-1.5 hover:underline text-forest/60">Cancel</button>
                                  <button
                                    onClick={async () => {
                                      const { id, tags, faqQuestion1, faqAnswer1, faqQuestion2, faqAnswer2, ...rest } = adminBlogForm;
                                      
                                      const faq: any[] = [];
                                      if (faqQuestion1 && faqAnswer1) {
                                        faq.push({ question: faqQuestion1, answer: faqAnswer1 });
                                      }
                                      if (faqQuestion2 && faqAnswer2) {
                                        faq.push({ question: faqQuestion2, answer: faqAnswer2 });
                                      }

                                      const payload = {
                                        ...rest,
                                        tags: tags.split(",").map((s) => s.trim()),
                                        faq
                                      };

                                      if (id) {
                                        await adminUpdateBlog(id, payload);
                                      } else {
                                        await adminAddBlog(payload);
                                      }
                                      setIsBlogFormOpen(false);
                                    }}
                                    className="bg-forest text-cream text-xs px-4 py-1.5 rounded font-bold"
                                  >
                                    Publish Article
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="divide-y divide-forest/5 text-xs">
                              {blogs.map((b) => (
                                <div key={b.id} className="py-3 flex justify-between items-center">
                                  <div className="flex items-center gap-3 text-left">
                                    <img src={b.image} alt={b.title} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                                    <div>
                                      <h4 className="font-bold text-forest">{b.title}</h4>
                                      <span className="text-[10px] text-forest/50">By {b.author} • {b.category}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setAdminBlogForm({
                                          id: b.id,
                                          title: b.title,
                                          excerpt: b.excerpt,
                                          content: b.content,
                                          category: b.category,
                                          tags: b.tags.join(", "),
                                          author: b.author,
                                          readTime: b.readTime,
                                          image: b.image,
                                          faqQuestion1: b.faq && b.faq[0] ? b.faq[0].question : "",
                                          faqAnswer1: b.faq && b.faq[0] ? b.faq[0].answer : "",
                                          faqQuestion2: b.faq && b.faq[1] ? b.faq[1].question : "",
                                          faqAnswer2: b.faq && b.faq[1] ? b.faq[1].answer : "",
                                          seoTitle: b.seoTitle || "",
                                          seoDescription: b.seoDescription || "",
                                          slug: b.slug || b.seo?.slug || ""
                                        });
                                        setIsBlogFormOpen(true);
                                      }}
                                      className="p-1 hover:text-gold"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => adminDeleteBlog(b.id)} className="p-1 hover:text-[#8A3324]"><Trash className="w-4 h-4" /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 12E. COUPONS MANAGER */}
                        {adminActiveSub === "coupons" && (
                          <div className="space-y-6">
                            <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest border-b border-forest/10 pb-3 uppercase">COUPON CODE SCHEDULER</h3>
                            
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await adminAddCoupon(adminCouponForm);
                                setAdminCouponForm({ code: "", discountType: "percentage", discountValue: 10, expiryDate: "2027-12-31" });
                              }}
                              className="bg-cream-dark/25 p-4 rounded-xl border border-forest/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs items-end"
                            >
                              <div>
                                <label className="block mb-1">Code</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. MONSOON20"
                                  value={adminCouponForm.code}
                                  onChange={(e) => setAdminCouponForm({ ...adminCouponForm, code: e.target.value.toUpperCase() })}
                                  className="w-full bg-cream border border-forest/10 p-2 rounded"
                                />
                              </div>
                              <div>
                                <label className="block mb-1">Type</label>
                                <select
                                  value={adminCouponForm.discountType}
                                  onChange={(e: any) => setAdminCouponForm({ ...adminCouponForm, discountType: e.target.value })}
                                  className="w-full bg-cream border border-forest/10 p-2 rounded"
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed (৳)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block mb-1">Value</label>
                                <input
                                  type="number"
                                  required
                                  value={adminCouponForm.discountValue}
                                  onChange={(e) => setAdminCouponForm({ ...adminCouponForm, discountValue: Number(e.target.value) })}
                                  className="w-full bg-cream border border-forest/10 p-2 rounded"
                                />
                              </div>
                              <button type="submit" className="bg-forest text-cream py-2 rounded font-bold hover:bg-emerald-green transition-colors">
                                Add Coupon
                              </button>
                            </form>

                            <div className="divide-y divide-forest/5 text-xs text-left">
                              {coupons.map((c) => (
                                <div key={c.code} className="py-2.5 flex justify-between items-center">
                                  <div>
                                    <span className="font-bold text-forest">{c.code}</span>
                                    <span className="text-forest/50 ml-2">({c.discountType === "percentage" ? `${c.discountValue}% off` : `৳${c.discountValue} off`})</span>
                                  </div>
                                  <button onClick={() => adminDeleteCoupon(c.code)} className="p-1 text-[#8A3324] hover:bg-red-50 rounded">
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 12F. WHATSAPP & FLOATING WIDGET SETTINGS */}
                        {adminActiveSub === "banners" && (
                          <div className="space-y-6">
                            <h3 className="font-cinzel text-xs font-bold tracking-widest text-forest border-b border-forest/10 pb-3 uppercase">WHATSAPP & FLOATING WIDGET SETTINGS</h3>
                            
                            <form
                              onSubmit={handleUpdateWhatsappSettings}
                              className="bg-cream-dark/25 p-6 rounded-xl border border-forest/10 space-y-4 text-xs text-left"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block font-semibold mb-1 text-forest font-sans">WhatsApp Phone Number *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. 8801799975540"
                                    value={adminWhatsappPhone}
                                    onChange={(e) => setAdminWhatsappPhone(e.target.value)}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-xs font-poppins text-forest focus:border-gold focus:outline-none font-medium"
                                  />
                                  <span className="text-[10px] text-forest/55 mt-1 block">Specify the phone number (with country code, no + or spaces).</span>
                                </div>

                                <div>
                                  <label className="block font-semibold mb-1 text-forest font-sans">WhatsApp Direct Chat Link *</label>
                                  <input
                                    type="url"
                                    required
                                    placeholder="e.g. https://wa.me/8801799975540"
                                    value={adminWhatsappLink}
                                    onChange={(e) => setAdminWhatsappLink(e.target.value)}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-xs font-poppins text-forest focus:border-gold focus:outline-none font-medium"
                                  />
                                  <span className="text-[10px] text-forest/55 mt-1 block">Specify the direct link to open the chat.</span>
                                </div>
                              </div>

                              <div>
                                <label className="block font-semibold mb-1 text-forest font-sans">Default Pre-filled Message</label>
                                <textarea
                                  placeholder="e.g. Hello Leaf Aquatic, I am interested in your aquarium plants!"
                                  value={adminWhatsappMessage}
                                  onChange={(e) => setAdminWhatsappMessage(e.target.value)}
                                  className="w-full h-24 bg-cream border border-forest/15 p-3 rounded-lg text-xs font-poppins text-forest focus:border-gold focus:outline-none font-medium"
                                />
                                <span className="text-[10px] text-forest/55 mt-1 block">Pre-filled text when a user opens the chat.</span>
                              </div>

                              <div className="flex items-center gap-2 pt-2">
                                <input
                                  type="checkbox"
                                  id="admin-whatsapp-enabled-chk"
                                  checked={adminWhatsappEnabled}
                                  onChange={(e) => setAdminWhatsappEnabled(e.target.checked)}
                                  className="w-4 h-4 text-forest border-forest/15 rounded focus:ring-gold focus:ring-1 cursor-pointer"
                                />
                                <label htmlFor="admin-whatsapp-enabled-chk" className="font-semibold text-forest cursor-pointer select-none">
                                  Enable Floating WhatsApp Chat Button across all pages
                                </label>
                              </div>

                              <div className="pt-2">
                                <button
                                  type="submit"
                                  className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all duration-300 shadow-md cursor-pointer"
                                >
                                  Save WhatsApp Settings
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* 12G. PAYMENT MANAGEMENT & GATEWAY SETTINGS */}
                        {adminActiveSub === "payments" && (
                          <div className="space-y-6">
                            <div className="border-b border-forest/10 pb-4">
                              <h3 className="font-cinzel text-sm font-bold tracking-widest text-forest uppercase text-left">
                                Payment Management & Gateway Settings
                              </h3>
                              <p className="text-xs text-forest/60 text-left">
                                Configure credentials, instruction briefs, and verify incoming transaction invoices.
                              </p>
                            </div>

                            {/* Subtabs Menu */}
                            <div className="flex flex-wrap gap-2 border-b border-forest/5 pb-2">
                              <button
                                onClick={() => setAdminPaymentSubTab("bkash-nagad")}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                  adminPaymentSubTab === "bkash-nagad"
                                    ? "bg-forest text-cream"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                bKash & Nagad Settings
                              </button>
                              <button
                                onClick={() => setAdminPaymentSubTab("cod")}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                  adminPaymentSubTab === "cod"
                                    ? "bg-forest text-cream"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                Cash on Delivery (COD) Settings
                              </button>
                              <button
                                onClick={() => setAdminPaymentSubTab("verification")}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                  adminPaymentSubTab === "verification"
                                    ? "bg-[#D97706] text-white"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                Pending Verification
                                {orders.filter((o) => o.status === "Payment Verification Pending").length > 0 && (
                                  <span className="bg-red-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                    {orders.filter((o) => o.status === "Payment Verification Pending").length}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => setAdminPaymentSubTab("history")}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                  adminPaymentSubTab === "history"
                                    ? "bg-forest text-cream"
                                    : "bg-cream-dark/10 hover:bg-forest/5 text-forest/80"
                                }`}
                              >
                                Transaction History
                              </button>
                            </div>

                            {/* TAB 1: bKash & Nagad Form */}
                            {adminPaymentSubTab === "bkash-nagad" && (
                              <form onSubmit={handleUpdatePaymentSettings} className="space-y-6 text-left text-xs font-poppins">
                                {/* Account Holder / General Info */}
                                <div className="bg-cream-dark/15 border border-forest/10 p-4 rounded-xl space-y-4">
                                  <h4 className="font-cinzel font-bold text-forest tracking-wider text-[10px]">GENERAL ACCOUNTS & DELIVERY RATES CONFIG</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block font-semibold text-forest mb-1">Official Account Holder Name *</label>
                                      <input
                                        type="text"
                                        required
                                        placeholder="e.g. Leaf Aquatic Bangladesh"
                                        value={adminAccountHolderName}
                                        onChange={(e) => setAdminAccountHolderName(e.target.value)}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">This official name will be shown to customers during checkouts.</span>
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-forest mb-1">Dhaka Shipping Charge (৳) *</label>
                                      <input
                                        type="number"
                                        required
                                        min="0"
                                        value={adminShippingChargeDhaka}
                                        onChange={(e) => setAdminShippingChargeDhaka(Number(e.target.value))}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">Flat rate delivery charge for Dhaka city orders.</span>
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-forest mb-1">Outside Dhaka Shipping Charge (৳) *</label>
                                      <input
                                        type="number"
                                        required
                                        min="0"
                                        value={adminShippingChargeOutside}
                                        onChange={(e) => setAdminShippingChargeOutside(Number(e.target.value))}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">Flat rate courier delivery charge for other districts.</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* bKash Config Card */}
                                  <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-xl space-y-4 relative">
                                    <div className="flex justify-between items-center pb-2 border-b border-forest/5">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#E2125F]"></span>
                                        <h4 className="font-bold text-forest uppercase font-cinzel text-[10px]">bKash Gateway</h4>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="checkbox"
                                          id="bKash-enabled-chk"
                                          checked={adminBKashEnabled}
                                          onChange={(e) => setAdminBKashEnabled(e.target.checked)}
                                          className="w-4 h-4 text-[#E2125F] border-forest/15 rounded focus:ring-[#E2125F] cursor-pointer"
                                        />
                                        <label htmlFor="bKash-enabled-chk" className="font-semibold text-forest cursor-pointer select-none">
                                          Enable Method
                                        </label>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">bKash Mobile Wallet Number</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. 017XXXXXXXX"
                                          value={adminBKashNumber}
                                          onChange={(e) => setAdminBKashNumber(e.target.value)}
                                          disabled={!adminBKashEnabled}
                                          className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        />
                                      </div>

                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">Account Type</label>
                                        <select
                                          value={adminBKashAccountType}
                                          onChange={(e) => setAdminBKashAccountType(e.target.value)}
                                          disabled={!adminBKashEnabled}
                                          className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        >
                                          <option value="Personal">Personal (Send Money)</option>
                                          <option value="Agent">Agent (Cash Out)</option>
                                          <option value="Merchant">Merchant (Make Payment)</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">Custom Checkout Instructions</label>
                                        <textarea
                                          placeholder="Step-by-step guideline for send money/merchant payments..."
                                          value={adminBKashInstruction}
                                          onChange={(e) => setAdminBKashInstruction(e.target.value)}
                                          disabled={!adminBKashEnabled}
                                          className="w-full h-24 bg-cream border border-forest/15 p-3 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Nagad Config Card */}
                                  <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-xl space-y-4 relative">
                                    <div className="flex justify-between items-center pb-2 border-b border-forest/5">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#F15A22]"></span>
                                        <h4 className="font-bold text-forest uppercase font-cinzel text-[10px]">Nagad Gateway</h4>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="checkbox"
                                          id="Nagad-enabled-chk"
                                          checked={adminNagadEnabled}
                                          onChange={(e) => setAdminNagadEnabled(e.target.checked)}
                                          className="w-4 h-4 text-[#F15A22] border-forest/15 rounded focus:ring-[#F15A22] cursor-pointer"
                                        />
                                        <label htmlFor="Nagad-enabled-chk" className="font-semibold text-forest cursor-pointer select-none">
                                          Enable Method
                                        </label>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">Nagad Mobile Wallet Number</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. 018XXXXXXXX"
                                          value={adminNagadNumber}
                                          onChange={(e) => setAdminNagadNumber(e.target.value)}
                                          disabled={!adminNagadEnabled}
                                          className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        />
                                      </div>

                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">Account Type</label>
                                        <select
                                          value={adminNagadAccountType}
                                          onChange={(e) => setAdminNagadAccountType(e.target.value)}
                                          disabled={!adminNagadEnabled}
                                          className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        >
                                          <option value="Personal">Personal (Send Money)</option>
                                          <option value="Agent">Agent (Cash Out)</option>
                                          <option value="Merchant">Merchant (Make Payment)</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block font-semibold mb-1 text-forest">Custom Checkout Instructions</label>
                                        <textarea
                                          placeholder="Step-by-step guideline for Nagad send money..."
                                          value={adminNagadInstruction}
                                          onChange={(e) => setAdminNagadInstruction(e.target.value)}
                                          disabled={!adminNagadEnabled}
                                          className="w-full h-24 bg-cream border border-forest/15 p-3 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="submit"
                                    className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all duration-300 shadow-md cursor-pointer"
                                  >
                                    Save Gateway Configurations
                                  </button>
                                </div>
                              </form>
                            )}

                            {/* TAB 2: Cash on Delivery Settings */}
                            {adminPaymentSubTab === "cod" && (
                              <form onSubmit={handleUpdatePaymentSettings} className="space-y-6 text-left text-xs font-poppins">
                                <div className="bg-cream-dark/15 border border-forest/10 p-6 rounded-xl space-y-4">
                                  <div className="flex justify-between items-center pb-2 border-b border-forest/5">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4 text-forest" />
                                      <h4 className="font-bold text-forest uppercase font-cinzel text-[11px]">Cash On Delivery (COD) Options</h4>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="checkbox"
                                        id="cod-enabled-chk"
                                        checked={adminCodEnabled}
                                        onChange={(e) => setAdminCodEnabled(e.target.checked)}
                                        className="w-4 h-4 text-forest border-forest/15 rounded focus:ring-gold cursor-pointer"
                                      />
                                      <label htmlFor="cod-enabled-chk" className="font-semibold text-forest cursor-pointer select-none">
                                        Enable COD Option
                                      </label>
                                    </div>
                                  </div>

                                  {/* Delivery Rates Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-forest/5 pb-4">
                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">Dhaka Shipping Charge (৳) *</label>
                                      <input
                                        type="number"
                                        required
                                        min="0"
                                        value={adminShippingChargeDhaka}
                                        onChange={(e) => setAdminShippingChargeDhaka(Number(e.target.value))}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">Flat rate delivery charge inside Dhaka.</span>
                                    </div>
                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">Outside Dhaka Shipping Charge (৳) *</label>
                                      <input
                                        type="number"
                                        required
                                        min="0"
                                        value={adminShippingChargeOutside}
                                        onChange={(e) => setAdminShippingChargeOutside(Number(e.target.value))}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">Flat rate delivery charge outside Dhaka.</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">Advance Booking Payment (৳) *</label>
                                      <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="e.g. 150"
                                        value={adminCodAdvanceAmount}
                                        onChange={(e) => setAdminCodAdvanceAmount(Number(e.target.value))}
                                        disabled={!adminCodEnabled}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">
                                        Required partial security advance amount in Bangladesh (usually covers delivery cost to prevent fake ordering).
                                      </span>
                                    </div>

                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">WhatsApp Target Number for COD confirmations *</label>
                                      <input
                                        type="text"
                                        required
                                        placeholder="e.g. 8801799975540"
                                        value={adminPayWhatsappNumber}
                                        onChange={(e) => setAdminPayWhatsappNumber(e.target.value)}
                                        disabled={!adminCodEnabled}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                      />
                                      <span className="text-[10px] text-forest/50 block mt-1">
                                        Recipient number where users will be redirected to confirm order coordinates.
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">COD Direct URL link</label>
                                      <input
                                        type="url"
                                        placeholder="e.g. https://wa.me/8801799975540"
                                        value={adminPayWhatsappLink}
                                        onChange={(e) => setAdminPayWhatsappLink(e.target.value)}
                                        disabled={!adminCodEnabled}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                      />
                                    </div>

                                    <div>
                                      <label className="block font-semibold mb-1 text-forest">WhatsApp Message Prompt Prefix</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. Assalamu Alaikum, I placed a Cash on Delivery order!"
                                        value={adminPayWhatsappDefaultMessage}
                                        onChange={(e) => setAdminPayWhatsappDefaultMessage(e.target.value)}
                                        disabled={!adminCodEnabled}
                                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block font-semibold mb-1 text-forest font-sans">Payment Instruction Box Text</label>
                                    <textarea
                                      placeholder="Display instructions for COD advance payment..."
                                      value={adminCodInstruction}
                                      onChange={(e) => setAdminCodInstruction(e.target.value)}
                                      disabled={!adminCodEnabled}
                                      className="w-full h-24 bg-cream border border-forest/15 p-3 rounded-lg text-forest focus:border-gold focus:outline-none font-medium disabled:opacity-50"
                                    />
                                    <span className="text-[10px] text-forest/50 block mt-1">Describe how they can complete advance payments.</span>
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="submit"
                                    className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all duration-300 shadow-md cursor-pointer"
                                  >
                                    Save COD Configurations
                                  </button>
                                </div>
                              </form>
                            )}

                            {/* TAB 3: Pending Verification Orders */}
                            {adminPaymentSubTab === "verification" && (
                              <div className="space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-cinzel text-[11px] font-bold text-forest tracking-wider uppercase">
                                    Awaiting Payment Validation ({orders.filter((o) => o.status === "Payment Verification Pending").length})
                                  </h4>
                                </div>

                                {orders.filter((o) => o.status === "Payment Verification Pending").length === 0 ? (
                                  <div className="text-center py-12 bg-cream-dark/10 rounded-2xl border border-forest/10">
                                    <p className="text-xs text-forest/60">No pending verification invoices found.</p>
                                    <p className="text-[10px] text-forest/40 mt-1">All incoming transaction reports have been parsed and reconciled.</p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {orders
                                      .filter((o) => o.status === "Payment Verification Pending")
                                      .map((order) => (
                                        <div key={order.id} className="bg-cream border border-forest/10 p-5 rounded-xl shadow-xs space-y-4">
                                          <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-forest/5">
                                            <div>
                                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                Awaiting Reconcile
                                              </span>
                                              <h5 className="font-bold text-xs text-forest mt-1">Invoice #{order.id}</h5>
                                              <span className="text-[10px] text-forest/50 font-semibold">Placed: {formatOrderTime(order.createdAt)}</span>
                                            </div>
                                            <div className="text-right">
                                              <span className="text-xs font-bold text-forest block">Order Total: ৳{order.total}</span>
                                              <span className="text-[10px] text-forest/60">Qty: {order.items.length} specimens</span>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-poppins font-medium">
                                            {/* Left columns: details */}
                                            <div className="md:col-span-8 space-y-2">
                                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                <div>
                                                  <p className="font-semibold text-forest/55 text-[10px]">Customer Contact</p>
                                                  <p className="font-bold text-forest">{order.customerName}</p>
                                                  <p className="text-[11px] font-mono text-forest/75">{order.phone}</p>
                                                </div>
                                                <div>
                                                  <p className="font-semibold text-forest/55 text-[10px]">Payment Selected</p>
                                                  <p className="font-bold text-[#E2125F] flex items-center gap-1.5 uppercase">
                                                    {order.paymentMethod || "bKash / Nagad"}
                                                  </p>
                                                  <p className="text-[10px] text-forest/60">Amount Declared: ৳{order.paymentAmount || order.total}</p>
                                                </div>
                                                <div>
                                                  <p className="font-semibold text-forest/55 text-[10px]">Sender Wallet No.</p>
                                                  <p className="font-mono font-bold text-forest text-xs">{order.paymentNumberUsed || "N/A"}</p>
                                                </div>
                                                <div>
                                                  <p className="font-semibold text-forest/55 text-[10px]">Transaction ID (TxID)</p>
                                                  <p className="font-mono font-bold text-emerald-green text-xs tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                                                    {order.paymentTransactionId || "N/A"}
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="pt-2 border-t border-forest/5">
                                                <p className="font-semibold text-forest/55 text-[10px]">Delivery Coordinates</p>
                                                <p className="text-[11px] text-forest/75 font-sans">
                                                  {order.address}, {order.area}, {order.district}
                                                </p>
                                                {order.note && (
                                                  <p className="text-[10px] text-forest/55 italic mt-1 bg-cream-dark/10 p-1.5 rounded">
                                                    Notes: "{order.note}"
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            {/* Right column: Screenshot preview if present */}
                                            <div className="md:col-span-4 flex flex-col items-center justify-center border border-forest/10 p-3 rounded-lg bg-cream-dark/5">
                                              <p className="font-semibold text-forest/55 text-[10px] mb-2 self-start">PAYMENT VERIFICATION PROOF</p>
                                              {order.paymentScreenshot ? (
                                                <div className="text-center w-full">
                                                  <img
                                                    src={order.paymentScreenshot}
                                                    alt="Payment Evidence"
                                                    onClick={() => setSelectedProofImage(order.paymentScreenshot || null)}
                                                    className="w-full max-h-24 object-cover rounded border border-forest/15 cursor-pointer hover:opacity-85 transition-opacity"
                                                    referrerPolicy="no-referrer"
                                                  />
                                                  <button
                                                    onClick={() => setSelectedProofImage(order.paymentScreenshot || null)}
                                                    className="text-[9px] text-forest font-bold mt-1 hover:underline cursor-pointer"
                                                  >
                                                    View Full Resolution
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="text-center text-forest/40 text-[10px] py-6">
                                                  No Screenshot uploaded.
                                                  <br />
                                                  Verify manually via TxID.
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {/* Action Buttons to Verify */}
                                          <div className="flex justify-end gap-2 pt-3 border-t border-forest/5">
                                            <button
                                              onClick={async () => {
                                                if (confirm("Are you sure you want to REJECT this transaction payment report? This sets status to Cancelled.")) {
                                                  await adminUpdateOrderStatus(order.id, "Cancelled");
                                                  alert("Payment order cancelled successfully.");
                                                }
                                              }}
                                              className="bg-[#8A3324]/10 hover:bg-[#8A3324]/20 text-[#8A3324] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                            >
                                              Reject Payment (Cancel)
                                            </button>
                                            <button
                                              onClick={async () => {
                                                await adminUpdateOrderStatus(order.id, "Payment Verified");
                                                alert("Payment successfully verified! Order status updated to 'Payment Verified'.");
                                              }}
                                              className="bg-emerald-green hover:bg-forest text-cream px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                              Approve & Verify Payment
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* TAB 4: Transaction History (All orders list with payment breakdowns) */}
                            {adminPaymentSubTab === "history" && (
                              <div className="space-y-4 text-left font-poppins font-medium">
                                <div className="flex justify-between items-center border-b border-forest/5 pb-2">
                                  <h4 className="font-cinzel text-[11px] font-bold text-forest tracking-wider uppercase">
                                    All Transaction Records ({orders.length})
                                  </h4>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs text-left border-collapse">
                                    <thead>
                                      <tr className="bg-cream-dark/30 text-forest font-bold uppercase tracking-wider text-[9px] border-b border-forest/10">
                                        <th className="p-3 text-left">Order ID</th>
                                        <th className="p-3 text-left">Placed At</th>
                                        <th className="p-3 text-left">Customer</th>
                                        <th className="p-3 text-left">Payment Method</th>
                                        <th className="p-3 text-left">Sender & TxID</th>
                                        <th className="p-3 text-left">Amount</th>
                                        <th className="p-3 text-center">Receipt</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-forest/5 text-forest">
                                      {orders.map((o) => {
                                        const isPending = o.status === "Payment Verification Pending";
                                        const isVerified = o.status === "Payment Verified";
                                        const isCancelled = o.status === "Cancelled";

                                        return (
                                          <tr key={o.id} className="hover:bg-cream-dark/10 transition-colors">
                                            <td className="p-3 font-mono font-bold text-forest">#{o.id}</td>
                                            <td className="p-3 font-semibold text-forest/75 text-[11px] leading-snug">
                                              {formatOrderTime(o.createdAt)}
                                            </td>
                                            <td className="p-3">
                                              <p className="font-bold text-forest">{o.customerName}</p>
                                              <p className="text-[10px] text-forest/60">{o.phone}</p>
                                            </td>
                                            <td className="p-3 font-semibold text-forest uppercase">
                                              {o.paymentMethod || "COD / Unknown"}
                                            </td>
                                            <td className="p-3">
                                              {o.paymentNumberUsed ? (
                                                <div className="space-y-0.5">
                                                  <p className="font-mono text-[11px]">{o.paymentNumberUsed}</p>
                                                  <p className="font-mono text-[10px] text-emerald-green bg-emerald-50 px-1 rounded border border-emerald-100 inline-block">
                                                    TxID: {o.paymentTransactionId || "N/A"}
                                                  </p>
                                                </div>
                                              ) : (
                                                <span className="text-forest/40">N/A (Standard COD)</span>
                                              )}
                                            </td>
                                            <td className="p-3 font-bold text-forest font-mono">
                                              ৳{o.paymentAmount || o.total}
                                            </td>
                                            <td className="p-3 text-center">
                                              {o.paymentScreenshot ? (
                                                <button
                                                  onClick={() => setSelectedProofImage(o.paymentScreenshot || null)}
                                                  className="text-[10px] text-emerald-green hover:underline font-bold"
                                                >
                                                  View Proof
                                                </button>
                                              ) : (
                                                <span className="text-forest/30 font-mono">-</span>
                                              )}
                                            </td>
                                            <td className="p-3">
                                              <span
                                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${
                                                  isPending
                                                    ? "bg-amber-100 text-amber-800"
                                                    : isVerified
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : isCancelled
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                              >
                                                {o.status}
                                              </span>
                                            </td>
                                            <td className="p-3 text-right">
                                              <select
                                                value={o.status}
                                                onChange={(e: any) => adminUpdateOrderStatus(o.id, e.target.value)}
                                                className="bg-cream border border-forest/15 rounded text-[10px] p-1 font-semibold text-forest focus:outline-none"
                                              >
                                                <option value="Payment Verification Pending">Pending Verification</option>
                                                <option value="Payment Verified">Payment Verified</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                              </select>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {adminActiveSub === "seo" && (
                          <SEOEngine 
                            products={products}
                            categories={categories}
                            blogs={blogs}
                            seoSettings={seoSettings}
                            onUpdateSEOSettings={adminUpdateSEOSettings}
                            fetchDB={fetchDB}
                          />
                        )}

                        {adminActiveSub === "cms" && (
                          <WebsiteCMS
                            products={products}
                            websiteContent={websiteContent}
                            cloudinarySettings={cloudinarySettings}
                            onUpdateWebsiteContent={adminUpdateWebsiteContent}
                            onUpdateCloudinarySettings={adminUpdateCloudinarySettings}
                          />
                        )}

                        {/* 12K. STEADFAST COURIER MANAGEMENT */}
                        {adminActiveSub === "courier" && (
                          <div className="space-y-6 font-poppins text-left">
                            <div className="border-b border-forest/10 pb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-forest text-cream rounded-xl">
                                  <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-cinzel text-base font-bold tracking-wider text-forest uppercase">
                                    STEADFAST COURIER API INTEGRATION
                                  </h3>
                                  <p className="text-xs text-forest/70 mt-0.5">
                                    Automate nationwide Bangladeshi delivery dispatch, tracking code generation, and COD reconciliation.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Account Balance Banner */}
                            <div className="bg-forest/5 border border-forest/15 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold text-forest/70 uppercase tracking-wider">Merchant Account Balance</p>
                                <p className="text-2xl font-bold font-cinzel text-forest mt-1">
                                  {courierBalance !== null ? `৳${courierBalance}` : "—"}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={handleFetchCourierBalance}
                                  disabled={isCheckingBalance}
                                  className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                  {isCheckingBalance ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                  Check Account Balance
                                </button>
                                <a
                                  href="https://portal.steadfast.com.bd"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-cream-dark/50 hover:bg-forest/10 text-forest font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                                >
                                  <span>Portal</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            {/* Credentials Form */}
                            <form onSubmit={handleSaveCourierSettings} className="bg-cream-dark/15 border border-forest/10 rounded-2xl p-5 space-y-4">
                              <h4 className="font-cinzel font-bold text-xs uppercase text-forest border-b border-forest/10 pb-2">
                                API Security Keys & Configurations
                              </h4>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-bold text-forest mb-1">
                                    Steadfast API Key <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={courierForm.apiKey}
                                    onChange={(e) => setCourierForm({ ...courierForm, apiKey: e.target.value })}
                                    placeholder="e.g. st_api_key_xxxxxxxxxxxx"
                                    className="w-full bg-cream border border-forest/20 rounded-xl px-3 py-2 text-xs text-forest focus:outline-none focus:border-forest font-mono"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-forest mb-1">
                                    Steadfast Secret Key <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="password"
                                    value={courierForm.secretKey}
                                    onChange={(e) => setCourierForm({ ...courierForm, secretKey: e.target.value })}
                                    placeholder="e.g. st_secret_xxxxxxxxxxxx"
                                    className="w-full bg-cream border border-forest/20 rounded-xl px-3 py-2 text-xs text-forest focus:outline-none focus:border-forest font-mono"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-forest mb-1">
                                    API Base URL
                                  </label>
                                  <input
                                    type="text"
                                    value={courierForm.baseUrl}
                                    onChange={(e) => setCourierForm({ ...courierForm, baseUrl: e.target.value })}
                                    placeholder="https://portal.steadfast.com.bd/api/v1"
                                    className="w-full bg-cream border border-forest/20 rounded-xl px-3 py-2 text-xs text-forest focus:outline-none focus:border-forest font-mono"
                                  />
                                </div>

                                <div className="pt-2">
                                  <label className="flex items-center gap-3 cursor-pointer select-none bg-cream p-3 rounded-xl border border-forest/15">
                                    <input
                                      type="checkbox"
                                      checked={courierForm.autoSendOnConfirm}
                                      onChange={(e) => setCourierForm({ ...courierForm, autoSendOnConfirm: e.target.checked })}
                                      className="w-4 h-4 accent-forest rounded"
                                    />
                                    <div>
                                      <span className="font-bold text-xs text-forest block">Auto-Dispatch on Order Confirmation</span>
                                      <span className="text-[11px] text-forest/70 block">
                                        When you set an order status to "Payment Verified", "Processing", or "Shipped", automatically add it to Steadfast Courier.
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              {courierTestResult && (
                                <div className={`p-3 rounded-xl text-xs font-semibold ${courierTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                  {courierTestResult.message}
                                </div>
                              )}

                              <div className="flex items-center gap-3 pt-2">
                                <button
                                  type="submit"
                                  className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                                >
                                  <Check className="w-4 h-4" /> Save Courier Settings
                                </button>
                                <button
                                  type="button"
                                  onClick={handleFetchCourierBalance}
                                  disabled={isCheckingBalance}
                                  className="bg-cream border border-forest/20 hover:bg-forest/5 text-forest font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Test Connection
                                </button>
                              </div>
                            </form>

                            {/* Integration Guide Box */}
                            <div className="bg-cream-dark/10 border border-forest/10 rounded-2xl p-5 space-y-3">
                              <h4 className="font-cinzel font-bold text-xs text-forest uppercase tracking-wider">
                                How Steadfast Courier Integration Works
                              </h4>
                              <ol className="list-decimal list-inside text-xs text-forest/80 space-y-2 leading-relaxed">
                                <li><strong>Order Confirmation:</strong> In Admin -&gt; Invoice Orders, when you confirm an order (status updated to Payment Verified/Processing), the system instantly makes an API call to Steadfast Courier.</li>
                                <li><strong>Automatic Payload Mapping:</strong> The recipient name, phone, full address (district &amp; area), COD amount, and order items summary are formatted according to Steadfast requirements.</li>
                                <li><strong>Consignment ID &amp; Tracking:</strong> Steadfast returns a unique Consignment ID and Tracking Code, which is saved directly to the order in Firestore.</li>
                                <li><strong>Live Delivery Tracking:</strong> Click "Check Status" on any order card at any time to pull real-time courier delivery progress directly from Steadfast Courier.</li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {/* 12M. CUSTOM DOMAIN & GOOGLE CLOUD SETTINGS */}
                        {adminActiveSub === "domain" && (
                          <div className="space-y-6 text-left font-poppins">
                            <div className="border-b border-forest/10 pb-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <h3 className="font-cinzel text-sm font-bold tracking-widest text-forest uppercase">
                                    CUSTOM DOMAIN & GOOGLE CLOUD RUN INTEGRATION
                                  </h3>
                                  <p className="text-xs text-forest/60 mt-0.5">
                                    Configure your custom domain name for Google Cloud Run deployment with automatic SSL certificates and canonical URL routing.
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Cloud Run Ready
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Domain Configuration Form */}
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await adminUpdateDomainSettings(adminDomainForm);
                                alert("Domain configuration updated and saved to Firestore!");
                              }}
                              className="bg-cream-dark/20 border border-forest/15 rounded-2xl p-6 space-y-6"
                            >
                              <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                                <h4 className="font-cinzel font-bold text-xs text-forest uppercase tracking-wider flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-emerald-green" /> Primary Domain Settings
                                </h4>
                                <span className="text-[10px] text-forest/50 font-semibold font-mono">
                                  Settings / Domain & Cloud
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-poppins">
                                <div>
                                  <label className="block font-semibold text-forest mb-1">
                                    Custom Primary Domain (Apex) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. leafaquatic.com"
                                    value={adminDomainForm.customDomain}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, customDomain: e.target.value.trim().toLowerCase() })}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-xl font-mono text-xs text-forest focus:border-gold focus:outline-none"
                                  />
                                  <span className="text-[10px] text-forest/55 mt-1 block">
                                    Your registered domain name without http/https or www.
                                  </span>
                                </div>

                                <div>
                                  <label className="block font-semibold text-forest mb-1">
                                    Subdomain Alias (CNAME) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. www.leafaquatic.com"
                                    value={adminDomainForm.subdomain}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, subdomain: e.target.value.trim().toLowerCase() })}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-xl font-mono text-xs text-forest focus:border-gold focus:outline-none"
                                  />
                                  <span className="text-[10px] text-forest/55 mt-1 block">
                                    The www prefix mapped to Google Cloud Run proxy.
                                  </span>
                                </div>

                                <div>
                                  <label className="block font-semibold text-forest mb-1">
                                    Google Cloud Project ID
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. leafaquatic-app"
                                    value={adminDomainForm.googleCloudProject}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, googleCloudProject: e.target.value })}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-xl font-mono text-xs text-forest focus:border-gold focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block font-semibold text-forest mb-1">
                                    Google Cloud Run Service Name
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. leafaquatic-service"
                                    value={adminDomainForm.cloudRunService}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, cloudRunService: e.target.value })}
                                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-xl font-mono text-xs text-forest focus:border-gold focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Toggles */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <label className="flex items-center gap-3 bg-cream p-3 rounded-xl border border-forest/10 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={adminDomainForm.forceHttps}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, forceHttps: e.target.checked })}
                                    className="w-4 h-4 accent-emerald-green cursor-pointer"
                                  />
                                  <div>
                                    <p className="font-semibold text-xs text-forest">Force Automatic SSL / HTTPS</p>
                                    <p className="text-[10px] text-forest/60">Redirect all HTTP connections to encrypted HTTPS</p>
                                  </div>
                                </label>

                                <label className="flex items-center gap-3 bg-cream p-3 rounded-xl border border-forest/10 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={adminDomainForm.canonicalRedirect}
                                    onChange={(e) => setAdminDomainForm({ ...adminDomainForm, canonicalRedirect: e.target.checked })}
                                    className="w-4 h-4 accent-emerald-green cursor-pointer"
                                  />
                                  <div>
                                    <p className="font-semibold text-xs text-forest">Canonical Domain Redirection</p>
                                    <p className="text-[10px] text-forest/60">Ensure all traffic lands on https://{adminDomainForm.customDomain || "yourdomain.com"}</p>
                                  </div>
                                </label>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <button
                                  type="submit"
                                  className="bg-forest hover:bg-emerald-green text-cream font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                                >
                                  <Check className="w-4 h-4" /> Save Domain Settings
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    setDnsCheckLoading(true);
                                    setDnsCheckResult(null);
                                    const res = await checkDomainDNS(adminDomainForm.customDomain);
                                    setDnsCheckLoading(false);
                                    if (res.success) {
                                      setDnsCheckResult(res.data);
                                    } else {
                                      alert("DNS check failed: " + res.error);
                                    }
                                  }}
                                  disabled={dnsCheckLoading}
                                  className="bg-cream border border-forest/20 hover:bg-forest/5 text-forest font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                  {dnsCheckLoading ? <Loader2 className="w-4 h-4 animate-spin text-forest" /> : <RefreshCw className="w-4 h-4 text-forest" />}
                                  Check Live DNS Propagation
                                </button>
                              </div>
                            </form>

                            {/* Live DNS Diagnostic Result Box */}
                            {dnsCheckResult && (
                              <div className={`p-5 rounded-2xl border ${dnsCheckResult.status === "CONNECTED" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"} space-y-3 font-poppins text-xs text-left`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 font-bold text-forest">
                                    <Radio className="w-4 h-4 text-emerald-green animate-pulse" />
                                    <span>DNS & Google Cloud Connection Status for {dnsCheckResult.domain}</span>
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${dnsCheckResult.status === "CONNECTED" ? "bg-emerald-200 text-emerald-900" : "bg-amber-200 text-amber-900"}`}>
                                    {dnsCheckResult.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-forest/80">
                                  <div>
                                    <p className="font-semibold text-forest">Apex A Records Resolved:</p>
                                    <p className="font-mono bg-white/70 p-1.5 rounded border border-forest/10 mt-1">
                                      {dnsCheckResult.aRecords?.length > 0 ? dnsCheckResult.aRecords.join(", ") : "No A records detected yet"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-forest">Subdomain CNAME Target Resolved:</p>
                                    <p className="font-mono bg-white/70 p-1.5 rounded border border-forest/10 mt-1">
                                      {dnsCheckResult.cnameRecords?.length > 0 ? dnsCheckResult.cnameRecords.join(", ") : "No CNAME target detected yet"}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-[10px] text-forest/60 italic">
                                  Checked via Google Public DNS resolution at {new Date(dnsCheckResult.checkedAt).toLocaleTimeString()}.
                                </p>
                              </div>
                            )}

                            {/* DNS Records Table for Registrar */}
                            <div className="bg-cream-dark/10 border border-forest/10 rounded-2xl p-6 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 pb-3">
                                <div>
                                  <h4 className="font-cinzel font-bold text-xs text-forest uppercase tracking-wider flex items-center gap-2">
                                    <Server className="w-4 h-4 text-gold" /> Required DNS Records for Google Cloud Run
                                  </h4>
                                  <p className="text-[11px] text-forest/60 mt-0.5">
                                    Copy and paste these exact DNS records into your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
                                  </p>
                                </div>
                              </div>

                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2 font-poppins">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-amber-900">Registrar TTL Requirement (TTL ≥ 7200):</p>
                                  <p className="text-[11px] text-amber-800 mt-0.5">
                                    If your domain registrar requires a minimum TTL of <strong>7200</strong> seconds (2 hours) or <strong>Automatic</strong>, enter <strong>7200</strong> in the TTL field for all DNS records. Google Cloud Run will connect smoothly regardless of the TTL setting.
                                  </p>
                                </div>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                  <thead>
                                    <tr className="bg-cream-dark/30 text-forest font-bold uppercase tracking-wider text-[10px] border-b border-forest/10">
                                      <th className="p-3">Type</th>
                                      <th className="p-3">Host / Name</th>
                                      <th className="p-3">Value / Target IP</th>
                                      <th className="p-3">TTL</th>
                                      <th className="p-3 text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-forest/5 font-mono text-forest">
                                    {/* CNAME */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-emerald-green">CNAME</td>
                                      <td className="p-3">www</td>
                                      <td className="p-3 font-semibold">ghs.googlehosted.com.</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("ghs.googlehosted.com.");
                                            setCopiedDnsKey("cname");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "cname" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* A Record 1 */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-blue-700">A</td>
                                      <td className="p-3">@ (or root)</td>
                                      <td className="p-3">216.239.32.21</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("216.239.32.21");
                                            setCopiedDnsKey("a1");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "a1" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* A Record 2 */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-blue-700">A</td>
                                      <td className="p-3">@ (or root)</td>
                                      <td className="p-3">216.239.34.21</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("216.239.34.21");
                                            setCopiedDnsKey("a2");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "a2" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* A Record 3 */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-blue-700">A</td>
                                      <td className="p-3">@ (or root)</td>
                                      <td className="p-3">216.239.36.21</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("216.239.36.21");
                                            setCopiedDnsKey("a3");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "a3" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* A Record 4 */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-blue-700">A</td>
                                      <td className="p-3">@ (or root)</td>
                                      <td className="p-3">216.239.38.21</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText("216.239.38.21");
                                            setCopiedDnsKey("a4");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "a4" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* TXT Record */}
                                    <tr className="hover:bg-cream-dark/20 transition-colors">
                                      <td className="p-3 font-bold text-purple-700">TXT</td>
                                      <td className="p-3">@ (or root)</td>
                                      <td className="p-3 text-[11px] truncate max-w-[200px]">{adminDomainForm.txtVerificationCode}</td>
                                      <td className="p-3 text-forest/70 font-bold">7200 (2 Hours)</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(adminDomainForm.txtVerificationCode);
                                            setCopiedDnsKey("txt");
                                            setTimeout(() => setCopiedDnsKey(null), 2000);
                                          }}
                                          className="text-[10px] bg-forest text-cream hover:bg-gold hover:text-forest-dark font-bold px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          {copiedDnsKey === "txt" ? "Copied!" : "Copy"}
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Step by Step Setup Guide */}
                            <div className="bg-cream-dark/15 border border-forest/10 rounded-2xl p-6 space-y-4 text-left">
                              <h4 className="font-cinzel font-bold text-xs text-forest uppercase tracking-wider flex items-center gap-2">
                                <Cloud className="w-4 h-4 text-emerald-green" /> Option A: Direct Google Cloud Run Custom Domain Mapping
                              </h4>

                              <ol className="list-decimal list-inside text-xs text-forest/80 space-y-3 leading-relaxed font-poppins">
                                <li>
                                  <strong>Step 1: Open Google Cloud Console:</strong> Sign in to <a href="https://console.cloud.google.com/run" target="_blank" rel="noopener noreferrer" className="text-emerald-green underline font-bold inline-flex items-center gap-1">console.cloud.google.com/run <ExternalLink className="w-3 h-3" /></a> and select your Cloud Run service.
                                </li>
                                <li>
                                  <strong>Step 2: Add Custom Domain Mapping:</strong> At the top bar of the Cloud Run console, click <strong>Manage Custom Domains</strong> and select <strong>Add Mapping</strong>. Select your service name and choose your verified domain or add a new custom domain.
                                </li>
                                <li>
                                  <strong>Step 3: Update DNS Records at Domain Registrar:</strong> Copy the CNAME record (`www` -&gt; `ghs.googlehosted.com.`) and the 4 A records listed above and paste them into your domain registrar's DNS management panel. Set TTL to <strong>7200</strong> or <strong>Automatic</strong>.
                                </li>
                                <li>
                                  <strong>Step 4: Automatic SSL Certificate Issuance:</strong> Google Cloud will automatically verify domain ownership and issue a managed SSL/TLS certificate. SSL provisioning takes between 10 to 30 minutes.
                                </li>
                              </ol>
                            </div>

                            {/* Alternative Methods Box when Cloud Run direct mapping shows unavailable */}
                            <div className="bg-emerald-950 text-cream rounded-2xl p-6 space-y-5 text-left font-poppins shadow-lg border border-gold/30">
                              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div>
                                  <h4 className="font-cinzel font-bold text-sm text-gold uppercase tracking-wider flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-gold" /> Option B: Cloudflare Free Proxy (100% Recommended & Works Everywhere)
                                  </h4>
                                  <p className="text-xs text-cream/70 mt-0.5">
                                    If Google Cloud Run says "Custom domain mapping is not available for this project/region", Cloudflare Free Proxy handles your custom domain seamlessly!
                                  </p>
                                </div>
                                <span className="bg-gold/20 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-gold/30">
                                  No GCP Restriction
                                </span>
                              </div>

                              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-xs">
                                <p className="font-bold text-white flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-emerald-400" /> Your Live Cloud Application Target URL:
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value="https://ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app"
                                    className="bg-black/40 border border-white/20 px-3 py-2 rounded-lg font-mono text-xs text-gold flex-1 min-w-[280px]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText("https://ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app");
                                      setCopiedDnsKey("target-url");
                                      setTimeout(() => setCopiedDnsKey(null), 2000);
                                    }}
                                    className="bg-gold text-forest-dark hover:bg-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    {copiedDnsKey === "target-url" ? "URL Copied!" : "Copy Target URL"}
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3 text-xs leading-relaxed text-cream/90">
                                <h5 className="font-bold text-white text-xs uppercase tracking-wider text-gold">
                                  How to set up Cloudflare Free Proxy (5 Minutes):
                                </h5>
                                <ol className="list-decimal list-inside space-y-2.5 text-cream/80">
                                  <li>
                                    <strong>Create a free account at <a href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noopener noreferrer" className="text-gold underline">Cloudflare.com</a></strong> and add your domain (<code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-gold">{adminDomainForm.customDomain}</code>).
                                  </li>
                                  <li>
                                    <strong>Go to DNS Settings:</strong> Add a <strong>CNAME</strong> record:
                                    <ul className="list-disc list-inside ml-6 mt-1 font-mono text-[11px] text-emerald-300 space-y-0.5">
                                      <li>Name: <strong>@</strong> (or root) &rarr; Target: <strong>ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app</strong></li>
                                      <li>Name: <strong>www</strong> &rarr; Target: <strong>ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app</strong></li>
                                      <li>Proxy Status: <strong>Proxied (Orange Cloud)</strong></li>
                                      <li>TTL: <strong>Auto</strong> or <strong>7200</strong></li>
                                    </ul>
                                  </li>
                                  <li>
                                    <strong>SSL/TLS Mode:</strong> Set Cloudflare SSL/TLS encryption mode to <strong>Full</strong> or <strong>Full (strict)</strong>.
                                  </li>
                                  <li>
                                    <strong>Nameservers:</strong> Update your domain registrar's (GoDaddy/Namecheap) nameservers to Cloudflare's 2 assigned nameservers.
                                  </li>
                                </ol>
                              </div>

                              <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/70">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>Cloudflare handles free SSL certificates and DDoS protection automatically!</span>
                                </div>
                                <a
                                  href="https://dash.cloudflare.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gold hover:underline font-bold inline-flex items-center gap-1 text-xs"
                                >
                                  Open Cloudflare Dashboard <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>

                              {/* SSL & Google 404 Troubleshooting Notice */}
                              <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3.5 text-xs text-amber-200 space-y-2 font-poppins">
                                <p className="font-bold flex items-center gap-1.5 text-gold text-xs">
                                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> Seeing "Google 404. That's an error. The requested URL / was not found"?
                                </p>
                                <div className="text-[11px] text-amber-100/90 leading-relaxed space-y-1 bg-black/30 p-2.5 rounded-lg border border-amber-400/20">
                                  <p className="font-semibold text-white">Why this happens:</p>
                                  <p>Google Cloud Run expects requests with Host header <code className="text-gold font-mono">ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app</code>. When Cloudflare sends <code className="text-gold font-mono">leafaquatic.com</code>, Google returns a 404 error.</p>
                                  <p className="font-semibold text-white mt-1.5">How to fix in 2 Minutes for FREE (Cloudflare Worker):</p>
                                  <ol className="list-decimal list-inside space-y-1.5 text-cream/90 ml-1">
                                    <li>On the screen you are currently seeing, click <strong>Start with Hello World!</strong> (with the green globe icon).</li>
                                    <li>Click <strong>Deploy</strong> on the bottom right, then click <strong>Edit code</strong> (or <strong>Quick edit</strong>).</li>
                                    <li>Select all existing code, delete it, and paste this code:
                                      <pre className="bg-black/60 text-gold p-2 rounded text-[10px] my-1 font-mono select-all">
{`export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = "ais-pre-wjhsx6uufhlkpgbn5ugnd4-150466047166.asia-east1.run.app";
    return fetch(new Request(url.toString(), request));
  }
};`}
                                      </pre>
                                    </li>
                                    <li>Click <strong>Deploy</strong> (or Save and deploy).</li>
                                    <li>Go back to your domain (<strong>leafaquatic.com</strong>) &rarr; <strong>Workers Routes</strong> &rarr; <strong>Add Route</strong> (or Worker &rarr; Settings &rarr; Domains &amp; Routes).</li>
                                    <li>Add Route: <code className="text-gold font-mono">leafaquatic.com/*</code> and repeat for <code className="text-gold font-mono">www.leafaquatic.com/*</code>.</li>
                                  </ol>
                                </div>

                                <p className="font-bold flex items-center gap-1.5 text-amber-300 pt-1">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Additional SSL Settings in Cloudflare:
                                </p>
                                <p className="text-[11px] text-amber-100/80 leading-relaxed">
                                  1. <strong>Set SSL Mode to Full:</strong> In Cloudflare, go to <strong>SSL/TLS &rarr; Overview</strong> and set encryption mode to <strong>Full</strong>.
                                </p>
                                <p className="text-[11px] text-amber-100/80 leading-relaxed">
                                  2. <strong>Enable Always Use HTTPS:</strong> Go to <strong>SSL/TLS &rarr; Edge Certificates</strong> and toggle <strong>Always Use HTTPS</strong> to ON.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            );

            return (
              <Routes key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<HomepageSkeleton />}>
                      <HomePage setShopCategory={setShopCategory} />
                    </Suspense>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Suspense fallback={<CategoryPageSkeleton />}>
                      <ShopPage
                        shopCategory={shopCategory}
                        setShopCategory={setShopCategory}
                        shopPrice={shopPrice}
                        setShopPrice={setShopPrice}
                        shopDifficulty={shopDifficulty}
                        setShopDifficulty={setShopDifficulty}
                        shopLight={shopLight}
                        setShopLight={setShopLight}
                        shopCO2={shopCO2}
                        setShopCO2={setShopCO2}
                        shopSort={shopSort}
                        setShopSort={setShopSort}
                        shopSearch={shopSearch}
                        setShopSearch={setShopSearch}
                        shopBrand={shopBrand}
                        setShopBrand={setShopBrand}
                        shopAvailability={shopAvailability}
                        setShopAvailability={setShopAvailability}
                        isMobileFilterOpen={isMobileFilterOpen}
                        setIsMobileFilterOpen={setIsMobileFilterOpen}
                      />
                    </Suspense>
                  }
                />
                <Route
                  path="/category/:slug"
                  element={
                    <Suspense fallback={<CategoryPageSkeleton />}>
                      <ShopPage
                        shopCategory={shopCategory}
                        setShopCategory={setShopCategory}
                        shopPrice={shopPrice}
                        setShopPrice={setShopPrice}
                        shopDifficulty={shopDifficulty}
                        setShopDifficulty={setShopDifficulty}
                        shopLight={shopLight}
                        setShopLight={setShopLight}
                        shopCO2={shopCO2}
                        setShopCO2={setShopCO2}
                        shopSort={shopSort}
                        setShopSort={setShopSort}
                        shopSearch={shopSearch}
                        setShopSearch={setShopSearch}
                        shopBrand={shopBrand}
                        setShopBrand={setShopBrand}
                        shopAvailability={shopAvailability}
                        setShopAvailability={setShopAvailability}
                        isMobileFilterOpen={isMobileFilterOpen}
                        setIsMobileFilterOpen={setIsMobileFilterOpen}
                      />
                    </Suspense>
                  }
                />
                <Route
                  path="/product/:slug"
                  element={
                    <Suspense fallback={<ProductDetailsSkeleton />}>
                      <ProductPage activeProduct={activeProduct} />
                    </Suspense>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Suspense fallback={<ShoppingCartSkeleton />}>
                      <CartPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Suspense fallback={<CheckoutSkeleton />}>
                      <CheckoutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <Suspense fallback={<CategoryPageSkeleton />}>
                      <WishlistPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <Suspense fallback={<BlogSkeleton />}>
                      <BlogPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/blog/:slug"
                  element={
                    <Suspense fallback={<BlogDetailsSkeleton />}>
                      <BlogDetailsPage activeBlog={activeBlog} />
                    </Suspense>
                  }
                />
                <Route
                  path="/ai-plant-finder"
                  element={
                    <Suspense fallback={<QuizSkeleton />}>
                      <PlantFinderPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <Suspense fallback={<QuizSkeleton />}>
                      <PlantFinderPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <LegalPage activeLegalKey="privacy" />
                    </Suspense>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <LegalPage activeLegalKey="terms" />
                    </Suspense>
                  }
                />
                <Route
                  path="/refund-policy"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <LegalPage activeLegalKey="refund" />
                    </Suspense>
                  }
                />
                <Route
                  path="/shipping-policy"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <LegalPage activeLegalKey="shipping" />
                    </Suspense>
                  }
                />
                <Route
                  path="/confirmation"
                  element={
                    <Suspense fallback={<CheckoutSkeleton />}>
                      <OrderConfirmationPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin"
                  element={adminView}
                />
                <Route
                  path="/categories"
                  element={
                    <Suspense fallback={<CategoryPageSkeleton />}>
                      <CategoriesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <AboutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Suspense fallback={<LegalPageSkeleton />}>
                      <ContactPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/track-order"
                  element={
                    <Suspense fallback={<CheckoutSkeleton />}>
                      <TrackOrderPage />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<HomepageSkeleton />}>
                      <NotFoundPage />
                    </Suspense>
                  }
                />
              </Routes>
            );
          })()}
        </AnimatePresence>
        )}

      </main>

      {/* Shared luxury brand footer */}
      <Footer />

      {/* FLOATING WHATSAPP CHAT BUTTON (ALL PAGES) */}
      {whatsappSettings.enabled && (
        <a
          href={`https://wa.me/${whatsappSettings.phoneNumber}?text=${encodeURIComponent(whatsappSettings.defaultMessage)}`}
          target="_blank"
          rel="noreferrer"
          onClick={trackWhatsAppClick}
          className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
          title="Chat with Leaf Aquatic"
        >
          {/* Subtle pulse animation waves */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none"></span>
          <MessageCircle className="w-6 h-6 relative z-10 text-white fill-white/10" />
        </a>
      )}

      {/* SCREENSHOT LIGHTBOX MODAL */}
      {selectedProofImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cream border border-forest/15 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedProofImage(null)}
              className="absolute top-4 right-4 font-bold text-forest text-lg hover:text-[#8A3324] transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h4 className="font-cinzel text-xs font-bold text-forest mb-4 tracking-widest uppercase text-left">
              PAYMENT SCREENSHOT PROOF OF INVOICE
            </h4>
            <div className="border border-forest/10 rounded-lg overflow-hidden bg-black/5 flex items-center justify-center max-h-[70vh]">
              <img
                src={selectedProofImage}
                alt="Payment Evidence Proof"
                className="max-h-[60vh] object-contain w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedProofImage(null)}
                className="bg-forest text-cream px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-emerald-green transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (MOBILE ONLY) */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-forest/10 py-2.5 px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40 flex items-center justify-around md:hidden font-poppins text-xs font-semibold">
        {/* Home Button */}
        <button
          onClick={() => setView("home")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeView === "home" ? "text-gold" : "text-forest/70"
          }`}
        >
          <svg
            className="w-5 h-5 transition-transform active:scale-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[10px] tracking-wide">Home</span>
        </button>

        {/* Shop Button */}
        <button
          onClick={() => setView("shop")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeView === "shop" || activeView === "details" ? "text-gold" : "text-forest/70"
          }`}
        >
          <ShoppingBag className="w-5 h-5 transition-transform active:scale-90" />
          <span className="text-[10px] tracking-wide">Shop</span>
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappSettings.phoneNumber}?text=${encodeURIComponent(whatsappSettings.defaultMessage)}`}
          target="_blank"
          rel="noreferrer"
          onClick={trackWhatsAppClick}
          className="flex flex-col items-center gap-1 cursor-pointer text-forest/70 hover:text-gold transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5 transition-transform active:scale-90" />
          <span className="text-[10px] tracking-wide">WhatsApp</span>
        </a>

        {/* Blog Button */}
        <button
          onClick={() => setView("blog")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeView === "blog" || activeView === "blog-details" ? "text-gold" : "text-forest/70"
          }`}
        >
          <FileText className="w-5 h-5 transition-transform active:scale-90" />
          <span className="text-[10px] tracking-wide">Blog</span>
        </button>
      </div>

    </div>
  );
}
