
import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, MinusCircle, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: "This feature is coming soon",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 px-4 md:px-8 bg-cream-light">
          <PageTransition>
            <div className="container mx-auto max-w-4xl text-center py-16">
              <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6 font-display">
                Your Cart
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your cart is empty. Add some delicious coffee to get started!
              </p>
              <Button asChild className="bg-coffee hover:bg-coffee-dark">
                <Link to="/">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </PageTransition>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-8 bg-cream-light">
        <PageTransition>
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-8 font-display">
              Your Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <motion.li 
                            key={item.product.id} 
                            className="py-6 flex"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link to={`/product/${item.product.id}`} className="hover:text-coffee">
                                      {item.product.name}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-coffee-dark"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <MinusCircle className="h-4 w-4" />
                                  </Button>
                                  <span className="font-medium">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-coffee-dark"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <PlusCircle className="h-4 w-4" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      className="text-coffee hover:bg-cream"
                    >
                      <Link to="/">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-coffee-dark mb-4">Order Summary</h2>
                  <div className="flow-root">
                    <dl className="space-y-4">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Tax</dt>
                        <dd className="text-sm font-medium text-gray-900">${(cartTotal * 0.08).toFixed(2)}</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                        <dd className="text-base font-medium text-coffee">${(cartTotal * 1.08).toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Button
                      className="w-full bg-coffee hover:bg-coffee-dark text-white"
                      onClick={handleCheckout}
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full border-coffee text-coffee hover:bg-cream"
                    >
                      <Link to="/pickup">
                        Schedule Pickup Instead
                      </Link>
                    </Button>
                  </div>
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

export default Cart;
