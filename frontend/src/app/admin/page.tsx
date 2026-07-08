"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, DollarSign, Clock, ArrowRight } from "lucide-react";
import { API_URL } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

interface Stats {
  totalServices: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingPayments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/admin/services`, { credentials: "include" }).then((res) => res.json()),
      fetch(`${API_URL}/api/admin/purchases`, { credentials: "include" }).then((res) => res.json()),
    ])
      .then(([servicesData, purchasesData]) => {
        const purchases = purchasesData.purchases || [];
        setStats({
          totalServices: servicesData.services?.length || 0,
          totalPurchases: purchases.length,
          totalRevenue: purchases
            .filter((p: any) => p.paymentStatus === "COMPLETED")
            .reduce((sum: number, p: any) => sum + Number(p.finalPrice), 0),
          pendingPayments: purchases.filter((p: any) => p.paymentStatus === "PENDING").length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { label: "Servicios", value: stats.totalServices, icon: Package, color: "text-accent" },
    { label: "Compras", value: stats.totalPurchases, icon: ShoppingCart, color: "text-surface-500" },
    { label: "Ingresos", value: `$${stats.totalRevenue.toLocaleString("es-AR")}`, icon: DollarSign, color: "text-success" },
    { label: "Pendientes", value: stats.pendingPayments, icon: Clock, color: "text-accent-dark" },
  ];

  const quickLinks = [
    { href: "/admin/servicios", label: "Gestionar Servicios", desc: "Crear, editar o eliminar servicios" },
    { href: "/admin/cupones", label: "Gestionar Cupones", desc: "Crear y administrar descuentos" },
    { href: "/admin/compras", label: "Ver Compras", desc: "Revisar historial de compras" },
    { href: "/admin/configuracion", label: "Configuracion", desc: "Ajustes del sitio y WhatsApp" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card-dark p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-700 rounded-xl flex items-center justify-center">
                <stat.icon className={stat.color} size={20} />
              </div>
            </div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
        Accesos Rapidos
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <div className="card-dark p-5 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors">
                  {link.label}
                </h3>
                <p className="text-text-muted text-sm mt-0.5">{link.desc}</p>
              </div>
              <ArrowRight className="text-text-muted group-hover:text-accent transition-colors" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
