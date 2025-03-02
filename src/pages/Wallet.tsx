
import React from "react";
import WalletCard from "@/components/WalletCard";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const { toast } = useToast();
  const [balance, setBalance] = React.useState(25.50); // Default starting balance
  const [transactions, setTransactions] = React.useState([
    { id: 1, date: "2023-05-15", amount: 5.75, type: "purchase", description: "Cappuccino" },
    { id: 2, date: "2023-05-10", amount: 20.00, type: "reload", description: "Wallet Reload" },
    { id: 3, date: "2023-05-08", amount: 4.25, type: "purchase", description: "Croissant & Tea" },
  ]);

  const handleAddFunds = (amount: number) => {
    setBalance(prev => prev + amount);
    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: "reload",
      description: "Wallet Reload"
    };
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Funds Added",
      description: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-8 bg-cream-light">
        <PageTransition>
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-8 font-display">
              Your Wallet
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WalletCard 
                  balance={balance} 
                  transactions={transactions.slice(0, 3).map(tx => ({
                    id: tx.id.toString(),
                    type: tx.type === "reload" ? "deposit" : "payment",
                    amount: tx.amount,
                    date: new Date(tx.date),
                    description: tx.description
                  }))} 
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
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-2 bg-coffee hover:bg-coffee-dark"
                    onClick={() => handleAddFunds(50)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add $50
                  </Button>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  
                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex justify-between items-center p-3 border-b last:border-0"
                        >
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-sm text-gray-500">{tx.date}</p>
                          </div>
                          <div className={`font-medium ${tx.type === 'reload' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'reload' ? '+' : '-'}${tx.amount.toFixed(2)}
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
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
