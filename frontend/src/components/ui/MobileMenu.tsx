"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { href: "/servicios", label: "Servicios" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden text-text-primary p-2"
        aria-label="Menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-surface-800 border-l border-surface-600/50 p-6 animate-fade-in">
            <div className="flex justify-end mb-8">
              <button onClick={() => setOpen(false)} className="text-text-primary p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-lg transition-colors duration-300 ${
                    pathname === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg text-success hover:bg-success/10 transition-colors duration-300"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
