import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { useEffect, useRef, useState } from "react";
import { CartProduct, Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { handleGetCartResponse } from "@/api/cart/getCart";
import toast from "react-hot-toast";
import { handleUpdateCart } from "@/api/cart/updateCart";
import { handleDeleteCart } from "@/api/cart/deleteCart";

export default function CartPage() {
  const navigate = useNavigate();
  const { token, userId } = useAuth();

  const [totalItems, setTotalItems] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [cartId, setCartId] = useState("");
  const quantityTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  useEffect(() => {
    handleGetCartProducts();
  }, [token]);

  const handleGetCartProducts = async () => {
    try {
      const authToken = token ?? "";

      const response = await handleGetCartResponse(authToken);

      if (response.serviceResult.errorMsg === "") {
        setCartProducts(response?.cartProductList ?? []);
        setTotalItems(
          response?.cartProductList?.reduce(
            (total, product) => total + product.quantity,
            0,
          ) ?? 0,
        );
        setCartId(response?.cartId ?? "");
      } else {
        console.log(response.serviceResult.errorMsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductQuantityUpdate = async (
    product: CartProduct,
    updatedQuantity: number,
  ) => {
    try {
      let updateCartReq = {
        prodId: product.productId,
        cartId: cartId,
        quantity: updatedQuantity,
      };
      let authToken = token ?? "";
      let updateCartResponse = await handleUpdateCart(updateCartReq, authToken);
      if (!updateCartResponse.serviceResult.success) {
        toast.error(updateCartResponse.serviceResult.errorMsg);
        await handleGetCartProducts();
      }
    } catch (error) {
      toast.error((error as Error).message);
      await handleGetCartProducts();
    }
  };

  const handleQuantityChange = (
    updatedQuantity: number,
    product: CartProduct,
  ) => {
    if (updatedQuantity < 1) {
      if (quantityTimers.current[product.productId]) {
        clearTimeout(quantityTimers.current[product.productId]);
      }
      handleRemoveItem(product);
      return;
    }

    if (updatedQuantity > product.maxQuantity) {
      return;
    }

    setCartProducts((prev) => {
      const currentProduct = prev.find(
        (item) => item.productId === product.productId,
      );

      if (!currentProduct) {
        return prev;
      }

      const difference = updatedQuantity - currentProduct.quantity;

      setTotalItems((total) => total + difference);

      return prev.map((item) =>
        item.productId === product.productId
          ? { ...item, quantity: updatedQuantity }
          : item,
      );
    });

    if (quantityTimers.current[product.productId]) {
      clearTimeout(quantityTimers.current[product.productId]);
    }

    quantityTimers.current[product.productId] = setTimeout(() => {
      handleProductQuantityUpdate(product, updatedQuantity);
      //console.log(updatedQuantity);
    }, 1000);
  };

  const handleRemoveItem = async (product: CartProduct) => {
    //removeItem(productId);
    try {
      let updateCartReq = {
        prodId: product.productId,
        cartId: cartId,
        quantity: 0,
      };
      let authToken = token ?? "";
      let updateCartResponse = await handleUpdateCart(updateCartReq, authToken);
      if (!updateCartResponse.serviceResult.success) {
        toast.error(updateCartResponse.serviceResult.errorMsg);
      } else {
        setCartProducts((prev) =>
          prev.filter((item) => item.productId !== product.productId),
        );
        toast.success("Product removed from Cart!");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearCart = async () => {
    // clearCart();
    try {
      let deleteCartReq = { cartId: cartId };
      let authToken = token ?? "";
      let deleteCartRes = await handleDeleteCart(deleteCartReq, authToken);
      if (!deleteCartRes?.serviceResult?.success) {
        toast.error(deleteCartRes?.serviceResult?.errorMsg);
      } else {
        toast.success("Cart has been cleared!");
        setCartProducts([]);
        setTotalItems(0);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  /*
   * ORDER SUMMARY
   */
  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;

  const total = subtotal + shipping;

  /*
   * EMPTY CART
   */
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-ink-50">
        <section className="border-b border-ink-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Shopping Bag
            </span>

            <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Your Cart
            </h1>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <ShoppingBag size={42} strokeWidth={1.5} />
            </div>

            <h2 className="mt-7 font-display text-2xl font-bold text-ink-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Looks like you haven't added anything to your cart yet. Discover
              our collection and find something you'll love.
            </p>

            <button
              onClick={() => navigate(`/products/all/${userId}`)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Start Shopping
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
                Shopping Bag
              </span>

              <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-ink-500">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your
                shopping bag
              </p>
            </div>

            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-ink-500 transition-colors hover:text-red-600 sm:self-auto"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CART CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="space-y-4">
            {cartProducts.map((product) => (
              <div
                key={product.productId}
                className="overflow-hidden rounded-2xl border border-ink-200 bg-white transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-col gap-5 p-4 sm:flex-row sm:p-5">
                  {/* Product Image */}

                  <button
                    onClick={() => navigate(`/product/${product.productId}`)}
                    className="h-28 w-full flex-shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:h-32 sm:w-32"
                  >
                    <img
                      src={product.primary_image}
                      alt={product.prodName}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </button>

                  {/* Product Details */}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                          {product.category}
                        </span>

                        <button
                          onClick={() =>
                            navigate(`/product/${product.productId}`)
                          }
                          className="mt-1 block truncate text-left font-display text-lg font-semibold text-ink-900 transition-colors hover:text-brand-600"
                        >
                          {product.prodName}
                        </button>

                        {product.productBrand && (
                          <span className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {product.productBrand}
                          </span>
                        )}
                      </div>

                      {/* Remove */}

                      <button
                        onClick={() => handleRemoveItem(product)}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${product.prodName}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* Bottom */}

                    <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
                      {/* Quantity */}

                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
                          Quantity
                        </p>

                        <div className="flex h-10 w-fit items-center rounded-full border border-ink-200">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.quantity - 1,
                                product,
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-l-full text-ink-600 transition-colors hover:bg-ink-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-10 text-center text-sm font-semibold text-ink-900">
                            {product.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.quantity + 1,
                                product,
                              )
                            }
                            disabled={product.quantity >= product.maxQuantity}
                            className="flex h-10 w-10 items-center justify-center rounded-r-full text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-ink-400">
                          {formatPrice(product.price)} each
                        </p>

                        <p className="mt-1 text-xl font-bold text-ink-900">
                          {formatPrice(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
              {/* Summary Header */}

              <div className="border-b border-ink-200 px-6 py-5">
                <h2 className="font-display text-xl font-bold text-ink-900">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-ink-500">
                  Review your order before checkout
                </p>
              </div>

              {/* Summary Details */}

              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">Subtotal</span>

                  <span className="font-medium text-ink-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">Shipping</span>

                  {shipping === 0 ? (
                    <span className="font-medium text-green-600">FREE</span>
                  ) : (
                    <span className="font-medium text-ink-900">
                      {formatPrice(shipping)}
                    </span>
                  )}
                </div>

                {subtotal > 0 && subtotal < 999 && (
                  <div className="rounded-xl bg-brand-50 px-4 py-3">
                    <p className="text-xs leading-relaxed text-brand-700">
                      Add{" "}
                      <span className="font-semibold">
                        {formatPrice(999 - subtotal)}
                      </span>{" "}
                      more to get free shipping.
                    </p>
                  </div>
                )}

                <div className="border-t border-ink-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-ink-900">
                      Total
                    </span>

                    <span className="font-display text-2xl font-bold text-ink-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-600"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate(`/products/all/${userId}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 px-6 py-3.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-500 hover:text-brand-600"
                >
                  <ArrowLeft size={17} />
                  Continue Shopping
                </button>
              </div>

              {/* Benefits */}

              <div className="border-t border-ink-200 bg-ink-50 px-6 py-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <Truck size={18} className="text-ink-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-900">
                        Free Shipping
                      </p>

                      <p className="text-xs text-ink-500">
                        On orders over INR 999
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <ShieldCheck size={18} className="text-ink-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-900">
                        Secure Payment
                      </p>

                      <p className="text-xs text-ink-500">
                        Your payment is protected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <RotateCcw size={18} className="text-ink-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-900">
                        Easy Returns
                      </p>

                      <p className="text-xs text-ink-500">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
