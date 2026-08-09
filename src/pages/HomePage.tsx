import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import type { Category, Product } from "@/types";
import UserHomePage from "./UserHomePage";

interface HomePageProps {
  categories: Category[];
  loading: boolean;
  admin: boolean;
  //onView: (product: Product) => void;
  //onShopAll: () => void;
}

export default function HomePage({
  categories,
  loading,
  admin,
  //onView,
  //onShopAll,
}: HomePageProps) {
  //const featured = products.filter((p) => p.featured).slice(0, 4);
  // const bestsellers = [...products]
  //   .sort((a, b) => b.reviews_count - a.reviews_count)
  //   .slice(0, 8);
  //console.log(categories);

  return (
    <>
      {admin == true ? (
        <UserHomePage categories={categories} loading={loading} />
      ) : (
        <UserHomePage categories={categories} loading={loading} />
      )}
    </>
  );
}
