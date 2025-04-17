import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Coffee, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

const PickupScheduler: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const { toast } = useToast();
  const { cartItems, cartTotal, schedulePickup, clearCart, wallet } = useCart();

  const handleSchedulePickup = async () => {
    if (!date || !selectedTimeSlot) {
      toast({
        title: "Please select a date and time",
        description: "Both date and time are required to schedule a pickup",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Add some items to your cart before scheduling a pickup",
        variant: "destructive",
      });
      return;
    }
    
    if (wallet.balance < cartTotal) {
      setInsufficientFunds(true);
      toast({
        title: "Insufficient funds",
        description: "Please add more funds to your wallet",
        variant: "destructive",
      });
      return;
    } else {
      setInsufficientFunds(false);
    }

    setIsSubmitting(true);

    try {
      schedulePickup(date, selectedTimeSlot, cartItems);
      
      clearCart();

      toast({
        title: "Pickup scheduled!",
        description: `Your order will be ready on ${format(date, "MMMM d")} at ${selectedTimeSlot}`,
      });

      setDate(undefined);
      setSelectedTimeSlot(null);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Unable to schedule pickup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDates = {
    before: new Date(),
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-medium text-coffee-dark">
          Schedule Your Pickup
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Select a date and time for your order pickup. We'll have your items
          ready and waiting for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-coffee-dark">
              Select Pickup Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                  <CalendarIcon className="mr-1 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disabledDates}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-coffee-dark">
              Select Pickup Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9",
                    selectedTimeSlot === time
                      ? "bg-coffee text-white border-coffee"
                      : "border-input bg-background hover:bg-cream hover:text-coffee-dark"
                  )}
                  onClick={() => setSelectedTimeSlot(time)}
                >
                  <Clock className="mr-1 h-3 w-3" /> {time}
                </Button>
              ))}
            </div>
          </div>

          {insufficientFunds && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p>Insufficient funds in your wallet. Current balance: ${wallet.balance.toFixed(2)}</p>
            </div>
          )}

          <Button
            onClick={handleSchedulePickup}
            disabled={!date || !selectedTimeSlot || isSubmitting || insufficientFunds || cartTotal > wallet.balance}
            className={cn(
              "w-full mt-4",
              cartTotal > wallet.balance
                ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                : "bg-coffee hover:bg-coffee-dark text-white"
            )}
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse-soft mr-2">Scheduling...</span>
              </>
            ) : (
              <>
                <Coffee className="mr-2 h-4 w-4" /> Schedule Pickup
                {cartTotal > 0 && ` • $${cartTotal.toFixed(2)}`}
              </>
            )}
          </Button>
          
          {cartTotal > wallet.balance && !insufficientFunds && (
            <div className="text-xs text-red-600 text-center">
              Insufficient wallet balance. Add more funds before scheduling.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border border-cream-dark/30 overflow-hidden"
        >
          <div className="bg-cream p-4">
            <h3 className="font-medium text-coffee-dark">Order Summary</h3>
          </div>
          <div className="p-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Your cart is empty. Add items to schedule a pickup.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center py-2 border-b border-cream-dark/10 last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-cream flex items-center justify-center mr-3">
                          <Coffee className="h-4 w-4 text-coffee-dark" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-coffee-dark">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-dark/10 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-coffee-dark">
                      Total
                    </p>
                    <p className="text-lg font-display font-medium text-coffee-dark">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {date && selectedTimeSlot ? (
                    <p>
                      Your order will be ready for pickup on{" "}
                      <span className="font-medium text-coffee-dark">
                        {format(date, "MMMM d")}
                      </span>{" "}
                      at{" "}
                      <span className="font-medium text-coffee-dark">
                        {selectedTimeSlot}
                      </span>
                    </p>
                  ) : (
                    <p>Select a date and time to schedule your pickup</p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="p-4 bg-cream-light/50 border-t border-cream-dark/10">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-coffee-dark">Wallet Balance</p>
              <p className="text-sm font-medium">${wallet.balance.toFixed(2)}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {wallet.balance < cartTotal ? 
                <span className="text-red-600">Insufficient funds. Please add more to your wallet.</span> :
                <span>You have enough funds to complete this order.</span>
              }
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PickupScheduler;
