import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  description?: string;
}

const ProductGrid = ({
  products = [
    {
      id: "1",
      title: "Petroleum Products",
      description:
        "High-quality crude oil, refined products, and bitumen for various industrial applications.",
      image: "/images/Petroleum.jpg",
      slug: "petroleum-products",
    },
    {
      id: "2",
      title: "Minerals",
      description:
        "Essential minerals and ores for construction, manufacturing, and technological applications.",
      image:
        "https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?w=800&q=80",
      slug: "minerals",
    },
    {
      id: "3",
      title: "Agricultural Products",
      description:
        "Premium grains, pulses, and agricultural commodities sourced from trusted global suppliers.",
      image: "/images/Agri.jpg",
      slug: "agricultural-products",
    },
  ],
  title = "Our Products & Services",
  description = "Explore our comprehensive range of high-quality commodities sourced from trusted global suppliers.",
}: ProductGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  return (
    <div className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-[#0B1C3F] mb-4">{title}</h2>
          <p className="text-[#546E7A] max-w-3xl mx-auto">{description}</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            className={`${activeFilter === null ? "bg-[#0B1C3F] text-white" : "text-[#0B1C3F] border-[#0B1C3F]"}`}
            onClick={() => setActiveFilter(null)}
          >
            All Products
          </Button>
          {products.map((product) => (
            <Button
              key={`filter-${product.slug}`}
              variant={activeFilter === product.slug ? "default" : "outline"}
              className={`${activeFilter === product.slug ? "bg-[#0B1C3F] text-white" : "text-[#0B1C3F] border-[#0B1C3F]"}`}
              onClick={() => setActiveFilter(product.slug)}
            >
              {product.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
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
                <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0B1C3F]">
                      {product.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#546E7A] mb-4">
                      {product.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-[#0B1C3F] font-medium cursor-help">
                        <Info className="h-4 w-4 mr-1" />
                        <span>Specifications</span>
                      </div>

                      <div className="text-[#F5A623] font-medium cursor-help">
                        MOQ: Available on request
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      className="text-[#F5A623] hover:text-[#F5A623] hover:bg-[#F5A623]/10 p-0 transition-all duration-300 hover:translate-x-1"
                      onClick={() => {
                        console.log(
                          `Would navigate to: /products/${product.slug}`,
                        );
                        // In a real app, you would use router navigation here
                      }}
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-[#0B1C3F] text-[#0B1C3F] hover:bg-[#0B1C3F] hover:text-white transition-all duration-300 hover:shadow-md"
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
