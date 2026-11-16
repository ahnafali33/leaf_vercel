/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { db, getFullDBState, performAutoMigration, initFirestore } from "./firestore.js";

dotenv.config();

function ensureProductSEO(product: any, websiteUrl = "https://leafaquatic.com") {
  if (!product) return product;
  const name = String(product.name || product.id || "Untitled Product");
  const slug = product.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": product.images || [],
    "description": product.description || "",
    "sku": product.id || "",
    "offers": {
      "@type": "Offer",
      "url": `${websiteUrl}/product/${slug}`,
      "priceCurrency": "BDT",
      "price": product.price || 0,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const defaultSEO = {
    seoTitle: `${name} | Leaf Aquatic`,
    metaDescription: product.description ? product.description.slice(0, 155) : `Buy ${name} at Leaf Aquatic. Premium quality aquarium plant.`,
    focusKeyword: name,
    slug: slug,
    canonicalUrl: `${websiteUrl}/product/${slug}`,
    metaRobots: "index, follow",
    ogTitle: name,
    ogDescription: product.description ? product.description.slice(0, 155) : `Premium ${name} at Leaf Aquatic`,
    ogImage: product.images?.[0] || "",
    twitterTitle: name,
    twitterDescription: product.description ? product.description.slice(0, 155) : `Premium ${name} at Leaf Aquatic`,
    twitterImage: product.images?.[0] || "",
    productSchema: JSON.stringify(schema, null, 2),
    imageAlt: `${name} aquatic plant`,
    customMetaKeywords: `${name}, ${product.category || ""}, aquarium plant`,
    seoScore: 85
  };

  product.seo = { ...defaultSEO, ...product.seo };
  return product;
}

function ensureCategorySEO(category: any, websiteUrl = "https://leafaquatic.com") {
  if (!category) return category;
  const name = String(category.name || category.id || "Untitled Category");
  const slug = category.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const defaultSEO = {
    seoTitle: `${name} | Premium Aquarium Plants`,
    metaDescription: `Discover high-quality and premium ${name} for your aquascape at Leaf Aquatic. Pest-free live plants with healthy arrival guarantee.`,
    slug: slug,
    ogImage: category.image || "",
    canonicalUrl: `${websiteUrl}/category/${slug}`,
    categorySchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": name,
      "description": `Premium collection of ${name} aquarium plants.`
    }, null, 2),
    focusKeyword: name
  };
  category.seo = { ...defaultSEO, ...category.seo };
  return category;
}

function ensureBlogSEO(blog: any, websiteUrl = "https://leafaquatic.com") {
  if (!blog) return blog;
  const title = String(blog.title || blog.id || "Untitled Blog");
  const slug = blog.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const defaultSEO = {
    seoTitle: `${title} | Aqua Academy`,
    metaDescription: blog.excerpt ? blog.excerpt.slice(0, 155) : `${title}. Learn more on our Blog Academy.`,
    focusKeyword: blog.tags?.[0] || blog.category || "",
    slug: slug,
    articleSchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "image": blog.image || "",
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Leaf Aquatic"
      },
      "datePublished": blog.date || new Date().toISOString().split("T")[0]
    }, null, 2),
    faqSchema: "[]",
    breadcrumbSchema: "[]",
    ogImage: blog.image || "",
    twitterCard: "summary_large_image",
    readingTime: blog.readTime || "5 min read",
    tableOfContents: ""
  };
  blog.seo = { ...defaultSEO, ...blog.seo };
  return blog;
}

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special characters with a single dash
    .replace(/(^-|-$)/g, "");     // Trim leading/trailing dashes
}

async function ensureUniqueSlug(collectionName: string, text: string, currentId: string | null): Promise<string> {
  const baseSlug = cleanSlug(text) || "unnamed";
  let uniqueSlug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const snap = await db.collection(collectionName).where("seo.slug", "==", uniqueSlug).get();
    const snapDirect = await db.collection(collectionName).where("slug", "==", uniqueSlug).get();

    const conflicts = [
      ...(snap?.docs || []),
      ...(snapDirect?.docs || [])
    ].filter(doc => doc.id !== currentId);

    if (conflicts.length === 0) {
      isUnique = true;
    } else {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
  }

  return uniqueSlug;
}

