import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface CookieConsentProps {
  className?: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    // In a real app, you might want to set a different flag
    // to remember that the user declined cookies
    localStorage.setItem("cookiesDeclined", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200 ${className}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 pr-4">
                <h3 className="text-lg font-semibold text-[#0B1C3F] mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-[#546E7A] text-sm">
                  We use cookies to enhance your browsing experience, serve
                  personalized ads or content, and analyze our traffic. By
                  clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-[#0B1C3F] text-[#0B1C3F] hover:bg-[#0B1C3F] hover:text-white"
                  onClick={declineCookies}
                >
                  Decline
                </Button>
                <Button
                  className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-white"
                  onClick={acceptCookies}
                >
                  Accept All
                </Button>
                <button
                  className="text-gray-500 hover:text-gray-700 md:hidden"
                  onClick={() => setIsVisible(false)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
