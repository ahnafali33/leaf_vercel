import React from "react";

interface SkeletonProps {
  className?: string;
}

export const SkeletonBox: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-md ${className}`}
    />
  );
};

export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({
  className = "",
  lines = 1,
}) => {
  return (
    <div aria-hidden="true" className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-shimmer h-3.5 rounded-md"
          style={{ width: i === lines - 1 && lines > 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-full ${className}`}
    />
  );
};

export const SkeletonButton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-full h-10 w-28 ${className}`}
    />
  );
};

export const SkeletonImage: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-lg w-full h-48 flex items-center justify-center ${className}`}
    >
      <svg className="w-8 h-8 text-forest/10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
      </svg>
    </div>
  );
};

// Layout Skeletons

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="bg-[#F8F6F0] rounded-2xl overflow-hidden border border-forest/5 p-4 flex flex-col h-[400px] justify-between shadow-sm">
      <div className="relative">
        {/* Product Image Space */}
        <SkeletonBox className="w-full h-48 rounded-xl bg-cream-dark" />
        {/* Wishlist Button Placeholder */}
        <SkeletonCircle className="absolute top-3 right-3 w-8 h-8 bg-cream" />
      </div>

      <div className="mt-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Category */}
          <SkeletonBox className="h-3 w-16 mb-2" />
          {/* Product Name */}
          <SkeletonBox className="h-5 w-4/5 mb-1" />
          {/* Scientific Name */}
          <SkeletonBox className="h-3 w-2/3 mb-4" />
        </div>

        <div>
          {/* Rating */}
          <div className="flex space-x-1 mb-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonCircle key={idx} className="w-3.5 h-3.5" />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-4">
            <SkeletonBox className="h-6 w-16" />
            <SkeletonBox className="h-4 w-12" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <SkeletonBox className="h-9 rounded-full" />
            <SkeletonBox className="h-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryPageSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search & Breadcrumbs Placeholder */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-8 w-48" />
        </div>
        <SkeletonBox className="h-10 w-full md:w-80 rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Skeleton */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-[#F8F6F0] rounded-2xl p-6 border border-forest/5 space-y-6">
            <div className="space-y-2">
              <SkeletonBox className="h-5 w-24" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <SkeletonBox className="h-4 w-4 rounded" />
                    <SkeletonBox className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-forest/5" />
            <div className="space-y-2">
              <SkeletonBox className="h-5 w-24" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <SkeletonCircle className="h-4 w-4" />
                    <SkeletonBox className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="flex-grow space-y-6">
          {/* Sorting / Results bar */}
          <div className="flex items-center justify-between bg-[#F8F6F0] p-4 rounded-xl border border-forest/5">
            <SkeletonBox className="h-4 w-36" />
            <SkeletonBox className="h-8 w-40 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <SkeletonBox className="h-4 w-48" />

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <SkeletonBox className="w-full h-96 rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-10 w-3/4" />
            <SkeletonBox className="h-4 w-1/2" />
          </div>

          <hr className="border-forest/5" />

          {/* Pricing */}
          <div className="flex items-center space-x-4">
            <SkeletonBox className="h-8 w-24" />
            <SkeletonBox className="h-6 w-16" />
            <SkeletonBox className="h-6 w-32 rounded-full" />
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#F8F6F0] p-4 rounded-2xl border border-forest/5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1 p-2">
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-20" />
            <SkeletonText lines={4} />
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-10 w-28 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonBox className="h-12 rounded-full" />
              <SkeletonBox className="h-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BlogSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <SkeletonBox className="h-8 w-64 mx-auto" />
        <SkeletonBox className="h-4 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#F8F6F0] rounded-2xl overflow-hidden border border-forest/5 p-4 space-y-4 shadow-sm">
            <SkeletonBox className="w-full h-48 rounded-xl" />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-3 w-20" />
              </div>
              <SkeletonBox className="h-6 w-full" />
              <SkeletonText lines={2} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-forest/5">
              <div className="flex items-center space-x-2">
                <SkeletonCircle className="h-8 w-8" />
                <SkeletonBox className="h-4 w-20" />
              </div>
              <SkeletonBox className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BlogDetailsSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Cover Image */}
      <SkeletonBox className="w-full h-96 rounded-2xl" />

      {/* Title & Metadata */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <SkeletonBox className="h-6 w-20 rounded-full" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-3/4" />
      </div>

      {/* Author Card */}
      <div className="flex items-center space-x-4 bg-[#F8F6F0] p-4 rounded-2xl border border-forest/5">
        <SkeletonCircle className="h-12 w-12" />
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-3 w-36" />
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-6 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBox className="h-6 w-1/4 mb-4" />
            <SkeletonText lines={5} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShoppingCartSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SkeletonBox className="h-8 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 bg-[#F8F6F0] p-4 rounded-2xl border border-forest/5">
              <SkeletonBox className="h-20 w-20 rounded-xl" />
              <div className="flex-grow space-y-2">
                <SkeletonBox className="h-5 w-40" />
                <SkeletonBox className="h-3 w-24" />
              </div>
              <div className="flex items-center space-x-4">
                <SkeletonBox className="h-8 w-24 rounded-lg" />
                <SkeletonBox className="h-5 w-16" />
                <SkeletonCircle className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-forest/5 space-y-6 h-fit">
          <SkeletonBox className="h-6 w-32" />
          <hr className="border-forest/5" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-4 w-16" />
              </div>
            ))}
          </div>
          <hr className="border-forest/5" />
          <div className="flex justify-between">
            <SkeletonBox className="h-6 w-20" />
            <SkeletonBox className="h-6 w-24" />
          </div>
          <SkeletonBox className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const CheckoutSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SkeletonBox className="h-8 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Form + Delivery + Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Customer Form */}
          <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-forest/5 space-y-4">
            <SkeletonBox className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <SkeletonBox className="h-3 w-16" />
                  <SkeletonBox className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Delivery */}
          <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-forest/5 space-y-4">
            <SkeletonBox className="h-6 w-36" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonBox key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Order Summary */}
        <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-forest/5 space-y-6 h-fit">
          <SkeletonBox className="h-6 w-32" />
          <hr className="border-forest/5" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <SkeletonBox className="h-12 w-12 rounded-lg" />
              <div className="flex-grow space-y-1">
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-3 w-16" />
              </div>
            </div>
          ))}
          <hr className="border-forest/5" />
          <SkeletonBox className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const HomepageSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="space-y-16">
      {/* Hero Banner Skeleton */}
      <div className="relative w-full h-[550px] overflow-hidden bg-forest/5">
        <SkeletonBox className="w-full h-full rounded-none" />
        <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SkeletonBox className="h-4 w-36" />
          <SkeletonBox className="h-16 w-3/4 md:w-1/2" />
          <SkeletonBox className="h-6 w-2/3 md:w-1/3" />
          <div className="flex space-x-4">
            <SkeletonBox className="h-12 w-32 rounded-full" />
            <SkeletonBox className="h-12 w-32 rounded-full bg-transparent border border-forest/20" />
          </div>
        </div>
      </div>

      {/* Category Icons Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <SkeletonBox className="h-8 w-48 mx-auto" />
          <SkeletonBox className="h-4 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3 bg-[#F8F6F0] p-4 rounded-2xl border border-forest/5">
              <SkeletonCircle className="h-16 w-16" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <SkeletonBox className="h-8 w-40" />
            <SkeletonBox className="h-4 w-60" />
          </div>
          <SkeletonBox className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const QuizSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <SkeletonBox className="h-8 w-64 mx-auto" />
        <SkeletonBox className="h-4 w-96 mx-auto" />
      </div>

      {/* Dynamic Chat / Interactive Window Skeleton */}
      <div className="bg-[#F8F6F0] rounded-2xl p-6 border border-forest/5 space-y-6 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Chat Bubble 1 (User-like) */}
          <div className="flex justify-end">
            <SkeletonBox className="h-10 w-48 rounded-2xl rounded-tr-none" />
          </div>
          {/* Chat Bubble 2 (System-like) */}
          <div className="flex justify-start items-start space-x-3">
            <SkeletonCircle className="h-8 w-8 shrink-0" />
            <div className="space-y-2 max-w-md w-full">
              <SkeletonBox className="h-8 w-full rounded-2xl rounded-tl-none" />
              <SkeletonBox className="h-12 w-4/5 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Input & suggestions */}
        <div className="space-y-4 pt-6 border-t border-forest/5">
          <div className="flex space-x-2 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} className="h-8 w-28 rounded-full shrink-0" />
            ))}
          </div>
          <div className="flex space-x-2">
            <SkeletonBox className="h-12 flex-grow rounded-xl" />
            <SkeletonBox className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="flex h-screen bg-[#F8F6F0]">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-forest/5 p-6 space-y-8 shrink-0 hidden md:block bg-[#F8F6F0]">
        <SkeletonBox className="h-8 w-32" />
        <div className="space-y-4 pt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonBox className="h-5 w-5 rounded" />
              <SkeletonBox className="h-4 w-28" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow p-8 space-y-8 overflow-y-auto">
        {/* Header bar */}
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-8 w-48" />
          <div className="flex items-center space-x-4">
            <SkeletonCircle className="h-10 w-10" />
            <SkeletonBox className="h-4 w-24" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-cream p-5 rounded-2xl border border-forest/5 space-y-3">
              <div className="flex justify-between items-center">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonCircle className="h-8 w-8" />
              </div>
              <SkeletonBox className="h-7 w-16" />
              <SkeletonBox className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Table / List Placeholder */}
        <div className="bg-cream rounded-2xl border border-forest/5 p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-9 w-24 rounded-lg" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-forest/5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox key={i} className="h-4 w-20" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 items-center">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-4 w-16" />
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-8 w-12 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="space-y-4 bg-[#F8F6F0] p-6 rounded-2xl border border-forest/5">
      <div className="flex items-center space-x-3">
        <SkeletonCircle className="h-10 w-10" />
        <div className="space-y-1 flex-grow">
          <SkeletonBox className="h-4 w-32" />
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCircle key={i} className="w-3 h-3" />
            ))}
          </div>
        </div>
        <SkeletonBox className="h-3.5 w-24" />
      </div>
      <SkeletonText lines={2} />
    </div>
  );
};

export const LegalPageSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SkeletonBox className="h-10 w-1/2" />
      <div className="space-y-6 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <SkeletonBox className="h-6 w-1/3 mb-2" />
            <SkeletonText lines={4} />
          </div>
        ))}
      </div>
    </div>
  );
};
