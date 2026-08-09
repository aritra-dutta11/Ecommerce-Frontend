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
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./AppRouter";
import { Toaster } from "react-hot-toast";

function AppContent() {
  const location = useLocation();
  const showHeaderFooter =
    location.pathname !== "/auth" && location.pathname !== "/adminauth";
  return (
    <div className="flex min-h-screen flex-col">
      {showHeaderFooter && <Header />}
      <AppRoutes />
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
