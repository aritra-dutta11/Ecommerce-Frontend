import { SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface ShopPageProps {
  products: Product[];
  loading: boolean;
  //onView: (product: Product) => void;
  searchQuery: string;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export default function ShopPage({
  products,
  loading,
  searchQuery,
}: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(300);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    result = result.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [products, selectedCategory, sort, maxPrice, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink-900">
          Shop All
        </h1>
        <p className="mt-2 text-ink-500">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : "Explore our full collection of curated products."}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-24 rounded-2xl bg-white p-5 ring-1 ring-ink-200">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-ink-600" />
              <h2 className="font-semibold text-ink-900">Filters</h2>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-ink-600">
                Category
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-ink-600">
                Max Price
              </h3>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="mt-2 flex justify-between text-xs text-ink-500">
                <span>$20</span>
                <span className="font-semibold text-ink-900">${maxPrice}</span>
              </div>
            </div>

            {(selectedCategory !== "All" || maxPrice < 300) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setMaxPrice(300);
                }}
                className="mt-5 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-ink-500">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-ink-500">Sort:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-ink-200"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center ring-1 ring-ink-200">
              <p className="font-display text-xl font-medium text-ink-900">
                No products found
              </p>
              <p className="mt-2 text-ink-500">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  //onView={onView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
