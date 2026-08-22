import { useState } from "react";
import {
  Plus,
  MapPin,
  Trash2,
  CreditCard,
  Wallet,
  Landmark,
  Truck,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Address, CartProduct, Product } from "@/types";

type PaymentMethod = "card" | "upi" | "netbanking" | "cod" | "wallet";

type AddressForm = Omit<Address, "addressId" | "is_default">;

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
  addressLabel: "Home",
  addressOwnerName: "",
};

interface OnSubmitResponse {
  success: boolean;
  errorMsg: string;
}

interface ShippingAddressProps {
  addresses: Address[];
  serialNo: number;
  onSubmit: (
    data: AddressForm,
  ) => Promise<{ success: boolean; errorMsg: string }>;
  onDelete: (addressId: string) => Promise<boolean>;
}

const ShippingAddress = ({
  serialNo,
  onSubmit,
  addresses,
  onDelete,
}: ShippingAddressProps) => {
  const { username, userId } = useAuth();
  const [addressSaveError, setAddressSaveError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  const [savingAddress, setSavingAddress] = useState(false);

  const [addressError, setAddressError] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { success, errorMsg } = await onSubmit(addressForm);
      //console.log(success);
      if (success) {
        setAddressError("");
        setAddressForm(EMPTY_ADDRESS);
        setShowAddressForm(false);
      } else {
        setAddressError(errorMsg);
      }
    } catch (error) {
      console.error("Error while adding address:", error);
    }
    setSavingAddress(false);
  };

  const handleDelete = async (addressId: string) => {
    try {
      const success = await onDelete(addressId);
    } catch (error) {
      console.error("Error while delete address:", error);
    }
  };

  return (
    <div>
      <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {serialNo}
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
              <h3 className="font-semibold text-ink-900">Add New Address</h3>

              <button
                type="button"
                onClick={() => {
                  (setShowAddressForm(false), setAddressError(""));
                }}
                className="text-ink-400 hover:text-ink-600"
              >
                <X size={18} />
              </button>
            </div>
            {addressError !== "" && (
              <div className="mb-4 flex items-center justify-between text-sm font-medium text-error-600">
                <span>{addressError}</span>
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
                      houseNo: e.target.value,
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
                      streetName: e.target.value,
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
                  value={addressForm.district}
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
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm((f) => ({
                      ...f,
                      country: e.target.value,
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
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
                    {addr.stateName ? `, ${addr.stateName}` : ""} {addr.pincode}
                  </p>

                  {addr.phoneNo && (
                    <p className="text-sm text-ink-400">{addr.phoneNo}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(addr.addressId);
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
      </section>
    </div>
  );
};

export default ShippingAddress;
