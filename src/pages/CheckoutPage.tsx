import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CheckoutPage({
  onBack,
  onComplete,
}: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"info" | "payment" | "done">("info");
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const shipping = subtotal > 75 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "info") {
      setStep("payment");
    } else {
      clearCart();
      setStep("done");
      setTimeout(onComplete, 2500);
    }
  };

  if (step === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-500 text-white">
          <Check size={40} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-ink-500">
          Thank you for your purchase. A confirmation email has been sent to{" "}
          {form.email || "your inbox"}.
        </p>
        <button
          onClick={onComplete}
          className="mt-8 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink-500">
          Add some products before checking out.
        </p>
        <button
          onClick={onBack}
          className="mt-6 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === "info" ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"}`}
              >
                1
              </span>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Contact & Shipping
              </h2>
            </div>
            <div className="grid gap-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={update("email")}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={update("firstName")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={update("lastName")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <input
                required
                placeholder="Street address"
                value={form.address}
                onChange={update("address")}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={update("city")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={update("zip")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition-opacity ${step === "payment" ? "opacity-100" : "pointer-events-none opacity-50"}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === "payment" ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"}`}
              >
                2
              </span>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Payment
              </h2>
            </div>
            <div className="grid gap-4">
              <div className="relative">
                <input
                  required
                  placeholder="Card number"
                  value={form.cardNumber}
                  onChange={update("cardNumber")}
                  className="w-full rounded-xl border border-ink-200 px-4 py-3 pr-12 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <CreditCard
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="MM / YY"
                  value={form.expiry}
                  onChange={update("expiry")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  placeholder="CVC"
                  value={form.cvc}
                  onChange={update("cvc")}
                  className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {step === "info" ? (
              "Continue to Payment"
            ) : (
              <>
                <Lock size={16} /> Place Order — {formatPrice(total)}
              </>
            )}
          </button>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">
              Order Summary
            </h2>
            <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-ink-100">
                    <img
                      src={item.product.primary_image}
                      alt={item.product.prodName}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-xs font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium text-ink-900">
                      {item.product.prodName}
                    </p>
                    <p className="text-xs text-ink-500">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                  <span className="self-center text-sm font-semibold text-ink-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-ink-200 pt-4">
              <div className="flex justify-between text-sm text-ink-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-500">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-3">
                <span className="font-display text-lg font-semibold text-ink-900">
                  Total
                </span>
                <span className="font-display text-lg font-semibold text-ink-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
