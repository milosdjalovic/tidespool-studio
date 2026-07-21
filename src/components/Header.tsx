"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "border-b border-line bg-surface/95 shadow-sm backdrop-blur-md"
            : "bg-gradient-to-b from-background-dark/80 to-transparent"
        }`}
      >
        <div className="section-pad flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link
            href="/"
            className={`text-sm font-semibold uppercase tracking-[0.22em] transition ${
              solid ? "text-foreground" : "text-foreground-light"
            }`}
          >
            TideSpool Studios
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm transition ${
                  solid
                    ? "text-muted hover:text-foreground"
                    : "text-foreground-light/75 hover:text-foreground-light"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className={solid ? "btn-primary px-5 py-2.5 text-xs" : "btn-primary-light px-5 py-2.5 text-xs"}
            >
              Get in touch
            </a>
          </nav>

          <button
            type="button"
            className={`text-sm font-medium lg:hidden ${
              solid ? "text-foreground" : "text-foreground-light"
            }`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-surface lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="section-pad flex h-16 items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.22em]">Menu</span>
              <button
                type="button"
                className="text-sm text-muted"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="section-pad mt-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-2xl font-semibold text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary mt-4 w-fit"
                onClick={() => setMenuOpen(false)}
              >
                Get in touch
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
