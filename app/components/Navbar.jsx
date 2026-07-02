"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "#hero", icon: "⌂" },
  { label: "About", href: "#about", icon: "◉" },
  { label: "Journey", href: "#journey", icon: "◈" },
  { label: "Projects", href: "#projects", icon: "◆" },
  { label: "Skills", href: "#skills", icon: "⬡" },
  { label: "Contact", href: "#contact", icon: "✦" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navRef = useRef(null);

  // Delay navbar appearance for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver to track which section is active
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      // Use Lenis for smooth scrolling if available
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { 
          offset: 0, 
          duration: 1.8, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Buttery smooth easing
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          ref={navRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1,
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="nav-dock rounded-full px-2 py-2 flex items-center gap-1">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.href.replace("#", "");
              const isHovered = hoveredIndex === index;

              // Calculate scale for dock magnification effect
              let scale = 1;
              if (hoveredIndex !== null) {
                const distance = Math.abs(index - hoveredIndex);
                if (distance === 0) scale = 1.25;
                else if (distance === 1) scale = 1.1;
                else scale = 1;
              }

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{ scale }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`
                    relative flex items-center justify-center
                    rounded-full transition-colors duration-300 cursor-pointer
                    ${isActive
                      ? "bg-accent/15 text-accent"
                      : "text-secondary hover:text-foreground"
                    }
                  `}
                  style={{ width: 48, height: 48 }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute -top-1 w-1 h-1 rounded-full bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span className="text-lg select-none" aria-hidden="true">
                    {item.icon}
                  </span>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-10 px-3 py-1.5 rounded-lg
                          bg-card border border-border text-xs font-medium
                          text-foreground whitespace-nowrap pointer-events-none"
                        style={{ fontSize: "11px", letterSpacing: "0.05em" }}
                      >
                        {item.label}
                        {/* Tooltip arrow */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2
                            bg-card border-r border-b border-border rotate-45"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.a>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
