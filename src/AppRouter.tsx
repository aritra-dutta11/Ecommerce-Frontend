import { Routes, Route, useLocation } from "react-router-dom";

import { useState, useEffect, useCallback } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import { handleGetCategories } from "./api/category/getCategory";
import { BrowserRouter } from "react-router-dom";
import AdminAuthPage from "./pages/AdminAuthPage";
import AdminHomePage from "./pages/AdminHomePage";
import { handleGetProducts } from "./api/products/getProducts";
import AdminProductsPage from "./pages/AdminProductsPage";

type Page = "home" | "shop" | "product" | "checkout" | "auth";

export default function AppRoutes() {
  const [page, setPage] = useState<Page>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { closeCart } = useCart();
  const { admin } = useAuth();

  const fetchCategories = useCallback(async () => {
    setLoading(true);

    let getCategoriesRes = await handleGetCategories();
    //console.log(getCategoriesRes);
    if (getCategoriesRes?.serviceResult?.errorMsg === "") {
      //console.log("Cat List - ", getCategoriesRes);
      setCategories(getCategoriesRes?.categoryList);
    }
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let getProdList = await handleGetProducts(1);
    //console.log(getCategoriesRes);
    if (getProdList?.serviceResult?.errorMsg === "") {
      //console.log("Cat List - ", getCategoriesRes);
      setProducts(getProdList?.prodList);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  //console.log("Categories - ", categories);
  const showHeader = page !== "auth";
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            categories={categories}
            loading={loading}
            products={products}
          />
        }
      />
      <Route
        path="/dashboard/:adminId"
        element={
          <AdminHomePage
            categories={categories}
            loading={loading}
            admin={admin}
            products={products}
          />
        }
      />
      {/* <Route path="/shop" element={<ShopPage />} /> */}
      {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/adminauth" element={<AdminAuthPage />} />
      <Route
        path="/admin/products"
        element={<AdminProductsPage categories={categories} />}
      />
    </Routes>
  );
}
