import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();

    if (path === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (path === "/products") {
      if (location.pathname === "/") {
        const productsSection = document.getElementById("products-section");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/products");
      }
    } else if (path === "/trading-process" && location.pathname === "/") {
      const processSection = document.getElementById("process-section");
      if (processSection) {
        processSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path === "/compliance" && location.pathname === "/") {
      const complianceSection = document.getElementById("compliance-section");
      if (complianceSection) {
        complianceSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path === "/contact" && location.pathname === "/") {
      const contactSection = document.getElementById("rfq-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        "w-full bg-simba-navy text-white py-0 px-6 fixed top-0 left-0 z-50",
        className,
      )}
    >
      <div className="container mx-auto flex justify-between items-stretch">
        {/* Logo */}
        <div className="flex items-stretch py-0">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center"
            onClick={(e) => handleNavigation(e as any, "/")}
          >
            <img
              src="/logo.png"
              alt="Simba Ventura Logo"
              className="h-32 w-auto max-w-[400px] object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            onClick={(e) => handleNavigation(e, "/")}
            className="hover:text-simba-gold transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={(e) => handleNavigation(e, "/about")}
            className="hover:text-simba-gold transition-colors"
          >
            About Us
          </Link>
          <div className="relative group">
            <Link
              to="/products"
              onClick={(e) => handleNavigation(e, "/products")}
              className="hover:text-simba-gold transition-colors"
            >
              Products & Services
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-white text-[#546E7A] rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
              <Link
                to="/products/petroleum"
                onClick={(e) => handleNavigation(e, "/products/petroleum")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Petroleum
              </Link>
              <Link
                to="/products/coal"
                onClick={(e) => handleNavigation(e, "/products/coal")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Coal
              </Link>
              <Link
                to="/products/minerals"
                onClick={(e) => handleNavigation(e, "/products/minerals")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Minerals
              </Link>
              <Link
                to="/products/foodstuffs"
                onClick={(e) => handleNavigation(e, "/products/foodstuffs")}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Foodstuffs
              </Link>
            </div>
          </div>
          <Link
            to="/trading-process"
            onClick={(e) => handleNavigation(e, "/trading-process")}
            className="hover:text-simba-gold transition-colors"
          >
            Trading Process
          </Link>
          <Link
            to="/compliance"
            onClick={(e) => handleNavigation(e, "/compliance")}
            className="hover:text-simba-gold transition-colors"
          >
            Compliance
          </Link>
          <Link
            to="/contact"
            onClick={(e) => handleNavigation(e, "/contact")}
            className="hover:text-simba-gold transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/admin"
            onClick={(e) => handleNavigation(e, "/admin")}
            className="hover:text-simba-gold transition-colors"
          >
            Admin
          </Link>
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-simba-navy absolute top-16 left-0 w-full py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              onClick={(e) => handleNavigation(e, "/")}
              className="hover:text-simba-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={(e) => handleNavigation(e, "/about")}
              className="hover:text-simba-gold transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/products"
              onClick={(e) => handleNavigation(e, "/products")}
              className="hover:text-simba-gold transition-colors"
            >
              Products & Services
            </Link>
            <Link
              to="/trading-process"
              onClick={(e) => handleNavigation(e, "/trading-process")}
              className="hover:text-simba-gold transition-colors"
            >
              Trading Process
            </Link>
            <Link
              to="/compliance"
              onClick={(e) => handleNavigation(e, "/compliance")}
              className="hover:text-simba-gold transition-colors"
            >
              Compliance
            </Link>
            <Link
              to="/contact"
              onClick={(e) => handleNavigation(e, "/contact")}
              className="hover:text-simba-gold transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/admin"
              onClick={(e) => handleNavigation(e, "/admin")}
              className="hover:text-simba-gold transition-colors"
            >
              Admin
            </Link>
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