function ensureAllSEO(db: any) {
  if (!db.seoSettings) {
    db.seoSettings = {
      global: {
        defaultMetaTitle: "Leaf Aquatic | Premium Aquascaping & Plants",
        defaultMetaDescription: "Premium live aquarium plants, tissue cultures, and professional aquascaping hardware. Healthy plant guarantee and nationwide fast shipping.",
        defaultOgImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        defaultTwitterImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        websiteUrl: "https://leafaquatic.com",
        businessName: "Leaf Aquatic",
        businessEmail: "hello@leafaquatic.com",
        businessPhone: "+8801716456902",
        businessAddress: "Dhaka, Bangladesh",
        facebookUrl: "https://facebook.com/leafaquatic",
        instagramUrl: "https://instagram.com/leafaquatic",
        youtubeUrl: "https://youtube.com/c/leafaquatic",
        whatsappUrl: "https://wa.me/+8801716456902",
        googleBusinessProfileUrl: "https://g.page/leafaquatic"
      },
      homepage: {
        websiteTitle: "Leaf Aquatic - Premium Aquarium Plants & Aquascaping Supplies",
        homepageTitle: "Create Your Perfect Underwater Ecosystem",
        homepageDescription: "Leaf Aquatic offers the highest quality tissue culture plants, rare mosses, driftwoods, and aquascaping design accessories.",
        homepageKeywords: "aquarium plants, tissue culture, anubias, bucephalandra, aquascaping, bangladesh",
        homepageOgImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        homepageTwitterImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        organizationSchema: "{}",
        localBusinessSchema: "{}",
        logoSchema: "{}",
        websiteSchema: "{}"
      },
      pages: {
        "about-us": {
          seoTitle: "About Us | Leaf Aquatic",
          metaDescription: "Learn about Leaf Aquatic's mission to bring high-quality natural aquascaping botanicals and rare flora to enthusiasts.",
          slug: "about-us",
          ogImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
          canonicalUrl: "https://leafaquatic.com/about-us"
        },
        "contact": {
          seoTitle: "Contact Us | Leaf Aquatic Support",
          metaDescription: "Reach out to the Leaf Aquatic support team for orders, plant care advice, or aquascaping setup consultations.",
          slug: "contact",
          ogImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
          canonicalUrl: "https://leafaquatic.com/contact"
        },
        "privacy": {
          seoTitle: "Privacy Policy | Leaf Aquatic Safeguards",
          metaDescription: "How Leaf Aquatic collects, uses, and safeguards customer transaction details and plant purchase histories safely.",
          slug: "privacy",
          ogImage: "",
          canonicalUrl: ""
        },
        "terms": {
          seoTitle: "Terms & Conditions | Leaf Aquatic Shipping & Service",
          metaDescription: "Understand our aquarium plant delivery, live arrival guarantees, and conditions of usage for the Leaf Aquatic catalog.",
          slug: "terms",
          ogImage: "",
          canonicalUrl: ""
        },
        "refund": {
          seoTitle: "Refund Policy | Leaf Aquatic Live Plant Guarantee",
          metaDescription: "Leaf Aquatic's standard 100% healthy arrival guarantee policy and instructions to request refunds for melted plants.",
          slug: "refund",
          ogImage: "",
          canonicalUrl: ""
        },
        "shipping": {
          seoTitle: "Shipping & Delivery Policy | Fast Nationwide Transit",
          metaDescription: "Flat rate shipping inside Dhaka and nationwide district courier pricing details with custom climate layers.",
          slug: "shipping",
          ogImage: "",
          canonicalUrl: ""
        },
        "faq": {
          seoTitle: "Frequently Asked Questions | Aqua Academy FAQ",
          metaDescription: "Find quick answers regarding substrate setups, liquid fertilizers, plant lighting, CO2, and shipping durations.",
          slug: "faq",
          ogImage: "",
          canonicalUrl: ""
        }
      },
      searchConsole: {
        searchConsoleCode: "google-site-verification-12345",
        sitemapUrl: "https://leafaquatic.com/sitemap.xml",
        robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://leafaquatic.com/sitemap.xml",
        robotsEnabled: true
      },
      analytics: {
        ga4MeasurementId: "G-ABC123XYZ",
        gtmId: "GTM-XYZ987",
        adsConversionId: "AW-55555555",
        facebookPixelId: "1234567890",
        clarityId: "clarity-id-here"
      }
    };
  }

  const websiteUrl = db.seoSettings?.global?.websiteUrl || "https://leafaquatic.com";

  if (db.products && Array.isArray(db.products)) {
    const usedSlugs = new Map<string, string>();
    db.products.forEach((p: any) => {
      let manualSlug = p.seo?.slug || p.slug;
      let baseSlug = cleanSlug(manualSlug || p.name || p.id || "product");
      let uniqueSlug = baseSlug;
      let counter = 1;

      while (usedSlugs.has(uniqueSlug) && usedSlugs.get(uniqueSlug) !== p.id) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }
      usedSlugs.set(uniqueSlug, p.id);

      p.slug = uniqueSlug;
      if (!p.seo) p.seo = {};
      p.seo.slug = uniqueSlug;

      ensureProductSEO(p, websiteUrl);
    });
  }

  if (db.categories && Array.isArray(db.categories)) {
    const usedSlugs = new Map<string, string>();
    db.categories.forEach((c: any) => {
      let manualSlug = c.seo?.slug || c.slug;
      let baseSlug = cleanSlug(manualSlug || c.name || c.id || "category");
      let uniqueSlug = baseSlug;
      let counter = 1;

      while (usedSlugs.has(uniqueSlug) && usedSlugs.get(uniqueSlug) !== c.id) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }
      usedSlugs.set(uniqueSlug, c.id);

      c.slug = uniqueSlug;
      if (!c.seo) c.seo = {};
      c.seo.slug = uniqueSlug;

      ensureCategorySEO(c, websiteUrl);
    });
  }

  if (db.blogs && Array.isArray(db.blogs)) {
    const usedSlugs = new Map<string, string>();
    db.blogs.forEach((b: any) => {
      let manualSlug = b.seo?.slug || b.slug;
      let baseSlug = cleanSlug(manualSlug || b.title || b.id || "blog");
      let uniqueSlug = baseSlug;
      let counter = 1;

      while (usedSlugs.has(uniqueSlug) && usedSlugs.get(uniqueSlug) !== b.id) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }
      usedSlugs.set(uniqueSlug, b.id);

      b.slug = uniqueSlug;
      if (!b.seo) b.seo = {};
      b.seo.slug = uniqueSlug;

      ensureBlogSEO(b, websiteUrl);
    });
  }
}

