import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Import Supabase
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, AlertTriangle, Loader2 } from "lucide-react"; // Added AlertTriangle and Loader2
import { motion } from "framer-motion";
import ProductDetail from "./ProductDetail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert components

interface ProductDocument { 
  name: string;
  type: string;
  url: string; 
}

interface ProductSpecification { 
  title: string;
  items: string[];
}
interface Product {
  id: string; 
  title: string;
  description: string;
  image: string; 
  slug: string;
  specifications: ProductSpecification[];
  certifications: string[];
  documents: ProductDocument[]; 
}

interface ProductGridProps {
  // products prop removed as data is fetched internally
  title?: string;
  description?: string;
}

const ProductGrid = ({
  title = "Our Products & Services",
  description = "Explore our comprehensive range of high-quality commodities sourced from trusted global suppliers.",
}: ProductGridProps) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadProductsError, setLoadProductsError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setLoadProductsError(null);
      try {
        const { data, error } = await supabase
          .from("products") 
          .select(`
            id,
            title,
            description,
            image,
            slug,
            specifications,
            certifications,
            documents 
          `); 

        if (error) {
          throw error;
        }
        
        const formattedProducts = data.map(p => ({
          ...p,
          id: p.id.toString(), 
          // Assuming Supabase client handles parsing of JSONB fields (specifications, certifications, documents)
          // If they are stored as text and need manual parsing:
          // specifications: typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications,
          // certifications: typeof p.certifications === 'string' ? JSON.parse(p.certifications) : p.certifications,
          // documents: typeof p.documents === 'string' ? JSON.parse(p.documents) : p.documents,
        })) as Product[];

        setProductsData(formattedProducts);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setLoadProductsError(error.message || "Failed to load products. Please try again later.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);


  if (selectedProductSlug) {
    const product = productsData.find((p) => p.slug === selectedProductSlug);
    if (product) {
      return (
        <ProductDetail
          product={product}
          onBack={() => setSelectedProductSlug(null)}
        />
      );
    }
  }
  
  if (isLoadingProducts) {
    return (
      <div className="w-full py-12 bg-simba-lightsand/10">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-simba-navy mx-auto mb-4" />
          <p className="text-lg text-simba-navy">Loading Products...</p>
        </div>
      </div>
    );
  }

  if (loadProductsError) {
    return (
      <div className="w-full py-12 bg-simba-lightsand/10">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Products</AlertTitle>
            <AlertDescription>
              {loadProductsError}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (productsData.length === 0) {
    return (
      <div className="w-full py-12 bg-simba-lightsand/10">
        <div className="container mx-auto px-4 text-center">
          <Info className="h-12 w-12 text-simba-navy mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-simba-navy">No Products Available</h3>
          <p className="text-slate-600 mt-2">
            There are currently no products to display. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-simba-lightsand/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-simba-navy mb-4">{title}</h2>
          <p className="text-[#546E7A] max-w-3xl mx-auto">{description}</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            className={`${
              activeFilter === null
                ? "bg-simba-navy text-white hover:bg-simba-navy/90"
                : "text-simba-navy border-simba-navy hover:bg-simba-navy/10"
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All Products
          </Button>
          {productsData.map((product) => (
            <Button
              key={`filter-${product.slug}`}
              variant={activeFilter === product.slug ? "default" : "outline"}
              className={`${
                activeFilter === product.slug
                  ? "bg-simba-navy text-white hover:bg-simba-navy/90"
                  : "text-simba-navy border-simba-navy hover:bg-simba-navy/10"
              }`}
              onClick={() => setActiveFilter(product.slug)}
            >
              {product.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData
            .filter(
              (product) =>
                activeFilter === null || product.slug === activeFilter,
            )
            .map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border border-simba-sand hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image || '/placeholder-image.jpg'} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="bg-white">
                    <CardTitle className="text-xl text-simba-navy">
                      {product.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white flex-grow">
                    <CardDescription className="text-[#546E7A] mb-4 line-clamp-3">
                      {product.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center bg-white border-t pt-4">
                    <Button
                      variant="ghost"
                      className="text-simba-gold hover:text-simba-gold hover:bg-simba-gold/10 p-0 transition-all duration-300 hover:translate-x-1"
                      onClick={() => setSelectedProductSlug(product.slug)}
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-simba-navy text-simba-navy hover:bg-simba-navy hover:text-white transition-all duration-300 hover:shadow-md"
                      onClick={() => {
                        const rfqSection =
                          document.getElementById("rfq-section");
                        if (rfqSection) {
                          rfqSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Request Quote
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
