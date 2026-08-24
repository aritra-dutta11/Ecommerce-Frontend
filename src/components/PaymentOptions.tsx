import { useState, useEffect, useCallback, use } from "react";
import {
  ArrowLeft,
  Check,
  Lock,
  Plus,
  MapPin,
  Trash2,
  CreditCard,
  Wallet,
  Landmark,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";
import type { Address, AddressForm, CartProduct, Product } from "@/types";
import UpiQr from "@/components/UpiQr";
import { handleGetWalletResponse } from "@/api/user/getWallet";
import { handleGetCartResponse } from "@/api/cart/getCart";
import { getCheckoutDetails } from "@/api/order/getCheckoutDetails";
import ShippingAddress from "@/components/ShippingAddress";
import { handleSaveAddress } from "@/api/user/saveAddress";
import { handleGetUserAddresses } from "@/api/user/getUserAddresses";

interface PaymentOptions {
  serialNo: number;
  walletAmt: number;
  totalAmount: number;
}

type PaymentMethod = "card" | "upi" | "netbanking" | "cod" | "wallet";

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, Amex",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Wallet",
    desc: "Pay using your wallet balance",
    icon: Wallet,
  },
  {
    id: "upi",
    label: "UPI",
    desc: "Pay using any UPI app",
    icon: Wallet,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    desc: "All major banks supported",
    icon: Landmark,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when you receive",
    icon: Truck,
  },
];

const PaymentOptions = ({
  walletAmt,
  serialNo,
  totalAmount,
}: PaymentOptions) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [upiId, setUpiId] = useState("");

  const [bank, setBank] = useState("");
  return (
    <div>
      <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-ink-200">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {serialNo}
          </span>

          <h2 className="font-display text-xl font-semibold text-ink-900">
            Payment Method
          </h2>
        </div>

        {/* Payment Options */}
        <div className="grid w-full min-w-0 gap-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex w-full min-w-0 cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                paymentMethod === opt.id
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                  : "border-ink-200 hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === opt.id}
                onChange={() => setPaymentMethod(opt.id)}
                className="shrink-0 accent-brand-600"
              />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-ink-200">
                <opt.icon size={20} className="text-ink-700" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">{opt.label}</p>

                <p className="truncate text-sm text-ink-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* =================================================
                  CARD
              ================================================= */}

        {paymentMethod === "card" && (
          <div className="mt-4 grid w-full min-w-0 gap-4 rounded-xl bg-ink-50 p-4 animate-fade-in">
            <div className="relative min-w-0">
              <input
                required
                placeholder="Card number"
                value={cardForm.number}
                onChange={(e) =>
                  setCardForm((f) => ({
                    ...f,
                    number: e.target.value,
                  }))
                }
                className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />

              <CreditCard
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
            </div>

            <input
              required
              placeholder="Name on card"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm((f) => ({
                  ...f,
                  name: e.target.value,
                }))
              }
              className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            <div className="grid min-w-0 grid-cols-2 gap-4">
              <input
                required
                placeholder="MM / YY"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm((f) => ({
                    ...f,
                    expiry: e.target.value,
                  }))
                }
                className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />

              <input
                required
                placeholder="CVC"
                value={cardForm.cvc}
                onChange={(e) =>
                  setCardForm((f) => ({
                    ...f,
                    cvc: e.target.value,
                  }))
                }
                className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        )}

        {/* =================================================
      WALLET
  ================================================= */}
        {paymentMethod === "wallet" && (
          <div className="mt-4 w-full min-w-0 rounded-xl bg-ink-50 p-4 animate-fade-in">
            <div className="flex items-center justify-between rounded-xl bg-white p-4 ring-1 ring-ink-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <Wallet size={20} className="text-brand-600" />
                </div>

                <div>
                  <p className="font-medium text-ink-900">Wallet Balance</p>

                  <p className="text-sm text-ink-500">Available balance</p>
                </div>
              </div>

              <span className="font-display text-lg font-semibold text-ink-900">
                {formatPrice(walletAmt)}
              </span>
            </div>

            {walletAmt >= totalAmount ? (
              <div className="mt-3 rounded-xl bg-success-500/10 px-4 py-3">
                <p className="text-sm font-medium text-success-600">
                  You have enough wallet balance to complete this payment.
                </p>
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-error-500/10 px-4 py-3">
                <p className="text-sm font-medium text-error-600">
                  Insufficient wallet balance.
                </p>

                <p className="mt-1 text-xs text-error-500">
                  You need {formatPrice(totalAmount - walletAmt)} more to
                  complete this payment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =================================================
                  UPI
              ================================================= */}

        {paymentMethod === "upi" && (
          <div className="mt-4 w-full min-w-0 rounded-xl bg-ink-50 p-4 animate-fade-in">
            <input
              required
              placeholder="Enter UPI ID (e.g. name@bank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-ink-200">
              <UpiQr amount={totalAmount} />
            </div>
          </div>
        )}

        {/* =================================================
                  NET BANKING
              ================================================= */}

        {paymentMethod === "netbanking" && (
          <div className="mt-4 w-full min-w-0 rounded-xl bg-ink-50 p-4 animate-fade-in">
            <select
              required
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Select your bank</option>

              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>Bank of America</option>
              <option>Chase Bank</option>
              <option>Wells Fargo</option>
            </select>
          </div>
        )}

        {/* =================================================
                  COD
              ================================================= */}

        {paymentMethod === "cod" && (
          <div className="mt-4 flex w-full min-w-0 items-center gap-3 rounded-xl bg-ink-50 p-4 animate-fade-in">
            <Truck size={20} className="shrink-0 text-ink-600" />

            <p className="min-w-0 text-sm text-ink-600">
              Pay {formatPrice(totalAmount)} in cash when your order is
              delivered.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaymentOptions;
