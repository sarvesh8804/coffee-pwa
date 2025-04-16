
import React, { createContext, useContext, useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  longDescription?: string;
  roastLevel?: string;
  origin?: string;
  flavorNotes?: string[];
  weight?: string;
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
  products: Product[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Sample products data (in a real app, this would come from an API)
const productsData: Product[] = [
  {
    id: "prod_1",
    name: "Signature Blend",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500&auto=format&fit=crop",
    description: "Our signature medium roast with notes of chocolate and caramel.",
    longDescription: "Our signature house blend brings together the finest coffee beans from Ethiopia and Colombia. This medium roast has a smooth, balanced flavor profile with distinct notes of chocolate and caramel, complemented by a subtle fruity undertone. Perfect for any brewing method, but especially shines as a pour-over or French press.",
    roastLevel: "Medium",
    origin: "Ethiopia, Colombia",
    flavorNotes: ["Chocolate", "Caramel", "Citrus"],
    weight: "12 oz (340g)",
    category: "Beans"
  },
  {
    id: "prod_2",
    name: "Ethiopian Light Roast",
    price: 18.95,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&auto=format&fit=crop",
    description: "Bright and floral with citrus notes and a clean finish.",
    longDescription: "This single-origin Ethiopian light roast comes from the Yirgacheffe region, known for producing some of the world's finest coffees. The beans are carefully roasted to preserve their delicate flavors. Expect a bright, floral cup with pronounced citrus notes, jasmine aromatics, and a clean, refreshing finish. Ideal for pour-over brewing methods to highlight its complex flavor profile.",
    roastLevel: "Light",
    origin: "Yirgacheffe, Ethiopia",
    flavorNotes: ["Citrus", "Jasmine", "Honey"],
    weight: "12 oz (340g)",
    category: "Beans"
  },
  {
    id: "prod_3",
    name: "Dark Roast",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500&auto=format&fit=crop",
    description: "Bold and rich with smoky undertones and a full body.",
    longDescription: "Our Dark Roast blend combines beans from Sumatra and Guatemala, roasted to bring out deep, rich flavors. This full-bodied coffee offers bold notes of dark chocolate and toasted nuts with subtle smoky undertones and a surprisingly smooth finish. The low acidity makes it perfect for espresso drinks or as a strong, satisfying drip coffee that stands up well to milk and sweeteners.",
    roastLevel: "Dark",
    origin: "Sumatra, Guatemala",
    flavorNotes: ["Dark Chocolate", "Toasted Nuts", "Smoky"],
    weight: "12 oz (340g)",
    category: "Beans"
  },
  {
    id: "prod_4",
    name: "Coffee Grinder",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=500&auto=format&fit=crop",
    description: "Adjustable burr grinder for consistent coffee grounds.",
    category: "Equipment",
    longDescription: "Our premium burr grinder allows you to precisely control the coarseness of your coffee grounds. With 18 different grind settings, you can prepare the perfect grounds for any brewing method from espresso to French press. The stainless steel burrs ensure durability and consistent grinding without overheating the beans."
  },
  {
    id: "prod_5",
    name: "Pour Over Kit",
    price: 29.95,
    image: "https://images.unsplash.com/photo-1545665225-b23a2bc947b2?q=80&w=500&auto=format&fit=crop",
    description: "Complete kit for brewing pour over coffee at home.",
    category: "Equipment",
    longDescription: "This all-in-one pour over kit includes a glass carafe, a reusable stainless steel filter, and a precision spout kettle. Experience the clarity and enhanced flavor profiles that pour over brewing brings to your favorite coffee beans. The kit is designed for optimal extraction and ease of use, perfect for both beginners and experienced coffee enthusiasts."
  }
];

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
    products: productsData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
