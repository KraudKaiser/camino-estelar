"use client";

import { useEffect, useState } from "react";
import { Purchase } from "@/lib/types";
import { API_URL } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPurchases(); }, []);

  const fetchPurchases = async () => {
    const res = await fetch(`${API_URL}/api/admin/purchases`, { credentials: "include" });
    const data = await res.json();
    setPurchases(data.purchases || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API_URL}/api/admin/purchases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ paymentStatus: status }),
    });
    fetchPurchases();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  const paymentMethodLabels: Record<string, string> = {
    MERCADOPAGO: "MercadoPago",
    BANK_TRANSFER: "Transferencia",
    WHATSAPP_ONLY: "WhatsApp",
  };

  const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
    PENDING: { label: "Pendiente", variant: "warning" },
    COMPLETED: { label: "Completada", variant: "success" },
    FAILED: { label: "Fallida", variant: "error" },
    CANCELLED: { label: "Cancelada", variant: "default" },
  };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8">Compras</h1>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-600/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Servicio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Monto</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Pago</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/30">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4 text-text-secondary text-sm">
                    {new Date(purchase.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-text-primary font-medium text-sm">{purchase.customerName}</div>
                    <div className="text-text-muted text-xs">{purchase.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary text-sm">{purchase.service?.name}</td>
                  <td className="px-5 py-4 text-accent font-semibold text-sm">
                    ${Number(purchase.finalPrice).toLocaleString("es-AR")}
                  </td>
                  <td className="px-5 py-4 text-text-secondary text-sm">
                    {paymentMethodLabels[purchase.paymentMethod] || purchase.paymentMethod}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusConfig[purchase.paymentStatus]?.variant || "default"}>
                      {statusConfig[purchase.paymentStatus]?.label || purchase.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {purchase.paymentStatus === "PENDING" && (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => updateStatus(purchase.id, "COMPLETED")} className="text-success hover:text-success/80 text-sm font-medium transition-colors">
                          Aprobar
                        </button>
                        <button onClick={() => updateStatus(purchase.id, "CANCELLED")} className="text-error hover:text-error/80 text-sm font-medium transition-colors">
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {purchases.length === 0 && (
          <div className="text-center py-12 text-text-muted">No hay compras registradas</div>
        )}
      </div>
    </div>
  );
}
