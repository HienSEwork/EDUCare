import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SECTION_SELECTOR = "main section:not([data-no-reveal])";

export default function SectionRevealManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const registered = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("section-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "160px 0px", threshold: 0.04 },
    );

    const register = (root: ParentNode) => {
      const sections = root instanceof Element && root.matches(SECTION_SELECTOR)
        ? [root, ...root.querySelectorAll<HTMLElement>(SECTION_SELECTOR)]
        : [...root.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];

      sections.forEach((section) => {
        if (registered.has(section)) return;
        registered.add(section);
        section.classList.add("section-lazy-reveal");
        observer.observe(section);
      });
    };

    const main = document.querySelector("main");
    if (!main) return;

    register(main);
    const mutationObserver = new MutationObserver((mutations) => {
      requestAnimationFrame(() => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) register(node);
          });
        });
      });
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}
