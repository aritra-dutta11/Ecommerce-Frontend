import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  //onView: (product: Product) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition-all duration-300 hover:ring-ink-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
      <button
        //onClick={() => onView(product)}
        className="relative aspect-square overflow-hidden bg-ink-100"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Featured
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-ink-900 px-4 py-1.5 text-sm font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <button
          //onClick={() => onView(product)}
          className="mt-1 text-left font-display text-lg font-medium leading-snug text-ink-900 transition-colors hover:text-brand-600"
        >
          {product.name}
        </button>
        <div className="mt-1.5">
          <StarRating rating={product.rating} size={14} showValue={false} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-semibold text-ink-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={!product.in_stock}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white transition-all duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-900"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
