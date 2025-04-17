
import React, { createContext, useContext } from "react";
import { useCartData, CartItem } from "@/hooks/useCartData";
import { Product } from "@/hooks/useProducts";

// Define the shape of our cart context
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<CartItem[]>;
  removeFromCart: (productId: string) => Promise<CartItem[]>;
  updateQuantity: (productId: string, quantity: number) => Promise<CartItem[]>;
  clearCart: () => Promise<CartItem[]>;
  cartTotal: number;
  itemCount: number;
  loading: boolean;
  scheduledPickups: any[];  // Keep this for backward compatibility
  wallet: {  // Keep this for backward compatibility
    balance: number;
    giftCards: any[];
  };
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  } = useCartData();

  // For backward compatibility until we implement these features properly
  const scheduledPickups: any[] = [];
  const wallet = {
    balance: 0,
    giftCards: []
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        loading,
        scheduledPickups,
        wallet
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
