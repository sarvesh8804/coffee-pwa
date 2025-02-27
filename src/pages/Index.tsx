
import React from "react";
import { CartProvider } from "@/context/CartContext";
import Home from "./Home";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Home />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
