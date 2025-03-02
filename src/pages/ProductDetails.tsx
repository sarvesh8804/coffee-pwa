
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";

// Sample products data (in a real app, this would come from an API)
const productsData = [
  {
    id: "prod_1",
    name: "Signature Blend",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500&auto=format&fit=crop",
    description: "Our signature medium roast with notes of chocolate and caramel.",
    longDescription: "Our signature house blend brings together the finest coffee beans from Ethiopia and Colombia. This medium roast has a smooth, balanced flavor profile with distinct notes of chocolate and caramel, complemented by a subtle fruity undertone. Perfect for any brewing method, but especially shines as a pour-over or French press.",
    roastLevel: "Medium",
    origin: "Ethiopia, Colombia",
    flavorNotes: ["Chocolate", "Caramel", "Citrus"],
    weight: "12 oz (340g)"
  },
  {
    id: "prod_2",
    name: "Ethiopian Light Roast",
    price: 18.95,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&auto=format&fit=crop",
    description: "Bright and floral with citrus notes and a clean finish.",
    longDescription: "This single-origin Ethiopian light roast comes from the Yirgacheffe region, known for producing some of the world's finest coffees. The beans are carefully roasted to preserve their delicate flavors. Expect a bright, floral cup with pronounced citrus notes, jasmine aromatics, and a clean, refreshing finish. Ideal for pour-over brewing methods to highlight its complex flavor profile.",
    roastLevel: "Light",
    origin: "Yirgacheffe, Ethiopia",
    flavorNotes: ["Citrus", "Jasmine", "Honey"],
    weight: "12 oz (340g)"
  },
  {
    id: "prod_3",
    name: "Dark Roast",
    price: 16.95,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500&auto=format&fit=crop",
    description: "Bold and rich with smoky undertones and a full body.",
    longDescription: "Our Dark Roast blend combines beans from Sumatra and Guatemala, roasted to bring out deep, rich flavors. This full-bodied coffee offers bold notes of dark chocolate and toasted nuts with subtle smoky undertones and a surprisingly smooth finish. The low acidity makes it perfect for espresso drinks or as a strong, satisfying drip coffee that stands up well to milk and sweeteners.",
    roastLevel: "Dark",
    origin: "Sumatra, Guatemala",
    flavorNotes: ["Dark Chocolate", "Toasted Nuts", "Smoky"],
    weight: "12 oz (340g)"
  },
];

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any | null>(null);
  
  useEffect(() => {
    // Find the product based on the ID from the URL
    const foundProduct = productsData.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If product not found, navigate to 404
      navigate("/not-found");
    }
  }, [productId, navigate]);
  
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
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
          <div className="container mx-auto max-w-6xl">
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
                    {product.longDescription}
                  </p>
                </div>
                
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
                    <p>{product.flavorNotes.join(", ")}</p>
                  </div>
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <h3 className="font-medium text-coffee-dark mb-1">Weight</h3>
                    <p>{product.weight}</p>
                  </div>
                </div>
                
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
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
