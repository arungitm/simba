import React from "react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-simba-navy mb-4">Our Products & Services</h1>
            <p className="text-[#546E7A] max-w-3xl mx-auto">
              Explore our comprehensive range of high-quality commodities and trading services. We specialize in petroleum products, coal, minerals, and foodstuffs.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-simba-navy mb-6">Petroleum Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Crude Oil",
                  description: "High-quality crude oil from various sources",
                  image: "https://images.unsplash.com/photo-1589164288012-89e11f39aa01?w=800&q=80"
                },
                {
                  title: "Diesel",
                  description: "Ultra-low sulfur diesel fuel",
                  image: "https://images.unsplash.com/photo-1582898967731-b5834427fd66?w=800&q=80"
                },
                {
                  title: "Gasoline",
                  description: "Premium and regular gasoline",
                  image: "https://images.unsplash.com/photo-1560005262-823d9a06c851?w=800&q=80"
                }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-[#546E7A] mb-4">{product.description}</p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-simba-navy mb-6">Coal & Minerals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Thermal Coal",
                  description: "High-quality thermal coal for power generation",
                  image: "https://images.unsplash.com/photo-1587613991179-fea892e7d81b?w=800&q=80"
                },
                {
                  title: "Iron Ore",
                  description: "Premium grade iron ore",
                  image: "https://images.unsplash.com/photo-1590581012367-c45fe6c3cf2c?w=800&q=80"
                },
                {
                  title: "Precious Metals",
                  description: "Gold, silver, and other precious metals",
                  image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80"
                }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-[#546E7A] mb-4">{product.description}</p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-simba-navy mb-6">Foodstuffs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Grains",
                  description: "Premium quality wheat, rice, and other grains",
                  image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"
                },
                {
                  title: "Edible Oils",
                  description: "Various types of cooking and edible oils",
                  image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"
                },
                {
                  title: "Sugar",
                  description: "Refined and raw sugar products",
                  image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&q=80"
                }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-[#546E7A] mb-4">{product.description}</p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 