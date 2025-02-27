
import React from "react";
import PageTransition from "@/components/PageTransition";
import PickupScheduler from "@/components/PickupScheduler";
import { useCart } from "@/context/CartContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Coffee, Check, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Pickup = () => {
  const { scheduledPickups } = useCart();

  const upcomingPickups = scheduledPickups.filter(
    (pickup) => pickup.status !== "completed" && pickup.status !== "cancelled"
  );

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-coffee-light flex items-center justify-center">
              <Calendar className="h-3 w-3 text-coffee-dark" />
            </div>
            <h1 className="text-sm font-medium text-coffee">
              Coffee Pickup Scheduling
            </h1>
          </div>
          <h2 className="text-4xl font-display font-medium text-coffee-dark mb-4">
            Order Ahead, Skip the Line
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Schedule your coffee pickup in advance and have it ready when you
            arrive. No more waiting in line or rushing through your morning
            routine.
          </p>
        </div>

        {upcomingPickups.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-display font-medium text-coffee-dark mb-6">
              Upcoming Pickups
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingPickups.map((pickup) => (
                <motion.div
                  key={pickup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl overflow-hidden border border-cream-dark/30 shadow-sm bg-white"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            pickup.status === "pending"
                              ? "bg-coffee-light/50 text-coffee-dark"
                              : "bg-green-100 text-green-600"
                          )}
                        >
                          {pickup.status === "pending" ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-coffee-dark">
                            {pickup.status === "pending"
                              ? "Preparing"
                              : "Ready for pickup"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(pickup.date), "EEEE, MMMM d")} at{" "}
                            {pickup.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium bg-cream px-2 py-1 rounded-md">
                        ${pickup.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-cream-dark/10 pt-4 mt-4">
                      <h5 className="text-sm font-medium text-coffee-dark mb-2">
                        Order Items
                      </h5>
                      <ul className="space-y-2">
                        {pickup.items.map((item) => (
                          <li
                            key={item.product.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center">
                              <Coffee className="h-3 w-3 mr-2 text-coffee" />
                              <span>{item.product.name}</span>
                            </div>
                            <span className="text-muted-foreground">
                              ×{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-4 border-t border-cream-dark/10 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          /* Implement cancel functionality */
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-coffee"
                      >
                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-cream rounded-xl p-6 md:p-8 shadow-sm border border-cream-dark/30">
          <PickupScheduler />
        </div>
      </div>
    </PageTransition>
  );
};

export default Pickup;
