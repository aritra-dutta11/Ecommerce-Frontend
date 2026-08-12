export interface Product {
  productId: string;
  prodName: string;
  prodDesc: string;
  price: number;
  quantity: number;
  category: string;
  avgRating: number;
  reviews: [ProductReview];
  images: [String];
  productBrand: string;
  primary_image: string;
}

export interface ProductReview {
  userName: string;
  comment: string;
  rating: number;
  reviewId: string;
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
