
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Gift, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Pickup Scheduling",
    description:
      "Schedule your coffee and pastry pickups in advance and skip the line.",
    link: "/pickup",
    color: "bg-coffee-light",
  },
  {
    icon: <Gift className="h-5 w-5" />,
    title: "Gift Cards",
    description:
      "Share the love of coffee with digital gift cards for friends and family.",
    link: "/gift-cards",
    color: "bg-cream",
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: "Digital Wallet",
    description:
      "Store funds and gift cards in your wallet for quick and easy payments.",
    link: "/wallet",
    color: "bg-coffee-light",
  },
];

const products = [
  {
    id: "prod_1",
    name: "Signature Blend",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500&auto=format&fit=crop",
    description: "Our signature medium roast with notes of chocolate and caramel.",
  },
  {
    id: "prod_2",
    name: "Ethiopian Light Roast",
    price: 18.95,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&auto=format&fit=crop",
    description: "Bright and floral with citrus notes and a clean finish.",
  },
  {
    id: "prod_3",
    name: "Dark Roast",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500&auto=format&fit=crop",
    description: "Bold and rich with smoky undertones and a full body.",
  },
];

const Home = () => {
  return (
    <PageTransition>
      <div className="space-y-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4 pt-8 pb-20 md:pt-20 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.19, 1, 0.22, 1],
                  delay: 0.1 
                }}
                className="space-y-6"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-coffee/10 text-coffee text-sm font-medium mb-4">
                      Artisanal Coffee Experience
                    </span>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight text-coffee-dark">
                    Craft Coffee, <br /> Digital Convenience
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Enjoy our artisanal coffee with the convenience of digital ordering. 
                  Schedule pickups, send gift cards, and manage your wallet all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-coffee hover:bg-coffee-dark text-white"
                  >
                    <Link to="/pickup">
                      <Coffee className="mr-2 h-5 w-5" /> Order Now
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/gift-cards">Send a Gift Card</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="relative flex justify-center"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-md">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                    alt="Coffee"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-black/60 to-transparent" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream rounded-full -z-10" />
                <div className="absolute -top-5 -left-5 w-20 h-20 bg-coffee-light rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-cream-light py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-coffee-dark mb-4">
                Digital Features for Coffee Lovers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enhance your coffee experience with our suite of digital tools designed 
                for convenience and enjoyment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  <Link 
                    to={feature.link}
                    className="block h-full"
                  >
                    <div className="group h-full rounded-xl border border-cream-dark/30 overflow-hidden shadow-sm bg-white card-hover">
                      <div className={cn("p-6", feature.color)}>
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-coffee-dark mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-display font-medium text-coffee-dark mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <div className="p-6 flex justify-end">
                        <span className="text-sm font-medium text-coffee group-hover:translate-x-1 transition-transform">
                          Learn more →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-medium text-coffee-dark mb-4">
                  Featured Products
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Explore our selection of freshly roasted coffee beans, ready for pickup or delivery.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-4 md:mt-0"
              >
                <Link to="/">
                  View All Products
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="group rounded-xl overflow-hidden border border-cream-dark/30 bg-white shadow-sm card-hover"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-medium text-coffee-dark mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-coffee-dark">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className="bg-coffee hover:bg-coffee-dark text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-coffee-light py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-coffee-dark/5" />
          <div className="container max-w-6xl mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-coffee-dark mb-4">
                  Ready to Enjoy Premium Coffee?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Schedule your first pickup today and discover the perfect blend of 
                  artisanal coffee and digital convenience.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-coffee hover:bg-coffee-dark text-white"
                  >
                    <Link to="/pickup">
                      <Calendar className="mr-2 h-5 w-5" /> Schedule Pickup
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                  >
                    <Link to="/gift-cards">
                      <Gift className="mr-2 h-5 w-5" /> Send a Gift
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
