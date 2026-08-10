import { ArrowLeft, ArrowRight, Plus, Upload, X, Package } from "lucide-react";
import { useState } from "react";
import type { Category, Product, ProductFormData } from "@/types";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";

interface AdminProductsPageProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
}

export default function AdminProductsPage({
  products,
  categories,
  loading,
}: AdminProductsPageProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Number of products currently displayed
  const [visibleCount, setVisibleCount] = useState(8);

  const visibleProducts = products.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleAddProduct = (data: ProductFormData) => {
    console.log("Product data:", data);
    let validationMsg = "";
    if (data.images.length > 6) {
      validationMsg += "Total number of images cannot exceed 6.";
    }

    if (data.brand === "") {
      validationMsg += "Please enter brand name.";
    }

    if (data.price === "") {
      validationMsg += "Please enter brand name.";
    }

    if (data.quantity === "") {
      validationMsg += "Please enter brand name.";
    }

    if (data.brand === "") {
      validationMsg += "Please enter brand name.";
    }

    if (data.productDesc === "") {
      validationMsg += "Please enter brand name.";
    }
    if (!(validationMsg === "")) {
      toast.error(validationMsg);
    }

    //setShowAddProduct(false);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
                Administration
              </span>

              <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">
                Products
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowAddProduct(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </section>

      {/* Product Section */}
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

        {/* Loading */}
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
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
            <Package size={42} className="mx-auto mb-4 text-ink-400" />

            <h3 className="font-display text-xl font-semibold text-ink-900">
              No products yet
            </h3>

            <p className="mt-2 text-sm text-ink-500">
              Add your first product to start building your inventory.
            </p>

            <button
              onClick={() => setShowAddProduct(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>

            {/* See More */}
            {visibleCount < products.length && (
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

            {/* All products message */}
            {visibleCount >= products.length && products.length > 8 && (
              <p className="mt-10 text-center text-sm text-ink-500">
                You have reached the end of the product list.
              </p>
            )}
          </>
        )}
      </section>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddProduct(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

/* =========================================================
   ADD PRODUCT MODAL
========================================================= */

interface AddProductModalProps {
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

function AddProductModal({
  categories,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    // Maximum 6 images
    const remainingSlots = 6 - images.length;

    const newImages = selectedFiles.slice(0, remainingSlots);

    setImages((prev) => [...prev, ...newImages]);

    // Allows selecting the same file again
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      productName,
      productDesc,
      price,
      category,
      brand,
      quantity,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-200 bg-white px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              Add a new product to your store.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Images */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-700">
                Product Images
              </label>

              <span className="text-xs text-ink-500">
                {images.length}/6 images
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-ink-200 bg-ink-100"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-500"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-800">
                      Main Image
                    </span>
                  )}
                </div>
              ))}

              {images.length < 6 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-300 transition-colors hover:border-brand-500 hover:bg-brand-50">
                  <Upload size={28} className="mb-2 text-ink-400" />

                  <span className="text-sm font-semibold text-ink-700">
                    Add Image
                  </span>

                  <span className="mt-1 text-xs text-ink-500">Up to 6</span>

                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <p className="mt-2 text-xs text-ink-500">
              PNG, JPG or WEBP. Maximum 6 images.
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="mb-1.5 block text-sm font-medium text-ink-700"
            >
              Product Name
            </label>

            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              required
              className="w-full rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full rounded-xl border border-ink-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="brand"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Brand
              </label>

              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand"
                className="w-full rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                  ₹
                </span>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-ink-300 py-3 pl-8 pr-4 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Stock Quantity
              </label>

              <input
                id="stock"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter stock quantity"
                required
                className="w-full rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-ink-700"
            >
              Product Description
            </label>

            <textarea
              id="description"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              required
              className="w-full resize-none rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-ink-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
