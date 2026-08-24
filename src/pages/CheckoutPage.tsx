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
import PaymentOptions from "@/components/PaymentOptions";
import { handleDeleteUserAddress } from "@/api/user/deleteAddress";

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
  // console.log(selectedAddressId);

  useEffect(() => {
    if (username) {
      if (cartId === "") {
        handleGetAddresses();
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

  const handleGetAddresses = async () => {
    try {
      let authToken = token ?? "";
      let res = await handleGetUserAddresses(authToken);
      if (res?.serviceResult?.success) {
        setAddresses(res?.addressList);
      } else {
        console.log(res?.serviceResult?.errorMsg);
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

      if (addressForm.phoneNo.length !== 10) {
        errorMsg += "Invalid Phone No.!";
      }
      if (errorMsg === "") {
        //API CALL
        addressForm.phoneNo = "+91" + addressForm.phoneNo;
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
        addressForm.phoneNo = addressForm.phoneNo.substring(3);
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
    let success = true;
    let errorMsg = "";

    try {
      setAddresses(addresses.filter((add) => add.addressId !== id));
      let authToken = token ?? "";
      let req = { addressId: id };
      let res = await handleDeleteUserAddress(req, authToken);
      if (!res?.serviceResult.success) {
        errorMsg += res?.serviceResult.errorMsg;
        success = false;
      }
    } catch (error) {}
    return { success, errorMsg };
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
            selectedAddressId={selectedAddressId}
            onAddressIdChange={setSelectedAddressId}
          />

          {/* =================================================
              PAYMENT METHOD
          ================================================= */}
          <PaymentOptions
            serialNo={2}
            walletAmt={walletAmt}
            totalAmount={totalAmount}
          />

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
