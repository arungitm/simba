import React from "react";
import { motion, useScroll } from "framer-motion";
import Navbar from "./Navbar";
import ProductGrid from "./ProductGrid";
import TradingProcess from "./TradingProcess";
import RFQForm from "./RFQForm";
import Testimonials from "./Testimonials";
import CookieConsent from "./CookieConsent";
import FAQ from "./FAQ";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Globe,
  Shield,
  ArrowUp,
  MapPin,
} from "lucide-react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { isVisible, scrollToTop } = useScrollToTop({
    requireUserGesture: true,
  });
  const { scrollY } = useScroll();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[600px] bg-simba-navy overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            y: scrollY.get() * 0.3,
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80"
            alt="Oil rig at sunset"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-simba-gold">
            Simba Ventura FZE
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Global Commodities, HFZ Advantage
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Trusted commodity trading across the Middle East and Africa with
              Hamriyah Free Zone excellence.
            </p>
            <Button
              size="lg"
              className="bg-simba-gold hover:bg-simba-darkgold text-white font-medium px-8 py-6 text-lg"
              onClick={() => {
                const rfqSection = document.getElementById("rfq-section");
                rfqSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Request Quote <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Shield className="text-simba-navy h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">HFZ Licensed</h3>
                <p className="text-[#546E7A]">
                  Fully compliant with Hamriyah Free Zone regulations
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Globe className="text-simba-navy h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                <p className="text-[#546E7A]">
                  Serving clients across MEA with reliable supply chains
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="text-simba-navy h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
                <p className="text-[#546E7A]">
                  Rigorous standards for all commodities and products
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Award className="text-simba-navy h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Certified Partner
                </h3>
                <p className="text-[#546E7A]">
                  ISO certified with international banking partners
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Products Section */}
      <section id="products-section" className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid
            title="Products & Services"
            description="Explore our comprehensive range of commodities and trading services tailored to your industry needs."
          />
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-simba-navy text-simba-navy hover:bg-simba-navy hover:text-white"
              onClick={() => navigate("/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
      {/* Trading Process Section */}
      <section id="process-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Trading Process</h2>
            <p className="text-[#546E7A] max-w-2xl mx-auto">
              A streamlined approach to commodity trading, from initial inquiry
              to final delivery.
            </p>
          </div>
          <TradingProcess />
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-simba-navy text-simba-navy hover:bg-simba-navy hover:text-white mr-4"
              onClick={() => {
                console.log("Would download PDF");
                // In a real app, this would trigger a download
              }}
            >
              Download Process PDF
            </Button>
            <Button
              className="bg-simba-gold hover:bg-simba-darkgold text-white"
              onClick={() => {
                const rfqSection = document.getElementById("rfq-section");
                rfqSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start Trading Now
            </Button>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-simba-navy mb-4"
            >
              Global Operations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-[#546E7A] max-w-3xl mx-auto"
            >
              Our strategic presence across key markets enables efficient
              commodity trading worldwide
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-lg overflow-hidden shadow-lg h-[400px] bg-white"
          >
            <img
              src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=1200&q=80"
              alt="World Map"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0">
              {/* UAE */}
              <div className="absolute top-[42%] left-[62%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-10 w-10 text-simba-gold" />
                  <div
                    className="absolute top-0 left-0 h-10 w-10 bg-simba-gold rounded-full animate-ping opacity-75"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
                <div className="mt-2 bg-white p-2 rounded shadow-md">
                  <p className="text-xs font-bold">UAE (HQ)</p>
                  <p className="text-xs">Sharjah, HFZ</p>
                </div>
              </div>

              {/* India */}
              <div className="absolute top-[45%] left-[70%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-simba-navy" />
                  <div
                    className="absolute top-0 left-0 h-8 w-8 bg-simba-navy rounded-full animate-ping opacity-75"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
                <div className="mt-2 bg-white p-2 rounded shadow-md">
                  <p className="text-xs font-bold">India</p>
                  <p className="text-xs">Mumbai</p>
                </div>
              </div>

              {/* Singapore */}
              <div className="absolute top-[52%] left-[78%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-simba-navy" />
                  <div
                    className="absolute top-0 left-0 h-8 w-8 bg-simba-navy rounded-full animate-ping opacity-75"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
                <div className="mt-2 bg-white p-2 rounded shadow-md">
                  <p className="text-xs font-bold">Singapore</p>
                  <p className="text-xs">Singapore</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Badge className="bg-simba-navy text-white">Middle East</Badge>
            <Badge className="bg-simba-navy text-white">South Asia</Badge>
            <Badge className="bg-simba-navy text-white">Southeast Asia</Badge>
            <Badge className="bg-simba-gold text-white">
              20+ Countries Served
            </Badge>
          </div>
        </div>
      </section>
      {/* Compliance Section */}
      <section id="compliance-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-4">
                Compliance & Certification
              </h2>
              <p className="text-[#546E7A] mb-6">
                At Simba Ventura FZE, we maintain the highest standards of
                compliance and certification to ensure smooth, legal, and
                ethical trading operations.
              </p>
              <ul className="space-y-3">
                <motion.li
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-simba-gold mr-3 h-5 w-5" />
                  <span>Hamriyah Free Zone Authority License</span>
                </motion.li>
                <motion.li
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-simba-gold mr-3 h-5 w-5" />
                  <span>ISO 9001:2015 Quality Management</span>
                </motion.li>
                <motion.li
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-simba-gold mr-3 h-5 w-5" />
                  <span>International Banking Partners</span>
                </motion.li>
                <motion.li
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-simba-gold mr-3 h-5 w-5" />
                  <span>Food Safety Certifications</span>
                </motion.li>
              </ul>
              <Button
                className="mt-6 bg-simba-navy hover:bg-simba-darknavy text-white"
                onClick={() => {
                  console.log("Would navigate to certificates page");
                }}
              >
                View All Certificates
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Oil and gas industry compliance"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-simba-navy to-transparent p-6">
                  <div className="flex items-center">
                    <img
                      src="/simba-logo.jpg"
                      alt="Simba Ventura Logo"
                      className="w-12 h-12 rounded-full bg-white p-1 mr-4"
                    />
                    <div>
                      <p className="text-white font-medium">
                        Hamriyah Free Zone
                      </p>
                      <p className="text-white/70 text-sm">Certified Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* RFQ Section */}
      <section id="rfq-section" className="py-16 bg-simba-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Request a Quote
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Fill out the form below to receive a customized quote for your
              commodity needs.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
            <RFQForm />
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-simba-navy text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Simba Ventura FZE</h3>
              <p className="text-white/70 mb-4">
                Global commodities trading with Hamriyah Free Zone excellence.
              </p>
              <p className="text-white/70">HFZ License: #38865</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-white/70">
                <li>Petroleum</li>
                <li>Coal</li>
                <li>Minerals</li>
                <li>Foodstuffs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li>About Us</li>
                <li>Trading Process</li>
                <li>Compliance</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <address className="not-italic text-white/70">
                <p>Hamriyah Free Zone</p>
                <p>Sharjah, United Arab Emirates</p>
                <p className="mt-2">Email: info@simbaventura.com</p>
                <p>Tel: +971526944179</p>
              </address>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>
              © {new Date().getFullYear()} Simba Ventura FZE. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Cookie Consent Banner */}
      <CookieConsent />
      {/* SEO Metadata - This would normally go in the head */}
      {/* This is just to show what would be included */}
      <div style={{ display: "none" }} aria-hidden="true">
        <div itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="Simba Ventura FZE" />
          <meta
            itemProp="description"
            content="Global commodities trading with Hamriyah Free Zone excellence."
          />
          <meta itemProp="image" content="/simba-logo.jpg" />
          <div
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <meta itemProp="addressLocality" content="Sharjah" />
            <meta itemProp="addressRegion" content="Hamriyah Free Zone" />
            <meta itemProp="addressCountry" content="United Arab Emirates" />
          </div>
        </div>
      </div>
      {/* Back to Top Button */}
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 bg-simba-gold hover:bg-simba-darkgold text-white p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};

export default Home;
