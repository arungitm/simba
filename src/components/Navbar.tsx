import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();
    console.log(`Navigating to: ${path}`);

    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (path === "/products") {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path === "/trading-process") {
      const processSection = document.getElementById("process-section");
      if (processSection) {
        processSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path === "/compliance") {
      const complianceSection = document.getElementById("compliance-section");
      if (complianceSection) {
        complianceSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path === "/contact") {
      const contactSection = document.getElementById("rfq-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={cn(
        "w-full bg-simba-navy text-white py-4 px-6 fixed top-0 left-0 z-50",
        className,
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={(e) => handleNavigation(e, "/")}
            className="text-2xl font-bold flex items-center"
          >
            <img
              src="/simba-logo.jpg"
              alt="Simba Ventura Logo"
              className="h-12 mr-2"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            onClick={(e) => handleNavigation(e, "/")}
            className="hover:text-simba-gold transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            onClick={(e) => handleNavigation(e, "/about")}
            className="hover:text-simba-gold transition-colors"
          >
            About Us
          </a>
          <div className="relative group">
            <a
              href="/products"
              onClick={(e) => handleNavigation(e, "/products")}
              className="hover:text-simba-gold transition-colors"
            >
              Products & Services
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white text-[#546E7A] rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
              <a
                href="/products/petroleum"
                onClick={(e) => handleNavigation(e, "/products/petroleum")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Petroleum
              </a>
              <a
                href="/products/coal"
                onClick={(e) => handleNavigation(e, "/products/coal")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Coal
              </a>
              <a
                href="/products/minerals"
                onClick={(e) => handleNavigation(e, "/products/minerals")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Minerals
              </a>
              <a
                href="/products/foodstuffs"
                onClick={(e) => handleNavigation(e, "/products/foodstuffs")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Foodstuffs
              </a>
            </div>
          </div>
          <a
            href="/trading-process"
            onClick={(e) => handleNavigation(e, "/trading-process")}
            className="hover:text-simba-gold transition-colors"
          >
            Trading Process
          </a>
          <a
            href="/compliance"
            onClick={(e) => handleNavigation(e, "/compliance")}
            className="hover:text-simba-gold transition-colors"
          >
            Compliance
          </a>
          <a
            href="/contact"
            onClick={(e) => handleNavigation(e, "/contact")}
            className="hover:text-simba-gold transition-colors"
          >
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button
            className="bg-simba-gold hover:bg-simba-darkgold text-white"
            onClick={() => {
              const rfqSection = document.getElementById("rfq-section");
              if (rfqSection) {
                rfqSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Request Quote
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-simba-navy absolute top-16 left-0 w-full py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a
              href="/"
              onClick={(e) => handleNavigation(e, "/")}
              className="hover:text-simba-gold transition-colors"
            >
              Home
            </a>
            <a
              href="/about"
              onClick={(e) => handleNavigation(e, "/about")}
              className="hover:text-simba-gold transition-colors"
            >
              About Us
            </a>
            <a
              href="/products"
              onClick={(e) => handleNavigation(e, "/products")}
              className="hover:text-simba-gold transition-colors"
            >
              Products & Services
            </a>
            <a
              href="/trading-process"
              onClick={(e) => handleNavigation(e, "/trading-process")}
              className="hover:text-simba-gold transition-colors"
            >
              Trading Process
            </a>
            <a
              href="/compliance"
              onClick={(e) => handleNavigation(e, "/compliance")}
              className="hover:text-simba-gold transition-colors"
            >
              Compliance
            </a>
            <a
              href="/contact"
              onClick={(e) => handleNavigation(e, "/contact")}
              className="hover:text-simba-gold transition-colors"
            >
              Contact
            </a>
            <Button
              className="bg-simba-gold hover:bg-simba-darkgold text-white w-full"
              onClick={() => {
                const rfqSection = document.getElementById("rfq-section");
                if (rfqSection) {
                  rfqSection.scrollIntoView({ behavior: "smooth" });
                  setIsMenuOpen(false);
                }
              }}
            >
              Request Quote
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
