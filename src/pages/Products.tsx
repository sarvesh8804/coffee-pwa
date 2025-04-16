
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Coffee, Search, FilterX, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const { toast } = useToast();
  
  // Fetch products from Supabase
  const { data: products = [], isLoading, error } = useProducts();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    // Apply price sorting
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    return filtered;
  }, [products, searchTerm, categoryFilter, priceSort]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriceSort("default");
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-coffee-light flex items-center justify-center">
                <Coffee className="h-3 w-3 text-coffee-dark" />
              </div>
              <h1 className="text-sm font-medium text-coffee">Our Products</h1>
            </div>
            <h2 className="text-4xl font-display font-medium text-coffee-dark mb-4">
              Browse Our Coffee Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our carefully selected coffee beans, brewing equipment, and accessories.
              Find everything you need for the perfect coffee experience.
            </p>
          </div>

          {/* Filters and search */}
          <div className="mb-8 bg-cream/30 p-6 rounded-xl border border-cream-dark/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={priceSort} onValueChange={setPriceSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || categoryFilter !== "all" || priceSort !== "default") && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-dark/10">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-cream text-coffee-dark">
                      Search: {searchTerm}
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="bg-cream text-coffee-dark">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {priceSort !== "default" && (
                    <Badge variant="secondary" className="bg-cream text-coffee-dark">
                      {priceSort === "low-to-high" ? "Price: Low to High" : "Price: High to Low"}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <FilterX className="h-4 w-4 mr-1" /> Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-coffee animate-spin mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <h3 className="text-xl font-display font-medium text-red-500 mb-2">
                Error loading products
              </h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Something went wrong. Please try again."}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-display font-medium text-coffee-dark mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            /* Product Grid */
            !isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
                      <Link to={`/product/${product.id}`} className="overflow-hidden">
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                      </Link>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Link to={`/product/${product.id}`}>
                            <CardTitle className="text-lg font-medium text-coffee-dark hover:text-coffee">
                              {product.name}
                            </CardTitle>
                          </Link>
                          <Badge className="bg-cream text-coffee-dark">
                            ${product.price.toFixed(2)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-coffee hover:bg-coffee-dark text-white"
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Products;
