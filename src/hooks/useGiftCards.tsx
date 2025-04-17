import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

export type GiftCard = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  createdAt: string;
  expiresAt: string;
  design?: string;
  message?: string;
};

const generateCardCode = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  for (let group = 0; group < 4; group++) {
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (group < 3) code += '-';
  }
  
  return code;
};

export const useGiftCards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addFunds, makePayment } = useWallet();
  
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
        design: card.design,
        message: card.message
      }));
    },
    enabled: !!user
  });
  
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
      
      try {
        await makePayment(amount, `Gift Card Purchase for ${recipientEmail}`);
        
        const code = generateCardCode();
        
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        
        const newGiftCard = {
          user_id: user.id,
          code,
          amount,
          balance: amount,
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
      } catch (error: any) {
        throw error;
      }
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
  
  const redeemGiftCardMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: giftCard, error: findError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .maybeSingle();
        
      if (findError) throw findError;
      if (!giftCard) throw new Error('Gift card not found');
      if (giftCard.user_id === user.id) throw new Error('You cannot redeem your own gift card');
      if (Number(giftCard.balance) <= 0) throw new Error('Gift card has no remaining balance');
      if (new Date(giftCard.expires_at) < new Date()) throw new Error('Gift card has expired');
      
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({ user_id: user.id })
        .eq('id', giftCard.id);
        
      if (updateError) throw updateError;
      
      await addFunds(Number(giftCard.balance), `Gift Card Redemption: ${code}`);
      
      return giftCard;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['giftCards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions', user?.id] });
      toast({
        title: "Gift Card Redeemed",
        description: `$${Number(data.balance).toFixed(2)} has been added to your wallet.`,
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
