import { useState, useEffect } from "react";

interface UseScrollToTopOptions {
  threshold?: number;
  smoothScroll?: boolean;
  requireUserGesture?: boolean;
}

function useScrollToTop({
  threshold = 300,
  smoothScroll = true,
  requireUserGesture = false,
}: UseScrollToTopOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    // Only execute if not requiring user gesture or if being called from a user event handler
    if (!requireUserGesture || document.hasFocus()) {
      if (smoothScroll) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  return { isVisible, scrollToTop };
}

export default useScrollToTop;
