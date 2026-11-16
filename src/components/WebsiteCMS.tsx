import React, { useState, useEffect } from "react";
import { Upload, Image, AlignLeft, Share2, Settings, ListPlus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface WebsiteCMSProps {
  products: any[];
  websiteContent: any;
  cloudinarySettings: any;
  onUpdateWebsiteContent: (content: any) => Promise<void>;
  onUpdateCloudinarySettings: (settings: any) => Promise<void>;
}

export default function WebsiteCMS({
  products,
  websiteContent,
  cloudinarySettings,
  onUpdateWebsiteContent,
  onUpdateCloudinarySettings,
}: WebsiteCMSProps) {
  const [activeTab, setActiveTab] = useState<"cloudinary" | "images" | "text" | "social" | "sections">("cloudinary");
  const [cloudSettingsState, setCloudSettingsState] = useState({
    cloudName: cloudinarySettings?.cloudName || "",
    uploadPreset: cloudinarySettings?.uploadPreset || "",
  });

  const [textContentState, setTextContentState] = useState({ ...(websiteContent?.text || {}) });
  const [imagesContentState, setImagesContentState] = useState({ ...(websiteContent?.images || {}) });
  const [socialContentState, setSocialContentState] = useState({ ...(websiteContent?.social || {}) });
  const [sectionsContentState, setSectionsContentState] = useState({ ...(websiteContent?.homepageSections || {}) });

  // Sync state with props when database loads
  useEffect(() => {
    if (cloudinarySettings) {
      setCloudSettingsState({
        cloudName: cloudinarySettings.cloudName || "",
        uploadPreset: cloudinarySettings.uploadPreset || "",
      });
    }
  }, [cloudinarySettings]);

  useEffect(() => {
    if (websiteContent) {
      setTextContentState({ ...(websiteContent.text || {}) });
      setImagesContentState({ ...(websiteContent.images || {}) });
      setSocialContentState({ ...(websiteContent.social || {}) });
      setSectionsContentState({ ...(websiteContent.homepageSections || {}) });
    }
  }, [websiteContent]);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handleSaveCloudinary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateCloudinarySettings(cloudSettingsState);
      showStatus("success", "Cloudinary configurations saved successfully.");
    } catch (err: any) {
      showStatus("error", err.message || "Failed to save configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWebsiteContent = async (tabName: string) => {
    setIsSaving(true);
    try {
      const mergedContent = {
        ...websiteContent,
        images: imagesContentState,
        text: textContentState,
        social: socialContentState,
        homepageSections: sectionsContentState,
      };
      await onUpdateWebsiteContent(mergedContent);
      showStatus("success", `${tabName} settings updated successfully in database.`);
    } catch (err: any) {
      showStatus("error", err.message || "Failed to update content.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    showStatus("success", `Compressing and uploading ${file.name}...`);

    try {
      // Convert to base64 for processing & server proxying
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64data }),
          });

          const data = await response.json();
          if (!response.ok || !data.url) {
            throw new Error(data.error || "Image upload failed. Double-check Cloudinary credentials.");
          }

          setImagesContentState((prev: any) => ({ ...prev, [fieldName]: data.url }));
          if (data.warning) {
            showStatus("error", `Warning: ${data.warning}`);
          } else {
            showStatus("success", `Successfully uploaded image to Cloudinary! URL: ${data.url.substring(0, 40)}...`);
          }
        } catch (err: any) {
          showStatus("error", err.message || "Upload failed. Please check your network and credentials.");
        } finally {
          setUploadingField(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showStatus("error", "Failed to process selected file.");
      setUploadingField(null);
    }
  };

  const handleSectionProductChange = (sectionName: string, index: number, value: string) => {
    setSectionsContentState((prev: any) => {
      const list = [...(prev[sectionName] || [])];
      if (value === "") {
        list.splice(index, 1);
      } else {
        list[index] = value;
      }
      return { ...prev, [sectionName]: list };
    });
  };

  const addSectionProductSlot = (sectionName: string) => {
    setSectionsContentState((prev: any) => {
      const list = [...(prev[sectionName] || [])];
      const nextProduct = products[0]?.id || "";
      if (nextProduct) list.push(nextProduct);
      return { ...prev, [sectionName]: list };
    });
  };

  return (
    <div className="space-y-6 text-left font-poppins text-xs text-forest">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-forest/10 pb-4">
        <div>
          <h3 className="font-cinzel text-base font-extrabold tracking-widest text-forest">WEBSITE CONTENT MANAGEMENT (CMS)</h3>
          <p className="text-[11px] text-forest/60">Manage all marketing texts, dynamic images via Cloudinary, and homepage display sections instantly.</p>
        </div>
        {statusMsg && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[11px] font-medium animate-pulse ${
            statusMsg.type === "success" ? "bg-emerald-green/10 text-emerald-green border-emerald-green/20" : "bg-[#8A3324]/10 text-[#8A3324] border-[#8A3324]/20"
          }`}>
            {statusMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-forest/5 pb-2">
        <button
          onClick={() => setActiveTab("cloudinary")}
          className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "cloudinary" ? "bg-forest text-cream shadow-sm" : "bg-cream-dark/15 hover:bg-forest/10"
          }`}
        >
          <Settings className="w-4 h-4" /> Cloudinary API
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "images" ? "bg-forest text-cream shadow-sm" : "bg-cream-dark/15 hover:bg-forest/10"
          }`}
        >
          <Image className="w-4 h-4" /> Images CMS
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "text" ? "bg-forest text-cream shadow-sm" : "bg-cream-dark/15 hover:bg-forest/10"
          }`}
        >
          <AlignLeft className="w-4 h-4" /> Core Website Text
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "social" ? "bg-forest text-cream shadow-sm" : "bg-cream-dark/15 hover:bg-forest/10"
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Channels
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "sections" ? "bg-forest text-cream shadow-sm" : "bg-cream-dark/15 hover:bg-forest/10"
          }`}
        >
          <ListPlus className="w-4 h-4" /> Display Sections
        </button>
      </div>

      {/* TAB 1: CLOUDINARY CONFIG */}
      {activeTab === "cloudinary" && (
        <form onSubmit={handleSaveCloudinary} className="space-y-4 bg-cream-dark/5 p-6 rounded-2xl border border-forest/10">
          <div className="border-b border-forest/5 pb-2 mb-2">
            <h4 className="font-cinzel font-bold text-forest text-xs tracking-wider uppercase">CLOUDINARY IMAGE STORAGE GATE</h4>
            <p className="text-[11px] text-forest/60">Configure Cloudinary parameters below. When valid, uploaded CMS and Product images will save on Cloudinary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-forest uppercase">Cloud Name</label>
              <input
                type="text"
                placeholder="Cloud name from Cloudinary Console"
                value={cloudSettingsState.cloudName}
                onChange={(e) => setCloudSettingsState(prev => ({ ...prev, cloudName: e.target.value }))}
                className="w-full bg-cream border border-forest/15 rounded-lg p-2 focus:outline-none focus:border-gold font-poppins text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-forest uppercase">Unsigned Upload Preset</label>
              <input
                type="text"
                placeholder="Upload preset (configured as Unsigned in settings)"
                value={cloudSettingsState.uploadPreset}
                onChange={(e) => setCloudSettingsState(prev => ({ ...prev, uploadPreset: e.target.value }))}
                className="w-full bg-cream border border-forest/15 rounded-lg p-2 focus:outline-none focus:border-gold font-poppins text-xs"
              />
            </div>
          </div>

          <div className="bg-cream p-4 rounded-xl border border-forest/10 mt-2 space-y-2 leading-relaxed">
            <p className="font-semibold text-forest text-[11px]">How to configure Unsigned Upload Preset:</p>
            <ol className="list-decimal list-inside space-y-1 text-forest/70 text-[11px]">
              <li>Log in to your <strong>Cloudinary dashboard</strong>.</li>
              <li>Navigate to <strong>Settings (Gear Icon) &rarr; Upload</strong>.</li>
              <li>Scroll to <strong>Upload presets</strong> and click <strong>Add upload preset</strong>.</li>
              <li>Change the <strong>Signing Mode</strong> from <em>Signed</em> to <strong>Unsigned</strong>.</li>
              <li>Save and copy your generated <strong>Preset Name</strong> and enter it above!</li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Cloudinary API
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: IMAGES CMS */}
      {activeTab === "images" && (
        <div className="space-y-6 bg-cream-dark/5 p-6 rounded-2xl border border-forest/10">
          <div className="border-b border-forest/5 pb-2">
            <h4 className="font-cinzel font-bold text-forest text-xs tracking-wider uppercase">DYNAMIC WEBSITE IMAGE ASSETS</h4>
            <p className="text-[11px] text-forest/60">Upload files here. If Cloudinary is connected, they will upload to the cloud. Else, they fallback to local data urls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "heroBanner", label: "Homepage Hero Banner Image" },
              { id: "featuredSection", label: "Curated Section Image" },
              { id: "promoBanner", label: "Promotional Banner Background" },
              { id: "productSectionBanner", label: "Product Listing Banner Image" },
              { id: "atelierCard1Image", label: "Atelier Inspiration Gallery Card 1 (Large Image)" },
              { id: "atelierCard2Image", label: "Atelier Inspiration Gallery Card 2 (Small Image)" },
              { id: "brandLogo", label: "Brand Logo (Alternative)" },
              { id: "footerLogo", label: "Footer Logo (Alternative)" },
            ].map((imgField) => (
              <div key={imgField.id} className="bg-cream border border-forest/10 p-4 rounded-xl flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-bold text-forest text-[11px] block">{imgField.label}</span>
                  <input
                    type="text"
                    value={imagesContentState[imgField.id] || ""}
                    onChange={(e) => setImagesContentState((prev: any) => ({ ...prev, [imgField.id]: e.target.value }))}
                    className="w-full bg-cream-dark/30 border border-forest/10 rounded px-2 py-1.5 text-[11px]"
                    placeholder="Direct Image URL"
                  />
                </div>

                {imagesContentState[imgField.id] && (
                  <div className="h-28 w-full bg-cream-dark/25 border border-forest/5 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={imagesContentState[imgField.id]}
                      alt={imgField.label}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-upload-${imgField.id}`}
                    onChange={(e) => handleImageUpload(e, imgField.id)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`file-upload-${imgField.id}`}
                    className="w-full bg-cream-dark border border-forest/15 text-forest font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-forest/5 transition-all text-center"
                  >
                    {uploadingField === imgField.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" /> Uploading to Cloudinary...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-gold" /> Select & Upload Image
                      </>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-forest/10">
            <button
              onClick={() => handleSaveWebsiteContent("Images CMS")}
              disabled={isSaving}
              className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Dynamic Images
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CORE WEBSITE TEXT */}
      {activeTab === "text" && (
        <div className="space-y-6 bg-cream-dark/5 p-6 rounded-2xl border border-forest/10">
          <div className="border-b border-forest/5 pb-2">
            <h4 className="font-cinzel font-bold text-forest text-xs tracking-wider uppercase">CORE COPYWRITING TEXT MANAGEMENT</h4>
            <p className="text-[11px] text-forest/60">Manage titles, subtitles, banner slogans, brand names, and general about descriptions in one central control pane.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group 1: Hero */}
            <div className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3">
              <span className="font-cinzel font-bold text-forest block border-b border-forest/5 pb-1 uppercase text-[10px]">1. Hero Slogan & Buttons</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Hero Title Line 1</label>
                <input
                  type="text"
                  value={textContentState.heroTitleLine1 || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, heroTitleLine1: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Hero Title Line 2</label>
                <input
                  type="text"
                  value={textContentState.heroTitleLine2 || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, heroTitleLine2: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={textContentState.heroSubtitle || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, heroSubtitle: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 text-[11px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Hero Button Label</label>
                <input
                  type="text"
                  value={textContentState.heroButtonLabel || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, heroButtonLabel: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
            </div>

            {/* Group 2: Homepage Promos & Announcements */}
            <div className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3">
              <span className="font-cinzel font-bold text-forest block border-b border-forest/5 pb-1 uppercase text-[10px]">2. Promotional Highlights</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Announcement Bar Text</label>
                <input
                  type="text"
                  value={textContentState.announcementBar || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, announcementBar: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Promo Section Slogan Title</label>
                <input
                  type="text"
                  value={textContentState.promoTitle || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, promoTitle: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Promo Subtitle / Details</label>
                <textarea
                  rows={2}
                  value={textContentState.promoSubtitle || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, promoSubtitle: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 text-[11px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Promo Button Text</label>
                <input
                  type="text"
                  value={textContentState.promoButtonLabel || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, promoButtonLabel: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
            </div>

            {/* Group 3: Brand & About Slogan */}
            <div className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3">
              <span className="font-cinzel font-bold text-forest block border-b border-forest/5 pb-1 uppercase text-[10px]">3. About Studio & Brand</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-forest/60 uppercase">Brand First Part</label>
                  <input
                    type="text"
                    value={textContentState.brandName || ""}
                    onChange={(e) => setTextContentState((prev: any) => ({ ...prev, brandName: e.target.value }))}
                    className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-forest/60 uppercase">Brand Second Part</label>
                  <input
                    type="text"
                    value={textContentState.brandSubname || ""}
                    onChange={(e) => setTextContentState((prev: any) => ({ ...prev, brandSubname: e.target.value }))}
                    className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Brand Sub tagline</label>
                <input
                  type="text"
                  value={textContentState.brandTagline || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, brandTagline: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">About Slogan Title</label>
                <input
                  type="text"
                  value={textContentState.aboutTitle || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, aboutTitle: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">About Slogan Slogan/Details</label>
                <textarea
                  rows={2}
                  value={textContentState.aboutDescription || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, aboutDescription: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 text-[11px]"
                />
              </div>
            </div>

            {/* Group 4: Contact & Footer */}
            <div className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3">
              <span className="font-cinzel font-bold text-forest block border-b border-forest/5 pb-1 uppercase text-[10px]">4. Contact & Footer info</span>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Contact Phone Number</label>
                <input
                  type="text"
                  value={textContentState.contactPhone || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Contact Support Email</label>
                <input
                  type="text"
                  value={textContentState.contactEmail || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Contact Physical Address</label>
                <input
                  type="text"
                  value={textContentState.contactAddress || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, contactAddress: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-forest/60 uppercase">Footer Brand Slogan</label>
                <textarea
                  rows={2}
                  value={textContentState.footerDescription || ""}
                  onChange={(e) => setTextContentState((prev: any) => ({ ...prev, footerDescription: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 text-[11px]"
                />
              </div>
            </div>

            {/* Group 5: Aquascaping Inspiration Atelier */}
            <div className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3 col-span-1 md:col-span-2">
              <span className="font-cinzel font-bold text-forest block border-b border-forest/5 pb-1 uppercase text-[10px]">5. Aquascaping Inspiration Atelier Section</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-forest/60 uppercase">Section Main Title</label>
                  <input
                    type="text"
                    value={textContentState.atelierTitle || ""}
                    onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierTitle: e.target.value }))}
                    placeholder="Aquascaping Inspiration Atelier"
                    className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-forest/60 uppercase">Section Subtitle</label>
                  <input
                    type="text"
                    value={textContentState.atelierSubtitle || ""}
                    onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierSubtitle: e.target.value }))}
                    placeholder="Take a glimpse at real layouts designed using our premium mosses..."
                    className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-forest/5 pt-3">
                {/* Card 1 copy */}
                <div className="space-y-2">
                  <span className="font-bold text-gold text-[10px] block uppercase">GALLERY CARD 1 (LARGE Left)</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 1 Badge</label>
                    <input
                      type="text"
                      value={textContentState.atelierCard1Badge || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard1Badge: e.target.value }))}
                      placeholder="GOLD MEDAL EXHIBITION"
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 1 Title</label>
                    <input
                      type="text"
                      value={textContentState.atelierCard1Title || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard1Title: e.target.value }))}
                      placeholder="The Emerald Terraces (Dutch style)"
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 1 Description</label>
                    <textarea
                      rows={2}
                      value={textContentState.atelierCard1Desc || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard1Desc: e.target.value }))}
                      placeholder="Planted exclusively with Rotala stems..."
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-[11px]"
                    />
                  </div>
                </div>

                {/* Card 2 copy */}
                <div className="space-y-2">
                  <span className="font-bold text-gold text-[10px] block uppercase">GALLERY CARD 2 (SMALL Right)</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 2 Badge</label>
                    <input
                      type="text"
                      value={textContentState.atelierCard2Badge || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard2Badge: e.target.value }))}
                      placeholder="MINIMALIST ZEN"
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 2 Title</label>
                    <input
                      type="text"
                      value={textContentState.atelierCard2Title || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard2Title: e.target.value }))}
                      placeholder="Pro Iwagumi layout"
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-forest/60 uppercase">Card 2 Description</label>
                    <textarea
                      rows={2}
                      value={textContentState.atelierCard2Desc || ""}
                      onChange={(e) => setTextContentState((prev: any) => ({ ...prev, atelierCard2Desc: e.target.value }))}
                      placeholder="Grounded by deep fissured..."
                      className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 focus:outline-none focus:border-gold text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-forest/10">
            <button
              onClick={() => handleSaveWebsiteContent("Core Slogans & Texts")}
              disabled={isSaving}
              className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Copywriting Text
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL CHANNELS */}
      {activeTab === "social" && (
        <div className="space-y-6 bg-cream-dark/5 p-6 rounded-2xl border border-forest/10">
          <div className="border-b border-forest/5 pb-2">
            <h4 className="font-cinzel font-bold text-forest text-xs tracking-wider uppercase">SOCIAL MEDIA CHANNELS</h4>
            <p className="text-[11px] text-forest/60">Configure social profile URLs to dynamically link them across headers, floating buttons, and footers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "facebook", label: "Facebook Page URL" },
              { id: "instagram", label: "Instagram Profile URL" },
              { id: "youtube", label: "YouTube Channel URL" },
              { id: "whatsapp", label: "WhatsApp Chat Link (e.g. https://wa.me/+88017...)" },
              { id: "tiktok", label: "TikTok Profile Link" },
              { id: "messenger", label: "Messenger Chat Link" },
            ].map((soc) => (
              <div key={soc.id} className="space-y-1 bg-cream p-3 rounded-lg border border-forest/5">
                <label className="text-[10px] font-bold text-forest/60 uppercase">{soc.label}</label>
                <input
                  type="text"
                  placeholder={`https://${soc.id}.com/username`}
                  value={socialContentState[soc.id] || ""}
                  onChange={(e) => setSocialContentState((prev: any) => ({ ...prev, [soc.id]: e.target.value }))}
                  className="w-full bg-cream-dark/20 border border-forest/15 rounded p-1.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-forest/10">
            <button
              onClick={() => handleSaveWebsiteContent("Social Channels")}
              disabled={isSaving}
              className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Social Links
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: HOMEPAGE PRODUCT SECTIONS */}
      {activeTab === "sections" && (
        <div className="space-y-6 bg-cream-dark/5 p-6 rounded-2xl border border-forest/10">
          <div className="border-b border-forest/5 pb-2">
            <h4 className="font-cinzel font-bold text-forest text-xs tracking-wider uppercase">HOMEPAGE PRODUCT GRID MANAGEMENT</h4>
            <p className="text-[11px] text-forest/60">Configure which specific specimens appear inside the homepage bento highlights, bestseller grids, and recommended drawers.</p>
          </div>

          <div className="space-y-6">
            {[
              { id: "featuredProducts", label: "Homepage Hero Featured Products", titleKey: "featuredTitle", subtitleKey: "featuredSubtitle", defaultTitle: "Atelier's Curated Specimens", defaultSubtitle: "Exceptional specimens displaying brilliant foliage coloration, ready to grow." },
              { id: "bestSellers", label: "Hobbyists' Best Sellers Grid", titleKey: "bestSellersTitle", subtitleKey: "bestSellersSubtitle", defaultTitle: "Hobbyists' Coveted Favorites", defaultSubtitle: "Highly coveted by both novice aquascape designers and professional competitors." },
              { id: "newArrivals", label: "New Cultivar Additions Slider" },
              { id: "popularProducts", label: "Popular Demand Specimen Drawer" },
              { id: "recommendedProducts", label: "Recommended Flora Drawers" },
            ].map((sect) => {
              const currentList = sectionsContentState[sect.id] || [];
              return (
                <div key={sect.id} className="bg-cream border border-forest/10 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-forest/5 pb-1">
                    <span className="font-bold text-forest text-[11px]">{sect.label}</span>
                    <button
                      onClick={() => addSectionProductSlot(sect.id)}
                      className="bg-forest/5 hover:bg-forest/10 text-forest font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded border border-forest/10 cursor-pointer"
                    >
                      + Add Product Slot
                    </button>
                  </div>

                  {sect.titleKey && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-cream-dark/5 p-3 rounded-lg border border-forest/5 mb-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-forest/70 uppercase">Custom Section Title</label>
                        <input
                          type="text"
                          placeholder={sect.defaultTitle}
                          value={textContentState[sect.titleKey] || ""}
                          onChange={(e) => setTextContentState((prev: any) => ({ ...prev, [sect.titleKey!]: e.target.value }))}
                          className="w-full bg-cream border border-forest/15 rounded p-1.5 text-[11px] text-forest focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-forest/70 uppercase">Custom Section Subtitle / Description</label>
                        <input
                          type="text"
                          placeholder={sect.defaultSubtitle}
                          value={textContentState[sect.subtitleKey!] || ""}
                          onChange={(e) => setTextContentState((prev: any) => ({ ...prev, [sect.subtitleKey!]: e.target.value }))}
                          className="w-full bg-cream border border-forest/15 rounded p-1.5 text-[11px] text-forest focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentList.length === 0 ? (
                    <p className="text-[10px] text-forest/40 italic">No products matched. Click Add to select specimens.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentList.map((prodId: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-cream-dark/25 p-2 rounded-lg border border-forest/5">
                          <select
                            value={prodId}
                            onChange={(e) => handleSectionProductChange(sect.id, idx, e.target.value)}
                            className="flex-1 bg-cream border border-forest/10 rounded p-1 text-[11px] text-forest focus:outline-none"
                          >
                            <option value="">-- Remove Slot --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name} (৳{p.price})</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSectionProductChange(sect.id, idx, "")}
                            className="text-[#8A3324] font-bold text-[10px] px-1.5 hover:underline"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-forest/10">
            <button
              onClick={() => handleSaveWebsiteContent("Display Sections")}
              disabled={isSaving}
              className="bg-forest hover:bg-gold hover:text-forest-dark text-cream font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Display Sections
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
