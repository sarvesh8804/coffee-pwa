
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type WalletTransaction = {
  id: string;
  amount: number;
  type: "deposit" | "payment"; // Strict union type for transaction types
  description: string;
  date: Date;
};

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const fetchWalletTransactions = async () => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert the data to the expected format with strict typing
    return data.map(tx => ({
      id: tx.id,
      amount: Number(tx.amount),
      type: tx.type === 'reload' ? 'deposit' as const : 'payment' as const, // Ensure correct type mapping
      description: tx.description,
      date: new Date(tx.created_at)
    })) as WalletTransaction[];
  };

  // Calculate balance from transactions
  const calculateBalance = (transactions: WalletTransaction[]) => {
    return transactions.reduce((total, tx) => {
      if (tx.type === 'deposit') {
        return total + tx.amount;
      } else {
        return total - tx.amount;
      }
    }, 0);
  };

  // Query for wallet transactions
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['walletTransactions', user?.id],
    queryFn: fetchWalletTransactions,
    enabled: !!user,
  });

  // Calculate current balance
  const balance = calculateBalance(transactions);

  // Mutation to add funds
  const addFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const newTransaction = {
        user_id: user.id,
        amount: amount,
        type: 'reload', // Using 'reload' in the database
        description: 'Wallet Reload'
      };
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert(newTransaction)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletTransactions', user?.id] });
      toast({
        title: "Funds Added",
        description: "Your wallet has been topped up successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Funds",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    balance,
    transactions,
    isLoading,
    error,
    addFunds: (amount: number) => addFundsMutation.mutate(amount),
    isAddingFunds: addFundsMutation.isPending
  };
};
