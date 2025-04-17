
import React from "react";
import WalletCard from "@/components/WalletCard";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useWallet } from "@/hooks/useWallet";
import { format } from "date-fns";

const Wallet = () => {
  const { toast } = useToast();
  const { balance, transactions, addFunds, isLoading, isAddingFunds } = useWallet();

  const handleAddFunds = (amount: number) => {
    addFunds(amount);
  };

  return (
    <Layout>
      <PageTransition>
        <div className="container mx-auto max-w-4xl py-8 px-4 md:px-8 bg-cream-light">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-8 font-display">
            Your Wallet
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <WalletCard 
                balance={balance || 0} 
                transactions={transactions.slice(0, 3)} 
                onAddFunds={() => {}} 
              />
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold mb-3">Add Funds</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((amount) => (
                    <Button 
                      key={amount} 
                      variant="outline" 
                      className="border-coffee hover:bg-coffee hover:text-white"
                      onClick={() => handleAddFunds(amount)}
                      disabled={isAddingFunds}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full mt-2 bg-coffee hover:bg-coffee-dark"
                  onClick={() => handleAddFunds(50)}
                  disabled={isAddingFunds}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add $50
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coffee"></div>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex justify-between items-center p-3 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-gray-500">
                            {format(tx.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Wallet;
