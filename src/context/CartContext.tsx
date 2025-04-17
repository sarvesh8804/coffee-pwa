
import React, { createContext, useContext } from "react";
import { useCartData, CartItem } from "@/hooks/useCartData";
import { Product } from "@/hooks/useProducts";
import { usePickups } from "@/hooks/usePickups";
import { useWallet } from "@/hooks/useWallet";
import { useGiftCards } from "@/hooks/useGiftCards";

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
  schedulePickup: (date: Date, time: string, items: CartItem[]) => void;
  scheduledPickups: any[];
  wallet: {
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
  
  const { createPickup } = usePickups();
  const { balance } = useWallet();
  const { giftCards } = useGiftCards();

  // Implementation of schedulePickup
  const schedulePickup = (date: Date, time: string, items: CartItem[]) => {
    // Format date to string format expected by the API
    const formattedDate = date.toISOString().split('T')[0];
    
    // Convert CartItem[] to PickupItem[] format
    const pickupItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    
    // Call the createPickup function from usePickups
    // This will now handle the wallet payment internally
    return createPickup({ date: formattedDate, time, items: pickupItems });
  };

  // For backward compatibility until we implement these features properly
  const scheduledPickups: any[] = [];
  const wallet = {
    balance: balance || 0,
    giftCards: giftCards || []
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
        schedulePickup,
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