function ensureAllWebsiteContent(db: any) {
  if (!db.websiteContent) {
    db.websiteContent = {
      images: {
        heroBanner: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        featuredSection: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
        promoBanner: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200",
        productSectionBanner: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        footerLogo: "/src/assets/images/leaf_aquatic_logo.jpg",
        brandLogo: "/src/assets/images/leaf_aquatic_logo.jpg"
      },
      text: {
        announcementBar: "📦 FREE DELIVERY INSIDE DHAKA FOR ORDERS OVER ৳3000",
        announcementGuarantee: "🌿 HEALTHY PLANT GUARANTEE",
        announcementCod: "🤝 CASH ON DELIVERY NATIONWIDE",
        brandName: "LEAF",
        brandSubname: "AQUATIC",
        brandTagline: "RETAILER • COLORFUL AQUATIC PLANTS",
        heroTitleLine1: "Crafting Pristine",
        heroTitleLine2: "Underwater Forests",
        heroSubtitle: "Discover luxury aquascaping botanicals, hand-curated rare plant varieties, and professional grade CO₂ hardware.",
        heroButtonLabel: "Explore Premium Flora",
        categoryTitle: "Browse Botanical Categories",
        categorySubtitle: "Discover hand-selected categories designed for standard high-tech or low-tech natural layouts.",
        featuredTitle: "Atelier's Curated Specimens",
        featuredSubtitle: "Exceptional specimens displaying brilliant foliage coloration, ready to grow.",
        bestSellersTitle: "Hobbyists' Coveted Favorites",
        bestSellersSubtitle: "Highly coveted by both novice aquascape designers and professional competitors.",
        promoTitle: "The Art of Nurturing Submersed Foliage",
        promoSubtitle: "Every stem, moss, and rhizome is nurtured in our organic, sterile facility. We promise 100% pest-free delivery across the country.",
        promoButtonLabel: "Read Aquascape Guru Blogs",
        aboutTitle: "About Leaf Aquatic",
        aboutDescription: "Our curated collection represents the intersection of luxury, biology, and art. We harvest, nurture, and ship premium underwater flora to elevate your living spaces with aquatic tranquility.",
        newsletterTitle: "NEWSLETTER",
        newsletterSubtitle: "Subscribe to receive weekly care guides, aquascaping tips, and early-bird notifications on extremely rare collector plant harvests.",
        contactPhone: "+880 171 2345 678",
        contactEmail: "care@leafaquatic.com",
        contactAddress: "Banani Road 11, Dhaka, Bangladesh",
        footerDescription: "Our curated collection represents the intersection of luxury, biology, and art. We harvest, nurture, and ship premium underwater flora to elevate your living spaces with aquatic tranquility."
      },
      social: {
        facebook: "https://facebook.com/leafaquatic",
        instagram: "https://instagram.com/leafaquatic",
        youtube: "https://youtube.com/c/leafaquatic",
        whatsapp: "https://wa.me/+8801716456902",
        tiktok: "",
        messenger: ""
      },
      homepageSections: {
        featuredProducts: ["prod-1", "prod-2", "prod-3"],
        bestSellers: ["prod-2", "prod-4", "prod-3", "prod-1"],
        newArrivals: ["prod-3", "prod-1"],
        popularProducts: ["prod-1", "prod-2"],
        recommendedProducts: ["prod-4", "prod-3"]
      }
    };
  }
  if (!db.cloudinarySettings) {
    db.cloudinarySettings = {
      cloudName: "",
      uploadPreset: ""
    };
  }
  if (!db.domainSettings) {
    db.domainSettings = {
      customDomain: "leafaquatic.com",
      subdomain: "www.leafaquatic.com",
      forceHttps: true,
      canonicalRedirect: true,
      googleCloudProject: "leafaquatic-app",
      cloudRunService: "leafaquatic-service",
      cloudRunRegion: "asia-east1",
      sslStatus: "Active",
      txtVerificationCode: "google-site-verification=leafaquatic-verification-key"
    };
  }
}

/**
 * Helper to fetch and normalize the entire DB state from Firestore
 */
async function getDB() {
  const dbState = await getFullDBState();

  if (dbState.categories && Array.isArray(dbState.categories)) {
    dbState.categories = dbState.categories.map((c, idx) => {
      if (typeof c === "string") {
        return { id: "cat-" + (idx + 1), name: c, image: "" };
      }
      if (c && typeof c === "object") {
        // If it got serialized as a characters object, rebuild it
        if (!c.name && c['0'] && typeof c['0'] === 'string') {
          const chars = [];
          let i = 0;
          while (c[i] !== undefined) {
            chars.push(c[i]);
            i++;
          }
          c.name = chars.join('');
        }
        if (!c.id) {
          c.id = "cat-" + (idx + 1);
        }
        if (c.image === undefined) {
          c.image = "";
        }
      }
      return c;
    });
  }

  ensureAllSEO(dbState);
  ensureAllWebsiteContent(dbState);
  return dbState;
}

let initPromise: Promise<void> | null = null;
let cachedServerlessApp: express.Express | null = null;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        // Initialize smart database layer
        await initFirestore();
      } catch (err: any) {
        console.error("[Server] Notice during initFirestore:", err?.message || err);
      }

      try {
        // Execute migration on app startup if required
        await performAutoMigration();
      } catch (err: any) {
        console.error("[Server] Notice during performAutoMigration:", err?.message || err);
      }
    })();
  }
  await initPromise;
}

