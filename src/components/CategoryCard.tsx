import { ShoppingBag } from "lucide-react";
import type { Category } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import StarRating from "./StarRating";

interface CategoryCardProps {
  category: Category;
  //onView: (category: Category) => void;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition-all duration-300 hover:ring-ink-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
      <button
        //onClick={() => onView(category)}
        className="relative aspect-[16/9] overflow-hidden bg-ink-100"
        aria-label={`View ${category.categoryName}`}
      >
        <img
          src={category.categoryImage}
          alt={category.categoryName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <button
          //onClick={() => onView(category)}
          className="mt-1 text-left font-display text-lg font-medium leading-snug text-ink-900 transition-colors hover:text-brand-600"
        >
          {category.categoryName}
        </button>
      </div>
    </div>
  );
}
