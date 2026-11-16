import React, { useState, useRef } from "react";
import { Upload, Trash, ArrowLeft, ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";

interface ProductImagesManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

// Client-side image compression and resizing utility to keep database lightweight
function compressAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800; // Resize to max 800px width/height for optimal loading and size
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string); // Fallback to raw base64
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ProductImagesManager({ images = [], onChange }: ProductImagesManagerProps) {
  const [isFeaturedDropping, setIsFeaturedDropping] = useState(false);
  const [isGalleryDropping, setIsGalleryDropping] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const featuredImage = images?.[0] || "";
  const galleryImages = images ? images.slice(1) : [];

  const validateAndProcessFiles = async (files: FileList): Promise<string[]> => {
    setErrorText("");
    setIsCompressing(true);
    const validBase64s: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Format check
        const validFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validFormats.includes(file.type)) {
          throw new Error(`Unsupported format: ${file.name}. Only JPG, JPEG, PNG, and WEBP are allowed.`);
        }

        // 2. Size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name}. Maximum file size is 10MB.`);
        }

        // 3. Compress and convert to base64
        const base64 = await compressAndResizeImage(file);

        // 4. Send to upload endpoint
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 })
        });
        
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Upload to server failed");
        }
        
        const uploadData = await uploadRes.json();
        validBase64s.push(uploadData.url || base64);
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to process images.");
      console.error(err);
    } finally {
      setIsCompressing(false);
    }

    return validBase64s;
  };

  // --- FEATURED IMAGE ACTIONS ---
  const handleFeaturedSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const processed = await validateAndProcessFiles(files);
    if (processed.length > 0) {
      const updated = [...images];
      updated[0] = processed[0]; // Set as featured
      onChange(updated);
    }
  };

  const handleRemoveFeatured = () => {
    const updated = [...images];
    updated[0] = ""; // Clear featured but keep index 0 as placeholder or move gallery image up
    onChange(updated);
  };

  // --- GALLERY IMAGES ACTIONS ---
  const handleGallerySelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const processed = await validateAndProcessFiles(files);
    if (processed.length > 0) {
      // Ensure featured image index is at least initialized if empty
      const updated = [...images];
      if (!updated[0]) updated[0] = "";
      
      // Append new gallery images
      onChange([...updated, ...processed]);
    }
  };

  const handleRemoveGalleryItem = (galleryIndex: number) => {
    const updated = [...images];
    // galleryIndex is 0-indexed for galleryImages, which corresponds to index + 1 in the full images array
    updated.splice(galleryIndex + 1, 1);
    onChange(updated);
  };

  const handleReplaceGalleryItem = async (galleryIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const processed = await validateAndProcessFiles(files);
    if (processed.length > 0) {
      const updated = [...images];
      updated[galleryIndex + 1] = processed[0];
      onChange(updated);
    }
  };

  const handleMoveLeft = (galleryIndex: number) => {
    if (galleryIndex === 0) return; // Cannot move left
    const updated = [...images];
    const actualIndex = galleryIndex + 1;
    
    // Swap item at actualIndex with item at actualIndex - 1
    const temp = updated[actualIndex];
    updated[actualIndex] = updated[actualIndex - 1];
    updated[actualIndex - 1] = temp;
    
    onChange(updated);
  };

  const handleMoveRight = (galleryIndex: number) => {
    if (galleryIndex === galleryImages.length - 1) return; // Cannot move right
    const updated = [...images];
    const actualIndex = galleryIndex + 1;

    // Swap item at actualIndex with item at actualIndex + 1
    const temp = updated[actualIndex];
    updated[actualIndex] = updated[actualIndex + 1];
    updated[actualIndex + 1] = temp;

    onChange(updated);
  };

  return (
    <div className="bg-cream-dark/15 border border-forest/10 p-5 rounded-xl space-y-6 font-poppins text-xs text-forest">
      <div className="flex justify-between items-center border-b border-forest/10 pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-green" />
          <h4 className="font-cinzel text-xs font-bold tracking-widest text-forest">PRODUCT IMAGES</h4>
        </div>
        <span className="text-[10px] text-forest/55 uppercase font-semibold">JPG, JPEG, PNG, WEBP • Max 10MB</span>
      </div>

      {isCompressing && (
        <div className="flex items-center gap-2 text-gold font-semibold animate-pulse bg-gold/5 border border-gold/15 px-3 py-2 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing and optimizing image uploads...</span>
        </div>
      )}

      {errorText && (
        <div className="text-[#8A3324] font-bold bg-[#8A3324]/5 border border-[#8A3324]/15 px-3 py-2 rounded-lg">
          ⚠️ {errorText}
        </div>
      )}

      {/* ==================== SECTION A: FEATURED IMAGE ==================== */}
      <div className="space-y-2">
        <label className="font-bold text-xs uppercase tracking-wider text-forest/75 block">1. FEATURED IMAGE (Displays on Catalog & Card)</label>
        
        {featuredImage ? (
          <div className="relative border border-forest/15 rounded-xl overflow-hidden bg-cream-dark/25 p-3 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-forest/10 bg-black/5 flex items-center justify-center">
              <img src={featuredImage} alt="Featured Product preview" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="font-bold text-emerald-green text-[10px] tracking-widest uppercase">★ Featured Main Image Set</p>
              <p className="text-[10px] text-forest/50">This is the default primary image displayed on product grids, shop page cards, and related item sliders.</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => featuredInputRef.current?.click()}
                  className="bg-forest text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-emerald-green transition-colors cursor-pointer"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFeatured}
                  className="bg-[#8A3324]/10 text-[#8A3324] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-[#8A3324] hover:text-cream transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsFeaturedDropping(true);
            }}
            onDragLeave={() => setIsFeaturedDropping(false)}
            onDrop={async (e) => {
              e.preventDefault();
              setIsFeaturedDropping(false);
              await handleFeaturedSelect(e.dataTransfer.files);
            }}
            onClick={() => featuredInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isFeaturedDropping 
                ? "border-gold bg-gold/5" 
                : "border-forest/15 hover:border-emerald-green hover:bg-cream-dark/5"
            }`}
          >
            <Upload className="w-6 h-6 text-forest/40" />
            <span className="font-bold">Drag & Drop Featured Image</span>
            <span className="text-[10px] text-forest/50">or click to browse from computer</span>
          </div>
        )}
        
        <input
          ref={featuredInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFeaturedSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* ==================== SECTION B: GALLERY IMAGES ==================== */}
      <div className="space-y-3 pt-2">
        <label className="font-bold text-xs uppercase tracking-wider text-forest/75 block">2. GALLERY IMAGES (Secondary product views)</label>

        {/* Existing Gallery Previews */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="border border-forest/10 rounded-xl overflow-hidden bg-cream p-2 space-y-2 flex flex-col justify-between">
                <div className="relative h-24 rounded-lg overflow-hidden border border-forest/5 bg-black/5 flex items-center justify-center">
                  <img src={img} alt={`Gallery view ${index + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-mono px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex gap-1 justify-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLeft(index)}
                      className={`p-1.5 rounded transition-all ${
                        index === 0 ? "text-forest/20 cursor-not-allowed" : "text-forest hover:bg-forest/10"
                      }`}
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      disabled={index === galleryImages.length - 1}
                      onClick={() => handleMoveRight(index)}
                      className={`p-1.5 rounded transition-all ${
                        index === galleryImages.length - 1 ? "text-forest/20 cursor-not-allowed" : "text-forest hover:bg-forest/10"
                      }`}
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => replaceInputRefs.current[index]?.click()}
                      className="p-1.5 rounded text-forest hover:bg-forest/10 text-[10px] font-bold uppercase tracking-wider flex-1"
                      title="Replace this image"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(index)}
                      className="p-1.5 rounded text-[#8A3324] hover:bg-[#8A3324]/10"
                      title="Delete"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  ref={(el) => { replaceInputRefs.current[index] = el; }}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleReplaceGalleryItem(index, e.target.files)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add more Gallery Images Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsGalleryDropping(true);
          }}
          onDragLeave={() => setIsGalleryDropping(false)}
          onDrop={async (e) => {
            e.preventDefault();
            setIsGalleryDropping(false);
            await handleGallerySelect(e.dataTransfer.files);
          }}
          onClick={() => galleryInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
            isGalleryDropping 
              ? "border-gold bg-gold/5" 
              : "border-forest/15 hover:border-emerald-green hover:bg-cream-dark/5"
          }`}
        >
          <Upload className="w-5 h-5 text-forest/40" />
          <span className="font-bold">Add Gallery Images</span>
          <span className="text-[10px] text-forest/50">Drag files here or click to browse</span>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={(e) => handleGallerySelect(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
}
