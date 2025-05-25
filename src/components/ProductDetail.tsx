import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowLeft, Download, FileText, CheckCircle } from "lucide-react";

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    description: string;
    image: string;
    specifications?: {
      title: string;
      items: string[];
    }[];
    certifications?: string[];
    documents?: {
      name: string;
      type: string;
      url: string; // Added URL for download link
    }[];
  };
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  return (
    <div className="min-h-screen bg-simba-lightsand/20">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {product.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-8 text-simba-navy hover:text-simba-gold"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg text-gray-700 mb-8">{product.description}</p>

                {product.specifications?.map((spec, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-xl font-semibold text-simba-navy mb-4">
                      {spec.title}
                    </h3>
                    <ul className="space-y-2">
                      {spec.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-simba-gold mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-simba-navy mb-4">
                Product Information
              </h3>

              {/* Certifications */}
              {product.certifications && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Certifications
                  </h4>
                  <ul className="space-y-2">
                    {product.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-simba-gold mr-2" />
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents */}
              {product.documents && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Documentation
                  </h4>
                  <ul className="space-y-2">
                    {product.documents.map((doc, index) => (
                      <li key={index}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={doc.name}
                          className="no-underline"
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left text-simba-navy hover:bg-simba-sand/50"
                          >
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate flex-grow">{doc.name} ({doc.type.toUpperCase()})</span>
                            <Download className="h-4 w-4 ml-2 flex-shrink-0" />
                          </Button>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <Button
                className="w-full bg-simba-gold hover:bg-simba-darkgold text-white"
                onClick={() => {
                  const rfqSection = document.getElementById("rfq-section");
                  rfqSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 