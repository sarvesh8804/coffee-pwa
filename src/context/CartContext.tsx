
import React, { createContext, useContext, useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type GiftCard = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  createdAt: Date;
  expiresAt: Date;
};

type WalletBalance = {
  amount: number;
  giftCards: GiftCard[];
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  wallet: WalletBalance;
  addToWallet: (amount: number) => void;
  addGiftCard: (giftCard: GiftCard) => void;
  useGiftCard: (cardId: string, amount: number) => boolean;
  schedulePickup: (date: Date, time: string, items: CartItem[]) => void;
  scheduledPickups: Array<{
    id: string;
    date: Date;
    time: string;
    items: CartItem[];
    total: number;
    status: "pending" | "ready" | "completed" | "cancelled";
  }>;
  cancelPickup: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wallet, setWallet] = useState<WalletBalance>({
    amount: 0,
    giftCards: [],
  });
  const [scheduledPickups, setScheduledPickups] = useState<
    CartContextType["scheduledPickups"]
  >([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedWallet = localStorage.getItem("wallet");
    const savedPickups = localStorage.getItem("pickups");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWallet) setWallet(JSON.parse(savedWallet));
    if (savedPickups) setScheduledPickups(JSON.parse(savedPickups));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wallet to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
  }, [wallet]);

  // Save pickups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pickups", JSON.stringify(scheduledPickups));
  }, [scheduledPickups]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToWallet = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      amount: prev.amount + amount,
    }));
  };

  const addGiftCard = (giftCard: GiftCard) => {
    setWallet((prev) => ({
      ...prev,
      giftCards: [...prev.giftCards, giftCard],
    }));
  };

  const useGiftCard = (cardId: string, amount: number): boolean => {
    const card = wallet.giftCards.find((card) => card.id === cardId);
    if (!card || card.balance < amount) return false;

    setWallet((prev) => ({
      ...prev,
      giftCards: prev.giftCards.map((card) =>
        card.id === cardId
          ? { ...card, balance: card.balance - amount }
          : card
      ),
    }));

    return true;
  };

  const schedulePickup = (date: Date, time: string, items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    setScheduledPickups((prev) => [
      ...prev,
      {
        id: `pickup-${Date.now()}`,
        date,
        time,
        items,
        total,
        status: "pending",
      },
    ]);
  };

  const cancelPickup = (id: string) => {
    setScheduledPickups((prev) =>
      prev.filter((pickup) => pickup.id !== id)
    );
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    wallet,
    addToWallet,
    addGiftCard,
    useGiftCard,
    schedulePickup,
    scheduledPickups,
    cancelPickup,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