export async function createApp(options: { serveFrontend?: boolean } = {}) {
  await ensureInitialized();

  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Dynamic Sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const dbState = await getDB();
      const websiteUrl = dbState.seoSettings?.global?.websiteUrl || "https://leafaquatic.com";
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Homepage
      xml += `  <url>\n    <loc>${websiteUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

      // Static pages
      const staticPages = ["shop", "blog", "contact", "about", "about-us", "privacy-policy", "privacy", "terms", "refund-policy", "refund", "shipping", "faq", "ai-plant-finder"];
      staticPages.forEach((p) => {
        xml += `  <url>\n    <loc>${websiteUrl}/${p}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
      });

      // Categories
      if (dbState.categories) {
        dbState.categories.forEach((cat: any) => {
          const nameVal = String(cat.name || cat.id || "category");
          const slug = cat.seo?.slug || nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          xml += `  <url>\n    <loc>${websiteUrl}/category/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });
      }

      // Products
      if (dbState.products) {
        dbState.products.forEach((prod: any) => {
          const nameVal = String(prod.name || prod.id || "product");
          const slug = prod.seo?.slug || nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          xml += `  <url>\n    <loc>${websiteUrl}/product/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
      }

      // Blogs
      if (dbState.blogs) {
        dbState.blogs.forEach((blog: any) => {
          const titleVal = String(blog.title || blog.id || "blog");
          const slug = blog.seo?.slug || titleVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          xml += `  <url>\n    <loc>${websiteUrl}/blog/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
      }

      xml += `</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.send(xml);
    } catch (err: any) {
      console.error("Sitemap error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Dynamic robots.txt
  app.get("/robots.txt", async (req, res) => {
    try {
      const dbState = await getDB();
      const searchConsole = dbState.seoSettings?.searchConsole;
      res.setHeader("Content-Type", "text/plain");
      if (searchConsole && searchConsole.robotsEnabled === false) {
        res.send("User-agent: *\nDisallow: /");
      } else {
        const customTxt = searchConsole?.robotsTxt;
        res.send(customTxt || "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://leafaquatic.com/sitemap.xml");
      }
    } catch (err: any) {
      console.error("robots.txt error:", err);
      res.send("User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://leafaquatic.com/sitemap.xml");
    }
  });

  // Dynamic Google Site Verification HTML File
  app.get("/google:code.html", (req, res) => {
    const code = req.params.code;
    res.setHeader("Content-Type", "text/html");
    res.send(`google-site-verification: google${code}.html`);
  });

  // PUT Update SEO settings
  app.put("/api/admin/seo-settings", async (req, res) => {
    try {
      await db.doc("settings/seoSettings").set(req.body, { merge: true });
      const updated = (await db.doc("settings/seoSettings").get()).data();
      res.json({ success: true, seoSettings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT Update Website Content
  app.put("/api/admin/website-content", async (req, res) => {
    try {
      await db.doc("settings/websiteContent").set(req.body, { merge: true });
      const updated = (await db.doc("settings/websiteContent").get()).data();
      res.json({ success: true, websiteContent: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT Update Cloudinary Settings
  app.put("/api/admin/cloudinary-settings", async (req, res) => {
    try {
      await db.doc("settings/cloudinarySettings").set(req.body, { merge: true });
      const updated = (await db.doc("settings/cloudinarySettings").get()).data();
      res.json({ success: true, cloudinarySettings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT Update Courier Settings (Steadfast)
  app.put("/api/admin/courier-settings", async (req, res) => {
    try {
      await db.doc("settings/courierSettings").set(req.body, { merge: true });
      const updated = (await db.doc("settings/courierSettings").get()).data();
      res.json({ success: true, courierSettings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET Steadfast Courier Account Balance
  app.get("/api/admin/courier-balance", async (req, res) => {
    try {
      const dbState = await getDB();
      const apiKey = (process.env.STEADFAST_API_KEY || dbState.courierSettings?.apiKey || "").trim();
      const secretKey = (process.env.STEADFAST_SECRET_KEY || dbState.courierSettings?.secretKey || "").trim();
      const baseUrl = (process.env.STEADFAST_BASE_URL || dbState.courierSettings?.baseUrl || "https://portal.steadfast.com.bd/api/v1").replace(/\/$/, "");

      if (!apiKey || !secretKey) {
        return res.status(400).json({ error: "Steadfast Courier API Key or Secret Key is not configured." });
      }

      const response = await fetch(`${baseUrl}/get_balance`, {
        method: "GET",
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": secretKey
        }
      });

      const result = await response.json();
      if (!response.ok || (result.status && result.status !== 200)) {
        return res.status(400).json({ error: result.message || "Failed to fetch Steadfast balance" });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST Upload Image to Cloudinary or base64 fallback
  app.post("/api/admin/upload", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      const dbState = await getDB();
      const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || dbState.cloudinarySettings?.cloudName || "").trim();
      const uploadPreset = (process.env.CLOUDINARY_UPLOAD_PRESET || dbState.cloudinarySettings?.uploadPreset || "").trim();

      if (!cloudName || !uploadPreset) {
        return res.json({
          url: image,
          warning: "Cloudinary credentials (Cloud Name or Upload Preset) are missing in settings. Image defaulted to local data URL."
        });
      }

      // Use modern standard FormData for multipart/form-data uploading to Cloudinary
      // This is much faster, supports large payloads, and avoids massive URL encoding overhead
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);
      formData.append("filename_override", "image");

      console.log(`Attempting Cloudinary upload to cloud name: "${cloudName}" with preset: "${uploadPreset}"...`);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        let errMessage = "Cloudinary upload failed";
        try {
          const errData = await response.json();
          if (errData.error?.message) {
            errMessage = `${errData.error.message}`;
            // Add custom diagnostic hints for common Cloudinary misconfigurations
            if (errMessage.toLowerCase().includes("upload preset")) {
              errMessage += " (Hint: Please verify that the upload preset is spelled correctly and configured as UNSIGNED in your Cloudinary Settings -> Upload -> Upload presets.)";
            } else if (errMessage.toLowerCase().includes("unknown api key") || errMessage.toLowerCase().includes("cloud_name")) {
              errMessage += " (Hint: Please check that your Cloud Name is correct and match your Cloudinary dashboard.)";
            }
          } else {
            errMessage = `Cloudinary HTTP Error ${response.status}: ${JSON.stringify(errData)}`;
          }
        } catch {
          errMessage = `Cloudinary returned status code ${response.status}`;
        }
        throw new Error(errMessage);
      }

      const result = await response.json();
      if (!result.secure_url) {
        throw new Error("No secure URL returned from Cloudinary response.");
      }

      console.log(`Cloudinary upload successful! URL: ${result.secure_url}`);
      res.json({ url: result.secure_url });
    } catch (err: any) {
      console.error("Cloudinary Upload Error:", err);
      res.status(500).json({ error: err.message || "Failed to upload image to Cloudinary" });
    }
  });

  // POST AI SEO Generator using Gemini
  app.post("/api/admin/seo/generate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY is not configured. Please configure it in Settings." });
      }

      const { type, name, description, category, author } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name/Title is required for AI SEO generation." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });

      const prompt = `You are an expert SEO specialist. Generate high-quality SEO meta tags and structured schema markup for the following content:
Type: ${type} (e.g. product or blog article)
Name/Title: ${name}
Description: ${description || "No description provided"}
Category: ${category || "General"}
${author ? `Author: ${author}` : ""}

Ensure the response satisfies these professional SEO rules:
1. SEO Title must be highly appealing, contain the keyword, and be under 60 characters.
2. Meta Description must be persuasive, with a call to action, and be under 160 characters.
3. Focus Keyword should be the 1-3 word search phrase that best captures search intent.
4. Slug must be lowercase, URL-friendly (only lowercase alphanumeric and hyphens), and match the item name.
5. Provide Open Graph and Twitter titles and descriptions mimicking professional titles.
6. Provide high-quality Image ALT text representing the item.
7. Provide custom meta keywords (comma-separated).
8. schemaMarkup must be a fully compliant JSON-LD string using correct schema types (e.g. Product schema for products, BlogPosting schema for blogs). Ensure the JSON in schemaMarkup is valid.

Return only a JSON object that strictly adheres to the requested properties. Do not include markdown code block formatting in your outermost response; return raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seoTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              focusKeyword: { type: Type.STRING },
              slug: { type: Type.STRING },
              ogTitle: { type: Type.STRING },
              ogDescription: { type: Type.STRING },
              twitterTitle: { type: Type.STRING },
              twitterDescription: { type: Type.STRING },
              imageAlt: { type: Type.STRING },
              customMetaKeywords: { type: Type.STRING },
              schemaMarkup: { type: Type.STRING }
            },
            required: ["seoTitle", "metaDescription", "focusKeyword", "slug", "ogTitle", "ogDescription", "twitterTitle", "twitterDescription", "imageAlt", "customMetaKeywords", "schemaMarkup"]
          }
        }
      });

      let seoData;
      if (response.text) {
        seoData = JSON.parse(response.text);
      } else {
        throw new Error("Empty response from AI model.");
      }

      res.json({ success: true, seo: seoData });
    } catch (err: any) {
      console.error("AI SEO Generator error:", err);
      res.status(500).json({ error: err.message || "Failed to generate SEO utilizing AI." });
    }
  });

  // 1. Fetch entire database structure
  app.get("/api/db", async (req, res) => {
    try {
      const data = await getDB();
      res.json(data);
    } catch (err: any) {
      console.error("Database load error:", err);
      res.status(500).json({ error: "Failed to load database from Firestore: " + err.message + " - Stack: " + err.stack });
    }
  });

  // 2. Client Reviews - Add a custom review
  app.post("/api/reviews/add/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const { author, rating, text } = req.body;

      if (!author || !rating || !text) {
        return res.status(400).json({ error: "Author, rating, and text are required." });
      }

      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: "Product not found." });
      }

      const product = productDoc.data() || {};
      const newReview = {
        id: "rev-" + Date.now(),
        author,
        rating: Number(rating),
        text,
        approved: false, // Must be approved by admin
        date: new Date().toISOString().split("T")[0],
        featured: false,
      };

      const reviews = product.reviews || [];
      reviews.push(newReview);
      await productRef.update({ reviews });

      res.json({ message: "Review submitted successfully! Pending admin approval.", review: newReview });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Checkout endpoint
  app.post("/api/checkout", async (req, res) => {
    try {
      const {
        customerName,
        phone,
        address,
        district,
        area,
        note,
        items,
        couponCode,
        paymentMethod,
        paymentNumberUsed,
        paymentTransactionId,
        paymentAmount,
        paymentScreenshot,
      } = req.body;

      if (!customerName || !phone || !address || !district || !area || !items || items.length === 0) {
        return res.status(400).json({ error: "All required customer fields and items must be provided." });
      }

      const dbState = await getDB();
      let total = 0;

      // Verify stock and calculate total
      const validatedItems = [];
      const productsColl = db.collection("products");

      for (const item of items) {
        const productRef = productsColl.doc(item.productId);
        const productDoc = await productRef.get();
        if (!productDoc.exists) {
          return res.status(404).json({ error: `Product with ID ${item.productId} not found in store.` });
        }

        const product = productDoc.data() || {};
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
        }

        // Decrement stock in Firestore
        await productRef.update({ stock: product.stock - item.quantity });
        total += product.price * item.quantity;

        validatedItems.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images?.[0] || "",
        });
      }

      // Apply Coupon if valid
      let discount = 0;
      if (couponCode) {
        const couponDoc = await db.collection("coupons").doc(couponCode.toUpperCase()).get();
        if (couponDoc.exists) {
          const coupon = couponDoc.data() || {};
          // Simple expiry check
          const expiry = new Date(coupon.expiryDate);
          if (expiry >= new Date()) {
            if (coupon.discountType === "percentage") {
              discount = Math.round((total * coupon.discountValue) / 100);
            } else {
              discount = coupon.discountValue;
            }
          }
        }
      }

      const finalSubtotal = Math.max(0, total - discount);
      const deliveryRates = dbState.paymentSettings || {};
      const rateDhaka = deliveryRates.shippingChargeDhaka ?? 60;
      const rateOutside = deliveryRates.shippingChargeOutside ?? 120;
      const shippingCharge = (district || "").toLowerCase() === "dhaka" ? rateDhaka : rateOutside;
      const orderTotal = finalSubtotal + shippingCharge;

      const newOrder = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        customerName,
        phone,
        address,
        district,
        area,
        note,
        items: validatedItems,
        total: orderTotal,
        shippingCharge,
        status: "Payment Verification Pending",
        createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod || "bKash",
        paymentNumberUsed: paymentNumberUsed || "",
        paymentTransactionId: paymentTransactionId || "",
        paymentAmount: paymentAmount !== undefined ? Number(paymentAmount) : orderTotal,
        paymentScreenshot: paymentScreenshot || "",
      };

      await db.collection("orders").doc(newOrder.id).set(newOrder);

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      console.error("Checkout error:", err);
      res.status(500).json({ error: "Failed to place order: " + err.message });
    }
  });

  // 4. Gemini Aquarium Plant Finder Quiz
  app.post("/api/quiz", async (req, res) => {
    try {
      const { difficulty, light, co2, placement, preferences } = req.body;

      const dbState = await getDB();
      const productCatalog = dbState.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        scientificName: p.scientificName,
        difficulty: p.difficulty,
        light: p.light,
        co2: p.co2,
        placement: p.placement,
        description: p.description,
      }));

      const prompt = `You are a world-class premium Aquascaping and Aquarium Botany master advisor for Leaf Aquatic.
The user is looking for plant recommendations based on their tank parameters:
- Experience Level / Difficulty Capability: ${difficulty}
- Lighting Level: ${light}
- CO2 Availability: ${co2}
- Tank Placement Preference: ${placement}
- Additional specific preferences/wishes: ${preferences || "None"}

Here is the exact catalogue of live plants currently in stock at Leaf Aquatic store:
${JSON.stringify(productCatalog, null, 2)}

Provide recommendations matching these criteria. Out of the catalogue, select the 1, 2, or 3 best matching products.
Generate a response strictly formatted in JSON. The JSON structure must match this schema:
{
  "matches": [
    {
      "productId": "id from catalogue matching",
      "plantName": "name of plant from catalogue",
      "reason": "1-2 elegant sentences detailing why this plant is perfect for their specific setup and preferences"
    }
  ],
  "expertAdvice": "A paragraph of pristine, supportive master-level guidance about starting with these selections, trimming tips, or water parameter parameters based on their inputs."
}`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback matching logic when API key is missing or not configured
        const matches = dbState.products
          .filter((p: any) => {
            if (difficulty !== "Any" && p.difficulty !== difficulty) return false;
            if (light !== "Any" && p.light !== light) return false;
            if (co2 !== "Any" && p.co2 !== co2) return false;
            return true;
          })
          .slice(0, 3)
          .map((p: any) => ({
            productId: p.id,
            plantName: p.name,
            reason: `Our experts recommend the ${p.name} (${p.scientificName}) because it perfectly accommodates your ${difficulty === "Any" ? "general" : p.difficulty}-tech environment and thrives cleanly under ${p.light} light conditions.`
          }));

        // If no strict matches found, suggest first 2 plants
        if (matches.length === 0 && dbState.products.length > 0) {
          matches.push({
            productId: dbState.products[0].id,
            plantName: dbState.products[0].name,
            reason: "An amazing starter plant that adapts gracefully to almost any premium aquascaping layout."
          });
        }

        return res.json({
          matches,
          expertAdvice: "To secure pristine, healthy leaves and trigger vibrant colors, ensure you carry out regular 30% weekly water changes and dose trace micro-nutrients. Clean aquatic landscapes grow most beautiful with gradual patience!"
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productId: { type: Type.STRING },
                    plantName: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["productId", "plantName", "reason"]
                }
              },
              expertAdvice: { type: Type.STRING }
            },
            required: ["matches", "expertAdvice"]
          }
        }
      });

      const resultText = response.text?.trim() || "{}";
      const resultJson = JSON.parse(resultText);
      res.json(resultJson);
    } catch (err: any) {
      console.error("Gemini API Quiz Error:", err);
      // Fallback
      res.json({
        matches: [],
        expertAdvice: "Maintain stable water parameters between 22-26°C and perform routine 30% weekly water changes to prevent unwanted algae. Patience is the key to premium aquascaping!"
      });
    }
  });

  // ==========================================
  // ADMIN API ROUTES (Dashboard CRUD Operations)
  // ==========================================

  // Products CRUD
  app.post("/api/admin/products", async (req, res) => {
    try {
      const docId = "prod-" + Date.now();
      const productData = req.body;
      
      const manualSlug = productData.seo?.slug || productData.slug;
      const slugSrc = manualSlug || productData.name;
      const uniqueSlug = await ensureUniqueSlug("products", slugSrc, docId);
      
      if (!productData.seo) productData.seo = {};
      productData.seo.slug = uniqueSlug;
      productData.slug = uniqueSlug;

      const newProduct = {
        reviews: [],
        ...productData
      };
      await db.collection("products").doc(docId).set(newProduct);
      res.json({ success: true, product: { id: docId, ...newProduct } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;

      const manualSlug = productData.seo?.slug || productData.slug;
      const slugSrc = manualSlug || productData.name;
      const uniqueSlug = await ensureUniqueSlug("products", slugSrc, id);
      
      if (!productData.seo) productData.seo = {};
      productData.seo.slug = uniqueSlug;
      productData.slug = uniqueSlug;

      await db.collection("products").doc(id).set(productData, { merge: true });
      const updatedDoc = await db.collection("products").doc(id).get();
      res.json({ success: true, product: { id, ...updatedDoc.data() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("products").doc(id).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Categories Admin Endpoints
  app.post("/api/admin/categories", async (req, res) => {
    try {
      const docId = "cat-" + Date.now();
      const categoryData = req.body;

      const manualSlug = categoryData.seo?.slug || categoryData.slug;
      const slugSrc = manualSlug || categoryData.name;
      const uniqueSlug = await ensureUniqueSlug("categories", slugSrc, docId);

      if (!categoryData.seo) categoryData.seo = {};
      categoryData.seo.slug = uniqueSlug;
      categoryData.slug = uniqueSlug;

      const newCategory = {
        name: categoryData.name || "",
        image: categoryData.image || "",
        ...categoryData
      };
      await db.collection("categories").doc(docId).set(newCategory);
      res.json({ success: true, category: { id: docId, ...newCategory } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const catRef = db.collection("categories").doc(id);
      const catDoc = await catRef.get();

      if (!catDoc.exists) return res.status(404).json({ error: "Category not found" });

      const manualSlug = categoryData.seo?.slug || categoryData.slug;
      const slugSrc = manualSlug || categoryData.name || catDoc.data()?.name;
      const uniqueSlug = await ensureUniqueSlug("categories", slugSrc, id);

      if (!categoryData.seo) categoryData.seo = {};
      categoryData.seo.slug = uniqueSlug;
      categoryData.slug = uniqueSlug;

      const oldName = catDoc.data()?.name;
      const newName = categoryData.name || oldName;

      await catRef.set(categoryData, { merge: true });

      if (oldName && newName && oldName !== newName) {
        // Cascade update products using category
        const productsSnap = await db.collection("products").where("category", "==", oldName).get();
        if (!productsSnap.empty) {
          const batch = db.batch();
          productsSnap.docs.forEach((doc) => {
            batch.update(doc.ref, { category: newName });
          });
          await batch.commit();
        }
      }

      const updatedDoc = await catRef.get();
      res.json({ success: true, category: { id, ...updatedDoc.data() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("categories").doc(id).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Blogs CRUD
  app.post("/api/admin/blogs", async (req, res) => {
    try {
      const docId = "blog-" + Date.now();
      const blogData = req.body;

      const manualSlug = blogData.seo?.slug || blogData.slug;
      const slugSrc = manualSlug || blogData.title;
      const uniqueSlug = await ensureUniqueSlug("blogs", slugSrc, docId);

      if (!blogData.seo) blogData.seo = {};
      blogData.seo.slug = uniqueSlug;
      blogData.slug = uniqueSlug;

      const newBlog = {
        date: new Date().toISOString().split("T")[0],
        ...blogData
      };
      await db.collection("blogs").doc(docId).set(newBlog);
      res.json({ success: true, blog: { id: docId, ...newBlog } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/blogs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const blogData = req.body;

      const manualSlug = blogData.seo?.slug || blogData.slug;
      const slugSrc = manualSlug || blogData.title;
      const uniqueSlug = await ensureUniqueSlug("blogs", slugSrc, id);

      if (!blogData.seo) blogData.seo = {};
      blogData.seo.slug = uniqueSlug;
      blogData.slug = uniqueSlug;

      await db.collection("blogs").doc(id).set(blogData, { merge: true });
      const updatedDoc = await db.collection("blogs").doc(id).get();
      res.json({ success: true, blog: { id, ...updatedDoc.data() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/blogs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("blogs").doc(id).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public Order Status Tracking
  app.get("/api/orders/track/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const orderRef = db.collection("orders").doc(id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ error: "Order not found" });
      }

      const orderData = orderDoc.data();
      res.json({
        success: true,
        order: {
          id: orderDoc.id,
          status: orderData.status || "Pending",
          customerName: orderData.customerName,
          district: orderData.district,
          area: orderData.area,
          total: orderData.total,
          date: orderData.date || orderData.createdAt || "",
          items: orderData.items || []
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Helper: Dispatch Order to Steadfast Courier API
  async function dispatchOrderToSteadfast(order: any, courierSettings?: any) {
    const apiKey = (process.env.STEADFAST_API_KEY || courierSettings?.apiKey || "").trim();
    const secretKey = (process.env.STEADFAST_SECRET_KEY || courierSettings?.secretKey || "").trim();
    const baseUrl = (process.env.STEADFAST_BASE_URL || courierSettings?.baseUrl || "https://portal.steadfast.com.bd/api/v1").replace(/\/$/, "");

    if (!apiKey || !secretKey) {
      throw new Error("Steadfast Courier API Key or Secret Key is not configured. Please enter your credentials in Admin Courier Settings.");
    }

    const fullAddress = [order.address, order.area, order.district].filter(Boolean).join(", ");

    let recipientPhone = String(order.phone || "").trim().replace(/[^\d+]/g, "");
    if (recipientPhone.startsWith("+88")) recipientPhone = recipientPhone.substring(3);
    if (recipientPhone.startsWith("88")) recipientPhone = recipientPhone.substring(2);

    let itemNote = "";
    if (Array.isArray(order.items) && order.items.length > 0) {
      itemNote = order.items.map((it: any) => `${it.name} (x${it.quantity || 1})`).join(", ");
    }
    const note = (order.note ? `${order.note} | Items: ${itemNote}` : `Items: ${itemNote}`).slice(0, 250);

    const isPaidOnline = Boolean(order.paymentTransactionId) && (order.status === "Payment Verified" || order.status === "Processing" || order.status === "Shipped" || order.status === "Completed");
    const isCOD = !order.paymentMethod || order.paymentMethod === "COD" || order.paymentMethod === "Cash on Delivery";
    const codAmount = (isPaidOnline && !isCOD) ? 0 : Number(order.total || 0);

    const payload = {
      invoice: String(order.id),
      recipient_name: String(order.customerName || "Customer"),
      recipient_phone: recipientPhone,
      recipient_address: fullAddress || "Dhaka, Bangladesh",
      cod_amount: codAmount,
      note: note || `Leaf Aquatic Order #${order.id}`
    };

    console.log(`[Steadfast API] Dispatching order ${order.id} to Steadfast Courier...`, payload);

    const response = await fetch(`${baseUrl}/create_order`, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Secret-Key": secretKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let result: any = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { status: response.status, message: responseText };
    }

    if (!response.ok || (result.status && result.status !== 200)) {
      const errorMsg = result.message || (result.errors ? JSON.stringify(result.errors) : `HTTP ${response.status}`);
      throw new Error(`Steadfast Courier Error: ${errorMsg}`);
    }

    return result.consignment || result;
  }

  // Update Order Status (with Auto-Send to Steadfast Courier when confirmed)
  app.put("/api/admin/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const orderRef = db.collection("orders").doc(id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) return res.status(404).json({ error: "Order not found" });

      const existingOrder: any = { id, ...orderDoc.data() };
      const updates: any = { status };

      // Check if order confirmation should trigger Steadfast Courier dispatch
      const confirmStatuses = ["Payment Verified", "Processing", "Shipped"];
      if (confirmStatuses.includes(status) && !existingOrder.steadfastConsignmentId) {
        const dbState = await getDB();
        const apiKey = (process.env.STEADFAST_API_KEY || dbState.courierSettings?.apiKey || "").trim();
        const secretKey = (process.env.STEADFAST_SECRET_KEY || dbState.courierSettings?.secretKey || "").trim();
        const autoSend = dbState.courierSettings?.autoSendOnConfirm !== false; // Default true if configured

        if (apiKey && secretKey && autoSend) {
          try {
            const consignment = await dispatchOrderToSteadfast({ ...existingOrder, status }, dbState.courierSettings);
            updates.steadfastConsignmentId = consignment.consignment_id || consignment.id || "CREATED";
            updates.steadfastTrackingCode = consignment.tracking_code || "";
            updates.steadfastStatus = consignment.status || "in_review";
            updates.courierSentAt = new Date().toISOString();
            updates.steadfastError = null;
          } catch (courierErr: any) {
            console.error(`[Steadfast Auto-Send Error for order ${id}]:`, courierErr.message);
            updates.steadfastError = courierErr.message;
          }
        }
      }

      await orderRef.update(updates);
      const updatedDoc = await orderRef.get();
      res.json({ success: true, order: { id, ...updatedDoc.data() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST Manually Send Order to Steadfast Courier
  app.post("/api/admin/orders/:id/send-to-steadfast", async (req, res) => {
    try {
      const { id } = req.params;
      const orderRef = db.collection("orders").doc(id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) return res.status(404).json({ error: "Order not found" });

      const orderData = { id, ...orderDoc.data() };
      const dbState = await getDB();

      const consignment = await dispatchOrderToSteadfast(orderData, dbState.courierSettings);

      const updates = {
        steadfastConsignmentId: consignment.consignment_id || consignment.id || "CREATED",
        steadfastTrackingCode: consignment.tracking_code || "",
        steadfastStatus: consignment.status || "in_review",
        courierSentAt: new Date().toISOString(),
        steadfastError: null
      };

      await orderRef.update(updates);
      const updatedDoc = await orderRef.get();

      res.json({
        success: true,
        consignment,
        order: { id, ...updatedDoc.data() }
      });
    } catch (err: any) {
      console.error("Manual Steadfast send error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET Live Tracking Status from Steadfast Courier
  app.get("/api/admin/orders/:id/steadfast-status", async (req, res) => {
    try {
      const { id } = req.params;
      const orderRef = db.collection("orders").doc(id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) return res.status(404).json({ error: "Order not found" });

      const orderData = { id, ...orderDoc.data() };
      const dbState = await getDB();

      const apiKey = (process.env.STEADFAST_API_KEY || dbState.courierSettings?.apiKey || "").trim();
      const secretKey = (process.env.STEADFAST_SECRET_KEY || dbState.courierSettings?.secretKey || "").trim();
      const baseUrl = (process.env.STEADFAST_BASE_URL || dbState.courierSettings?.baseUrl || "https://portal.steadfast.com.bd/api/v1").replace(/\/$/, "");

      if (!apiKey || !secretKey) {
        return res.status(400).json({ error: "Steadfast Courier credentials not configured." });
      }

      const response = await fetch(`${baseUrl}/status_by_invoice/${orderData.id}`, {
        method: "GET",
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": secretKey
        }
      });

      const result = await response.json();

      if (result && (result.delivery_status || result.consignment)) {
        const latestStatus = result.delivery_status || result.consignment?.status;
        if (latestStatus) {
          await orderRef.update({
            steadfastStatus: latestStatus
          });
        }
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Coupons CRUD
  app.post("/api/admin/coupons", async (req, res) => {
    try {
      const newCoupon = req.body;
      if (!newCoupon.code) return res.status(400).json({ error: "Coupon code is required" });

      const docId = newCoupon.code.toUpperCase();
      await db.collection("coupons").doc(docId).set(newCoupon);
      res.json({ success: true, coupon: newCoupon });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/coupons/:code", async (req, res) => {
    try {
      const { code } = req.params;
      await db.collection("coupons").doc(code.toUpperCase()).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Review Approvals
  app.post("/api/reviews/approve/:prodId/:revId", async (req, res) => {
    try {
      const { prodId, revId } = req.params;
      const productRef = db.collection("products").doc(prodId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) return res.status(404).json({ error: "Product not found" });

      const product = productDoc.data() || {};
      const reviews = product.reviews || [];
      const review = reviews.find((r: any) => r.id === revId);
      if (!review) return res.status(404).json({ error: "Review not found" });

      review.approved = true;
      await productRef.update({ reviews });
      res.json({ success: true, review });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reviews/reject/:prodId/:revId", async (req, res) => {
    try {
      const { prodId, revId } = req.params;
      const productRef = db.collection("products").doc(prodId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) return res.status(404).json({ error: "Product not found" });

      const product = productDoc.data() || {};
      const reviews = (product.reviews || []).filter((r: any) => r.id !== revId);
      await productRef.update({ reviews });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reviews/toggle-featured/:prodId/:revId", async (req, res) => {
    try {
      const { prodId, revId } = req.params;
      const productRef = db.collection("products").doc(prodId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) return res.status(404).json({ error: "Product not found" });

      const product = productDoc.data() || {};
      const reviews = product.reviews || [];
      const review = reviews.find((r: any) => r.id === revId);
      if (!review) return res.status(404).json({ error: "Review not found" });

      review.featured = !review.featured;
      await productRef.update({ reviews });
      res.json({ success: true, review });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Banner Updates
  app.put("/api/admin/banners", async (req, res) => {
    try {
      await db.doc("settings/banners").set(req.body, { merge: true });
      const updated = (await db.doc("settings/banners").get()).data();
      res.json({ success: true, banners: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Legal Updates
  app.put("/api/admin/legal", async (req, res) => {
    try {
      await db.doc("settings/legal").set(req.body, { merge: true });
      const updated = (await db.doc("settings/legal").get()).data();
      res.json({ success: true, legal: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Payment Settings Updates
  app.put("/api/admin/payment-settings", async (req, res) => {
    try {
      await db.doc("settings/paymentSettings").set(req.body, { merge: true });
      const updated = (await db.doc("settings/paymentSettings").get()).data();
      res.json({ success: true, paymentSettings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Custom Domain & Google Cloud Settings Updates
  app.put("/api/admin/domain-settings", async (req, res) => {
    try {
      await db.doc("settings/domainSettings").set(req.body, { merge: true });
      const updated = (await db.doc("settings/domainSettings").get()).data();
      res.json({ success: true, domainSettings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Live DNS & Custom Domain Propagation Check
  app.get("/api/admin/domain-settings/check-dns", async (req, res) => {
    try {
      const domainRaw = (req.query.domain as string || "leafaquatic.com").trim().toLowerCase();
      const domain = domainRaw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

      if (!domain) return res.status(400).json({ error: "Domain name is required" });

      const [aRes, cnameRes] = await Promise.all([
        fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`).then(r => r.json()).catch(() => null),
        fetch(`https://dns.google/resolve?name=${encodeURIComponent("www." + domain)}&type=CNAME`).then(r => r.json()).catch(() => null)
      ]);

      const aRecords = aRes?.Answer ? aRes.Answer.map((a: any) => a.data) : [];
      const cnameRecords = cnameRes?.Answer ? cnameRes.Answer.map((a: any) => a.data) : [];

      const isGoogleCloudRunIP = aRecords.some((ip: string) => 
        ip.startsWith("216.239.") || ip.startsWith("34.") || ip.startsWith("35.") || ip.startsWith("130.211.")
      );
      const isGoogleCNAME = cnameRecords.some((cname: string) => 
        cname.includes("googlehosted.com") || cname.includes("ghs.google") || cname.includes("run.app")
      );

      res.json({
        success: true,
        domain,
        aRecords,
        cnameRecords,
        isGoogleCloudRunIP,
        isGoogleCNAME,
        status: (isGoogleCloudRunIP || isGoogleCNAME || aRecords.length > 0) ? "CONNECTED" : "PENDING_PROPAGATION",
        checkedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Mount Vite or serve production bundle when running standalone
  if (options.serveFrontend) {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  return app;
}

export async function getServerlessApp() {
  if (!cachedServerlessApp) {
    cachedServerlessApp = await createApp({ serveFrontend: false });
  }
  return cachedServerlessApp;
}

async function startServer() {
  const app = await createApp({ serveFrontend: true });
  const PORT = 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
