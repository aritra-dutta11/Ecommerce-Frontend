export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
