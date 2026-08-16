import {
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import type { Product } from "@/types";

import { formatPrice } from "@/lib/format";
import StarRating from "@/components/StarRating";

import { handleGetSingleProduct } from "@/api/products/getSingleProduct";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { handleAddProductReview } from "@/api/review/addReview";

interface ProductDetailPageProps {}

export default function ProductDetailPage({}: ProductDetailPageProps) {
  const { token } = useAuth();
  const { addItem } = useCart();

  const { productId } = useParams<{
    productId: string;
  }>();

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const [quantity, setQuantity] = useState(1);

  // Selected product image
  const [selectedImage, setSelectedImage] = useState(0);

  // Review states
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [productAvgRating, setProductAvgRating] = useState(0.0);

  /*
   * Get product details
   */
  useEffect(() => {
    if (!productId) return;

    handleGetProduct(productId);
  }, [productId, token]);

  const handleGetProduct = async (prodId: string) => {
    try {
      const authToken = token === null ? "" : token;

      const productRes = await handleGetSingleProduct(prodId, authToken);

      if (productRes?.serviceResult?.errorMsg !== "") {
        toast.error(
          productRes?.serviceResult?.errorMsg || "Unable to fetch product",
        );

        return;
      }

      setProduct(productRes?.productDetails);
      setProductAvgRating(productRes?.productDetails?.avgRating ?? 0);

      // Reset selected image whenever a new product loads
      setSelectedImage(0);

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to fetch product",
      );
    }
  };

  /*
   * Loading state
   */
  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-ink-900" />

          <p className="text-sm text-ink-500">Loading product...</p>
        </div>
      </div>
    );
  }

  /*
   * Backend images
   *
   * Assuming:
   *
   * product.primary_image -> primary image
   * product.productImages -> remaining images
   *
   * If productImages already contains the primary image,
   * remove product.primary_image from this array.
   */
  const images: string[] = [
    ...(product.primary_image ? [String(product.primary_image)] : []),
    ...(product.images ?? []).map((image) => String(image)),
  ];

  /*
   * Remove duplicate images.
   */
  const uniqueImages = [...new Set(images)];

  /*
   * Fallback if backend doesn't return any image.
   */
  const displayImages: string[] =
    uniqueImages.length > 0 ? uniqueImages : ["/placeholder-product.png"];

  /*
   * Previous image
   */
  const handlePreviousImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  /*
   * Next image
   */
  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  /*
   * Add product to cart
   */
  // const handleAddToCart = async () => {
  //   try {
  //     if (product.quantity <= 0) {
  //       toast.error("Product is out of stock");
  //       return;
  //     }

  //     if (quantity > product.quantity) {
  //       toast.error(`Only ${product.quantity} items are available`);

  //       return;
  //     }

  //     await addItem({
  //       productId: product.productId,
  //       quantity: quantity,
  //     });
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "Unable to add product to cart",
  //     );
  //   }
  // };

  /*
   * Buy Now
   */
  // const handleBuyNow = async () => {
  //   try {
  //     if (product.quantity <= 0) {
  //       toast.error("Product is out of stock");
  //       return;
  //     }

  //     if (quantity > product.quantity) {
  //       toast.error(`Only ${product.quantity} items are available`);

  //       return;
  //     }

  //     await addItem({
  //       productId: product.productId,
  //       quantity: quantity,
  //     });

  //     // TODO:
  //     // Navigate to checkout page here.
  //     //
  //     // navigate("/checkout");
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Unable to process product",
  //     );
  //   }
  // };

  /*
   * Submit review
   */
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      //setSubmittingReview(true);
      let productReviewReq = {
        productId: product.productId,
        comment: reviewComment,
        rating: reviewRating,
      };
      let authToken = token === null ? "" : token;

      let productReviewRes = await handleAddProductReview(
        productReviewReq,
        authToken,
      );
      console.log(productReviewRes);
      if (productReviewRes?.serviceResult?.errorMsg === "") {
        let totalRating = productAvgRating * product.reviews.length;
        product.reviews.push({
          userName: "",
          comment: reviewComment,
          rating: reviewRating,
          reviewId: productReviewRes?.reviewId,
          createdAt: productReviewRes?.createdAt,
        });
        totalRating += reviewRating;
        setProductAvgRating(
          parseFloat((totalRating / product.reviews.length).toFixed(2)),
        );
        toast.success("Review submitted successfully!");
      } else {
        toast.error(productReviewRes?.serviceResult?.errorMsg);
      }

      //toast.success("Review submitted successfully!");

      setReviewRating(0);
      setReviewComment("");

      /*
       * Reload product so that the newly
       * added review is displayed.
       */
      await handleGetProduct(product.productId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* =====================================================
          PRODUCT SECTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* =================================================
              IMAGE SLIDER
          ================================================== */}

          <div>
            {/* Main Image */}
            <div className="group relative overflow-hidden rounded-3xl bg-ink-100">
              <img
                src={displayImages[selectedImage]}
                alt={`${product.prodName} - Image ${selectedImage + 1}`}
                className="aspect-rectangle w-full object-cover transition-transform duration-500"
              />

              {/* Out of stock overlay */}
              {product.quantity <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <span className="rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Previous button */}
              {displayImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-md transition-all hover:bg-white group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Next button */}
              {displayImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-md transition-all hover:bg-white group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              )}

              {/* Image counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              )}
            </div>

            {/* =================================================
                IMAGE THUMBNAILS
            ================================================== */}

            {displayImages.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-3">
                {displayImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === index
                        ? "border-brand-600"
                        : "border-transparent hover:border-ink-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.prodName} thumbnail ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />

                    {/* Selected overlay */}
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-brand-500/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="flex flex-col">
            {/* Category */}
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              {product.category}
            </span>

            {/* Product name */}
            <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              {product.prodName}
            </h1>

            {/* Brand */}
            {product.productBrand && (
              <div className="mt-2">
                <span className="text-sm text-ink-500">Brand</span>

                <p className="font-semibold text-ink-900">
                  {product.productBrand}
                </p>
              </div>
            )}

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={product.avgRating} size={18} />

              <span className="text-sm text-ink-500">
                {product.reviews?.length ?? 0} reviews
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              {product.prodDesc}
            </p>

            {/* Price */}
            <div className="mt-8">
              <span className="font-display text-4xl font-bold text-ink-900">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {product.quantity > 5 ? (
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-success-600" />

                  <span className="text-sm font-medium text-success-600">
                    In Stock
                  </span>
                </div>
              ) : product.quantity > 0 ? (
                <span className="text-sm font-semibold text-orange-600">
                  Hurry! Only {product.quantity} left in stock
                </span>
              ) : (
                <span className="text-sm font-medium text-error-500">
                  Out of Stock
                </span>
              )}
            </div>

            {/* {product.quantity > 0 && (
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-medium text-ink-700">
                  Quantity
                </span>

                <div className="flex items-center rounded-full border border-ink-200">
                 
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-l-full text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  
                  <span className="w-10 text-center text-sm font-semibold text-ink-900">
                    {quantity}
                  </span>

                  
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.quantity, prev + 1),
                      )
                    }
                    disabled={quantity >= product.quantity}
                    className="flex h-10 w-10 items-center justify-center rounded-r-full text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )} */}

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              {/* Buy Now */}
              <button
                type="button"
                //onClick={handleBuyNow}
                disabled={product.quantity <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                Buy Now
              </button>

              {/* Add to Cart */}
              <button
                type="button"
                //onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink-900 py-3.5 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink-200 pt-8">
              {[
                {
                  icon: Truck,
                  label: "Free shipping over INR 999",
                },
                {
                  icon: RotateCcw,
                  label: "30-day returns",
                },
                {
                  icon: ShieldCheck,
                  label: "2-year warranty",
                },
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
      </section>

      {/* =====================================================
          REVIEWS SECTION
      ====================================================== */}

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* =================================================
                REVIEW SUMMARY + WRITE REVIEW
            ================================================== */}

            <div>
              <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
                Customer Reviews
              </span>

              <h2 className="mt-2 font-display text-3xl font-bold text-ink-900">
                What customers say
              </h2>

              {/* Rating summary */}
              <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-ink-200">
                <div className="text-center">
                  <p className="font-display text-5xl font-bold text-ink-900">
                    {product.avgRating ? product.avgRating.toFixed(1) : "0.0"}
                  </p>

                  <div className="mt-2 flex justify-center">
                    <StarRating rating={product.avgRating} size={20} />
                  </div>

                  <p className="mt-2 text-sm text-ink-500">
                    Based on {product.reviews?.length ?? 0} reviews
                  </p>
                </div>
              </div>

              {/* Write review */}
              <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-ink-200">
                <h3 className="text-lg font-semibold text-ink-900">
                  Write a review
                </h3>

                <form onSubmit={handleSubmitReview} className="mt-5">
                  {/* Rating */}
                  <label className="text-sm font-medium text-ink-700">
                    Your rating
                  </label>

                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewRating(rating)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={26}
                          fill={
                            rating <= reviewRating ? "currentColor" : "none"
                          }
                          className={
                            rating <= reviewRating
                              ? "text-yellow-500"
                              : "text-ink-300"
                          }
                        />
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <label className="mt-5 block text-sm font-medium text-ink-700">
                    Your review
                  </label>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-ink-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* =================================================
                REVIEW LIST
            ================================================== */}

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-ink-900">
                  Customer Reviews
                </h3>

                <span className="text-sm text-ink-500">
                  {product.reviews?.length ?? 0} reviews
                </span>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {product.reviews.map((review, index) => (
                    <div
                      key={review.reviewId ?? index}
                      className="rounded-2xl bg-white p-6 ring-1 ring-ink-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-ink-900">
                            {review.userName}
                          </p>

                          <div className="mt-1">
                            <StarRating rating={review.rating} size={15} />
                          </div>
                        </div>

                        {review.createdAt && (
                          <span className="text-xs text-ink-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-ink-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-white p-10 text-center ring-1 ring-ink-200">
                  <p className="text-ink-500">No reviews yet.</p>

                  <p className="mt-1 text-sm text-ink-400">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
