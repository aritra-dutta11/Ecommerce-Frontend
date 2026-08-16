import { ArrowLeft, ArrowRight, Plus, Upload, X, Package } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category, Product, ProductFormData } from "@/types";

import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { handleAddNewProduct } from "@/api/products/addProduct";
import { handleGetProducts } from "@/api/products/getProducts";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

interface UserProductsPageProps {
  categories: Category[];
}

export default function UserProductsPage({
  categories,
}: UserProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Number of products currently displayed
  const [visibleCount, setVisibleCount] = useState(8);

  const visibleProducts = products.slice(0, visibleCount);

  const { token } = useAuth();

  useEffect(() => {
    try {
      handleFetchProducts(page);
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  const handleFetchProducts = async (page: number) => {
    setLoading(true);
    console.log(page);
    console.log(visibleCount);
    let getProdList = await handleGetProducts(page);
    //console.log(getCategoriesRes);
    console.log(getProdList);
    if (getProdList?.serviceResult?.errorMsg === "") {
      //console.log("Cat List - ", getCategoriesRes);
      setProducts([...products, ...(getProdList?.prodList ?? [])]);
    }
    setLoading(false);
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 8);
    setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">
                Products
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT SECTION
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Inventory
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              All Products
            </h2>

            <p className="mt-2 text-sm text-ink-500">
              Manage your products and inventory.
            </p>
          </div>

          <div className="hidden text-sm text-ink-500 sm:block">
            {products.length} products
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-square animate-pulse bg-ink-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-ink-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-ink-200" />

                  <div className="h-5 w-1/3 animate-pulse rounded bg-ink-200" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================= */
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
            <Package size={42} className="mx-auto mb-4 text-ink-400" />

            <h3 className="font-display text-xl font-semibold text-ink-900">
              No products yet
            </h3>

            <p className="mt-2 text-sm text-ink-500">
              Add your first product to start building your inventory.
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                PRODUCTS
            ================================================= */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  addToCart={addItem}
                />
              ))}
            </div>

            {/* =================================================
                SEE MORE
            ================================================= */}
            {visibleCount <= products.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleSeeMore}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                >
                  See More
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* =================================================
                END OF PRODUCTS
            ================================================= */}
            {visibleCount >= products.length && products.length > 8 && (
              <p className="mt-10 text-center text-sm text-ink-500">
                You have reached the end of the product list.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
