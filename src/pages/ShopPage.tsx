import React from "react";
import { useAppStore } from "../store";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import { Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShopPageProps {
  shopCategory: string;
  setShopCategory: (val: string) => void;
  shopPrice: number;
  setShopPrice: (val: number) => void;
  shopDifficulty: string;
  setShopDifficulty: (val: string) => void;
  shopLight: string;
  setShopLight: (val: string) => void;
  shopCO2: string;
  setShopCO2: (val: string) => void;
  shopSort: string;
  setShopSort: (val: string) => void;
  shopSearch: string;
  setShopSearch: (val: string) => void;
  shopBrand: string;
  setShopBrand: (val: string) => void;
  shopAvailability: string;
  setShopAvailability: (val: string) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (val: boolean) => void;
}

export default function ShopPage({
  shopCategory, setShopCategory,
  shopPrice, setShopPrice,
  shopDifficulty, setShopDifficulty,
  shopLight, setShopLight,
  shopCO2, setShopCO2,
  shopSort, setShopSort,
  shopSearch, setShopSearch,
  shopBrand, setShopBrand,
  shopAvailability, setShopAvailability,
  isMobileFilterOpen, setIsMobileFilterOpen
}: ShopPageProps) {
  const { products, categories } = useAppStore();

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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (shopSort === "price-low") return a.price - b.price;
    if (shopSort === "price-high") return b.price - a.price;
    if (shopSort === "newest") return b.id.localeCompare(a.id);
    return 0; // popular
  });

  const resetAllFilters = () => {
    setShopCategory("All");
    setShopPrice(10000);
    setShopDifficulty("All");
    setShopLight("All");
    setShopCO2("All");
    setShopBrand("All");
    setShopAvailability("All");
    setShopSearch("");
  };

  return (
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
              onClick={resetAllFilters}
              className="text-[10px] text-gold font-poppins font-semibold hover:underline cursor-pointer"
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 bg-forest-dark/50 backdrop-blur-sm z-50 lg:hidden"
                />
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

                  <button
                    onClick={resetAllFilters}
                    className="text-left text-xs font-bold text-gold uppercase hover:underline cursor-pointer"
                  >
                    Reset All Filters
                  </button>

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

                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full mt-4 bg-forest text-cream font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-md"
                  >
                    Apply Filters
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Grid layout */}
          {sortedProducts.length === 0 ? (
            <div className="bg-cream border border-forest/10 p-12 rounded-2xl text-center space-y-3">
              <p className="font-playfair text-lg text-forest font-bold">No Botanical Specimens Match Your Search Criteria</p>
              <p className="font-cormorant text-sm text-forest/60 italic">Try lowering your max budget or switching lighting and tech level requirements.</p>
              <button
                onClick={resetAllFilters}
                className="mt-2 bg-forest text-cream font-bold text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg hover:bg-gold hover:text-forest-dark transition-all cursor-pointer shadow-none"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
