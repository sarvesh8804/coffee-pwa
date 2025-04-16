
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, products } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any | null>(null);
  
  useEffect(() => {
    // Find the product based on the ID from the URL
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If product not found, navigate to 404
      navigate("/not-found");
    }
  }, [productId, navigate, products]);
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    }
  };
  
  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="container mx-auto max-w-6xl py-8 px-4 md:px-8 bg-cream-light">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-medium text-coffee-dark">
                  {product.name}
                </h1>
                <p className="text-xl text-coffee mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              
              <div className="prose prose-coffee max-w-none">
                <p className="text-lg text-muted-foreground">
                  {product.longDescription || product.description}
                </p>
              </div>
              
              {product.roastLevel && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <h3 className="font-medium text-coffee-dark mb-1">Roast Level</h3>
                    <p>{product.roastLevel}</p>
                  </div>
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <h3 className="font-medium text-coffee-dark mb-1">Origin</h3>
                    <p>{product.origin}</p>
                  </div>
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <h3 className="font-medium text-coffee-dark mb-1">Flavor Notes</h3>
                    <p>{product.flavorNotes?.join(", ")}</p>
                  </div>
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <h3 className="font-medium text-coffee-dark mb-1">Weight</h3>
                    <p>{product.weight}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-cream-dark/20 pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-muted-foreground">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={increaseQuantity}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  className="w-full md:w-auto bg-coffee hover:bg-coffee-dark text-white"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ProductDetails;
