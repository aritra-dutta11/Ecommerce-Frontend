import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import type { Category, Product } from "@/types";
import CategoryCard from "@/components/CategoryCard";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

interface UserHomePageProps {
  categories: Category[];
  loading: boolean;
  products: Product[];
  //onView: (product: Product) => void;
  //onShopAll: () => void;
}

export default function UserHomePage({
  categories,
  loading,
  products,
  //onView,
  //onShopAll,
}: UserHomePageProps) {
  const { admin, userId } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleShopAllClick = () => {
    navigate(`/products/all/${userId}`);
  };

  if (admin) {
    navigate(`/dashboard/${userId}`);
  }

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7091519/pexels-photo-7091519.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Boutique store"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              New Season Collection
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Curated essentials for modern living
            </h1>
            <p className="mt-6 text-lg text-ink-200">
              Discover thoughtfully designed products that blend timeless
              aesthetics with everyday function. Free shipping on orders over
              INR 999.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                //onClick={onShopAll}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition-all hover:bg-brand-500 hover:text-white"
              >
                Shop the Collection
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                //onClick={onShopAll}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Bestsellers
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On orders over INR 999",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payment",
              desc: "Encrypted checkout",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "Dedicated help team",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <f.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{f.title}</p>
                <p className="text-xs text-ink-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Featured
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Categories
            </h2>
          </div>
          <button
            //onClick={onShopAll}
            className="hidden items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-brand-600 sm:flex"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-ink-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 text-center">
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Bestsellers
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Most Loved Products
            </h2>
            <p className="mt-3 text-ink-500">
              Our community's favorites, tried and tested.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-ink-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  addToCart={addItem}
                  //onView={onView}
                />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <button
              onClick={handleShopAllClick}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Shop All Products <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-brand-900 p-10 lg:p-14">
            <h3 className="font-display text-3xl font-bold text-white">
              Audio Collection
            </h3>
            <p className="mt-3 max-w-sm text-brand-200">
              Immersive sound, premium comfort. Explore our full range of
              headphones and audio gear.
            </p>
            <button
              //onClick={onShopAll}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition-transform hover:scale-105"
            >
              Discover Audio <ArrowRight size={16} />
            </button>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-accent-600 p-10 lg:p-14">
            <h3 className="font-display text-3xl font-bold text-white">
              Home & Lifestyle
            </h3>
            <p className="mt-3 max-w-sm text-accent-100">
              Elevate your space with thoughtfully crafted home essentials.
            </p>
            <button
              //onClick={onShopAll}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent-700 transition-transform hover:scale-105"
            >
              Shop Home <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
