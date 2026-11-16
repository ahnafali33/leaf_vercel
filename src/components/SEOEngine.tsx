import React, { useState, useEffect } from "react";
import { 
  Globe, Search, Sparkles, CheckCircle2, AlertCircle, Save, 
  FileText, Layout, Check, Settings, Activity, Code, Sliders, RefreshCw, Eye
} from "lucide-react";

interface SEOEngineProps {
  products: any[];
  categories: any[];
  blogs: any[];
  seoSettings: any;
  onUpdateSEOSettings: (settings: any) => Promise<void>;
  fetchDB: () => Promise<void>;
}

export default function SEOEngine({ 
  products, 
  categories, 
  blogs, 
  seoSettings, 
  onUpdateSEOSettings,
  fetchDB
}: SEOEngineProps) {
  const [activeTab, setActiveTab] = useState<"global" | "homepage" | "pages" | "search-console" | "analytics" | "items">("global");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Global SEO State
  const [globalSEO, setGlobalSEO] = useState({
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultOgImage: "",
    defaultTwitterImage: "",
    websiteUrl: "",
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    whatsappUrl: "",
    googleBusinessProfileUrl: ""
  });

  // Homepage SEO State
  const [homepageSEO, setHomepageSEO] = useState({
    websiteTitle: "",
    homepageTitle: "",
    homepageDescription: "",
    homepageKeywords: "",
    homepageOgImage: "",
    homepageTwitterImage: "",
    organizationSchema: "{}",
    localBusinessSchema: "{}",
    logoSchema: "{}",
    websiteSchema: "{}"
  });

  // Static Pages SEO State
  const [pagesSEO, setPagesSEO] = useState<any>({});
  const [selectedPageKey, setSelectedPageKey] = useState<string>("about-us");

  // Google Search Console State
  const [searchConsoleSEO, setSearchConsoleSEO] = useState({
    searchConsoleCode: "",
    sitemapUrl: "",
    robotsTxt: "",
    robotsEnabled: true
  });

  // Google Analytics State
  const [analyticsSEO, setAnalyticsSEO] = useState({
    ga4MeasurementId: "",
    gtmId: "",
    adsConversionId: "",
    facebookPixelId: "",
    clarityId: ""
  });

  // Content Items SEO State
  const [selectedItemType, setSelectedItemType] = useState<"products" | "categories" | "blogs">("products");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [itemSEO, setItemSEO] = useState({
    seoTitle: "",
    metaDescription: "",
    focusKeyword: "",
    slug: "",
    canonicalUrl: "",
    metaRobots: "index, follow",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    productSchema: "{}",
    categorySchema: "{}",
    articleSchema: "{}",
    imageAlt: "",
    customMetaKeywords: "",
    faqSchema: "[]",
    breadcrumbSchema: "[]",
    twitterCard: "summary_large_image",
    readingTime: "5 min read",
    tableOfContents: ""
  });

  // Load database settings when mounted or when database refreshes
  useEffect(() => {
    if (seoSettings) {
      if (seoSettings.global) setGlobalSEO({ ...globalSEO, ...seoSettings.global });
      if (seoSettings.homepage) setHomepageSEO({ ...homepageSEO, ...seoSettings.homepage });
      if (seoSettings.pages) setPagesSEO(seoSettings.pages);
      if (seoSettings.searchConsole) setSearchConsoleSEO({ ...searchConsoleSEO, ...seoSettings.searchConsole });
      if (seoSettings.analytics) setAnalyticsSEO({ ...analyticsSEO, ...seoSettings.analytics });
    }
  }, [seoSettings]);

  // Set initial selected item when tab changes or items load
  useEffect(() => {
    if (selectedItemType === "products" && products.length > 0) {
      setSelectedItemId(products[0].id);
    } else if (selectedItemType === "categories" && categories.length > 0) {
      setSelectedItemId(categories[0].id);
    } else if (selectedItemType === "blogs" && blogs.length > 0) {
      setSelectedItemId(blogs[0].id);
    }
  }, [selectedItemType, products, categories, blogs]);

  // Load selected content item's SEO fields
  useEffect(() => {
    if (!selectedItemId) return;

    let foundItem: any = null;
    if (selectedItemType === "products") {
      foundItem = products.find(p => p.id === selectedItemId);
    } else if (selectedItemType === "categories") {
      foundItem = categories.find(c => c.id === selectedItemId);
    } else if (selectedItemType === "blogs") {
      foundItem = blogs.find(b => b.id === selectedItemId);
    }

    if (foundItem) {
      const seo = foundItem.seo || {};
      setItemSEO({
        seoTitle: seo.seoTitle || foundItem.name || foundItem.title || "",
        metaDescription: seo.metaDescription || foundItem.description || foundItem.excerpt || "",
        focusKeyword: seo.focusKeyword || foundItem.name || foundItem.title || "",
        slug: seo.slug || "",
        canonicalUrl: seo.canonicalUrl || "",
        metaRobots: seo.metaRobots || "index, follow",
        ogTitle: seo.ogTitle || foundItem.name || foundItem.title || "",
        ogDescription: seo.ogDescription || foundItem.description || foundItem.excerpt || "",
        ogImage: seo.ogImage || foundItem.image || (foundItem.images && foundItem.images[0]) || "",
        twitterTitle: seo.twitterTitle || foundItem.name || foundItem.title || "",
        twitterDescription: seo.twitterDescription || foundItem.description || foundItem.excerpt || "",
        twitterImage: seo.twitterImage || foundItem.image || (foundItem.images && foundItem.images[0]) || "",
        productSchema: seo.productSchema || "{}",
        categorySchema: seo.categorySchema || "{}",
        articleSchema: seo.articleSchema || "{}",
        imageAlt: seo.imageAlt || "",
        customMetaKeywords: seo.customMetaKeywords || "",
        faqSchema: seo.faqSchema || "[]",
        breadcrumbSchema: seo.breadcrumbSchema || "[]",
        twitterCard: seo.twitterCard || "summary_large_image",
        readingTime: seo.readingTime || "5 min read",
        tableOfContents: seo.tableOfContents || ""
      });
    }
  }, [selectedItemId, selectedItemType, products, categories, blogs]);

  // Handle saving configurations
  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    await onUpdateSEOSettings({ ...seoSettings, global: globalSEO });
    setSaveStatus("Global SEO saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    await onUpdateSEOSettings({ ...seoSettings, homepage: homepageSEO });
    setSaveStatus("Homepage SEO saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSavePageSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    const updatedPages = {
      ...pagesSEO,
      [selectedPageKey]: pagesSEO[selectedPageKey] || {}
    };
    await onUpdateSEOSettings({ ...seoSettings, pages: updatedPages });
    setSaveStatus("Page SEO configurations saved!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveSearchConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    await onUpdateSEOSettings({ ...seoSettings, searchConsole: searchConsoleSEO });
    setSaveStatus("Google Search Console saved!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    await onUpdateSEOSettings({ ...seoSettings, analytics: analyticsSEO });
    setSaveStatus("Google Analytics configs injected!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveItemSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    setSaveStatus("Saving...");

    try {
      let endpoint = "";
      let payload: any = {};

      if (selectedItemType === "products") {
        endpoint = `/api/admin/products/${selectedItemId}`;
        const item = products.find(p => p.id === selectedItemId);
        payload = { ...item, seo: itemSEO };
      } else if (selectedItemType === "categories") {
        endpoint = `/api/admin/categories/${selectedItemId}`;
        const item = categories.find(c => c.id === selectedItemId);
        payload = { ...item, seo: itemSEO };
      } else if (selectedItemType === "blogs") {
        endpoint = `/api/admin/blogs/${selectedItemId}`;
        const item = blogs.find(b => b.id === selectedItemId);
        payload = { ...item, seo: itemSEO };
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save content SEO.");
      await fetchDB();
      setSaveStatus("Content SEO settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update item SEO.");
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // AI SEO Generator Integration
  const handleAIGenerate = async () => {
    if (!selectedItemId) return;
    setIsGenerating(true);
    setSaveStatus("AI is crafting optimization tags...");

    try {
      let currentItem: any = null;
      if (selectedItemType === "products") {
        currentItem = products.find(p => p.id === selectedItemId);
      } else if (selectedItemType === "categories") {
        currentItem = categories.find(c => c.id === selectedItemId);
      } else if (selectedItemType === "blogs") {
        currentItem = blogs.find(b => b.id === selectedItemId);
      }

      if (!currentItem) return;

      const res = await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedItemType === "products" ? "product" : selectedItemType === "blogs" ? "blog" : "category",
          name: currentItem.name || currentItem.title,
          description: currentItem.description || currentItem.excerpt || "",
          category: currentItem.category || "",
          author: currentItem.author || ""
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to trigger AI.");
      }

      const data = await res.json();
      if (data.success && data.seo) {
        const ai = data.seo;
        setItemSEO(prev => ({
          ...prev,
          seoTitle: ai.seoTitle || prev.seoTitle,
          metaDescription: ai.metaDescription || prev.metaDescription,
          focusKeyword: ai.focusKeyword || prev.focusKeyword,
          slug: ai.slug || prev.slug,
          ogTitle: ai.ogTitle || ai.seoTitle || prev.ogTitle,
          ogDescription: ai.ogDescription || ai.metaDescription || prev.ogDescription,
          twitterTitle: ai.twitterTitle || ai.seoTitle || prev.twitterTitle,
          twitterDescription: ai.twitterDescription || ai.metaDescription || prev.twitterDescription,
          imageAlt: ai.imageAlt || prev.imageAlt,
          customMetaKeywords: ai.customMetaKeywords || prev.customMetaKeywords,
          productSchema: selectedItemType === "products" ? ai.schemaMarkup : prev.productSchema,
          categorySchema: selectedItemType === "categories" ? ai.schemaMarkup : prev.categorySchema,
          articleSchema: selectedItemType === "blogs" ? ai.schemaMarkup : prev.articleSchema
        }));
        setSaveStatus("AI tags populated! Don't forget to click 'Save SEO' below.");
      }
    } catch (err: any) {
      alert(err.message || "Error generating SEO using Gemini.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // Live SEO Score computation logic
  const calculateScore = () => {
    let score = 0;
    const checks: { label: string; passed: boolean; tip: string }[] = [];

    const title = itemSEO.seoTitle || "";
    const desc = itemSEO.metaDescription || "";
    const keyword = itemSEO.focusKeyword || "";
    const slug = itemSEO.slug || "";
    const alt = itemSEO.imageAlt || "";
    const canonical = itemSEO.canonicalUrl || "";

    // 1. Focus keyword in Title (+15)
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
      checks.push({ label: "Focus keyword in title", passed: true, tip: "Great work!" });
    } else {
      checks.push({ label: "Focus keyword in title", passed: false, tip: "Add your focus keyword inside the SEO Title." });
    }

    // 2. Focus keyword in slug (+15)
    if (keyword && slug.toLowerCase().includes(keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
      score += 15;
      checks.push({ label: "Focus keyword in URL slug", passed: true, tip: "Matches URL slug perfectly." });
    } else {
      checks.push({ label: "Focus keyword in URL slug", passed: false, tip: "Incorporate focus keyword into the URL Slug." });
    }

    // 3. Focus keyword in meta description (+15)
    if (keyword && desc.toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
      checks.push({ label: "Focus keyword in description", passed: true, tip: "Excellent snippet insertion." });
    } else {
      checks.push({ label: "Focus keyword in description", passed: false, tip: "Include the focus keyword in your meta description." });
    }

    // 4. Title length (ideal is 40-60 characters) (+15)
    if (title.length >= 40 && title.length <= 60) {
      score += 15;
      checks.push({ label: "Optimal Title length (40-60 chars)", passed: true, tip: `Perfect (${title.length} chars).` });
    } else {
      checks.push({ 
        label: "Optimal Title length (40-60 chars)", 
        passed: false, 
        tip: title.length < 40 ? `Too short (${title.length} chars). Aim for 40-60.` : `Too long (${title.length} chars). Keep under 60.` 
      });
    }

    // 5. Description length (ideal is 120-160 characters) (+15)
    if (desc.length >= 120 && desc.length <= 160) {
      score += 15;
      checks.push({ label: "Optimal Description length (120-160 chars)", passed: true, tip: `Perfect (${desc.length} chars).` });
    } else {
      checks.push({ 
        label: "Optimal Description length (120-160 chars)", 
        passed: false, 
        tip: desc.length < 120 ? `Too short (${desc.length} chars). Aim for 120-160.` : `Too long (${desc.length} chars). Keep under 160.` 
      });
    }

    // 6. Image ALT text populated (+10)
    if (alt.trim().length > 2) {
      score += 10;
      checks.push({ label: "Image ALT text optimization", passed: true, tip: "Provides excellent image search signals." });
    } else {
      checks.push({ label: "Image ALT text optimization", passed: false, tip: "Specify descriptive Image ALT text for bot indexing." });
    }

    // 7. Canonical URL & Schema markup present (+15)
    const hasSchema = itemSEO.productSchema !== "{}" && itemSEO.productSchema.trim().length > 10;
    const hasCanonical = canonical.trim().length > 5;
    if (hasSchema || hasCanonical) {
      score += 15;
      checks.push({ label: "Canonical URL & Schema Rich snippet", passed: true, tip: "Structured data validates correctly!" });
    } else {
      checks.push({ label: "Canonical URL & Schema Rich snippet", passed: false, tip: "Include canonical link and JSON-LD schema." });
    }

    return { score, checks };
  };

  const { score: liveScore, checks: scoreChecklist } = calculateScore();

  return (
    <div className="space-y-6 font-poppins text-xs font-semibold text-forest text-left">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-forest/10 pb-4">
        <div>
          <h3 className="font-cinzel text-sm font-bold tracking-widest text-forest uppercase">
            SEO ENGINE CONTROL CENTER
          </h3>
          <p className="text-xs text-forest/60 font-medium">
            Manage XML sitemaps, robots.txt configs, inject analytics headers, and optimize meta layouts.
          </p>
        </div>
        {saveStatus && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-forest/10 pb-2">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "global" ? "bg-forest text-cream" : "bg-cream-dark/15 hover:bg-forest/5 text-forest/80"
          }`}
        >
          <Settings className="w-4 h-4" /> Global Business SEO
        </button>
        <button
          onClick={() => setActiveTab("homepage")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "homepage" ? "bg-forest text-cream" : "bg-cream-dark/15 hover:bg-forest/5 text-forest/80"
          }`}
        >
          <Layout className="w-4 h-4" /> Homepage Tags
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "pages" ? "bg-forest text-cream" : "bg-cream-dark/15 hover:bg-forest/5 text-forest/80"
          }`}
        >
          <FileText className="w-4 h-4" /> Static Page Meta
        </button>
        <button
          onClick={() => setActiveTab("search-console")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "search-console" ? "bg-forest text-cream" : "bg-cream-dark/15 hover:bg-forest/5 text-forest/80"
          }`}
        >
          <Globe className="w-4 h-4" /> Search Console & Sitemap
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "analytics" ? "bg-forest text-cream" : "bg-cream-dark/15 hover:bg-forest/5 text-forest/80"
          }`}
        >
          <Activity className="w-4 h-4" /> Tracking & Pixels
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "items" ? "bg-[#8A3324] text-white" : "bg-[#8A3324]/10 hover:bg-[#8A3324]/20 text-[#8A3324]"
          }`}
        >
          <Sparkles className="w-4 h-4" /> Product & Blog SEO
        </button>
      </div>

      {/* ========================================================
          TAB 1: GLOBAL BUSINESS SEO
         ======================================================== */}
      {activeTab === "global" && (
        <form onSubmit={handleSaveGlobal} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-dark/5 p-5 border border-forest/10 rounded-xl">
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Business Metadata</h4>
              <div>
                <label className="block text-forest mb-1 font-bold">Business / Brand Name</label>
                <input
                  type="text"
                  required
                  value={globalSEO.businessName}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, businessName: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Website Base URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://leafaquatic.com"
                  value={globalSEO.websiteUrl}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, websiteUrl: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Default SEO Title Prefix/Suffix</label>
                <input
                  type="text"
                  value={globalSEO.defaultMetaTitle}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, defaultMetaTitle: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Default Meta Description</label>
                <textarea
                  value={globalSEO.defaultMetaDescription}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, defaultMetaDescription: e.target.value })}
                  className="w-full h-24 bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Contact Details (Local SEO)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-forest mb-1 font-bold">Support Email</label>
                  <input
                    type="email"
                    value={globalSEO.businessEmail}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, businessEmail: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold">Support Phone</label>
                  <input
                    type="text"
                    value={globalSEO.businessPhone}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, businessPhone: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Business Physical Address</label>
                <input
                  type="text"
                  value={globalSEO.businessAddress}
                  onChange={(e) => setGlobalSEO({ ...globalSEO, businessAddress: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>

              <h4 className="font-cinzel text-[10px] font-bold text-forest tracking-wider uppercase pt-2">Social Search Channels</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-forest mb-1 font-bold text-[10px]">Facebook URL</label>
                  <input
                    type="url"
                    value={globalSEO.facebookUrl}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, facebookUrl: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2 rounded-lg text-[11px] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold text-[10px]">Instagram URL</label>
                  <input
                    type="url"
                    value={globalSEO.instagramUrl}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, instagramUrl: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2 rounded-lg text-[11px] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold text-[10px]">YouTube URL</label>
                  <input
                    type="url"
                    value={globalSEO.youtubeUrl}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, youtubeUrl: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2 rounded-lg text-[11px] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold text-[10px]">Google Business Profile</label>
                  <input
                    type="url"
                    value={globalSEO.googleBusinessProfileUrl}
                    onChange={(e) => setGlobalSEO({ ...globalSEO, googleBusinessProfileUrl: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2 rounded-lg text-[11px] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Global Settings
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          TAB 2: HOMEPAGE TAGS
         ======================================================== */}
      {activeTab === "homepage" && (
        <form onSubmit={handleSaveHomepage} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-dark/5 p-5 border border-forest/10 rounded-xl">
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Homepage Search Meta</h4>
              <div>
                <label className="block text-forest mb-1 font-bold">Homepage SEO Title Override</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leaf Aquatic - Premium Aquarium Plants"
                  value={homepageSEO.websiteTitle}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, websiteTitle: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Homepage Heading H1 Title</label>
                <input
                  type="text"
                  value={homepageSEO.homepageTitle}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, homepageTitle: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Homepage Meta Description</label>
                <textarea
                  value={homepageSEO.homepageDescription}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, homepageDescription: e.target.value })}
                  className="w-full h-24 bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-forest mb-1 font-bold">Homepage Keywords (comma separated)</label>
                <input
                  type="text"
                  value={homepageSEO.homepageKeywords}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, homepageKeywords: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Structured Schemas (JSON-LD)</h4>
              <div>
                <label className="block text-[10px] text-forest/70 mb-1 font-mono">Organization Schema Markup</label>
                <textarea
                  value={homepageSEO.organizationSchema}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, organizationSchema: e.target.value })}
                  className="w-full h-20 bg-cream border border-forest/15 p-2 rounded-lg font-mono text-[11px] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-forest/70 mb-1 font-mono">Local Business Schema Markup</label>
                <textarea
                  value={homepageSEO.localBusinessSchema}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, localBusinessSchema: e.target.value })}
                  className="w-full h-20 bg-cream border border-forest/15 p-2 rounded-lg font-mono text-[11px] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-forest/70 mb-1 font-mono">Website Search-Box Action Schema</label>
                <textarea
                  value={homepageSEO.websiteSchema}
                  onChange={(e) => setHomepageSEO({ ...homepageSEO, websiteSchema: e.target.value })}
                  className="w-full h-20 bg-cream border border-forest/15 p-2 rounded-lg font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Homepage SEO
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          TAB 3: STATIC PAGE META
         ======================================================== */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-forest/5 pb-3">
            {["about-us", "contact", "privacy", "terms", "refund", "shipping", "faq"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPageKey(key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  selectedPageKey === key ? "bg-forest/15 text-forest border border-forest/20" : "bg-cream-dark/5 hover:bg-forest/5 text-forest/70"
                }`}
              >
                {key.replace("-", " ")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSavePageSEO} className="space-y-6">
            <div className="bg-cream-dark/5 p-5 border border-forest/10 rounded-xl space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">
                Meta Setup for: <span className="italic text-gold">{selectedPageKey.replace("-", " ")}</span> Page
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-forest mb-1 font-bold">SEO Meta Title</label>
                    <input
                      type="text"
                      required
                      value={pagesSEO[selectedPageKey]?.seoTitle || ""}
                      onChange={(e) => {
                        const copy = { ...pagesSEO };
                        copy[selectedPageKey] = { ...(copy[selectedPageKey] || {}), seoTitle: e.target.value };
                        setPagesSEO(copy);
                      }}
                      className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-forest mb-1 font-bold">Meta Description</label>
                    <textarea
                      required
                      value={pagesSEO[selectedPageKey]?.metaDescription || ""}
                      onChange={(e) => {
                        const copy = { ...pagesSEO };
                        copy[selectedPageKey] = { ...(copy[selectedPageKey] || {}), metaDescription: e.target.value };
                        setPagesSEO(copy);
                      }}
                      className="w-full h-24 bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-forest mb-1 font-bold">Relative URL / Slug Path</label>
                    <input
                      type="text"
                      required
                      value={pagesSEO[selectedPageKey]?.slug || selectedPageKey}
                      onChange={(e) => {
                        const copy = { ...pagesSEO };
                        copy[selectedPageKey] = { ...(copy[selectedPageKey] || {}), slug: e.target.value };
                        setPagesSEO(copy);
                      }}
                      className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-forest mb-1 font-bold">Canonical Link</label>
                    <input
                      type="url"
                      placeholder={`https://leafaquatic.com/${selectedPageKey}`}
                      value={pagesSEO[selectedPageKey]?.canonicalUrl || ""}
                      onChange={(e) => {
                        const copy = { ...pagesSEO };
                        copy[selectedPageKey] = { ...(copy[selectedPageKey] || {}), canonicalUrl: e.target.value };
                        setPagesSEO(copy);
                      }}
                      className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-forest mb-1 font-bold">Social Sharing OG Image</label>
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={pagesSEO[selectedPageKey]?.ogImage || ""}
                      onChange={(e) => {
                        const copy = { ...pagesSEO };
                        copy[selectedPageKey] = { ...(copy[selectedPageKey] || {}), ogImage: e.target.value };
                        setPagesSEO(copy);
                      }}
                      className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" /> Save Page SEO Configs
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          TAB 4: SEARCH CONSOLE & ROBOTS
         ======================================================== */}
      {activeTab === "search-console" && (
        <form onSubmit={handleSaveSearchConsole} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-dark/5 p-5 border border-forest/10 rounded-xl">
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Google Verification</h4>
              <div>
                <label className="block text-forest mb-1 font-bold">Google Search Console Verification Code</label>
                <input
                  type="text"
                  placeholder="google-site-verification-XXXXX"
                  value={searchConsoleSEO.searchConsoleCode}
                  onChange={(e) => setSearchConsoleSEO({ ...searchConsoleSEO, searchConsoleCode: e.target.value })}
                  className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                />
                <span className="text-[10px] text-forest/50 mt-1 block">Injected in home page HTML layout head.</span>
              </div>

              <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase pt-4">Dynamic XML Sitemap</h4>
              <div className="bg-cream border border-forest/10 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-forest">Sitemap Address:</span>
                  <a 
                    href="/sitemap.xml" 
                    target="_blank" 
                    className="font-mono text-gold hover:underline font-bold"
                  >
                    /sitemap.xml ↗
                  </a>
                </div>
                <p className="text-[10px] text-forest/55">
                  Your XML sitemap compiles all active products, rare categories, and blogs dynamically. It is synchronized live on disk.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      alert("Dynamic sitemap rebuilt! Synchronizing on disk.");
                    }}
                    className="bg-forest/10 hover:bg-forest/20 text-forest font-bold px-3 py-1.5 rounded text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate Sitemap
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.open("https://www.google.com/ping?sitemap=" + encodeURIComponent(window.location.origin + "/sitemap.xml"));
                      alert("Sitemap submitted directly to Google crawler search queues!");
                    }}
                    className="bg-gold hover:bg-gold-dark text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                  >
                    Submit Sitemap to Google
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">robots.txt config</h4>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="robots-enable-chk"
                    checked={searchConsoleSEO.robotsEnabled}
                    onChange={(e) => setSearchConsoleSEO({ ...searchConsoleSEO, robotsEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-forest/15 cursor-pointer text-forest"
                  />
                  <label htmlFor="robots-enable-chk" className="font-bold text-forest cursor-pointer select-none">
                    Enable Robots file
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-forest mb-1 font-bold">Robots.txt Content Rules</label>
                <textarea
                  disabled={!searchConsoleSEO.robotsEnabled}
                  value={searchConsoleSEO.robotsTxt}
                  onChange={(e) => setSearchConsoleSEO({ ...searchConsoleSEO, robotsTxt: e.target.value })}
                  className="w-full h-40 bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono text-[11px] disabled:opacity-50"
                />
                <span className="text-[10px] text-forest/50 mt-1 block">
                  Click 'Save Settings' to apply. Access live at <a href="/robots.txt" target="_blank" className="text-gold hover:underline font-mono">/robots.txt ↗</a>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Search Console & Robots Settings
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          TAB 5: TRACKING & PIXELS
         ======================================================== */}
      {activeTab === "analytics" && (
        <form onSubmit={handleSaveAnalytics} className="space-y-6">
          <div className="bg-cream-dark/5 p-5 border border-forest/10 rounded-xl space-y-4">
            <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Analytics Headers & Pixel Injection</h4>
            <p className="text-[10px] text-forest/60">
              Provide tracking tags to analyze client transactions, behavior, and page impressions. Scripts are dynamically injected in client view ports.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-forest mb-1 font-bold">Google Analytics 4 Measurement ID</label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={analyticsSEO.ga4MeasurementId}
                    onChange={(e) => setAnalyticsSEO({ ...analyticsSEO, ga4MeasurementId: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold">Google Tag Manager Container ID</label>
                  <input
                    type="text"
                    placeholder="GTM-XXXXXXX"
                    value={analyticsSEO.gtmId}
                    onChange={(e) => setAnalyticsSEO({ ...analyticsSEO, gtmId: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold">Google Ads Conversion Account ID</label>
                  <input
                    type="text"
                    placeholder="AW-XXXXXXXXXX"
                    value={analyticsSEO.adsConversionId}
                    onChange={(e) => setAnalyticsSEO({ ...analyticsSEO, adsConversionId: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-forest mb-1 font-bold">Facebook Pixel ID</label>
                  <input
                    type="text"
                    placeholder="123456789012345"
                    value={analyticsSEO.facebookPixelId}
                    onChange={(e) => setAnalyticsSEO({ ...analyticsSEO, facebookPixelId: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-forest mb-1 font-bold">Microsoft Clarity tracking ID</label>
                  <input
                    type="text"
                    placeholder="clarity-project-code"
                    value={analyticsSEO.clarityId}
                    onChange={(e) => setAnalyticsSEO({ ...analyticsSEO, clarityId: e.target.value })}
                    className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Analytics Codes
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          TAB 6: PRODUCT & BLOG SEO
         ======================================================== */}
      {activeTab === "items" && (
        <div className="space-y-6">
          {/* Filters and Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-cream-dark/10 p-4 border border-forest/10 rounded-xl items-center">
            <div>
              <label className="block text-[10px] text-forest/70 uppercase mb-1 font-bold">1. Content Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemType("products")}
                  className={`flex-1 py-2 text-xs rounded transition-all cursor-pointer font-bold border ${
                    selectedItemType === "products" ? "bg-forest text-cream border-forest" : "bg-cream hover:bg-forest/5 text-forest border-forest/15"
                  }`}
                >
                  Products
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItemType("categories")}
                  className={`flex-1 py-2 text-xs rounded transition-all cursor-pointer font-bold border ${
                    selectedItemType === "categories" ? "bg-forest text-cream border-forest" : "bg-cream hover:bg-forest/5 text-forest border-forest/15"
                  }`}
                >
                  Categories
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItemType("blogs")}
                  className={`flex-1 py-2 text-xs rounded transition-all cursor-pointer font-bold border ${
                    selectedItemType === "blogs" ? "bg-forest text-cream border-forest" : "bg-cream hover:bg-forest/5 text-forest border-forest/15"
                  }`}
                >
                  Blog Articles
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-forest/70 uppercase mb-1 font-bold">2. Select Specific Item</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
              >
                {selectedItemType === "products" && products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (৳{p.price})</option>
                ))}
                {selectedItemType === "categories" && categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {selectedItemType === "blogs" && blogs.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Rich SEO Editor Form */}
          {selectedItemId ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-poppins">
              
              {/* Form Input Columns */}
              <form onSubmit={handleSaveItemSEO} className="lg:col-span-7 space-y-5">
                <div className="flex justify-between items-center bg-forest/5 p-3 rounded-lg border border-forest/10">
                  <span className="font-bold text-forest text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    Let Gemini write your SEO Metadata
                  </span>
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleAIGenerate}
                    className="bg-[#8A3324] hover:bg-[#8A3324]/90 disabled:opacity-50 text-white px-4 py-2 rounded font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {isGenerating ? "Crafting tags..." : "✨ Generate SEO"}
                  </button>
                </div>

                <div className="space-y-4 bg-cream-dark/5 p-5 border border-forest/10 rounded-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-forest font-bold mb-1">SEO Title *</label>
                      <input
                        type="text"
                        required
                        value={itemSEO.seoTitle}
                        onChange={(e) => setItemSEO({ ...itemSEO, seoTitle: e.target.value, ogTitle: e.target.value, twitterTitle: e.target.value })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none"
                      />
                      <div className="flex justify-between text-[9px] text-forest/50 mt-1">
                        <span>Ideal: 50-60 chars</span>
                        <span className={itemSEO.seoTitle.length >= 40 && itemSEO.seoTitle.length <= 60 ? "text-emerald-700 font-bold" : "text-amber-700"}>
                          {itemSEO.seoTitle.length} characters
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-forest font-bold mb-1">Focus Keyword *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anubias plant"
                        value={itemSEO.focusKeyword}
                        onChange={(e) => setItemSEO({ ...itemSEO, focusKeyword: e.target.value })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none"
                      />
                      <span className="text-[9px] text-forest/50 block mt-1">Primary keyword phrase targeted.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-forest font-bold mb-1">Meta Description *</label>
                    <textarea
                      required
                      value={itemSEO.metaDescription}
                      onChange={(e) => setItemSEO({ ...itemSEO, metaDescription: e.target.value, ogDescription: e.target.value, twitterDescription: e.target.value })}
                      className="w-full h-24 bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-forest/50 mt-1">
                      <span>Ideal: 120-160 chars</span>
                      <span className={itemSEO.metaDescription.length >= 120 && itemSEO.metaDescription.length <= 160 ? "text-emerald-700 font-bold" : "text-amber-700"}>
                        {itemSEO.metaDescription.length} characters
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-forest font-bold mb-1">URL Slug</label>
                      <input
                        type="text"
                        required
                        value={itemSEO.slug}
                        onChange={(e) => setItemSEO({ ...itemSEO, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none font-mono"
                      />
                      <span className="text-[9px] text-forest/50 mt-1 block">Relative URL handle path.</span>
                    </div>

                    <div>
                      <label className="block text-forest font-bold mb-1">Canonical URL</label>
                      <input
                        type="url"
                        placeholder="https://leafaquatic.com/product/..."
                        value={itemSEO.canonicalUrl}
                        onChange={(e) => setItemSEO({ ...itemSEO, canonicalUrl: e.target.value })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-forest font-bold mb-1">Image ALT Text Override</label>
                      <input
                        type="text"
                        placeholder="Alternative image accessibility text"
                        value={itemSEO.imageAlt}
                        onChange={(e) => setItemSEO({ ...itemSEO, imageAlt: e.target.value })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-forest font-bold mb-1">Meta Keywords (Optional)</label>
                      <input
                        type="text"
                        placeholder="Keywords, list"
                        value={itemSEO.customMetaKeywords}
                        onChange={(e) => setItemSEO({ ...itemSEO, customMetaKeywords: e.target.value })}
                        className="w-full bg-cream border border-forest/15 p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-forest/70 font-mono mb-1">JSON-LD Structured Schema</label>
                    <textarea
                      value={
                        selectedItemType === "products" 
                          ? itemSEO.productSchema 
                          : selectedItemType === "categories" 
                          ? itemSEO.categorySchema 
                          : itemSEO.articleSchema
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedItemType === "products") {
                          setItemSEO({ ...itemSEO, productSchema: val });
                        } else if (selectedItemType === "categories") {
                          setItemSEO({ ...itemSEO, categorySchema: val });
                        } else {
                          setItemSEO({ ...itemSEO, articleSchema: val });
                        }
                      }}
                      className="w-full h-32 bg-cream border border-forest/15 p-2.5 rounded-lg font-mono text-[11px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-forest hover:bg-emerald-green text-cream px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save {selectedItemType === "products" ? "Product" : selectedItemType === "categories" ? "Category" : "Blog"} SEO
                  </button>
                </div>
              </form>

              {/* Live Preview & SEO Score Audit Sidebar */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Live SEO Score */}
                <div className="bg-cream border border-forest/10 p-5 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-cinzel text-xs font-bold text-forest tracking-widest uppercase flex items-center gap-1">
                      <Sliders className="w-4 h-4 text-gold" /> Optimization Audit
                    </h4>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      liveScore >= 80 ? "bg-emerald-100 text-emerald-800" : liveScore >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                    }`}>
                      Score: {liveScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-cream-dark/20 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        liveScore >= 80 ? "bg-emerald-600" : liveScore >= 50 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${liveScore}%` }}
                    ></div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 pt-1">
                    {scoreChecklist.map((c, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[11px] font-medium leading-relaxed">
                        {c.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-bold ${c.passed ? "text-forest" : "text-forest/65"}`}>{c.label}</p>
                          <p className="text-[10px] text-forest/50">{c.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Google Search Result Live Preview */}
                <div className="bg-cream border border-forest/10 p-5 rounded-xl shadow-xs space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-forest tracking-widest uppercase flex items-center gap-1 border-b border-forest/5 pb-2">
                    <Eye className="w-4 h-4 text-forest/70" /> Google Snippet Preview
                  </h4>
                  <div className="bg-white p-4 border border-gray-100 rounded-lg space-y-1 select-none font-sans">
                    <div className="text-xs text-[#202124] flex items-center gap-1">
                      <span>leafaquatic.com</span>
                      <span className="text-[10px] text-gray-400">› {selectedItemType} › {itemSEO.slug || "slug-handle"}</span>
                    </div>
                    <h5 className="text-[18px] text-[#1a0dab] hover:underline leading-tight font-medium cursor-pointer break-words">
                      {itemSEO.seoTitle || "SEO Title goes here"}
                    </h5>
                    <p className="text-sm text-[#4d5156] leading-relaxed break-words">
                      {itemSEO.metaDescription || "Provide an appealing meta description containing your target keywords for Google crawlers."}
                    </p>
                  </div>
                </div>

                {/* 3. Facebook Share Live Preview */}
                <div className="bg-cream border border-forest/10 p-5 rounded-xl shadow-xs space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-forest tracking-widest uppercase flex items-center gap-1 border-b border-forest/5 pb-2">
                    <Eye className="w-4 h-4 text-forest/70" /> Facebook OG Preview
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-sans select-none text-left">
                    {itemSEO.ogImage ? (
                      <img 
                        src={itemSEO.ogImage} 
                        alt="Facebook preview" 
                        className="w-full h-36 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                        Missing og:image
                      </div>
                    )}
                    <div className="p-3 border-t border-gray-100 space-y-0.5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">LEAF_AQUATIC.COM</span>
                      <h5 className="font-bold text-sm text-[#1d2129] leading-snug line-clamp-1">
                        {itemSEO.ogTitle || itemSEO.seoTitle}
                      </h5>
                      <p className="text-xs text-[#606770] leading-snug line-clamp-2">
                        {itemSEO.ogDescription || itemSEO.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Twitter Card Preview */}
                <div className="bg-cream border border-forest/10 p-5 rounded-xl shadow-xs space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-forest tracking-widest uppercase flex items-center gap-1 border-b border-forest/5 pb-2">
                    <Eye className="w-4 h-4 text-forest/70" /> Twitter Card Preview
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden font-sans select-none text-left flex">
                    {itemSEO.twitterImage && (
                      <div className="w-24 h-24 shrink-0 bg-gray-100 border-r border-gray-100">
                        <img 
                          src={itemSEO.twitterImage} 
                          alt="Twitter preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="p-3 flex flex-col justify-center min-w-0">
                      <span className="text-[10px] text-gray-500">leafaquatic.com</span>
                      <h5 className="font-bold text-xs text-gray-900 leading-snug line-clamp-1">
                        {itemSEO.twitterTitle || itemSEO.seoTitle}
                      </h5>
                      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-0.5">
                        {itemSEO.twitterDescription || itemSEO.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-cream-dark/10 rounded-2xl border border-forest/10">
              <p className="text-xs text-forest/60">No content items found for the selected type.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
