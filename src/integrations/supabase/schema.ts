
export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  long_description?: string | null;
  roast_level?: string | null;
  origin?: string | null;
  flavor_notes?: string[] | null;
  weight?: string | null;
  category_id?: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type CartItem = {
  id: string;
  user_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type Pickup = {
  id: string;
  user_id: string | null;
  pickup_date: string;
  pickup_time: string;
  total: number;
  status: 'pending' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type PickupItem = {
  id: string;
  pickup_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  user_id: string | null;
  amount: number;
  type: string;
  description: string;
  created_at: string;
};

export type GiftCard = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  user_id: string | null;
  created_at: string;
  expires_at: string;
};
