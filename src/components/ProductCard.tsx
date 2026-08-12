import { ShoppingBag } from "lucide-react";
import type { AddToCart, Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  addToCart: (data: AddToCart) => Promise<void>;
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addToCart({
        prodId: product.productId,
      });
    } catch (error) {}
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition-all duration-300 hover:ring-ink-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
      <button
        //onClick={() => onView(product)}
        className="relative aspect-square overflow-hidden bg-ink-100"
        aria-label={`View ${product.prodName}`}
      >
        <img
          src={product.primary_image}
          alt={product.prodName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {!(product.quantity > 0) && (
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
          {product.prodName}
        </button>
        <div className="mt-1.5">
          {product.avgRating > 0 ? (
            <>
              <StarRating
                rating={product.avgRating}
                size={14}
                showValue={false}
              />
            </>
          ) : (
            <>
              <h6 className="font-semibold text-ink-400">No ratings</h6>
            </>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-semibold text-ink-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!(product.quantity > 0)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white transition-all duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-900"
            aria-label={`Add ${product.prodName} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
