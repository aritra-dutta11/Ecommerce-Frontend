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

interface CheckoutPageProps {
  // onBack: () => void;
  // onComplete: () => void;
  // onSignIn: () => void;
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

const EMPTY_ADDRESS: AddressForm = {
  houseNo: "",
  streetName: "",
  cityOrTown: "",
  district: "",
  country: "",
  pincode: "",
  phoneNo: "",
  stateName: "",
  addressLabel: "",
  addressOwnerName: "",
};

export default function CheckoutPage(
  {
    // onBack,
    // onComplete,
    // onSignIn,
  }: CheckoutPageProps,
) {
  const { username, userId } = useAuth();

  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  //let subtotal = 0;

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addressSaveError, setAddressSaveError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  const [savingAddress, setSavingAddress] = useState(false);

  const [addressError, setAddressError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [upiId, setUpiId] = useState("");

  const [bank, setBank] = useState("");

  const [placing, setPlacing] = useState(false);

  const [done, setDone] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [walletAmt, setWalletAmt] = useState(0.0);
  const [cartId, setCartId] = useState("");
  const { token } = useAuth();
  // const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountWithoutShipping, setTotalAmountWithoutShipping] =
    useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingLimit, setShippingLimit] = useState(0);

  let totalAmount = totalAmountWithoutShipping + shippingPrice;

  useEffect(() => {
    if (username) {
      if (cartId === "") {
        getUserWallet();
        handleGetCartProducts();
      }

      if (cartId !== "") {
        handleGetCheckoutDetails();
      }
    }
  }, [cartId]);
  //console.log(totalAmount);

  const handleGetCheckoutDetails = async () => {
    try {
      let req = { cartId: cartId };
      const authToken = token ?? "";
      const response = await getCheckoutDetails(req, authToken);
      if (response.serviceResult.success) {
        setTotalAmountWithoutShipping(response?.totalAmt);
        setShippingLimit(response?.shippingChargesLimit);
        setShippingPrice(
          response?.totalAmt >= response?.shippingChargesLimit
            ? 0
            : response?.shippingCharges,
        );
      } else {
        console.log(response.serviceResult.errorMsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCartProducts = async () => {
    try {
      const authToken = token ?? "";

      const response = await handleGetCartResponse(authToken);

      if (response.serviceResult.errorMsg === "") {
        setCartProducts(response?.cartProductList ?? []);
        // setTotalItems(
        //   response?.cartProductList?.reduce(
        //     (total, product) => total + product.quantity,
        //     0,
        //   ) ?? 0,
        // );
        setCartId(response?.cartId ?? "");
      } else {
        console.log(response.serviceResult.errorMsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserWallet = async () => {
    try {
      let authToken = token ?? "";
      let getUserWalletRes = await handleGetWalletResponse(authToken);
      if (getUserWalletRes?.serviceResult?.success) {
        setWalletAmt(getUserWalletRes?.amount);
        setWalletId(getUserWalletRes?.walletId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressSubmit = async (addressForm: AddressForm) => {
    console.log(addressForm);
    let success = true;
    let errorMsg = "";
    try {
      if (addressForm.addressOwnerName === "") {
        errorMsg += "Full Name cannot be blank!";
      }
      if (addressForm.houseNo === "") {
        errorMsg += "House/Apartment No. cannot be blank!";
      }

      if (addressForm.streetName === "") {
        errorMsg += "Street Name cannot be blank!";
      }

      if (addressForm.cityOrTown === "") {
        errorMsg += "City Name cannot be blank!";
      }

      if (addressForm.stateName === "") {
        errorMsg += "State Name cannot be blank!";
      }

      if (addressForm.pincode === "") {
        errorMsg += "Pincode cannot be blank!";
      }

      if (addressForm.phoneNo === "") {
        errorMsg += "Phone No. cannot be blank!";
      }
      if (errorMsg === "") {
        //API CALL
        let authToken = token ?? "";
        let res = await handleSaveAddress(addressForm, authToken);
        //console.log(res);
        if (!res.serviceResult.success) {
          success = false;
          errorMsg = res.serviceResult.errorMsg;
        }
      }
      if (errorMsg !== "") {
        success = false;
      }
      if (success) {
        setAddresses([
          ...addresses,
          { ...addressForm, addressId: Math.random() + "" },
        ]);
      }
    } catch (error) {
      success = false;
      errorMsg = (error as Error).message;
    }

    return { success, errorMsg };
  };

  const handleDeleteAddress = async (id: string) => {
    //console.log(id);
    setAddresses(addresses.filter((add) => add.addressId !== id));
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) return;

    setPlacing(true);

    await new Promise((r) => setTimeout(r, 1200));

    setPlacing(false);

    setDone(true);
  };

  if (done) {
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
          {/* {email || "your inbox"}. */}
        </p>

        <div className="mt-6 rounded-2xl bg-white px-6 py-4 ring-1 ring-ink-200">
          <p className="text-sm text-ink-500">Payment Method</p>

          <p className="font-display text-lg font-semibold text-ink-900">
            {PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label}
          </p>
        </div>

        <button className="mt-8 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Your cart is empty
        </h1>

        <p className="mt-2 text-ink-500">
          Add some products before checking out.
        </p>

        <button className="mt-6 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">
        Checkout
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-[680px_400px] gap-8"
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="space-y-6">
          {/* =================================================
              SHIPPING ADDRESS
          ================================================= */}
          <ShippingAddress
            serialNo={1}
            addresses={addresses}
            onSubmit={handleAddressSubmit}
            onDelete={handleDeleteAddress}
          />

          {/* <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  1
                </span>

                <h2 className="font-display text-xl font-semibold text-ink-900">
                  Shipping Address
                </h2>
              </div>

              {username && addresses.length > 0 && !showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  <Plus size={16} />
                  Add New
                </button>
              )}
            </div>

            {!username ? (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-ink-50 px-6 py-8 text-center">
                <MapPin size={28} className="text-ink-400" />

                <p className="text-sm text-ink-600">
                  Sign in to save and select your addresses.
                </p>

                <button
                  type="button"
                  className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Sign In
                </button>
              </div>
            ) : showAddressForm ? (
              <div className="rounded-xl border border-ink-200 p-5 animate-fade-in">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-ink-900">
                    Add New Address
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-ink-400 hover:text-ink-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                {addressSaveError !== "" && (
                  <div className="mb-4 flex items-center justify-between">
                    <span>{addressSaveError}</span>
                  </div>
                )}

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={addressForm.addressLabel}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          addressLabel: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    >
                      <option>Home</option>
                      <option>Office</option>
                      <option>Other</option>
                    </select>

                    <input
                      required
                      placeholder="Full name"
                      value={addressForm.addressOwnerName}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          addressOwnerName: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="House/Apartment No."
                      value={addressForm.houseNo}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          full_name: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />

                    <input
                      required
                      placeholder="Street Name"
                      value={addressForm.streetName}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          full_name: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="City"
                      value={addressForm.cityOrTown}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          cityOrTown: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />

                    <input
                      placeholder="District"
                      value={addressForm.stateName}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          district: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="State / Province"
                      value={addressForm.stateName}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          stateName: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />

                    <input
                      required
                      placeholder="Country"
                      value={addressForm.cityOrTown}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          cityOrTown: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Pincode"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          pincode: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />

                    <input
                      placeholder="Phone"
                      value={addressForm.phoneNo}
                      onChange={(e) =>
                        setAddressForm((f) => ({
                          ...f,
                          phoneNo: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  {addressError && (
                    <p className="text-sm font-medium text-error-600">
                      {addressError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddressSubmit}
                      disabled={savingAddress}
                      className="flex-1 rounded-full bg-ink-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                    >
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-ink-50 px-6 py-8 text-center">
                <MapPin size={28} className="text-ink-400" />

                <p className="text-sm text-ink-600">No saved addresses yet.</p>

                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.addressId}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-all ${
                      selectedAddressId === addr.addressId
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                        : "border-ink-200 hover:border-ink-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.addressId}
                      onChange={() => setSelectedAddressId(addr.addressId)}
                      className="mt-1 accent-brand-600"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="mt-1.5 font-medium text-ink-900">
                        {addr.streetName}
                      </p>

                      <p className="text-sm text-ink-500">
                        {addr.streetName}, {addr.cityOrTown}
                        {addr.stateName ? `, ${addr.stateName}` : ""}{" "}
                        {addr.pincode}
                      </p>

                      {addr.phoneNo && (
                        <p className="text-sm text-ink-400">{addr.phoneNo}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAddress(addr.addressId);
                      }}
                      className="self-start text-ink-400 transition-colors hover:text-error-500"
                      aria-label="Delete address"
                    >
                      <Trash2 size={18} />
                    </button>
                  </label>
                ))}
              </div>
            )}
          </section> */}

          {/* =================================================
              PAYMENT METHOD
          ================================================= */}

          <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                3
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
                    <p className="truncate font-medium text-ink-900">
                      {opt.label}
                    </p>

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

          {/* =================================================
              PLACE ORDER
          ================================================= */}

          <button
            type="submit"
            disabled={
              placing ||
              !selectedAddressId ||
              (paymentMethod === "wallet" && walletAmt < totalAmount)
            }
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placing ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Lock size={16} />
                Place Order — {formatPrice(totalAmount)}
              </>
            )}
          </button>

          {!selectedAddressId && username && (
            <p className="text-center text-sm text-error-600">
              Please select or add a shipping address.
            </p>
          )}
        </div>

        {/* =====================================================
            ORDER SUMMARY
        ====================================================== */}

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">
              Order Summary
            </h2>

            <div className="flex max-h-64 flex-col gap-4 overflow-y-auto">
              {cartProducts.map((product) => (
                <div key={product.productId} className="flex min-w-0 gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                    <img
                      src={product.primary_image}
                      alt={product.prodName}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-xs font-semibold text-white">
                      {product.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {product.prodName}
                    </p>

                    <p className="text-xs text-ink-500">
                      {formatPrice(product.price)} each
                    </p>
                  </div>

                  <span className="shrink-0 self-center text-sm font-semibold text-ink-900">
                    {formatPrice(product.price * product.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-5 space-y-2 border-t border-ink-200 pt-4">
              <div className="flex justify-between text-sm text-ink-500">
                <span>Subtotal</span>

                <span>{formatPrice(totalAmount)}</span>
              </div>

              <div className="flex justify-between text-sm text-ink-500">
                <span>Shipping</span>

                <span>
                  {shippingPrice === 0 ? "Free" : formatPrice(shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between border-t border-ink-200 pt-3">
                <span className="font-display text-lg font-semibold text-ink-900">
                  Total
                </span>

                <span className="font-display text-lg font-semibold text-ink-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-ink-200 pt-4 text-xs text-ink-400">
              <ShieldCheck size={14} />
              Secure checkout — your data is encrypted
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
