import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling for instant jump
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // Restore original scrolling behavior
    document.documentElement.style.scrollBehavior = originalScrollBehavior;
  }, [pathname]);

  return null;
}
