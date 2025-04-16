
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  longDescription?: string;
  roastLevel?: string;
  origin?: string;
  flavorNotes?: string[];
  weight?: string;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id, 
      name, 
      price, 
      image, 
      description, 
      long_description, 
      roast_level, 
      origin, 
      flavor_notes, 
      weight,
      categories(name)
    `)
    .order('name');

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  // Transform the response to match our Product type
  return products.map(product => ({
    id: product.id,
    name: product.name,
    price: Number(product.price), // Convert from decimal to number
    image: product.image,
    description: product.description,
    category: product.categories?.name || "Unknown",
    longDescription: product.long_description,
    roastLevel: product.roast_level,
    origin: product.origin,
    flavorNotes: product.flavor_notes,
    weight: product.weight
  }));
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          id, 
          name, 
          price, 
          image, 
          description, 
          long_description, 
          roast_level, 
          origin, 
          flavor_notes, 
          weight,
          categories(name)
        `)
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        description: product.description,
        category: product.categories?.name || "Unknown",
        longDescription: product.long_description,
        roastLevel: product.roast_level,
        origin: product.origin,
        flavorNotes: product.flavor_notes,
        weight: product.weight
      };
    },
    enabled: !!productId
  });
};
