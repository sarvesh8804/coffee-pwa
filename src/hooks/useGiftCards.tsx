
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type GiftCard = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  createdAt: string;
  expiresAt: string;
};

export const useGiftCards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch gift cards for the current user
  const { data: giftCards = [], isLoading } = useQuery({
    queryKey: ['giftCards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((card: any) => ({
        id: card.id,
        code: card.code,
        amount: Number(card.amount),
        balance: Number(card.balance),
        createdAt: card.created_at,
        expiresAt: card.expires_at,
      }));
    },
    enabled: !!user
  });
  
  // Create a new gift card
  const createGiftCardMutation = useMutation({
    mutationFn: async ({ 
      recipientEmail, 
      amount, 
      message, 
      design 
    }: { 
      recipientEmail: string; 
      amount: number; 
      message?: string; 
      design?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate a random code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Set expiry to 1 year from now
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      
      const newGiftCard = {
        user_id: user.id,
        code,
        amount,
        balance: amount, // Initially, balance equals amount
        expires_at: expiresAt.toISOString(),
        recipient_email: recipientEmail,
        message: message || '',
        design: design || ''
      };
      
      const { data, error } = await supabase
        .from('gift_cards')
        .insert(newGiftCard)
        .select();
        
      if (error) throw error;
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftCards', user?.id] });
      toast({
        title: "Gift Card Created",
        description: "The gift card has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Gift Card",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Redeem a gift card
  const redeemGiftCardMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // First, check if the gift card exists and isn't already claimed
      const { data: giftCard, error: findError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code)
        .maybeSingle();
        
      if (findError) throw findError;
      if (!giftCard) throw new Error('Gift card not found');
      if (giftCard.user_id === user.id) throw new Error('You cannot redeem your own gift card');
      
      // Update the gift card with the new owner
      const { data, error } = await supabase
        .from('gift_cards')
        .update({ user_id: user.id })
        .eq('id', giftCard.id)
        .select();
        
      if (error) throw error;
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftCards', user?.id] });
      toast({
        title: "Gift Card Redeemed",
        description: "The gift card has been added to your account.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Redeeming Gift Card",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    giftCards,
    isLoading,
    createGiftCard: createGiftCardMutation.mutate,
    isCreating: createGiftCardMutation.isPending,
    redeemGiftCard: redeemGiftCardMutation.mutate,
    isRedeeming: redeemGiftCardMutation.isPending
  };
};
