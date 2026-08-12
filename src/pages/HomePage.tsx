import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import type { Category, Product } from "@/types";
import UserHomePage from "./UserHomePage";
import AdminHomePage from "./AdminHomePage";

interface HomePageProps {
  categories: Category[];
  loading: boolean;
  products: Product[];
  //onView: (product: Product) => void;
  //onShopAll: () => void;
}

export default function HomePage({
  categories,
  loading,
  products,
  //onView,
  //onShopAll,
}: HomePageProps) {
  //const featured = products.filter((p) => p.featured).slice(0, 4);
  // const bestsellers = [...products]
  //   .sort((a, b) => b.reviews_count - a.reviews_count)
  //   .slice(0, 8);
  //console.log(categories);
  // console.log("Admin - ", admin);

  return (
    <>
      <UserHomePage
        categories={categories}
        loading={loading}
        products={products}
      />
    </>
  );
}
