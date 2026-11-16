import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Category, Product, BlogPost } from "../types";

interface BreadcrumbsProps {
  type: "product" | "category" | "blog" | "generic";
  product?: Product;
  category?: Category | string;
  categories?: Category[];
  blog?: BlogPost;
  label?: string;
}

export default function Breadcrumbs({
  type,
  product,
  category,
  categories = [],
  blog,
  label
}: BreadcrumbsProps) {
  
  // Find clean category slug helper
  const getCategorySlug = (catName: string) => {
    const found = categories.find(c => c.name === catName);
    if (found) {
      return found.seo?.slug || found.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    return catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center select-none">
      <ol className="flex items-center flex-wrap gap-2 text-[10px] md:text-xs font-poppins font-medium uppercase tracking-wider text-forest/40">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-gold transition-colors duration-200"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {type === "product" && product && (
          <>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <Link
                to="/shop"
                className="hover:text-gold transition-colors duration-200"
              >
                Shop
              </Link>
            </li>
            {product.category && (
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-forest/20" />
                <Link
                  to={`/category/${getCategorySlug(product.category)}`}
                  className="hover:text-gold transition-colors duration-200"
                >
                  {product.category}
                </Link>
              </li>
            )}
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <span className="text-forest/70 font-semibold truncate max-w-[150px] md:max-w-xs normal-case font-sans">
                {product.name}
              </span>
            </li>
          </>
        )}

        {type === "category" && category && (
          <>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <span className="text-forest/70 font-semibold font-sans normal-case">
                {typeof category === "string" ? category : category.name}
              </span>
            </li>
          </>
        )}

        {type === "blog" && blog && (
          <>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <Link
                to="/blog"
                className="hover:text-gold transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <span className="text-forest/70 font-semibold truncate max-w-[150px] md:max-w-xs normal-case font-sans">
                {blog.title}
              </span>
            </li>
          </>
        )}

        {type === "generic" && label && (
          <>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-forest/20" />
              <span className="text-forest/70 font-semibold normal-case font-sans">
                {label}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
