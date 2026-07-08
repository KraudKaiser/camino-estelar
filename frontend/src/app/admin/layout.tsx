"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, Tag, ShoppingCart, Package, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { API_URL } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/servicios", label: "Servicios", icon: Package },
  { href: "/admin/cupones", label: "Cupones", icon: Tag },
  { href: "/admin/compras", label: "Compras", icon: ShoppingCart },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/admin/me`, { credentials: "include" })
      .then((res) => {
        if (res.ok) setAuthenticated(true);
        else router.push("/admin/login");
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router, isLoginPage, pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-800 border-r border-surface-600/50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-surface-600/50">
          <Link href="/admin" className="font-display text-lg font-bold text-accent">
            Camino Estelar
          </Link>
          <p className="text-text-muted text-xs mt-1">Panel de Administracion</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-700"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-600/50 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-all duration-300"
          >
            <ExternalLink size={18} />
            Ver Sitio
          </a>
          <button
            onClick={async () => {
              await fetch(`${API_URL}/api/admin/logout`, {
                method: "POST",
                credentials: "include",
              });
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-300 w-full"
          >
            <LogOut size={18} />
            Cerrar Sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 p-4 border-b border-surface-600/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-primary p-2"
          >
            <Menu size={24} />
          </button>
          <span className="font-display text-lg font-bold text-accent">
            Admin
          </span>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
