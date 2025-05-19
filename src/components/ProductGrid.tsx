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
import ProductDetail from "./ProductDetail";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  specifications: { title: string; items: string[] }[];
  certifications: string[];
  documents: { name: string; type: string }[];
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
      specifications: [
        {
          title: "Product Range",
          items: [
            "Crude Oil (Various Grades)",
            "Diesel (EN590, D2)",
            "Jet Fuel (JP54, JetA1)",
            "Bitumen (60/70, 80/100)",
            "Base Oil (SN150, SN500)",
          ],
        },
        {
          title: "Quality Standards",
          items: [
            "ISO 8217 Specifications",
            "ASTM International Standards",
            "EN Standards Compliance",
            "API Quality Certifications",
          ],
        },
      ],
      certifications: [
        "ISO 9001:2015",
        "API Certification",
        "REACH Compliance",
        "Environmental Standards Compliance",
      ],
      documents: [
        { name: "Product Specifications Sheet", type: "PDF" },
        { name: "Safety Data Sheet (SDS)", type: "PDF" },
        { name: "Quality Certificates", type: "PDF" },
      ],
    },
    {
      id: "2",
      title: "Minerals",
      description:
        "Essential minerals and ores for construction, manufacturing, and technological applications.",
      image: "/coal.jpg",
      slug: "minerals",
      specifications: [
        {
          title: "Available Minerals",
          items: [
            "Iron Ore (High Grade)",
            "Coal (Various Grades)",
            "Copper Ore",
            "Zinc Ore",
            "Precious Metals",
          ],
        },
        {
          title: "Quality Parameters",
          items: [
            "Certified Purity Levels",
            "Size Specifications",
            "Chemical Composition",
            "Physical Properties",
          ],
        },
      ],
      certifications: [
        "ISO 9001:2015",
        "Mining Safety Certification",
        "Environmental Compliance",
        "Quality Assurance Certificate",
      ],
      documents: [
        { name: "Mineral Analysis Report", type: "PDF" },
        { name: "Technical Specifications", type: "PDF" },
        { name: "Handling Guidelines", type: "PDF" },
      ],
    },
    {
      id: "3",
      title: "Agricultural Products",
      description:
        "Premium grains, pulses, and agricultural commodities sourced from trusted global suppliers.",
      image: "/images/Agri.jpg",
      slug: "agricultural-products",
      specifications: [
        {
          title: "Product Categories",
          items: [
            "Grains (Wheat, Rice, Corn)",
            "Pulses (Various Types)",
            "Oilseeds",
            "Animal Feed",
            "Organic Products",
          ],
        },
        {
          title: "Quality Standards",
          items: [
            "HACCP Certified",
            "Food Grade Certification",
            "Organic Certification",
            "Non-GMO Verification",
          ],
        },
      ],
      certifications: [
        "HACCP Certification",
        "ISO 22000:2018",
        "Organic Certification",
        "Food Safety System Certification",
      ],
      documents: [
        { name: "Product Quality Report", type: "PDF" },
        { name: "Organic Certificates", type: "PDF" },
        { name: "Storage Guidelines", type: "PDF" },
      ],
    },
  ],
  title = "Our Products & Services",
  description = "Explore our comprehensive range of high-quality commodities sourced from trusted global suppliers.",
}: ProductGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  if (selectedProduct) {
    const product = products.find((p) => p.slug === selectedProduct);
    if (product) {
      return (
        <ProductDetail
          product={product}
          onBack={() => setSelectedProduct(null)}
        />
      );
    }
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

        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            className={`${
              activeFilter === null
                ? "bg-simba-navy text-white"
                : "text-simba-navy border-simba-navy"
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All Products
          </Button>
          {products.map((product) => (
            <Button
              key={`filter-${product.slug}`}
              variant={activeFilter === product.slug ? "default" : "outline"}
              className={`${
                activeFilter === product.slug
                  ? "bg-simba-navy text-white"
                  : "text-simba-navy border-simba-navy"
              }`}
              onClick={() => setActiveFilter(product.slug)}
            >
              {product.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card className="overflow-hidden border border-simba-sand hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="bg-white">
                    <CardTitle className="text-xl text-simba-navy">
                      {product.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <CardDescription className="text-[#546E7A] mb-4">
                      {product.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-simba-navy font-medium cursor-help">
                        <Info className="h-4 w-4 mr-1" />
                        <span>Specifications</span>
                      </div>

                      <div className="text-simba-gold font-medium cursor-help">
                        MOQ: Available on request
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center bg-white">
                    <Button
                      variant="ghost"
                      className="text-simba-gold hover:text-simba-gold hover:bg-simba-gold/10 p-0 transition-all duration-300 hover:translate-x-1"
                      onClick={() => setSelectedProduct(product.slug)}
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
