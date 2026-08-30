export interface Product {
  productId: string;
  prodName: string;
  prodDesc: string;
  price: number;
  quantity: number;
  category: string;
  avgRating: number;
  reviews: ProductReview[];
  images: string[];
  productBrand: string;
  primary_image: string;
}

export interface ProductReview {
  userName: string;
  comment: string;
  rating: number;
  reviewId: string;
  createdAt: string;
}

export interface CartProduct extends Product {
  maxQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AddToCart {
  prodId: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  categoryImage: string;
}

export interface CategoryFormData {
  categoryName: string;
  categoryDesc: string;
  image: File | null;
}

export interface ProductFormData {
  productName: string;
  productDesc: string;
  price: string;
  category: string;
  brand: string;
  quantity: string;
  images: File[];
}

export interface Address {
  addressId: string;
  houseNo: string;
  streetName: string;
  cityOrTown: string;
  district: string;
  country: string;
  pincode: string;
  phoneNo: string;
  stateName: string;
  addressLabel: string;
  addressOwnerName: string;
}

export interface AddressForm {
  houseNo: string;
  streetName: string;
  cityOrTown: string;
  district: string;
  country: string;
  pincode: string;
  phoneNo: string;
  stateName: string;
  addressLabel: string;
  addressOwnerName: string;
}

export class PlaceOrderRequest {
  paymentMode: string = "";
  cartId: string = "";
  addressId: string = "";
  walletDetails: WalletDetails = new WalletDetails();
}

export class WalletDetails {
  walletId: string = "";
}

export type PaymentMethod = "card" | "upi" | "netbanking" | "cod" | "wallet";
