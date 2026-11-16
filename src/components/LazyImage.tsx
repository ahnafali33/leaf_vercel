import React, { useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      {/* Brand-tailored Shimmer Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-shimmer w-full h-full rounded-[inherit]"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
};
