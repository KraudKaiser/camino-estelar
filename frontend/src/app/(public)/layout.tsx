"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import MobileMenu from "@/components/ui/MobileMenu";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { NAV_LINKS, WHATSAPP_PHONE } from "@/lib/constants";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface-900">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface-900/95 backdrop-blur-md border-b border-surface-600/30 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="font-display text-xl sm:text-2xl font-bold text-accent">
              Camino Estelar
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-success hover:text-success/80 transition-colors duration-300"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </nav>

            <MobileMenu />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-surface-950 border-t border-surface-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-xl font-bold text-accent mb-4">
                Camino Estelar
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Guia espiritual, bienestar interior y crecimiento personal.
                Transforma tu vida con orientacion profesional.
              </p>
            </div>
            <div>
              <h4 className="text-text-primary font-semibold mb-4">Navegacion</h4>
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-text-secondary hover:text-text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="text-text-primary font-semibold mb-4">Contacto</h4>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-secondary hover:text-success text-sm transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-surface-600/30 pt-6 text-center">
            <p className="text-text-muted text-sm">
              &copy; {new Date().getFullYear()} Camino Estelar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
