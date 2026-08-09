import {
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import StarRating from "@/components/StarRating";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCheckout: () => void;
}

export default function ProductDetailPage({
  product,
  onBack,
  onCheckout,
}: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative overflow-hidden rounded-3xl bg-ink-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={product.rating} size={18} />
            <span className="text-sm text-ink-500">
              {product.reviews_count} reviews
            </span>
          </div>

          <p className="mt-6 text-lg text-ink-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <span className="font-display text-4xl font-bold text-ink-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {product.in_stock ? (
              <>
                <Check size={20} className="text-success-600" />
                <span className="text-sm font-medium text-success-600">
                  In Stock
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-error-500">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!product.in_stock}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Cart —{" "}
                  {formatPrice(product.price * quantity)}
                </>
              )}
            </button>
          </div>

          {added && (
            <button
              onClick={onCheckout}
              className="mt-3 text-center text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View cart & checkout →
            </button>
          )}

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink-200 pt-8">
            {[
              { icon: Truck, label: "Free shipping over INR 999" },
              { icon: RotateCcw, label: "30-day returns" },
              { icon: ShieldCheck, label: "2-year warranty" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <item.icon size={22} className="text-ink-600" />
                <span className="text-xs text-ink-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
