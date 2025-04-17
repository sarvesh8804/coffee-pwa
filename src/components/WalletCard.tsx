
import React from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { WalletTransaction } from "@/hooks/useWallet";

interface WalletCardProps {
  balance: number;
  transactions: WalletTransaction[];
  onAddFunds: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  transactions,
  onAddFunds,
}) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="bg-gradient-to-br from-coffee-light to-cream relative overflow-hidden rounded-xl shadow-sm border border-cream-dark/30 p-6"
      >
        <div className="absolute top-2 right-2 rounded-full bg-white/20 backdrop-blur-xs p-2">
          <Wallet className="h-5 w-5 text-coffee-dark" />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-coffee-dark/70">Wallet Balance</h3>
          <p className="text-3xl font-display font-medium text-coffee-dark mt-1">
            ${balance.toFixed(2)}
          </p>
        </div>

        <Button
          onClick={onAddFunds}
          size="sm"
          variant="outline"
          className="bg-white/50 hover:bg-white/70 text-coffee-dark border-coffee-light/30 flex items-center space-x-1"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Funds
        </Button>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-coffee-dark flex items-center">
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 text-center bg-cream/50 rounded-lg">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-cream/50 backdrop-blur-xs hover:bg-cream/80 transition-colors p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      transaction.type === "deposit"
                        ? "bg-green-100 text-green-600"
                        : "bg-coffee-light/50 text-coffee-dark"
                    )}
                  >
                    {transaction.type === "deposit" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-coffee-dark">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM dd, h:mm a")}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    transaction.type === "deposit"
                      ? "text-green-600"
                      : "text-coffee-dark"
                  )}
                >
                  {transaction.type === "deposit" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
