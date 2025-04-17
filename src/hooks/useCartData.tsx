
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  product: Product;
  quantity: number;
};

export const useCartData = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch cart items from Supabase or local storage
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      
      try {
        if (user) {
          // Fetch cart from Supabase for authenticated users
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              quantity,
              products (
                id, name, price, description, image, 
                long_description, roast_level, origin, flavor_notes, weight,
                categories(name)
              )
            `)
            .eq('user_id', user.id);

          if (error) throw error;

          // Transform the response to match CartItem structure
          const cartData = data.map(item => ({
            product: {
              id: item.products.id,
              name: item.products.name,
              price: Number(item.products.price),
              image: item.products.image,
              description: item.products.description,
              category: item.products.categories?.name || "Unknown",
              longDescription: item.products.long_description,
              roastLevel: item.products.roast_level,
              origin: item.products.origin,
              flavorNotes: item.products.flavor_notes,
              weight: item.products.weight
            },
            quantity: item.quantity
          }));

          setCartItems(cartData);
        } else {
          // Use local storage for non-authenticated users
          const savedCart = localStorage.getItem('cartItems');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your cart',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, toast]);

  // Save cart items to Supabase or local storage
  const saveCartItems = async (items: CartItem[]) => {
    try {
      if (user) {
        // First, delete all existing cart items for this user
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        // Then insert all current cart items
        if (items.length > 0) {
          const cartData = items.map(item => ({
            user_id: user.id,
            product_id: item.product.id,
            quantity: item.quantity
          }));

          const { error } = await supabase
            .from('cart_items')
            .insert(cartData);

          if (error) throw error;
        }
      } else {
        // Use local storage for non-authenticated users
        localStorage.setItem('cartItems', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your cart',
        variant: 'destructive'
      });
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const updatedCart = [...cartItems];
    const existingItemIndex = updatedCart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }

    setCartItems(updatedCart);
    await saveCartItems(updatedCart);
    
    return updatedCart;
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updatedCart);
    await saveCartItems(updatedCart);
    
    return updatedCart;
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    const updatedCart = cartItems.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    await saveCartItems(updatedCart);
    
    return updatedCart;
  };

  const clearCart = async () => {
    setCartItems([]);
    await saveCartItems([]);
    
    return [];
  };

  // Calculate total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Calculate item count
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  };
};
