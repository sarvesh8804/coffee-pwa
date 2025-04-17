
import React from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface GiftCardProps {
  id: string;
  code: string;
  amount: number;
  balance: number;
  createdAt: Date;
  expiresAt: Date;
  variant?: "default" | "small";
  onUse?: () => void;
}

const GiftCardItem: React.FC<GiftCardProps> = ({
  id,
  code,
  amount,
  balance,
  createdAt,
  expiresAt,
  variant = "default",
  onUse,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code copied",
      description: "Gift card code has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date() > new Date(expiresAt);
  const percentRemaining = (balance / amount) * 100;

  if (variant === "small") {
    return (
      <div className={cn(
        "relative rounded-lg overflow-hidden border border-cream-dark/30 card-hover",
        isExpired ? "opacity-60" : ""
      )}>
        <div className="bg-gradient-to-br from-coffee-light to-coffee/20 p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-coffee-dark" />
              <span className="text-xs font-medium text-coffee-dark">
                {isExpired ? "Expired" : `Expires: ${format(new Date(expiresAt), "MMM dd, yyyy")}`}
              </span>
            </div>
            <div className="text-sm font-medium">${balance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  }

  // Format the code to display in groups of 4 for readability
  const formattedCode = code.includes('-') 
    ? code 
    : code.match(/.{1,4}/g)?.join('-') || code;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-sm border border-cream-dark/30",
        isExpired ? "opacity-70" : ""
      )}
    >
      <div className="bg-gradient-to-br from-coffee-light to-cream p-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-cream-dark/20">
          <div
            className="h-full bg-coffee transition-all duration-500 ease-out-expo"
            style={{ width: `${percentRemaining}%` }}
          />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Gift className="h-6 w-6 text-coffee-dark mr-2" />
            <h3 className="font-medium text-coffee-dark">Gift Card</h3>
          </div>
          {isExpired && (
            <span className="text-xs font-medium bg-coffee-dark/10 text-coffee-dark px-2 py-1 rounded">
              Expired
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-2xl font-display font-medium text-coffee-dark">
              ${balance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of ${amount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Expires</p>
            <p className="text-sm font-medium text-coffee-dark">
              {format(new Date(expiresAt), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <p className="text-sm font-mono px-3 py-1.5 bg-cream-dark/20 rounded-md flex-1 truncate">
            {formattedCode}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyCode}
            className="h-8 w-8 rounded-full bg-cream hover:bg-cream-dark/30"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {onUse && balance > 0 && !isExpired && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUse}
            className="w-full bg-cream-dark/20 hover:bg-cream-dark/30 text-coffee-dark border-coffee-light/30"
          >
            Use this card
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default GiftCardItem;
