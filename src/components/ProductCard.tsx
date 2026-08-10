import { ShoppingBag, Package } from "lucide-react";
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
    <div className="group overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        {/*
          Change this according to your Product interface.

          Example:
          product.productImage
          product.productImageUrl
          product.image
        */}

        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.prodName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={40} className="text-ink-300" />
          </div>
        )}

        {/* Stock */}
        <div className="absolute left-3 top-3">
          {product.quantity === 0 ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm">
              Out of Stock
            </span>
          ) : product.quantity <= 5 ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
              Hurry! Only {product.quantity} left in stock
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-700 shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="truncate font-display text-lg font-semibold text-ink-900">
          {product.prodName}
        </h3>

        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {product.productBrand}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-ink-900">
            ₹{product.price}
          </span>

          <button className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-brand-500 hover:text-brand-600">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
